import gql from 'graphql-tag'


export const GET_ALL_REFLEX_RULES = gql`
  query getAllReflexRules {
    reflexRuleAll{
      totalCount
      items {
        uid
        name
        description
        createdBy {
          firstName
          lastName
        }
      }
    }
  }`;


export const GET_EFLEX_RULE_BY_UID = gql`
  query getReflexRuleByUid($uid: Int!) {
    reflexRuleByUid(uid: $uid){
      uid
      name
      description
     	reflexActions{
        uid
        level
        description
        analyses {
          uid
          name
        }
        brains{
          description
          analysesValues {
            analysis {
              uid
              name
              resultOptions {
                optionKey
                value
              }
            }
            value
          }
          addNew {
            analysis {
              uid
              name
              resultOptions {
                optionKey
                value
              }
            }
            count
          }
          finalise {
            analysis {
              name
              resultOptions {
                optionKey
                value
              }
            }
            value
          }
        }
        
      }
      createdBy {
        firstName
        lastName
      }
    }
  }`;
