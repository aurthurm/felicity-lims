import gql from 'graphql-tag';

export const GET_ALL_SUPPLIERS = gql`
    query getAllSuppliers {
        supplierAll {
            uid
            name
            description
        }
    }
`;

export const GET_ALL_MANUFACTURERS = gql`
    query getAllManufacturers {
        manufacturerAll {
            uid
            name
            description
        }
    }
`;

export const GET_ALL_INSTRUMENT_TYPES = gql`
    query getAllInstrumentTypes {
        instrumentTypeAll {
            totalCount
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            items {
                uid
                name
                description
            }
        }
    }
`;

export const GET_ALL_INSTRUMENTS = gql`
    query getAllInstruments {
        instrumentAll {
            totalCount
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            items {
                uid
                name
                description
                keyword
                methods {
                    uid
                    name
                    description
                }
                supplierUid
                supplier {
                    uid
                    name
                }
                manufacturerUid
                manufacturer {
                    uid
                    name
                }
                instrumentTypeUid
                instrumentType {
                    uid
                    name
                }
            }
        }
    }
`;

export const GET_ALL_METHODS = gql`
    query getAllMethods {
        methodAll {
            totalCount
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            items {
                uid
                name
                description
                keyword
                instruments {
                    uid
                    name
                    description
                }
            }
        }
    }
`;

export const GET_ALL_UNITS = gql`
    query getAllUnits {
        unitAll {
            uid
            name
            isSiUnit
        }
    }
`;
