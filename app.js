// ============================================
// CONFIGURATION SECTION
// ============================================

let CONFIG = null;
let search1 = null;
let search2 = null;

// Load configuration from Netlify function or fallback to local config
async function loadConfig() {
    try {
        // Try to load from Netlify function first (production)
        const response = await fetch('/.netlify/functions/config');
        if (response.ok) {
            const envConfig = await response.json();
            return {
                hitsPerPage: parseInt(envConfig.HITS_PER_PAGE) || 18,
                index1: {
                    appId: envConfig.INDEX1_APP_ID,
                    apiKey: envConfig.INDEX1_API_KEY,
                    indexName: envConfig.INDEX1_INDEX_NAME,
                    searchMode: envConfig.INDEX1_SEARCH_MODE
                },
                index2: {
                    appId: envConfig.INDEX2_APP_ID,
                    apiKey: envConfig.INDEX2_API_KEY,
                    indexName: envConfig.INDEX2_INDEX_NAME,
                    searchMode: envConfig.INDEX2_SEARCH_MODE
                },
                attributes: {
                    titleAttr: envConfig.TITLE_ATTR,
                    imageAttr: envConfig.IMAGE_ATTR,
                    field1Attr: envConfig.FIELD1_ATTR,
                    field1Label: envConfig.FIELD1_LABEL,
                    field2Attr: envConfig.FIELD2_ATTR,
                    field2Label: envConfig.FIELD2_LABEL
                }
            };
        }
        throw new Error('Netlify function not available');
    } catch (error) {
        // Fallback to local config (development)
        if (window.ENV_CONFIG) {
            return {
                hitsPerPage: parseInt(window.ENV_CONFIG.HITS_PER_PAGE) || 18,
                index1: {
                    appId: window.ENV_CONFIG.INDEX1_APP_ID,
                    apiKey: window.ENV_CONFIG.INDEX1_API_KEY,
                    indexName: window.ENV_CONFIG.INDEX1_INDEX_NAME,
                    searchMode: window.ENV_CONFIG.INDEX1_SEARCH_MODE
                },
                index2: {
                    appId: window.ENV_CONFIG.INDEX2_APP_ID,
                    apiKey: window.ENV_CONFIG.INDEX2_API_KEY,
                    indexName: window.ENV_CONFIG.INDEX2_INDEX_NAME,
                    searchMode: window.ENV_CONFIG.INDEX2_SEARCH_MODE
                },
                attributes: {
                    titleAttr: window.ENV_CONFIG.TITLE_ATTR,
                    imageAttr: window.ENV_CONFIG.IMAGE_ATTR,
                    field1Attr: window.ENV_CONFIG.FIELD1_ATTR,
                    field1Label: window.ENV_CONFIG.FIELD1_LABEL,
                    field2Attr: window.ENV_CONFIG.FIELD2_ATTR,
                    field2Label: window.ENV_CONFIG.FIELD2_LABEL
                }
            };
        }
        throw error;
    }
}

// Initialize app on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        CONFIG = await loadConfig();
        initializeSearch();
    } catch (error) {
        console.error('Failed to load configuration:', error);
        alert('Failed to load configuration. Please check your setup.');
    }
});

function initializeSearch() {
    // Update index titles with search mode indicator
    document.getElementById('index1Title').textContent = `${CONFIG.index1.indexName} (${CONFIG.index1.searchMode.toUpperCase()})`;
    document.getElementById('index2Title').textContent = `${CONFIG.index2.indexName} (${CONFIG.index2.searchMode.toUpperCase()})`;

    // Initialize both search instances
    initializeSearchInstance1(CONFIG.index1.appId, CONFIG.index1.apiKey, CONFIG.index1.indexName, CONFIG.index1.searchMode);
    initializeSearchInstance2(CONFIG.index2.appId, CONFIG.index2.apiKey, CONFIG.index2.indexName, CONFIG.index2.searchMode);
}

