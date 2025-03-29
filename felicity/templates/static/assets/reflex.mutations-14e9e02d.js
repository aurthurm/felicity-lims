import{g as n,e as o,d as u}from"./index-66877f9a.js";const d=n`
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
    `,r=n`
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
    `,{withClientQuery:l}=o(),f=u("reflex",{state:()=>({reflexRules:[],fetchingReflexRules:!1,reflexRule:void 0,fetchingReflexRule:!1}),getters:{getReflexRules:e=>e.reflexRules,getReflexRule:e=>e.reflexRule},actions:{async fetchAllReflexRules(){this.fetchingReflexRules=!0,await l(d,{},"reflexRuleAll").then(e=>{this.fetchingReflexRules=!1,this.reflexRules=e.items}).catch(e=>this.fetchingReflexRules=!1)},async fetchReflexRuleByUid(e){this.fetchingReflexRule=!0,await l(r,{uid:e},"reflexRuleByUid").then(i=>{this.fetchingReflexRule=!1,this.reflexRule=i}).catch(i=>this.fetchingReflexRule=!1)},addReflexRule(e){this.reflexRules?.unshift(e)},updateReflexRule(e){const i=this.reflexRules.findIndex(t=>t.uid===e.uid);i>-1&&(this.reflexRules[i]=e)},addReflexAction(e){this.reflexRule?.reflexActions?.push(e)},updateReflexAction(e){const i=this.reflexRule?.reflexActions?.findIndex(t=>t.uid===e.uid)||-1;i>-1&&(this.reflexRule.reflexActions[i]=e)},addReflexBrain(e){const i=this.reflexRule?.reflexActions?.find(t=>t.uid==e.reflexActionUid);i&&i.brains?.push(e)},updateReflexBrain(e){let i=this.reflexRule?.reflexActions?.find(t=>t.uid==e.reflexActionUid);if(i){const t=i?.brains?.findIndex(a=>a.uid===e.uid)||-1;t>-1&&(i.brains[t]=e)}},deleteReflexBrain(e,i){const t=this.reflexRule?.reflexActions?.find(a=>a.uid==e);if(t&&t.brains){const a=t.brains.findIndex(s=>s.uid===i);a>-1&&t.brains.splice(a,1)}}}}),y=n`
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
    `,R=n`
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
    `,c=n`
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
    `,x=n`
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
    `;export{y as A,A as D,R as E,c as a,x as b,m as c,_ as d,f as u};
