import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetOrganizationQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetOrganizationQuery = (
  { __typename?: 'Query' }
  & { organization: (
    { __typename?: 'OrganizationType' }
    & Pick<Types.OrganizationType, 'uid' | 'name' | 'tagLine' | 'email' | 'emailCc' | 'mobilePhone' | 'businessPhone' | 'address' | 'banking' | 'logo' | 'qualityStatement'>
    & { settings: (
      { __typename?: 'OrganizationSettingType' }
      & Pick<Types.OrganizationSettingType, 'uid' | 'passwordLifetime' | 'inactivityLogOut' | 'allowBilling' | 'allowAutoBilling' | 'currency' | 'paymentTermsDays'>
    ) }
  ) }
);

export type GetLaboratoryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetLaboratoryQuery = (
  { __typename?: 'Query' }
  & { laboratory: (
    { __typename?: 'LaboratoryType' }
    & Pick<Types.LaboratoryType, 'uid' | 'name' | 'tagLine' | 'labManagerUid' | 'email' | 'emailCc' | 'mobilePhone' | 'businessPhone' | 'address' | 'banking' | 'logo' | 'qualityStatement'>
    & { settings?: Types.Maybe<(
      { __typename?: 'LaboratorySettingType' }
      & Pick<Types.LaboratorySettingType, 'uid' | 'laboratoryUid' | 'allowSelfVerification' | 'allowPatientRegistration' | 'allowSampleRegistration' | 'allowWorksheetCreation' | 'defaultRoute' | 'passwordLifetime' | 'inactivityLogOut' | 'defaultTheme' | 'autoReceiveSamples' | 'stickerCopies' | 'allowBilling' | 'allowAutoBilling' | 'currency' | 'paymentTermsDays'>
    )> }
  ) }
);

export type GetAllLaboratoriesQueryVariables = Types.Exact<{
  first?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
  text?: Types.InputMaybe<Types.Scalars['String']['input']>;
  sortBy?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
}>;


export type GetAllLaboratoriesQuery = (
  { __typename?: 'Query' }
  & { laboratoryAll: (
    { __typename?: 'LaboratoryCursorPage' }
    & Pick<Types.LaboratoryCursorPage, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>
    ), items?: Types.Maybe<Array<(
      { __typename?: 'LaboratoryType' }
      & Pick<Types.LaboratoryType, 'uid' | 'name' | 'tagLine' | 'labManagerUid' | 'email' | 'emailCc' | 'mobilePhone' | 'businessPhone' | 'address' | 'banking' | 'logo' | 'qualityStatement'>
      & { settings?: Types.Maybe<(
        { __typename?: 'LaboratorySettingType' }
        & Pick<Types.LaboratorySettingType, 'uid' | 'laboratoryUid' | 'allowSelfVerification' | 'allowPatientRegistration' | 'allowSampleRegistration' | 'allowWorksheetCreation' | 'defaultRoute' | 'passwordLifetime' | 'inactivityLogOut' | 'defaultTheme' | 'autoReceiveSamples' | 'stickerCopies' | 'allowBilling' | 'allowAutoBilling' | 'currency' | 'paymentTermsDays'>
      )> }
    )>> }
  ) }
);

export type UserAllQueryVariables = Types.Exact<{
  first?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
  text?: Types.InputMaybe<Types.Scalars['String']['input']>;
  sortBy?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
}>;


export type UserAllQuery = (
  { __typename?: 'Query' }
  & { userAll: (
    { __typename?: 'UserCursorPage' }
    & Pick<Types.UserCursorPage, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>
    ), items?: Types.Maybe<Array<(
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName' | 'email' | 'isActive' | 'isSuperuser' | 'mobilePhone' | 'userName' | 'isBlocked' | 'activeLaboratoryUid' | 'laboratories'>
      & { groups?: Types.Maybe<Array<(
        { __typename?: 'GroupType' }
        & Pick<Types.GroupType, 'uid' | 'name' | 'keyword' | 'pages'>
        & { permissions?: Types.Maybe<Array<(
          { __typename?: 'PermissionType' }
          & Pick<Types.PermissionType, 'uid' | 'action' | 'target'>
        )>> }
      )>> }
    )>> }
  ) }
);

export type GroupsAndPermissionsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GroupsAndPermissionsQuery = (
  { __typename?: 'Query' }
  & { groupAll: Array<(
    { __typename?: 'GroupType' }
    & Pick<Types.GroupType, 'uid' | 'name' | 'keyword' | 'pages' | 'active'>
    & { permissions?: Types.Maybe<Array<(
      { __typename?: 'PermissionType' }
      & Pick<Types.PermissionType, 'uid' | 'action' | 'target'>
    )>> }
  )>, permissionAll: Array<(
    { __typename?: 'PermissionType' }
    & Pick<Types.PermissionType, 'uid' | 'action' | 'target'>
  )> }
);

