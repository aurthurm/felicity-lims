import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AddHazardMutationVariables = Types.Exact<{
  payload: Types.HazardInputType;
}>;


export type AddHazardMutation = (
  { __typename?: 'Mutation' }
  & { createHazard: (
    { __typename: 'HazardType' }
    & Pick<Types.HazardType, 'uid' | 'name' | 'description'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type EditHazardMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.HazardInputType;
}>;


export type EditHazardMutation = (
  { __typename?: 'Mutation' }
  & { updateHazard: (
    { __typename: 'HazardType' }
    & Pick<Types.HazardType, 'uid' | 'name' | 'description'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);

export type AddStockCategoryMutationVariables = Types.Exact<{
  payload: Types.StockCategoryInputType;
}>;


export type AddStockCategoryMutation = (
  { __typename?: 'Mutation' }
  & { createStockCategory: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'StockCategoryType' }
    & Pick<Types.StockCategoryType, 'uid' | 'name' | 'description'>
  ) }
);

export type EditStockCategoryMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.StockCategoryInputType;
}>;


export type EditStockCategoryMutation = (
  { __typename?: 'Mutation' }
  & { updateStockCategory: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'StockCategoryType' }
    & Pick<Types.StockCategoryType, 'uid' | 'name' | 'description'>
  ) }
);

export type AddStockUnitMutationVariables = Types.Exact<{
  payload: Types.StockUnitInputType;
}>;


export type AddStockUnitMutation = (
  { __typename?: 'Mutation' }
  & { createStockUnit: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'StockUnitType' }
    & Pick<Types.StockUnitType, 'uid' | 'name'>
  ) }
);

export type EditStockUnitMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.StockUnitInputType;
}>;


export type EditStockUnitMutation = (
  { __typename?: 'Mutation' }
  & { updateStockUnit: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'StockUnitType' }
    & Pick<Types.StockUnitType, 'uid' | 'name'>
  ) }
);

export type ReceiveStockProductMutationVariables = Types.Exact<{
  payload: Types.StockReceiptInputType;
}>;


export type ReceiveStockProductMutation = (
  { __typename?: 'Mutation' }
  & { createStockReceipt: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'StockItemVariantType' }
    & Pick<Types.StockItemVariantType, 'uid' | 'name' | 'description' | 'quantity'>
    & { stockItem?: Types.Maybe<(
      { __typename?: 'StockItemType' }
      & Pick<Types.StockItemType, 'name' | 'description'>
      & { category?: Types.Maybe<(
        { __typename?: 'StockCategoryType' }
        & Pick<Types.StockCategoryType, 'name'>
      )>, hazard?: Types.Maybe<(
        { __typename?: 'HazardType' }
        & Pick<Types.HazardType, 'name'>
      )> }
    )> }
  ) }
);

export type AddStockItemMutationVariables = Types.Exact<{
  payload: Types.StockItemInputType;
}>;


export type AddStockItemMutation = (
  { __typename?: 'Mutation' }
  & { createStockItem: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'StockItemType' }
    & Pick<Types.StockItemType, 'uid' | 'name' | 'description'>
  ) }
);

export type EditStockItemMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.StockItemInputType;
}>;


export type EditStockItemMutation = (
  { __typename?: 'Mutation' }
  & { updateStockItem: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'StockItemType' }
    & Pick<Types.StockItemType, 'uid' | 'name' | 'description'>
  ) }
);

export type AddStockItemVariantMutationVariables = Types.Exact<{
  stockItemUid: Types.Scalars['String']['input'];
  payload: Types.StockItemVariantInputType;
}>;


export type AddStockItemVariantMutation = (
  { __typename?: 'Mutation' }
  & { createStockItemVariant: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'StockItemVariantType' }
    & Pick<Types.StockItemVariantType, 'uid' | 'name' | 'description' | 'stockItemUid' | 'minimumLevel' | 'maximumLevel' | 'createdAt'>
    & { createdBy?: Types.Maybe<(
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
    )> }
  ) }
);

export type EditStockItemVariantMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.StockItemVariantInputType;
}>;


