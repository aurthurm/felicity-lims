import gql from 'graphql-tag';

export const GET_SAMPLE_GROUP_BY_STATUS = gql`
    query getSampleGroupByStatus {
        countSampleGroupByStatus {
            data {
                __typename
                group
                count
            }
        }
    }
`;

export const GET_EXTRAS_GROUP_BY_STATUS = gql`
    query getExtrasGroupByStatus {
        countExtrasGroupByStatus {
            data {
                __typename
                group
                count
            }
        }
    }
`;

export const GET_ANALYSIS_GROUP_BY_STATUS = gql`
    query getAnalysisGroupByStatus {
        countAnalyteGroupByStatus {
            data {
                __typename
                group
                count
            }
        }
    }
`;

export const GET_WORKSHEET_GROUP_BY_STATUS = gql`
    query getWorksheetGroupByStatus {
        countWorksheetGroupByStatus {
            data {
                __typename
                group
                count
            }
        }
    }
`;

export const GET_ANALYSIS_GROUP_BY_INSTRUMENT = gql`
    query getAnalysisGroupByInstrument($startDate: String!, $endDate: String!) {
        countAnalyteGroupByInstrument(startDate: $startDate, endDate: $endDate) {
            data {
                __typename
                group
                count
            }
        }
    }
`;

export const GET_SAMPLE_PROCESS_PEFORMANCE = gql`
    query sampleProcessPeformance($startDate: String!, $endDate: String!) {
        sampleProcessPerformance(startDate: $startDate, endDate: $endDate) {
            __typename
            data {
                process
                counts {
                    totalSamples
                    totalLate
                    totalNotLate
                    processAverage
                    avgExtraDays
                }
            }
        }
    }
`;

export const GET_ANALYSIS_PROCESS_PEFORMANCE = gql`
    query getAnalysisProcessPeformance($process: String!, $startDate: String!, $endDate: String!) {
        analysisProcessPerformance(process: $process, startDate: $startDate, endDate: $endDate) {
            __typename
            data {
                process
                groups {
                    totalSamples
                    totalLate
                    totalNotLate
                    processAverage
                    avgExtraDays
                    service
                }
            }
        }
    }
`;

export const GET_SAMPLE_GROUPS_BY_ACTION = gql`
    query sampleGroupByAction($startDate: String!, $endDate: String!) {
        countSampleGroupByAction(startDate: $startDate, endDate: $endDate) {
            __typename
            data {
                __typename
                group
                counts {
                    __typename
                    group
                    count
                }
            }
        }
    }
`;

export const GET_SAMPLE_LAGGARDS = gql`
    query getSampleLaggards {
        sampleLaggards {
            __typename
            data {
                __typename
                category
                counts {
                    __typename
                    totalIncomplete
                    totalDelayed
                    totalNotDelayed
                    lessThanTen
                    tenToTwenty
                    twentyToThirty
                    graterThanThirty
                }
            }
        }
    }
`;
