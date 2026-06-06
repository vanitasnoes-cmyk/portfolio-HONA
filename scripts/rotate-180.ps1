Add-Type -AssemblyName System.Drawing

$baseDir = "c:\Users\USER\Downloads\Portfolio PA\Portfolio-CV-main"
$destDir = Join-Path $baseDir "public/images"

# Function to rotate an existing image 180 degrees and overwrite it
function Rotate-Image-180($fileName) {
    $filePath = Join-Path $destDir $fileName

    if (-not (Test-Path $filePath)) {
        Write-Warning "File not found: $filePath"
        return
    }

    try {
        # Load, rotate 180 degrees, and save
        $img = [System.Drawing.Image]::FromFile($filePath)
        $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone)
        
        # Temp save path because we can't write directly to an open file
        $tempPath = [System.IO.Path]::GetTempFileName()
        $img.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $img.Dispose()

        # Copy temp file over the original and clean up
        Copy-Item -Path $tempPath -Destination $filePath -Force
        Remove-Item -Path $tempPath -Force
        
        Write-Host "Successfully rotated 180 degrees -> $fileName"
    } catch {
        Write-Error "Error rotating $fileName 180 degrees: $_"
    }
}

Write-Host "Starting 180-degree image rotation..."

# Rotate backgrounds (from 7.jpg)
Rotate-Image-180 "bg_nature.png"
Rotate-Image-180 "banner_bg.png"

# Rotate Lesson 1 covers/slides
Rotate-Image-180 "cover_bt1.png"
Rotate-Image-180 "bt1_1.png"
Rotate-Image-180 "bt1_2.png"

# Rotate Lesson 2 covers/slides
Rotate-Image-180 "cover_bt2.png"
Rotate-Image-180 "bt2_1.png"
Rotate-Image-180 "bt2_2.png"

# Rotate Lesson 3 covers/slides
Rotate-Image-180 "cover_bt3.png"
Rotate-Image-180 "bt3_1.png"
Rotate-Image-180 "bt3_2.png"

# Rotate Lesson 4 covers/slides
Rotate-Image-180 "cover_bt4.png"
Rotate-Image-180 "bt4_1.png"
Rotate-Image-180 "bt4_2.png"

# Rotate Lesson 6 covers/slides
Rotate-Image-180 "cover_bt6.png"
Rotate-Image-180 "bt6_1.png"
Rotate-Image-180 "bt6_2.png"

Write-Host "180-degree image rotation complete!"
