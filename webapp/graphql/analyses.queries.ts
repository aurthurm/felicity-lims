import gql from 'graphql-tag';

export const GET_ALL_CODING_STANDARDS = gql`
    query getAllCodingStandards {
        codingStandardAll {
            uid
            name
            description
        }
    }
`;

export const GET_ALL_SAMPLE_TYPES = gql`
    query getAllSampleTypes {
        sampleTypeAll {
            uid
            name
            abbr
            description
            active
        }
    }
`;

export const GET_SAMPLE_TYPE_MAPPINGS_BY_SAMPLE_TYPE = gql`
query geSampleTypeMappingsBySampleTypeUid($uid: String!) {
    sampleTypeMappingsBySampleType(sampleTypeUid: $uid) {
        uid
        sampleTypeUid
        codingStandardUid
        codingStandard {
            name
        }
        name
        code
        description
    }
}
`

export const GET_ALL_ANALYSES_SERVICES = gql`
    query getAllAnalysesServices($first: Int, $after: String, $text: String, $sortBy: [String!] = ["name"]) {
        analysisAll(pageSize: $first, afterCursor: $after, text: $text, sortBy: $sortBy) {
            items {
                uid
                name
                keyword
                active
                sortKey
                tatLengthMinutes
                precision
                requiredVerifications
                selfVerification
                description
                categoryUid
                departmentUid
                unitUid
                unit {
                    uid
                    name
                }
                sampleTypes {
                    uid
                    name
                }
                specifications {
                    uid
                    analysisUid
                    unitUid
                    unit {
                        uid
                        name
                        isSiUnit
                    }
                    min
                    max
                    minWarn
                    maxWarn
                    minReport
                    maxReport
                    warnValues
                    warnReport
                    gender
                    ageMin
                    ageMax
                    methodUid
                }
                uncertainties {
                    uid
                    min
                    max
                    value
                    analysisUid
                    instrumentUid
                    methodUid
                }
                detectionLimits {
                    uid
                    lowerLimit
                    upperLimit
                    analysisUid
                    instrumentUid
                    methodUid
                }
                correctionFactors {
                    uid
                    factor
                    analysisUid
                    instrumentUid
                    methodUid
                }
                correctionFactors {
                    uid
                    factor
                    analysisUid
                    instrumentUid
                    methodUid
                }
                interims {
                    uid
                    key
                    value
                    analysisUid
                    instrumentUid
                }
                instruments {
                    uid
                    name
                    keyword
                }
                methods {
                    uid
                    name
                    keyword
                    description
                    instruments {
                        uid
                        name
                        keyword
                        description
                    }
                }
                resultOptions {
                    uid
                    optionKey
                    value
                }
                category {
                    uid
                    name
                }
                profiles {
                    uid
                    name
                }
            }
        }
    }
`;

export const GET_ALL_ANALYSES_PROFILES = gql`
    query getAllAnalysesProfiles {
        profileAll {
            uid
            name
            description
            keyword
            active
            departmentUid
            sampleTypes {
                uid
                name
            }
            analyses {
                name
                keyword
                active
                sortKey
            }
        }
    }
`;


export const GET_ANALYSIS_MAPPINGS_BY_ANALYSIS = gql`
query getAnalysisMappingsByAnalysisUid($uid: String!) {
    analysisMappingsByAnalysis(analysisUid: $uid) {
        uid
        analysisUid
        codingStandardUid
        codingStandard {
            name
        }
        name
        code
        description
    }
}
`

export const GET_ALL_ANALYSES_PROFILES_AND_SERVICES = gql`
    query getAllProfilesANDServices {
        profileAll {
            uid
            name
            description
            keyword
            active
            departmentUid
            sampleTypes {
                uid
                name
            }
            analyses {
                uid
                name
                keyword
                sortKey
                active
            }
        }
        analysisAll {
            items {
                uid
                name
                keyword
                active
                description
                sortKey
                tatLengthMinutes
                precision
                requiredVerifications
                selfVerification
                categoryUid
                departmentUid
                unitUid
                unit {
                    uid
                    name
                }
                sampleTypes {
                    uid
                    name
                }
                specifications {
                    uid
                    analysisUid
                    unitUid
                    unit {
                        uid
                        name
                        isSiUnit
                    }
                    min
                    max
                    minWarn
                    maxWarn
                    minReport
                    maxReport
                    warnValues
                    warnReport
                    gender
                    ageMin
                    ageMax
                    methodUid
                }
                uncertainties {
                    uid
                    min
                    max
                    value
                    analysisUid
                    instrumentUid
                    methodUid
                }
                detectionLimits {
                    uid
                    lowerLimit
                    upperLimit
                    analysisUid
                    instrumentUid
                    methodUid
                }
                correctionFactors {
                    uid
                    factor
                    analysisUid
                    instrumentUid
                    methodUid
                }
                correctionFactors {
                    uid
                    factor
                    analysisUid
                    instrumentUid
                    methodUid
                }
                interims {
                    uid
                    key
                    value
                    analysisUid
                    instrumentUid
                }
                instruments {
                    uid
                    name
                    keyword
                    description
                }
                methods {
                    uid
                    name
                    keyword
                    description
                }
                resultOptions {
                    uid
                    optionKey
                    value
                }
                category {
                    uid
                    name
                }
                profiles {
                    uid
                    name
                }
            }
        }
    }
`;

