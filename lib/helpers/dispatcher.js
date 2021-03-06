'use strict';

module.exports = class Dispatcher {

	constructor(apiInstance, ApiClass, response) {
		this.apiInstance = apiInstance;
		this.ApiClass = ApiClass;
		this.response = response;
	}

	validateStruct(structType, data) {

		const structName = `${structType.toLowerCase()}Struct`;

		if(!this.ApiClass[structName])
			return true;

		const [structError] = this.ApiClass[structName].validate(data);

		if(structError) {
			this.response
				.status(400)
				.json({
					message: `Invalid Struct for ${structType}`,
					error: this.parseStructError(structError)
				});
		}

		return !structError;
	}

	parseStructError({ errors }) {
		/* istanbul ignore next */
		return errors.map(({ type, value, path, reason }) => ({
			field: path.join('.'),
			type,
			value,
			...reason && { reason }
		}));
	}

	async validateApi() {

		try {
			await this.apiInstance.validate();
			return true;

		} catch(error) {

			if(this.isTypeError(error))
				this.apiInstance.statusCode = 500;

			this.response
				.status(this.apiInstance.statusCode || 400)
				.json({
					message: this.isTypeError(error) ? 'Internal Server Error' : error.message,
					...(this.isTypeError(error) || error.extraMessage) && { error: error.extraMessage || error.message }
				});

			return false;
		}
	}

	async processApi() {

		try {

			await this.apiInstance.process();

			// eslint-disable-next-line newline-per-chained-call
			this.setHeaders().status(this.apiInstance.statusCode || 200)[this.selectResponseType()](this.apiInstance.responseBody || {});

		} catch(error) {
			this.response
				.status(this.apiInstance.statusCode || 500)
				.json({
					message: this.isTypeError(error) ? 'Something went wrong' : error.message,
					...(this.isTypeError(error) || error.extraMessage) && { error: error.extraMessage || error.message }
				});
		}
	}

	isTypeError(error) {
		return ['TypeError', 'ReferenceError'].includes(error.name);
	}

	setHeaders() {

		if(this.apiInstance.responseHeaders && Object.keys(this.apiInstance.responseHeaders).length) {
			Object.entries(this.apiInstance.responseHeaders).forEach(([header, value]) => {
				this.response.setHeader(header, value);
			});
		}

		return this.response;
	}

	selectResponseType() {

		if(this.apiInstance.responseHeaders && this.apiInstance.responseHeaders['Content-Type'] !== 'application/json')
			return 'send';

		return 'json';
	}
};
