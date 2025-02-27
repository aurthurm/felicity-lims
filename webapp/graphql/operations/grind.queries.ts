import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetGrindErrandsQueryVariables = Types.Exact<{
  first: Types.Scalars['Int']['input'];
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
  text: Types.Scalars['String']['input'];
  sortBy?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
}>;


export type GetGrindErrandsQuery = (
  { __typename?: 'Query' }
  & { grindErrandAll: (
    { __typename?: 'GrindErrandCursorPage' }
    & Pick<Types.GrindErrandCursorPage, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>
    ), items?: Types.Maybe<Array<(
      { __typename?: 'GrindErrandType' }
      & Pick<Types.GrindErrandType, 'uid' | 'title' | 'description' | 'category' | 'priority' | 'startDate' | 'endDate' | 'createdAt'>
      & { poster?: Types.Maybe<(
        { __typename?: 'GrindPosterType' }
        & Pick<Types.GrindPosterType, 'uid' | 'title'>
      )>, stamps: Array<(
        { __typename?: 'GrindStampType' }
        & Pick<Types.GrindStampType, 'uid' | 'title'>
      )>, label?: Types.Maybe<(
        { __typename?: 'GrindLabelType' }
        & Pick<Types.GrindLabelType, 'uid' | 'title'>
      )>, createdBy?: Types.Maybe<(
        { __typename?: 'UserType' }
        & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
      )>, assignee?: Types.Maybe<(
        { __typename?: 'UserType' }
        & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
      )>, reporter?: Types.Maybe<(
        { __typename?: 'UserType' }
        & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
      )>, members: Array<(
        { __typename?: 'UserType' }
        & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
      )> }
    )>> }
  ) }
);

export type GetGrindErrandQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetGrindErrandQuery = (
  { __typename?: 'Query' }
  & { grindErrandByUid?: Types.Maybe<(
    { __typename?: 'GrindErrandType' }
    & Pick<Types.GrindErrandType, 'uid' | 'title' | 'description' | 'category' | 'priority' | 'startDate' | 'endDate' | 'createdAt'>
    & { poster?: Types.Maybe<(
      { __typename?: 'GrindPosterType' }
      & Pick<Types.GrindPosterType, 'uid' | 'category' | 'description' | 'status' | 'title'>
    )>, stamps: Array<(
      { __typename?: 'GrindStampType' }
      & Pick<Types.GrindStampType, 'uid' | 'title'>
    )>, label?: Types.Maybe<(
      { __typename?: 'GrindLabelType' }
      & Pick<Types.GrindLabelType, 'uid' | 'title'>
    )>, assignee?: Types.Maybe<(
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
    )>, reporter?: Types.Maybe<(
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
    )>, members: Array<(
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
    )>, createdBy?: Types.Maybe<(
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
    )> }
  )> }
);

export type GetGrindOccurrenciesByTargetQueryVariables = Types.Exact<{
  target: Types.Scalars['String']['input'];
  targetUid: Types.Scalars['String']['input'];
}>;


export type GetGrindOccurrenciesByTargetQuery = (
  { __typename?: 'Query' }
  & { grindOccurrencesByTarget: Array<(
    { __typename?: 'GrindOccurrenceType' }
    & Pick<Types.GrindOccurrenceType, 'uid' | 'description' | 'target' | 'targetUid' | 'createdAt'>
    & { actor?: Types.Maybe<(
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
    )> }
  )> }
);

export type GetGrindMilestonesByErrandQueryVariables = Types.Exact<{
  errandUid: Types.Scalars['String']['input'];
}>;


export type GetGrindMilestonesByErrandQuery = (
  { __typename?: 'Query' }
  & { grindMilestonesByErrand: Array<(
    { __typename?: 'GrindMilestoneType' }
    & Pick<Types.GrindMilestoneType, 'uid' | 'title' | 'description' | 'createdAt' | 'complete'>
    & { errand?: Types.Maybe<(
      { __typename?: 'GrindErrandType' }
      & Pick<Types.GrindErrandType, 'uid'>
    )>, createdBy?: Types.Maybe<(
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
    )>, assignee?: Types.Maybe<(
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
    )> }
  )> }
);

export type GetGrindMediaQueryVariables = Types.Exact<{
  target: Types.Scalars['String']['input'];
  targetUid: Types.Scalars['String']['input'];
}>;


export type GetGrindMediaQuery = (
  { __typename?: 'Query' }
  & { grindMediaByTarget: Array<(
    { __typename?: 'GrindMediaType' }
    & Pick<Types.GrindMediaType, 'uid' | 'target' | 'targetUid' | 'destination' | 'encoding' | 'filename' | 'mimetype' | 'originalName' | 'path' | 'size' | 'createdAt'>
    & { createdBy?: Types.Maybe<(
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
    )> }
  )> }
);

export type GetSchemesQueryVariables = Types.Exact<{
  first: Types.Scalars['Int']['input'];
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
  text: Types.Scalars['String']['input'];
  sortBy?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
}>;


