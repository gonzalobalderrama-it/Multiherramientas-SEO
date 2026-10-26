Add-Type -AssemblyName System.Drawing

function Generate-Icon {
    param (
        [int]$Size,
        [string]$OutPath
    )
    $bmp = New-Object System.Drawing.Bitmap $Size, $Size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

    $brushBg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(30, 58, 138))
    $brushCap = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(16, 185, 129))
    $brushGold = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(245, 158, 11))

    $rect = New-Object System.Drawing.Rectangle 0, 0, $Size, $Size
    $g.FillRectangle($brushBg, $rect)

    # Cap diamond
    $p1 = New-Object System.Drawing.Point ([int]($Size * 0.5)), ([int]($Size * 0.2))
    $p2 = New-Object System.Drawing.Point ([int]($Size * 0.85)), ([int]($Size * 0.38))
    $p3 = New-Object System.Drawing.Point ([int]($Size * 0.5)), ([int]($Size * 0.55))
    $p4 = New-Object System.Drawing.Point ([int]($Size * 0.15)), ([int]($Size * 0.38))
    $points = [System.Drawing.Point[]]@($p1, $p2, $p3, $p4)
    $g.FillPolygon($brushCap, $points)

    # Cap base
    $b1 = New-Object System.Drawing.Point ([int]($Size * 0.3)), ([int]($Size * 0.46))
    $b2 = New-Object System.Drawing.Point ([int]($Size * 0.7)), ([int]($Size * 0.46))
    $b3 = New-Object System.Drawing.Point ([int]($Size * 0.7)), ([int]($Size * 0.75))
    $b4 = New-Object System.Drawing.Point ([int]($Size * 0.3)), ([int]($Size * 0.75))
    $bpoints = [System.Drawing.Point[]]@($b1, $b2, $b3, $b4)
    $g.FillPolygon($brushCap, $bpoints)

    # Gold center
    $gw = [Math]::Max(2, [int]($Size * 0.12))
    $g.FillEllipse($brushGold, [int]($Size * 0.44), [int]($Size * 0.32), $gw, $gw)

    $g.Dispose()
    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created $OutPath"
}

$dir = "c:\Users\GonzaloNicolasBalder\OneDrive - Church of Jesus Christ\Aplicaciones\Multiherramientas SEI\src\assets"
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force }

Generate-Icon -Size 16 -OutPath (Join-Path $dir "icon-16.png")
Generate-Icon -Size 48 -OutPath (Join-Path $dir "icon-48.png")
Generate-Icon -Size 128 -OutPath (Join-Path $dir "icon-128.png")
