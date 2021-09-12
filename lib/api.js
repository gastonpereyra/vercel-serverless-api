'use strict';

const parseQuery = require('./helpers/parse-query');

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

	setCode(code) {
		this.statusCode = code;
		return this;
	}

	setBody(body) {
		this.responseBody = body;
		return this;
	}
};
