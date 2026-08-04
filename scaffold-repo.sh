#!/bin/bash
# ==============================================================================
# Nutri Lens — Repository Scaffold Script
# ==============================================================================
# Run this ONCE, from inside an empty folder named `nutri-lens`, to create the
# full monorepo structure before handing the repo off to the team.
#
# Usage:
#   mkdir nutri-lens && cd nutri-lens
#   bash scaffold-repo.sh
# ==============================================================================
set -e

echo "Creating Nutri Lens folder structure..."

# ---- mobile/  (Mobile Team — Person C & Person D) ---------------------------
mkdir -p mobile/android mobile/ios
mkdir -p mobile/src/assets
mkdir -p mobile/src/components
mkdir -p mobile/src/screens
mkdir -p mobile/src/navigation
mkdir -p mobile/src/services
mkdir -p mobile/src/store
mkdir -p mobile/src/hooks
mkdir -p mobile/src/offline
mkdir -p mobile/src/utils

# ---- web/  (Web Team — Person A & Person B) ---------------------------------
mkdir -p web/public
mkdir -p web/src/assets
mkdir -p web/src/components
mkdir -p web/src/pages
mkdir -p web/src/services
mkdir -p web/src/store
mkdir -p web/src/hooks
mkdir -p web/src/utils

# ---- backend/  (Backend Team — Person E & Person F) -------------------------
mkdir -p backend/src/routes
mkdir -p backend/src/controllers
mkdir -p backend/src/services/personalization
mkdir -p backend/src/services/recall
mkdir -p backend/src/services/community
mkdir -p backend/src/models
mkdir -p backend/src/middleware
mkdir -p backend/src/config

# ---- shared/, data/, docs/, .github/ (everyone) ------------------------------
mkdir -p shared/types
mkdir -p shared/constants
mkdir -p shared/api-client
mkdir -p data
mkdir -p docs
mkdir -p .github/workflows

# ---- Placeholder README in each major folder --------------------------------
# (empty folders aren't tracked by git — these both fix that and orient
# whoever opens the folder for the first time)
cat > mobile/README.md << 'EOF'
# Mobile App — React Native (Android & iOS)
Owned by: Mobile Team (Person C, Person D)
See ../CONTRIBUTING.md for feature assignments and setup instructions.
EOF

cat > web/README.md << 'EOF'
# Web App — React (browser dashboard)
Owned by: Web Team (Person A, Person B)
See ../CONTRIBUTING.md for feature assignments and setup instructions.
EOF

cat > backend/README.md << 'EOF'
# Backend API — Node.js / FastAPI
Owned by: Backend Team (Person E, Person F)
See ../CONTRIBUTING.md for feature assignments and setup instructions.
EOF

cat > shared/README.md << 'EOF'
# Shared code between mobile and web
Types, constants, and the typed API client that both clients import from.
Changes here affect both teams — coordinate before merging.
EOF

cat > data/README.md << 'EOF'
# Seed datasets
- additive-knowledge-base.json — the curated ~200-entry additive dataset
- fssai-recall-seed.json — the seeded recall/ban dataset for the prototype
EOF

cat > docs/README.md << 'EOF'
# Additional documentation
Longer-form notes, architecture decisions, and anything too detailed for the
main README or CONTRIBUTING.md.
EOF

# ---- Placeholder data files ---------------------------------------------------
echo '[]' > data/additive-knowledge-base.json
echo '[]' > data/fssai-recall-seed.json

# ---- .gitignore ----------------------------------------------------------------
cat > .gitignore << 'EOF'
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
EOF

echo ""
echo "Done. Folder structure created."
echo ""
echo "Next steps:"
echo "  git init"
echo "  git add ."
echo "  git commit -m \"chore: scaffold repository structure\""
echo "  git remote add origin https://github.com/CODE-STRIX/Nutrilens.git"
echo "  git branch -M main"
echo "  git push -u origin main"
echo ""
echo "Then hand the repo off to the team — see CONTRIBUTING.md for who works where."