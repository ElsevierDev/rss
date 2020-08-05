import config from '../config.json';

import LocalStore from './store/localStore';
import ScopusApi from './api/scopusApi';
import scopusApiParser from './api/scopusApiParser';
import FeedsController from './feeds/controller'

const storage = new LocalStore(config.storeName);

const searchDocumentApi = new ScopusApi(ScopusApi.PATH_DOCUMENT_SEARCH, config.API_KEY, { sort: 'orig-load-date' });
searchDocumentApi.resultParser = scopusApiParser;

const feedsController = new FeedsController(searchDocumentApi, storage);
feedsController.load();

window.feedsController = feedsController;

export default feedsController;
