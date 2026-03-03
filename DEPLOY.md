# Cloudflare Pages Deployment

## Deploy from command line

```bash
npm run deploy
```

This will:
1. Build the project (with source maps disabled for Cloudflare's 25 MiB limit)
2. Deploy the `build/` folder to Cloudflare Pages

## First-time setup

1. **Install dependencies** (includes Wrangler):
   ```bash
   npm install
   ```

2. **Log in to Cloudflare**:
   ```bash
   npx wrangler login
   ```
   This opens a browser to authenticate with your Cloudflare account.

3. **Deploy**:
   ```bash
   npm run deploy
   ```

## URLs

- **Pages**: https://lifesmart-home.pages.dev
- **Custom domain**: https://home.lifesmartfinance.com

The custom domain is configured in the Cloudflare dashboard (Workers & Pages → lifesmart-home → Custom domains).

## CI/CD

If you use Cloudflare's GitHub integration, deployments also run automatically on push. The `npm run deploy` command is for manual deployments from your machine.
