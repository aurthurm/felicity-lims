import type * as Types from '../schema';

import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AddReflexRuleMutationVariables = Types.Exact<{
    payload: Types.ReflexRuleInput;
}>;

export type AddReflexRuleMutation = { __typename?: 'Mutation' } & {
    createReflexRule:
        | ({ __typename: 'OperationError' } & Pick<Types.OperationError, 'error' | 'suggestion'>)
        | ({ __typename: 'ReflexRuleType' } & Pick<Types.ReflexRuleType, 'uid' | 'name' | 'description' | 'createdByUid' | 'createdAt'>);
};

export type EditReflexRuleMutationVariables = Types.Exact<{
    uid: Types.Scalars['String']['input'];
    payload: Types.ReflexRuleInput;
}>;

export type EditReflexRuleMutation = { __typename?: 'Mutation' } & {
    updateReflexRule:
        | ({ __typename: 'OperationError' } & Pick<Types.OperationError, 'error' | 'suggestion'>)
        | ({ __typename: 'ReflexRuleType' } & Pick<
              Types.ReflexRuleType,
              'uid' | 'name' | 'description' | 'isActive' | 'createdByUid' | 'createdAt'
          >);
};

export type CreateReflexDecisionMutationVariables = Types.Exact<{
    payload: Types.ReflexDecisionInput;
}>;

export type CreateReflexDecisionMutation = { __typename?: 'Mutation' } & {
    createReflexDecision:
        | ({ __typename: 'OperationError' } & Pick<Types.OperationError, 'error' | 'suggestion'>)
        | ({ __typename?: 'ReflexDecisionType' } & Pick<
              Types.ReflexDecisionType,
              'uid' | 'reflexTriggerUid' | 'description' | 'priority'
          > & {
                  ruleGroups?: Types.Maybe<
                      Array<
                          { __typename?: 'ReflexRuleGroupType' } & Pick<Types.ReflexRuleGroupType, 'uid' | 'description' | 'priority'> & {
                                  rules?: Types.Maybe<
                                      Array<
                                          { __typename?: 'ReflexRuleCriteriaType' } & Pick<
                                              Types.ReflexRuleCriteriaType,
                                              'uid' | 'analysisUid' | 'operator' | 'value' | 'priority'
                                          >
                                      >
                                  >;
                              }
                      >
                  >;
                  addAnalyses?: Types.Maybe<
                      Array<{ __typename?: 'ReflexAddAnalysisType' } & Pick<Types.ReflexAddAnalysisType, 'uid' | 'analysisUid' | 'count'>>
                  >;
                  finalizeAnalyses?: Types.Maybe<
                      Array<
                          { __typename?: 'ReflexFinalizeAnalysisType' } & Pick<
                              Types.ReflexFinalizeAnalysisType,
                              'uid' | 'analysisUid' | 'value'
                          >
                      >
                  >;
              });
};

export type UpdateReflexDecisionMutationVariables = Types.Exact<{
    uid: Types.Scalars['String']['input'];
    payload: Types.ReflexDecisionInput;
}>;

export type UpdateReflexDecisionMutation = { __typename?: 'Mutation' } & {
    updateReflexDecision:
        | ({ __typename: 'OperationError' } & Pick<Types.OperationError, 'error' | 'suggestion'>)
        | ({ __typename?: 'ReflexDecisionType' } & Pick<
              Types.ReflexDecisionType,
              'uid' | 'reflexTriggerUid' | 'description' | 'priority'
          > & {
                  ruleGroups?: Types.Maybe<
                      Array<
                          { __typename?: 'ReflexRuleGroupType' } & Pick<Types.ReflexRuleGroupType, 'uid' | 'description' | 'priority'> & {
                                  rules?: Types.Maybe<
                                      Array<
                                          { __typename?: 'ReflexRuleCriteriaType' } & Pick<
                                              Types.ReflexRuleCriteriaType,
                                              'uid' | 'analysisUid' | 'operator' | 'value' | 'priority'
                                          >
                                      >
                                  >;
                              }
                      >
                  >;
                  addAnalyses?: Types.Maybe<
                      Array<{ __typename?: 'ReflexAddAnalysisType' } & Pick<Types.ReflexAddAnalysisType, 'uid' | 'analysisUid' | 'count'>>
                  >;
                  finalizeAnalyses?: Types.Maybe<
                      Array<
                          { __typename?: 'ReflexFinalizeAnalysisType' } & Pick<
                              Types.ReflexFinalizeAnalysisType,
                              'uid' | 'analysisUid' | 'value'
                          >
                      >
                  >;
              });
};