export type EditStockItemVariantMutation = (
  { __typename?: 'Mutation' }
  & { updateStockItemVariant: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'StockItemVariantType' }
    & Pick<Types.StockItemVariantType, 'uid' | 'name' | 'description' | 'stockItemUid' | 'minimumLevel' | 'maximumLevel' | 'createdAt' | 'updatedAt'>
    & { createdBy?: Types.Maybe<(
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
    )>, updatedBy?: Types.Maybe<(
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
    )> }
  ) }
);

export type AddStockAdjustmentMutationVariables = Types.Exact<{
  payload: Types.StockAdjustmentInputType;
}>;


export type AddStockAdjustmentMutation = (
  { __typename?: 'Mutation' }
  & { createStockAdjustment: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'StockAdjustmentType' }
    & Pick<Types.StockAdjustmentType, 'uid' | 'productUid' | 'adjustmentType' | 'adjust' | 'adjustmentDate' | 'remarks' | 'adjustmentByUid' | 'createdAt' | 'createdByUid'>
  ) }
);

export type AddStockOrderMutationVariables = Types.Exact<{
  payload: Types.StockOrderInputType;
}>;


export type AddStockOrderMutation = (
  { __typename?: 'Mutation' }
  & { createStockOrder: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'StockOrderLineType' }
    & { stockOrder: (
      { __typename?: 'StockOrderType' }
      & Pick<Types.StockOrderType, 'uid' | 'orderByUid' | 'departmentUid' | 'status' | 'orderNumber'>
    ), orderProducts: Array<(
      { __typename?: 'StockOrderProductType' }
      & Pick<Types.StockOrderProductType, 'uid' | 'productUid' | 'orderUid' | 'quantity'>
    )> }
  ) | { __typename?: 'StockOrderType' } }
);

export type EditStockOrderMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.StockOrderInputType;
}>;


export type EditStockOrderMutation = (
  { __typename?: 'Mutation' }
  & { updateStockOrder: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'StockOrderLineType' }
    & { stockOrder: (
      { __typename?: 'StockOrderType' }
      & Pick<Types.StockOrderType, 'uid' | 'orderByUid' | 'departmentUid' | 'status' | 'orderNumber' | 'remarks'>
    ), orderProducts: Array<(
      { __typename?: 'StockOrderProductType' }
      & Pick<Types.StockOrderProductType, 'uid' | 'productUid' | 'orderUid' | 'quantity'>
    )> }
  ) | { __typename?: 'StockOrderType' } }
);

export type SubmitStockOrderMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type SubmitStockOrderMutation = (
  { __typename?: 'Mutation' }
  & { submitStockOrder: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | { __typename?: 'StockOrderLineType' } | (
    { __typename: 'StockOrderType' }
    & Pick<Types.StockOrderType, 'uid' | 'status' | 'orderNumber'>
  ) }
);

export type ApproveStockOrderMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.StockOrderApprovalInputType;
}>;


export type ApproveStockOrderMutation = (
  { __typename?: 'Mutation' }
  & { approveStockOrder: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | { __typename?: 'StockOrderLineType' } | (
    { __typename: 'StockOrderType' }
    & Pick<Types.StockOrderType, 'uid' | 'orderByUid' | 'departmentUid' | 'status' | 'orderNumber' | 'remarks'>
  ) }
);

export type IssueStockOrderMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Array<Types.StockOrderProductLineInputType> | Types.StockOrderProductLineInputType;
}>;


export type IssueStockOrderMutation = (
  { __typename?: 'Mutation' }
  & { issueStockOrder: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'StockOrderLineType' }
    & { stockOrder: (
      { __typename?: 'StockOrderType' }
      & Pick<Types.StockOrderType, 'uid' | 'orderByUid' | 'departmentUid' | 'status' | 'orderNumber' | 'remarks'>
    ), orderProducts: Array<(
      { __typename?: 'StockOrderProductType' }
      & Pick<Types.StockOrderProductType, 'uid' | 'orderUid' | 'quantity'>
      & { product?: Types.Maybe<(
        { __typename?: 'StockItemVariantType' }
        & Pick<Types.StockItemVariantType, 'uid' | 'quantity'>
      )> }
    )> }
  ) | { __typename?: 'StockOrderType' } }
);

export type DeleteStockOrderMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type DeleteStockOrderMutation = (
  { __typename?: 'Mutation' }
  & { deleteStockOrder: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | { __typename: 'StockOrderLineType' } | { __typename?: 'StockOrderType' } }
);