export const GET_PROFILE_MAPPINGS_BY_PROFILE = gql`
query getProfileMappingsByProfileUid($uid: String!) {
    profileMappingsByProfile(profileUid: $uid) {
        uid
        profileUid
        codingStandardUid
        codingStandard {
            name
        }
        name
        code
        description
    }
}
`

export const GET_ALL_ANALYSES_CATEGORIES = gql`
    query getAllAnalysesCategories {
        analysisCategoryAll {
            uid
            name
            description
            active
            departmentUid
            department {
                uid
                name
            }
        }
    }
`;

export const GET_ALL_SAMPLES = gql`
    query getAllSamples(
        $first: Int!
        $after: String
        $before: String
        $status: String!
        $text: String!
        $clientUid: String!
        $sortBy: [String!]
    ) {
        sampleAll(
            pageSize: $first
            afterCursor: $after
            beforeCursor: $before
            status: $status
            text: $text
            clientUid: $clientUid
            sortBy: $sortBy
        ) {
            totalCount
            pageInfo {
                hasNextPage
                hasPreviousPage
                endCursor
                startCursor
            }
            items {
                uid
                createdByUid
                createdBy {
                    firstName
                    lastName
                    auth {
                        userName
                    }
                }
                createdAt
                dateCollected
                dateReceived
                dateSubmitted
                dateVerified
                datePublished
                datePrinted
                dateStored
                printed
                dueDate
                analysisRequest {
                    uid
                    clientRequestId
                    patient {
                        uid
                        firstName
                        lastName
                        clientPatientId
                        gender
                        dateOfBirth
                        age
                        ageDobEstimated
                        consentSms
                    }
                    client {
                        uid
                        name
                        code
                        district {
                            name
                            province {
                                name
                            }
                        }
                    }
                }
                sampleType {
                    uid
                    name
                }
                sampleId
                priority
                status
                storageSlot
                storageContainerUid
                storageContainer {
                    uid
                    name
                    storageSection {
                        uid
                        name
                        storageLocation {
                            uid
                            name
                            storeRoom {
                                uid
                                name
                            }
                        }
                    }
                }
                analyses {
                    uid
                    name
                    sortKey
                }
                profiles {
                    uid
                    name
                }
                rejectionReasons {
                    uid
                    reason
                }
            }
        }
    }
`;

export const GET_SAMPLES_FOR_SH_ASSIGN = gql`
    query getSamplesForShipmentAssign(
        $first: Int!
        $after: String
        $text: String!
        $sortBy: [String!]
        $analysisUid: String
        $sampleTypeUid: String!
    ) {
        samplesForShipmentAssign(
            pageSize: $first
            afterCursor: $after
            text: $text
            sortBy: $sortBy
            analysisUid: $analysisUid
            sampleTypeUid: $sampleTypeUid
        ) {
            totalCount
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            items {
                uid
                sampleId
                status
                createdAt
                dateReceived
                sampleType {
                    name
                }
                analysisRequest {
                    clientRequestId
                }
                analysisResults {
                    uid
                    assigned
                    status
                    analysis {
                        name
                    }
                }
            }
        }
    }
`;

