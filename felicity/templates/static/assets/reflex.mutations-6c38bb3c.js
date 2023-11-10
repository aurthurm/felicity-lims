import{r as e}from"./shipment-53265c2d.js";const n=e`
    mutation AddReflexR($payload: ReflexRuleInput!) {
        createReflexRule(payload: $payload) {
            __typename
            ... on ReflexRuleType {
                uid
                name
                description
                createdByUid
                createdAt
            }
            ... on OperationError {
                error
                suggestion
            }
        }
    }
`,i=e`
    mutation editReflexR($uid: String!, $payload: ReflexRuleInput!) {
        updateReflexRule(uid: $uid, payload: $payload) {
            __typename
            ... on ReflexRuleType {
                uid
                name
                description
                createdByUid
                createdAt
            }
            ... on OperationError {
                error
                suggestion
            }
        }
    }
`,o=e`
    mutation AddReflexA($payload: ReflexActionInput!) {
        createReflexAction(payload: $payload) {
            __typename
            ... on ReflexActionType {
                uid
                description
                level
                analyses {
                    uid
                    name
                }
                reflexRule {
                    uid
                    name
                }
            }
            ... on OperationError {
                error
                suggestion
            }
        }
    }
`,l=e`
    mutation editReflexA($uid: String!, $payload: ReflexActionInput!) {
        updateReflexAction(uid: $uid, payload: $payload) {
            __typename
            ... on ReflexActionType {
                uid
                description
                level
                analyses {
                    uid
                    name
                }
                reflexRule {
                    uid
                    name
                }
            }
            ... on OperationError {
                error
                suggestion
            }
        }
    }
`,d=e`
    mutation AddReflexB($payload: ReflexBrainInput!) {
        createReflexBrain(payload: $payload) {
            __typename
            ... on ReflexBrainType {
                uid
                reflexActionUid
                description
                analysesValues {
                    analysisUid
                    analysis {
                        uid
                        name
                    }
                    operator
                    value
                }
                addNew {
                    analysisUid
                    analysis {
                        uid
                        name
                    }
                    count
                }
                finalise {
                    analysisUid
                    analysis {
                        uid
                        name
                    }
                    value
                }
            }
            ... on OperationError {
                error
                suggestion
            }
        }
    }
`,t=e`
    mutation editReflexB($uid: String!, $payload: ReflexBrainInput!) {
        updateReflexBrain(uid: $uid, payload: $payload) {
            __typename
            ... on ReflexBrainType {
                uid
                reflexActionUid
                description
                analysesValues {
                    analysisUid
                    analysis {
                        uid
                        name
                    }
                    operator
                    value
                }
                addNew {
                    analysisUid
                    analysis {
                        uid
                        name
                    }
                    count
                }
                finalise {
                    analysisUid
                    analysis {
                        uid
                        name
                    }
                    value
                }
            }
            ... on OperationError {
                error
                suggestion
            }
        }
    }
`;export{n as A,i as E,o as a,l as b,d as c,t as d};
