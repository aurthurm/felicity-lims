import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type EditProfilePricingMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.PriceInput;
}>;


export type EditProfilePricingMutation = (
  { __typename?: 'Mutation' }
  & { updateProfilePrice: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'ProfilePriceType' }
    & Pick<Types.ProfilePriceType, 'uid' | 'isActive' | 'amount'>
  ) }
);

export type EditAnalysisPricingMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.PriceInput;
}>;


export type EditAnalysisPricingMutation = (
  { __typename?: 'Mutation' }
  & { updateAnalysisPrice: (
    { __typename: 'AnalysisPriceType' }
    & Pick<Types.AnalysisPriceType, 'uid' | 'isActive' | 'amount'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditProfileDiscountMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.PriceDiscountInput;
}>;


export type EditProfileDiscountMutation = (
  { __typename?: 'Mutation' }
  & { updateProfileDiscount: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'ProfileDiscountType' }
    & Pick<Types.ProfileDiscountType, 'uid' | 'profileUid' | 'name' | 'discountType' | 'valueType' | 'startDate' | 'endDate' | 'voucherUid' | 'valuePercent' | 'valueAmount' | 'isActive'>
  ) }
);

export type EditAnalysisDiscountMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.PriceDiscountInput;
}>;


export type EditAnalysisDiscountMutation = (
  { __typename?: 'Mutation' }
  & { updateAnalysisDiscount: (
    { __typename: 'AnalysisDiscountType' }
    & Pick<Types.AnalysisDiscountType, 'uid' | 'analysisUid' | 'name' | 'discountType' | 'valueType' | 'startDate' | 'endDate' | 'voucherUid' | 'valuePercent' | 'valueAmount' | 'isActive'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddVoucherMutationVariables = Types.Exact<{
  payload: Types.VoucherInput;
}>;


export type AddVoucherMutation = (
  { __typename?: 'Mutation' }
  & { createVoucher: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'VoucherType' }
    & Pick<Types.VoucherType, 'uid' | 'name' | 'usageLimit' | 'used' | 'startDate' | 'endDate' | 'oncePerCustomer' | 'oncePerOrder' | 'createdAt' | 'createdByUid' | 'updatedAt' | 'updatedByUid'>
  ) }
);

export type EditVoucherMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.VoucherInput;
}>;


export type EditVoucherMutation = (
  { __typename?: 'Mutation' }
  & { updateVoucher: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'VoucherType' }
    & Pick<Types.VoucherType, 'uid' | 'name' | 'usageLimit' | 'used' | 'startDate' | 'endDate' | 'oncePerCustomer' | 'oncePerOrder' | 'createdAt' | 'createdByUid' | 'updatedAt' | 'updatedByUid'>
  ) }
);

export type AddVoucherCodeMutationVariables = Types.Exact<{
  payload: Types.VoucherCodeInput;
}>;


export type AddVoucherCodeMutation = (
  { __typename?: 'Mutation' }
  & { createVoucherCode: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'VoucherCodeType' }
    & Pick<Types.VoucherCodeType, 'uid' | 'voucherUid' | 'code' | 'usageLimit' | 'used' | 'isActive' | 'createdAt' | 'createdByUid' | 'updatedAt' | 'updatedByUid'>
  ) }
);

export type EditVoucherCodeMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.VoucherCodeInput;
}>;


export type EditVoucherCodeMutation = (
  { __typename?: 'Mutation' }
  & { updateVoucherCode: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'VoucherCodeType' }
    & Pick<Types.VoucherCodeType, 'uid' | 'voucherUid' | 'code' | 'usageLimit' | 'used' | 'isActive' | 'createdAt' | 'createdByUid' | 'updatedAt' | 'updatedByUid'>
  ) }
);

export type AddTestBillTransactionMutationVariables = Types.Exact<{
  payload: Types.BillTransactionInput;
}>;


export type AddTestBillTransactionMutation = (
  { __typename?: 'Mutation' }
  & { createTestBillTransaction: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'TestBillTransactionType' }
    & Pick<Types.TestBillTransactionType, 'uid' | 'testBillUid' | 'kind' | 'amount' | 'isSuccess' | 'actionRequired' | 'processed' | 'notes' | 'createdAt' | 'createdByUid'>
  ) }
);

export type ConfirmTestBillTransactionMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  notes?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type ConfirmTestBillTransactionMutation = (
  { __typename?: 'Mutation' }
  & { confirmTestBillTransaction: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'TestBillTransactionType' }
    & Pick<Types.TestBillTransactionType, 'uid' | 'testBillUid' | 'kind' | 'amount' | 'isSuccess' | 'actionRequired' | 'processed' | 'notes' | 'createdAt' | 'createdByUid'>
  ) }
);

export type ApplyBillVoucherMutationVariables = Types.Exact<{
  payload: Types.ApplyVoucherInput;
}>;


export type ApplyBillVoucherMutation = (
  { __typename?: 'Mutation' }
  & { applyVoucher: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'TestBillTransactionType' }
    & Pick<Types.TestBillTransactionType, 'uid' | 'testBillUid' | 'kind' | 'amount' | 'isSuccess' | 'actionRequired' | 'processed' | 'notes' | 'createdAt' | 'createdByUid'>
  ) }
);