export type GetSchemesQuery = (
  { __typename?: 'Query' }
  & { grindSchemeAll: (
    { __typename?: 'GrindSchemeCursorPage' }
    & Pick<Types.GrindSchemeCursorPage, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>
    ), items?: Types.Maybe<Array<(
      { __typename?: 'GrindSchemeType' }
      & Pick<Types.GrindSchemeType, 'uid' | 'title' | 'description' | 'startDate' | 'endDate' | 'createdAt'>
      & { assignee?: Types.Maybe<(
        { __typename?: 'UserType' }
        & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
      )>, members: Array<(
        { __typename?: 'UserType' }
        & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
      )>, createdBy?: Types.Maybe<(
        { __typename?: 'UserType' }
        & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
      )> }
    )>> }
  ) }
);

export type GetSchemeQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type GetSchemeQuery = (
  { __typename?: 'Query' }
  & { grindSchemeByUid?: Types.Maybe<(
    { __typename?: 'GrindSchemeType' }
    & Pick<Types.GrindSchemeType, 'uid' | 'title' | 'description' | 'startDate' | 'endDate' | 'createdAt'>
    & { assignee?: Types.Maybe<(
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
    )>, members: Array<(
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
    )>, boards: Array<(
      { __typename?: 'GrindBoardType' }
      & Pick<Types.GrindBoardType, 'uid' | 'title' | 'description'>
    )>, createdBy?: Types.Maybe<(
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
    )> }
  )> }
);

export type GetPostersByBoardQueryVariables = Types.Exact<{
  boardUid: Types.Scalars['String']['input'];
}>;


export type GetPostersByBoardQuery = (
  { __typename?: 'Query' }
  & { grindPostersByBoard: Array<(
    { __typename?: 'GrindPosterType' }
    & Pick<Types.GrindPosterType, 'uid' | 'title'>
    & { board?: Types.Maybe<(
      { __typename?: 'GrindBoardType' }
      & Pick<Types.GrindBoardType, 'uid'>
    )>, errands: Array<(
      { __typename?: 'GrindErrandType' }
      & Pick<Types.GrindErrandType, 'uid' | 'title' | 'description' | 'priority' | 'startDate' | 'endDate' | 'progress'>
      & { poster?: Types.Maybe<(
        { __typename?: 'GrindPosterType' }
        & Pick<Types.GrindPosterType, 'uid'>
      )>, stamps: Array<(
        { __typename?: 'GrindStampType' }
        & Pick<Types.GrindStampType, 'uid' | 'title'>
      )>, label?: Types.Maybe<(
        { __typename?: 'GrindLabelType' }
        & Pick<Types.GrindLabelType, 'uid'>
      )>, assignee?: Types.Maybe<(
        { __typename?: 'UserType' }
        & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
      )>, members: Array<(
        { __typename?: 'UserType' }
        & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
      )> }
    )> }
  )> }
);

export type GetGrindStampAllQueryVariables = Types.Exact<{
  first: Types.Scalars['Int']['input'];
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
  text: Types.Scalars['String']['input'];
  sortBy?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
}>;


export type GetGrindStampAllQuery = (
  { __typename?: 'Query' }
  & { grindStampAll: (
    { __typename?: 'GrindStampCursorPage' }
    & Pick<Types.GrindStampCursorPage, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>
    ), items?: Types.Maybe<Array<(
      { __typename?: 'GrindStampType' }
      & Pick<Types.GrindStampType, 'uid' | 'title' | 'category'>
    )>> }
  ) }
);

export type GetGrindLabelAllQueryVariables = Types.Exact<{
  first: Types.Scalars['Int']['input'];
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
  text: Types.Scalars['String']['input'];
  sortBy?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
}>;


export type GetGrindLabelAllQuery = (
  { __typename?: 'Query' }
  & { grindLabelAll: (
    { __typename?: 'GrindLabelCursorPage' }
    & Pick<Types.GrindLabelCursorPage, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>
    ), items?: Types.Maybe<Array<(
      { __typename?: 'GrindLabelType' }
      & Pick<Types.GrindLabelType, 'uid' | 'title' | 'category'>
    )>> }
  ) }
);


export const GetGrindErrandsDocument = gql`
    query GetGrindErrands($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
  grindErrandAll(
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
      title
      description
      category
      priority
      startDate
      endDate
      poster {
        uid
        title
      }
      stamps {
        uid
        title
      }
      label {
        uid
        title
      }
      createdBy {
        uid
        firstName
        lastName
      }
      assignee {
        uid
        firstName
        lastName
      }
      reporter {
        uid
        firstName
        lastName
      }
      members {
        uid
        firstName
        lastName
      }
      createdAt
    }
  }
}
    `;

export function useGetGrindErrandsQuery(options: Omit<Urql.UseQueryArgs<never, GetGrindErrandsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetGrindErrandsQuery>({ query: GetGrindErrandsDocument, ...options });
};
export const GetGrindErrandDocument = gql`
    query GetGrindErrand($uid: String!) {
  grindErrandByUid(uid: $uid) {
    uid
    title
    description
    category
    priority
    startDate
    endDate
    poster {
      uid
      category
      description
      status
      title
    }
    stamps {
      uid
      title
    }
    label {
      uid
      title
    }
    assignee {
      uid
      firstName
      lastName
    }
    reporter {
      uid
      firstName
      lastName
    }
    members {
      uid
      firstName
      lastName
    }
    createdBy {
      uid
      firstName
      lastName
    }
    createdAt
  }
}
    `;

