import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetAllReferralLaboratoriesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllReferralLaboratoriesQuery = (
  { __typename?: 'Query' }
  & { referralLaboratoryAll: Array<(
    { __typename?: 'ReferralLaboratoryType' }
    & Pick<Types.ReferralLaboratoryType, 'uid' | 'name' | 'code' | 'url' | 'password' | 'username' | 'isReferral' | 'isReference'>
  )> }
);

export type GetAllShipmentsQueryVariables = Types.Exact<{
  first: Types.Scalars['Int']['input'];
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
  before?: Types.InputMaybe<Types.Scalars['String']['input']>;
  incoming: Types.Scalars['Boolean']['input'];
  status: Types.Scalars['String']['input'];
  text: Types.Scalars['String']['input'];
  sortBy?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
}>;


export type GetAllShipmentsQuery = (
  { __typename?: 'Query' }
  & { shipmentAll: (
    { __typename?: 'ShipmentCursorPage' }
    & Pick<Types.ShipmentCursorPage, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>
    ), items?: Types.Maybe<Array<(
      { __typename?: 'ShipmentType' }
      & Pick<Types.ShipmentType, 'uid' | 'shipmentId' | 'assignedCount' | 'incoming' | 'state' | 'laboratoryUid' | 'courier' | 'createdAt'>
      & { laboratory?: Types.Maybe<(
        { __typename?: 'LaboratoryType' }
        & Pick<Types.LaboratoryType, 'name'>
      )> }
    )>> }
  ) }
);

export type GetShipmentByUidQueryVariables = Types.Exact<{
  shipmentUid: Types.Scalars['String']['input'];
}>;


export type GetShipmentByUidQuery = (
  { __typename?: 'Query' }
  & { shipmentByUid: (
    { __typename?: 'ShipmentType' }
    & Pick<Types.ShipmentType, 'uid' | 'shipmentId' | 'assignedCount' | 'state' | 'incoming' | 'comment' | 'createdAt' | 'courier' | 'jsonContent'>
    & { laboratory?: Types.Maybe<(
      { __typename?: 'LaboratoryType' }
      & Pick<Types.LaboratoryType, 'name'>
    )>, shippedSamples?: Types.Maybe<Array<(
      { __typename?: 'ShippedSampleType' }
      & Pick<Types.ShippedSampleType, 'resultNotified' | 'extSampleId'>
      & { sample: (
        { __typename?: 'SampleType' }
        & Pick<Types.SampleType, 'uid' | 'sampleId' | 'status'>
        & { analysisRequest?: Types.Maybe<(
          { __typename?: 'AnalysisRequestType' }
          & Pick<Types.AnalysisRequestType, 'clientRequestId'>
          & { patient: (
            { __typename?: 'PatientType' }
            & Pick<Types.PatientType, 'uid'>
          ) }
        )>, analyses?: Types.Maybe<Array<(
          { __typename?: 'AnalysisType' }
          & Pick<Types.AnalysisType, 'uid' | 'name' | 'keyword'>
        )>> }
      ) }
    )>> }
  ) }
);

export type ManifestReportQueryVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type ManifestReportQuery = (
  { __typename?: 'Query' }
  & Pick<Types.Query, 'manifestReportDownload'>
);


export const GetAllReferralLaboratoriesDocument = gql`
    query getAllReferralLaboratories {
  referralLaboratoryAll {
    uid
    name
    code
    url
    password
    username
    isReferral
    isReference
  }
}
    `;

export function useGetAllReferralLaboratoriesQuery(options: Omit<Urql.UseQueryArgs<never, GetAllReferralLaboratoriesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllReferralLaboratoriesQuery>({ query: GetAllReferralLaboratoriesDocument, ...options });
};
export const GetAllShipmentsDocument = gql`
    query getAllShipments($first: Int!, $after: String, $before: String, $incoming: Boolean!, $status: String!, $text: String!, $sortBy: [String!] = ["-uid"]) {
  shipmentAll(
    pageSize: $first
    afterCursor: $after
    beforeCursor: $before
    incoming: $incoming
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
      shipmentId
      assignedCount
      incoming
      state
      laboratoryUid
      courier
      laboratory {
        name
      }
      createdAt
    }
  }
}
    `;

export function useGetAllShipmentsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllShipmentsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllShipmentsQuery>({ query: GetAllShipmentsDocument, ...options });
};
export const GetShipmentByUidDocument = gql`
    query getShipmentByUid($shipmentUid: String!) {
  shipmentByUid(shipmentUid: $shipmentUid) {
    uid
    shipmentId
    assignedCount
    state
    incoming
    comment
    createdAt
    courier
    jsonContent
    laboratory {
      name
    }
    shippedSamples {
      resultNotified
      extSampleId
      sample {
        uid
        sampleId
        status
        analysisRequest {
          clientRequestId
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
  }
}
    `;

export function useGetShipmentByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetShipmentByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetShipmentByUidQuery>({ query: GetShipmentByUidDocument, ...options });
};
export const ManifestReportDocument = gql`
    query manifestReport($uid: String!) {
  manifestReportDownload(uid: $uid)
}
    `;

export function useManifestReportQuery(options: Omit<Urql.UseQueryArgs<never, ManifestReportQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ManifestReportQuery>({ query: ManifestReportDocument, ...options });
};