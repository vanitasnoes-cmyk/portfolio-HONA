// Copyright 2021 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//import {parse} from 'bcp-47'

// HTTP router used for receiving messages from users and sending responses.
const express = require("express");
const router = express.Router();
const util = require("util");

const { google } = require("googleapis");
const businessmessages = require("businessmessages");
const { v4: uuidv4 } = require("uuid");
const ISO6391 = require("iso-639-1");
const { Translate } = require("@google-cloud/translate").v2;
const bcp47 = require('bcp-47');

// Set the private key to the service account file
const privatekey = require("../resources/bm-agent-service-account-credentials.json");

// Initialize the Business Messages API
const bmApi = new businessmessages.businessmessages_v1.Businessmessages({});

// Set the scope that we need for the Business Messages API
const scopes = ["https://www.googleapis.com/auth/businessmessages"];

// Name of the brand
const BUSINESS_NAME = "Growing Tree Bank";
// The language used by the server, that is, the language in which the bot agent natively converses.
const SERVER_LANGUAGE = "en";
// The current language used for the conversation.
let currentLanguage = SERVER_LANGUAGE;
// Threshold of confidence needed from Cloud Translate API in order to use the language detection result.
const CONFIDENCE_THRESHOLD = 0.9;
// Postback data signaling the user wishes to change languages.
const SWITCH_LANGUAGE_POSTBACK = "SWITCH_LANGUAGE";

const translate = new Translate();

/**
 * The webhook callback method.
 */
router.post("/callback", function (req, res, next) {
  let requestBody = req.body;

  // Extract the message payload parameters
  let conversationId = requestBody.conversationId;
  let messageId = requestBody.requestId;
  let agentName = requestBody.agent;
  let brandId = agentName.substr(
    agentName.indexOf("brands/") + 7,
    agentName.indexOf("/agents") - 7
  );
  let displayName = requestBody.context.userInfo.displayName;
  let context = requestBody.context;

  // Log message parameters
  console.log("conversationId: " + conversationId);
  console.log("displayName: " + displayName);
  console.log("brandId: " + brandId);

  // Check that the message and text values exist
  if (
    requestBody.message !== undefined &&
    requestBody.message.text !== undefined
  ) {
    let incomingMessage = requestBody.message.text;

    detectLanguage(incomingMessage, context).then((detectedLanguage) => {
      if (detectedLanguage != currentLanguage) {
        translateText(
          "Which language would you like to use?",
          SERVER_LANGUAGE,
          currentLanguage
        ).then((normalizedTranslationNotice) => {
          sendResponse(
            normalizedTranslationNotice,
            conversationId,
            [
              ...new Set([detectedLanguage, currentLanguage, SERVER_LANGUAGE]),
            ].map((x) => createSuggestedReply(x))
          );
        });
      } else {
        translateText(incomingMessage, currentLanguage, SERVER_LANGUAGE).then(
          (normalizedMessage) => {
            let serverResponse = chooseResponseMessage(normalizedMessage);
            translateText(
              serverResponse,
              SERVER_LANGUAGE,
              currentLanguage
            ).then((normalizedResponse) => {
              sendResponse(normalizedResponse, conversationId, []);
            });
          }
        );
      }
    });
  } else if (requestBody.suggestionResponse !== undefined) {
    let postbackData = requestBody.suggestionResponse.postbackData;
    if (postbackData.startsWith(SWITCH_LANGUAGE_POSTBACK)) {
      let languageCode = postbackData.substr(SWITCH_LANGUAGE_POSTBACK.length);
      currentLanguage = languageCode;
      translateText(
        "The language was set to " +
          ISO6391.getName(languageCode) +
          ". Please repeat your request.",
        SERVER_LANGUAGE,
        languageCode
      ).then((translationNotice) => {
        sendResponse(translationNotice, conversationId, []);
      });
    }
  }

  res.sendStatus(200);
});

/**
 * Posts a message to the Business Messages API, first sending a typing
 * indicator event and sending a stop typing event after the message
 * has been sent.
 *
 * @param {string} message The message content to send to the user.
 * @param {string} conversationId The unique id for this user and agent.
 * @Param {Array} an array of SuggestedReplies.
 */
