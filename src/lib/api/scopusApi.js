/**
 * Simple implementation of scopus API use case.
 *
 * Can be used fo fetch any data from scopus API.
 * Extend "PATH_*" static properties with API end points
 *
 * To be able to use class on server (nodejs) sire it `fetch` functionality should be unified for both,
 * server and client. Recommendation: use 'isomorphic-fetch' npm module
 * Run `npm i isomorphic-fetch` on terminal project folder
 * Put `import 'isomorphic-fetch';` above `export default...`.
 */

const resultParser = Symbol('resultParser');

export default class ScopusApi {
    /**
     * @type {string} - API URL
     */
    static SCOPUS_URL = 'https://api.elsevier.com/';

    static PATH_DOCUMENT_SEARCH = 'content/search/scopus';

    constructor(uri, apiKey = '', queryExtraParams = {}) {

        this.baseUrl = new URL(this.constructor.SCOPUS_URL + uri);

        this.headers = {
            'X-ELS-APIKey': apiKey,
            'Accept': 'application/json'
        };

        this.queryExtraParams = queryExtraParams;

        this.resultParser = result => result;
    }

    /**
     * resultParser property setter
     * @param parser {function} - new value
     */
    set resultParser(parser) {
        if (typeof parser !== 'function') {
            console.warn('Incorrect result parser type. Parser should be a function.');
            return;
        }

        this[resultParser] = parser;
    }

    /**
     * resultParser property getter
     * @returns {function}
     */
    get resultParser() {
        return this[resultParser];
    }

    /**
     * Request API for data
     * @param params {json} - GET params
     * @returns {Promise<*[]|*>}
     */
    async fetch(params = {}) {
        try {
            const result = await fetch(this.getQueryUrl(params), {
                headers: this.headers
            });

            const data = await result.json();
            return this.resultParser(data);
        } catch (e) {
            console.warn(e);
            return [];
        }
    }

    /**
     * Prepare query url base on API url, path and params
     * @param params {json} - GET params
     * @returns {string}
     */
    getQueryUrl(params) {
        this.baseUrl.search = new URLSearchParams({...this.queryExtraParams, ...params}).toString();
        return this.baseUrl.toString();
    }
}