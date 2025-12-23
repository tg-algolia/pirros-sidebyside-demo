// ============================================
// CONFIGURATION SECTION
// ============================================

let CONFIG = null;
let currentPage = 1;
let search1 = null;
let search2 = null;

// Page configurations
const PAGES = {
    1: { name: '', index1Name: '', index1Mode: '', index2Name: '', index2Mode: '' },
    2: { name: '', index1Name: '', index1Mode: '', index2Name: '', index2Mode: '' },
    3: { name: '', index1Name: '', index1Mode: '', index2Name: '', index2Mode: '' }
};

// Load configuration from Netlify function or fallback to local config
async function loadConfig() {
    try {
        // Try to load from Netlify function first (production)
        const response = await fetch('/.netlify/functions/config');
        if (response.ok) {
            const envConfig = await response.json();
            return parseConfig(envConfig);
        }
        throw new Error('Netlify function not available');
    } catch (error) {
        // Fallback to local config (development)
        if (window.ENV_CONFIG) {
            return parseConfig(window.ENV_CONFIG);
        }
        throw error;
    }
}

function parseConfig(envConfig) {
    // Parse page configurations with their specific attributes
    PAGES[1] = {
        name: envConfig.PAGE1_NAME || 'Page 1',
        index1Name: envConfig.PAGE1_INDEX1_NAME,
        index1Mode: envConfig.PAGE1_INDEX1_MODE || 'keyword',
        index2Name: envConfig.PAGE1_INDEX2_NAME,
        index2Mode: envConfig.PAGE1_INDEX2_MODE || 'neural',
        attributes: {
            titleAttr: envConfig.PAGE1_TITLE_ATTR,
            imageAttr: envConfig.PAGE1_IMAGE_ATTR,
            field1Attr: envConfig.PAGE1_FIELD1_ATTR,
            field1Label: envConfig.PAGE1_FIELD1_LABEL,
            field2Attr: envConfig.PAGE1_FIELD2_ATTR,
            field2Label: envConfig.PAGE1_FIELD2_LABEL
        }
    };

    PAGES[2] = {
        name: envConfig.PAGE2_NAME || 'Page 2',
        index1Name: envConfig.PAGE2_INDEX1_NAME,
        index1Mode: envConfig.PAGE2_INDEX1_MODE || 'keyword',
        index2Name: envConfig.PAGE2_INDEX2_NAME,
        index2Mode: envConfig.PAGE2_INDEX2_MODE || 'neural',
        attributes: {
            titleAttr: envConfig.PAGE2_3_TITLE_ATTR,
            imageAttr: envConfig.PAGE2_3_IMAGE_ATTR,
            field1Attr: envConfig.PAGE2_3_FIELD1_ATTR,
            field1Label: envConfig.PAGE2_3_FIELD1_LABEL,
            field2Attr: envConfig.PAGE2_3_FIELD2_ATTR,
            field2Label: envConfig.PAGE2_3_FIELD2_LABEL
        }
    };

    PAGES[3] = {
        name: envConfig.PAGE3_NAME || 'Page 3',
        index1Name: envConfig.PAGE3_INDEX1_NAME,
        index1Mode: envConfig.PAGE3_INDEX1_MODE || 'keyword',
        index2Name: envConfig.PAGE3_INDEX2_NAME,
        index2Mode: envConfig.PAGE3_INDEX2_MODE || 'neural',
        attributes: {
            titleAttr: envConfig.PAGE2_3_TITLE_ATTR,
            imageAttr: envConfig.PAGE2_3_IMAGE_ATTR,
            field1Attr: envConfig.PAGE2_3_FIELD1_ATTR,
            field1Label: envConfig.PAGE2_3_FIELD1_LABEL,
            field2Attr: envConfig.PAGE2_3_FIELD2_ATTR,
            field2Label: envConfig.PAGE2_3_FIELD2_LABEL
        }
    };

    return {
        hitsPerPage: parseInt(envConfig.HITS_PER_PAGE) || 18,
        app1: {
            appId: envConfig.APP1_ID,
            apiKey: envConfig.APP1_API_KEY
        },
        app2: {
            appId: envConfig.APP2_ID,
            apiKey: envConfig.APP2_API_KEY
        }
    };
}