export const GET_ANALYSIS_REQUESTS_BY_PATIENT_UID = gql`
    query getAnalysesRequestsByPatientUid($uid: String!) {
        analysisRequestsByPatientUid(uid: $uid) {
            uid
            clientRequestId
            createdAt
            patient {
                uid
                firstName
                lastName
                clientPatientId
                gender
                dateOfBirth
                age
                ageDobEstimated
                consentSms
            }
            client {
                uid
                name
            }
            samples {
                uid
                createdByUid
                createdBy {
                    firstName
                    lastName
                    auth {
                        userName
                    }
                }
                createdAt
                sampleType {
                    uid
                    name
                }
                sampleId
                priority
                status
                storageSlot
                storageContainerUid
                storageSlot
                storageContainerUid
                storageContainer {
                    uid
                    name
                    storageSection {
                        uid
                        name
                        storageLocation {
                            uid
                            name
                            storeRoom {
                                uid
                                name
                            }
                        }
                    }
                }
                analyses {
                    uid
                    name
                    sortKey
                }
                rejectionReasons {
                    uid
                    reason
                }
                profiles {
                    uid
                    name
                }
            }
        }
    }
`;

export const GET_ANALYSIS_REQUESTS_BY_CLIENT_UID = gql`
    query getAnalysesRequestsByClientUid($uid: String!) {
        analysisRequestsByClientUid(uid: $uid) {
            uid
            clientRequestId
            createdAt
            patient {
                uid
                firstName
                lastName
                clientPatientId
                gender
                dateOfBirth
                age
                ageDobEstimated
                consentSms
            }
            client {
                uid
                name
            }
            samples {
                uid
                createdByUid
                createdBy {
                    firstName
                    lastName
                    auth {
                        userName
                    }
                }
                createdAt
                sampleType {
                    uid
                    name
                }
                sampleId
                priority
                status
                storageSlot
                storageContainerUid
                storageSlot
                storageContainerUid
                storageContainer {
                    uid
                    name
                    storageSection {
                        uid
                        name
                        storageLocation {
                            uid
                            name
                            storeRoom {
                                uid
                                name
                            }
                        }
                    }
                }
                rejectionReasons {
                    uid
                    reason
                }
                analyses {
                    uid
                    name
                    sortKey
                }
                profiles {
                    uid
                    name
                }
            }
        }
    }
`;

export const GET_ANALYSIS_RESULTS_BY_SAMPLE_UID = gql`
    query getAnalysesResultsBySampleUid($uid: String!) {
        analysisResultBySampleUid(uid: $uid) {
            uid
            status
            sampleUid
            result
            method {
                uid
                name
            }
            instrument {
                uid
                name
            }
            sample {
                uid
                sampleId
                status
                rejectionReasons {
                    uid
                    reason
                }
            }
            analysisUid
            analysis {
                uid
                name
                unitUid
                unit {
                    uid
                    name
                }
                sortKey
                interims {
                    uid
                    key
                    value
                    analysisUid
                    instrumentUid
                }
                resultOptions {
                    uid
                    optionKey
                    value
                }
            }
            retest
            reportable
            createdAt
            createdByUid
            updatedAt
            updatedByUid
            worksheetUid
            worksheetId
        }
    }
`;

export const GET_ANALYSIS_RESULTS_FOR_WS_ASSIGN = gql`
    query getAnalysesResultsForWsAssign(
        $first: Int!
        $after: String
        $text: String!
        $sortBy: [String!]
        $analysisUid: String!
        $sampleTypeUid: String!
    ) {
        analysisResultsForWsAssign(
            pageSize: $first
            afterCursor: $after
            text: $text
            sortBy: $sortBy
            analysisUid: $analysisUid
            sampleTypeUid: $sampleTypeUid
        ) {
            totalCount
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            items {
                uid
                assigned
                sampleUid
                sample {
                    sampleId
                    priority
                    status
                    dateReceived
                    createdAt
                    sampleType {
                        name
                    }
                }
                status
                analysisUid
                analysis {
                    name
                }
            }
        }
    }
`;

export const GET_SAMPLE_BY_UID = gql`
    query getSampleByUid($uid: String!) {
        sampleByUid(uid: $uid) {
            uid
            createdByUid
            createdBy {
                firstName
                lastName
                auth {
                    userName
                }
            }
            createdAt
            dateReceived
            receivedByUid
            dateCollected
            dateSubmitted
            submittedByUid
            dateVerified
            verifiedByUid
            datePublished
            datePrinted
            printedByUid
            dateInvalidated
            invalidatedByUid
            dateCancelled
            cancelledByUid
            dueDate
            sampleId
            priority
            status
            analysisRequest {
                uid
                clientRequestId
                patient {
                    uid
                    firstName
                    lastName
                    clientPatientId
                    gender
                    dateOfBirth
                    age
                    ageDobEstimated
                    consentSms
                }
                client {
                    uid
                    name
                }
            }
            sampleType {
                uid
                name
            }
            dateStored
            storageSlot
            storageContainerUid
            storageSlot
            storageContainerUid
            storageContainer {
                uid
                name
                storageSection {
                    uid
                    name
                    storageLocation {
                        uid
                        name
                        storeRoom {
                            uid
                            name
                        }
                    }
                }
            }
            analyses {
                uid
                name
            }
            profiles {
                uid
                name
            }
            rejectionReasons {
                uid
                reason
            }
        }
    }
`;

