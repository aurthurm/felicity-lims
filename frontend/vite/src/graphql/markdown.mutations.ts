import gql from 'graphql-tag';

export const ADD_MARKDOWN_DOCUMENT = gql`
  mutation AddMDocument($name: String!, $departmentUid: Int) {
    createDocument(name: $name, departmentUid: $departmentUid){
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
  mutation editMDocument($uid: Int!, $name: String, $departmentUid: Int, $content: String){
    updateDocument(uid: $uid, name: $name, departmentUid: $departmentUid, content: $content){
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
