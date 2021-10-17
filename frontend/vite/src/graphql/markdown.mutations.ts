import gql from 'graphql-tag';

export const ADD_MARKDOWN_DOCUMENT = gql`
  mutation AddMDocument($name: String!, $departmentUid: Int) {
    createDocument(name: $name, departmentUid: $departmentUid){
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

export const EDIT_MARKDOWN_DOCUMENT = gql`
  mutation editMDocument($uid: Int!, $name: String, $departmentUid: Int, $content: String){
    updateDocument(uid: $uid, name: $name, departmentUid: $departmentUid, content: $content){
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
