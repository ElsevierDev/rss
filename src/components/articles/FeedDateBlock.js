import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FeedArticle from './FeedArticle';

/**
 * Component displays list of articles within specific date
 * @param date
 * @param data
 * @returns {*}
 */
const FeedDateBlock = ({ date, data }) => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        setArticles(data.slice().reverse());
    }, [data]);

    return (
        <div className="panel">
            <h4>{date}</h4>
            {articles.map(article => (
                <FeedArticle key={article.title + Math.random()} article={article} />
            ))}
        </div>
    );
};

FeedDateBlock.propTypes = {
    date: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired
};

export default FeedDateBlock;
