@echo off
echo 🧹 Clearing cache and rebuilding frontend...
echo.

cd FRONTEND\frontone

echo 📦 Clearing npm cache...
npm cache clean --force

echo 🗑️ Removing node_modules and package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo 📥 Reinstalling dependencies...
npm install

echo 🏗️ Building the project...
npm run build

echo.
echo ✅ Cache cleared and project rebuilt!
echo.
echo 🌐 Next steps:
echo 1. Clear your browser cache (Ctrl+Shift+Delete)
echo 2. Clear localStorage (F12 > Application > Local Storage > Clear All)
echo 3. Restart your development server: npm start
echo 4. If using a deployed version, redeploy to Vercel/Netlify
echo.
pause