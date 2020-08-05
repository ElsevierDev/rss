import { useState, useEffect } from 'react';
import feedsController from '../lib/apiFeeds';

/**
 * Hook controles list of feeds, provide functions to create and remove feeds
 * @returns {[Feed[], function(*=): undefined, function(*=): undefined]}
 */
export const useFeedsList = () => {
    const [list, updateList] = useState([...feedsController.feeds]);
    useEffect(() => {
        const updateFeedListHandler = () => updateList([...feedsController.feeds]);

        feedsController.on(feedsController.constructor.EVENT_FEED_LIST_UPDATED, updateFeedListHandler);
        return () =>
            feedsController.removeListener(feedsController.constructor.EVENT_FEED_LIST_UPDATED, updateFeedListHandler);
    });

    const createFeed = query => feedsController.createFeed(query);
    const removeFeed = query => feedsController.removeFeed(query);

    return [list, createFeed, removeFeed];
}

/**
 * Controls toggling of auto fetch functionality.
 * Notify state about next update time.
 * @returns {[Number, function(*=): void, stopAutoSync]}
 */
export const useFeedAutoFetch = () => {
    const [nextUpdateTime, setNextUpdateTime] = useState(null);

    const startAutoSync = (timeout) => feedsController.startAutoSync(timeout);
    const stopAutoSync = () => {
        feedsController.stopAutoSync();
        setNextUpdateTime(null);
    }

    useEffect(() => {
        const syncHandler = () => setNextUpdateTime(feedsController.nextSyncTime);

        feedsController.on(feedsController.constructor.EVENT_AUTO_SYNC_TIME_UPDATED, syncHandler);
        return () =>
            feedsController.removeListener(feedsController.constructor.EVENT_AUTO_SYNC_TIME_UPDATED, syncHandler);
    });

    return [nextUpdateTime, startAutoSync, stopAutoSync];
}