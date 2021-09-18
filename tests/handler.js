'use strict';

const assert = require('assert');
const sinon = require('sinon');
const { struct } = require('@janiscommerce/superstruct');

const { handler, API } = require('../lib/index');

describe('Vercel Serverless API', () => {

	const responseDummy = {
		status() { return this; },
		json() { return this; },
		send() { return this; },
		setHeader() { return this; }
	};

	beforeEach(() => {
		sinon.spy(responseDummy, 'status');
		sinon.spy(responseDummy, 'json');
		sinon.spy(responseDummy, 'send');
		sinon.spy(responseDummy, 'setHeader');
	});

	afterEach(() => {
		sinon.restore();
	});

	context('When cannot use the handler', () => {

		it('Should rejects if response is not passed', async () => {
			await assert.rejects(() => handler(null, {}));
		});

		it('Should returns 500 and Error Message if API Class is not passed', async () => {
			await handler(null, {}, responseDummy);

			sinon.assert.calledOnceWithExactly(responseDummy.status, 500);
			sinon.assert.calledOnceWithExactly(responseDummy.json, {
				message: 'Internal Server Error',
				error: 'API cannot be initialize. Cannot found API Class'
			});
		});
	});

	context('When handler can validate structure', () => {

		it('Should return 200 and empty body if API can passed ids struct', async () => {

			class ApiDummy extends API {

				static get idsStruct() {
					return struct.partial({
						id: 'number'
					});
				}
			}

			await handler(ApiDummy, {
				query: {
					'pathIds.id': 100
				}
			}, responseDummy);

			sinon.assert.calledOnceWithExactly(responseDummy.status, 200);
			sinon.assert.calledOnceWithExactly(responseDummy.json, {});
		});

		it('Should return 400 and error if API cannot passed ids struct', async () => {

			class ApiDummy extends API {

				static get idsStruct() {
					return struct.partial({
						id: 'number'
					});
				}
			}

			await handler(ApiDummy, {
				query: {
					'pathIds.id': 'a-100'
				}
			}, responseDummy);

			sinon.assert.calledOnceWithExactly(responseDummy.status, 400);
			sinon.assert.calledOnceWithExactly(responseDummy.json, {
				message: 'Invalid Struct for Ids',
				error: [{
					field: 'id',
					type: 'number',
					value: 'a-100'
				}]
			});
		});

		it('Should return 200 and empty body if API can passed body struct', async () => {

			class ApiDummy extends API {

				static get bodyStruct() {
					return struct.partial({
						name: 'string'
					});
				}
			}

			await handler(ApiDummy, {
				body: {
					name: 'Jonh'
				}
			}, responseDummy);

			sinon.assert.calledOnceWithExactly(responseDummy.status, 200);
			sinon.assert.calledOnceWithExactly(responseDummy.json, {});
		});

		it('Should return 400 and error if API cannot passed body struct', async () => {

			class ApiDummy extends API {

				static get bodyStruct() {
					return struct.partial({
						name: 'string'
					});
				}
			}

			await handler(ApiDummy, {
				body: {
					name: 100
				}
			}, responseDummy);

			sinon.assert.calledOnceWithExactly(responseDummy.status, 400);
			sinon.assert.calledOnceWithExactly(responseDummy.json, {
				message: 'Invalid Struct for Body',
				error: [{
					field: 'name',
					type: 'string',
					value: 100
				}]
			});
		});

		it('Should return 200 and empty body if API can passed filters struct', async () => {

			class ApiDummy extends API {

				static get filtersStruct() {
					return struct.partial({
						age: 'number',
						name: 'string'
					});
				}
			}

			await handler(ApiDummy, {
				query: {
					'filters.age': 100,
					name: 'Johnd'
				}
			}, responseDummy);

			sinon.assert.calledOnceWithExactly(responseDummy.status, 200);
			sinon.assert.calledOnceWithExactly(responseDummy.json, {});
		});

		it('Should return 400 and error if API cannot passed filters struct', async () => {

			class ApiDummy extends API {

				static get filtersStruct() {
					return struct.partial({
						age: 'number',
						name: 'string'
					});
				}
			}

			await handler(ApiDummy, {
				query: {
					'filters.age': 'Hi',
					name: 10
				}
			}, responseDummy);

			sinon.assert.calledOnceWithExactly(responseDummy.status, 400);
			sinon.assert.calledOnceWithExactly(responseDummy.json, {
				message: 'Invalid Struct for Filters',
				error: [
					{
						field: 'age',
						type: 'number',
						value: 'Hi'
					},
					{
						field: 'name',
						type: 'string',
						value: 10
					}
				]
			});
		});

		it('Should return 200 and empty body if API can passed sort struct', async () => {

			class ApiDummy extends API {

				static get sortStruct() {
					return struct.partial({
						by: 'string',
						direction: 'string'
					});
				}
			}

			await handler(ApiDummy, {
				query: {
					sortBy: 'name',
					sortDirection: 1
				}
			}, responseDummy);

			sinon.assert.calledOnceWithExactly(responseDummy.status, 200);
			sinon.assert.calledOnceWithExactly(responseDummy.json, {});
		});

		it('Should return 400 and error if API cannot passed sort struct', async () => {

			class ApiDummy extends API {

				static get sortStruct() {
					return struct.partial({
						by: 'string',
						direction: 'string'
					});
				}
			}

			await handler(ApiDummy, {
				query: {
					sortBy: 1,
					sortDirection: 1
				}
			}, responseDummy);

			sinon.assert.calledOnceWithExactly(responseDummy.status, 400);
			sinon.assert.calledOnceWithExactly(responseDummy.json, {
				message: 'Invalid Struct for Sort',
				error: [{
					field: 'by',
					type: 'string',
					value: 1
				}]
			});
		});

		it('Should return 200 and empty body if API can passed query struct', async () => {

			class ApiDummy extends API {

				static get queryStruct() {
					return struct.partial({
						content: {
							total: 'number'
						}
					});
				}
			}

			await handler(ApiDummy, {
				query: {
					'content.total': 10
				}
			}, responseDummy);

			sinon.assert.calledOnceWithExactly(responseDummy.status, 200);
			sinon.assert.calledOnceWithExactly(responseDummy.json, {});
		});

		it('Should return 400 and error if API cannot passed query struct', async () => {

			class ApiDummy extends API {

				static get queryStruct() {
					return struct.partial({
						content: {
							total: 'number'
						}
					});
				}
			}

			await handler(ApiDummy, {
				query: {
					'content.total': 'Ten'
				}
			}, responseDummy);

			sinon.assert.calledOnceWithExactly(responseDummy.status, 400);
			sinon.assert.calledOnceWithExactly(responseDummy.json, {
				message: 'Invalid Struct for Query',
				error: [{
					field: 'content.total',
					type: 'number',
					value: 'Ten'
				}]
			});
		});
	});

	context('When handler can execute validate from API', () => {

		class ApiDummy extends API {

			validate() {
				if(this.data.name === 'John')
					throw new Error('Wrong name!');

				if(this.data.age === 10) {
					const error = new Error('Wrong age');
					error.extraMessage = 'Not 10';

					throw error;
				}

				if(this.data.content.houseId === 10) {
					this.setCode(404);
					throw new Error('Not found');
				}
			}
		}

		it('Should return 200 and empty body if API can passed validate', async () => {

			await handler(ApiDummy, {
				body: {
					name: 'Henry',
					age: 11,
					content: { houseId: 11 }
				}
			}, responseDummy);

			sinon.assert.calledOnceWithExactly(responseDummy.status, 200);
			sinon.assert.calledOnceWithExactly(responseDummy.json, {});
		});

		it('Should return 400 and if API cannot passed validate', async () => {

			await handler(ApiDummy, {
				body: {
					name: 'John',
					age: 11,
					content: { houseId: 11 }
				}
			}, responseDummy);

			sinon.assert.calledOnceWithExactly(responseDummy.status, 400);
			sinon.assert.calledOnceWithExactly(responseDummy.json, {
				message: 'Wrong name!'
			});
		});

		it('Should return 400 and if API cannot passed validate with extraMessage', async () => {

			await handler(ApiDummy, {
				body: {
					name: 'Henry',
					age: 10,
					content: { houseId: 11 }
				}
			}, responseDummy);

			sinon.assert.calledOnceWithExactly(responseDummy.status, 400);
			sinon.assert.calledOnceWithExactly(responseDummy.json, {
				message: 'Wrong age',
				error: 'Not 10'
			});
		});

		it('Should return 500 and if API cannot passed validate with a typeError', async () => {

			await handler(ApiDummy, {
				body: {
					name: 'Henry',
					age: 11
				}
			}, responseDummy);

			sinon.assert.calledOnceWithExactly(responseDummy.status, 500);
			sinon.assert.calledOnceWithExactly(responseDummy.json, {
				message: 'Internal Server Error',
				error: 'Cannot read property \'houseId\' of undefined'
			});
		});

		it('Should return 404 and if API cannot passed validate with custom statusCode', async () => {

			await handler(ApiDummy, {
				body: {
					name: 'Henry',
					age: 11,
					content: { houseId: 10 }
				}
			}, responseDummy);

			sinon.assert.calledOnceWithExactly(responseDummy.status, 404);
			sinon.assert.calledOnceWithExactly(responseDummy.json, {
				message: 'Not found'
			});
		});
	});

	context('When handler can execute process from API', () => {

		it('Should return 200 and empty body if Class has not struct, or validate, or process', async () => {

			class ApiDummy extends API {}

			await handler(ApiDummy, {}, responseDummy);

			sinon.assert.calledOnceWithExactly(responseDummy.status, 200);
			sinon.assert.calledOnceWithExactly(responseDummy.json, {});
		});

		it('Should return 200 with custom body response', async () => {

			class ApiDummy extends API {
				process() {
					this.setBody({
						method: this.request.method
					});
				}
			}

			await handler(ApiDummy, { method: 'POST' }, responseDummy);

			sinon.assert.calledOnceWithExactly(responseDummy.status, 200);
			sinon.assert.calledOnceWithExactly(responseDummy.json, {
				method: 'POST'
			});
		});

		it('Should return custom statusCode with custom body response', async () => {

			class ApiDummy extends API {
				process() {
					this.setCode(202).setBody({
						url: this.request.url
					});
				}
			}

			await handler(ApiDummy, { url: '/api/custom' }, responseDummy);

			sinon.assert.calledOnceWithExactly(responseDummy.status, 202);
			sinon.assert.calledOnceWithExactly(responseDummy.json, {
				url: '/api/custom'
			});
		});

		it('Should return custom headers and do not use .json() if change content-type', async () => {

			class ApiDummy extends API {
				process() {
					this.setHeader('Content-Type', 'text/plain')
						.setHeader('x-custom', 'test')
						.setCode(202);
				}
			}

			await handler(ApiDummy, { url: '/api/custom' }, responseDummy);

			sinon.assert.calledOnceWithExactly(responseDummy.status, 202);
			sinon.assert.calledOnceWithExactly(responseDummy.send, {});
			sinon.assert.notCalled(responseDummy.json);

			sinon.assert.calledTwice(responseDummy.setHeader);
			sinon.assert.calledWithExactly(responseDummy.setHeader, 'Content-Type', 'text/plain');
			sinon.assert.calledWithExactly(responseDummy.setHeader, 'x-custom', 'test');
		});

		it('Should return 500 if process fails', async () => {

			class ApiDummy extends API {
				process() {
					throw new Error('Fail');
				}
			}

			await handler(ApiDummy, { url: '/api/custom' }, responseDummy);

			sinon.assert.calledOnceWithExactly(responseDummy.status, 500);
			sinon.assert.calledOnceWithExactly(responseDummy.json, {
				message: 'Fail'
			});
		});

		it('Should rejects with custom statusCode and extraMessage', async () => {

			class ApiDummy extends API {
				process() {
					this.setCode(502);
					const error = new Error('Timeout');
					error.extraMessage = 'Not really';

					throw error;
				}
			}

			await handler(ApiDummy, { url: '/api/custom' }, responseDummy);

			sinon.assert.calledOnceWithExactly(responseDummy.status, 502);
			sinon.assert.calledOnceWithExactly(responseDummy.json, {
				message: 'Timeout',
				error: 'Not really'
			});
		});

		it('Should rejects 500 because TypeError', async () => {

			class ApiDummy extends API {
				process() {
					return this.data.content.houseId === 10;
				}
			}

			await handler(ApiDummy, { url: '/api/custom' }, responseDummy);

			sinon.assert.calledOnceWithExactly(responseDummy.status, 500);
			sinon.assert.calledOnceWithExactly(responseDummy.json, {
				message: 'Something went wrong',
				error: 'Cannot read property \'content\' of undefined'
			});
		});
	});
});
