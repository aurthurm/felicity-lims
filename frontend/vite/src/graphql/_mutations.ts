import gql from 'graphql-tag';

const GroupTypeFields = gql`
fragment GroupTypeFields on GroupType {
  uid
  name
  keyword
  pages
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
          preferenceUid
          preference {
            expandedMenu
            theme
            departments {
              uid
              name
            }
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
  mutation addUser($firstName: String!, $lastName: String!, $email: String!, $groupUid: FelicityID) {
    createUser(
    firstName: $firstName, 
    lastName: $lastName, 
    email: $email,
    groupUid: $groupUid,
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
  mutation editUser($userUid: FelicityID!, $firstName: String!, $lastName: String, $email: String, $groupUid: FelicityID, $mobilePhone: String, $isActive: Boolean) {
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
${PermissionTypeFields}
${GroupTypeFields}
  mutation addUserAuth($userUid: FelicityID!, $userName: String!, $password: String!, $passwordc: String!) {
    createUserAuth(
      userUid: $userUid, 
      userName: $userName, 
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


export const EDIT_USER_AUTH = gql`
  ${PermissionTypeFields}
  ${GroupTypeFields}
  mutation  editUserAuth($userUid: FelicityID!, $userName: String!, $password: String!, $passwordc: String!) {
    updateUserAuth(
      userUid: $userUid, 
      userName: $userName, 
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

export const ADD_GROUP = gql`
  mutation addGroup($payload: GroupInputType!) {
    createGroup(payload: $payload) {
      ... on GroupType {
        __typename
        uid
        name
        pages
        permissions {
          uid
          action
          target
          active
        }
        active
      }
      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }`;


export const UPDATE_GROUP = gql`
  mutation editGroup($uid: FelicityID!, $payload: GroupInputType!) {
    updateGroup(uid: $uid, payload: $payload) {
      ... on GroupType {
        __typename
        uid
        name
        pages
        permissions {
          uid
          action
          target
          active
        }
        active
      }
      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }`;

export const UPDATE_GROUP_PERMS = gql`
  mutation updateGroupsAndPermissions($groupUid: FelicityID!, $permissionUid: FelicityID!) {
    updateGroupPermissions(groupUid: $groupUid, permissionUid: $permissionUid) {
      ... on UpdatedGroupPerms {
        group {
          uid
          name
          pages
          permissions {
            uid
            action
            target
            active
          }
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
  mutation editDepartment($uid: FelicityID!, $payload: DepartmentInputType!) {
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


export const UPDATE_LABORATOTY = gql`
  mutation editLaboratory($uid: FelicityID!, $payload: LaboratoryInputType!) {
    updateLaboratory(uid: $uid, payload: $payload) {
      ... on LaboratoryType {
        uid
        setupName
        labName
        labManagerUid
        email
        emailCc
        mobilePhone
        businessPhone
        address
        logo
      }
      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }`;

export const UPDATE_LABORATOTY_SETTING = gql`
  mutation editLaboratorySetting($uid: FelicityID!, $payload: LaboratorySettingInputType!) {
    updateLaboratorySetting(uid: $uid, payload: $payload) {
      ... on LaboratorySettingType {
        uid
        laboratoryUid
        allowSelfVerification
        allowPatientRegistration
        allowSampleRegistration
        allowWorksheetCreation
        defaultRoute
        passwordLifetime
        inactivityLogOut
        defaultTheme
        autoReceiveSamples
        stickerCopies
      }
      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }`;