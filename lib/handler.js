'use strict';

const Dispatcher = require('./helpers/dispatcher');

/**
 * For Handling a Serverless Function
 * @param {API} ApiClass Class to handler the API
 * @param {Object} request Request Data - Vercel arguments
 * @param {Object} response Response Data - Vercel arguments
 */
module.exports = async (ApiClass, request, response) => {

	if(!response)
		throw new Error('Response is not passed');

	if(!ApiClass) {
		response
			.status(500)
			.json({
				message: 'Internal Server Error',
				error: 'API cannot be initialize. Cannot found API Class'
			});

		return;
	}

	const apiInstance = new ApiClass(request);

	const dispatcher = new Dispatcher(apiInstance, ApiClass, response);

	if(!dispatcher.validateStruct('Ids', apiInstance.pathIds))
		return;

	if(!dispatcher.validateStruct('Body', apiInstance.data))
		return;

	if(!dispatcher.validateStruct('Filters', apiInstance.filters))
		return;

	if(!dispatcher.validateStruct('Sort', apiInstance.sort))
		return;

	if(!dispatcher.validateStruct('Query', apiInstance.query))
		return;

	if(apiInstance.validate && !await dispatcher.validateApi())
		return;

	if(apiInstance.process)
		return dispatcher.processApi();

	response.status(200).json({});
};
