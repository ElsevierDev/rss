import React, { useState } from 'react';
import { useFeedsList } from '../../hooks/rssFeeds';

export default () => {
    const [, createFeed] = useFeedsList();
    const [query, updateQuery] = useState('');

    const createButtonHandler = () => {
        createFeed(query);
        updateQuery('');
    }

    return (
        <div className="col">
            <div className="panel panel-primary">
                <div className="panel-heading">
                    <h3>Create Scopus API-based feed</h3>
                </div>
                <div className="panel-body">
                    <div className="row">
                        <div className="col-xs-12 col-sm-9">
                            <div className="form-group">
                                <label htmlFor="docSearchInput">Search term:</label>
                                <input type="text"
                                       className="form-control input-sm"
                                       aria-label="Document Search"
                                       value={query}
                                       onChange={({ target }) => updateQuery(target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-3">
                            <div className="form-group">
                                <input type="button"
                                       className="btn btn-primary pull-right"
                                       value="Create API Feed"
                                       onClick={createButtonHandler}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
