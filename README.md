# RSS Feeds Scopus API-based replica
ReactJs browser application. It use Scopus API to check articles updates and replica RSS feeds functionality.


## Prerequisites
* An API key from http://dev.elsevier.com
* `Node.js` installed on your machine. (Developed on v12.18.0)
* `npm` installed on your machine.
* `git` client installed on your machine.

## Quick start
* Create project root folder `mkdir scopus-rss`
* Clone the project repository by running `git clone https://github.com/ElsevierDev/rss.git ./scopus-rss` from your command line
* Enter project root `cd scopus-rss`
* Open file `./src/config.json` and update `API_KEY` value. Replace `[ENTER KEY HERE]` with your generated API key from http://dev.elsevier.com .
* Install dependencies for the application `npm i` or `npm install`
* Run application `npm run start`

This actions would start app. Visit http://localhost:3000 to see app in action.

## Disclaimer
This is not an 'official' SDK or 'production-ready' application. It is not guaranteed to always work with Elsevier's APIs, on all platforms. But we'll do our best to keep it in good shape, are happy to take suggestions for improvements, and are open to collaborations. License info is [here](https://github.com/ElsevierDev/apidemo/blob/master/LICENSE.md).