export const EditProfilePricingDocument = gql`
    mutation EditProfilePricing($uid: String!, $payload: PriceInput!) {
  updateProfilePrice(uid: $uid, payload: $payload) {
    ... on ProfilePriceType {
      __typename
      uid
      isActive
      amount
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditProfilePricingMutation() {
  return Urql.useMutation<EditProfilePricingMutation, EditProfilePricingMutationVariables>(EditProfilePricingDocument);
};
export const EditAnalysisPricingDocument = gql`
    mutation EditAnalysisPricing($uid: String!, $payload: PriceInput!) {
  updateAnalysisPrice(uid: $uid, payload: $payload) {
    ... on AnalysisPriceType {
      __typename
      uid
      isActive
      amount
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditAnalysisPricingMutation() {
  return Urql.useMutation<EditAnalysisPricingMutation, EditAnalysisPricingMutationVariables>(EditAnalysisPricingDocument);
};
export const EditProfileDiscountDocument = gql`
    mutation EditProfileDiscount($uid: String!, $payload: PriceDiscountInput!) {
  updateProfileDiscount(uid: $uid, payload: $payload) {
    ... on ProfileDiscountType {
      __typename
      uid
      profileUid
      name
      discountType
      valueType
      startDate
      endDate
      voucherUid
      valuePercent
      valueAmount
      isActive
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditProfileDiscountMutation() {
  return Urql.useMutation<EditProfileDiscountMutation, EditProfileDiscountMutationVariables>(EditProfileDiscountDocument);
};
export const EditAnalysisDiscountDocument = gql`
    mutation EditAnalysisDiscount($uid: String!, $payload: PriceDiscountInput!) {
  updateAnalysisDiscount(uid: $uid, payload: $payload) {
    ... on AnalysisDiscountType {
      __typename
      uid
      analysisUid
      name
      discountType
      valueType
      startDate
      endDate
      voucherUid
      valuePercent
      valueAmount
      isActive
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditAnalysisDiscountMutation() {
  return Urql.useMutation<EditAnalysisDiscountMutation, EditAnalysisDiscountMutationVariables>(EditAnalysisDiscountDocument);
};
export const AddVoucherDocument = gql`
    mutation addVoucher($payload: VoucherInput!) {
  createVoucher(payload: $payload) {
    __typename
    ... on VoucherType {
      uid
      name
      usageLimit
      used
      startDate
      endDate
      oncePerCustomer
      oncePerOrder
      createdAt
      createdByUid
      updatedAt
      updatedByUid
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `;

export function useAddVoucherMutation() {
  return Urql.useMutation<AddVoucherMutation, AddVoucherMutationVariables>(AddVoucherDocument);
};
export const EditVoucherDocument = gql`
    mutation editVoucher($uid: String!, $payload: VoucherInput!) {
  updateVoucher(uid: $uid, payload: $payload) {
    __typename
    ... on VoucherType {
      uid
      name
      usageLimit
      used
      startDate
      endDate
      oncePerCustomer
      oncePerOrder
      createdAt
      createdByUid
      updatedAt
      updatedByUid
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `;

export function useEditVoucherMutation() {
  return Urql.useMutation<EditVoucherMutation, EditVoucherMutationVariables>(EditVoucherDocument);
};
export const AddVoucherCodeDocument = gql`
    mutation addVoucherCode($payload: VoucherCodeInput!) {
  createVoucherCode(payload: $payload) {
    __typename
    ... on VoucherCodeType {
      uid
      voucherUid
      code
      usageLimit
      used
      isActive
      createdAt
      createdByUid
      updatedAt
      updatedByUid
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `;

export function useAddVoucherCodeMutation() {
  return Urql.useMutation<AddVoucherCodeMutation, AddVoucherCodeMutationVariables>(AddVoucherCodeDocument);
};
export const EditVoucherCodeDocument = gql`
    mutation editVoucherCode($uid: String!, $payload: VoucherCodeInput!) {
  updateVoucherCode(uid: $uid, payload: $payload) {
    __typename
    ... on VoucherCodeType {
      uid
      voucherUid
      code
      usageLimit
      used
      isActive
      createdAt
      createdByUid
      updatedAt
      updatedByUid
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `;

export function useEditVoucherCodeMutation() {
  return Urql.useMutation<EditVoucherCodeMutation, EditVoucherCodeMutationVariables>(EditVoucherCodeDocument);
};
export const AddTestBillTransactionDocument = gql`
    mutation addTestBillTransaction($payload: BillTransactionInput!) {
  createTestBillTransaction(payload: $payload) {
    __typename
    ... on TestBillTransactionType {
      uid
      testBillUid
      kind
      amount
      isSuccess
      actionRequired
      processed
      notes
      createdAt
      createdByUid
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `;

export function useAddTestBillTransactionMutation() {
  return Urql.useMutation<AddTestBillTransactionMutation, AddTestBillTransactionMutationVariables>(AddTestBillTransactionDocument);
};
export const ConfirmTestBillTransactionDocument = gql`
    mutation confirmTestBillTransaction($uid: String!, $notes: String) {
  confirmTestBillTransaction(uid: $uid, notes: $notes) {
    __typename
    ... on TestBillTransactionType {
      uid
      testBillUid
      kind
      amount
      isSuccess
      actionRequired
      processed
      notes
      createdAt
      createdByUid
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `;

export function useConfirmTestBillTransactionMutation() {
  return Urql.useMutation<ConfirmTestBillTransactionMutation, ConfirmTestBillTransactionMutationVariables>(ConfirmTestBillTransactionDocument);
};
export const ApplyBillVoucherDocument = gql`
    mutation applyBillVoucher($payload: ApplyVoucherInput!) {
  applyVoucher(payload: $payload) {
    __typename
    ... on TestBillTransactionType {
      uid
      testBillUid
      kind
      amount
      isSuccess
      actionRequired
      processed
      notes
      createdAt
      createdByUid
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `;

export function useApplyBillVoucherMutation() {
  return Urql.useMutation<ApplyBillVoucherMutation, ApplyBillVoucherMutationVariables>(ApplyBillVoucherDocument);
};