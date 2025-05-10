import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetSmsTemplatesByTargetQueryVariables = Types.Exact<{
  targetType: Types.Scalars['String']['input'];
  targetUid: Types.Scalars['String']['input'];
}>;


export type GetSmsTemplatesByTargetQuery = (
  { __typename?: 'Query' }
  & { smsTemplatesByTarget: Array<(
    { __typename?: 'SmsTemplateType' }
    & Pick<Types.SmsTemplateType, 'uid' | 'name' | 'description' | 'specificationTrigger' | 'audience' | 'template' | 'createdAt' | 'updatedAt' | 'isActive'>
  )> }
);


export const GetSmsTemplatesByTargetDocument = gql`
    query getSmsTemplatesByTarget($targetType: String!, $targetUid: String!) {
  smsTemplatesByTarget(targetType: $targetType, targetUid: $targetUid) {
    uid
    name
    description
    specificationTrigger
    audience
    template
    createdAt
    updatedAt
    isActive
  }
}
    `;

export function useGetSmsTemplatesByTargetQuery(options: Omit<Urql.UseQueryArgs<never, GetSmsTemplatesByTargetQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetSmsTemplatesByTargetQuery>({ query: GetSmsTemplatesByTargetDocument, ...options });
};