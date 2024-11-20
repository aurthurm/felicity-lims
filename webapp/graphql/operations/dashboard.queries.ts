import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetSampleGroupByStatusQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetSampleGroupByStatusQuery = (
  { __typename?: 'Query' }
  & { countSampleGroupByStatus: (
    { __typename?: 'GroupedCounts' }
    & { data: Array<(
      { __typename: 'GroupCount' }
      & Pick<Types.GroupCount, 'group' | 'count'>
    )> }
  ) }
);

export type GetExtrasGroupByStatusQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetExtrasGroupByStatusQuery = (
  { __typename?: 'Query' }
  & { countExtrasGroupByStatus: (
    { __typename?: 'GroupedCounts' }
    & { data: Array<(
      { __typename: 'GroupCount' }
      & Pick<Types.GroupCount, 'group' | 'count'>
    )> }
  ) }
);

export type GetAnalysisGroupByStatusQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAnalysisGroupByStatusQuery = (
  { __typename?: 'Query' }
  & { countAnalyteGroupByStatus: (
    { __typename?: 'GroupedCounts' }
    & { data: Array<(
      { __typename: 'GroupCount' }
      & Pick<Types.GroupCount, 'group' | 'count'>
    )> }
  ) }
);

export type GetWorksheetGroupByStatusQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetWorksheetGroupByStatusQuery = (
  { __typename?: 'Query' }
  & { countWorksheetGroupByStatus: (
    { __typename?: 'GroupedCounts' }
    & { data: Array<(
      { __typename: 'GroupCount' }
      & Pick<Types.GroupCount, 'group' | 'count'>
    )> }
  ) }
);

export type GetAnalysisGroupByInstrumentQueryVariables = Types.Exact<{
  startDate: Types.Scalars['String']['input'];
  endDate: Types.Scalars['String']['input'];
}>;


export type GetAnalysisGroupByInstrumentQuery = (
  { __typename?: 'Query' }
  & { countAnalyteGroupByInstrument: (
    { __typename?: 'GroupedCounts' }
    & { data: Array<(
      { __typename: 'GroupCount' }
      & Pick<Types.GroupCount, 'group' | 'count'>
    )> }
  ) }
);

export type SampleProcessPeformanceQueryVariables = Types.Exact<{
  startDate: Types.Scalars['String']['input'];
  endDate: Types.Scalars['String']['input'];
}>;


export type SampleProcessPeformanceQuery = (
  { __typename?: 'Query' }
  & { sampleProcessPerformance: (
    { __typename: 'ProcessStatistics' }
    & { data: Array<(
      { __typename?: 'ProcessData' }
      & Pick<Types.ProcessData, 'process'>
      & { counts?: Types.Maybe<(
        { __typename?: 'ProcessCounts' }
        & Pick<Types.ProcessCounts, 'totalSamples' | 'totalLate' | 'totalNotLate' | 'processAverage' | 'avgExtraDays'>
      )> }
    )> }
  ) }
);

export type GetAnalysisProcessPeformanceQueryVariables = Types.Exact<{
  process: Types.Scalars['String']['input'];
  startDate: Types.Scalars['String']['input'];
  endDate: Types.Scalars['String']['input'];
}>;


export type GetAnalysisProcessPeformanceQuery = (
  { __typename?: 'Query' }
  & { analysisProcessPerformance: (
    { __typename: 'ProcessStatistics' }
    & { data: Array<(
      { __typename?: 'ProcessData' }
      & Pick<Types.ProcessData, 'process'>
      & { groups?: Types.Maybe<Array<(
        { __typename?: 'ProcessCounts' }
        & Pick<Types.ProcessCounts, 'totalSamples' | 'totalLate' | 'totalNotLate' | 'processAverage' | 'avgExtraDays' | 'service'>
      )>> }
    )> }
  ) }
);

export type SampleGroupByActionQueryVariables = Types.Exact<{
  startDate: Types.Scalars['String']['input'];
  endDate: Types.Scalars['String']['input'];
}>;


export type SampleGroupByActionQuery = (
  { __typename?: 'Query' }
  & { countSampleGroupByAction: (
    { __typename: 'GroupedData' }
    & { data: Array<(
      { __typename: 'GroupData' }
      & Pick<Types.GroupData, 'group'>
      & { counts?: Types.Maybe<Array<(
        { __typename: 'GroupCount' }
        & Pick<Types.GroupCount, 'group' | 'count'>
      )>> }
    )> }
  ) }
);

export type GetSampleLaggardsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetSampleLaggardsQuery = (
  { __typename?: 'Query' }
  & { sampleLaggards: (
    { __typename: 'LaggardStatistics' }
    & { data: Array<(
      { __typename: 'LaggardData' }
      & Pick<Types.LaggardData, 'category'>
      & { counts?: Types.Maybe<(
        { __typename: 'LaggardCounts' }
        & Pick<Types.LaggardCounts, 'totalIncomplete' | 'totalDelayed' | 'totalNotDelayed' | 'lessThanTen' | 'tenToTwenty' | 'twentyToThirty' | 'graterThanThirty'>
      )> }
    )> }
  ) }
);


