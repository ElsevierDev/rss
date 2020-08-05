import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component displays single article block
 * @param article
 * @returns {*}
 */
const FeedArticle = ({ article }) => {
    return (
        <div className="row">
            <a href={article.url}
               tabIndex={0}
               target="_blank"
               rel="noopener noreferrer"
            >
                <h4>{article.title}</h4>
            </a>
            <div>
                <label>Author: </label>
                <span>{article.author}</span>
            </div>
            <div>
                <label>Publisher: </label>
                <span>{article.publisher}</span>
            </div>
        </div>
    );
};

FeedArticle.propTypes = {
    article: PropTypes.shape({
        id: PropTypes.string,
        url: PropTypes.string,
        title: PropTypes.string,
        author: PropTypes.string,
        publisher: PropTypes.string
    }).isRequired
};

export default FeedArticle;
