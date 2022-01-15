import gql from 'graphql-tag';

const GroupTypeFields = gql`
fragment GroupTypeFields on GroupType {
  uid
  name
  keyword
}`

const PermissionTypeFields = gql`
fragment PermissionTypeFields on PermissionType {
  uid
  action
  target
}`

export const AUTHENTICATE_USER = gql`
  ${PermissionTypeFields}
  ${GroupTypeFields}
  mutation AuthenticateUser($username: String!, $password: String!) {
    authenticateUser(password: $password, username: $username) {
      ... on AuthenticatedData {
        __typename
        token
        tokenType
        user {
          uid
          firstName
          lastName
          groups {
            permissions {
              ...PermissionTypeFields
            }
            ...GroupTypeFields
          }
        }
      }
      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }`;


export const ADD_USER = gql`
  ${PermissionTypeFields}
  ${GroupTypeFields}
  mutation addUser($firstName: String!, $lastName: String!, $email: String!) {
    createUser(
    firstName: $firstName, 
    lastName: $lastName, 
    email: $email,
  ){
    ... on UserType {
      uid
      firstName
      lastName
      email
      isActive
      isSuperuser
      mobilePhone
      auth {
        uid
        userName
        isBlocked
        userType          
      }
      groups {
        permissions {
          ...PermissionTypeFields
        }
        ...GroupTypeFields
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


export const EDIT_USER = gql`
  ${PermissionTypeFields}
  ${GroupTypeFields}
  mutation editUser($userUid: Int!, $firstName: String!, $lastName: String, $email: String, $groupUid: Int, $mobilePhone: String, $isActive: Boolean) {
    updateUser(
      userUid: $userUid,
      firstName: $firstName, 
      lastName: $lastName, 
      email: $email,
      groupUid: $groupUid,
      mobilePhone: $mobilePhone,
      isActive: $isActive,
    ){
      ... on UserType {
        uid
        firstName
        lastName
        email
        isActive
        isSuperuser
        mobilePhone
        auth {
          uid
          userName
          isBlocked
          userType          
        }
        groups {
          permissions {
            ...PermissionTypeFields
          }
          ...GroupTypeFields
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


export const ADD_USER_AUTH = gql`
  mutation addUserAuth($userUid: Int!, $userName: String!, $password: String!, $passwordc: String!) {
    createUserAuth(
      userUid: $userUid, 
      userName: $userName, 
      password: $password, 
      passwordc: $passwordc, 
    ){
      ... on UserAuthType {
        uid
        userName
        userType
        isBlocked
        loginRetry
      }
      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;


export const EDIT_USER_AUTH = gql`
  ${PermissionTypeFields}
  ${GroupTypeFields}
  mutation  editUserAuth($userUid: Int!, $username: String!, $password: String!, $passwordc: String!) {
    updateUserAuth(
      userUid: $userUid, 
      username: $username, 
      password: $password, 
      passwordc: $passwordc, 
    ){
      ... on UserType {
        uid
        firstName
        lastName
        email
        isActive
        isSuperuser
        mobilePhone
        auth {
          uid
          userName
          isBlocked
          userType          
        }
        groups {
          permissions {
            ...PermissionTypeFields
          }
          ...GroupTypeFields
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


export const UPDATE_GROUP_PERMS = gql`
  mutation updateGroupsAndPermissions($groupUid: Int!, $permissionUid: Int!) {
    updateGroupPermissions(groupUid: $groupUid, permissionUid: $permissionUid) {
      ... on UpdatedGroupPerms {
        group {
          uid
          name
          keyword
          active
        }
        permission {
          uid
          action
          target
        }
      }
      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }`;


export const ADD_DEPARTMENT = gql`
  mutation addDepartment($payload: DepartmentInputType!) {
    createDepartment(payload: $payload) {
      ... on DepartmentType {
        uid
        name
      }
      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }`;


export const UPDATE_DEPARTMENT = gql`
  mutation editDepartment($uid: Int!, $payload: DepartmentInputType!) {
    updateDepartment(uid: $uid, payload: $payload) {
      ... on DepartmentType {
        uid
        name
      }
      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }`;
