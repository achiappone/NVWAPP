param (
    [string]$Message = "WIP: save progress"
)

# Check if there is anything to commit
if ((git status --porcelain) -eq "") {
    Write-Host "No changes to commit."
    exit 0
}

Write-Host "Checking git status..."
git status

Write-Host "`nStaging changes..."
git add .

Write-Host "`nCommitting..."
git commit -m "$Message"

Write-Host "`nPushing to origin/main..."
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nPush failed. Rebasing from origin/main..."
    git pull --rebase origin main

    Write-Host "`nRetrying push..."
    git push origin main
}

Write-Host "`nDone."
