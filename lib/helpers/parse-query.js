'use strict';

const sortKey = ['sortBy', 'sort'];
const sortDirectionKey = 'sortDirection';

const sortDirections = {
	1: 'asc',
	asc: 'asc',
	0: 'desc',
	desc: 'desc'
};

module.exports = query => Object.entries(query).reduce((queries, [key, value]) => {

	if(key.includes('.')) {

		const [queryKey, idKey] = key.split('.');

		if(!queries[queryKey])
			queries[queryKey] = {};

		queries[queryKey][idKey] = value;

	} else if(sortKey.includes(key))
		queries.sort = value;

	else if(key === sortDirectionKey)
		queries.sortDirection = sortDirections[value] || 'asc';

	else
		queries.filters[key] = value;

	return queries;
}, {
	pathIds: {},
	filters: {},
	sort: null,
	sortDirection: null
});