export const GET_SAMPLE_BY_PARENT_ID = gql`
    query getSampleParentId($parentId: String!, $text: String) {
        sampleByParentId(parentId: $parentId, text: $text) {
            uid
            sampleId
            status
        }
    }
`;

export const GET_SAMPLES_BY_STORAGE_CONTAINER_UID = gql`
    query getSamplesByStorageContainerUid($uid: String!) {
        samplesByStorageContainerUid(uid: $uid) {
            uid
            sampleId
            storageSlot
            storageSlotIndex
            storageContainerUid
            status
            analysisRequest {
                clientRequestId
            }
        }
    }
`;

export const GET_ALL_QC_LEVELS = gql`
    query getAllQCLevels {
        qcLevelAll {
            uid
            level
        }
    }
`;

export const GET_ALL_QC_TEMPLATES = gql`
    query getAllQCTemplates {
        qcTemplateAll {
            uid
            name
            description
            qcLevels {
                uid
                level
            }
            departments {
                uid
                name
            }
        }
    }
`;

export const GET_ALL_QC_SETS = gql`
    query getQCSeTs($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
        qcSetAll(pageSize: $first, afterCursor: $after, text: $text, sortBy: $sortBy) {
            totalCount
            pageInfo {
                hasNextPage
                hasPreviousPage
                endCursor
                startCursor
            }
            items {
                uid
                name
                note
                createdAt
                samples {
                    uid
                    sampleId
                    status
                    createdByUid
                    createdBy {
                        firstName
                        lastName
                        auth {
                            userName
                        }
                    }
                    createdAt
                    updatedAt
                    assigned
                    qcLevel {
                        uid
                        level
                    }
                    analysisResults {
                        uid
                        status
                        sampleUid
                        result
                        analysisUid
                        retest
                        reportable
                        analysis {
                            uid
                            name
                            sortKey
                            resultOptions {
                                uid
                                optionKey
                                value
                            }
                        }
                        method {
                            uid
                            name
                        }
                        instrument {
                            uid
                            name
                        }
                    }
                    analyses {
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
                    }
                    profiles {
                        uid
                        name
                    }
                }
            }
        }
    }
`;

export const GET_QC_SET_BY_UID = gql`
    query getQCSetByUid($uid: String!) {
        qcSetByUid(uid: $uid) {
            uid
            name
            note
            createdAt
            samples {
                uid
                sampleId
                status
                createdAt
                updatedAt
                assigned
                qcLevel {
                    uid
                    level
                }
                analysisResults {
                    uid
                    status
                    sampleUid
                    result
                    analysisUid
                    retest
                    reportable
                    analysis {
                        uid
                        name
                        sortKey
                        resultOptions {
                            uid
                            optionKey
                            value
                        }
                    }
                    method {
                        uid
                        name
                    }
                    instrument {
                        uid
                        name
                    }
                }
                analyses {
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
                }
                profiles {
                    uid
                    name
                }
            }
        }
    }
`;

export const GET_RESULT_OPTIONS_FOR_ANALYSIS = gql`
    query resultOptionsByAnalysisUid($uid: String!) {
        resultOptionsByAnalysisUid(uid: $uid) {
            uid
            optionKey
            value
            analysisUid
        }
    }
`;

export const GET_ALL_REJECTION_REASONS = gql`
    query getAllRejectionReasons {
        rejectionReasonsAll {
            uid
            reason
        }
    }
`;

export const GET_IMPRESS_META = gql`
    query impressMeta($uids: [String!]!) {
        impressReportsMeta(uids: $uids) {
            uid
            state
            sampleUid
            jsonContent
            emailRequired
            emailSent
            smsRequired
            smsSent
            generatedByUid
            generatedBy {
                firstName
                lastName
            }
            dateGenerated
        }
    }
`;

export const DOWNLOAD_IMPRESS_SAMPLES = gql`
    query impressReports($uids: [String!]!) {
        impressReportsDownload(uids: $uids)
    }
`;

export const DOWNLOAD_IMPRESS = gql`
    query impressReport($uid: String!) {
        impressReportDownload(uid: $uid)
    }
`;
