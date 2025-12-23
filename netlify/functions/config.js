// ========================================
// NETLIFY FUNCTION - ENVIRONMENT CONFIG
// ========================================
// Returns environment variables for the frontend
// Set environment variables in Netlify dashboard

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers
        };
    }

    try {
        // Extract environment variables
        const config = {
            INDEX1_APP_ID: process.env.INDEX1_APP_ID || 'HWJ52H4D98',
            INDEX1_API_KEY: process.env.INDEX1_API_KEY || 'acf4472d88acbb00d11d755012189218',
            INDEX1_INDEX_NAME: process.env.INDEX1_INDEX_NAME || 'product_catalog',
            INDEX1_SEARCH_MODE: process.env.INDEX1_SEARCH_MODE || 'keyword',

            INDEX2_APP_ID: process.env.INDEX2_APP_ID || 'T3J6BKODKM',
            INDEX2_API_KEY: process.env.INDEX2_API_KEY || '85be8167f9237efc6997e81f8af59f73',
            INDEX2_INDEX_NAME: process.env.INDEX2_INDEX_NAME || 'demo_rot_ns',
            INDEX2_SEARCH_MODE: process.env.INDEX2_SEARCH_MODE || 'neural',

            TITLE_ATTR: process.env.TITLE_ATTR || 'title',
            IMAGE_ATTR: process.env.IMAGE_ATTR || 'lifestyleImage',
            FIELD1_ATTR: process.env.FIELD1_ATTR || 'product-style',
            FIELD1_LABEL: process.env.FIELD1_LABEL || 'Style',
            FIELD2_ATTR: process.env.FIELD2_ATTR || 'brand',
            FIELD2_LABEL: process.env.FIELD2_LABEL || 'Brand',

            HITS_PER_PAGE: process.env.HITS_PER_PAGE || '18'
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(config)
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to load configuration',
                message: error.message
            })
        };
    }
};
