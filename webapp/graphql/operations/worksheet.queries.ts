import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetAllWorksheetTemplatesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllWorksheetTemplatesQuery = (
  { __typename?: 'Query' }
  & { worksheetTemplateAll: Array<(
    { __typename?: 'WorkSheetTemplateType' }
    & Pick<Types.WorkSheetTemplateType, 'uid' | 'name' | 'reserved' | 'numberOfSamples' | 'rows' | 'cols' | 'rowWise' | 'worksheetType' | 'instrumentUid' | 'sampleTypeUid' | 'description' | 'analysisUid' | 'state'>
    & { instrument?: Types.Maybe<(
      { __typename?: 'InstrumentType' }
      & Pick<Types.InstrumentType, 'uid' | 'name'>
    )>, sampleType?: Types.Maybe<(
      { __typename?: 'SampleTypeTyp' }
      & Pick<Types.SampleTypeTyp, 'uid' | 'name'>
    )>, analysis?: Types.Maybe<(
      { __typename?: 'AnalysisType' }
      & Pick<Types.AnalysisType, 'uid' | 'name'>
    )> }
  )> }
);

export type GetAllWorksheetsQueryVariables = Types.Exact<{
  first: Types.Scalars['Int']['input'];
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
  before?: Types.InputMaybe<Types.Scalars['String']['input']>;
  status: Types.Scalars['String']['input'];
  text: Types.Scalars['String']['input'];
  sortBy?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
}>;


export type GetAllWorksheetsQuery = (
  { __typename?: 'Query' }
  & { worksheetAll: (
    { __typename?: 'WorkSheetCursorPage' }
    & Pick<Types.WorkSheetCursorPage, 'totalCount'>
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<Types.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>
    ), items?: Types.Maybe<Array<(
      { __typename?: 'WorkSheetType' }
      & Pick<Types.WorkSheetType, 'uid' | 'worksheetId' | 'numberOfSamples' | 'assignedCount' | 'state' | 'createdAt'>
      & { analyst?: Types.Maybe<(
        { __typename?: 'UserType' }
        & Pick<Types.UserType, 'uid' | 'userName' | 'firstName' | 'lastName'>
      )>, instrument?: Types.Maybe<(
        { __typename?: 'InstrumentType' }
        & Pick<Types.InstrumentType, 'uid' | 'name'>
      )>, analysis?: Types.Maybe<(
        { __typename?: 'AnalysisType' }
        & Pick<Types.AnalysisType, 'uid' | 'name'>
      )> }
    )>> }
  ) }
);

export type GetWorkSheetByUidQueryVariables = Types.Exact<{
  worksheetUid: Types.Scalars['String']['input'];
}>;


export type GetWorkSheetByUidQuery = (
  { __typename?: 'Query' }
  & { worksheetByUid: (
    { __typename?: 'WorkSheetType' }
    & Pick<Types.WorkSheetType, 'uid' | 'worksheetId' | 'numberOfSamples' | 'assignedCount' | 'reserved' | 'state' | 'createdAt'>
    & { analyst?: Types.Maybe<(
      { __typename?: 'UserType' }
      & Pick<Types.UserType, 'uid' | 'userName' | 'firstName' | 'lastName'>
    )>, sampleType?: Types.Maybe<(
      { __typename?: 'SampleTypeTyp' }
      & Pick<Types.SampleTypeTyp, 'name'>
    )>, instrument?: Types.Maybe<(
      { __typename?: 'InstrumentType' }
      & Pick<Types.InstrumentType, 'uid' | 'name'>
    )>, template?: Types.Maybe<(
      { __typename?: 'WorkSheetTemplateType' }
      & Pick<Types.WorkSheetTemplateType, 'uid' | 'name'>
    )>, analysis?: Types.Maybe<(
      { __typename?: 'AnalysisType' }
      & Pick<Types.AnalysisType, 'uid' | 'name'>
    )>, analysisResults?: Types.Maybe<Array<(
      { __typename?: 'AnalysisResultType' }
      & Pick<Types.AnalysisResultType, 'uid' | 'result' | 'status' | 'worksheetPosition' | 'retest' | 'reportable'>
      & { method?: Types.Maybe<(
        { __typename?: 'MethodType' }
        & Pick<Types.MethodType, 'uid' | 'name'>
      )>, laboratoryInstrument?: Types.Maybe<(
        { __typename?: 'LaboratoryInstrumentType' }
        & Pick<Types.LaboratoryInstrumentType, 'uid' | 'labName'>
        & { instrument?: Types.Maybe<(
          { __typename?: 'InstrumentType' }
          & Pick<Types.InstrumentType, 'uid' | 'name'>
        )> }
      )>, analysis?: Types.Maybe<(
        { __typename?: 'AnalysisType' }
        & Pick<Types.AnalysisType, 'uid' | 'name' | 'unitUid'>
        & { unit?: Types.Maybe<(
          { __typename?: 'UnitType' }
          & Pick<Types.UnitType, 'uid' | 'name'>
        )>, resultOptions?: Types.Maybe<Array<(
          { __typename?: 'ResultOptionType' }
          & Pick<Types.ResultOptionType, 'uid' | 'optionKey' | 'value'>
        )>>, interims?: Types.Maybe<Array<(
          { __typename?: 'AnalysisInterimType' }
          & Pick<Types.AnalysisInterimType, 'uid' | 'key' | 'value'>
        )>>, instruments?: Types.Maybe<Array<(
          { __typename?: 'InstrumentType' }
          & Pick<Types.InstrumentType, 'uid' | 'name'>
          & { laboratoryInstruments?: Types.Maybe<Array<(
            { __typename?: 'LaboratoryInstrumentType' }
            & Pick<Types.LaboratoryInstrumentType, 'uid' | 'labName' | 'serialNumber'>
          )>> }
        )>>, methods?: Types.Maybe<Array<(
          { __typename?: 'MethodType' }
          & Pick<Types.MethodType, 'uid' | 'name'>
        )>> }
      )>, sample: (
        { __typename?: 'SampleType' }
        & Pick<Types.SampleType, 'uid' | 'sampleId' | 'priority'>
        & { analysisRequest?: Types.Maybe<(
          { __typename?: 'AnalysisRequestType' }
          & Pick<Types.AnalysisRequestType, 'uid'>
          & { client?: Types.Maybe<(
            { __typename?: 'ClientType' }
            & Pick<Types.ClientType, 'uid' | 'name'>
          )>, patient: (
            { __typename?: 'PatientType' }
            & Pick<Types.PatientType, 'uid' | 'firstName' | 'lastName' | 'clientPatientId' | 'patientId'>
          ) }
        )>, qcLevel?: Types.Maybe<(
          { __typename?: 'QCLevelType' }
          & Pick<Types.QcLevelType, 'uid' | 'level'>
        )> }
      ) }
    )>> }
  ) }
);


