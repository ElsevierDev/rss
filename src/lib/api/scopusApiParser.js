/**
 * Find scopus article URL from list of URLs
 * @param link {{}[]} - list uf url objects
 * @returns {string}
 */
const findScopusUrl = (link) => {
    if (!link) {
        return '';
    }

    let linkObject = link.find(item => item['@ref'] === 'scopus');

    return linkObject?.['@href'] || '';
}

/**
 * Function parse response from Scopus search api and create structure we intend to use for feed
 * @param response {json} response from Scopus search api.
 * @returns {[]} - list of search elements.
 */
export default (response) => {
    const result = [];
    const entry = response?.['search-results']?.entry || [];

    entry.forEach(record => {
        result.push({
            id: record['dc:identifier'],
            title: record['dc:title'],
            author: record['dc:creator'],
            publisher: record['prism:publicationName'],
            url: findScopusUrl(record.link)
        });
    });

    return result;
}
