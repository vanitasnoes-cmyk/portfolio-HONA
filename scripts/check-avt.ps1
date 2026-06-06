Add-Type -AssemblyName System.Drawing
$file = Get-ChildItem -Filter "*avt*.jpg" | Select-Object -First 1
if ($file) {
    Write-Host "Found file: $($file.Name)"
    $img = [System.Drawing.Image]::FromFile($file.FullName)
    Write-Host "Width: $($img.Width)"
    Write-Host "Height: $($img.Height)"
    $img.Dispose()
} else {
    Write-Warning "No avatar file found"
}
