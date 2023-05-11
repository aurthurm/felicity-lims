import gql from 'graphql-tag';

export const GET_NOTICES_BY_CREATOR = gql`
    query getNoticesByCreatorUid($uid: String!) {
        noticesByCreator(uid: $uid) {
            uid
            title
            body
            expiry
            createdByUid
            departments {
                uid
                name
            }
            groups {
                uid
                name
            }
        }
    }
`;

export const GET_ALL_NOTICES = gql`
    query getAllDocuments {
        documentAll {
            uid
            name
            version
            status
            departmentUid
            department {
                uid
                name
            }
        }
    }
`;

export const GET_NOTICE_BY_UID = gql`
    query getDocumentByUid($uid: String!) {
        documentByUid(uid: $uid) {
            uid
            name
            version
            status
            content
            departmentUid
            department {
                uid
                name
            }
        }
    }
`;
