import{al as e}from"./index-cd9e6ac8.js";const n=e`
    mutation AddReflexR($payload: ReflexRuleInput!) {
        createReflexRule(payload: $payload) {
            ... on ReflexRuleType {
                __typename
                uid
                name
                description
                createdByUid
                createdAt
            }
            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`,i=e`
    mutation editReflexR($uid: str!, $payload: ReflexRuleInput!) {
        updateReflexRule(uid: $uid, payload: $payload) {
            ... on ReflexRuleType {
                __typename
                uid
                name
                description
                createdByUid
                createdAt
            }
            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`,o=e`
    mutation AddReflexA($payload: ReflexActionInput!) {
        createReflexAction(payload: $payload) {
            ... on ReflexActionType {
                __typename
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
                __typename
                error
                suggestion
            }
        }
    }
`,l=e`
    mutation editReflexA($uid: str!, $payload: ReflexActionInput!) {
        updateReflexAction(uid: $uid, payload: $payload) {
            ... on ReflexActionType {
                __typename
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
                __typename
                error
                suggestion
            }
        }
    }
`,t=e`
    mutation AddReflexB($payload: ReflexBrainInput!) {
        createReflexBrain(payload: $payload) {
            ... on ReflexBrainType {
                __typename
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
                __typename
                error
                suggestion
            }
        }
    }
`,d=e`
    mutation editReflexB($uid: str!, $payload: ReflexBrainInput!) {
        updateReflexBrain(uid: $uid, payload: $payload) {
            ... on ReflexBrainType {
                __typename
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
                        analysisUid
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
                __typename
                error
                suggestion
            }
        }
    }
`;export{n as A,i as E,o as a,l as b,t as c,d};
