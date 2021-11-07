import gql from 'graphql-tag';

export const AUTHENTICATE_USER = gql`
  mutation AuthenticateUser($username: String!, $password: String!) {
    authenticateUser(password: $password, username: $username) {
      token
      tokenType
      user {
        uid
        firstName
        lastName
        groups {
          uid
          name
          keyword
          permissions {
            uid
            action
            target
          }
        }
      }
    }
  }`;


export const ADD_USER = gql`
  mutation addUser($firstName: String!, $lastName: String!, $email: String!) {
    createUser(
    firstName: $firstName, 
    lastName: $lastName, 
    email: $email,
  ){
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
        uid
        name
        keyword
        permissions {
          uid
          action
          target
        }
      }
  }
  }
`;


export const EDIT_USER = gql`
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
        uid
        name
        keyword
        permissions {
          uid
          action
          target
        }
      }
    }
  }
`;


export const ADD_USER_AUTH = gql`
  mutation addUserAuth($userUid: Int!, $username: String!, $password: String!, $passwordc: String!) {
    createUserAuth(
      userUid: $userUid, 
      username: $username, 
      password: $password, 
      passwordc: $passwordc, 
    ){
      uid
      userName
      userType
      isBlocked
      loginRetry
    }
  }
`;


export const EDIT_USER_AUTH = gql`
  mutation  editUserAuth($userUid: Int!, $username: String!, $password: String!, $passwordc: String!) {
    updateUserAuth(
      userUid: $userUid, 
      username: $username, 
      password: $password, 
      passwordc: $passwordc, 
    ){
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
        uid
        name
        keyword
        permissions {
          uid
          action
          target
        }
      }
    }
  }
`;


export const UPDATE_GROUP_PERMS = gql`
  mutation updateGroupsAndPermissions($groupUid: Int!, $permissionUid: Int!) {
    updateGroupPermissions(groupUid: $groupUid, permissionUid: $permissionUid) {
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
  }`;


export const ADD_DEPARTMENT = gql`
  mutation addDepartment($name: String!) {
    createDepartment(name: $name) {
      uid
      name
    }
  }`;


export const UPDATE_DEPARTMENT = gql`
  mutation editDepartment($uid: Int!, $name: String!) {
    updateDepartment(uid: $uid, name: $name) {
      uid
      name
    }
  }`;
