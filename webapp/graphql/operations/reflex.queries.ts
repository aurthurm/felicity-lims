import gql from 'graphql-tag';

export const GET_ALL_REFLEX_RULES = gql`
    query getAllReflexRules {
        reflexRuleAll {
            totalCount
            items {
                uid
                name
                description
                createdBy {
                    firstName
                    lastName
                }
            }
        }
    }
`;

export const GET_EFLEX_RULE_BY_UID = gql`
    query getReflexRuleByUid($uid: String!) {
        reflexRuleByUid(uid: $uid) {
            uid
            name
            description
            reflexActions {
                uid
                level
                description
                analyses {
                    uid
                    name
                }
                brains {
                    description
                    analysesValues {
                        analysisUid
                        analysis {
                            uid
                            name
                            resultOptions {
                                optionKey
                                value
                            }
                        }
                        operator
                        value
                    }
                    addNew {
                        analysisUid
                        analysis {
                            uid
                            name
                            resultOptions {
                                optionKey
                                value
                            }
                        }
                        count
                    }
                    finalise {
                        analysisUid
                        analysis {
                            name
                            resultOptions {
                                optionKey
                                value
                            }
                        }
                        value
                    }
                }
            }
            createdBy {
                firstName
                lastName
            }
        }
    }
`;
