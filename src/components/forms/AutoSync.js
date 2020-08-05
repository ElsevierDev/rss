import React, { useEffect, useState } from 'react';
import { updateTimeout } from '../../config.json';
import { useFeedAutoFetch } from '../../hooks/rssFeeds';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faPauseCircle } from '@fortawesome/free-solid-svg-icons';

export default () => {
    const [nextUpdate, start, stop] = useFeedAutoFetch();
    const [countDown, setCountDown] = useState(null);

    useEffect(() => {
        const countDownInterval = setInterval(() => {
            const newTime = Math.round((nextUpdate - Date.now()) / 1000);

            if (newTime >= 0) {
                setCountDown(newTime);
            }
        });
        return () => {
            setCountDown(null);
            clearInterval(countDownInterval);
        }
    }, [nextUpdate]);

    return (
        <div className="row">
            <div className="col-xs-12">Next update after: {countDown}</div>
            <div className="col-xs-12">
                {nextUpdate ? (
                    <button className="action-btn"
                            title="Stop regular check for API-feeds updates"
                            tabIndex={0}
                            onClick={stop}
                    >
                        <FontAwesomeIcon icon={faPauseCircle} alt="Stop regular check for API-feeds updates" />
                    </button>
                ) : (
                    <button className="action-btn"
                            title="Start regular check for API-feeds updates"
                            tabIndex={0}
                            onClick={() => start(updateTimeout)}
                    >
                        <FontAwesomeIcon icon={faPlayCircle} alt="Start regular check for API-feeds updates" />
                    </button>
                )}
            </div>
        </div>
    );
}
