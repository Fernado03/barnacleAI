# 🚀 Barnacle-AI Deployment Guide

This guide will help you deploy your Barnacle-AI application using the recommended **hybrid approach**:

- **Frontend**: Vercel (React + Vite)
- **Backend**: Render (Node.js + Python ML)
- **Database**: MongoDB Atlas (already configured ✅)

## 📋 Pre-Deployment Checklist

✅ Frontend builds successfully (`npm run build` completed)
✅ ML model exists and works locally
✅ MongoDB Atlas database configured
✅ Configuration files created
✅ Python requirements defined

## 🎯 Deployment Strategy

### **Step 1: Deploy Backend to Render**

1. **Create Render Account**:

   - Go to [render.com](https://render.com)
   - Sign up with GitHub (recommended)

2. **Connect Repository**:

   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the `barnacleAI` repository

3. **Configure Service**:

   ```
   Name: barnacle-backend
   Environment: Docker
   Build Command: (automatic from Dockerfile)
   Start Command: (automatic from Dockerfile)
   Plan: Free
   ```

4. **Set Environment Variables**:

   ```
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   ```

5. **Deploy**: Click "Create Web Service"

### **Step 2: Deploy Frontend to Vercel**

1. **Create Vercel Account**:

   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**:

   - Click "New Project"
   - Import your GitHub repository
   - Set Root Directory to `barn-frontend`

3. **Configure Build Settings**:

   ```
   Framework Preset: Vite
   Root Directory: barn-frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Set Environment Variable**:

   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
   ```

   (Replace with your actual Render backend URL)

5. **Deploy**: Click "Deploy"

## ⚙️ Configuration Details

### **Backend Environment Variables**

Create these in Render dashboard:

| Variable      | Value               | Description                             |
| ------------- | ------------------- | --------------------------------------- |
| `NODE_ENV`    | `production`        | Sets production mode                    |
| `PORT`        | `3000`              | Server port (auto-configured by Render) |
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string    |
| `JWT_SECRET`  | `strong-secret-key` | JWT signing secret (generate securely)  |

### **Frontend Environment Variables**

Set in Vercel dashboard:

| Variable            | Value                              | Description     |
| ------------------- | ---------------------------------- | --------------- |
| `VITE_API_BASE_URL` | `https://yourapp.onrender.com/api` | Backend API URL |

## 🔄 Post-Deployment Steps

### **1. Test Backend**

```bash
curl https://your-backend-url.onrender.com/
# Should return: {"message": "Hello World"}
```

### **2. Test Frontend**

- Visit your Vercel URL
- Try logging in with demo account:
  - Email: `demo@barnacle.com`
  - Password: `demo123`

### **3. Test ML Model**

- Go to Statistics → Biofouling Predictor
- Input vessel data and generate prediction
- Should work with trained model or fallback

## 🛠️ Troubleshooting

### **Common Issues:**

1. **Backend Not Starting**:

   - Check Render logs for errors
   - Verify environment variables
   - Ensure MongoDB Atlas IP whitelist includes 0.0.0.0/0

2. **Frontend API Errors**:

   - Verify `VITE_API_BASE_URL` is correct
   - Check browser network tab for CORS issues
   - Ensure backend is running

3. **ML Model Not Working**:
   - Check backend logs for Python errors
   - App will use fallback predictions automatically
   - No impact on core functionality

### **Logs Access:**

- **Render**: Dashboard → Your Service → Logs
- **Vercel**: Dashboard → Your Project → Functions tab
- **MongoDB**: Atlas → Monitoring

## 🚀 Going Live

1. **Custom Domain** (optional):

   - Vercel: Project Settings → Domains
   - Render: Settings → Custom Domains

2. **SSL/HTTPS**:

   - Automatic on both Vercel and Render

3. **Performance Monitoring**:
   - Enable in Vercel dashboard
   - Monitor in Render dashboard

## 📱 Mobile Responsiveness

Your app is already mobile-responsive with Tailwind CSS. Test on:

- Desktop browsers
- Mobile Chrome/Safari
- Tablet views

## 🔐 Security Notes

- Change default JWT secret
- Keep environment variables private
- MongoDB Atlas has built-in security
- HTTPS enabled by default

## 💡 Upgrade Path

When ready to scale:

- **Render**: Upgrade to paid plan for always-on
- **Vercel**: Pro plan for advanced features
- **MongoDB**: Upgrade Atlas cluster

---

**Need Help?** Check service-specific documentation:

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
