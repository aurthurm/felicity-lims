import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AddReferralLaboratoryMutationVariables = Types.Exact<{
  payload: Types.ReferralLaboratoryInputType;
}>;


export type AddReferralLaboratoryMutation = (
  { __typename?: 'Mutation' }
  & { createReferralLaboratory: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'ReferralLaboratoryType' }
    & Pick<Types.ReferralLaboratoryType, 'uid' | 'name' | 'code' | 'url' | 'password' | 'username' | 'isReferral' | 'isReference'>
  ) }
);

export type EditReferralLaboratoryMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.ReferralLaboratoryInputType;
}>;


export type EditReferralLaboratoryMutation = (
  { __typename?: 'Mutation' }
  & { updateReferralLaboratory: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'ReferralLaboratoryType' }
    & Pick<Types.ReferralLaboratoryType, 'uid' | 'name' | 'code' | 'url' | 'password' | 'username' | 'isReferral' | 'isReference'>
  ) }
);

export type AddShipmentMutationVariables = Types.Exact<{
  payload: Types.ShipmentInputType;
}>;


export type AddShipmentMutation = (
  { __typename?: 'Mutation' }
  & { createShipment: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'ShipmentListingType' }
    & { shipments?: Types.Maybe<Array<(
      { __typename?: 'ShipmentType' }
      & Pick<Types.ShipmentType, 'uid' | 'shipmentId' | 'assignedCount' | 'state' | 'laboratoryUid' | 'createdAt'>
      & { laboratory?: Types.Maybe<(
        { __typename?: 'LaboratoryType' }
        & Pick<Types.LaboratoryType, 'name'>
      )> }
    )>> }
  ) }
);

export type UpdateShipmentMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.ShipmentUpdateInputType;
}>;


export type UpdateShipmentMutation = (
  { __typename?: 'Mutation' }
  & { updateShipment: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'ShipmentType' }
    & Pick<Types.ShipmentType, 'uid' | 'shipmentId' | 'assignedCount' | 'state' | 'incoming' | 'comment' | 'createdAt' | 'courier'>
    & { laboratory?: Types.Maybe<(
      { __typename?: 'LaboratoryType' }
      & Pick<Types.LaboratoryType, 'uid' | 'name'>
    )> }
  ) }
);

export type ShipmentManageSamplesMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.ShipmentManageSamplesInput;
}>;


export type ShipmentManageSamplesMutation = (
  { __typename?: 'Mutation' }
  & { shipmentManageSamples: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'ShipmentType' }
    & Pick<Types.ShipmentType, 'uid' | 'shipmentId' | 'assignedCount' | 'state' | 'incoming' | 'comment' | 'createdAt' | 'courier'>
    & { laboratory?: Types.Maybe<(
      { __typename?: 'LaboratoryType' }
      & Pick<Types.LaboratoryType, 'uid' | 'name'>
    )>, samples?: Types.Maybe<Array<(
      { __typename?: 'SampleType' }
      & Pick<Types.SampleType, 'uid' | 'sampleId' | 'status'>
      & { analysisRequest?: Types.Maybe<(
        { __typename?: 'AnalysisRequestType' }
        & { patient: (
          { __typename?: 'PatientType' }
          & Pick<Types.PatientType, 'uid'>
        ) }
      )>, analyses?: Types.Maybe<Array<(
        { __typename?: 'AnalysisType' }
        & Pick<Types.AnalysisType, 'uid' | 'name' | 'keyword'>
      )>> }
    )>> }
  ) }
);

export type ActionShipmentMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  action: Types.Scalars['String']['input'];
}>;


export type ActionShipmentMutation = (
  { __typename?: 'Mutation' }
  & { actionShipment: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'ShipmentType' }
    & Pick<Types.ShipmentType, 'uid' | 'state'>
  ) }
);


export const AddReferralLaboratoryDocument = gql`
    mutation AddReferralLaboratory($payload: ReferralLaboratoryInputType!) {
  createReferralLaboratory(payload: $payload) {
    ... on ReferralLaboratoryType {
      __typename
      uid
      name
      code
      url
      password
      username
      isReferral
      isReference
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddReferralLaboratoryMutation() {
  return Urql.useMutation<AddReferralLaboratoryMutation, AddReferralLaboratoryMutationVariables>(AddReferralLaboratoryDocument);
};
export const EditReferralLaboratoryDocument = gql`
    mutation EditReferralLaboratory($uid: String!, $payload: ReferralLaboratoryInputType!) {
  updateReferralLaboratory(uid: $uid, payload: $payload) {
    ... on ReferralLaboratoryType {
      __typename
      uid
      name
      code
      url
      password
      username
      isReferral
      isReference
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditReferralLaboratoryMutation() {
  return Urql.useMutation<EditReferralLaboratoryMutation, EditReferralLaboratoryMutationVariables>(EditReferralLaboratoryDocument);
};
export const AddShipmentDocument = gql`
    mutation AddShipment($payload: ShipmentInputType!) {
  createShipment(payload: $payload) {
    ... on ShipmentListingType {
      __typename
      shipments {
        uid
        shipmentId
        assignedCount
        state
        laboratoryUid
        laboratory {
          name
        }
        createdAt
        laboratoryUid
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

export function useAddShipmentMutation() {
  return Urql.useMutation<AddShipmentMutation, AddShipmentMutationVariables>(AddShipmentDocument);
};
export const UpdateShipmentDocument = gql`
    mutation UpdateShipment($uid: String!, $payload: ShipmentUpdateInputType!) {
  updateShipment(uid: $uid, payload: $payload) {
    ... on ShipmentType {
      __typename
      uid
      shipmentId
      assignedCount
      state
      incoming
      comment
      createdAt
      courier
      laboratory {
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

export function useUpdateShipmentMutation() {
  return Urql.useMutation<UpdateShipmentMutation, UpdateShipmentMutationVariables>(UpdateShipmentDocument);
};
export const ShipmentManageSamplesDocument = gql`
    mutation shipmentManageSamples($uid: String!, $payload: ShipmentManageSamplesInput!) {
  shipmentManageSamples(uid: $uid, payload: $payload) {
    ... on ShipmentType {
      __typename
      uid
      shipmentId
      assignedCount
      state
      incoming
      comment
      createdAt
      courier
      laboratory {
        uid
        name
      }
      samples {
        uid
        sampleId
        status
        analysisRequest {
          patient {
            uid
          }
        }
        analyses {
          uid
          name
          keyword
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

export function useShipmentManageSamplesMutation() {
  return Urql.useMutation<ShipmentManageSamplesMutation, ShipmentManageSamplesMutationVariables>(ShipmentManageSamplesDocument);
};
export const ActionShipmentDocument = gql`
    mutation actionShipment($uid: String!, $action: String!) {
  actionShipment(uid: $uid, action: $action) {
    ... on ShipmentType {
      __typename
      uid
      state
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useActionShipmentMutation() {
  return Urql.useMutation<ActionShipmentMutation, ActionShipmentMutationVariables>(ActionShipmentDocument);
};