# Quick Deployment Guide

## 🚀 Fastest Way to Deploy

### Step 1: Deploy Backend (Render - Free Tier)

1. Go to https://render.com and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repo
4. Settings:
   - **Name**: `lms-api` (or any name)
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   ```
   NODE_ENV=production
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=https://your-frontend-url.vercel.app
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_SECRET_ID=your_paypal_secret_id
   ```
6. Click "Create Web Service"
7. **Wait for deployment** (takes 2-5 minutes)
8. **Copy your backend URL**: `https://your-app.onrender.com`

### Step 2: Deploy Frontend (Vercel - Free Tier)

1. Go to https://vercel.com and sign up
2. Click "Add New" → "Project"
3. Import your GitHub repo
4. Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-app.onrender.com
   ```
   (Use the backend URL from Step 1)
6. Click "Deploy"
7. **Copy your frontend URL**: `https://your-app.vercel.app`

### Step 3: Update Backend CORS

1. Go back to Render dashboard
2. Update the `CLIENT_URL` environment variable:
   ```
   CLIENT_URL=https://your-app.vercel.app
   ```
3. Redeploy (or it will auto-redeploy)

### Step 4: Update MongoDB Atlas

1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (or add Render's IPs)
4. Save

## ✅ Done!

Your app should now be live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.onrender.com`

## 🧪 Test Your Deployment

1. Visit your frontend URL
2. Try registering a new user
3. Try logging in
4. Check backend logs in Render dashboard if issues occur

## 📝 Important Notes

- **Free tiers have limitations**: Render free tier spins down after 15 min of inactivity
- **First request may be slow**: Free tier needs to wake up
- **Environment variables**: Make sure all are set correctly
- **MongoDB Atlas**: Ensure cluster is not paused

## 🆘 Troubleshooting

**Backend not responding?**
- Check Render logs
- Verify environment variables
- Check MongoDB connection

**CORS errors?**
- Update `CLIENT_URL` in backend
- Ensure no trailing slash in URL

**Frontend can't connect?**
- Verify `VITE_API_URL` is set
- Check backend is running
- Check browser console for errors

---

For detailed deployment instructions, see `DEPLOYMENT.md`
