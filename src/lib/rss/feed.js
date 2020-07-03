import EventEmitter from 'events';

import ScopusApi from '../api/scopusApi';

/**
 * @type {symbol} - Symbol name of the class property
 */
const hasNew = Symbol('hasNew');

/**
 * @type {symbol} - Symbol name of the class property
 */
const api = Symbol('api');

/**
 * Class implement single feed functionality.
 */
export default class Feed extends EventEmitter {
    /**
     * @type {string} - Event happen when new article(s) added to the feed
     */
    static EVENT_NEW_ARTICLES = 'Feed received new articles';

    /**
     * @type {string} - Event happen when the value of hasNew property changed
     */
    static EVENT_HAS_NEW_UPDATED = 'Updated value of hasNew property';

    constructor(query, feed = {}) {
        super();

        /**
         * @type {string} - date YYYY-MM-DD
         */
        this.today = new Date().toISOString().split('T')[0];

        /**
         * @type {string} - feed search query
         */
        this.query = query;

        /**
         * @type {boolean} - identifier, is there new articles that user haven't seen
         */
        this.hasNew = feed.hasNew || false;

        /**
         * @type {string[]} - Indexed Articles ID
         */
        this.indexes = feed.indexes || [];

        /**
         * @type {*|{}} - Articles split by date.
         */
        this.data = feed.data || {}
    }

    /**
     * hasNew property setter
     * @param value {Boolean} - new value
     */
    set hasNew(value) {
        const oldValue = this[hasNew];
        const newValue = Boolean(value);

        if (oldValue !== newValue) {
            this[hasNew] = Boolean(value);
            this.emit(this.constructor.EVENT_HAS_NEW_UPDATED);
        }
    }

    /**
     * hasNew property getter
     * @returns {boolean}
     */
    get hasNew() {
        return this[hasNew];
    }

    /**
     * api property setter
     * @param value {ScopusApi} - new value
     */
    set api(value) {
        if (!(value instanceof ScopusApi)) {
            return;
        }

        this[api] = value;
    }

    /**
     * api property getter
     * @returns {ScopusApi}
     */
    get api() {
        return this[api];
    }

    /**
     * Make data synchronization with search API of the individual feed.
     * @returns {Promise<void>}
     */
    async sync() {
        const articles = await this.api.fetch({ query: this.query });
        this.syncArticles(articles);
    }

    /**
     * Synchronize article list
     * @param articles {*[]} - list of articles
     */
    syncArticles(articles) {
        const newArticles = this.findNewArticles(articles);
        this.updateData(newArticles);
    }

    /**
     * Create list of articles that is not part of the feed
     * @param articles {*[]} - list of articles
     * @returns {*[]} - filtered list of articles
     */
    findNewArticles(articles) {
        const newArticles = [];

        articles.forEach(item => {
            if (this.indexes.includes(item.id)) {
                return;
            }

            newArticles.push(item);
        });
        return newArticles;
    }

    /**
     * Update feed data with new articles.
     * @param newArticles
     */
    updateData(newArticles) {
        if (!newArticles || !newArticles.length) {
            return;
        }

        const indexes = newArticles.map(item => item.id);
        this.indexes = this.indexes.concat(indexes);

        this.data[this.today] = this.data[this.today] ? this.data[this.today].concat(newArticles) : newArticles;

        this.hasNew = true;
        this.emit(this.constructor.EVENT_NEW_ARTICLES);

        console.log(`${newArticles.length} new elements was added to the feed by request "${this.query}"`);
    }

    /**
     * Create json data from current object.
     * @returns {{hasNew: boolean, indexes: string[], data: (*|{})}}
     */
    getFeedData() {
        return {
            indexes: this.indexes,
            hasNew: this.hasNew,
            data: this.data
        };
    }

    /**
     * Brake all relationship
     * Prepare object for garbage collector
     */
    destroy() {
        this.indexes.splice(0, this.indexes.length);
        this.indexes = null;

        this.data = {};
        this.query = '';
        this.api = null;

        this.removeAllListeners(this.constructor.EVENT_NEW_ARTICLES);
        this.removeAllListeners(this.constructor.EVENT_HAS_NEW_UPDATED);
    }
}