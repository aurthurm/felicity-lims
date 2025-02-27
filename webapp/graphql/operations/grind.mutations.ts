import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AddGrindErrandMutationVariables = Types.Exact<{
  payload: Types.GrindCreateErrandInput;
}>;


export type AddGrindErrandMutation = (
  { __typename?: 'Mutation' }
  & { createGrindErrand: (
    { __typename?: 'GrindErrandType' }
    & Pick<Types.GrindErrandType, 'uid' | 'title' | 'description' | 'posterUid' | 'createdByUid' | 'createdAt'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditGrindErrandMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.GrindUpdateErrandInput;
}>;


export type EditGrindErrandMutation = (
  { __typename?: 'Mutation' }
  & { updateGrindErrand: (
    { __typename?: 'GrindErrandType' }
    & Pick<Types.GrindErrandType, 'uid' | 'title' | 'description' | 'category' | 'priority' | 'startDate' | 'endDate'>
    & { poster?: Types.Maybe<(
      { __typename?: 'GrindPosterType' }
      & Pick<Types.GrindPosterType, 'uid'>
    )>, stamps: Array<(
      { __typename?: 'GrindStampType' }
      & Pick<Types.GrindStampType, 'uid'>
    )>, label?: Types.Maybe<(
      { __typename?: 'GrindLabelType' }
      & Pick<Types.GrindLabelType, 'uid'>
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
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddGrindMilestoneMutationVariables = Types.Exact<{
  payload: Types.GrindCreateMilestoneInput;
}>;


export type AddGrindMilestoneMutation = (
  { __typename?: 'Mutation' }
  & { createGrindMilestone: (
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
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditGrindMilestoneMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.GrindUpdateMilestoneInput;
}>;


export type EditGrindMilestoneMutation = (
  { __typename?: 'Mutation' }
  & { updateGrindMilestone: (
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
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type DeleteMilestoneMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type DeleteMilestoneMutation = (
  { __typename?: 'Mutation' }
  & { deleteGrindMilestone: (
    { __typename?: 'GrindMilestoneType' }
    & Pick<Types.GrindMilestoneType, 'uid'>
  ) | { __typename?: 'OperationError' } }
);

export type AddGrindSchemeMutationVariables = Types.Exact<{
  payload: Types.GrindCreateSchemeInput;
}>;


export type AddGrindSchemeMutation = (
  { __typename?: 'Mutation' }
  & { createGrindScheme: (
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
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditGrindSchemeMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.GrindUpdateSchemeInput;
}>;


export type EditGrindSchemeMutation = (
  { __typename?: 'Mutation' }
  & { updateGrindScheme: (
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
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddGrindBoardMutationVariables = Types.Exact<{
  payload: Types.GrindCreateBoardInput;
}>;


export type AddGrindBoardMutation = (
  { __typename?: 'Mutation' }
  & { createGrindBoard: (
    { __typename?: 'GrindBoardType' }
    & Pick<Types.GrindBoardType, 'uid' | 'title' | 'description' | 'createdAt'>
    & { scheme?: Types.Maybe<(
      { __typename?: 'GrindSchemeType' }
      & Pick<Types.GrindSchemeType, 'uid' | 'title'>
    )>, createdBy?: Types.Maybe<(
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
    )> }
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddGrindPosterMutationVariables = Types.Exact<{
  payload: Types.GrindCreatePosterInput;
}>;


export type AddGrindPosterMutation = (
  { __typename?: 'Mutation' }
  & { createGrindPoster: (
    { __typename?: 'GrindPosterType' }
    & Pick<Types.GrindPosterType, 'uid' | 'title'>
    & { errands: Array<(
      { __typename?: 'GrindErrandType' }
      & Pick<Types.GrindErrandType, 'uid'>
    )> }
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddGrindLabelMutationVariables = Types.Exact<{
  payload: Types.GrindCreateLabelInput;
}>;


export type AddGrindLabelMutation = (
  { __typename?: 'Mutation' }
  & { createGrindLabel: (
    { __typename?: 'GrindLabelType' }
    & Pick<Types.GrindLabelType, 'uid' | 'title' | 'category'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddGrindStampMutationVariables = Types.Exact<{
  payload: Types.GrindCreateStampInput;
}>;


export type AddGrindStampMutation = (
  { __typename?: 'Mutation' }
  & { createGrindStamp: (
    { __typename?: 'GrindStampType' }
    & Pick<Types.GrindStampType, 'uid' | 'title' | 'category'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);


export const AddGrindErrandDocument = gql`
    mutation AddGrindErrand($payload: GrindCreateErrandInput!) {
  createGrindErrand(payload: $payload) {
    ... on GrindErrandType {
      uid
      title
      description
      posterUid
      createdByUid
      createdAt
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddGrindErrandMutation() {
  return Urql.useMutation<AddGrindErrandMutation, AddGrindErrandMutationVariables>(AddGrindErrandDocument);
};
export const EditGrindErrandDocument = gql`
    mutation EditGrindErrand($uid: String!, $payload: GrindUpdateErrandInput!) {
  updateGrindErrand(uid: $uid, payload: $payload) {
    ... on GrindErrandType {
      uid
      title
      description
      category
      priority
      startDate
      endDate
      poster {
        uid
      }
      stamps {
        uid
      }
      label {
        uid
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
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditGrindErrandMutation() {
  return Urql.useMutation<EditGrindErrandMutation, EditGrindErrandMutationVariables>(EditGrindErrandDocument);
};
export const AddGrindMilestoneDocument = gql`
    mutation AddGrindMilestone($payload: GrindCreateMilestoneInput!) {
  createGrindMilestone(payload: $payload) {
    ... on GrindMilestoneType {
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
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddGrindMilestoneMutation() {
  return Urql.useMutation<AddGrindMilestoneMutation, AddGrindMilestoneMutationVariables>(AddGrindMilestoneDocument);
};
export const EditGrindMilestoneDocument = gql`
    mutation EditGrindMilestone($uid: String!, $payload: GrindUpdateMilestoneInput!) {
  updateGrindMilestone(uid: $uid, payload: $payload) {
    ... on GrindMilestoneType {
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
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditGrindMilestoneMutation() {
  return Urql.useMutation<EditGrindMilestoneMutation, EditGrindMilestoneMutationVariables>(EditGrindMilestoneDocument);
};
export const DeleteMilestoneDocument = gql`
    mutation DeleteMilestone($uid: String!) {
  deleteGrindMilestone(uid: $uid) {
    ... on GrindMilestoneType {
      uid
    }
  }
}
    `;

export function useDeleteMilestoneMutation() {
  return Urql.useMutation<DeleteMilestoneMutation, DeleteMilestoneMutationVariables>(DeleteMilestoneDocument);
};
export const AddGrindSchemeDocument = gql`
    mutation AddGrindScheme($payload: GrindCreateSchemeInput!) {
  createGrindScheme(payload: $payload) {
    ... on GrindSchemeType {
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
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddGrindSchemeMutation() {
  return Urql.useMutation<AddGrindSchemeMutation, AddGrindSchemeMutationVariables>(AddGrindSchemeDocument);
};
export const EditGrindSchemeDocument = gql`
    mutation EditGrindScheme($uid: String!, $payload: GrindUpdateSchemeInput!) {
  updateGrindScheme(uid: $uid, payload: $payload) {
    ... on GrindSchemeType {
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
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditGrindSchemeMutation() {
  return Urql.useMutation<EditGrindSchemeMutation, EditGrindSchemeMutationVariables>(EditGrindSchemeDocument);
};
export const AddGrindBoardDocument = gql`
    mutation AddGrindBoard($payload: GrindCreateBoardInput!) {
  createGrindBoard(payload: $payload) {
    ... on GrindBoardType {
      uid
      title
      description
      scheme {
        uid
        title
      }
      createdBy {
        uid
        firstName
        lastName
      }
      createdAt
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddGrindBoardMutation() {
  return Urql.useMutation<AddGrindBoardMutation, AddGrindBoardMutationVariables>(AddGrindBoardDocument);
};
export const AddGrindPosterDocument = gql`
    mutation AddGrindPoster($payload: GrindCreatePosterInput!) {
  createGrindPoster(payload: $payload) {
    ... on GrindPosterType {
      uid
      title
      errands {
        uid
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

export function useAddGrindPosterMutation() {
  return Urql.useMutation<AddGrindPosterMutation, AddGrindPosterMutationVariables>(AddGrindPosterDocument);
};
export const AddGrindLabelDocument = gql`
    mutation AddGrindLabel($payload: GrindCreateLabelInput!) {
  createGrindLabel(payload: $payload) {
    ... on GrindLabelType {
      uid
      title
      category
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddGrindLabelMutation() {
  return Urql.useMutation<AddGrindLabelMutation, AddGrindLabelMutationVariables>(AddGrindLabelDocument);
};
export const AddGrindStampDocument = gql`
    mutation AddGrindStamp($payload: GrindCreateStampInput!) {
  createGrindStamp(payload: $payload) {
    ... on GrindStampType {
      uid
      title
      category
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddGrindStampMutation() {
  return Urql.useMutation<AddGrindStampMutation, AddGrindStampMutationVariables>(AddGrindStampDocument);
};