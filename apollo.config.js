module.exports = {
    client: {
        service: {
            name: 'felicity-lims',
            // URL to the GraphQL API
            url: 'http://localhost:8000/felicity-gql',
        },
        // Files processed by the extension
        includes: ['src/*.vue', 'src/*.ts', 'src/**/*.vue', 'src/**/*.ts'],
    },
};
