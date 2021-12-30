import gql from 'graphql-tag';

export const ADD_MARKDOWN_DOCUMENT = gql`
  mutation AddMDocument($payload: MarkdownInputType!) {
    createDocument(payload: $payload,){
      ... on DocumentType {
        __typename
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

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

export const EDIT_MARKDOWN_DOCUMENT = gql`
  mutation editMDocument($uid: Int!, $payload: MarkdownInputType!){
    updateDocument(uid: $uid, payload: $payload){
      ... on DocumentType {
        __typename
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

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;
