import React, { useState } from 'react';
import ListContainer from './list/ListContainer';
import FeedDetails from './articles/FeedDetails';
import AutoSync from './forms/AutoSync';

export default () => {
    const [activeFeed, setActiveFeed] = useState(null);

    return (
        <div className="panel">
            <div className="row">
                <div className="col-sm-12 col-md-4">
                    <AutoSync />
                    <ListContainer activeFeed={activeFeed} onFeedClick={setActiveFeed} />
                </div>
                <div className="col-sm-12 col-md-8">
                    {activeFeed ? (<FeedDetails feed={activeFeed} />) : null}
                </div>
            </div>

        </div>
    );
}
