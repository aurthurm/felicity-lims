import{k as u,d as O,f as G}from"./index-DCVfsbos.js";const B=u`
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
    `,N=u`
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
      posX
      posY
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
          posX
          posY
        }
        finalizeAnalyses {
          uid
          analysisUid
          analysis {
            uid
            name
          }
          value
          posX
          posY
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
    `;u`
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
    `;const b=u`
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
    `,S=u`
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
    `,X=u`
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
    `,Y=u`
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
    `,I=u`
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
    `;u`
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
    `;u`
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
    `;u`
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
    `;const z=u`
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
    `,{withClientQuery:U,withClientMutation:g}=G(),P=O("reflex",{state:()=>({reflexRules:[],fetchingReflexRules:!1,reflexRule:void 0,fetchingReflexRule:!1,draft:void 0,validationErrors:[],validationWarnings:[]}),getters:{getReflexRules:e=>e.reflexRules,getReflexRule:e=>e.reflexRule,getDraft:e=>e.draft,getValidationErrors:e=>e.validationErrors,getValidationWarnings:e=>e.validationWarnings,isValid:e=>e.validationErrors.length===0},actions:{async fetchAllReflexRules(){try{this.fetchingReflexRules=!0;const e=await U(B,{},"reflexRuleAll");e&&typeof e=="object"&&"items"in e&&(this.reflexRules=e.items)}catch{}finally{this.fetchingReflexRules=!1}},async fetchReflexRuleByUid(e){if(e)try{this.fetchingReflexRule=!0;const i=await U(N,{uid:e},"reflexRuleByUid");i&&typeof i=="object"&&(this.reflexRule=i)}catch{}finally{this.fetchingReflexRule=!1}},async createReflexTrigger(e){try{const i=await g(I,{payload:e});if(i&&i.__typename==="ReflexTriggerType")return this.reflexRule&&(this.reflexRule.reflexTriggers||(this.reflexRule.reflexTriggers=[]),this.reflexRule.reflexTriggers.push(i)),i;if(i&&i.__typename==="OperationError")return i}catch(i){throw i}},async createReflexDecision(e){try{const i=await g(X,{payload:e});if(i&&i.__typename==="ReflexDecisionType"){if(this.reflexRule){const t=this.reflexRule.reflexTriggers?.find(s=>s.uid===e.reflex_trigger_uid);t&&(t.decisions||(t.decisions=[]),t.decisions.push(i))}return i}else if(i&&i.__typename==="OperationError")return i}catch(i){throw i}},async updateReflexDecision(e,i){try{const t=await g(Y,{uid:e,payload:i});if(t&&t.__typename==="ReflexDecisionType")return this.reflexRule&&this.reflexRule.reflexTriggers?.forEach(s=>{const p=s.decisions?.findIndex(f=>f.uid===e);p!==void 0&&p>-1&&(s.decisions[p]=t)}),t;if(t&&t.__typename==="OperationError")return t}catch(t){throw t}},async saveReflexRuleGraph(e,i){try{const t=this.convertGraphToPayload(e,i),s=[];for(const p of t.triggers){let f;p.uid||(f=await this.createReflexTrigger(p));for(const n of p.decisions||[]){let o;n.uid?o=await this.updateReflexDecision(n.uid,n):o=await this.createReflexDecision(n),s.push(o)}}return{success:!0,results:s}}catch(t){return{success:!1,error:t}}},convertGraphToPayload(e,i){const{nodes:t,edges:s}=i,p=t.filter(r=>r.type==="trigger"),f=t.filter(r=>r.type==="decision"),n=t.filter(r=>r.type==="rule"),o=t.filter(r=>r.type==="action"),x=new Map(n.map(r=>[r.id,r])),D=new Map(o.map(r=>[r.id,r])),A=s.filter(r=>t.find(d=>d.id===r.source&&d.type==="rule")&&t.find(d=>d.id===r.target&&d.type==="rule")),_=new Map;A.forEach(r=>{const d=_.get(r.source)??[];d.push(r.target),_.set(r.source,d)});const E=r=>{const d=[],m=(l,v)=>{if(v.includes(l))return;const h=[...v,l],R=_.get(l)??[];if(R.length===0){d.push(h);return}R.forEach(T=>m(T,h))};return m(r,[]),d.length>0?d:[[r]]};return{triggers:p.map(r=>{const d=s.filter(l=>l.source===r.id).map(l=>l.target),m=f.filter(l=>d.includes(l.id)).map(l=>{const h=s.filter(a=>a.source===l.id&&t.find(y=>y.id===a.target&&y.type==="rule")).map(a=>a.target).flatMap(a=>E(a).map(w=>({description:l.data.description||"Rule group",priority:0,rules:w.map(c=>x.get(c)).filter(c=>!!c).map(c=>({analysis_uid:c.data.analysis_uid,operator:c.data.operator,value:c.data.value,priority:c.data.priority||0}))}))),R=new Set(s.filter(a=>a.source===l.id&&t.find(y=>y.id===a.target&&y.type==="action")).map(a=>a.target)),T=Array.from(R).map(a=>D.get(a)).filter(a=>!!a&&a.data.actionType==="add").map(a=>({analysis_uid:a.data.analysis_uid,count:a.data.count||1})),$=Array.from(R).map(a=>D.get(a)).filter(a=>!!a&&a.data.actionType==="finalize").map(a=>({analysis_uid:a.data.analysis_uid,value:a.data.value}));return{uid:l.data.uid,reflex_trigger_uid:r.data.uid||r.id,description:l.data.description,priority:l.data.priority,rule_groups:h,add_analyses:T,finalize_analyses:$}});return{uid:r.data.uid,reflex_rule_uid:e,level:r.data.level,description:r.data.description,sample_type_uid:r.data.sample_type_uid,analyses:r.data.analyses?.map(l=>l.uid)||[],decisions:m}})}},saveDraft(e){this.draft=e},clearDraft(){this.draft=void 0},setValidation(e,i){this.validationErrors=e,this.validationWarnings=i},clearValidation(){this.validationErrors=[],this.validationWarnings=[]},async saveReflexRule(e,i,t){try{const s=i.map(o=>{const x=o.position??o.computedPosition??{x:0,y:0};return{id:o.id,type:o.type,positionX:x.x,positionY:x.y,data:o.data||{}}}),p=t.map(o=>({source:o.source,target:o.target,sourceHandle:o.sourceHandle||null,targetHandle:o.targetHandle||null})),n=await g(z,{uid:e,graph:{nodes:s,edges:p}},"saveReflexRuleGraph");if(n&&n.__typename==="ReflexRuleType")return this.reflexRule=n,n;if(n&&n.__typename==="OperationError")throw new Error(n.error)}catch(s){throw s}},async togglePublish(e,i){try{const t=this.getReflexRule;if(!t)throw new Error("Rule not loaded. Cannot toggle publish status.");const s=await g(S,{uid:e,payload:{name:t.name,description:t.description||"",is_active:i}});if(s&&s.__typename==="ReflexRuleType")await this.fetchReflexRuleByUid(e);else if(s&&s.__typename==="OperationError")throw new Error(s.error)}catch(t){throw t}}}});export{b as A,S as E,P as u};
