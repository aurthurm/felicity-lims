import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AuthenticateUserMutationVariables = Types.Exact<{
  username: Types.Scalars['String']['input'];
  password: Types.Scalars['String']['input'];
}>;


export type AuthenticateUserMutation = (
  { __typename?: 'Mutation' }
  & { authenticateUser: (
    { __typename: 'AuthenticatedData' }
    & Pick<Types.AuthenticatedData, 'token' | 'refresh' | 'tokenType'>
    & { user: (
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
      & { groups?: Types.Maybe<Array<(
        { __typename?: 'GroupType' }
        & Pick<Types.GroupType, 'uid' | 'name' | 'keyword' | 'pages'>
        & { permissions?: Types.Maybe<Array<(
          { __typename?: 'PermissionType' }
          & Pick<Types.PermissionType, 'uid' | 'action' | 'target'>
        )>> }
      )>>, preference?: Types.Maybe<(
        { __typename?: 'UserPreferenceType' }
        & Pick<Types.UserPreferenceType, 'uid' | 'expandedMenu' | 'theme'>
        & { departments?: Types.Maybe<Array<(
          { __typename?: 'DepartmentType' }
          & Pick<Types.DepartmentType, 'uid' | 'name'>
        )>> }
      )> }
    ), laboratories?: Types.Maybe<Array<(
      { __typename?: 'LaboratoryType' }
      & Pick<Types.LaboratoryType, 'uid' | 'name'>
    )>>, activeLaboratory?: Types.Maybe<(
      { __typename?: 'LaboratoryType' }
      & Pick<Types.LaboratoryType, 'uid' | 'name'>
    )> }
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type RequestPassResetMutationVariables = Types.Exact<{
  email: Types.Scalars['String']['input'];
}>;


export type RequestPassResetMutation = (
  { __typename?: 'Mutation' }
  & { requestPasswordReset: (
    { __typename: 'MessagesType' }
    & Pick<Types.MessagesType, 'message'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type ValidatePassResetTokenMutationVariables = Types.Exact<{
  token: Types.Scalars['String']['input'];
}>;


export type ValidatePassResetTokenMutation = (
  { __typename?: 'Mutation' }
  & { validatePasswordResetToken: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'PasswordResetValidityType' }
    & Pick<Types.PasswordResetValidityType, 'username'>
  ) }
);

export type PasswordResetMutationVariables = Types.Exact<{
  userUid: Types.Scalars['String']['input'];
  password: Types.Scalars['String']['input'];
  passwordc: Types.Scalars['String']['input'];
}>;


export type PasswordResetMutation = (
  { __typename?: 'Mutation' }
  & { resetPassword: (
    { __typename: 'MessagesType' }
    & Pick<Types.MessagesType, 'message'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type TokenRefreshMutationVariables = Types.Exact<{
  refreshToken: Types.Scalars['String']['input'];
}>;


export type TokenRefreshMutation = (
  { __typename?: 'Mutation' }
  & { refresh: (
    { __typename: 'AuthenticatedData' }
    & Pick<Types.AuthenticatedData, 'token' | 'refresh' | 'tokenType'>
    & { user: (
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
      & { groups?: Types.Maybe<Array<(
        { __typename?: 'GroupType' }
        & Pick<Types.GroupType, 'uid' | 'name' | 'keyword' | 'pages'>
        & { permissions?: Types.Maybe<Array<(
          { __typename?: 'PermissionType' }
          & Pick<Types.PermissionType, 'uid' | 'action' | 'target'>
        )>> }
      )>>, preference?: Types.Maybe<(
        { __typename?: 'UserPreferenceType' }
        & Pick<Types.UserPreferenceType, 'uid' | 'expandedMenu' | 'theme'>
        & { departments?: Types.Maybe<Array<(
          { __typename?: 'DepartmentType' }
          & Pick<Types.DepartmentType, 'uid' | 'name'>
        )>> }
      )> }
    ) }
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddUserMutationVariables = Types.Exact<{
  firstName: Types.Scalars['String']['input'];
  lastName: Types.Scalars['String']['input'];
  email: Types.Scalars['String']['input'];
  groupUid?: Types.InputMaybe<Types.Scalars['String']['input']>;
  userName: Types.Scalars['String']['input'];
  password: Types.Scalars['String']['input'];
  passwordc: Types.Scalars['String']['input'];
}>;


export type AddUserMutation = (
  { __typename?: 'Mutation' }
  & { createUser: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename?: 'UserType' }
    & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName' | 'email' | 'isActive' | 'isSuperuser' | 'mobilePhone' | 'userName' | 'isBlocked'>
    & { groups?: Types.Maybe<Array<(
      { __typename?: 'GroupType' }
      & Pick<Types.GroupType, 'uid' | 'name' | 'keyword' | 'pages'>
      & { permissions?: Types.Maybe<Array<(
        { __typename?: 'PermissionType' }
        & Pick<Types.PermissionType, 'uid' | 'action' | 'target'>
      )>> }
    )>> }
  ) }
);

export type EditUserMutationVariables = Types.Exact<{
  userUid: Types.Scalars['String']['input'];
  firstName: Types.Scalars['String']['input'];
  lastName?: Types.InputMaybe<Types.Scalars['String']['input']>;
  userName?: Types.InputMaybe<Types.Scalars['String']['input']>;
  email?: Types.InputMaybe<Types.Scalars['String']['input']>;
  groupUid?: Types.InputMaybe<Types.Scalars['String']['input']>;
  mobilePhone?: Types.InputMaybe<Types.Scalars['String']['input']>;
  isActive?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  isBlocked?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  password?: Types.InputMaybe<Types.Scalars['String']['input']>;
  passwordc?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type EditUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUser: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename?: 'UserType' }
    & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName' | 'email' | 'isActive' | 'isSuperuser' | 'mobilePhone' | 'userName' | 'isBlocked'>
    & { groups?: Types.Maybe<Array<(
      { __typename?: 'GroupType' }
      & Pick<Types.GroupType, 'uid' | 'name' | 'keyword' | 'pages'>
      & { permissions?: Types.Maybe<Array<(
        { __typename?: 'PermissionType' }
        & Pick<Types.PermissionType, 'uid' | 'action' | 'target'>
      )>> }
    )>> }
  ) }
);

export type AddGroupMutationVariables = Types.Exact<{
  payload: Types.GroupInputType;
}>;


export type AddGroupMutation = (
  { __typename?: 'Mutation' }
  & { createGroup: (
    { __typename: 'GroupType' }
    & Pick<Types.GroupType, 'uid' | 'name' | 'pages' | 'active'>
    & { permissions?: Types.Maybe<Array<(
      { __typename?: 'PermissionType' }
      & Pick<Types.PermissionType, 'uid' | 'action' | 'target' | 'active'>
    )>> }
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditGroupMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.GroupInputType;
}>;


export type EditGroupMutation = (
  { __typename?: 'Mutation' }
  & { updateGroup: (
    { __typename: 'GroupType' }
    & Pick<Types.GroupType, 'uid' | 'name' | 'pages' | 'active'>
    & { permissions?: Types.Maybe<Array<(
      { __typename?: 'PermissionType' }
      & Pick<Types.PermissionType, 'uid' | 'action' | 'target' | 'active'>
    )>> }
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type UpdateGroupsAndPermissionsMutationVariables = Types.Exact<{
  groupUid: Types.Scalars['String']['input'];
  permissionUid: Types.Scalars['String']['input'];
}>;


export type UpdateGroupsAndPermissionsMutation = (
  { __typename?: 'Mutation' }
  & { updateGroupPermissions: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename?: 'UpdatedGroupPerms' }
    & { group: (
      { __typename?: 'GroupType' }
      & Pick<Types.GroupType, 'uid' | 'name' | 'pages' | 'active'>
      & { permissions?: Types.Maybe<Array<(
        { __typename?: 'PermissionType' }
        & Pick<Types.PermissionType, 'uid' | 'action' | 'target' | 'active'>
      )>> }
    ), permission: (
      { __typename?: 'PermissionType' }
      & Pick<Types.PermissionType, 'uid' | 'action' | 'target'>
    ) }
  ) }
);

export type AddDepartmentMutationVariables = Types.Exact<{
  payload: Types.DepartmentInputType;
}>;


export type AddDepartmentMutation = (
  { __typename?: 'Mutation' }
  & { createDepartment: (
    { __typename?: 'DepartmentType' }
    & Pick<Types.DepartmentType, 'uid' | 'name'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditDepartmentMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.DepartmentInputType;
}>;


export type EditDepartmentMutation = (
  { __typename?: 'Mutation' }
  & { updateDepartment: (
    { __typename?: 'DepartmentType' }
    & Pick<Types.DepartmentType, 'uid' | 'name'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditLaboratoryMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.LaboratoryInputType;
}>;


export type EditLaboratoryMutation = (
  { __typename?: 'Mutation' }
  & { updateLaboratory: (
    { __typename?: 'LaboratoryType' }
    & Pick<Types.LaboratoryType, 'uid' | 'name' | 'tagLine' | 'labManagerUid' | 'email' | 'emailCc' | 'mobilePhone' | 'businessPhone' | 'address' | 'banking' | 'logo' | 'qualityStatement'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditLaboratorySettingMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.LaboratorySettingInputType;
}>;


export type EditLaboratorySettingMutation = (
  { __typename?: 'Mutation' }
  & { updateLaboratorySetting: (
    { __typename?: 'LaboratorySettingType' }
    & Pick<Types.LaboratorySettingType, 'uid' | 'laboratoryUid' | 'allowSelfVerification' | 'allowPatientRegistration' | 'allowSampleRegistration' | 'allowWorksheetCreation' | 'defaultRoute' | 'passwordLifetime' | 'inactivityLogOut' | 'defaultTheme' | 'autoReceiveSamples' | 'stickerCopies' | 'allowBilling' | 'allowAutoBilling' | 'currency' | 'paymentTermsDays'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);


export const AuthenticateUserDocument = gql`
    mutation AuthenticateUser($username: String!, $password: String!) {
  authenticateUser(password: $password, username: $username) {
    ... on AuthenticatedData {
      __typename
      token
      refresh
      tokenType
      user {
        uid
        firstName
        lastName
        groups {
          permissions {
            uid
            action
            target
          }
          uid
          name
          keyword
          pages
        }
        preference {
          uid
          expandedMenu
          theme
          departments {
            uid
            name
          }
        }
      }
      laboratories {
        uid
        name
      }
      activeLaboratory {
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

export function useAuthenticateUserMutation() {
  return Urql.useMutation<AuthenticateUserMutation, AuthenticateUserMutationVariables>(AuthenticateUserDocument);
};
export const RequestPassResetDocument = gql`
    mutation RequestPassReset($email: String!) {
  requestPasswordReset(email: $email) {
    ... on MessagesType {
      __typename
      message
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useRequestPassResetMutation() {
  return Urql.useMutation<RequestPassResetMutation, RequestPassResetMutationVariables>(RequestPassResetDocument);
};
export const ValidatePassResetTokenDocument = gql`
    mutation ValidatePassResetToken($token: String!) {
  validatePasswordResetToken(token: $token) {
    ... on PasswordResetValidityType {
      __typename
      username
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useValidatePassResetTokenMutation() {
  return Urql.useMutation<ValidatePassResetTokenMutation, ValidatePassResetTokenMutationVariables>(ValidatePassResetTokenDocument);
};
export const PasswordResetDocument = gql`
    mutation PasswordReset($userUid: String!, $password: String!, $passwordc: String!) {
  resetPassword(userUid: $userUid, password: $password, passwordc: $passwordc) {
    ... on MessagesType {
      __typename
      message
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function usePasswordResetMutation() {
  return Urql.useMutation<PasswordResetMutation, PasswordResetMutationVariables>(PasswordResetDocument);
};
export const TokenRefreshDocument = gql`
    mutation TokenRefresh($refreshToken: String!) {
  refresh(refreshToken: $refreshToken) {
    ... on AuthenticatedData {
      __typename
      token
      refresh
      tokenType
      user {
        uid
        firstName
        lastName
        groups {
          permissions {
            uid
            action
            target
          }
          uid
          name
          keyword
          pages
        }
        preference {
          uid
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
}
    `;

export function useTokenRefreshMutation() {
  return Urql.useMutation<TokenRefreshMutation, TokenRefreshMutationVariables>(TokenRefreshDocument);
};
export const AddUserDocument = gql`
    mutation AddUser($firstName: String!, $lastName: String!, $email: String!, $groupUid: String, $userName: String!, $password: String!, $passwordc: String!) {
  createUser(
    firstName: $firstName
    lastName: $lastName
    email: $email
    groupUid: $groupUid
    userName: $userName
    password: $password
    passwordc: $passwordc
  ) {
    ... on UserType {
      uid
      firstName
      lastName
      email
      isActive
      isSuperuser
      mobilePhone
      userName
      isBlocked
      groups {
        permissions {
          uid
          action
          target
        }
        uid
        name
        keyword
        pages
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

export function useAddUserMutation() {
  return Urql.useMutation<AddUserMutation, AddUserMutationVariables>(AddUserDocument);
};
export const EditUserDocument = gql`
    mutation EditUser($userUid: String!, $firstName: String!, $lastName: String, $userName: String, $email: String, $groupUid: String, $mobilePhone: String, $isActive: Boolean, $isBlocked: Boolean, $password: String, $passwordc: String) {
  updateUser(
    userUid: $userUid
    firstName: $firstName
    lastName: $lastName
    userName: $userName
    email: $email
    groupUid: $groupUid
    mobilePhone: $mobilePhone
    isActive: $isActive
    isBlocked: $isBlocked
    password: $password
    passwordc: $passwordc
  ) {
    ... on UserType {
      uid
      firstName
      lastName
      email
      isActive
      isSuperuser
      mobilePhone
      userName
      isBlocked
      groups {
        permissions {
          uid
          action
          target
        }
        uid
        name
        keyword
        pages
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

export function useEditUserMutation() {
  return Urql.useMutation<EditUserMutation, EditUserMutationVariables>(EditUserDocument);
};
export const AddGroupDocument = gql`
    mutation AddGroup($payload: GroupInputType!) {
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
}
    `;

export function useAddGroupMutation() {
  return Urql.useMutation<AddGroupMutation, AddGroupMutationVariables>(AddGroupDocument);
};
export const EditGroupDocument = gql`
    mutation EditGroup($uid: String!, $payload: GroupInputType!) {
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
}
    `;

export function useEditGroupMutation() {
  return Urql.useMutation<EditGroupMutation, EditGroupMutationVariables>(EditGroupDocument);
};
export const UpdateGroupsAndPermissionsDocument = gql`
    mutation UpdateGroupsAndPermissions($groupUid: String!, $permissionUid: String!) {
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
}
    `;

export function useUpdateGroupsAndPermissionsMutation() {
  return Urql.useMutation<UpdateGroupsAndPermissionsMutation, UpdateGroupsAndPermissionsMutationVariables>(UpdateGroupsAndPermissionsDocument);
};
export const AddDepartmentDocument = gql`
    mutation AddDepartment($payload: DepartmentInputType!) {
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
}
    `;

export function useAddDepartmentMutation() {
  return Urql.useMutation<AddDepartmentMutation, AddDepartmentMutationVariables>(AddDepartmentDocument);
};
export const EditDepartmentDocument = gql`
    mutation EditDepartment($uid: String!, $payload: DepartmentInputType!) {
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
}
    `;

export function useEditDepartmentMutation() {
  return Urql.useMutation<EditDepartmentMutation, EditDepartmentMutationVariables>(EditDepartmentDocument);
};
export const EditLaboratoryDocument = gql`
    mutation EditLaboratory($uid: String!, $payload: LaboratoryInputType!) {
  updateLaboratory(uid: $uid, payload: $payload) {
    ... on LaboratoryType {
      uid
      name
      tagLine
      labManagerUid
      email
      emailCc
      mobilePhone
      businessPhone
      address
      banking
      logo
      qualityStatement
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditLaboratoryMutation() {
  return Urql.useMutation<EditLaboratoryMutation, EditLaboratoryMutationVariables>(EditLaboratoryDocument);
};
export const EditLaboratorySettingDocument = gql`
    mutation EditLaboratorySetting($uid: String!, $payload: LaboratorySettingInputType!) {
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
      allowBilling
      allowAutoBilling
      currency
      paymentTermsDays
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditLaboratorySettingMutation() {
  return Urql.useMutation<EditLaboratorySettingMutation, EditLaboratorySettingMutationVariables>(EditLaboratorySettingDocument);
};