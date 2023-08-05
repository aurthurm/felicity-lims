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

