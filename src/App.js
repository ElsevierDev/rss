import React from 'react';
import './App.css';

import CreateFeed from './components/forms/CreateFeed';

import RssPanel from './components/RssContainer';

function App() {
    return (
        <div className="container">
            <div className="row">
                <CreateFeed />
            </div>
            <div className="row">
                <RssPanel />
            </div>
        </div>
    );
}

export default App;
