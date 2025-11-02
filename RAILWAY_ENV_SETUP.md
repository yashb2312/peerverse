# 🚨 Railway Environment Variables Setup

## Problem
Your new Railway deployment `gleaming-inspiration-production-5a37.up.railway.app` is missing environment variables, causing 500 errors.

## Required Environment Variables

Based on your server.js file, you need to set these in Railway:

### 1. JWT Secret (CRITICAL - causing the 500 error)
```
JWT_SECRET=your_jwt_secret_here_make_it_long_and_random
```

### 2. Database
```
DATABASE_URL=your_postgresql_connection_string
```

### 3. Email Service (Mailjet)
```
MAILJET_API_KEY=your_mailjet_api_key
MAILJET_SECRET_KEY=your_mailjet_secret_key
MAILJET_SENDER_EMAIL=your_sender_email@domain.com
```

### 4. Payment Gateway (Razorpay)
```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### 5. Optional (for mentor earnings)
```
MENTOR_SHARE_PERCENTAGE=70
```

## How to Set Environment Variables in Railway

### Method 1: Railway Dashboard
1. Go to https://railway.app/dashboard
2. Find your project `gleaming-inspiration-production-5a37`
3. Click on your service
4. Go to "Variables" tab
5. Add each variable one by one

### Method 2: Railway CLI
```bash
railway login
railway link
railway variables set JWT_SECRET="your_long_random_jwt_secret_here"
railway variables set DATABASE_URL="your_database_url"
railway variables set MAILJET_API_KEY="your_mailjet_key"
# ... add all other variables
```

## Quick Fix Script
Create a `.env` file with your values and run:

```bash
# Copy from your old Railway deployment or local .env
railway variables set JWT_SECRET="$(grep JWT_SECRET .env | cut -d '=' -f2)"
railway variables set DATABASE_URL="$(grep DATABASE_URL .env | cut -d '=' -f2)"
railway variables set MAILJET_API_KEY="$(grep MAILJET_API_KEY .env | cut -d '=' -f2)"
railway variables set MAILJET_SECRET_KEY="$(grep MAILJET_SECRET_KEY .env | cut -d '=' -f2)"
railway variables set MAILJET_SENDER_EMAIL="$(grep MAILJET_SENDER_EMAIL .env | cut -d '=' -f2)"
railway variables set RAZORPAY_KEY_ID="$(grep RAZORPAY_KEY_ID .env | cut -d '=' -f2)"
railway variables set RAZORPAY_KEY_SECRET="$(grep RAZORPAY_KEY_SECRET .env | cut -d '=' -f2)"
```

## Generate JWT Secret
If you don't have a JWT secret, generate one:

```bash
# Option 1: Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: OpenSSL
openssl rand -hex 64

# Option 3: Online generator
# Visit: https://generate-secret.vercel.app/64
```

## Verification
After setting variables, check:
1. Visit: https://gleaming-inspiration-production-5a37.up.railway.app/api/test
2. Should return success message
3. Try login again - should work without 500 error

## Priority Order
Set these in this order for quickest fix:
1. **JWT_SECRET** (fixes immediate 500 error)
2. **DATABASE_URL** (enables data access)
3. **MAILJET_*** (enables email OTP)
4. **RAZORPAY_*** (enables payments)

## Status Check
After setting variables, test the API:
```bash
curl https://gleaming-inspiration-production-5a37.up.railway.app/api/test
```

Should return:
```json
{
  "message": "PeerSync Backend is running on Railway!",
  "timestamp": "...",
  "cors": "enabled"
}
```