async function sendResponse(message, conversationId, suggestedReplies) {
  let messageId = uuidv4();

  let messageObject = {
    messageId: messageId,
    representative: getRepresentative("HUMAN"),
    text: message,
    containsRichText: true,
    fallback: message,
    suggestions: suggestedReplies,
  };

  let authClient = await initCredentials();

  // Create the payload for sending a typing started event
  let apiEventParams = {
    auth: authClient,
    parent: "conversations/" + conversationId,
    resource: {
      eventType: "TYPING_STARTED",
      representative: messageObject.representative,
    },
    eventId: uuidv4(),
  };

  // Send the typing started event
  bmApi.conversations.events.create(
    apiEventParams,
    { auth: authClient },
    (err, response) => {
      let apiParams = {
        auth: authClient,
        parent: "conversations/" + conversationId,
        resource: messageObject,
      };

      // Call the message create function using the
      // Business Messages client library
      bmApi.conversations.messages.create(
        apiParams,
        { auth: authClient },
        (err, response) => {
          // Update the event parameters
          apiEventParams.resource.eventType = "TYPING_STOPPED";
          apiEventParams.eventId = uuidv4();

          // Send the typing stopped event
          bmApi.conversations.events.create(
            apiEventParams,
            { auth: authClient },
            (err, response) => {}
          );
        }
      );
    }
  );
}

/**
 * Create a suggested reply for a language code.
 * @param {string} languageCode A ISO 6391 language code.
 * @returns {Suggestion} The suggestion object for switching to the language.
 */
function createSuggestedReply(languageCode) {
  return {
    reply: {
      text: ISO6391.getNativeName(languageCode),
      postbackData: SWITCH_LANGUAGE_POSTBACK + languageCode,
    },
  };
}

/**
 * Select a topically appropriate response based on the message
 * content that the user sent to the agent.
 *
 * @param {string} incomingMessage The content of the message that the user typed in.
 * @return {string} A response message.
 */
function chooseResponseMessage(incomingMessage) {
  let responseMapping = {
    balance: "Your current balance is $500.",
    deposit: "Please enter your deposit amount.",
    transfer:
      "Please enter the account number of where you wish to transfer the funds.",
    withdraw: "Please enter the amount you wish to withdraw.",
    help: "Please choose what you'd like to do: balance, deposit, transfer, or withdraw.",
  };

  for (const [key, value] of Object.entries(responseMapping)) {
    if (incomingMessage.toLowerCase().includes(key)) {
      return value;
    }
  }

  return "I didn't understand your request. Please try again.";
}

/**
 * Translates text to a given target language. No translation if source and
 * target language match.
 *
 * @param {string} text the text to translate
 * @param {string} sourceLanguage The language of the source text.
 * @param {string} targetLanguage The target language.
 * @returns A Promise with the translated text.
 */
async function translateText(text, sourceLanguage, targetLanguage) {
  if (sourceLanguage === targetLanguage) {
    return new Promise(function (resolve, reject) {
      resolve(text);
    });
  }
  return new Promise(function (resolve, reject) {
    translate
      .translate(text, targetLanguage)
      .then((result) => {
        if (result && result.length > 0) {
          resolve(result[0]);
        } else {
          reject("Could not translate message");
        }
      })
      .catch((err) => {
        console.error("ERROR:", err);
        reject(err);
      });
  });
}

/**
 * Detects input text language.
 *
 * @param {string} text The text received from the consumer.
 * @param {Context} context The user message request context.
 * @return A Promise with the detected language code.
 */
async function detectLanguage(text, context) {
  return new Promise(function (resolve, reject) {
    translate
      .detect(text)
      .then((result) => {
        if (result && result.length > 0) {
          if (result[0].confidence > CONFIDENCE_THRESHOLD) {
            resolve(result[0].language);
          }
          resolve(bcp47.parse(context.resolvedLocale).language);
        } else {
          reject("No language detected");
        }
      })
      .catch((err) => {
        console.error("ERROR:", err);
        reject(err);
      });
  });
}

/**
 * Returns a representative for the business.
 *
 * @param {string} representativeType The representative sending the message,
 * BOT or HUMAN.
 * @return The representative type object.
 */
function getRepresentative(representativeType) {
  return {
    representativeType: representativeType,
    displayName: BUSINESS_NAME,
  };
}

/**
 * Initializes the Google credentials for calling the
 * Business Messages API.
 * @return A Promise with an authentication object.
 */
async function initCredentials() {
  // configure a JWT auth client
  let authClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    scopes
  );

  return new Promise(function (resolve, reject) {
    // authenticate request
    authClient.authorize(function (err, tokens) {
      if (err) {
        console.log("err");
        console.log(
          util.inspect(err, { showHidden: false, depth: null, colors: true })
        );
        reject(false);
      } else {
        resolve(authClient);
      }
    });
  });
}

module.exports = router;
