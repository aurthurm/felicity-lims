import gql from 'graphql-tag';

export const ADD_REFLEX_RULE= gql`
  mutation AddReflexR($payload: ReflexRuleInput!) {
    createReflexRule(payload: $payload){
      ... on ReflexRuleType {
        __typename
        uid
        name
        description
        createdByUid
        createdAt
      }
      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

export const EDIT_REFLEX_RULE = gql`
  mutation editReflexR($uid: Int!, $payload: ReflexRuleInput!){
    updateReflexRule(uid: $uid, payload: $payload){
      ... on ReflexRuleType {
        __typename
        uid
        name
        description
        createdByUid
        createdAt
      }
      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;


export const ADD_REFLEX_ACTION= gql`
  mutation AddReflexA($payload: ReflexActionInput!) {
    createReflexAction(payload: $payload){
      ... on ReflexActionType {
        __typename
        uid
        description
        level
        analyses {
          uid
          name
        }
        reflexRule {
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

export const EDIT_REFLEX_ACTION = gql`
  mutation editReflexA($uid: Int!, $payload: ReflexActionInput!){
    updateReflexAction(uid: $uid, payload: $payload){
      ... on ReflexActionType {
        __typename
        uid
        description
        level
        analyses {
          uid
          name
        }
        reflexRule {
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

export const ADD_REFLEX_BRAIN= gql`
  mutation AddReflexB($payload: ReflexBrainInput!) {
    createReflexBrain(payload: $payload){
      ... on ReflexBrainType {
        __typename
        uid
        reflexActionUid
        description
        analysesValues {
          analysisUid
          analysis {
            uid
            name
          }
          operator
          value
        }
        addNew {
          analysisUid
          analysis {
            uid
            name
          }
          count
        }
        finalise {
          analysisUid
          analysis {
            uid
            name
          }
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

export const EDIT_REFLEX_BRAIN = gql`
  mutation editReflexB($uid: Int!, $payload: ReflexBrainInput!){
    updateReflexBrain(uid: $uid, payload: $payload){
      ... on ReflexBrainType {
        __typename
        uid
        reflexActionUid
        description
        analysesValues {
          analysisUid
          analysis {
            uid
            name
          }
          operator
          value
        }
        addNew {
          analysisUid
          analysis {
            analysisUid
            name
          }
          count
        }
        finalise {
          analysisUid
          analysis {
            uid
            name
          }
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