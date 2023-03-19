import gql from 'graphql-tag';

export const ADD_NOTICE = gql`
  mutation AddNotice($payload: NoticeInputType!) {
    createNotice(payload: $payload){
      ... on NoticeType {
        __typename
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
      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

export const EDIT_NOTICE = gql`
  mutation editNotice($uid: FelicityID!, $payload: NoticeInputType!){
    updateNotice(uid: $uid, payload: $payload){
      ... on NoticeType {
        __typename
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
      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;


export const DELETE_NOTICE = gql`
  mutation deleteNotice($uid: FelicityID!){
    deleteNotice(uid: $uid){
      ... on DeletedItem {
        __typename
        uid
      }
      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
  `;
