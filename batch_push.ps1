$ErrorActionPreference = 'Stop'

Get-ChildItem -Path "images" -Directory | ForEach-Object {
    $dirName = $_.Name
    Write-Host "Pushing images in $dirName..."
    git add "images/$dirName/*-optimized*" "images/$dirName/*-480*" "images/$dirName/*-768*" "images/$dirName/*-1200*" "images/$dirName/*-1600*"
    
    # Check if there are any changes staged
    $status = git status --porcelain
    if ($status -match "A  ") {
        git commit -m "Add optimized images for $dirName"
        git push
    } else {
        Write-Host "No changes to commit for $dirName."
    }
}

Write-Host "Batch push complete."
