import EventEmitter from 'events';
import Feed from './feed.js';

export default class Controller extends EventEmitter {
    static EVENT_FEED_LIST_UPDATED = 'Feed list updated';
    static EVENT_AUTO_SYNC_TIME_UPDATED = 'New auto sync time was set';

    /**
     *
     * @param api {ScopusApi}
     * @param storage {{fetch: function, save: function}}
     */
    constructor(api, storage) {
        super();

        /**
         * @type {ScopusApi} - object create request to fetch data from API
         */
        this.api = api;

        /**
         * @type {{fetch: function, save: function}} - Object saves and loads feeds data.
         */
        this.storage = storage;

        /**
         * @type {Feed[]} - feeds list
         */
        this.feeds = [];

        this.autoSyncTimeout = 30000;
        this.autoSyncTimer = null;
    }

    /**
     * Load information from storage to controller
     */
    load() {
        const storedData = this.storage.fetch();
        Object.keys(storedData).forEach(query => {
            const feed = this.feedBuilder(query, storedData[query]);
            this.addFeedToTheList(feed);
        });
        this.emit(this.constructor.EVENT_FEED_LIST_UPDATED);
    }

    /**
     * @param feed {Feed}
     */
    addFeedToTheList(feed) {
        this.feeds.push(feed);
    }

    /**
     * Create instance of the Feed class with all necessary relations.
     * @param query
     * @param feedData
     * @returns {Feed}
     */
    feedBuilder(query, feedData) {
        const feed = new Feed(query, feedData);
        feed.api = this.api;

        feed.on(feed.constructor.EVENT_NEW_ARTICLES, () => this.save());
        feed.on(feed.constructor.EVENT_HAS_NEW_UPDATED, () => this.save());

        return feed;
    }

    /**
     * Save to the storage all feeds data
     */
    save() {
        this.storage.save(this.getFeedsData());
    }

    /**
     * Create json representation of all present feeds
     * @returns {{}}
     */
    getFeedsData() {
        const data = {};
        this.feeds.forEach(feed => data[feed.query] = feed.getFeedData());
        return data;
    }

    /**
     * Method creates new feed and fill it with initial articles
     * @param query
     */
    createFeed(query) {
        const sanitizedQuery = query.trim();

        if (this.getFeedByQuery(sanitizedQuery)) {
            return;
        }
        const feed = this.feedBuilder(sanitizedQuery, {});
        this.addFeedToTheList(feed);
        feed.sync();

        this.save();
        this.emit(this.constructor.EVENT_FEED_LIST_UPDATED);
    }

    /**
     * Remove feed from the list and destroy feed object
     * @param feed {Feed} - feed to remove
     */
    removeFeed(feed) {
        if (!(feed instanceof Feed)) {
            return;
        }

        const index = this.feeds.findIndex(feedItem => feedItem === feed);

        if (index === -1) {
            return;
        }
        this.feeds.splice(index, 1);

        this.save();

        feed.destroy();
        this.emit(this.constructor.EVENT_FEED_LIST_UPDATED);
    }

    /**
     * Search feed by its query (search) string
     * @param query {string} - search string
     * @returns {Feed}
     */
    getFeedByQuery(query) {
        return this.feeds.find(feedItem => feedItem.query === query);
    }

    /**
     * Method starts automatic synchronization of the feeds
     * @param timeout {number} - timeout between sync requests
     */
    startAutoSync(timeout = this.autoSyncTimeout) {
        this.stopAutoSync();

        this.autoSyncTimeout = timeout;

        this.autoSyncTimer = setInterval(() => this.syncAutoCall(), this.autoSyncTimeout);
        this.setNextSyncTime();
    }

    /**
     * Method stops automatic synchronisation
     */
    stopAutoSync() {
        if (this.autoSyncTimer) {
            clearInterval(this.autoSyncTimer);
            this.autoSyncTimer = null;
        }
    }

    /**
     * Method is called every time when synchronisation should happen
     */
    syncAutoCall() {
        this.sync();
        this.setNextSyncTime();
    }

    /**
     * Synchronize scopus search results with feeds.
     */
    sync() {
        this.feeds.forEach(feed => feed.sync());
    }

    /**
     * Update time of the next synchronization
     */
    setNextSyncTime() {
        this.nextSyncTime = Date.now() + this.autoSyncTimeout;
        this.emit(this.constructor.EVENT_AUTO_SYNC_TIME_UPDATED);
    }
}