export type GetAuditLogsQueryVariables = Types.Exact<{
  targetType: Types.Scalars['String']['input'];
  targetUid: Types.Scalars['String']['input'];
}>;


export type GetAuditLogsQuery = (
  { __typename?: 'Query' }
  & { auditLogsFilter?: Types.Maybe<Array<(
    { __typename?: 'AuditLogType' }
    & Pick<Types.AuditLogType, 'uid' | 'userUid' | 'targetType' | 'targetUid' | 'action' | 'stateBefore' | 'stateAfter'>
  )>> }
);

export type GetAllDepartmentsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllDepartmentsQuery = (
  { __typename?: 'Query' }
  & { departmentAll: Array<(
    { __typename?: 'DepartmentType' }
    & Pick<Types.DepartmentType, 'uid' | 'name' | 'code' | 'description'>
  )> }
);


export const GetOrganizationDocument = gql`
    query getOrganization {
  organization {
    uid
    name
    tagLine
    email
    emailCc
    mobilePhone
    businessPhone
    address
    banking
    logo
    qualityStatement
    settings {
      uid
      passwordLifetime
      inactivityLogOut
      allowBilling
      allowAutoBilling
      currency
      paymentTermsDays
    }
  }
}
    `;

export function useGetOrganizationQuery(options: Omit<Urql.UseQueryArgs<never, GetOrganizationQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetOrganizationQuery>({ query: GetOrganizationDocument, ...options });
};
export const GetLaboratoryDocument = gql`
    query getLaboratory {
  laboratory {
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
    settings {
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
  }
}
    `;

export function useGetLaboratoryQuery(options: Omit<Urql.UseQueryArgs<never, GetLaboratoryQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetLaboratoryQuery>({ query: GetLaboratoryDocument, ...options });
};
export const GetAllLaboratoriesDocument = gql`
    query getAllLaboratories($first: Int, $after: String, $text: String, $sortBy: [String!] = ["uid"]) {
  laboratoryAll(
    pageSize: $first
    afterCursor: $after
    text: $text
    sortBy: $sortBy
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
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
      settings {
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
    }
  }
}
    `;

export function useGetAllLaboratoriesQuery(options: Omit<Urql.UseQueryArgs<never, GetAllLaboratoriesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllLaboratoriesQuery>({ query: GetAllLaboratoriesDocument, ...options });
};
export const UserAllDocument = gql`
    query userAll($first: Int, $after: String, $text: String, $sortBy: [String!] = ["uid"]) {
  userAll(pageSize: $first, afterCursor: $after, text: $text, sortBy: $sortBy) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
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
        uid
        name
        keyword
        pages
        permissions {
          uid
          action
          target
        }
      }
      activeLaboratoryUid
      laboratories
    }
  }
}
    `;

export function useUserAllQuery(options: Omit<Urql.UseQueryArgs<never, UserAllQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserAllQuery>({ query: UserAllDocument, ...options });
};
export const GroupsAndPermissionsDocument = gql`
    query groupsAndPermissions {
  groupAll {
    uid
    name
    keyword
    pages
    active
    permissions {
      uid
      action
      target
    }
  }
  permissionAll {
    uid
    action
    target
  }
}
    `;

export function useGroupsAndPermissionsQuery(options: Omit<Urql.UseQueryArgs<never, GroupsAndPermissionsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GroupsAndPermissionsQuery>({ query: GroupsAndPermissionsDocument, ...options });
};
export const GetAuditLogsDocument = gql`
    query getAuditLogs($targetType: String!, $targetUid: String!) {
  auditLogsFilter(targetType: $targetType, targetUid: $targetUid) {
    uid
    userUid
    targetType
    targetUid
    action
    stateBefore
    stateAfter
  }
}
    `;

export function useGetAuditLogsQuery(options: Omit<Urql.UseQueryArgs<never, GetAuditLogsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAuditLogsQuery>({ query: GetAuditLogsDocument, ...options });
};
export const GetAllDepartmentsDocument = gql`
    query getAllDepartments {
  departmentAll {
    uid
    name
    code
    description
  }
}
    `;

export function useGetAllDepartmentsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllDepartmentsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllDepartmentsQuery>({ query: GetAllDepartmentsDocument, ...options });
};