export const GetSampleGroupByStatusDocument = gql`
    query getSampleGroupByStatus {
  countSampleGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `;

export function useGetSampleGroupByStatusQuery(options: Omit<Urql.UseQueryArgs<never, GetSampleGroupByStatusQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetSampleGroupByStatusQuery>({ query: GetSampleGroupByStatusDocument, ...options });
};
export const GetExtrasGroupByStatusDocument = gql`
    query getExtrasGroupByStatus {
  countExtrasGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `;

export function useGetExtrasGroupByStatusQuery(options: Omit<Urql.UseQueryArgs<never, GetExtrasGroupByStatusQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetExtrasGroupByStatusQuery>({ query: GetExtrasGroupByStatusDocument, ...options });
};
export const GetAnalysisGroupByStatusDocument = gql`
    query getAnalysisGroupByStatus {
  countAnalyteGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `;

export function useGetAnalysisGroupByStatusQuery(options: Omit<Urql.UseQueryArgs<never, GetAnalysisGroupByStatusQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAnalysisGroupByStatusQuery>({ query: GetAnalysisGroupByStatusDocument, ...options });
};
export const GetWorksheetGroupByStatusDocument = gql`
    query getWorksheetGroupByStatus {
  countWorksheetGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `;

export function useGetWorksheetGroupByStatusQuery(options: Omit<Urql.UseQueryArgs<never, GetWorksheetGroupByStatusQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetWorksheetGroupByStatusQuery>({ query: GetWorksheetGroupByStatusDocument, ...options });
};
export const GetAnalysisGroupByInstrumentDocument = gql`
    query getAnalysisGroupByInstrument($startDate: String!, $endDate: String!) {
  countAnalyteGroupByInstrument(startDate: $startDate, endDate: $endDate) {
    data {
      __typename
      group
      count
    }
  }
}
    `;

export function useGetAnalysisGroupByInstrumentQuery(options: Omit<Urql.UseQueryArgs<never, GetAnalysisGroupByInstrumentQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAnalysisGroupByInstrumentQuery>({ query: GetAnalysisGroupByInstrumentDocument, ...options });
};
export const SampleProcessPeformanceDocument = gql`
    query SampleProcessPeformance($startDate: String!, $endDate: String!) {
  sampleProcessPerformance(startDate: $startDate, endDate: $endDate) {
    __typename
    data {
      process
      counts {
        totalSamples
        totalLate
        totalNotLate
        processAverage
        avgExtraDays
      }
    }
  }
}
    `;

export function useSampleProcessPeformanceQuery(options: Omit<Urql.UseQueryArgs<never, SampleProcessPeformanceQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SampleProcessPeformanceQuery>({ query: SampleProcessPeformanceDocument, ...options });
};
export const GetAnalysisProcessPeformanceDocument = gql`
    query getAnalysisProcessPeformance($process: String!, $startDate: String!, $endDate: String!) {
  analysisProcessPerformance(
    process: $process
    startDate: $startDate
    endDate: $endDate
  ) {
    __typename
    data {
      process
      groups {
        totalSamples
        totalLate
        totalNotLate
        processAverage
        avgExtraDays
        service
      }
    }
  }
}
    `;

export function useGetAnalysisProcessPeformanceQuery(options: Omit<Urql.UseQueryArgs<never, GetAnalysisProcessPeformanceQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAnalysisProcessPeformanceQuery>({ query: GetAnalysisProcessPeformanceDocument, ...options });
};
export const SampleGroupByActionDocument = gql`
    query SampleGroupByAction($startDate: String!, $endDate: String!) {
  countSampleGroupByAction(startDate: $startDate, endDate: $endDate) {
    __typename
    data {
      __typename
      group
      counts {
        __typename
        group
        count
      }
    }
  }
}
    `;

export function useSampleGroupByActionQuery(options: Omit<Urql.UseQueryArgs<never, SampleGroupByActionQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SampleGroupByActionQuery>({ query: SampleGroupByActionDocument, ...options });
};
export const GetSampleLaggardsDocument = gql`
    query getSampleLaggards {
  sampleLaggards {
    __typename
    data {
      __typename
      category
      counts {
        __typename
        totalIncomplete
        totalDelayed
        totalNotDelayed
        lessThanTen
        tenToTwenty
        twentyToThirty
        graterThanThirty
      }
    }
  }
}
    `;

export function useGetSampleLaggardsQuery(options: Omit<Urql.UseQueryArgs<never, GetSampleLaggardsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetSampleLaggardsQuery>({ query: GetSampleLaggardsDocument, ...options });
};