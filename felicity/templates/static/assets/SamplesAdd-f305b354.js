import{d as se,X as le,A as ae,as as oe,aB as ne,u as ie,D as r,C as T,r as ce,aC as de,o as n,c as i,b as e,e as d,v as b,f as o,i as m,t as c,g as I,at as x,F as _,p as f,w as D,x as re,j as ue,O as pe,aq as me,aD as _e,_ as fe,k as he}from"./index-03fd00e9.js";import ve from"./vue-multiselect.esm-37364f6f.js";import{c as E,a as N,d as B,e as ye,u as we,b as u}from"./array-55321533.js";/* empty css                                                                 */const be={class:"w-3/6 mt-4 py-4"},xe=e("h5",{class:"mb-4"},"Add Analysis Request",-1),ge={class:""},Ce={class:"flex whitespace-nowrap mb-2 w-full"},Se=e("span",{class:"text-gray-700 w-4/12"},"Client Request ID",-1),Ae={class:"w-full"},ke={class:"text-orange-600 w-4/12"},Ue={class:"flex whitespace-nowrap mb-2 w-full"},Re=e("span",{class:"text-gray-700 w-4/12"},"Clinical Data",-1),Ve={class:"w-full"},De={class:"text-orange-600 w-4/12"},qe={class:"flex whitespace-nowrap mb-2 w-full"},Pe=e("span",{class:"text-gray-700 w-4/12"},"Client",-1),Te={class:"w-full"},Ie={class:"flex whitespace-nowrap mb-2 w-full"},Ee=e("span",{class:"text-gray-700 w-4/12"},"Client Contacts",-1),Ne={class:"w-full"},Be=e("option",{value:""},null,-1),Me=["value"],Fe={class:"text-orange-600 w-4/12"},$e={class:"flex whitespace-nowrap mb-2 w-full"},Le=e("span",{class:"text-gray-700 w-4/12"},"Priority",-1),je={class:"w-full"},Oe={class:"text-orange-600 w-4/12"},Qe={id:"samples"},Xe=e("hr",null,null,-1),Ye={class:"flex justify-between items-center py-2"},ze=e("h5",null,"Samples",-1),Ge={class:"text-orange-600"},He=e("hr",{class:"mb-4"},null,-1),Je={class:"flex items-center justify-between"},Ke={class:"flex items-top gap-x-4"},We={class:"flex flex-col whitespace-nowrap mb-2"},Ze=e("span",{class:"text-gray-700"},"Sample Type",-1),et=["onUpdate:modelValue"],tt=e("option",{value:""},null,-1),st=["value"],lt={class:"flex flex-col whitespace-nowrap mb-2"},at=e("span",{class:"text-gray-700"},"Date Collected",-1),ot=["onUpdate:modelValue"],nt={class:"flex flex-col whitespace-nowrap mb-2"},it=e("span",{class:"text-gray-700"},"Analysis Profiles",-1),ct=["onUpdate:modelValue"],dt=e("option",{value:""},null,-1),rt=["value"],ut={class:"flex flex-col whitespace-nowrap mb-2"},pt=e("span",{class:"text-gray-700"},"Analysis Services",-1),mt=["onUpdate:modelValue"],_t=e("option",{value:""},null,-1),ft=["value"],ht={class:""},vt=["onClick"],yt=e("hr",null,null,-1),wt=e("hr",null,null,-1),bt={key:0,type:"submit",class:"-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"},xt={key:1,class:"py-4 text-center"},gt=se({__name:"SamplesAdd",setup(Ct){const M=ue(()=>fe(()=>import("./FelLoadingMessage-6ca9c805.js"),["assets/FelLoadingMessage-6ca9c805.js","assets/index-03fd00e9.js","assets/index-91994633.css"])),g=le(),F=ae(),h=oe(),v=ne(),$=ie(),{withClientMutation:L}=pe(),{swalError:q}=me();let C=r(()=>F.getPatient),j=T({first:void 0,after:"",text:"",sortBy:["name"]});v.fetchClients(j);const O=r(()=>v.getClients);function Q(a){_e(a)&&v.fetchClientContacts(a?.uid)}const X=r(()=>v.getClientContacts);g.fetchSampleTypes();const Y=r(()=>g.getSampleTypes);let z=T({first:void 0,after:"",text:"",sortBy:["name"]});h.fetchAnalysesServices(z);const G=r(()=>{const a=h.getAnalysesServicesSimple;let s=new Set;return a.forEach((t,V)=>{t.profiles?.length===0&&s.add(t)}),[...s]});h.fetchAnalysesProfiles();const H=r(()=>h.getAnalysesProfiles),S=ce(!1),J=E({clientRequestId:N().required("Client Request ID is Required"),clinicalData:N().nullable(),client:E().required("Client is Required"),clientContactUid:B().required("Client Contact is Required"),samples:ye().required().min(1,"Add at least 1 sample"),priority:B()}),{handleSubmit:K,errors:p}=we({validationSchema:J,initialValues:{priority:0,client:C?.value?.client,samples:[]}}),{value:A}=u("clientRequestId"),{value:k}=u("clinicalData"),{value:y}=u("client"),{value:U}=u("clientContactUid"),{value:R}=u("priority"),{value:w}=u("samples"),P=K(a=>{S.value=!0;for(let s of a.samples||[]){if(typeof s?.sampleType!="string"){q("Samples must have sample types");return}if(s?.analyses?.length<=0&&s?.profiles?.length<=0){q("Samples must have either profiles/analyses or both");return}}W(a)});function W(a){const s={patientUid:C.value?.uid,clientRequestId:a.clientRequestId,clinicalData:a.clinicalData,clientUid:y?.value?.uid,clientContactUid:a.clientContactUid,samples:a.samples};L(de,{payload:s},"createAnalysisRequest").then(t=>{g.addAnalysisRequest(t),$.push({name:"patient-detail",params:{patientUid:C.value?.uid}})}).finally(()=>{S.value=!1})}function Z(){const a={sampleType:{},dateCollected:"",profiles:[],analyses:[]};w.value.push(a)}function ee(a){w.value.splice(a,1)}return(a,s)=>(n(),i("div",be,[xe,e("form",{action:"post",class:"p-4 mb-8 bg-white",onSubmit:s[6]||(s[6]=D((...t)=>o(P)&&o(P)(...t),["prevent"]))},[e("div",ge,[e("label",Ce,[Se,e("div",Ae,[d(e("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":s[0]||(s[0]=t=>m(A)?A.value=t:null),placeholder:"CRID ..."},null,512),[[b,o(A)]]),e("div",ke,c(o(p).clientRequestId),1)])]),e("label",Ue,[Re,e("div",Ve,[d(e("textarea",{cols:"2",class:"form-input mt-1 w-full","onUpdate:modelValue":s[1]||(s[1]=t=>m(k)?k.value=t:null),placeholder:"Clinical Data ..."},null,512),[[b,o(k)]]),e("div",De,c(o(p).clinicalData),1)])]),e("label",qe,[Pe,e("div",Te,[I(o(ve),{placeholder:"Select a Client",modelValue:o(y),"onUpdate:modelValue":s[2]||(s[2]=t=>m(y)?y.value=t:null),options:O.value,searchable:!0,label:"name","track-by":"uid",onSelect:Q},null,8,["modelValue","options"])])]),e("label",Ie,[Ee,e("div",Ne,[d(e("select",{name:"clientContacts",id:"clientContacts","onUpdate:modelValue":s[3]||(s[3]=t=>m(U)?U.value=t:null),class:"form-input mt-1 block w-full"},[Be,(n(!0),i(_,null,f(X.value,t=>(n(),i("option",{key:t.uid,value:t.uid},c(t.firstName)+" "+c(t.lastName),9,Me))),128))],512),[[x,o(U)]]),e("div",Fe,c(o(p).clientContactUid),1)])]),e("label",$e,[Le,e("div",je,[d(e("input",{type:"number",min:"0",max:"2",class:"form-input mt-1 block w-full","onUpdate:modelValue":s[4]||(s[4]=t=>m(R)?R.value=t:null)},null,512),[[b,o(R)]]),e("div",Oe,c(o(p).priority),1)])])]),e("section",Qe,[Xe,e("div",Ye,[ze,e("span",Ge,c(o(p).samples),1),o(w)?.length!==20?(n(),i("button",{key:0,onClick:s[5]||(s[5]=D(t=>Z(),["prevent"])),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Add Sample ")):re("v-if",!0)]),He,(n(!0),i(_,null,f(o(w),(t,V)=>(n(),i("div",{key:V},[e("div",Je,[e("div",Ke,[e("label",We,[Ze,d(e("select",{name:"sampleTypes",id:"sampleTypes","onUpdate:modelValue":l=>t.sampleType=l,class:"form-input mt-1"},[tt,(n(!0),i(_,null,f(Y.value,l=>(n(),i("option",{key:l.uid,value:l.uid},c(l.name),9,st))),128))],8,et),[[x,t.sampleType]])]),e("label",lt,[at,d(e("input",{type:"datetime-local",class:"form-input mt-1 block w-full","onUpdate:modelValue":l=>t.dateCollected=l},null,8,ot),[[b,t.dateCollected]])]),e("label",nt,[it,d(e("select",{name:"analysisProfiles",id:"analysisProfiles","onUpdate:modelValue":l=>t.profiles=l,class:"form-input mt-1",multiple:""},[dt,(n(!0),i(_,null,f(H.value,(l,te)=>(n(),i("option",{key:l.uid,value:l.uid},c(l.name),9,rt))),128))],8,ct),[[x,t.profiles]])]),e("label",ut,[pt,d(e("select",{name:"analysesServices",id:"analysesServices","onUpdate:modelValue":l=>t.analyses=l,class:"form-input mt-1",multiple:""},[_t,(n(!0),i(_,null,f(G.value,(l,te)=>(n(),i("option",{key:l.uid,value:l.uid},c(l.name),9,ft))),128))],8,mt),[[x,t.analyses]])])]),e("div",ht,[e("button",{onClick:D(l=>ee(V),["prevent"]),class:"px-2 py-1 mr-2 border-orange-600 border text-orange-600rounded-smtransition duration-300 hover:bg-orange-600 hover:text-white focus:outline-none"}," Remove ",8,vt)])]),yt]))),128))]),wt,S.value?(n(),i("div",xt,[I(o(M),{message:"Adding Samples ..."})])):(n(),i("button",bt," Add Sample(s) "))],32)]))}}),Rt=he(gt,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/sample/SamplesAdd.vue"]]);export{Rt as default};
