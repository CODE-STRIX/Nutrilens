# ==============================================================================
# Nutri Lens - Repository Scaffold Script (Windows PowerShell version)
# ==============================================================================
# Run this ONCE, from inside an empty folder named nutri-lens, to create the
# full monorepo structure before handing the repo off to the team.
#
# Usage:
#   mkdir nutri-lens
#   cd nutri-lens
#   .\scaffold-repo.ps1
#
# If PowerShell refuses to run this script ("running scripts is disabled on
# this system"), run this once first - no admin rights needed:
#   Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
# ==============================================================================

Write-Host "Creating Nutri Lens folder structure..."

# ---- mobile/  (Mobile Team - Person C & Person D) ---------------------------
$mobileDirs = @(
    "mobile/android", "mobile/ios",
    "mobile/src/assets", "mobile/src/components", "mobile/src/screens",
    "mobile/src/navigation", "mobile/src/services", "mobile/src/store",
    "mobile/src/hooks", "mobile/src/offline", "mobile/src/utils"
)

# ---- web/  (Web Team - Person A & Person B) ---------------------------------
$webDirs = @(
    "web/public",
    "web/src/assets", "web/src/components", "web/src/pages",
    "web/src/services", "web/src/store", "web/src/hooks", "web/src/utils"
)

# ---- backend/  (Backend Team - Person E & Person F) -------------------------
$backendDirs = @(
    "backend/src/routes", "backend/src/controllers",
    "backend/src/services/personalization", "backend/src/services/recall",
    "backend/src/services/community", "backend/src/models",
    "backend/src/middleware", "backend/src/config"
)

# ---- shared/, data/, docs/, .github/ (everyone) ------------------------------
$sharedDirs = @(
    "shared/types", "shared/constants", "shared/api-client",
    "data", "docs", ".github/workflows"
)

$allDirs = $mobileDirs + $webDirs + $backendDirs + $sharedDirs
foreach ($dir in $allDirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

# ---- Placeholder README in each major folder --------------------------------
# (orients whoever opens the folder for the first time)
@'
# Mobile App - React Native (Android & iOS)
Owned by: Mobile Team (Person C, Person D)
See ../CONTRIBUTING.md for feature assignments and setup instructions.
'@ | Set-Content -Path "mobile/README.md"

@'
# Web App - React (browser dashboard)
Owned by: Web Team (Person A, Person B)
See ../CONTRIBUTING.md for feature assignments and setup instructions.
'@ | Set-Content -Path "web/README.md"

@'
# Backend API - Node.js / FastAPI
Owned by: Backend Team (Person E, Person F)
See ../CONTRIBUTING.md for feature assignments and setup instructions.
'@ | Set-Content -Path "backend/README.md"

@'
# Shared code between mobile and web
Types, constants, and the typed API client that both clients import from.
Changes here affect both teams - coordinate before merging.
'@ | Set-Content -Path "shared/README.md"

@'
# Seed datasets
- additive-knowledge-base.json - the curated ~200-entry additive dataset
- fssai-recall-seed.json - the seeded recall/ban dataset for the prototype
'@ | Set-Content -Path "data/README.md"

@'
# Additional documentation
Longer-form notes, architecture decisions, and anything too detailed for the
main README or CONTRIBUTING.md.
'@ | Set-Content -Path "docs/README.md"

# ---- Placeholder data files --------------------------------------------------
'[]' | Set-Content -Path "data/additive-knowledge-base.json"
'[]' | Set-Content -Path "data/fssai-recall-seed.json"

# ---- .gitignore ---------------------------------------------------------------
@'
node_modules/
.env
.env.local
dist/
build/
.expo/
*.log
.DS_Store
android/app/build/
ios/build/
'@ | Set-Content -Path ".gitignore"

Write-Host ""
Write-Host "Done. Folder structure created."
Write-Host ""
Write-Host "Next steps:"
Write-Host "  git init"
Write-Host "  git add ."
Write-Host '  git commit -m "chore: scaffold repository structure"'
Write-Host "  git remote add origin https://github.com/CODE-STRIX/Nutrilens.git"
Write-Host "  git branch -M main"
Write-Host "  git push -u origin main"
Write-Host ""
Write-Host "Then hand the repo off to the team - see CONTRIBUTING.md for who works where."
