import{al as e}from"./index-cd9e6ac8.js";const n=e`
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
`,a=e`
    mutation EditSupplier($uid: FelicityID!, $payload: SupplierInputType!) {
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
`,o=e`
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
`,r=e`
    mutation EditManufacturer($uid: FelicityID!, $payload: ManufacturerInputType!) {
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
`,p=e`
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
`,i=e`
    mutation EditInstrumentType($uid: FelicityID!, $payload: InstrumentTypeInputType!) {
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
`,u=e`
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
`,d=e`
    mutation EditInstrument($uid: FelicityID!, $payload: InstrumentInputType!) {
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
`,y=e`
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
`,s=e`
    mutation EditMethod($uid: FelicityID!, $payload: MethodInputType!) {
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
`,m=e`
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
`,T=e`
    mutation EditUnit($uid: FelicityID!, $payload: UnitInputType!) {
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
`;export{p as A,i as E,u as a,d as b,y as c,s as d,m as e,T as f,n as g,a as h,o as i,r as j};
