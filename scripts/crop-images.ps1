Add-Type -AssemblyName System.Drawing

$baseDir = "c:\Users\USER\Downloads\Portfolio PA\Portfolio-CV-main"
$srcDir = $baseDir
$destDir = Join-Path $baseDir "public/images"

# Function to crop a portrait image to landscape 16:9
function Crop-To-Landscape($srcName, $destName) {
    $srcPath = Join-Path $srcDir $srcName
    $destPath = Join-Path $destDir $destName

    if (-not (Test-Path $srcPath)) {
        Write-Warning "Source file not found: $srcPath"
        return
    }

    try {
        $img = [System.Drawing.Image]::FromFile($srcPath)
        $srcWidth = $img.Width
        $srcHeight = $img.Height

        # Calculate target height for 16:9 landscape aspect ratio
        $targetWidth = $srcWidth
        $targetHeight = [int]($srcWidth * 9 / 16)

        # If the source image is already landscape or height is too small, use full size
        if ($srcHeight -le $targetHeight) {
            $targetHeight = $srcHeight
            $startY = 0
        } else {
            # Start cropping slightly above the center (1/3 of the remaining height) to get headers/titles
            $startY = [int](($srcHeight - $targetHeight) / 3)
        }

        # Create destination bitmap and graphics object
        $bmp = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

        # Draw the cropped region
        $srcRect = New-Object System.Drawing.Rectangle(0, $startY, $targetWidth, $targetHeight)
        $destRect = New-Object System.Drawing.Rectangle(0, 0, $targetWidth, $targetHeight)
        $g.DrawImage($img, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

        # Clean up source image handle before writing to destination (in case they are the same file)
        $g.Dispose()
        $img.Dispose()

        # Save to destination
        $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
        Write-Host "Successfully cropped $srcName to landscape -> $destName"
    } catch {
        Write-Error "Error cropping $srcName to $destName : $_"
    }
}

# Apply cropping for all covers and backgrounds
Write-Host "Starting landscape image cropping..."

# 5.jpg is already horizontal (landscape), copy directly
if (Test-Path (Join-Path $srcDir "5.jpg")) {
    Copy-Item -Path (Join-Path $srcDir "5.jpg") -Destination (Join-Path $destDir "bg_nature.png") -Force
    Copy-Item -Path (Join-Path $srcDir "5.jpg") -Destination (Join-Path $destDir "banner_bg.png") -Force
    Copy-Item -Path (Join-Path $srcDir "5.jpg") -Destination (Join-Path $destDir "cover_bt5.png") -Force
    Copy-Item -Path (Join-Path $srcDir "5.jpg") -Destination (Join-Path $destDir "bt5_1.png") -Force
    Copy-Item -Path (Join-Path $srcDir "5.jpg") -Destination (Join-Path $destDir "bt5_2.png") -Force
    Write-Host "Successfully copied horizontal 5.jpg to backgrounds and Lesson 5 cover"
}

# Avatar 9.jpg is copied directly (standard portrait crop is fine for avatars)
if (Test-Path (Join-Path $srcDir "9.jpg")) {
    Copy-Item -Path (Join-Path $srcDir "9.jpg") -Destination (Join-Path $destDir "portrait.png") -Force
    Write-Host "Successfully copied avatar 9.jpg -> portrait.png"
}

# Crop and map the other portrait images to landscape covers/slides
Crop-To-Landscape "1.jpg" "cover_bt1.png"
Crop-To-Landscape "1.jpg" "bt1_1.png"
Crop-To-Landscape "1.jpg" "bt1_2.png"

# Lesson 2 maps 2.jpg to covers/slides
Crop-To-Landscape "2.jpg" "cover_bt2.png"
Crop-To-Landscape "2.jpg" "bt2_1.png"
Crop-To-Landscape "2.jpg" "bt2_2.png"

# Lesson 3 maps 3.jpg to covers/slides
Crop-To-Landscape "3.jpg" "cover_bt3.png"
Crop-To-Landscape "3.jpg" "bt3_1.png"
Crop-To-Landscape "3.jpg" "bt3_2.png"

# Lesson 4 maps 4.jpg to covers/slides
Crop-To-Landscape "4.jpg" "cover_bt4.png"
Crop-To-Landscape "4.jpg" "bt4_1.png"
Crop-To-Landscape "4.jpg" "bt4_2.png"

# Lesson 6 maps 6.jpg to covers/slides
Crop-To-Landscape "6.jpg" "cover_bt6.png"
Crop-To-Landscape "6.jpg" "bt6_1.png"
Crop-To-Landscape "6.jpg" "bt6_2.png"

Write-Host "Cropping script execution complete!"
