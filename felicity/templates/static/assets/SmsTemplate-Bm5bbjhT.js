import{k as A,a0 as Q,f as z,t as G,a7 as T,g as J,bi as i,bj as C,a5 as K,ad as X,_ as Y,r as M,c,o as u,a as L,A as e,C as Z,E as R,N as w,P as $,J as b,K as h,L as l,Q as ee,F as y,a2 as E,a9 as N,D as te}from"./index-CNAOKjig.js";const oe=A`
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
    `,re=A`
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
    `,ne=A`
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
    `,ae=A`
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
    `,se=Q({__name:"SmsTemplate",props:{targetType:{type:String,required:!0,default:null},targetUid:{type:String,required:!0,default:null}},setup(U,{expose:o}){o();const{withClientMutation:x,withClientQuery:r}=z(),S=U,{targetType:g,targetUid:m}=G(S);let f=T(!1),v=T(""),t=J({targetType:g.value,targetUid:m.value});const d=T(!0),I=T(!1),V=[{value:i.Normal,label:"Normal Results"},{value:i.BelowNormal,label:"Below Normal (Not Warning)"},{value:i.AboveNormal,label:"Above Normal (Not Warning)"},{value:i.BelowWarning,label:"Below Warning Threshold"},{value:i.AboveWarning,label:"Above Warning Threshold"},{value:i.AnyAbnormal,label:"Any Abnormal Results"},{value:i.AnyWarning,label:"Any Warning Results"},{value:i.AnyResult,label:"Any Result"},{value:i.TextualNormal,label:"Textual Normal Results"},{value:i.TextualWarning,label:"Textual Warning Results"}],W=[{value:C.Patient,label:"Patient"},{value:C.Client,label:"Client"}],P=[{category:"Lab Information",variables:["{lab_name}","{lab_email}","{lab_phone}"]},{category:"Sample Information",variables:["{sample_id}","{client_sample_id}","{date_collected}"]},{category:"Patient Information",variables:["{patient_name}","{patient_id}","{gender}","{client_patient_id}","{age}"]},{category:"Analysis Information",variables:["{analysis_keyword}","{analysis_name}"]},{category:"Result Information",variables:["{result}","{unit}"]},{category:"Client Information",variables:["{client_id}","{client_name}"]},{category:"Other",variables:["Patient identification names (dynamic)"]}],p=T([]);K(()=>S.targetUid,(n,a)=>{k()}),X(()=>{k()});function k(){r(ae,{targetType:g.value,targetUid:m.value},"smsTemplatesByTarget").then(n=>p.value=n||[])}function D(){const n={...t};x(oe,{payload:n},"createSmsTemplate").then(a=>p.value.push(a))}function B(){const n={...t};delete n.uid,delete n.__typename,x(re,{uid:t.uid,payload:n},"updateSmsTemplate").then(a=>{const s=p.value.findIndex(_=>_.uid===t.uid);s!==-1&&(p.value[s]=a)})}function F(n){confirm("Are you sure you want to delete this SMS template?")&&x(ne,{uid:n},"deleteSmsTemplate").then(a=>{const s=p.value.findIndex(_=>_.uid===n);s!==-1&&p.value.splice(s,1)})}function j(n,a={}){d.value=n,f.value=!0,v.value=(n?"CREATE":"EDIT")+" SMS TEMPLATE",n?Object.assign(t,{name:"",template:"",description:"",targetType:g.value,targetUid:m.value,specificationTrigger:i.AnyAbnormal,audience:C.Patient,isActive:!0}):Object.assign(t,{...a,targetType:g.value,targetUid:m.value})}function q(){d.value===!0&&D(),d.value===!1&&B(),f.value=!1}function H(n){typeof t.template!="string"&&(t.template="");const a=document.getElementById("template-input");if(a){const s=a.selectionStart,_=a.selectionEnd;t.template=t.template.substring(0,s)+n+t.template.substring(_),setTimeout(()=>{a.focus(),a.selectionStart=a.selectionEnd=s+n.length},0)}else t.template+=n}const O={withClientMutation:x,withClientQuery:r,props:S,targetType:g,targetUid:m,get showModal(){return f},set showModal(n){f=n},get formTitle(){return v},set formTitle(n){v=n},get form(){return t},set form(n){t=n},formAction:d,showWildcards:I,triggerOptions:V,audienceOptions:W,supportedVariables:P,templates:p,getSmsTemplates:k,addSmsTemplate:D,editSmsTemplate:B,deleteSmsTemplate:F,FormManager:j,saveForm:q,insertVariable:H,triggerLabel:n=>V.find(s=>s.value===n)?.label||n,audienceLabel:n=>W.find(s=>s.value===n)?.label||n};return Object.defineProperty(O,"__isScriptSetup",{enumerable:!1,value:!0}),O}}),le={class:"overflow-x-auto mt-4"},ie={class:"align-middle inline-block min-w-full shadow overflow-hidden bg-card text-card-foreground rounded-lg border border-border"},de={class:"min-w-full"},ue={class:"bg-card"},ce={class:"px-4 py-2 whitespace-no-wrap border-b border-border"},me={class:"text-sm text-foreground"},pe={class:"text-xs text-muted-foreground"},ge={class:"px-4 py-2 whitespace-no-wrap border-b border-border"},fe={class:"text-sm text-foreground"},be={class:"px-4 py-2 whitespace-no-wrap border-b border-border"},ye={class:"text-sm text-foreground"},xe={class:"px-4 py-2 border-b border-border"},ve={class:"text-sm text-foreground max-w-xs"},_e={class:"px-4 py-2 whitespace-no-wrap border-b border-border"},Te={class:"px-4 py-2 whitespace-no-wrap text-right border-b border-border"},he=["onClick"],Se=["onClick"],we={class:"text-lg font-bold text-foreground"},Ae={action:"post",class:"p-6 space-y-6"},ke={class:"space-y-4"},Ce={class:"grid grid-cols-2 gap-4"},Me={class:"space-y-2"},Ee={class:"space-y-2"},Ne={class:"grid grid-cols-3 gap-4"},Ue={class:"space-y-2"},Ie=["value"],Ve={class:"space-y-2"},We=["value"],De={class:"space-y-2"},Be={class:"space-y-2"},Oe={class:"flex justify-between items-center"},Le={key:0,class:"border border-border rounded-lg p-4 bg-accent/5"},Re={class:"grid grid-cols-2 gap-4"},Pe={class:"text-xs font-medium text-muted-foreground uppercase"},Fe={class:"flex flex-wrap gap-1"},je=["onClick"],qe={class:"pt-4 flex gap-2"};function He(U,o,x,r,S,g){const m=M("fel-button"),f=M("fel-heading"),v=M("fel-modal");return u(),c(b,null,[L(f,{title:"SMS Templates"},{default:w(()=>[L(m,{onClick:o[0]||(o[0]=t=>r.FormManager(!0))},{default:w(()=>[...o[11]||(o[11]=[$("Add SMS Template",-1)])]),_:1})]),_:1}),e("div",le,[e("div",ie,[e("table",de,[o[12]||(o[12]=e("thead",null,[e("tr",null,[e("th",{class:"px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground"},"Name"),e("th",{class:"px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground"},"Specification Trigger"),e("th",{class:"px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground"},"Audience"),e("th",{class:"px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground"},"Template"),e("th",{class:"px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground"},"Status"),e("th",{class:"px-4 py-2 border-b border-border"})])],-1)),e("tbody",ue,[(u(!0),c(b,null,h(r.templates,t=>(u(),c("tr",{key:t?.uid,class:"hover:bg-accent/50"},[e("td",ce,[e("div",me,l(t.name),1),e("div",pe,l(t.description),1)]),e("td",ge,[e("div",fe,l(r.triggerLabel(t.specificationTrigger||"")),1)]),e("td",be,[e("div",ye,l(r.audienceLabel(t.audience||"")),1)]),e("td",xe,[e("div",ve,l(t.template),1)]),e("td",_e,[e("span",{class:ee([t.isActive?"bg-green-100 text-green-800":"bg-red-100 text-red-800","px-2 py-1 text-xs font-medium rounded-full"])},l(t.isActive?"Active":"Inactive"),3)]),e("td",Te,[e("button",{onClick:d=>r.FormManager(!1,t),class:"px-2 py-1 mr-2 border border-border bg-background text-foreground transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring hover:bg-accent hover:text-accent-foreground"},"Edit",8,he),e("button",{onClick:d=>r.deleteSmsTemplate(t.uid),class:"px-2 py-1 border border-red-500 bg-background text-red-600 transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring hover:bg-red-50"},"Delete",8,Se)])]))),128))])])])]),r.showModal?(u(),Z(v,{key:0,onClose:o[10]||(o[10]=t=>r.showModal=!1),contentWidth:"w-3/4"},{header:w(()=>[e("h3",we,l(r.formTitle),1)]),body:w(()=>[e("form",Ae,[e("div",ke,[e("div",Ce,[e("label",Me,[o[13]||(o[13]=e("span",{class:"text-sm font-medium text-muted-foreground"},"Template Name",-1)),y(e("input",{type:"text",class:"w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring","onUpdate:modelValue":o[1]||(o[1]=t=>r.form.name=t),placeholder:"Enter template name..."},null,512),[[E,r.form.name]])]),e("label",Ee,[o[14]||(o[14]=e("span",{class:"text-sm font-medium text-muted-foreground"},"Description",-1)),y(e("input",{type:"text",class:"w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring","onUpdate:modelValue":o[2]||(o[2]=t=>r.form.description=t),placeholder:"Enter description..."},null,512),[[E,r.form.description]])])]),e("div",Ne,[e("label",Ue,[o[15]||(o[15]=e("span",{class:"text-sm font-medium text-muted-foreground"},"Trigger Condition",-1)),y(e("select",{class:"w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring","onUpdate:modelValue":o[3]||(o[3]=t=>r.form.specificationTrigger=t)},[(u(),c(b,null,h(r.triggerOptions,t=>e("option",{key:t.value,value:t.value},l(t.label),9,Ie)),64))],512),[[N,r.form.specificationTrigger]])]),e("label",Ve,[o[16]||(o[16]=e("span",{class:"text-sm font-medium text-muted-foreground"},"Audience",-1)),y(e("select",{class:"w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring","onUpdate:modelValue":o[4]||(o[4]=t=>r.form.audience=t)},[(u(),c(b,null,h(r.audienceOptions,t=>e("option",{key:t.value,value:t.value},l(t.label),9,We)),64))],512),[[N,r.form.audience]])]),e("label",De,[o[18]||(o[18]=e("span",{class:"text-sm font-medium text-muted-foreground"},"Status",-1)),y(e("select",{class:"w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring","onUpdate:modelValue":o[5]||(o[5]=t=>r.form.isActive=t)},[...o[17]||(o[17]=[e("option",{value:!0},"Active",-1),e("option",{value:!1},"Inactive",-1)])],512),[[N,r.form.isActive]])])]),e("div",Be,[e("div",Oe,[o[19]||(o[19]=e("span",{class:"text-sm font-medium text-muted-foreground"},"SMS Template",-1)),e("button",{type:"button",onClick:o[6]||(o[6]=t=>r.showWildcards=!r.showWildcards),class:"text-xs text-primary hover:text-primary/80"},l(r.showWildcards?"Hide":"Show")+" Available Variables ",1)]),y(e("textarea",{id:"template-input",class:"w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]","onUpdate:modelValue":o[7]||(o[7]=t=>r.form.template=t),placeholder:"Enter SMS template with variables e.g., Hello {patient_name}, your {analysis_name} result is {result}..."},null,512),[[E,r.form.template]])]),r.showWildcards?(u(),c("div",Le,[o[20]||(o[20]=e("h4",{class:"text-sm font-medium text-foreground mb-3"},"Available Variables:",-1)),e("div",Re,[(u(),c(b,null,h(r.supportedVariables,t=>e("div",{key:t.category,class:"space-y-1"},[e("h5",Pe,l(t.category),1),e("div",Fe,[(u(!0),c(b,null,h(t.variables,d=>(u(),c("button",{key:d,type:"button",onClick:I=>r.insertVariable(d),class:"text-xs px-2 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded border border-primary/20 transition-colors duration-200"},l(d),9,je))),128))])])),64))])])):R("",!0)]),e("div",qe,[e("button",{type:"button",onClick:o[8]||(o[8]=te(t=>r.saveForm(),["prevent"])),class:"flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring"}," Save Template "),e("button",{type:"button",onClick:o[9]||(o[9]=t=>r.showModal=!1),class:"px-4 py-2 border border-border bg-background text-foreground transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring hover:bg-accent hover:text-accent-foreground"}," Cancel ")])])]),_:1})):R("",!0)],64)}const Je=Y(se,[["render",He],["__scopeId","data-v-ea0c084b"],["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/admin/analyses/services/SmsTemplate.vue"]]);export{Je as default};
