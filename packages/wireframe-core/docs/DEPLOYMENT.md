# Deployment Guide

Deploy your wireframe platform to various hosting providers. This guide covers setup for Replit, Vercel, and general deployment considerations.

## Table of Contents

- [Quick Start](#quick-start)
- [Replit Deployment](#replit-deployment)
- [Vercel Deployment](#vercel-deployment)
- [Environment Variables](#environment-variables)
- [Build Configuration](#build-configuration)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

All deployment configurations are pre-configured in the repository:

- **Replit**: `.replit` and `replit.nix` files ready to use
- **Vercel**: `vercel.json` configured for monorepo setup

### Pre-Deployment Checklist

Before deploying to any platform:

1. **Ensure you have at least one wireframe project:**

   ```bash
   npm run init
   ```

2. **Test the build locally:**

   ```bash
   npm run build:project
   ```

3. **Verify the build output:**

   ```bash
   npm run preview
   ```

   Visit <http://localhost:4173> to test the production build

4. **Commit your changes:**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   ```

---

## Replit Deployment

Replit provides zero-config hosting with automatic HTTPS and built-in IDE.

### Setup (Automatic)

1. **Import repository to Replit:**
   - Go to [Replit](https://replit.com)
   - Click "Create Repl" → "Import from GitHub"
   - Paste your repository URL
   - Replit auto-detects configuration from `.replit`

2. **Click "Run":**
   - Replit automatically runs `npm install && npm run dev`
   - Dev server starts on port 8080
   - Webview shows your wireframe platform

### Setup (Manual)

If auto-detection fails:

1. **Configure Run Command:**

   ```
   Run button → Shell → npm install && npm run dev
   ```

2. **Set Environment Variables:**
   - Go to "Secrets" tab (lock icon in sidebar)
   - Add: `NODE_ENV = development`

3. **Configure Port:**
   - Replit auto-forwards port 8080
   - If needed, update in `.replit` file under `[[ports]]`

### Production Deployment on Replit

To deploy a production build:

1. **Update `.replit` deployment section** (already configured):

   ```toml
   [deployment]
   run = ["npm", "run", "build:project"]
   deploymentTarget = "static"
   publicDir = "projects/YOUR-PROJECT/dist"
   ```

2. **Click "Deploy"** in Replit:
   - Builds project with `npm run build:project`
   - Serves from `dist/` directory
   - Gets permanent URL: `https://your-repl-name.repl.co`

### Replit Pro Tips

- **Always On**: Upgrade to Hacker plan for 24/7 uptime
- **Custom Domain**: Link your domain in deployment settings
- **Environment Management**: Use Replit Secrets for API keys
- **Collaboration**: Invite team members to edit together

---

## Vercel Deployment

Vercel specializes in static sites and serverless functions with global CDN.

### Setup via Git (Recommended)

1. **Push to GitHub/GitLab/Bitbucket:**

   ```bash
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to [Vercel](https://vercel.com)
   - Click "Add New" → "Project"
   - Select your repository
   - Vercel auto-detects `vercel.json` configuration

3. **Configure Project:**
   - **Framework Preset**: Other
   - **Build Command**: `npm run build:project` (auto-detected)
   - **Output Directory**: `projects/YOUR-PROJECT/dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Deploy:**
   - Click "Deploy"
   - Vercel builds and deploys
   - Get production URL: `https://your-project.vercel.app`

### Setup via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Continuous Deployment

Vercel automatically deploys on every push to your main branch:

- **Production**: Deploys from `main` branch
- **Preview**: Deploys from feature branches
- **Instant Rollback**: Revert to previous deployment in one click

### Custom Domain

1. Go to project settings → Domains
2. Add your domain (e.g., `wireframes.yourdomain.com`)
3. Configure DNS (Vercel provides instructions)
4. SSL certificate auto-provisions

### Vercel Pro Tips

- **Environment Variables**: Set in Project Settings → Environment Variables
- **Preview Deployments**: Every PR gets a unique preview URL
- **Edge Network**: 90+ global edge locations for fast loading
- **Analytics**: Enable Web Analytics in project settings

---

## Environment Variables

### Development

Set locally in `.env` file (git-ignored):

```bash
NODE_ENV=development
VITE_API_URL=http://localhost:3000
```

### Production

**Replit:**

- Use "Secrets" tab in sidebar
- Auto-injects into process.env

**Vercel:**

- Project Settings → Environment Variables
- Choose environment: Production / Preview / Development

### Common Variables

```bash
# Required
NODE_ENV=production

# Optional
VITE_API_URL=https://api.yourdomain.com
VITE_ANALYTICS_ID=your-analytics-id
```

**Note**: Variables must be prefixed with `VITE_` to be exposed to client-side code.

---

## Build Configuration

### Monorepo Considerations

This is a monorepo with multiple projects. The build system handles:

1. **Default Project**: Set in `wireframe.config.json`
2. **Build Command**: `npm run build:project` builds default project
3. **Output**: Goes to `projects/YOUR-PROJECT/dist/`

### Build for Specific Project

```bash
# Option 1: Update wireframe.config.json
{
  "defaultProject": "my-project"
}

# Option 2: Build specific workspace
npm run build -w projects/my-project
```

### Build Optimization

**Reduce bundle size:**

```bash
# Analyze bundle
npm run build:project
du -sh projects/*/dist

# Optimize images
# Use WebP format for screenshots
# Lazy load heavy components
```

**Vite optimization** (already configured):

- Tree-shaking (removes unused code)
- Code splitting (smaller initial bundle)
- Asset optimization (minification)

---

## Troubleshooting

### Build Fails

**Error: "Cannot find module"**

```bash
# Solution: Clean install
rm -rf node_modules package-lock.json
npm install
```

**Error: "Out of memory"**

```bash
# Solution: Increase Node.js memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build:project
```

### Routes Don't Work (404s)

**Problem**: Client-side routing requires SPA rewrites

**Solution for Vercel**: Already configured in `vercel.json`

**Solution for Replit**: Update `.replit` deployment config:

```toml
[deployment]
deploymentTarget = "static"
publicDir = "projects/YOUR-PROJECT/dist"
ignorePaths = []
```

### Environment Variables Not Working

**Development:**

```bash
# Ensure .env file exists
echo "VITE_API_URL=http://localhost:3000" > .env

# Restart dev server
npm run dev
```

**Production:**

- Verify variable names start with `VITE_`
- Check platform-specific settings (Secrets on Replit, Settings on Vercel)
- Redeploy after adding variables

### Slow Build Times

**Optimize:**

```bash
# Clear Vite cache
rm -rf projects/*/node_modules/.vite

# Use build:dev for faster debugging builds
npm run build:dev
```

### Port Already in Use

**Replit:**

- Replit handles port forwarding automatically
- Default: 8080 → External port 80

**Local:**

```bash
# Change port in vite.config.ts
export default {
  server: {
    port: 3000 // Change from 8080
  }
}
```

---

## Other Platforms

### Netlify

Create `netlify.toml`:

```toml
[build]
  command = "npm run build:project"
  publish = "projects/YOUR-PROJECT/dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Render

Create `render.yaml`:

```yaml
services:
  - type: web
    name: wireframe-platform
    env: static
    buildCommand: npm run build:project
    staticPublishPath: projects/YOUR-PROJECT/dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

---

## Performance Tips

### CDN & Caching

**Vercel** (automatic):

- Static assets cached at edge
- Immutable assets (JS/CSS) get long-term cache headers

**Replit**:

- Enable Cloudflare in deployment settings
- Configure cache headers in `.replit`

### Compression

Both platforms automatically enable:

- Gzip compression
- Brotli compression (better than gzip)

### Image Optimization

```bash
# Optimize screenshots before committing
# Use tools like imageoptim, squoosh, or sharp

# Example with sharp (Node.js):
npm install sharp --save-dev
node -e "require('sharp')('input.png').webp({quality:80}).toFile('output.webp')"
```

---

## Security Checklist

Before deploying to production:

- [ ] No hardcoded secrets in code
- [ ] Environment variables set correctly
- [ ] HTTPS enabled (automatic on Vercel/Replit)
- [ ] Security headers configured (`vercel.json` has defaults)
- [ ] Dependencies up to date (`npm audit`)
- [ ] `.env` files in `.gitignore`
- [ ] No console.log() with sensitive data

---

## Support

**Platform Issues:**

- Replit: [Replit Ask](https://ask.replit.com)
- Vercel: [Vercel Support](https://vercel.com/support)

**Framework Issues:**

- GitHub Issues: [Your repo]/issues
- Documentation: See `CLAUDE.md` and `AGENTS.md`

---

**Last Updated**: 2025-10-21
**Framework Version**: 2.0+
