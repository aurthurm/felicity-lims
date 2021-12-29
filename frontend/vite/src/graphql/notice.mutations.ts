import gql from 'graphql-tag';

export const ADD_NOTICE = gql`
  mutation AddNotice($title: String!, $body: String!, $expiry: String!) {
    createNotice(title: $title, body: $body, expiry: $expiry){
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
  mutation editNotice($uid: Int!, $title: String!, $body: String!, $expiry: String!){
    updateNotice(uid: $uid, title: $title, body: $body, expiry: $expiry){
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


export const DELETE_NOTICE = gql`
mutation deleteNotice($uid: Int!){
  deleteNotice(uid: $uid){
    ... on DeleteType {
      __typename
      uid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
}
`;
