import{K as e}from"./index-73e47413.js";const n=e`
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
`,s=e`
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
`,y=e`
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
`,m=e`
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
`,T=e`
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
`,l=e`
    mutation AddUnit($payload: UnitInputType!) {
        createUnit(payload: $payload) {
            ... on UnitType {
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
`,I=e`
    mutation EditUnit($uid: String!, $payload: UnitInputType!) {
        updateUnit(uid: $uid, payload: $payload) {
            ... on UnitType {
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
`;export{p as A,i as E,s as a,y as b,u as c,d,l as e,I as f,n as g,a as h,r as i,o as j,m as k,T as l};
