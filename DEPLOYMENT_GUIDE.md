# 🚀 lstBooks Frontend Deployment Guide

## ✅ API Configuration Updated

Your frontend is now configured to use the production backend at:
**https://lstbooks-backend.onrender.com**

---

## 📋 What Was Changed

### 1. **Environment Variables Created**

Three environment files were created:

#### `.env` (Development - Git Ignored)
```env
VITE_API_URL=http://localhost:5000/api
```
- Used for local development
- Points to local backend
- **NOT committed to git** (in `.gitignore`)

#### `.env.production` (Production - Committed to Git)
```env
VITE_API_URL=https://lstbooks-backend.onrender.com/api
```
- Used when building for production (`npm run build`)
- Points to Render backend
- **Committed to git** for deployment

#### `.env.example` (Template - Committed to Git)
```env
VITE_API_URL=http://localhost:5000/api
```
- Template for other developers
- Shows what environment variables are needed
- **Committed to git**

### 2. **API Service Updated**

**File:** `frontend/src/services/api.js`

**Before:**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

**After:**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://lstbooks-backend.onrender.com/api';
```

**Change:** Fallback URL now points to production backend instead of localhost.

### 3. **Gitignore Updated**

Added `.env` to `.gitignore` to prevent committing local environment variables.

---

## 🧪 Testing

### Test Locally (Development Mode)

```bash
cd /Volumes/SallnyHD/lstBooks/frontend

# Install dependencies (if needed)
npm install

# Start development server
npm run dev
```

**Expected Behavior:**
- Uses `.env` file
- API calls go to `http://localhost:5000/api`
- Make sure backend is running locally on port 5000

### Test Production Build Locally

```bash
cd /Volumes/SallnyHD/lstBooks/frontend

# Build for production
npm run build

# Preview production build
npm run preview
```

**Expected Behavior:**
- Uses `.env.production` file
- API calls go to `https://lstbooks-backend.onrender.com/api`
- No local backend needed

---

## 🌐 Deployment Options

### Option 1: Deploy to Vercel (Recommended)

**Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

**Step 2: Login to Vercel**
```bash
vercel login
```

**Step 3: Deploy**
```bash
cd /Volumes/SallnyHD/lstBooks/frontend
vercel
```

**Step 4: Configure Custom Domain**
- Go to Vercel dashboard
- Click your project
- Go to "Settings" → "Domains"
- Add `www.lstbooks.com`
- Follow DNS configuration instructions

**Environment Variables:**
Vercel will automatically use `.env.production` during build.

---

### Option 2: Deploy to Netlify

**Step 1: Install Netlify CLI**
```bash
npm install -g netlify-cli
```

**Step 2: Login to Netlify**
```bash
netlify login
```

**Step 3: Deploy**
```bash
cd /Volumes/SallnyHD/lstBooks/frontend
netlify deploy --prod
```

**Build Settings:**
- Build command: `npm run build`
- Publish directory: `dist`

**Step 4: Configure Custom Domain**
- Go to Netlify dashboard
- Click "Domain settings"
- Add custom domain: `www.lstbooks.com`

---

### Option 3: Deploy to GitHub Pages

**Step 1: Update `vite.config.js`**
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/', // or '/lstbooks/' if using a subdirectory
  // ... rest of config
})
```

**Step 2: Install gh-pages**
```bash
npm install --save-dev gh-pages
```

**Step 3: Add deploy script to `package.json`**
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

**Step 4: Deploy**
```bash
npm run deploy
```

---

## 🔧 Environment Variables Reference

### Vite Environment Variables

Vite uses the following environment files (in order of priority):

1. `.env.production.local` (production, local overrides - git ignored)
2. `.env.production` (production)
3. `.env.local` (all modes, local overrides - git ignored)
4. `.env` (all modes)

### How Vite Loads Environment Variables

- **Development (`npm run dev`)**: Loads `.env` and `.env.local`
- **Production (`npm run build`)**: Loads `.env.production` and `.env.production.local`

### Accessing Environment Variables

In your code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

**Important:** Only variables prefixed with `VITE_` are exposed to your client-side code!

---

## 📊 API Endpoints

All API calls now use the production backend:

| Endpoint | URL |
|----------|-----|
| Health Check | `https://lstbooks-backend.onrender.com/api/health` |
| Books | `https://lstbooks-backend.onrender.com/api/books` |
| Subjects | `https://lstbooks-backend.onrender.com/api/subjects` |
| Quizzes | `https://lstbooks-backend.onrender.com/api/quizzes` |
| Flashcards | `https://lstbooks-backend.onrender.com/api/flashcards` |
| OSCE | `https://lstbooks-backend.onrender.com/api/osce` |
| Labs | `https://lstbooks-backend.onrender.com/api/labs` |
| Skills | `https://lstbooks-backend.onrender.com/api/skills` |

---

## ✅ Pre-Deployment Checklist

- [x] Environment variables created (`.env`, `.env.production`, `.env.example`)
- [x] API service updated to use production URL
- [x] `.env` added to `.gitignore`
- [x] `.env.production` committed to git
- [x] Backend is live at `https://lstbooks-backend.onrender.com`
- [ ] Test production build locally (`npm run build && npm run preview`)
- [ ] Choose deployment platform (Vercel/Netlify/GitHub Pages)
- [ ] Deploy frontend
- [ ] Configure custom domain `www.lstbooks.com`
- [ ] Test all features on production

---

## 🎯 Next Steps

1. **Test Production Build:**
   ```bash
   npm run build
   npm run preview
   ```

2. **Commit Changes:**
   ```bash
   git add .
   git commit -m "Configure frontend for production deployment"
   git push origin main
   ```

3. **Deploy to Vercel (Recommended):**
   ```bash
   vercel
   ```

4. **Configure Domain:**
   - Add `www.lstbooks.com` in your deployment platform
   - Update DNS records

---

**Your frontend is ready to deploy! 🚀**

