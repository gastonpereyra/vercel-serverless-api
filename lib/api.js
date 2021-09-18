'use strict';

const parseQuery = require('./helpers/parse-query');

/**
 * The Request Data
 * @typedef {Object} Request
 * @property {string} url The relative endpoint
 * @property {string} method The REST Method
 * @property {string} cookies The Cookies
 * @property {string} headers The Headers
 */

/**
 * The Query-Parameters used for Sorting
 * @typedef {Object} Sort
 * @property {string} by The name of the field to Sort By
 * @property {string} direction The direction to sort 'asc' or 'desc'
 */

/**
 * Class to Handle API throw a Serverless Function.
 * @typedef {Class} API
 * @property {Object} data The Request Body Data
 * @property {Object} pathIds The Path-Parameters Ids
 * @property {Object} filters The Query-Parameters used for Filters
 * @property {Object} otherQuery Other Query-Parameters
 * @property {Sort} sort The Query-Parameters used for Sorting
 * @property {Request} request
 */
module.exports = class API {

	constructor({
		url, method, body, query = {}, cookies, headers
	}) {

		const {
			pathIds, filters, sort, sortDirection, ...otherQuery
		} = parseQuery(query);

		this.data = body;
		this.pathIds = pathIds;
		this.filters = filters;
		this.query = otherQuery;

		if(sort) {
			this.sort = {
				by: sort,
				...sortDirection && { direction: sortDirection }
			};
		}

		this.request = {
			url,
			method,
			cookies,
			headers
		};
	}

	/**
	 * Set response status-code
	 * @param {number} code The Status Code
	 * @returns {API}
	 */
	setCode(code) {
		this.statusCode = code;
		return this;
	}

	/**
	 * Set Response Body
	 * @param {*} body The Body to response, if you don't set content-type header must be an Object
	 * @returns {InstAPIanceType}
	 */
	setBody(body) {
		this.responseBody = body;
		return this;
	}

	/**
	 * Set Response Headers
	 * @param {string} header The header you want to set
	 * @param {string|number|boolean} value The value of the header
	 * @returns {API}
	 */
	setHeader(header, value) {

		if(!this.responseHeaders)
			this.responseHeaders = {};

		this.responseHeaders[header] = value;
		return this;
	}
};
