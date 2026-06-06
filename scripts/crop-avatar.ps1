Add-Type -AssemblyName System.Drawing
$file = Get-ChildItem -Filter "*avt*.jpg" | Select-Object -First 1
if ($file) {
    Write-Host "Cropping avatar: $($file.Name)"
    $img = [System.Drawing.Image]::FromFile($file.FullName)
    $width = $img.Width
    $height = $img.Height
    
    # We want a square crop of the top part (width x width)
    $cropSize = $width
    $startY = 0 # Crop from the very top to keep the face and remove bottom info
    
    $bmp = New-Object System.Drawing.Bitmap($cropSize, $cropSize)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    
    $srcRect = New-Object System.Drawing.Rectangle(0, $startY, $cropSize, $cropSize)
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $cropSize, $cropSize)
    $g.DrawImage($img, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    
    $g.Dispose()
    $img.Dispose()
    
    $destPath1 = Join-Path (Resolve-Path ".") "public/images/portrait.jpg"
    $destPath2 = Join-Path (Resolve-Path ".") "public/images/portrait.png"
    
    $bmp.Save($destPath1, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $bmp.Save($destPath2, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Successfully cropped avatar and saved to public/images/portrait.jpg and portrait.png"
} else {
    Write-Warning "No avatar file found"
}