function initializeSearchInstance1(appId, apiKey, indexName, searchMode) {
    const searchClient1 = algoliasearch(appId, apiKey);

    const instantSearchConfig = {
        indexName: indexName,
        searchClient: searchClient1,
        insights: false
    };

    // Add search parameters based on mode
    if (searchMode === 'neural') {
        instantSearchConfig.searchParameters = {
            mode: 'neuralSearch',
            hitsPerPage: CONFIG.hitsPerPage
        };
    } else {
        instantSearchConfig.searchParameters = {
            hitsPerPage: CONFIG.hitsPerPage
        };
    }

    search1 = instantsearch(instantSearchConfig);

    // Add configure widget first to ensure hitsPerPage is set
    search1.addWidgets([
        instantsearch.widgets.configure({
            hitsPerPage: CONFIG.hitsPerPage
        })
    ]);

    // Add search box widget (shared between both searches)
    if (!document.getElementById('searchbox').hasChildNodes()) {
        search1.addWidgets([
            instantsearch.widgets.searchBox({
                container: '#searchbox',
                placeholder: 'Search both indices...',
                showReset: true,
                showSubmit: true,
                cssClasses: {
                    root: 'search-box',
                    form: 'search-box-form',
                    input: 'search-box-input',
                    submit: 'search-box-submit',
                    reset: 'search-box-reset'
                }
            })
        ]);
    }

    // Add stats widget
    search1.addWidgets([
        instantsearch.widgets.stats({
            container: '#stats1',
            cssClasses: {
                root: 'stats',
                text: 'stats-text'
            }
        })
    ]);

    // Add hits widget with custom template
    search1.addWidgets([
        instantsearch.widgets.hits({
            container: '#hits1',
            cssClasses: {
                root: 'hits',
                list: 'hits-list',
                item: 'hit-item'
            },
            templates: {
                item(hit, { html, components }) {
                    return html`
                        <div class="hit-card">
                            <div class="hit-image">
                                ${hit[CONFIG.attributes.imageAttr]
                                    ? html`<img src="${hit[CONFIG.attributes.imageAttr]}" alt="${hit[CONFIG.attributes.titleAttr] || 'Product'}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2214%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'" />`
                                    : html`<div class="no-image">No Image</div>`
                                }
                            </div>
                            <div class="hit-content">
                                <h3 class="hit-title">${components.Highlight({ attribute: CONFIG.attributes.titleAttr, hit })}</h3>
                                <div class="hit-fields">
                                    <div class="hit-field">
                                        <span class="field-label">${CONFIG.attributes.field1Label}:</span>
                                        <span class="field-value">${hit[CONFIG.attributes.field1Attr] || 'N/A'}</span>
                                    </div>
                                    <div class="hit-field">
                                        <span class="field-label">${CONFIG.attributes.field2Label}:</span>
                                        <span class="field-value">${hit[CONFIG.attributes.field2Attr] || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                },
                empty(results, { html }) {
                    return html`<div class="no-results">No results found for <q>${results.query}</q></div>`;
                }
            }
        })
    ]);

    // Add pagination widget for index 1
    search1.addWidgets([
        instantsearch.widgets.pagination({
            container: '#pagination1',
            cssClasses: {
                root: 'pagination',
                list: 'pagination-list',
                item: 'pagination-item',
                link: 'pagination-link',
                selectedItem: 'pagination-item-selected',
                disabledItem: 'pagination-item-disabled'
            }
        })
    ]);

    search1.start();
}

function initializeSearchInstance2(appId, apiKey, indexName, searchMode) {
    const searchClient2 = algoliasearch(appId, apiKey);

    const instantSearchConfig = {
        indexName: indexName,
        searchClient: searchClient2,
        insights: false
    };

    // Add search parameters based on mode
    if (searchMode === 'neural') {
        instantSearchConfig.searchParameters = {
            mode: 'neuralSearch',
            hitsPerPage: CONFIG.hitsPerPage
        };
    } else {
        instantSearchConfig.searchParameters = {
            hitsPerPage: CONFIG.hitsPerPage
        };
    }

    search2 = instantsearch(instantSearchConfig);

    // Add configure widget first to ensure hitsPerPage is set
    search2.addWidgets([
        instantsearch.widgets.configure({
            hitsPerPage: CONFIG.hitsPerPage
        })
    ]);

    // Add stats widget
    search2.addWidgets([
        instantsearch.widgets.stats({
            container: '#stats2',
            cssClasses: {
                root: 'stats',
                text: 'stats-text'
            }
        })
    ]);

    // Add hits widget with custom template
    search2.addWidgets([
        instantsearch.widgets.hits({
            container: '#hits2',
            cssClasses: {
                root: 'hits',
                list: 'hits-list',
                item: 'hit-item'
            },
            templates: {
                item(hit, { html, components }) {
                    return html`
                        <div class="hit-card">
                            <div class="hit-image">
                                ${hit[CONFIG.attributes.imageAttr]
                                    ? html`<img src="${hit[CONFIG.attributes.imageAttr]}" alt="${hit[CONFIG.attributes.titleAttr] || 'Product'}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2214%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'" />`
                                    : html`<div class="no-image">No Image</div>`
                                }
                            </div>
                            <div class="hit-content">
                                <h3 class="hit-title">${components.Highlight({ attribute: CONFIG.attributes.titleAttr, hit })}</h3>
                                <div class="hit-fields">
                                    <div class="hit-field">
                                        <span class="field-label">${CONFIG.attributes.field1Label}:</span>
                                        <span class="field-value">${hit[CONFIG.attributes.field1Attr] || 'N/A'}</span>
                                    </div>
                                    <div class="hit-field">
                                        <span class="field-label">${CONFIG.attributes.field2Label}:</span>
                                        <span class="field-value">${hit[CONFIG.attributes.field2Attr] || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                },
                empty(results, { html }) {
                    return html`<div class="no-results">No results found for <q>${results.query}</q></div>`;
                }
            }
        })
    ]);

    // Add pagination widget for index 2
    search2.addWidgets([
        instantsearch.widgets.pagination({
            container: '#pagination2',
            cssClasses: {
                root: 'pagination',
                list: 'pagination-list',
                item: 'pagination-item',
                link: 'pagination-link',
                selectedItem: 'pagination-item-selected',
                disabledItem: 'pagination-item-disabled'
            }
        })
    ]);

    search2.start();

    // Sync search state between both instances
    syncSearchInstances();
}

function syncSearchInstances() {
    if (!search1 || !search2) return;

    // When search1 query or page changes, update search2
    search1.on('render', () => {
        const query = search1.helper.state.query;
        const page = search1.helper.state.page;

        if (search2.helper.state.query !== query) {
            search2.helper.setQuery(query).search();
        }

        if (search2.helper.state.page !== page) {
            search2.helper.setPage(page).search();
        }
    });

    // When search2 query or page changes, update search1
    search2.on('render', () => {
        const query = search2.helper.state.query;
        const page = search2.helper.state.page;

        if (search1.helper.state.query !== query) {
            search1.helper.setQuery(query).search();
        }

        if (search1.helper.state.page !== page) {
            search1.helper.setPage(page).search();
        }
    });
}
