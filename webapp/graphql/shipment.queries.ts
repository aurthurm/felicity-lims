import gql from 'graphql-tag';

export const GET_ALL_REFERRAL_LABORATORIES = gql`
    query getAllReferralLaboratories {
        referralLaboratoryAll {
            uid
            name
            code
            url
            password
            username
            isReferral
            isReference
        }
    }
`;

export const GET_ALL_SHIPMENTS = gql`
    query getAllShipments($first: Int!, $after: String, $before: String, $incoming: Boolean!, $status: String!, $text: String!, $sortBy: [String!] = ["-uid"]) {
        shipmentAll(pageSize: $first, afterCursor: $after, beforeCursor: $before, incoming: $incoming, status: $status, text: $text, sortBy: $sortBy) {
            totalCount
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            items {
                uid
                shipmentId
                assignedCount
                incoming
                state
                laboratoryUid
                courier
                laboratory { 
                    name
                }
                createdAt
            }
        }
    }
`;

export const GET_SHIPMENT_BY_UID = gql`
    query getShipmentByUid($shipmentUid: String!) {
        shipmentByUid(shipmentUid: $shipmentUid) {
            uid
            shipmentId
            assignedCount
            state
            incoming
            comment
            createdAt
            courier
            jsonContent
            laboratory { 
                name
                url
                username
                password
            }
            samples {
                uid
                sampleId
                status
                analysisRequest {
                    patient {
                        uid
                    }
                }
                analyses {
                    uid
                    name
                    keyword
                }
            }
        }
    }
`;


export const DOWNLOAD_MANIFEST = gql`
    query manifestReport($uid: String!) {
        manifestReportDownload(uid: $uid)
    }
`;