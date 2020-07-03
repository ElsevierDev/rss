export default class LocalStore {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }

    /**
     * Fetch feeds data from local storage
     * @returns {{}|any}
     */
    fetch() {
        let data;

        try {
            data = localStorage.getItem(this.dataSource);
        } catch (e) {
            console.warn('Unable to fetch data from localStorage.', e);
            return {};

        }

        try {
            return JSON.parse(data) || {}
        } catch (e) {
            console.warn('Unable to parse data.', e);
            return {};
        }
    }

    /**
     * Save data to local storage
     * @param data
     */
    save(data) {
        localStorage.setItem(this.dataSource, JSON.stringify(data));
    }
}