export type CreateReflexTriggerMutationVariables = Types.Exact<{
    payload: Types.ReflexTriggerInput;
}>;

export type CreateReflexTriggerMutation = { __typename?: 'Mutation' } & {
    createReflexTrigger:
        | ({ __typename: 'OperationError' } & Pick<Types.OperationError, 'error' | 'suggestion'>)
        | ({ __typename?: 'ReflexTriggerType' } & Pick<
              Types.ReflexTriggerType,
              'uid' | 'reflexRuleUid' | 'level' | 'description' | 'sampleTypeUid' | 'posX' | 'posY'
          > & { analyses?: Types.Maybe<Array<{ __typename?: 'AnalysisType' } & Pick<Types.AnalysisType, 'uid' | 'name'>>> });
};

export type UpdateReflexTriggerMutationVariables = Types.Exact<{
    uid: Types.Scalars['String']['input'];
    payload: Types.ReflexTriggerInput;
}>;

export type UpdateReflexTriggerMutation = { __typename?: 'Mutation' } & {
    updateReflexTrigger:
        | ({ __typename: 'OperationError' } & Pick<Types.OperationError, 'error' | 'suggestion'>)
        | ({ __typename?: 'ReflexTriggerType' } & Pick<
              Types.ReflexTriggerType,
              'uid' | 'reflexRuleUid' | 'level' | 'description' | 'sampleTypeUid'
          > & { analyses?: Types.Maybe<Array<{ __typename?: 'AnalysisType' } & Pick<Types.AnalysisType, 'uid' | 'name'>>> });
};

export type DeleteReflexTriggerMutationVariables = Types.Exact<{
    uid: Types.Scalars['String']['input'];
}>;

export type DeleteReflexTriggerMutation = { __typename?: 'Mutation' } & {
    deleteReflexTrigger:
        | ({ __typename?: 'DeletedItem' } & Pick<Types.DeletedItem, 'uid'>)
        | ({ __typename: 'OperationError' } & Pick<Types.OperationError, 'error' | 'suggestion'>);
};

export type DeleteReflexDecisionMutationVariables = Types.Exact<{
    uid: Types.Scalars['String']['input'];
}>;

export type DeleteReflexDecisionMutation = { __typename?: 'Mutation' } & {
    deleteReflexDecision:
        | ({ __typename?: 'DeletedItem' } & Pick<Types.DeletedItem, 'uid'>)
        | ({ __typename: 'OperationError' } & Pick<Types.OperationError, 'error' | 'suggestion'>);
};

export type SaveReflexRuleGraphMutationVariables = Types.Exact<{
    uid: Types.Scalars['String']['input'];
    graph: Types.ReflexRuleGraphInput;
}>;