export const AddHazardDocument = gql`
    mutation AddHazard($payload: HazardInputType!) {
  createHazard(payload: $payload) {
    ... on HazardType {
      __typename
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

export function useAddHazardMutation() {
  return Urql.useMutation<AddHazardMutation, AddHazardMutationVariables>(AddHazardDocument);
};
export const EditHazardDocument = gql`
    mutation EditHazard($uid: String!, $payload: HazardInputType!) {
  updateHazard(uid: $uid, payload: $payload) {
    ... on HazardType {
      __typename
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

export function useEditHazardMutation() {
  return Urql.useMutation<EditHazardMutation, EditHazardMutationVariables>(EditHazardDocument);
};
export const AddStockCategoryDocument = gql`
    mutation AddStockCategory($payload: StockCategoryInputType!) {
  createStockCategory(payload: $payload) {
    ... on StockCategoryType {
      __typename
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

export function useAddStockCategoryMutation() {
  return Urql.useMutation<AddStockCategoryMutation, AddStockCategoryMutationVariables>(AddStockCategoryDocument);
};
export const EditStockCategoryDocument = gql`
    mutation EditStockCategory($uid: String!, $payload: StockCategoryInputType!) {
  updateStockCategory(uid: $uid, payload: $payload) {
    ... on StockCategoryType {
      __typename
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

export function useEditStockCategoryMutation() {
  return Urql.useMutation<EditStockCategoryMutation, EditStockCategoryMutationVariables>(EditStockCategoryDocument);
};
export const AddStockUnitDocument = gql`
    mutation AddStockUnit($payload: StockUnitInputType!) {
  createStockUnit(payload: $payload) {
    ... on StockUnitType {
      __typename
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

export function useAddStockUnitMutation() {
  return Urql.useMutation<AddStockUnitMutation, AddStockUnitMutationVariables>(AddStockUnitDocument);
};
export const EditStockUnitDocument = gql`
    mutation editStockUnit($uid: String!, $payload: StockUnitInputType!) {
  updateStockUnit(uid: $uid, payload: $payload) {
    ... on StockUnitType {
      __typename
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

export function useEditStockUnitMutation() {
  return Urql.useMutation<EditStockUnitMutation, EditStockUnitMutationVariables>(EditStockUnitDocument);
};
export const ReceiveStockProductDocument = gql`
    mutation ReceiveStockProduct($payload: StockReceiptInputType!) {
  createStockReceipt(payload: $payload) {
    ... on StockItemVariantType {
      __typename
      uid
      name
      description
      stockItem {
        name
        description
        category {
          name
        }
        hazard {
          name
        }
      }
      quantity
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useReceiveStockProductMutation() {
  return Urql.useMutation<ReceiveStockProductMutation, ReceiveStockProductMutationVariables>(ReceiveStockProductDocument);
};
export const AddStockItemDocument = gql`
    mutation AddStockItem($payload: StockItemInputType!) {
  createStockItem(payload: $payload) {
    ... on StockItemType {
      __typename
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

export function useAddStockItemMutation() {
  return Urql.useMutation<AddStockItemMutation, AddStockItemMutationVariables>(AddStockItemDocument);
};
export const EditStockItemDocument = gql`
    mutation editStockItem($uid: String!, $payload: StockItemInputType!) {
  updateStockItem(uid: $uid, payload: $payload) {
    ... on StockItemType {
      __typename
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

export function useEditStockItemMutation() {
  return Urql.useMutation<EditStockItemMutation, EditStockItemMutationVariables>(EditStockItemDocument);
};
export const AddStockItemVariantDocument = gql`
    mutation AddStockItemVariant($stockItemUid: String!, $payload: StockItemVariantInputType!) {
  createStockItemVariant(stockItemUid: $stockItemUid, payload: $payload) {
    ... on StockItemVariantType {
      __typename
      uid
      name
      description
      stockItemUid
      minimumLevel
      maximumLevel
      createdAt
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

export function useAddStockItemVariantMutation() {
  return Urql.useMutation<AddStockItemVariantMutation, AddStockItemVariantMutationVariables>(AddStockItemVariantDocument);
};
export const EditStockItemVariantDocument = gql`
    mutation editStockItemVariant($uid: String!, $payload: StockItemVariantInputType!) {
  updateStockItemVariant(uid: $uid, payload: $payload) {
    ... on StockItemVariantType {
      __typename
      uid
      name
      description
      stockItemUid
      minimumLevel
      maximumLevel
      createdAt
      createdBy {
        uid
        firstName
        lastName
      }
      updatedAt
      updatedBy {
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

export function useEditStockItemVariantMutation() {
  return Urql.useMutation<EditStockItemVariantMutation, EditStockItemVariantMutationVariables>(EditStockItemVariantDocument);
};
export const AddStockAdjustmentDocument = gql`
    mutation AddStockAdjustment($payload: StockAdjustmentInputType!) {
  createStockAdjustment(payload: $payload) {
    ... on StockAdjustmentType {
      __typename
      uid
      productUid
      adjustmentType
      adjust
      adjustmentDate
      remarks
      adjustmentByUid
      createdAt
      createdByUid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddStockAdjustmentMutation() {
  return Urql.useMutation<AddStockAdjustmentMutation, AddStockAdjustmentMutationVariables>(AddStockAdjustmentDocument);
};
export const AddStockOrderDocument = gql`
    mutation AddStockOrder($payload: StockOrderInputType!) {
  createStockOrder(payload: $payload) {
    ... on StockOrderLineType {
      __typename
      stockOrder {
        uid
        orderByUid
        departmentUid
        status
        orderNumber
      }
      orderProducts {
        uid
        productUid
        orderUid
        quantity
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

export function useAddStockOrderMutation() {
  return Urql.useMutation<AddStockOrderMutation, AddStockOrderMutationVariables>(AddStockOrderDocument);
};
export const EditStockOrderDocument = gql`
    mutation EditStockOrder($uid: String!, $payload: StockOrderInputType!) {
  updateStockOrder(uid: $uid, payload: $payload) {
    ... on StockOrderLineType {
      __typename
      stockOrder {
        uid
        orderByUid
        departmentUid
        status
        orderNumber
        remarks
      }
      orderProducts {
        uid
        productUid
        orderUid
        quantity
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

export function useEditStockOrderMutation() {
  return Urql.useMutation<EditStockOrderMutation, EditStockOrderMutationVariables>(EditStockOrderDocument);
};
export const SubmitStockOrderDocument = gql`
    mutation SubmitStockOrder($uid: String!) {
  submitStockOrder(uid: $uid) {
    ... on StockOrderType {
      __typename
      uid
      status
      orderNumber
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useSubmitStockOrderMutation() {
  return Urql.useMutation<SubmitStockOrderMutation, SubmitStockOrderMutationVariables>(SubmitStockOrderDocument);
};
export const ApproveStockOrderDocument = gql`
    mutation ApproveStockOrder($uid: String!, $payload: StockOrderApprovalInputType!) {
  approveStockOrder(uid: $uid, payload: $payload) {
    ... on StockOrderType {
      __typename
      uid
      orderByUid
      departmentUid
      status
      orderNumber
      remarks
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useApproveStockOrderMutation() {
  return Urql.useMutation<ApproveStockOrderMutation, ApproveStockOrderMutationVariables>(ApproveStockOrderDocument);
};
export const IssueStockOrderDocument = gql`
    mutation IssueStockOrder($uid: String!, $payload: [StockOrderProductLineInputType!]!) {
  issueStockOrder(uid: $uid, payload: $payload) {
    ... on StockOrderLineType {
      __typename
      stockOrder {
        uid
        orderByUid
        departmentUid
        status
        orderNumber
        remarks
      }
      orderProducts {
        uid
        product {
          uid
          quantity
        }
        orderUid
        quantity
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

export function useIssueStockOrderMutation() {
  return Urql.useMutation<IssueStockOrderMutation, IssueStockOrderMutationVariables>(IssueStockOrderDocument);
};
export const DeleteStockOrderDocument = gql`
    mutation DeleteStockOrder($uid: String!) {
  deleteStockOrder(uid: $uid) {
    ... on StockOrderLineType {
      __typename
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useDeleteStockOrderMutation() {
  return Urql.useMutation<DeleteStockOrderMutation, DeleteStockOrderMutationVariables>(DeleteStockOrderDocument);
};