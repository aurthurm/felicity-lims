import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AddSmsTemplateMutationVariables = Types.Exact<{
  payload: Types.SmsTemplateInputType;
}>;


export type AddSmsTemplateMutation = (
  { __typename?: 'Mutation' }
  & { createSmsTemplate: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'SmsTemplateType' }
    & Pick<Types.SmsTemplateType, 'uid' | 'name' | 'description' | 'specificationTrigger' | 'audience' | 'template' | 'createdAt' | 'updatedAt' | 'isActive'>
  ) }
);

export type EditSmsTemplateMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
  payload: Types.SmsTemplateInputType;
}>;


export type EditSmsTemplateMutation = (
  { __typename?: 'Mutation' }
  & { updateSmsTemplate: (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) | (
    { __typename: 'SmsTemplateType' }
    & Pick<Types.SmsTemplateType, 'uid' | 'name' | 'description' | 'specificationTrigger' | 'audience' | 'template' | 'createdAt' | 'updatedAt' | 'isActive'>
  ) }
);

export type DeleteSmsTemplateMutationVariables = Types.Exact<{
  uid: Types.Scalars['String']['input'];
}>;


export type DeleteSmsTemplateMutation = (
  { __typename?: 'Mutation' }
  & { deleteSmsTemplate: (
    { __typename: 'DeletedItem' }
    & Pick<Types.DeletedItem, 'uid'>
  ) | (
    { __typename: 'OperationError' }
    & Pick<Types.OperationError, 'error' | 'suggestion'>
  ) }
);


export const AddSmsTemplateDocument = gql`
    mutation AddSmsTemplate($payload: SmsTemplateInputType!) {
  createSmsTemplate(payload: $payload) {
    ... on SmsTemplateType {
      __typename
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
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useAddSmsTemplateMutation() {
  return Urql.useMutation<AddSmsTemplateMutation, AddSmsTemplateMutationVariables>(AddSmsTemplateDocument);
};
export const EditSmsTemplateDocument = gql`
    mutation EditSmsTemplate($uid: String!, $payload: SmsTemplateInputType!) {
  updateSmsTemplate(uid: $uid, payload: $payload) {
    ... on SmsTemplateType {
      __typename
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
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useEditSmsTemplateMutation() {
  return Urql.useMutation<EditSmsTemplateMutation, EditSmsTemplateMutationVariables>(EditSmsTemplateDocument);
};
export const DeleteSmsTemplateDocument = gql`
    mutation DeleteSmsTemplate($uid: String!) {
  deleteSmsTemplate(uid: $uid) {
    ... on DeletedItem {
      __typename
      uid
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;

export function useDeleteSmsTemplateMutation() {
  return Urql.useMutation<DeleteSmsTemplateMutation, DeleteSmsTemplateMutationVariables>(DeleteSmsTemplateDocument);
};