export const GetAllWorksheetTemplatesDocument = gql`
    query getAllWorksheetTemplates {
  worksheetTemplateAll {
    uid
    name
    reserved
    numberOfSamples
    rows
    cols
    rowWise
    worksheetType
    instrumentUid
    instrument {
      uid
      name
    }
    sampleTypeUid
    sampleType {
      uid
      name
    }
    description
    analysisUid
    analysis {
      uid
      name
    }
    state
  }
}
    `;

export function useGetAllWorksheetTemplatesQuery(options: Omit<Urql.UseQueryArgs<never, GetAllWorksheetTemplatesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllWorksheetTemplatesQuery>({ query: GetAllWorksheetTemplatesDocument, ...options });
};
export const GetAllWorksheetsDocument = gql`
    query getAllWorksheets($first: Int!, $after: String, $before: String, $status: String!, $text: String!, $sortBy: [String!] = ["-uid"]) {
  worksheetAll(
    pageSize: $first
    afterCursor: $after
    beforeCursor: $before
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
      worksheetId
      numberOfSamples
      assignedCount
      analyst {
        uid
        userName
        firstName
        lastName
      }
      instrument {
        uid
        name
      }
      analysis {
        uid
        name
      }
      state
      createdAt
    }
  }
}
    `;

export function useGetAllWorksheetsQuery(options: Omit<Urql.UseQueryArgs<never, GetAllWorksheetsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllWorksheetsQuery>({ query: GetAllWorksheetsDocument, ...options });
};
export const GetWorkSheetByUidDocument = gql`
    query getWorkSheetByUid($worksheetUid: String!) {
  worksheetByUid(worksheetUid: $worksheetUid) {
    uid
    worksheetId
    numberOfSamples
    assignedCount
    reserved
    state
    createdAt
    analyst {
      uid
      userName
      firstName
      lastName
    }
    sampleType {
      name
      name
    }
    instrument {
      uid
      name
    }
    template {
      uid
      name
    }
    analysis {
      uid
      name
    }
    analysisResults {
      uid
      result
      status
      worksheetPosition
      retest
      reportable
      method {
        uid
        name
      }
      laboratoryInstrument {
        uid
        labName
        instrument {
          uid
          name
        }
      }
      analysis {
        uid
        name
        unitUid
        unit {
          uid
          name
        }
        resultOptions {
          uid
          optionKey
          value
        }
        interims {
          uid
          key
          value
        }
        instruments {
          uid
          name
          laboratoryInstruments {
            uid
            labName
            serialNumber
          }
        }
        methods {
          uid
          name
        }
      }
      sample {
        uid
        sampleId
        priority
        analysisRequest {
          uid
          client {
            uid
            name
          }
          patient {
            uid
            firstName
            lastName
            clientPatientId
            patientId
          }
        }
        qcLevel {
          uid
          level
        }
      }
    }
  }
}
    `;

export function useGetWorkSheetByUidQuery(options: Omit<Urql.UseQueryArgs<never, GetWorkSheetByUidQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetWorkSheetByUidQuery>({ query: GetWorkSheetByUidDocument, ...options });
};