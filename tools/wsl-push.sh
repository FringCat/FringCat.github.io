#!/usr/bin/env bash
set -euo pipefail

cd /mnt/d/A-Work/AAA_projects/blog

git add -A

if git diff --cached --quiet; then
  echo "Nothing to commit."
else
  git commit -F - <<'EOF'
migrate blog from Hugo to Hexo with Redefine theme
EOF
fi

git remote set-url origin git@github.com:FringCat/FringCat.github.io.git
git push origin main

echo "Push completed."