export type SaveReflexRuleGraphMutation = { __typename?: 'Mutation' } & {
    saveReflexRuleGraph:
        | ({ __typename: 'OperationError' } & Pick<Types.OperationError, 'error' | 'suggestion'>)
        | ({ __typename?: 'ReflexRuleType' } & Pick<Types.ReflexRuleType, 'uid' | 'name' | 'description' | 'isActive' | 'priority'> & {
                  reflexTriggers?: Types.Maybe<
                      Array<
                          { __typename?: 'ReflexTriggerType' } & Pick<
                              Types.ReflexTriggerType,
                              'uid' | 'level' | 'description' | 'posX' | 'posY'
                          > & {
                                  analyses?: Types.Maybe<Array<{ __typename?: 'AnalysisType' } & Pick<Types.AnalysisType, 'uid' | 'name'>>>;
                                  decisions?: Types.Maybe<
                                      Array<
                                          { __typename?: 'ReflexDecisionType' } & Pick<
                                              Types.ReflexDecisionType,
                                              'uid' | 'description' | 'priority' | 'posX' | 'posY'
                                          > & {
                                                  ruleGroups?: Types.Maybe<
                                                      Array<
                                                          { __typename?: 'ReflexRuleGroupType' } & Pick<
                                                              Types.ReflexRuleGroupType,
                                                              'uid' | 'description' | 'priority' | 'posX' | 'posY'
                                                          > & {
                                                                  rules?: Types.Maybe<
                                                                      Array<
                                                                          { __typename?: 'ReflexRuleCriteriaType' } & Pick<
                                                                              Types.ReflexRuleCriteriaType,
                                                                              'uid' | 'analysisUid' | 'operator' | 'value' | 'priority'
                                                                          >
                                                                      >
                                                                  >;
                                                              }
                                                      >
                                                  >;
                                                  addAnalyses?: Types.Maybe<
                                                      Array<
                                                          { __typename?: 'ReflexAddAnalysisType' } & Pick<
                                                              Types.ReflexAddAnalysisType,
                                                              'uid' | 'analysisUid' | 'count' | 'posX' | 'posY'
                                                          >
                                                      >
                                                  >;
                                                  finalizeAnalyses?: Types.Maybe<
                                                      Array<
                                                          { __typename?: 'ReflexFinalizeAnalysisType' } & Pick<
                                                              Types.ReflexFinalizeAnalysisType,
                                                              'uid' | 'analysisUid' | 'value' | 'posX' | 'posY'
                                                          >
                                                      >
                                                  >;
                                              }
                                      >
                                  >;
                              }
                      >
                  >;
              });
};

export const AddReflexRuleDocument = gql`
    mutation AddReflexRule($payload: ReflexRuleInput!) {
        createReflexRule(payload: $payload) {
            __typename
            ... on ReflexRuleType {
                uid
                name
                description
                createdByUid
                createdAt
            }
            ... on OperationError {
                error
                suggestion
            }
        }
    }
`;

export function useAddReflexRuleMutation() {
    return Urql.useMutation<AddReflexRuleMutation, AddReflexRuleMutationVariables>(AddReflexRuleDocument);
}
export const EditReflexRuleDocument = gql`
    mutation EditReflexRule($uid: String!, $payload: ReflexRuleInput!) {
        updateReflexRule(uid: $uid, payload: $payload) {
            __typename
            ... on ReflexRuleType {
                uid
                name
                description
                isActive
                createdByUid
                createdAt
            }
            ... on OperationError {
                error
                suggestion
            }
        }
    }
`;

