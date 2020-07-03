import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import FeedDateBlock from './FeedDateBlock';
import Feed from '../../lib/rss/feed';

/**
 * Component displays details of specific Feed
 * @param feed {Feed}
 * @returns {*}
 */
const FeedDetails = ({ feed = null }) => {
    const [, refresh] = useState([]);

    useEffect(() => {
        const displayNewArticles = () => refresh();

        feed.on(feed.constructor.EVENT_NEW_ARTICLES, displayNewArticles);
        return () => feed.removeListener(feed.constructor.EVENT_NEW_ARTICLES, displayNewArticles);
    }, [feed]);

    return (
        <div className="container-fluid">
            <h3>Query: "{feed.query}"</h3>
            <hr />
            {Object.keys(feed.data).sort().reverse().map(date => (
                <FeedDateBlock key={date} data={feed.data[date]} date={date} />
            ))}
        </div>
    );
};

FeedDetails.propTypes = {
    feed: PropTypes.instanceOf(Feed)
};

export default FeedDetails;
