'use strict';

const assert = require('assert');

const parseQuery = require('../lib/helpers/parse-query');

describe('Parse Query', () => {

	context('When Query has Filters', () => {

		it('Should return every query as filters', () => {

			const queries = {
				name: 'John',
				age: '11'
			};

			assert.deepStrictEqual(parseQuery(queries), {
				filters: queries,
				sort: null,
				sortDirection: null,
				pathIds: {}
			});
		});

		it('Should return every query as filters using filter. notation', () => {

			const queries = {
				'filters.name': 'John',
				'filters.age': '11'
			};

			assert.deepStrictEqual(parseQuery(queries), {
				filters: {
					name: 'John',
					age: '11'
				},
				sort: null,
				sortDirection: null,
				pathIds: {}
			});
		});

		it('Should return every query as filters mixing filter. notation with normal filters', () => {

			const queries = {
				'filters.name': 'John',
				age: '11'
			};

			assert.deepStrictEqual(parseQuery(queries), {
				filters: {
					name: 'John',
					age: '11'
				},
				sort: null,
				sortDirection: null,
				pathIds: {}
			});
		});
	});

	context('When Query has Sort fields', () => {

		it('Should return sort fields with asc direction', () => {

			const queries = {
				sortBy: 'John',
				sortDirection: 'asc'
			};

			assert.deepStrictEqual(parseQuery(queries), {
				filters: {},
				sort: 'John',
				sortDirection: 'asc',
				pathIds: {}
			});
		});

		it('Should return sort fields with asc direction if 1 is passed', () => {

			const queries = {
				sort: 'John',
				sortDirection: 1
			};

			assert.deepStrictEqual(parseQuery(queries), {
				filters: {},
				sort: 'John',
				sortDirection: 'asc',
				pathIds: {}
			});
		});

		it('Should return sort fields with asc direction if not-0 is passed', () => {

			const queries = {
				sortBy: 'John',
				sortDirection: 2
			};

			assert.deepStrictEqual(parseQuery(queries), {
				filters: {},
				sort: 'John',
				sortDirection: 'asc',
				pathIds: {}
			});
		});

		it('Should return sort fields with desc direction if 0 is passed', () => {

			const queries = {
				sort: 'John',
				sortDirection: 0
			};

			assert.deepStrictEqual(parseQuery(queries), {
				filters: {},
				sort: 'John',
				sortDirection: 'desc',
				pathIds: {}
			});
		});

		it('Should return sort fields with desc direction', () => {

			const queries = {
				sortBy: 'John',
				sortDirection: 0
			};

			assert.deepStrictEqual(parseQuery(queries), {
				filters: {},
				sort: 'John',
				sortDirection: 'desc',
				pathIds: {}
			});
		});

		it('Should return the last sort if both form are passed', () => {

			const queries = {
				sortBy: 'John',
				sort: 'Doe'
			};

			assert.deepStrictEqual(parseQuery(queries), {
				filters: {},
				sort: 'Doe',
				sortDirection: null,
				pathIds: {}
			});

			assert.deepStrictEqual(parseQuery({
				sort: 'Doe',
				sortBy: 'John'
			}), {
				filters: {},
				sort: 'John',
				sortDirection: null,
				pathIds: {}
			});
		});
	});

	context('When Query has PathIds', () => {

		it('Should return pathIds when query has pathIds. notation', () => {

			const queries = {
				'pathIds.name': 'John',
				'pathIds.age': '11'
			};

			assert.deepStrictEqual(parseQuery(queries), {
				filters: {},
				sort: null,
				sortDirection: null,
				pathIds: {
					name: 'John',
					age: '11'
				}
			});
		});

		it('Should not return pathIds', () => {

			const queries = {
				'pathId.name': 'John',
				'pathId.age': '11'
			};

			assert.deepStrictEqual(parseQuery(queries), {
				filters: {},
				sort: null,
				sortDirection: null,
				pathIds: {},
				pathId: {
					name: 'John',
					age: '11'
				}
			});
		});
	});
});