export function useEditReflexRuleMutation() {
    return Urql.useMutation<EditReflexRuleMutation, EditReflexRuleMutationVariables>(EditReflexRuleDocument);
}
export const CreateReflexDecisionDocument = gql`
    mutation createReflexDecision($payload: ReflexDecisionInput!) {
        createReflexDecision(payload: $payload) {
            ... on ReflexDecisionType {
                uid
                reflexTriggerUid
                description
                priority
                ruleGroups {
                    uid
                    description
                    priority
                    rules {
                        uid
                        analysisUid
                        operator
                        value
                        priority
                    }
                }
                addAnalyses {
                    uid
                    analysisUid
                    count
                }
                finalizeAnalyses {
                    uid
                    analysisUid
                    value
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

export function useCreateReflexDecisionMutation() {
    return Urql.useMutation<CreateReflexDecisionMutation, CreateReflexDecisionMutationVariables>(CreateReflexDecisionDocument);
}
export const UpdateReflexDecisionDocument = gql`
    mutation updateReflexDecision($uid: String!, $payload: ReflexDecisionInput!) {
        updateReflexDecision(uid: $uid, payload: $payload) {
            ... on ReflexDecisionType {
                uid
                reflexTriggerUid
                description
                priority
                ruleGroups {
                    uid
                    description
                    priority
                    rules {
                        uid
                        analysisUid
                        operator
                        value
                        priority
                    }
                }
                addAnalyses {
                    uid
                    analysisUid
                    count
                }
                finalizeAnalyses {
                    uid
                    analysisUid
                    value
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

export function useUpdateReflexDecisionMutation() {
    return Urql.useMutation<UpdateReflexDecisionMutation, UpdateReflexDecisionMutationVariables>(UpdateReflexDecisionDocument);
}
export const CreateReflexTriggerDocument = gql`
    mutation createReflexTrigger($payload: ReflexTriggerInput!) {
        createReflexTrigger(payload: $payload) {
            ... on ReflexTriggerType {
                uid
                reflexRuleUid
                level
                description
                sampleTypeUid
                posX
                posY
                analyses {
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

export function useCreateReflexTriggerMutation() {
    return Urql.useMutation<CreateReflexTriggerMutation, CreateReflexTriggerMutationVariables>(CreateReflexTriggerDocument);
}
export const UpdateReflexTriggerDocument = gql`
    mutation updateReflexTrigger($uid: String!, $payload: ReflexTriggerInput!) {
        updateReflexTrigger(uid: $uid, payload: $payload) {
            ... on ReflexTriggerType {
                uid
                reflexRuleUid
                level
                description
                sampleTypeUid
                analyses {
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

export function useUpdateReflexTriggerMutation() {
    return Urql.useMutation<UpdateReflexTriggerMutation, UpdateReflexTriggerMutationVariables>(UpdateReflexTriggerDocument);
}
export const DeleteReflexTriggerDocument = gql`
    mutation deleteReflexTrigger($uid: String!) {
        deleteReflexTrigger(uid: $uid) {
            ... on DeletedItem {
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

export function useDeleteReflexTriggerMutation() {
    return Urql.useMutation<DeleteReflexTriggerMutation, DeleteReflexTriggerMutationVariables>(DeleteReflexTriggerDocument);
}
export const DeleteReflexDecisionDocument = gql`
    mutation deleteReflexDecision($uid: String!) {
        deleteReflexDecision(uid: $uid) {
            ... on DeletedItem {
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

export function useDeleteReflexDecisionMutation() {
    return Urql.useMutation<DeleteReflexDecisionMutation, DeleteReflexDecisionMutationVariables>(DeleteReflexDecisionDocument);
}
export const SaveReflexRuleGraphDocument = gql`
    mutation saveReflexRuleGraph($uid: String!, $graph: ReflexRuleGraphInput!) {
        saveReflexRuleGraph(uid: $uid, graph: $graph) {
            ... on ReflexRuleType {
                uid
                name
                description
                isActive
                priority
                reflexTriggers {
                    uid
                    level
                    description
                    posX
                    posY
                    analyses {
                        uid
                        name
                    }
                    decisions {
                        uid
                        description
                        priority
                        posX
                        posY
                        ruleGroups {
                            uid
                            description
                            priority
                            posX
                            posY
                            rules {
                                uid
                                analysisUid
                                operator
                                value
                                priority
                            }
                        }
                        addAnalyses {
                            uid
                            analysisUid
                            count
                            posX
                            posY
                        }
                        finalizeAnalyses {
                            uid
                            analysisUid
                            value
                            posX
                            posY
                        }
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

export function useSaveReflexRuleGraphMutation() {
    return Urql.useMutation<SaveReflexRuleGraphMutation, SaveReflexRuleGraphMutationVariables>(SaveReflexRuleGraphDocument);
}
