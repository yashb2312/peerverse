@echo off
echo 🚀 Quick Railway Environment Variables Setup
echo.

echo 📋 This script will help you set up environment variables for your new Railway deployment
echo 🌐 Target: gleaming-inspiration-production-5a37.up.railway.app
echo.

echo ⚠️  IMPORTANT: You need the Railway CLI installed and logged in
echo    If not installed: npm install -g @railway/cli
echo.

pause

echo 🔑 Setting up JWT Secret...
echo.
echo Generating a secure JWT secret...
for /f %%i in ('node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"') do set JWT_SECRET=%%i
echo Generated JWT Secret: %JWT_SECRET:~0,16%...
echo.

echo 🔗 Linking to Railway project...
railway link

echo.
echo 📝 Setting JWT_SECRET (this will fix the 500 error)...
railway variables set JWT_SECRET="%JWT_SECRET%"

echo.
echo ✅ JWT_SECRET has been set!
echo.
echo 🔍 Testing the API...
curl -s https://gleaming-inspiration-production-5a37.up.railway.app/api/test

echo.
echo.
echo 📋 NEXT STEPS:
echo 1. Set your DATABASE_URL: railway variables set DATABASE_URL="your_database_url"
echo 2. Set your MAILJET credentials for email OTP
echo 3. Set your RAZORPAY credentials for payments
echo 4. Test login functionality
echo.
echo 📖 See RAILWAY_ENV_SETUP.md for complete setup guide
echo.
pause