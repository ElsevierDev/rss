import React from 'react';
import PropTypes from 'prop-types';

import { useFeedsList } from '../../hooks/rssFeeds';
import Feed from '../../lib/feeds/feed';

import ListItem from './ListItem';

const ListContainer = ({ activeFeed = null, onFeedClick = () => {} }) => {
    const [feedList] = useFeedsList();

    return (
        <div className="container-fluid">
            <h4>Query list:</h4>
            {feedList.map((feed, index) => (
                <ListItem
                    key={`${feed.query}-${index}`}
                    isActive={feed === activeFeed}
                    feed={feed}
                    onClick={onFeedClick}
                />
            ))}
        </div>
    );
};

ListContainer.propTypes = {
    activeFeed: PropTypes.instanceOf(Feed),
    onClick: PropTypes.func
};

export default ListContainer;
