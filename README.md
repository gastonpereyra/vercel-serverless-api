# Vercel-Serverless-Api

## Code Quality Status
![Build Status](https://github.com/gastonpereyra/vercel-serverless-api/workflows/Build%20Status/badge.svg)
[![Coverage Status](https://img.shields.io/coveralls/github/gastonpereyra/vercel-serverless-api/master.svg)](https://coveralls.io/r/gastonpereyra/vercel-serverless-api?branch=master)

![npm-vercel-serverless-api](https://user-images.githubusercontent.com/39351850/132961710-27605cee-2e42-410a-bc08-cbf091094873.png)

## Description
A handler for Serverless Function in Vercel to develop API

## Installation

```
npm i vercel-serverless-api
```

## API

Its a Class to help to create an API.

### Getters

#### Ids
* `pathIds`: _object_, Query Parameters or Path-Parameters for ids
    * Example: `https://example.verce.app/api/message?pathIds.id=10`
        * `pathIds.id`: '10'
    * Example: `https://example.verce.app/api/message/?pathIds.emailId=11`
        * `pathIds.emailId`: '11'

#### Body
* `data`: _object_, Body

#### Queries
* `filters`: _object_, Query parameters to filter
    * Example `https://example.verce.app/api/message?name=John&filters.age=10`
        * `filters.name`: 'John'
        * `filters.age`: '10'
* `this.sort`: _object_, Query parameters to sort
    * Example: `https://example.verce.app/api/message?sortBy=name&sortDirection=desc`
        * `sort.by`: 'name'
        * `sort.direction`: 'desc'

* `query`: _object_, Query parameters
    * Example: `https://example.verce.app/api/message?other.foo=name`
        * `query.foo`: 'name'

#### Request

Other request data

* `request`
    * `request.url`: Request URL
    * `request.method`: Request REST Method
    * `request.headers`: Request Headers
    * `request.cookies`: Request cookies

### Methods

* `setCode(code)`: To setup a custom response status-code
    * `code`: _number_

* `setBody(body)`: To setup a custom response body
    * `body`: _object_

* `validate`: For validation. If you throw an error, will setup status-code 400 by default
    * `async`

* `process`: The API itself. If you throw an error, will setup status-code 500 by default
    * `async`

### Structure Validation

Can use [`superstruct@0.7.0`](https://github.com/ianstormtaylor/superstruct/tree/v0.7.0) to validate body, ids, filters, sort, only must rewrite the following method

* `idsStruct`
    * `static`
* `bodyStruct`
    * `static`
* `filtersStruct`
    * `static`
* `sortStruct`
    * `static`
* `queryStruct`
    * `static`

### Usage

```js
const { struct } = require('superstruct'); // only works up to 0.7.0 version
const { API } = require('vercel-serverless-api');

module.exports = class MyApi extends API {

    static get idsStruct() {
        return struct({
            id: 'string'
        });
    }

    static get bodyStruct() {
        return struct({
            name: 'string',
            age: 'string?'
        });
    }

    static get filtersStruct() {
        return struct({
            name: 'string|null?',
            age: 'string|null?'
        });
    }

    static get sortStruct() {
        return struct({
            by: 'string?',
            direction: 'string?'
        });
    }

    validate() {

        if(this.data.age < 10)
            throw new Error('Too Young'); // statusCode will be 400
    }

    process() {

        if(!this.data.name)
            throw new Error('Empty String is not valid'); // statusCode will be 500

        this.setCode(201).setBody({
            name: this.data.name
            lastname: 'Stark',
            age: this.data.age + 1
        });
    }
}

```

## Handler

The API Class and Handler can be combined to help to devolope Serverless Function in Vercel

```js
// in ./api/message/post.js
const { hanlder } = require('vercel-serverless-api');

const MyApi = require('./my-api');

module.exports = (..args) => handler(MyApi, ...args);
```