// Initialize app on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        CONFIG = await loadConfig();
        initializeTabs();
        initializeSearch();
    } catch (error) {
        console.error('Failed to load configuration:', error);
        alert('Failed to load configuration. Please check your setup.');
    }
});

function initializeTabs() {
    // Update tab labels
    document.getElementById('tab1Label').textContent = PAGES[1].name;
    document.getElementById('tab2Label').textContent = PAGES[2].name;
    document.getElementById('tab3Label').textContent = PAGES[3].name;

    // Add click handlers to tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const page = parseInt(tab.dataset.page);
            switchToPage(page);
        });
    });
}

function switchToPage(page) {
    if (page === currentPage) return;

    currentPage = page;

    // Update active tab
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.toggle('active', parseInt(tab.dataset.page) === page);
    });

    // Dispose current search instances
    if (search1) {
        search1.dispose();
        search1 = null;
    }
    if (search2) {
        search2.dispose();
        search2 = null;
    }

    // Clear search containers
    document.getElementById('searchbox').innerHTML = '';
    document.getElementById('stats1').innerHTML = '';
    document.getElementById('hits1').innerHTML = '';
    document.getElementById('pagination1').innerHTML = '';
    document.getElementById('stats2').innerHTML = '';
    document.getElementById('hits2').innerHTML = '';
    document.getElementById('pagination2').innerHTML = '';

    // Initialize new search instances
    initializeSearch();
}

function initializeSearch() {
    const pageConfig = PAGES[currentPage];

    // Update index titles with search mode indicator
    document.getElementById('index1Title').textContent = `${pageConfig.index1Name} (${pageConfig.index1Mode.toUpperCase()})`;
    document.getElementById('index2Title').textContent = `${pageConfig.index2Name} (${pageConfig.index2Mode.toUpperCase()})`;

    // Initialize both search instances
    initializeSearchInstance1(
        CONFIG.app1.appId,
        CONFIG.app1.apiKey,
        pageConfig.index1Name,
        pageConfig.index1Mode,
        pageConfig.attributes
    );

    initializeSearchInstance2(
        CONFIG.app2.appId,
        CONFIG.app2.apiKey,
        pageConfig.index2Name,
        pageConfig.index2Mode,
        pageConfig.attributes
    );
}

function initializeSearchInstance1(appId, apiKey, indexName, searchMode, attributes) {
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
                                ${hit[attributes.imageAttr]
                                    ? html`<img src="${hit[attributes.imageAttr]}" alt="${hit[attributes.titleAttr] || 'Product'}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2214%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'" />`
                                    : html`<div class="no-image">No Image</div>`
                                }
                            </div>
                            <div class="hit-content">
                                <h3 class="hit-title">${components.Highlight({ attribute: attributes.titleAttr, hit })}</h3>
                                <div class="hit-fields">
                                    <div class="hit-field">
                                        <span class="field-label">${attributes.field1Label}:</span>
                                        <span class="field-value">${hit[attributes.field1Attr] || 'N/A'}</span>
                                    </div>
                                    <div class="hit-field">
                                        <span class="field-label">${attributes.field2Label}:</span>
                                        <span class="field-value">${hit[attributes.field2Attr] || 'N/A'}</span>
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

function initializeSearchInstance2(appId, apiKey, indexName, searchMode, attributes) {
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
                                ${hit[attributes.imageAttr]
                                    ? html`<img src="${hit[attributes.imageAttr]}" alt="${hit[attributes.titleAttr] || 'Product'}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2214%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'" />`
                                    : html`<div class="no-image">No Image</div>`
                                }
                            </div>
                            <div class="hit-content">
                                <h3 class="hit-title">${components.Highlight({ attribute: attributes.titleAttr, hit })}</h3>
                                <div class="hit-fields">
                                    <div class="hit-field">
                                        <span class="field-label">${attributes.field1Label}:</span>
                                        <span class="field-value">${hit[attributes.field1Attr] || 'N/A'}</span>
                                    </div>
                                    <div class="hit-field">
                                        <span class="field-label">${attributes.field2Label}:</span>
                                        <span class="field-value">${hit[attributes.field2Attr] || 'N/A'}</span>
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
