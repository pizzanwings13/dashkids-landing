# DashKids Landing - Vercel Deployment Guide

## Project Structure
```
dashkids-landing/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   └── main.tsx       # Entry point
│   └── index.html         # HTML template
├── server/                # Express backend
│   ├── app.ts            # Express app setup
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data storage interface
│   ├── index-dev.ts      # Development server (Vite HMR)
│   └── index-prod.ts     # Production server
├── shared/               # Shared types and schemas
│   └── schema.ts         # Data models
├── api/                  # Vercel serverless functions
│   └── [...route].ts     # Catch-all route handler
├── vite.config.ts        # Vite configuration
├── vercel.json           # Vercel deployment config
├── package.json          # Dependencies and scripts
└── tailwind.config.ts    # Tailwind CSS configuration
```

## Key Files for Vercel Deployment

### vercel.json
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "env": {
    "NODE_ENV": "production"
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api/[...route]"
    }
  ]
}
```

### api/[...route].ts
- Handles all incoming requests (static files, API routes, SPA routing)
- Serves built frontend from `dist/public`
- Falls back to `index.html` for client-side routing

## Build Process
```bash
# Local development
npm run dev                # Starts dev server with Vite HMR on port 5000

# Production build
npm run build              # Builds frontend (Vite) + backend (esbuild)
                          # Output: dist/index.js (server) + dist/public/ (frontend)

# Run production build locally
npm start                  # Runs: NODE_ENV=production node dist/index.js
```

## Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Vercel Auto-Deploy**
   - Vercel automatically detects pushes to main branch
   - Runs: `npm install` → `npm run build` → deploys
   - Your app is live at: `dashkids-landing-xxx.vercel.app`

3. **Manual Redeploy** (if needed)
   - Go to vercel.com → Your Project
   - Click "Deployments" tab
   - Click redeploy on latest deployment

## Environment Variables (Vercel)
If you need to add env vars in production:
1. Go to Project Settings → Environment Variables
2. Add variables (they'll be available as `process.env.VAR_NAME`)

## Troubleshooting

### App shows code instead of rendered page
- Check Vercel deployment logs for errors
- Ensure `api/[...route].ts` exists and is configured correctly
- Verify `dist/public/index.html` is being built

### 404 errors on static assets
- Check that assets are in `dist/public/assets/`
- Verify cache headers in `api/[...route].ts`

### API routes not working
- API requests should go to `/api/*`
- Check `server/routes.ts` for your endpoints
- Verify they return valid JSON

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express + Node.js
- **Database**: PostgreSQL (optional, via Neon)
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Deployment**: Vercel (Serverless Functions)

## Important Files to Never Edit
- `vite.config.ts` - Configured for Replit
- `package.json` - Use npm install for dependencies
- `drizzle.config.ts` - Database config

## Support
For Vercel-specific issues, check:
- Deployment logs: vercel.com → Project → Deployments
- Vercel Docs: https://vercel.com/docs
- This repo: github.com/pizzanwings13/dashkids-landing
