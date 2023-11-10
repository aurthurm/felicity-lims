import{r as e}from"./shipment-53265c2d.js";const t=e`
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
`,r=e`
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
`,o=e`
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
`;export{p as A,i as E,u as a,d as b,m as c,T as d,t as e,a as f,r as g,o as h,y as i,s as j};