export function useGetGrindErrandQuery(options: Omit<Urql.UseQueryArgs<never, GetGrindErrandQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetGrindErrandQuery>({ query: GetGrindErrandDocument, ...options });
};
export const GetGrindOccurrenciesByTargetDocument = gql`
    query GetGrindOccurrenciesByTarget($target: String!, $targetUid: String!) {
  grindOccurrencesByTarget(target: $target, targetUid: $targetUid) {
    uid
    description
    target
    targetUid
    actor {
      uid
      firstName
      lastName
    }
    createdAt
  }
}
    `;

export function useGetGrindOccurrenciesByTargetQuery(options: Omit<Urql.UseQueryArgs<never, GetGrindOccurrenciesByTargetQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetGrindOccurrenciesByTargetQuery>({ query: GetGrindOccurrenciesByTargetDocument, ...options });
};
export const GetGrindMilestonesByErrandDocument = gql`
    query GetGrindMilestonesByErrand($errandUid: String!) {
  grindMilestonesByErrand(errandUid: $errandUid) {
    uid
    title
    description
    errand {
      uid
    }
    createdBy {
      uid
      firstName
      lastName
    }
    assignee {
      uid
      firstName
      lastName
    }
    createdAt
    complete
  }
}
    `;

export function useGetGrindMilestonesByErrandQuery(options: Omit<Urql.UseQueryArgs<never, GetGrindMilestonesByErrandQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetGrindMilestonesByErrandQuery>({ query: GetGrindMilestonesByErrandDocument, ...options });
};
export const GetGrindMediaDocument = gql`
    query GetGrindMedia($target: String!, $targetUid: String!) {
  grindMediaByTarget(target: $target, targetUid: $targetUid) {
    uid
    target
    targetUid
    destination
    encoding
    filename
    mimetype
    originalName
    path
    size
    createdBy {
      uid
      firstName
      lastName
    }
    createdAt
  }
}
    `;

export function useGetGrindMediaQuery(options: Omit<Urql.UseQueryArgs<never, GetGrindMediaQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetGrindMediaQuery>({ query: GetGrindMediaDocument, ...options });
};
export const GetSchemesDocument = gql`
    query GetSchemes($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
  grindSchemeAll(
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
      title
      description
      startDate
      endDate
      assignee {
        uid
        firstName
        lastName
      }
      members {
        uid
        firstName
        lastName
      }
      createdBy {
        uid
        firstName
        lastName
      }
      createdAt
    }
  }
}
    `;

export function useGetSchemesQuery(options: Omit<Urql.UseQueryArgs<never, GetSchemesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetSchemesQuery>({ query: GetSchemesDocument, ...options });
};
export const GetSchemeDocument = gql`
    query GetScheme($uid: String!) {
  grindSchemeByUid(uid: $uid) {
    uid
    title
    description
    startDate
    endDate
    assignee {
      uid
      firstName
      lastName
    }
    members {
      uid
      firstName
      lastName
    }
    boards {
      uid
      title
      description
    }
    createdBy {
      uid
      firstName
      lastName
    }
    createdAt
  }
}
    `;

export function useGetSchemeQuery(options: Omit<Urql.UseQueryArgs<never, GetSchemeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetSchemeQuery>({ query: GetSchemeDocument, ...options });
};
export const GetPostersByBoardDocument = gql`
    query GetPostersByBoard($boardUid: String!) {
  grindPostersByBoard(boardUid: $boardUid) {
    uid
    title
    board {
      uid
    }
    errands {
      uid
      title
      description
      priority
      startDate
      endDate
      progress
      poster {
        uid
      }
      stamps {
        uid
        title
      }
      label {
        uid
      }
      assignee {
        uid
        firstName
        lastName
      }
      members {
        uid
        firstName
        lastName
      }
    }
  }
}
    `;

export function useGetPostersByBoardQuery(options: Omit<Urql.UseQueryArgs<never, GetPostersByBoardQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetPostersByBoardQuery>({ query: GetPostersByBoardDocument, ...options });
};
export const GetGrindStampAllDocument = gql`
    query GetGrindStampAll($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
  grindStampAll(
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
      title
      category
    }
  }
}
    `;

export function useGetGrindStampAllQuery(options: Omit<Urql.UseQueryArgs<never, GetGrindStampAllQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetGrindStampAllQuery>({ query: GetGrindStampAllDocument, ...options });
};
export const GetGrindLabelAllDocument = gql`
    query GetGrindLabelAll($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
  grindLabelAll(
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
      title
      category
    }
  }
}
    `;

export function useGetGrindLabelAllQuery(options: Omit<Urql.UseQueryArgs<never, GetGrindLabelAllQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetGrindLabelAllQuery>({ query: GetGrindLabelAllDocument, ...options });
};