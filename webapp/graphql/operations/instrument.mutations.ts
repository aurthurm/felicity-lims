import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AddSupplierMutationVariables = Types.Exact<{
  payload: Types.SupplierInputType;
}>;


export type AddSupplierMutation = (
  { __typename?: 'Mutation' }
  & { createSupplier: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename?: 'SupplierType' }
    & Pick<Types.SupplierType, 'uid' | 'name' | 'description'>
  ) }
);

export type EditSupplierMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.SupplierInputType;
}>;


export type EditSupplierMutation = (
  { __typename?: 'Mutation' }
  & { updateSupplier: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename?: 'SupplierType' }
    & Pick<Types.SupplierType, 'uid' | 'name' | 'description'>
  ) }
);

export type AddManufacturerMutationVariables = Types.Exact<{
  payload: Types.ManufacturerInputType;
}>;


export type AddManufacturerMutation = (
  { __typename?: 'Mutation' }
  & { createManufacturer: (
    { __typename?: 'ManufacturerType' }
    & Pick<Types.ManufacturerType, 'uid' | 'name' | 'description'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditManufacturerMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.ManufacturerInputType;
}>;


export type EditManufacturerMutation = (
  { __typename?: 'Mutation' }
  & { updateManufacturer: (
    { __typename?: 'ManufacturerType' }
    & Pick<Types.ManufacturerType, 'uid' | 'name' | 'description'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddInstrumentTypeMutationVariables = Types.Exact<{
  payload: Types.InstrumentTypeInputType;
}>;


export type AddInstrumentTypeMutation = (
  { __typename?: 'Mutation' }
  & { createInstrumentType: (
    { __typename?: 'InstrumentTypeType' }
    & Pick<Types.InstrumentTypeType, 'uid' | 'name' | 'description'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditInstrumentTypeMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.InstrumentTypeInputType;
}>;


export type EditInstrumentTypeMutation = (
  { __typename?: 'Mutation' }
  & { updateInstrumentType: (
    { __typename?: 'InstrumentTypeType' }
    & Pick<Types.InstrumentTypeType, 'uid' | 'name' | 'description'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddInstrumentMutationVariables = Types.Exact<{
  payload: Types.InstrumentInputType;
}>;


export type AddInstrumentMutation = (
  { __typename?: 'Mutation' }
  & { createInstrument: (
    { __typename?: 'InstrumentType' }
    & Pick<Types.InstrumentType, 'uid' | 'name' | 'description' | 'keyword'>
    & { instrumentType?: Types.Maybe<(
      { __typename?: 'InstrumentTypeType' }
      & Pick<Types.InstrumentTypeType, 'uid' | 'name'>
    )>, manufacturer?: Types.Maybe<(
      { __typename?: 'ManufacturerType' }
      & Pick<Types.ManufacturerType, 'uid' | 'name'>
    )>, supplier?: Types.Maybe<(
      { __typename?: 'SupplierType' }
      & Pick<Types.SupplierType, 'uid' | 'name'>
    )> }
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditInstrumentMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.InstrumentInputType;
}>;


export type EditInstrumentMutation = (
  { __typename?: 'Mutation' }
  & { updateInstrument: (
    { __typename?: 'InstrumentType' }
    & Pick<Types.InstrumentType, 'uid' | 'name' | 'description' | 'keyword'>
    & { instrumentType?: Types.Maybe<(
      { __typename?: 'InstrumentTypeType' }
      & Pick<Types.InstrumentTypeType, 'uid' | 'name'>
    )>, manufacturer?: Types.Maybe<(
      { __typename?: 'ManufacturerType' }
      & Pick<Types.ManufacturerType, 'uid' | 'name'>
    )>, supplier?: Types.Maybe<(
      { __typename?: 'SupplierType' }
      & Pick<Types.SupplierType, 'uid' | 'name'>
    )> }
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddLaboratoryInstrumentMutationVariables = Types.Exact<{
  payload: Types.LaboratoryInstrumentInputType;
}>;


export type AddLaboratoryInstrumentMutation = (
  { __typename?: 'Mutation' }
  & { createLaboratoryInstrument: (
    { __typename?: 'LaboratoryInstrumentType' }
    & Pick<Types.LaboratoryInstrumentType, 'uid' | 'labName' | 'serialNumber' | 'instrumentUid' | 'dateCommissioned' | 'dateDecommissioned'>
    & { instrument?: Types.Maybe<(
      { __typename?: 'InstrumentType' }
      & Pick<Types.InstrumentType, 'uid' | 'name'>
    )> }
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditLaboratoryInstrumentMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.LaboratoryInstrumentInputType;
}>;


export type EditLaboratoryInstrumentMutation = (
  { __typename?: 'Mutation' }
  & { updateLaboratoryInstrument: (
    { __typename?: 'LaboratoryInstrumentType' }
    & Pick<Types.LaboratoryInstrumentType, 'uid' | 'labName' | 'serialNumber' | 'instrumentUid' | 'dateCommissioned' | 'dateDecommissioned'>
    & { instrument?: Types.Maybe<(
      { __typename?: 'InstrumentType' }
      & Pick<Types.InstrumentType, 'uid' | 'name'>
    )> }
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddMethodMutationVariables = Types.Exact<{
  payload: Types.MethodInputType;
}>;


export type AddMethodMutation = (
  { __typename?: 'Mutation' }
  & { createMethod: (
    { __typename?: 'MethodType' }
    & Pick<Types.MethodType, 'uid' | 'name' | 'description' | 'keyword'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditMethodMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.MethodInputType;
}>;


export type EditMethodMutation = (
  { __typename?: 'Mutation' }
  & { updateMethod: (
    { __typename?: 'MethodType' }
    & Pick<Types.MethodType, 'uid' | 'name' | 'description' | 'keyword'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddUnitMutationVariables = Types.Exact<{
  payload: Types.UnitInputType;
}>;


export type AddUnitMutation = (
  { __typename?: 'Mutation' }
  & { createUnit: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename?: 'UnitType' }
    & Pick<Types.UnitType, 'uid' | 'name' | 'description'>
  ) }
);

export type EditUnitMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.UnitInputType;
}>;


export type EditUnitMutation = (
  { __typename?: 'Mutation' }
  & { updateUnit: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename?: 'UnitType' }
    & Pick<Types.UnitType, 'uid' | 'name' | 'description'>
  ) }
);


export const AddSupplierDocument = gql`
    mutation AddSupplier($payload: SupplierInputType!) {
  createSupplier(payload: $payload) {
    ... on SupplierType {
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddSupplierMutation() {
  return Urql.useMutation<AddSupplierMutation, AddSupplierMutationVariables>(AddSupplierDocument);
};
export const EditSupplierDocument = gql`
    mutation EditSupplier($uid: String!, $payload: SupplierInputType!) {
  updateSupplier(uid: $uid, payload: $payload) {
    ... on SupplierType {
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditSupplierMutation() {
  return Urql.useMutation<EditSupplierMutation, EditSupplierMutationVariables>(EditSupplierDocument);
};
export const AddManufacturerDocument = gql`
    mutation AddManufacturer($payload: ManufacturerInputType!) {
  createManufacturer(payload: $payload) {
    ... on ManufacturerType {
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddManufacturerMutation() {
  return Urql.useMutation<AddManufacturerMutation, AddManufacturerMutationVariables>(AddManufacturerDocument);
};
export const EditManufacturerDocument = gql`
    mutation EditManufacturer($uid: String!, $payload: ManufacturerInputType!) {
  updateManufacturer(uid: $uid, payload: $payload) {
    ... on ManufacturerType {
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditManufacturerMutation() {
  return Urql.useMutation<EditManufacturerMutation, EditManufacturerMutationVariables>(EditManufacturerDocument);
};
export const AddInstrumentTypeDocument = gql`
    mutation AddInstrumentType($payload: InstrumentTypeInputType!) {
  createInstrumentType(payload: $payload) {
    ... on InstrumentTypeType {
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddInstrumentTypeMutation() {
  return Urql.useMutation<AddInstrumentTypeMutation, AddInstrumentTypeMutationVariables>(AddInstrumentTypeDocument);
};
export const EditInstrumentTypeDocument = gql`
    mutation EditInstrumentType($uid: String!, $payload: InstrumentTypeInputType!) {
  updateInstrumentType(uid: $uid, payload: $payload) {
    ... on InstrumentTypeType {
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditInstrumentTypeMutation() {
  return Urql.useMutation<EditInstrumentTypeMutation, EditInstrumentTypeMutationVariables>(EditInstrumentTypeDocument);
};
export const AddInstrumentDocument = gql`
    mutation AddInstrument($payload: InstrumentInputType!) {
  createInstrument(payload: $payload) {
    ... on InstrumentType {
      uid
      name
      description
      keyword
      instrumentType {
        uid
        name
      }
      manufacturer {
        uid
        name
      }
      supplier {
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

export function useAddInstrumentMutation() {
  return Urql.useMutation<AddInstrumentMutation, AddInstrumentMutationVariables>(AddInstrumentDocument);
};
export const EditInstrumentDocument = gql`
    mutation EditInstrument($uid: String!, $payload: InstrumentInputType!) {
  updateInstrument(uid: $uid, payload: $payload) {
    ... on InstrumentType {
      uid
      name
      description
      keyword
      instrumentType {
        uid
        name
      }
      manufacturer {
        uid
        name
      }
      supplier {
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

export function useEditInstrumentMutation() {
  return Urql.useMutation<EditInstrumentMutation, EditInstrumentMutationVariables>(EditInstrumentDocument);
};
export const AddLaboratoryInstrumentDocument = gql`
    mutation AddLaboratoryInstrument($payload: LaboratoryInstrumentInputType!) {
  createLaboratoryInstrument(payload: $payload) {
    ... on LaboratoryInstrumentType {
      uid
      labName
      serialNumber
      instrumentUid
      instrument {
        uid
        name
      }
      dateCommissioned
      dateDecommissioned
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddLaboratoryInstrumentMutation() {
  return Urql.useMutation<AddLaboratoryInstrumentMutation, AddLaboratoryInstrumentMutationVariables>(AddLaboratoryInstrumentDocument);
};
export const EditLaboratoryInstrumentDocument = gql`
    mutation EditLaboratoryInstrument($uid: String!, $payload: LaboratoryInstrumentInputType!) {
  updateLaboratoryInstrument(uid: $uid, payload: $payload) {
    ... on LaboratoryInstrumentType {
      uid
      labName
      serialNumber
      instrumentUid
      instrument {
        uid
        name
      }
      dateCommissioned
      dateDecommissioned
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditLaboratoryInstrumentMutation() {
  return Urql.useMutation<EditLaboratoryInstrumentMutation, EditLaboratoryInstrumentMutationVariables>(EditLaboratoryInstrumentDocument);
};
export const AddMethodDocument = gql`
    mutation AddMethod($payload: MethodInputType!) {
  createMethod(payload: $payload) {
    ... on MethodType {
      uid
      name
      description
      keyword
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddMethodMutation() {
  return Urql.useMutation<AddMethodMutation, AddMethodMutationVariables>(AddMethodDocument);
};
export const EditMethodDocument = gql`
    mutation EditMethod($uid: String!, $payload: MethodInputType!) {
  updateMethod(uid: $uid, payload: $payload) {
    ... on MethodType {
      uid
      name
      description
      keyword
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditMethodMutation() {
  return Urql.useMutation<EditMethodMutation, EditMethodMutationVariables>(EditMethodDocument);
};
export const AddUnitDocument = gql`
    mutation AddUnit($payload: UnitInputType!) {
  createUnit(payload: $payload) {
    ... on UnitType {
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddUnitMutation() {
  return Urql.useMutation<AddUnitMutation, AddUnitMutationVariables>(AddUnitDocument);
};
export const EditUnitDocument = gql`
    mutation EditUnit($uid: String!, $payload: UnitInputType!) {
  updateUnit(uid: $uid, payload: $payload) {
    ... on UnitType {
      uid
      name
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditUnitMutation() {
  return Urql.useMutation<EditUnitMutation, EditUnitMutationVariables>(EditUnitDocument);
};