# Netlify Deployment Setup Instructions

This document explains how to deploy this Algolia Index Comparison Tool to Netlify with secure environment variables.

## Environment Variables Setup

### Step 1: Access Netlify Site Settings

1. Log in to your [Netlify account](https://app.netlify.com/)
2. Navigate to your site's dashboard
3. Click on **Site settings**
4. Go to **Environment variables** (or **Build & deploy** > **Environment**)

### Step 2: Add Environment Variables

This application uses **two different Algolia applications** for comparison scenarios. Add the following environment variables:

| Variable Name | Description | Example Value |
|--------------|-------------|---------------|
| `NETLIFY_ALGOLIA_APP1_ID` | Algolia App 1 Application ID | `OEK4DDLSS5` |
| `NETLIFY_ALGOLIA_APP1_KEY` | Algolia App 1 Search-Only API Key | `e348a6cb64b1f67bf1955d4bb2f76e26` |
| `NETLIFY_ALGOLIA_APP2_ID` | Algolia App 2 Application ID | `T3J6BKODKM` |
| `NETLIFY_ALGOLIA_APP2_KEY` | Algolia App 2 Search-Only API Key | `85be8167f9237efc6997e81f8af59f73` |

**Important Security Notes:**
- Use your **Search-Only API Keys** (not the Admin API Keys)
- Search-Only API Keys are safe to expose in client-side code
- Never use your Admin API Keys in frontend applications

### Step 3: Deploy

Once you've added the environment variables:

1. Push your code to your Git repository (GitHub, GitLab, or Bitbucket)
2. Netlify will automatically detect the changes and trigger a new build
3. The build process will inject your environment variables into the JavaScript

Alternatively, you can trigger a manual deploy:
1. Go to **Deploys** tab in Netlify
2. Click **Trigger deploy** > **Clear cache and deploy site**

## How It Works

### Build Process

The `build.sh` script runs during Netlify deployment and:
1. Checks if environment variables are set
2. Injects them into the JavaScript code at build time
3. Replaces the default fallback values with your secure credentials

### Fallback Values

If environment variables are not set, the application will use the default values defined in `app.js`:
```javascript
const ALGOLIA_APP1_ID = typeof NETLIFY_ALGOLIA_APP1_ID !== 'undefined' ? NETLIFY_ALGOLIA_APP1_ID : 'OEK4DDLSS5';
const ALGOLIA_APP1_KEY = typeof NETLIFY_ALGOLIA_APP1_KEY !== 'undefined' ? NETLIFY_ALGOLIA_APP1_KEY : 'e348a6cb64b1f67bf1955d4bb2f76e26';
const ALGOLIA_APP2_ID = typeof NETLIFY_ALGOLIA_APP2_ID !== 'undefined' ? NETLIFY_ALGOLIA_APP2_ID : 'T3J6BKODKM';
const ALGOLIA_APP2_KEY = typeof NETLIFY_ALGOLIA_APP2_KEY !== 'undefined' ? NETLIFY_ALGOLIA_APP2_KEY : '85be8167f9237efc6997e81f8af59f73';
```

This allows the application to work in development without Netlify while still being secure in production.

## Testing Locally

To test the application locally:

1. Open `index.html` in a web browser
2. The default credentials will be used automatically
3. Click "⚙️ Select Comparison Scenario" to choose a comparison scenario
4. Your selection will be saved in browser localStorage

## Troubleshooting

### Environment Variables Not Working

1. Verify the variable names are exactly: `NETLIFY_ALGOLIA_APP1_ID`, `NETLIFY_ALGOLIA_APP1_KEY`, `NETLIFY_ALGOLIA_APP2_ID`, `NETLIFY_ALGOLIA_APP2_KEY`
2. Clear the build cache and redeploy
3. Check the deploy logs for any build errors

### Search Not Working

1. Verify your API keys have search permissions
2. Check that the index names in app.js match your actual Algolia indices
3. Ensure the App IDs and API Keys are correct for each application
4. Open browser console (F12) to check for JavaScript errors

### Build Fails

1. Check the deploy logs in Netlify
2. Ensure `build.sh` has execute permissions (it should be committed with +x)
3. Verify the script syntax is correct

## Support

For issues with:
- **Netlify deployment**: Check [Netlify documentation](https://docs.netlify.com/)
- **Algolia configuration**: Check [Algolia documentation](https://www.algolia.com/doc/)
- **This application**: Open an issue in the repository
