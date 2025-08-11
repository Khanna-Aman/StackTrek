# StackTrek Deployment Guide

## Free Deployment Options

### Option 1: Netlify (Recommended)

**Why Netlify:**
- Free tier with generous limits
- Automatic deployments from Git
- Built-in CI/CD
- Custom domain support
- Perfect for React applications

**Steps:**
1. **Build the project locally to test:**
   ```bash
   npm run build
   npm run preview
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub account
   - Click "New site from Git"
   - Connect your GitHub repository
   - Build settings are automatically detected from `netlify.toml`
   - Deploy!

3. **Environment Variables (if needed):**
   - Go to Site settings > Environment variables
   - Add any required variables from `.env.example`
   - For demo purposes, Firebase variables are optional

### Option 2: Vercel

**Steps:**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Deploy automatically

### Option 3: GitHub Pages

**Steps:**
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts: `"deploy": "gh-pages -d dist"`
3. Add homepage field: `"homepage": "https://yourusername.github.io/repository-name"`
4. Run: `npm run build && npm run deploy`

## Production Configuration

### Environment Variables for Production
```bash
VITE_APP_TITLE="StackTrek - Interactive Data Structures"
NODE_ENV="production"
```

### Build Optimization
The project is already optimized with:
- Vite for fast builds
- TypeScript for type safety
- Tree shaking for smaller bundles
- Code splitting for better performance

## Live Demo Features

Once deployed, users can:
- Explore interactive data structure visualizations
- Try the tutorial system
- Test responsive design on mobile devices
- Experience smooth D3.js animations
- Navigate through the complete learning platform

## Monitoring and Analytics

For portfolio purposes, consider adding:
- Google Analytics for usage tracking
- Error monitoring (Sentry)
- Performance monitoring

## Custom Domain (Optional)

Both Netlify and Vercel offer free custom domain support:
1. Purchase domain from any registrar
2. Configure DNS settings in deployment platform
3. Enable HTTPS (automatic)

## Maintenance

The deployed site will:
- Auto-deploy on Git pushes (if configured)
- Handle React routing correctly
- Serve optimized static assets
- Work offline (with service worker if added)

**Estimated deployment time: 5-10 minutes**
**Cost: Free for personal/portfolio use**
