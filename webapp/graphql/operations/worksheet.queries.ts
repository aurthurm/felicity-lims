import gql from 'graphql-tag';

export const GET_ALL_WORKSHEET_TEMPLATES = gql`
    query getAllWorksheetTemplates {
        worksheetTemplateAll {
            uid
            name
            reserved
            numberOfSamples
            rows
            cols
            rowWise
            worksheetType
            instrumentUid
            instrument {
                uid
                name
            }
            sampleTypeUid
            sampleType {
                uid
                name
            }
            description
            analysisUid
            analysis {
                uid
                name
            }
            state
        }
    }
`;

export const GET_ALL_WORKSHEETS = gql`
    query getAllWorksheets($first: Int!, $after: String, $before: String, $status: String!, $text: String!, $sortBy: [String!] = ["-uid"]) {
        worksheetAll(pageSize: $first, afterCursor: $after, beforeCursor: $before, status: $status, text: $text, sortBy: $sortBy) {
            totalCount
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            items {
                uid
                worksheetId
                numberOfSamples
                assignedCount
                analyst {
                    uid
                    userName
                    firstName
                    lastName
                }
                instrument {
                    uid
                    name
                }
                analysis {
                    uid
                    name
                }
                state
                createdAt
            }
        }
    }
`;

export const GET_WORKSHEET_BY_UID = gql`
    query getWorkSheetByUid($worksheetUid: String!) {
        worksheetByUid(worksheetUid: $worksheetUid) {
            uid
            worksheetId
            numberOfSamples
            assignedCount
            reserved
            state
            createdAt
            analyst {
                uid
                userName
                firstName
                lastName
            }
            sampleType {
                name
                name
            }
            instrument {
                uid
                name
            }
            template {
                uid
                name
            }
            analysis {
                uid
                name
            }
            analysisResults {
                uid
                result
                status
                worksheetPosition
                retest
                reportable
                method {
                    uid
                    name
                }
                laboratoryInstrument {
                    uid
                    labName
                    instrument {
                        uid
                        name
                    }
                }
                analysis {
                    uid
                    name
                    unitUid
                    unit {
                        uid
                        name
                    }
                    resultOptions {
                        uid
                        optionKey
                        value
                    }
                    interims {
                        uid
                        key
                        value
                    }
                    instruments {
                        uid
                        name
                        laboratoryInstruments {
                            uid
                            labName
                            serialNumber
                        }
                    }
                    methods {
                        uid
                        name
                    }
                }
                sample {
                    uid
                    sampleId
                    priority
                    analysisRequest {
                        uid
                        client {
                            uid
                            name
                        }
                        patient {
                            uid
                            firstName
                            lastName
                            clientPatientId
                            patientId
                        }
                    }
                    qcLevel {
                        uid
                        level
                    }
                }
            }
        }
    }
`;
