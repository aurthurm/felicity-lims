import{J as e}from"./index-4d0d48ab.js";const n=e`
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
`,t=e`
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
`,i=e`
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
`,o=e`
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
`,l=e`
    mutation AddReflexB($payload: ReflexBrainInput!) {
        createReflexBrain(payload: $payload) {
            __typename
            ... on ReflexBrainType {
                uid
                description
                conditions {
                description
                priority
                criteria {
                    analysisUid
                    analysis {
                    uid
                    name
                    resultOptions {
                        optionKey
                        value
                        __typename
                    }
                    __typename
                    }
                    operator
                    value
                    __typename
                }
                }
                actions {
                addNew {
                    analysisUid
                    analysis {
                    uid
                    name
                    resultOptions {
                        optionKey
                        value
                        __typename
                    }
                    __typename
                    }
                    count
                    __typename
                }
                finalise {
                    analysisUid
                    analysis {
                    name
                    resultOptions {
                        optionKey
                        value
                        __typename
                    }
                    __typename
                    }
                    value
                    __typename
                }
                __typename
                }
                __typename
            }
            ... on OperationError {
                error
                suggestion
            }
        }
    }
`,p=e`
    mutation editReflexB($uid: String!, $payload: ReflexBrainInput!) {
        updateReflexBrain(uid: $uid, payload: $payload) {
            __typename
            ... on ReflexBrainType {
                uid
                description
                conditions {
                description
                priority
                criteria {
                    analysisUid
                    analysis {
                    uid
                    name
                    resultOptions {
                        optionKey
                        value
                        __typename
                    }
                    __typename
                    }
                    operator
                    value
                    __typename
                }
                }
                actions {
                addNew {
                    analysisUid
                    analysis {
                    uid
                    name
                    resultOptions {
                        optionKey
                        value
                        __typename
                    }
                    __typename
                    }
                    count
                    __typename
                }
                finalise {
                    analysisUid
                    analysis {
                    name
                    resultOptions {
                        optionKey
                        value
                        __typename
                    }
                    __typename
                    }
                    value
                    __typename
                }
                __typename
                }
                __typename
            }
            ... on OperationError {
                error
                suggestion
            }
        }
    }
`,r=e`
    mutation deleteReflexBrain($uid: String!) {
        deleteReflexBrain(uid: $uid) {
            __typename
            ... on DeletedItem {
                uid
            }
        }
    }
`;export{n as A,r as D,t as E,i as a,o as b,l as c,p as d};
