import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetAllHazardsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllHazardsQuery = (
  { __typename?: 'Query' }
  & { hazardAll: Array<(
    { __typename?: 'HazardType' }
    & Pick<Types.HazardType, 'uid' | 'name' | 'description'>
  )> }
);

export type GetAllStockCategoriesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllStockCategoriesQuery = (
  { __typename?: 'Query' }
  & { stockCategoryAll: Array<(
    { __typename?: 'StockCategoryType' }
    & Pick<Types.StockCategoryType, 'uid' | 'name' | 'description'>
  )> }
);

export type GetAllStockUnitsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllStockUnitsQuery = (
  { __typename?: 'Query' }
  & { stockUnitAll: Array<(
    { __typename?: 'StockUnitType' }
    & Pick<Types.StockUnitType, 'uid' | 'name'>
  )> }
);

export type GetAllStockItemsQueryVariables = Types.Exact<{
  first: Types.Scalars['Int']['input'];
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
  text: Types.Scalars['String']['input'];
  sortBy?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
}>;


export type GetAllStockItemsQuery = (
  { __typename?: 'Query' }
  & { stockItemAll: (
    { __typename?: 'StockItemCursorPage' }
    & Pick<Types.StockItemCursorPage, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>
    ), items?: Types.Maybe<Array<(
      { __typename?: 'StockItemType' }
      & Pick<Types.StockItemType, 'uid' | 'name' | 'description' | 'categoryUid' | 'hazardUid'>
      & { category?: Types.Maybe<(
        { __typename?: 'StockCategoryType' }
        & Pick<Types.StockCategoryType, 'uid' | 'name'>
      )>, hazard?: Types.Maybe<(
        { __typename?: 'HazardType' }
        & Pick<Types.HazardType, 'uid' | 'name'>
      )> }
    )>> }
  ) }
);

export type GetAllStockItemVariantsQueryVariables = Types.Exact<{
  stockItemUid: Types.Scalars['String']['input'];
}>;


export type GetAllStockItemVariantsQuery = (
  { __typename?: 'Query' }
  & { stockItemVariants: Array<(
    { __typename?: 'StockItemVariantType' }
    & Pick<Types.StockItemVariantType, 'uid' | 'name' | 'description' | 'stockItemUid' | 'minimumLevel' | 'maximumLevel'>
  )> }
);

export type GetAllStockProductsQueryVariables = Types.Exact<{
  first: Types.Scalars['Int']['input'];
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
  text: Types.Scalars['String']['input'];
  sortBy?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
}>;


export type GetAllStockProductsQuery = (
  { __typename?: 'Query' }
  & { stockProductAll: (
    { __typename?: 'StockItemVariantCursorPage' }
    & Pick<Types.StockItemVariantCursorPage, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>
    ), items?: Types.Maybe<Array<(
      { __typename?: 'StockItemVariantType' }
      & Pick<Types.StockItemVariantType, 'uid' | 'name' | 'description' | 'quantity' | 'createdAt' | 'updatedAt'>
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
      )>, createdBy?: Types.Maybe<(
        { __typename?: 'UserType' }
        & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
      )>, updatedBy?: Types.Maybe<(
        { __typename?: 'UserType' }
        & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
      )> }
    )>> }
  ) }
);

export type GetAllStockLotsQueryVariables = Types.Exact<{
  productUid: Types.Scalars['String']['input'];
}>;


export type GetAllStockLotsQuery = (
  { __typename?: 'Query' }
  & { stockLots: Array<(
    { __typename?: 'StockLotType' }
    & Pick<Types.StockLotType, 'uid' | 'lotNumber' | 'quantity' | 'expiryDate'>
  )> }
);

export type GetAllStockOrdersQueryVariables = Types.Exact<{
  first: Types.Scalars['Int']['input'];
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
  status: Types.Scalars['String']['input'];
  text: Types.Scalars['String']['input'];
  sortBy?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
}>;


export type GetAllStockOrdersQuery = (
  { __typename?: 'Query' }
  & { stockOrderAll: (
    { __typename?: 'StockOrderCursorPage' }
    & Pick<Types.StockOrderCursorPage, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>
    ), items?: Types.Maybe<Array<(
      { __typename?: 'StockOrderType' }
      & Pick<Types.StockOrderType, 'uid' | 'status' | 'orderNumber'>
      & { orderBy?: Types.Maybe<(
        { __typename?: 'UserType' }
        & Pick<Types.UserType, 'uid' | 'firstName' | 'lastName'>
      )>, department?: Types.Maybe<(
        { __typename?: 'DepartmentType' }
        & Pick<Types.DepartmentType, 'uid' | 'name'>
      )> }
    )>> }
  ) }
);

export type GetAllStockOrderProductsQueryVariables = Types.Exact<{
  stockOrderUid: Types.Scalars['String']['input'];
}>;


export type GetAllStockOrderProductsQuery = (
  { __typename?: 'Query' }
  & { stockOrderProductAll: Array<(
    { __typename?: 'StockOrderProductType' }
    & Pick<Types.StockOrderProductType, 'uid' | 'quantity'>
    & { product?: Types.Maybe<(
      { __typename?: 'StockItemVariantType' }
      & Pick<Types.StockItemVariantType, 'uid' | 'name' | 'quantity'>
    )>, stockLot?: Types.Maybe<(
      { __typename?: 'StockLotType' }
      & Pick<Types.StockLotType, 'uid' | 'lotNumber' | 'quantity'>
    )> }
  )> }
);

