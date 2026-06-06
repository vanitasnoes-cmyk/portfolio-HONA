# BUSINESS MESSAGES: Translation Tutorial

This is the complete source for a tutorial demonstrating how to integrate a Business Messages agent with Google Cloud Translate API. This sample demonstrates how to detect user language, prompt to change the conversation language, and translate both incoming and outgoing messages.

This sample relies on the [Business Messages Node.js client library](https://github.com/google-business-communications/nodejs-businessmessages) for sending messages to the Business Messages platform.

This sample runs on the Google App Engine.

See the Google App Engine (https://cloud.google.com/appengine/docs/nodejs/) standard environment documentation for more detailed instructions.

## Documentation

The documentation for the Business Messages API can be found [here](https://developers.google.com/business-communications/business-messages/reference/rest).

## Prerequisite

You must have the following software installed on your machine:

* [Google Cloud SDK](https://cloud.google.com/sdk/) (aka gcloud)
* [Node.js](https://nodejs.org/en/) - version 10 or above

## Before you begin

Register with Business Messages:

    1. Open [Google Cloud Console](https://console.cloud.google.com) with your
    Business Messages Google account and create a new project for your agent.

    Note the **Project ID** and **Project number** values.

    2. Open the
    [Business Communications API](https://console.developers.google.com/apis/library/businesscommunications.googleapis.com)
    in the API Library and click **Enable**.

    3. Open the
    [Business Messages API](https://console.developers.google.com/apis/library/businessmessages.googleapis.com)
    in the API Library and click **Enable**.

    4. [Register your project](https://developers.google.com/business-communications/business-messages/guides/set-up/register)
    with Business Messages.

    5. Create a service account.

        1. Navigate to [Credentials](https://console.cloud.google.com/apis/credentials).
    
        2. Click **Create service account**.
    
        3. For **Service account name**, enter your agent's name, then click **Create**.
    
        4. For **Select a role**, choose **Project** > **Editor**, the click **Continue**.
    
        5. Under **Create key**, choose **JSON**, then click **Create**.
    
           Your browser downloads the service account key. Store it in a secure location.

    6. Click **Done**.

    7. Copy the JSON credentials file into this sample's /resources folder and rename it
    to "bm-agent-service-account-credentials.json".

    8. Open the [Create an agent](https://developers.google.com/business-communications/business-messages/guides/set-up/agent)
    guide and follow the instructions to create a Business Messages agent.

## Deploy the sample

1.  In a terminal, navigate to this sample's root directory.

1.  Run the following commands:

    ```bash
    gcloud config set project PROJECT_ID
    ```

    Where PROJECT_ID is the project ID for the project you created when you registered for Business Messages.

    ```base
    gcloud app deploy
    ```

1.  On your mobile device, use the test business URL associated with the
    Business Messages agent you created. Open a conversation with your agent
    and type in "Hello". Once delivered, you should receive "Hello" back
    from the agent.

    Navigate to https://PROJECT_ID.appspot.com to view the list of conversation
    threads, join a conversation, and respond.

    See the [Test an agent](https://developers.google.com/business-communications/business-messages/guides/set-up/agent#test-agent) guide if you need help retrieving your test business URL.