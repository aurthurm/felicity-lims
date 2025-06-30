import{g as n,f as o,d as s}from"./index-628f1f8f.js";const u=n`
    query getAllReflexRules {
  reflexRuleAll {
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
}
    `,d=n`
    query getReflexRuleByUid($uid: String!) {
  reflexRuleByUid(uid: $uid) {
    uid
    name
    description
    reflexActions {
      uid
      level
      description
      analyses {
        uid
        name
        __typename
      }
      brains {
        uid
        description
        conditions {
          description
          priority
          criteria {
            analysisUid
            analysis {
              uid
              name
              resultOptions {
                optionKey
                value
                __typename
              }
              __typename
            }
            operator
            value
            __typename
          }
        }
        actions {
          addNew {
            analysisUid
            analysis {
              uid
              name
              resultOptions {
                optionKey
                value
                __typename
              }
              __typename
            }
            count
            __typename
          }
          finalise {
            analysisUid
            analysis {
              name
              resultOptions {
                optionKey
                value
                __typename
              }
              __typename
            }
            value
            __typename
          }
          __typename
        }
        __typename
      }
      createdBy {
        firstName
        lastName
        __typename
      }
      __typename
    }
  }
}
    `,{withClientQuery:r}=o(),c=s("reflex",{state:()=>({reflexRules:[],fetchingReflexRules:!1,reflexRule:void 0,fetchingReflexRule:!1}),getters:{getReflexRules:e=>e.reflexRules,getReflexRule:e=>e.reflexRule},actions:{async fetchAllReflexRules(){try{this.fetchingReflexRules=!0;const e=await r(u,{},"reflexRuleAll");e&&typeof e=="object"&&"items"in e?this.reflexRules=e.items:console.error("Invalid reflex rules data received:",e)}catch(e){console.error("Error fetching reflex rules:",e)}finally{this.fetchingReflexRules=!1}},async fetchReflexRuleByUid(e){if(!e){console.error("Invalid uid provided to fetchReflexRuleByUid");return}try{this.fetchingReflexRule=!0;const i=await r(d,{uid:e},"reflexRuleByUid");i&&typeof i=="object"?this.reflexRule=i:console.error("Invalid reflex rule data received:",i)}catch(i){console.error("Error fetching reflex rule:",i)}finally{this.fetchingReflexRule=!1}},addReflexRule(e){if(!e?.uid){console.error("Invalid reflex rule payload:",e);return}this.reflexRules.unshift(e)},updateReflexRule(e){if(!e?.uid){console.error("Invalid reflex rule payload:",e);return}const i=this.reflexRules.findIndex(l=>l.uid===e.uid);i>-1&&(this.reflexRules[i]=e)},addReflexAction(e){if(!e?.uid||!this.reflexRule){console.error("Invalid reflex action payload or no reflex rule selected:",e);return}this.reflexRule.reflexActions||(this.reflexRule.reflexActions=[]),this.reflexRule.reflexActions.push(e)},updateReflexAction(e){if(!e?.uid||!this.reflexRule?.reflexActions){console.error("Invalid reflex action payload or no reflex rule selected:",e);return}const i=this.reflexRule.reflexActions.findIndex(l=>l.uid===e.uid);i>-1&&(this.reflexRule.reflexActions[i]=e)},addReflexBrain(e){if(!e?.uid||!e?.reflexActionUid||!this.reflexRule?.reflexActions){console.error("Invalid reflex brain payload or no reflex rule selected:",e);return}const i=this.reflexRule.reflexActions.find(l=>l.uid===e.reflexActionUid);i?(i.brains||(i.brains=[]),i.brains.push(e)):console.error(`No reflex action found with uid ${e.reflexActionUid}`)},updateReflexBrain(e){if(!e?.uid||!e?.reflexActionUid||!this.reflexRule?.reflexActions){console.error("Invalid reflex brain payload or no reflex rule selected:",e);return}const i=this.reflexRule.reflexActions.find(l=>l.uid===e.reflexActionUid);if(i&&i.brains){const l=i.brains.findIndex(t=>t.uid===e.uid);l>-1&&(i.brains[l]=e)}else console.error(`No reflex action found with uid ${e.reflexActionUid} or no brains array`)},deleteReflexBrain(e,i){if(!e||!i||!this.reflexRule?.reflexActions){console.error("Invalid parameters for deleteReflexBrain:",{actionUid:e,brainUid:i});return}const l=this.reflexRule.reflexActions.find(t=>t.uid===e);if(l&&l.brains){const t=l.brains.findIndex(a=>a.uid===i);t>-1?l.brains.splice(t,1):console.error(`No reflex brain found with uid ${i}`)}else console.error(`No reflex action found with uid ${e} or no brains array`)}}}),p=n`
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
    `,x=n`
    mutation EditReflexRule($uid: String!, $payload: ReflexRuleInput!) {
  updateReflexRule(uid: $uid, payload: $payload) {
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
    `,y=n`
    mutation AddReflexAction($payload: ReflexActionInput!) {
  createReflexAction(payload: $payload) {
    __typename
    ... on ReflexActionType {
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
      error
      suggestion
    }
  }
}
    `,R=n`
    mutation editReflexAction($uid: String!, $payload: ReflexActionInput!) {
  updateReflexAction(uid: $uid, payload: $payload) {
    __typename
    ... on ReflexActionType {
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
      error
      suggestion
    }
  }
}
    `,m=n`
    mutation AddReflexBrain($payload: ReflexBrainInput!) {
  createReflexBrain(payload: $payload) {
    __typename
    ... on ReflexBrainType {
      uid
      description
      conditions {
        description
        priority
        criteria {
          analysisUid
          analysis {
            uid
            name
            resultOptions {
              optionKey
              value
              __typename
            }
            __typename
          }
          operator
          value
          __typename
        }
      }
      actions {
        addNew {
          analysisUid
          analysis {
            uid
            name
            resultOptions {
              optionKey
              value
              __typename
            }
            __typename
          }
          count
          __typename
        }
        finalise {
          analysisUid
          analysis {
            name
            resultOptions {
              optionKey
              value
              __typename
            }
            __typename
          }
          value
          __typename
        }
        __typename
      }
      __typename
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `,_=n`
    mutation editReflexBrain($uid: String!, $payload: ReflexBrainInput!) {
  updateReflexBrain(uid: $uid, payload: $payload) {
    __typename
    ... on ReflexBrainType {
      uid
      description
      conditions {
        description
        priority
        criteria {
          analysisUid
          analysis {
            uid
            name
            resultOptions {
              optionKey
              value
              __typename
            }
            __typename
          }
          operator
          value
          __typename
        }
      }
      actions {
        addNew {
          analysisUid
          analysis {
            uid
            name
            resultOptions {
              optionKey
              value
              __typename
            }
            __typename
          }
          count
          __typename
        }
        finalise {
          analysisUid
          analysis {
            name
            resultOptions {
              optionKey
              value
              __typename
            }
            __typename
          }
          value
          __typename
        }
        __typename
      }
      __typename
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `,A=n`
    mutation deleteReflexBrain($uid: String!) {
  deleteReflexBrain(uid: $uid) {
    __typename
    ... on DeletedItem {
      uid
    }
  }
}
    `;export{p as A,A as D,x as E,y as a,R as b,m as c,_ as d,c as u};
