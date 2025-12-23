// ========================================
// ENVIRONMENT VARIABLES - DEVELOPMENT
// ========================================
// This file is used for local development only
// Production uses Netlify Functions

window.ENV_CONFIG = {
    // App credentials (shared across all pages)
    APP1_ID: 'OEK4DDLSS5',
    APP1_API_KEY: 'e348a6cb64b1f67bf1955d4bb2f76e26',

    APP2_ID: 'T3J6BKODKM',
    APP2_API_KEY: '85be8167f9237efc6997e81f8af59f73',

    // Page 1 - Details Comparison
    PAGE1_NAME: 'families_bd554087-26c7-47ff-9732-d1eccaa962a9',
    PAGE1_INDEX1_NAME: 'families_bd554087-26c7-47ff-9732-d1eccaa962a9',
    PAGE1_INDEX1_MODE: 'keyword',
    PAGE1_INDEX2_NAME: 'families_bd554087-26c7-47ff-9732-d1eccaa962a9_ns',
    PAGE1_INDEX2_MODE: 'neural',

    // Page 2 - Configure your own indices
    PAGE2_NAME: 'details_bd554087-26c7-47ff-9732-d1eccaa962a9',
    PAGE2_INDEX1_NAME: 'details_bd554087-26c7-47ff-9732-d1eccaa962a9',
    PAGE2_INDEX1_MODE: 'keyword',
    PAGE2_INDEX2_NAME: 'details_bd554087-26c7-47ff-9732-d1eccaa962a_ns',
    PAGE2_INDEX2_MODE: 'neural',

    // Page 3 - Configure your own indices
    PAGE3_NAME: 'details_c7460c61-f6ae-4539-8d92-1ea1aac65e51',
    PAGE3_INDEX1_NAME: 'details_c7460c61-f6ae-4539-8d92-1ea1aac65e51',
    PAGE3_INDEX1_MODE: 'keyword',
    PAGE3_INDEX2_NAME: 'details_c7460c61-f6ae-4539-8d92-1ea1aac65e51_ns',
    PAGE3_INDEX2_MODE: 'neural',

    // Display attributes for Page 1
    PAGE1_TITLE_ATTR: 'familyName',
    PAGE1_IMAGE_ATTR: 'primaryThumbnailPath',
    PAGE1_FIELD1_ATTR: 'familyCategory',
    PAGE1_FIELD1_LABEL: 'Category',
    PAGE1_FIELD2_ATTR: 'createdAt',
    PAGE1_FIELD2_LABEL: 'CreatedAt',

    // Display attributes for Pages 2 & 3 (shared)
    PAGE2_3_TITLE_ATTR: 'viewName',
    PAGE2_3_IMAGE_ATTR: 'pdfFileUrl',
    PAGE2_3_FIELD1_ATTR: 'detailType',
    PAGE2_3_FIELD1_LABEL: 'Details',
    PAGE2_3_FIELD2_ATTR: 'createdAt',
    PAGE2_3_FIELD2_LABEL: 'createdAt',

    HITS_PER_PAGE: '18'
};
