@echo off
echo 🚀 Force Redeploying Frontend with Updated API URLs...
echo.

cd FRONTEND\frontone

echo 📝 Adding deployment trigger comment...
echo // Force redeploy - API URLs updated to gleaming-inspiration-production-5a37.up.railway.app >> src\config.js

echo 📦 Building project...
npm run build

echo 📤 Committing changes...
cd ..\..
git add .
git commit -m "Force redeploy: Updated API URLs to gleaming-inspiration-production-5a37.up.railway.app"

echo 🌐 Pushing to trigger redeploy...
git push origin main

echo.
echo ✅ Redeploy triggered!
echo.
echo 🔍 Next steps:
echo 1. Wait 2-3 minutes for deployment to complete
echo 2. Clear browser cache (Ctrl+Shift+Delete)
echo 3. Visit https://www.peerverse.in
echo 4. Check DevTools Network tab to verify new API URLs
echo.
pause