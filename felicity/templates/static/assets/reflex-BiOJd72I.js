import{k as d,d as B,f as O}from"./index-v7Q387fb.js";const G=d`
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
    `,I=d`
    query getReflexRuleByUid($uid: String!) {
  reflexRuleByUid(uid: $uid) {
    uid
    name
    description
    isActive
    priority
    reflexTriggers {
      uid
      level
      description
      sampleTypeUid
      sampleType {
        uid
        name
      }
      analyses {
        uid
        name
        resultOptions {
          optionKey
          value
        }
      }
      decisions {
        uid
        description
        priority
        ruleGroups {
          uid
          description
          priority
          rules {
            uid
            analysisUid
            analysis {
              uid
              name
              resultOptions {
                optionKey
                value
              }
            }
            operator
            value
            priority
          }
        }
        addAnalyses {
          uid
          analysisUid
          analysis {
            uid
            name
          }
          count
        }
        finalizeAnalyses {
          uid
          analysisUid
          analysis {
            uid
            name
          }
          value
        }
      }
    }
    createdBy {
      uid
      firstName
      lastName
    }
    createdAt
    updatedBy {
      uid
      firstName
      lastName
    }
    updatedAt
  }
}
    `;d`
    query getAllReflexTriggers($reflexRuleUid: String) {
  reflexTriggerAll(reflexRuleUid: $reflexRuleUid) {
    uid
    reflexRuleUid
    level
    description
    sampleTypeUid
    analyses {
      uid
      name
    }
    decisions {
      uid
      description
      priority
    }
  }
}
    `;const Y=d`
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
    `,N=d`
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
    `,S=d`
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
    `,b=d`
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
    `,C=d`
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
    `;d`
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
    `;d`
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
    `;d`
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
    `;const z=d`
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
    `,{withClientQuery:E,withClientMutation:R}=O(),P=B("reflex",{state:()=>({reflexRules:[],fetchingReflexRules:!1,reflexRule:void 0,fetchingReflexRule:!1,draft:void 0,validationErrors:[],validationWarnings:[]}),getters:{getReflexRules:e=>e.reflexRules,getReflexRule:e=>e.reflexRule,getDraft:e=>e.draft,getValidationErrors:e=>e.validationErrors,getValidationWarnings:e=>e.validationWarnings,isValid:e=>e.validationErrors.length===0},actions:{async fetchAllReflexRules(){try{this.fetchingReflexRules=!0;const e=await E(G,{},"reflexRuleAll");e&&typeof e=="object"&&"items"in e?this.reflexRules=e.items:console.error("Invalid reflex rules data received:",e)}catch(e){console.error("Error fetching reflex rules:",e)}finally{this.fetchingReflexRules=!1}},async fetchReflexRuleByUid(e){if(!e){console.error("Invalid uid provided to fetchReflexRuleByUid");return}try{this.fetchingReflexRule=!0;const r=await E(I,{uid:e},"reflexRuleByUid");r&&typeof r=="object"?this.reflexRule=r:console.error("Invalid reflex rule data received:",r)}catch(r){console.error("Error fetching reflex rule:",r)}finally{this.fetchingReflexRule=!1}},async createReflexTrigger(e){try{const r=await R(C,{payload:e});if(r&&r.__typename==="ReflexTriggerType")return this.reflexRule&&(this.reflexRule.reflexTriggers||(this.reflexRule.reflexTriggers=[]),this.reflexRule.reflexTriggers.push(r)),r;if(r&&r.__typename==="OperationError")return console.error("Error creating trigger:",r.error),r}catch(r){throw console.error("Error creating reflex trigger:",r),r}},async createReflexDecision(e){try{const r=await R(S,{payload:e});if(r&&r.__typename==="ReflexDecisionType"){if(this.reflexRule){const i=this.reflexRule.reflexTriggers?.find(o=>o.uid===e.reflex_trigger_uid);i&&(i.decisions||(i.decisions=[]),i.decisions.push(r))}return r}else if(r&&r.__typename==="OperationError")return console.error("Error creating decision:",r.error),r}catch(r){throw console.error("Error creating reflex decision:",r),r}},async updateReflexDecision(e,r){try{const i=await R(b,{uid:e,payload:r});if(i&&i.__typename==="ReflexDecisionType")return this.reflexRule&&this.reflexRule.reflexTriggers?.forEach(o=>{const c=o.decisions?.findIndex(p=>p.uid===e);c!==void 0&&c>-1&&(o.decisions[c]=i)}),i;if(i&&i.__typename==="OperationError")return console.error("Error updating decision:",i.error),i}catch(i){throw console.error("Error updating reflex decision:",i),i}},async saveReflexRuleGraph(e,r){try{const i=this.convertGraphToPayload(e,r),o=[];for(const c of i.triggers){let p;c.uid||(p=await this.createReflexTrigger(c));for(const u of c.decisions||[]){let s;u.uid?s=await this.updateReflexDecision(u.uid,u):s=await this.createReflexDecision(u),o.push(s)}}return{success:!0,results:o}}catch(i){return console.error("Error saving reflex rule graph:",i),{success:!1,error:i}}},convertGraphToPayload(e,r){const{nodes:i,edges:o}=r,c=i.filter(t=>t.type==="trigger"),p=i.filter(t=>t.type==="decision"),u=i.filter(t=>t.type==="rule"),s=i.filter(t=>t.type==="action"),D=new Map(u.map(t=>[t.id,t])),T=new Map(s.map(t=>[t.id,t])),w=o.filter(t=>i.find(n=>n.id===t.source&&n.type==="rule")&&i.find(n=>n.id===t.target&&n.type==="rule")),m=new Map;w.forEach(t=>{const n=m.get(t.source)??[];n.push(t.target),m.set(t.source,n)});const U=t=>{const n=[],x=(l,_)=>{if(_.includes(l))return;const h=[..._,l],g=m.get(l)??[];if(g.length===0){n.push(h);return}g.forEach(v=>x(v,h))};return x(t,[]),n.length>0?n:[[t]]};return{triggers:c.map(t=>{const n=o.filter(l=>l.source===t.id).map(l=>l.target),x=p.filter(l=>n.includes(l.id)).map(l=>{const h=o.filter(a=>a.source===l.id&&i.find(y=>y.id===a.target&&y.type==="rule")).map(a=>a.target).flatMap(a=>U(a).map(A=>({description:l.data.description||"Rule group",priority:0,rules:A.map(f=>D.get(f)).filter(f=>!!f).map(f=>({analysis_uid:f.data.analysis_uid,operator:f.data.operator,value:f.data.value,priority:f.data.priority||0}))}))),g=new Set(o.filter(a=>a.source===l.id&&i.find(y=>y.id===a.target&&y.type==="action")).map(a=>a.target)),v=Array.from(g).map(a=>T.get(a)).filter(a=>!!a&&a.data.actionType==="add").map(a=>({analysis_uid:a.data.analysis_uid,count:a.data.count||1})),$=Array.from(g).map(a=>T.get(a)).filter(a=>!!a&&a.data.actionType==="finalize").map(a=>({analysis_uid:a.data.analysis_uid,value:a.data.value}));return{uid:l.data.uid,reflex_trigger_uid:t.data.uid||t.id,description:l.data.description,priority:l.data.priority,rule_groups:h,add_analyses:v,finalize_analyses:$}});return{uid:t.data.uid,reflex_rule_uid:e,level:t.data.level,description:t.data.description,sample_type_uid:t.data.sample_type_uid,analyses:t.data.analyses?.map(l=>l.uid)||[],decisions:x}})}},saveDraft(e){this.draft=e},clearDraft(){this.draft=void 0},setValidation(e,r){this.validationErrors=e,this.validationWarnings=r},clearValidation(){this.validationErrors=[],this.validationWarnings=[]},async saveReflexRule(e,r,i){console.log("saveReflexRule called with:",{ruleUid:e,nodeCount:r.length,edgeCount:i.length});try{const o=r.map(s=>({id:s.id,type:s.type,positionX:s.position.x,positionY:s.position.y,data:s.data||{}})),c=i.map(s=>({source:s.source,target:s.target,sourceHandle:s.sourceHandle||null,targetHandle:s.targetHandle||null})),p={nodes:o,edges:c};console.log("Calling saveReflexRuleGraph mutation with:",{ruleUid:e,graph:p});const u=await R(z,{uid:e,graph:p});if(u&&u.__typename==="ReflexRuleType")await this.fetchReflexRuleByUid(e),console.log("Rule graph saved successfully");else if(u&&u.__typename==="OperationError")throw console.error("Error saving rule graph:",u.error),new Error(u.error)}catch(o){throw console.error("Error saving reflex rule:",o),o}},async togglePublish(e,r){console.log("togglePublish called with:",{ruleUid:e,isActive:r});try{const i=this.getReflexRule;if(!i)throw new Error("Rule not loaded. Cannot toggle publish status.");const o=await R(N,{uid:e,payload:{name:i.name,description:i.description||"",is_active:r}});if(o&&o.__typename==="ReflexRuleType")await this.fetchReflexRuleByUid(e),console.log(`Rule ${r?"published":"unpublished"} successfully`);else if(o&&o.__typename==="OperationError")throw console.error("Error toggling publish status:",o.error),new Error(o.error)}catch(i){throw console.error("Error toggling publish status:",i),i}}}});export{Y as A,N as E,P as u};
