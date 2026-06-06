Add-Type -AssemblyName System.Drawing

$baseDir = "c:\Users\USER\Downloads\Portfolio PA\Portfolio-CV-main"
$srcDir = $baseDir
$destDir = Join-Path $baseDir "public/images"

# Function to rotate an image 90 degrees clockwise and save it to the destination
function Rotate-Image-Clockwise($srcName, $destName) {
    $srcPath = Join-Path $srcDir $srcName
    $destPath = Join-Path $destDir $destName

    if (-not (Test-Path $srcPath)) {
        Write-Warning "Source file not found: $srcPath"
        return
    }

    try {
        $img = [System.Drawing.Image]::FromFile($srcPath)
        
        # Rotate 90 degrees clockwise
        $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone)
        
        # Save directly to the destination as PNG
        if (Test-Path $destPath) {
            Remove-Item -Path $destPath -Force
        }
        
        $img.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $img.Dispose()
        Write-Host "Successfully rotated $srcName (90 deg CW) -> $destName"
    } catch {
        Write-Error "Error rotating $srcName to $destName : $_"
    }
}

Write-Host "Starting image rotation and mapping..."

# Rotate and apply backgrounds using 7.jpg (horizontal landscape after rotation)
Rotate-Image-Clockwise "7.jpg" "bg_nature.png"
Rotate-Image-Clockwise "7.jpg" "banner_bg.png"

# Avatar 9.jpg is copied directly (standard vertical aspect ratio is fine for profile cards)
if (Test-Path (Join-Path $srcDir "9.jpg")) {
    Copy-Item -Path (Join-Path $srcDir "9.jpg") -Destination (Join-Path $destDir "portrait.png") -Force
    Write-Host "Successfully copied avatar 9.jpg -> portrait.png"
}

# Rotate and apply Lesson 1
Rotate-Image-Clockwise "1.jpg" "cover_bt1.png"
Rotate-Image-Clockwise "1.jpg" "bt1_1.png"
Rotate-Image-Clockwise "1.jpg" "bt1_2.png"

# Rotate and apply Lesson 2
Rotate-Image-Clockwise "2.jpg" "cover_bt2.png"
Rotate-Image-Clockwise "2.jpg" "bt2_1.png"
Rotate-Image-Clockwise "2.jpg" "bt2_2.png"

# Rotate and apply Lesson 3
Rotate-Image-Clockwise "3.jpg" "cover_bt3.png"
Rotate-Image-Clockwise "3.jpg" "bt3_1.png"
Rotate-Image-Clockwise "3.jpg" "bt3_2.png"

# Rotate and apply Lesson 4
Rotate-Image-Clockwise "4.jpg" "cover_bt4.png"
Rotate-Image-Clockwise "4.jpg" "bt4_1.png"
Rotate-Image-Clockwise "4.jpg" "bt4_2.png"

# Lesson 5 is already horizontal, we copy directly (no rotation needed)
if (Test-Path (Join-Path $srcDir "5.jpg")) {
    Copy-Item -Path (Join-Path $srcDir "5.jpg") -Destination (Join-Path $destDir "cover_bt5.png") -Force
    Copy-Item -Path (Join-Path $srcDir "5.jpg") -Destination (Join-Path $destDir "bt5_1.png") -Force
    Copy-Item -Path (Join-Path $srcDir "5.jpg") -Destination (Join-Path $destDir "bt5_2.png") -Force
    Write-Host "Successfully copied horizontal 5.jpg to Lesson 5 covers/slides"
}

# Rotate and apply Lesson 6
Rotate-Image-Clockwise "6.jpg" "cover_bt6.png"
Rotate-Image-Clockwise "6.jpg" "bt6_1.png"
Rotate-Image-Clockwise "6.jpg" "bt6_2.png"

Write-Host "Rotation and mapping complete!"
