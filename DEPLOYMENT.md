# Deployment Guide for LMS Project

This guide will help you deploy your LMS (Learning Management System) project to production.

## Project Structure

- **Frontend**: React + Vite (in `client/` folder)
- **Backend**: Node.js + Express (in `server/` folder)
- **Database**: MongoDB Atlas (cloud)

## Deployment Options

### Option 1: Render (Recommended for beginners)

#### Backend Deployment on Render

1. **Create a Render account** at https://render.com

2. **Create a new Web Service**:
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the `server` folder as the root directory

3. **Configure Build Settings**:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

4. **Set Environment Variables** in Render dashboard:
   ```
   NODE_ENV=production
   PORT=10000 (Render will set this automatically, but you can override)
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=https://your-frontend-url.com
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_SECRET_ID=your_paypal_secret_id
   ```

5. **Deploy**: Click "Create Web Service"

6. **Note your backend URL**: Something like `https://your-app.onrender.com`

#### Frontend Deployment on Render

1. **Create a new Static Site**:
   - Click "New" → "Static Site"
   - Connect your GitHub repository
   - Select the `client` folder

2. **Configure Build Settings**:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

3. **Set Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

4. **Deploy**: Click "Create Static Site"

---

### Option 2: Railway

#### Backend Deployment on Railway

1. **Create a Railway account** at https://railway.app

2. **Create a new project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure the service**:
   - Set root directory to `server`
   - Railway will auto-detect Node.js

4. **Set Environment Variables**:
   - Go to Variables tab
   - Add all variables from `.env.example`

5. **Deploy**: Railway will automatically deploy

---

### Option 3: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend on Vercel

1. **Create a Vercel account** at https://vercel.com

2. **Import your project**:
   - Click "Add New" → "Project"
   - Import from GitHub
   - Select the `client` folder

3. **Configure**:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Set Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```

5. **Deploy**: Click "Deploy"

---

## Pre-Deployment Checklist

### Backend

- [ ] Fix `server/package.json` start script (should be `node server.js`)
- [ ] Update CORS to allow production frontend URL
- [ ] Set all environment variables
- [ ] Test MongoDB Atlas connection
- [ ] Ensure `.env` is in `.gitignore`

### Frontend

- [ ] Update API URL to use environment variable
- [ ] Build the project locally: `npm run build`
- [ ] Test the build locally: `npm run preview`
- [ ] Ensure production API URL is set

### MongoDB Atlas

- [ ] Ensure cluster is running (not paused)
- [ ] Whitelist deployment platform IPs (or use `0.0.0.0/0` for development)
- [ ] Verify database user credentials

### Environment Variables Summary

**Backend (.env)**:
```
PORT=3000
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
CLIENT_URL=https://your-frontend-url.com
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
PAYPAL_CLIENT_ID=...
PAYPAL_SECRET_ID=...
```

**Frontend (.env)**:
```
VITE_API_URL=https://your-backend-url.com
```

---

## Post-Deployment

1. **Test the deployed application**:
   - Test user registration
   - Test user login
   - Test course creation (if applicable)
   - Test file uploads (if applicable)

2. **Monitor logs**:
   - Check backend logs for errors
   - Monitor MongoDB Atlas for connection issues

3. **Update CORS if needed**:
   - If you add more frontend domains, update `CLIENT_URL` in backend

---

## Troubleshooting

### Backend won't start
- Check environment variables are set correctly
- Verify MongoDB connection string
- Check logs for specific errors

### CORS errors
- Ensure `CLIENT_URL` includes your frontend URL
- Check if URL has trailing slash (shouldn't)
- Verify CORS configuration in `server.js`

### Database connection fails
- Verify MongoDB Atlas cluster is running
- Check IP whitelist in MongoDB Atlas
- Verify connection string format

### Frontend can't connect to backend
- Verify `VITE_API_URL` is set correctly
- Check backend is deployed and running
- Verify CORS allows your frontend domain

---

## Quick Deploy Commands

### Local Testing
```bash
# Backend
cd server
npm install
npm start

# Frontend
cd client
npm install
npm run build
npm run preview
```

### Production Build
```bash
# Backend - already configured
cd server
npm install
npm start

# Frontend
cd client
npm install
npm run build
# Deploy the 'dist' folder
```

---

## Support

If you encounter issues:
1. Check deployment platform logs
2. Verify all environment variables
3. Test locally first
4. Check MongoDB Atlas status

Good luck with your deployment! 🚀
