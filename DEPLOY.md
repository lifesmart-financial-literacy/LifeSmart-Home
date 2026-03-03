# Cloudflare Pages Deployment

## Deploy from command line

```bash
npm run deploy
```

This will:
1. Build the project (with source maps disabled for Cloudflare's 25 MiB limit)
2. Deploy the `build/` folder to Cloudflare Pages

**Local deploy uses `.env`** – CRA inlines `REACT_APP_*` variables during build. Copy `.env.example` to `.env` and fill in your Firebase config.

## First-time setup

1. **Install dependencies** (includes Wrangler):
   ```bash
   npm install
   ```

2. **Create `.env`** (for local deploy):
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your Firebase configuration.

3. **Log in to Cloudflare** (for local deploy):
   ```bash
   npx wrangler login
   ```
   This opens a browser to authenticate with your Cloudflare account.

4. **Deploy**:
   ```bash
   npm run deploy
   ```

## URLs

- **Pages**: https://lifesmart-home.pages.dev
- **Custom domain**: https://home.lifesmartfinance.com

The custom domain is configured in the Cloudflare dashboard (Workers & Pages → lifesmart-home → Custom domains).

## CI/CD (GitHub Actions)

On push to `master`, the CI workflow:
1. Runs tests and builds (with env vars from GitHub Secrets)
2. Deploys to Cloudflare Pages via Wrangler

### Required GitHub Secrets

Add these in **Settings → Secrets and variables → Actions**:

| Secret | Used for |
|--------|----------|
| `CLOUDFLARE_API_TOKEN` | Wrangler auth – create in [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens) with "Cloudflare Pages — Edit" |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID (from dashboard URL or Workers & Pages overview) |
| `REACT_APP_FIREBASE_API_KEY` | Firebase config |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Firebase config |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase config |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Firebase config |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Firebase config |
| `REACT_APP_FIREBASE_APP_ID` | Firebase config |
| `REACT_APP_FIREBASE_MEASUREMENT_ID` | Firebase config |

**Note:** If you use Cloudflare's built-in GitHub integration for Pages, consider disabling it to avoid duplicate builds. The GitHub Action builds with secrets and deploys directly.
