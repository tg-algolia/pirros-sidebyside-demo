#!/bin/bash

# Build script for Netlify deployment
# This script injects environment variables into the JavaScript file

echo "Starting build process..."

# Check if environment variables are set
if [ -z "$NETLIFY_ALGOLIA_APP1_ID" ] || [ -z "$NETLIFY_ALGOLIA_APP1_KEY" ] || \
   [ -z "$NETLIFY_ALGOLIA_APP2_ID" ] || [ -z "$NETLIFY_ALGOLIA_APP2_KEY" ]; then
    echo "Warning: Not all environment variables are set. Using default values from code."
    exit 0
fi

echo "Injecting environment variables into app.js..."

# Create a temporary file with environment variables injected
cat > env-inject.js << EOF
// Netlify Environment Variables (injected during build)
const NETLIFY_ALGOLIA_APP1_ID = '${NETLIFY_ALGOLIA_APP1_ID}';
const NETLIFY_ALGOLIA_APP1_KEY = '${NETLIFY_ALGOLIA_APP1_KEY}';
const NETLIFY_ALGOLIA_APP2_ID = '${NETLIFY_ALGOLIA_APP2_ID}';
const NETLIFY_ALGOLIA_APP2_KEY = '${NETLIFY_ALGOLIA_APP2_KEY}';

EOF

# Prepend the environment variables to app.js
cat env-inject.js app.js > app-build.js
mv app-build.js app.js
rm env-inject.js

echo "Build complete! Environment variables injected."