export type GetAllStockAdustmentsQueryVariables = Types.Exact<{
  first: Types.Scalars['Int']['input'];
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
  text: Types.Scalars['String']['input'];
  sortBy?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
  productUid?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type GetAllStockAdustmentsQuery = (
  { __typename?: 'Query' }
  & { stockAdjustmentAll: (
    { __typename?: 'StockAdjustmentCursorPage' }
    & Pick<Types.StockAdjustmentCursorPage, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>
    ), items?: Types.Maybe<Array<(
      { __typename?: 'StockAdjustmentType' }
      & Pick<Types.StockAdjustmentType, 'uid' | 'productUid' | 'adjustmentType' | 'adjust' | 'adjustmentDate' | 'remarks' | 'adjustmentByUid' | 'createdAt' | 'createdByUid' | 'updatedAt' | 'updatedByUid'>
      & { product?: Types.Maybe<(
        { __typename?: 'StockItemVariantType' }
        & Pick<Types.StockItemVariantType, 'name'>
      )>, adjustmentBy?: Types.Maybe<(
        { __typename?: 'UserType' }
        & Pick<Types.UserType, 'firstName' | 'lastName'>
      )> }
    )>> }
  ) }
);


export const GetAllHazardsDocument = gql`
    query getAllHazards {
  hazardAll {
    uid
    name
    description
  }
}
    `;

export function useGetAllHazardsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllHazardsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllHazardsQuery>({ query: GetAllHazardsDocument, ...options });
};
export const GetAllStockCategoriesDocument = gql`
    query getAllStockCategories {
  stockCategoryAll {
    uid
    name
    description
  }
}
    `;

export function useGetAllStockCategoriesQuery(options: Omit<Urql.UseQueryArgs<never, GetAllStockCategoriesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllStockCategoriesQuery>({ query: GetAllStockCategoriesDocument, ...options });
};
export const GetAllStockUnitsDocument = gql`
    query getAllStockUnits {
  stockUnitAll {
    uid
    name
  }
}
    `;

export function useGetAllStockUnitsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllStockUnitsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllStockUnitsQuery>({ query: GetAllStockUnitsDocument, ...options });
};
export const GetAllStockItemsDocument = gql`
    query getAllStockItems($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
  stockItemAll(
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
      description
      categoryUid
      category {
        uid
        name
      }
      hazardUid
      hazard {
        uid
        name
      }
    }
  }
}
    `;

export function useGetAllStockItemsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllStockItemsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllStockItemsQuery>({ query: GetAllStockItemsDocument, ...options });
};
export const GetAllStockItemVariantsDocument = gql`
    query getAllStockItemVariants($stockItemUid: String!) {
  stockItemVariants(stockItemUid: $stockItemUid) {
    uid
    name
    description
    stockItemUid
    minimumLevel
    maximumLevel
  }
}
    `;

export function useGetAllStockItemVariantsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllStockItemVariantsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllStockItemVariantsQuery>({ query: GetAllStockItemVariantsDocument, ...options });
};
export const GetAllStockProductsDocument = gql`
    query getAllStockProducts($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
  stockProductAll(
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
  }
}
    `;

export function useGetAllStockProductsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllStockProductsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllStockProductsQuery>({ query: GetAllStockProductsDocument, ...options });
};
export const GetAllStockLotsDocument = gql`
    query getAllStockLots($productUid: String!) {
  stockLots(productUid: $productUid) {
    uid
    lotNumber
    quantity
    expiryDate
  }
}
    `;

export function useGetAllStockLotsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllStockLotsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllStockLotsQuery>({ query: GetAllStockLotsDocument, ...options });
};
export const GetAllStockOrdersDocument = gql`
    query getAllStockOrders($first: Int!, $after: String, $status: String!, $text: String!, $sortBy: [String!] = ["uid"]) {
  stockOrderAll(
    pageSize: $first
    afterCursor: $after
    status: $status
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
      orderBy {
        uid
        firstName
        lastName
      }
      department {
        uid
        name
      }
      status
      orderNumber
    }
  }
}
    `;

export function useGetAllStockOrdersQuery(options: Omit<Urql.UseQueryArgs<never, GetAllStockOrdersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllStockOrdersQuery>({ query: GetAllStockOrdersDocument, ...options });
};
export const GetAllStockOrderProductsDocument = gql`
    query getAllStockOrderProducts($stockOrderUid: String!) {
  stockOrderProductAll(stockOrderUid: $stockOrderUid) {
    uid
    product {
      uid
      name
      quantity
    }
    stockLot {
      uid
      lotNumber
      quantity
    }
    quantity
  }
}
    `;

export function useGetAllStockOrderProductsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllStockOrderProductsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllStockOrderProductsQuery>({ query: GetAllStockOrderProductsDocument, ...options });
};
export const GetAllStockAdustmentsDocument = gql`
    query getAllStockAdustments($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"], $productUid: String) {
  stockAdjustmentAll(
    pageSize: $first
    afterCursor: $after
    text: $text
    sortBy: $sortBy
    productUid: $productUid
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
      productUid
      product {
        name
      }
      adjustmentType
      adjust
      adjustmentDate
      remarks
      adjustmentByUid
      adjustmentBy {
        firstName
        lastName
      }
      createdAt
      createdByUid
      updatedAt
      updatedByUid
    }
  }
}
    `;

export function useGetAllStockAdustmentsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllStockAdustmentsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllStockAdustmentsQuery>({ query: GetAllStockAdustmentsDocument, ...options });
};