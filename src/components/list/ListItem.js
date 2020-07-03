import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Feed from '../../lib/rss/feed';
import { useFeedsList } from '../../hooks/rssFeeds';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faTrashAlt, faBolt } from '@fortawesome/free-solid-svg-icons';

const ListItem = ({ feed, isActive = false, onClick = () => {} }) => {
    const [hasNew, updateHasNew] = useState(feed.hasNew);
    const [, , removeFeed] = useFeedsList();

    useEffect(() => {
        const syncHasNew = () => updateHasNew(feed.hasNew)

        feed.on(feed.constructor.EVENT_HAS_NEW_UPDATED, syncHasNew);
        return () => feed.removeListener(feed.constructor.EVENT_HAS_NEW_UPDATED, syncHasNew);
    });

    const listClickHandler = () => {
        feed.hasNew = false;
        onClick(feed);
    };

    return (
        <div className="row">
            <div className={`col-xs-9 feed-list-item ${isActive ? 'bg-primary' : ''}`} onClick={listClickHandler}>
                {feed.query}
                {hasNew ? (
                    <FontAwesomeIcon icon={faBolt} className="new-label" alt="Feed has new elements" />
                ) : null}
            </div>

            <div className="col list-actions">
                <button className="action-btn"
                        tabIndex={0}
                        onClick={() => feed.sync()}
                >
                    <FontAwesomeIcon icon={faSync}  alt="Check feed for updates" />
                </button>

                <button className="action-btn"
                        tabIndex={0}
                        onClick={() => removeFeed(feed)}
                >
                    <FontAwesomeIcon icon={faTrashAlt}  alt="Remove feed feed" />
                </button>
            </div>
        </div>
    );
}

ListItem.propTypes = {
    feed: PropTypes.instanceOf(Feed).isRequired,
    isActive: PropTypes.bool,
    onClick: PropTypes.func
}

export default ListItem;