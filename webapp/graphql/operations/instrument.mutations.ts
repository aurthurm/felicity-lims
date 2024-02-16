import gql from 'graphql-tag';

// SUPPLIERS
export const ADD_SUPPLIER = gql`
    mutation AddSupplier($payload: SupplierInputType!) {
        createSupplier(payload: $payload) {
            ... on SupplierType {
                uid
                name
                description
            }

            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;

export const EDIT_SUPPLIER = gql`
    mutation EditSupplier($uid: String!, $payload: SupplierInputType!) {
        updateSupplier(uid: $uid, payload: $payload) {
            ... on SupplierType {
                uid
                name
                description
            }

            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;

// MANUFACTURERS
export const ADD_MANUFACTURER = gql`
    mutation AddManufacturer($payload: ManufacturerInputType!) {
        createManufacturer(payload: $payload) {
            ... on ManufacturerType {
                uid
                name
                description
            }

            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;

export const EDIT_MANUFACTURER = gql`
    mutation EditManufacturer($uid: String!, $payload: ManufacturerInputType!) {
        updateManufacturer(uid: $uid, payload: $payload) {
            ... on ManufacturerType {
                uid
                name
                description
            }

            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;

// INSTRUMENT TYPES
export const ADD_INSTRUMENT_TYPE = gql`
    mutation AddInstrumentType($payload: InstrumentTypeInputType!) {
        createInstrumentType(payload: $payload) {
            ... on InstrumentTypeType {
                uid
                name
                description
            }

            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;

export const EDIT_INSTRUMENT_TYPE = gql`
    mutation EditInstrumentType($uid: String!, $payload: InstrumentTypeInputType!) {
        updateInstrumentType(uid: $uid, payload: $payload) {
            ... on InstrumentTypeType {
                uid
                name
                description
            }

            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;

// INSTRUMENT
export const ADD_INSTRUMENT = gql`
    mutation AddInstrument($payload: InstrumentInputType!) {
        createInstrument(payload: $payload) {
            ... on InstrumentType {
                uid
                name
                description
                keyword
                instrumentType {
                    uid
                    name
                }
                manufacturer {
                    uid
                    name
                }
                supplier {
                    uid
                    name
                }
            }

            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;

export const EDIT_INSTRUMENT = gql`
    mutation EditInstrument($uid: String!, $payload: InstrumentInputType!) {
        updateInstrument(uid: $uid, payload: $payload) {
            ... on InstrumentType {
                uid
                name
                description
                keyword
                instrumentType {
                    uid
                    name
                }
                manufacturer {
                    uid
                    name
                }
                supplier {
                    uid
                    name
                }
            }

            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;


// laboratory INSTRUMENT
export const ADD_LABORATORY_INSTRUMENT = gql`
    mutation AddLaboratoryInstrument($payload: LaboratoryInstrumentInputType!) {
        createLaboratoryInstrument(payload: $payload) {
            ... on LaboratoryInstrumentType {
                uid
                labName
                serialNumber
                instrumentUid
                instrument {
                    uid
                    name
                }
                dateCommissioned
                dateDecommissioned
            }

            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;

export const EDIT_LABORATORY_INSTRUMENT = gql`
    mutation EditLaboratoryInstrument($uid: String!, $payload: LaboratoryInstrumentInputType!) {
        updateLaboratoryInstrument(uid: $uid, payload: $payload) {
            ... on LaboratoryInstrumentType {
                uid
                labName
                serialNumber
                instrumentUid
                instrument {
                    uid
                    name
                }
                dateCommissioned
                dateDecommissioned
            }

            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;

// METHOD
export const ADD_METHOD = gql`
    mutation AddMethod($payload: MethodInputType!) {
        createMethod(payload: $payload) {
            ... on MethodType {
                uid
                name
                description
                keyword
            }

            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;

export const EDIT_METHOD = gql`
    mutation EditMethod($uid: String!, $payload: MethodInputType!) {
        updateMethod(uid: $uid, payload: $payload) {
            ... on MethodType {
                uid
                name
                description
                keyword
            }

            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;

// UNIT
export const ADD_UNIT = gql`
    mutation AddUnit($payload: UnitInputType!) {
        createUnit(payload: $payload) {
            ... on UnitType {
                uid
                name
                isSiUnit
            }

            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;

export const EDIT_UNIT = gql`
    mutation EditUnit($uid: String!, $payload: UnitInputType!) {
        updateUnit(uid: $uid, payload: $payload) {
            ... on UnitType {
                uid
                name
                isSiUnit
            }

            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;
