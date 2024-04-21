import{d as pe,W as me,ab as ve,s as ye,ah as he,u as be,C as R,D as B,r as A,ak as o,al as M,as as k,aK as ke,o as Ce,c as _e,b as i,e as u,E as c,g as N,G as T,H as Se,f as C,w as d,F as xe,j as ge,_ as Re,k as Ae}from"./index-2a6c9271.js";import{u as we}from"./samples-f733dee1.js";import{h as f,o as p,a as m}from"./constants-b0c30fb3.js";const Le={class:"mb-4 flex justify-start"},Ee=i("hr",null,null,-1),Pe=pe({__name:"SampleListing",setup(Be){const D=ge(()=>Re(()=>import("./DataTable-ef278be7.js"),["assets/DataTable-ef278be7.js","assets/index-2a6c9271.js","assets/index-88806377.css"])),v=me(),w=ve(),{samplePageInfo:L,fetchingSamples:I}=ye(v);let E=he(),P=be();const s=R({barcodes:!1,can_cancel:!1,can_receive:!1,can_reinstate:!1,can_reject:!1,can_copy_to:!1,can_download:!1,can_print:!1,can_publish:!1,can_store:!1,can_recover:!1}),b=B(()=>v.getSamples),q=A([{name:"All",value:""},{name:"Expected",value:"expected"},{name:"Received",value:"received"},{name:"Awaiting",value:"awaiting"},{name:"Approved",value:"approved"},{name:"Published",value:"published"},{name:"Invalidated",value:"invalidated"},{name:"Cancelled",value:"cancelled"},{name:"Rejected",value:"rejected"},{name:"Stored",value:"stored"},{name:"Referred",value:"referred"},{name:"Paired",value:"paired"}]),j=A([{name:"UID",value:"uid",sortable:!0,sortBy:"asc",defaultSort:!0,showInToggler:!1,hidden:!0},{name:"",value:"",sortable:!1,showInToggler:!1,hidden:!1,customRender:function(e,t){return o("div",[e.priority>1?o("span",{class:[{"text-orange-600":e.priority>1}]},o("i",{class:"fa fa-star"})):"",e.status==="stored"?o("span",o("i",{class:"fa-briefcase"})):""])}},{name:"Sampe ID",value:"sampleId",sortable:!0,sortBy:"asc",hidden:!1,customRender:function(e,t){return o(M,{to:{name:"sample-detail",params:{patientUid:e?.analysisRequest?.patient?.uid,sampleUid:e?.uid}},innerHTML:e?.sampleId})}},{name:"Sample Type",value:"sampleType.name",sortable:!1,sortBy:"asc",hidden:!0},{name:"Test(s)",value:"",sortable:!1,sortBy:"asc",hidden:!1,customRender:function(e,t){return o("span",{innerHTML:$(e.profiles,e.analyses)},[])}},{name:"Patient",value:"",sortable:!1,sortBy:"asc",hidden:!1,customRender:function(e,t){const a="analysisRequest.patient.firstName".split(".").reduce((r,g)=>r?.[g],e),n="analysisRequest.patient.lastName".split(".").reduce((r,g)=>r?.[g],e);return o("span",{innerHTML:`${a} ${n}`},[])}},{name:"Gender",value:"analysisRequest.patient.gender",sortable:!1,sortBy:"asc",hidden:!0},{name:"Age",value:"analysisRequest.patient.age",sortable:!1,sortBy:"asc",hidden:!0},{name:"Client Patient ID",value:"analysisRequest.patient.clientPatientId",sortable:!1,sortBy:"asc",hidden:!1},{name:"Client",value:"analysisRequest.client.name",sortable:!1,sortBy:"asc",hidden:!1},{name:"Client Code",value:"analysisRequest.client.code",sortable:!1,sortBy:"asc",hidden:!0},{name:"Province",value:"analysisRequest.client.district.province.name",sortable:!1,sortBy:"asc",hidden:!0},{name:"District",value:"analysisRequest.client.district.name",sortable:!1,sortBy:"asc",hidden:!0},{name:"Client Request Id",value:"analysisRequest.clientRequestId",sortable:!1,sortBy:"asc",hidden:!1},{name:"Date Collected",value:"dateCollected",sortable:!1,sortBy:"asc",hidden:!0,customRender:function(e,t){const a=t.value.split(".").reduce((n,r)=>n?.[r],e);return o("span",{innerHTML:k(a)},[])}},{name:"Date Created",value:"createdAt",sortable:!1,sortBy:"asc",hidden:!0,customRender:function(e,t){const a=t.value.split(".").reduce((n,r)=>n?.[r],e);return o("span",{innerHTML:k(a)},[])}},{name:"Creator",value:"createdBy.firstName",sortable:!1,sortBy:"asc",hidden:!1},{name:"Date Received",value:"dateReceived",sortable:!1,sortBy:"asc",hidden:!0,customRender:function(e,t){const a=t.value.split(".").reduce((n,r)=>n?.[r],e);return o("span",{innerHTML:k(a)},[])}},{name:"Date Submitted",value:"dateSubmitted",sortable:!1,sortBy:"asc",hidden:!0,customRender:function(e,t){const a=t.value.split(".").reduce((n,r)=>n?.[r],e);return o("span",{innerHTML:k(a)},[])}},{name:"Date Verified",value:"dateVerified",sortable:!1,sortBy:"asc",hidden:!0,customRender:function(e,t){const a=t.value.split(".").reduce((n,r)=>n?.[r],e);return o("span",{innerHTML:k(a)},[])}},{name:"Date Published",value:"datePublished",sortable:!1,sortBy:"asc",hidden:!0,customRender:function(e,t){const a=t.value.split(".").reduce((n,r)=>n?.[r],e);return o("span",{innerHTML:k(a)},[])}},{name:"Date Printed",value:"datePrinted",sortable:!1,sortBy:"asc",hidden:!0,customRender:function(e,t){const a=t.value.split(".").reduce((n,r)=>n?.[r],e);return o("span",{innerHTML:k(a)},[])}},{name:"Printed",value:"printed",sortable:!1,sortBy:"asc",hidden:!0},{name:"Status",value:"status",sortable:!1,sortBy:"asc",hidden:!1,customRender:function(e,t){const a=t.value.split(".").reduce((n,r)=>n?.[r],e);return o("button",{type:"button",class:"bg-sky-800 text-white py-1 px-2 rounded-sm leading-none",innerHTML:a},[])}}]);E?.query?.clientUid&&v.resetSamples(),v.fetchSampleTypes();let H=R({first:void 0,after:"",text:"",sortBy:["name"]});w.fetchAnalysesServices(H),w.fetchAnalysesProfiles();function $(e,t){let a=[];return e.forEach(n=>a.push(n.name)),t.forEach(n=>a.push(n.name)),a.join(", ")}let l=R({first:50,before:"",status:"received",text:"",sortBy:["-uid"],clientUid:ke(E?.query?.clientUid),filterAction:!1});v.fetchSamples(l);function O(e){l.first=e.fetchCount,l.before=L?.value?.endCursor??"",l.text=e.filterText,l.status=e.filterStatus,l.filterAction=!1,v.fetchSamples(l)}function U(e){l.first=50,l.before="",l.text=e.filterText,l.status=e.filterStatus,l.filterAction=!0,v.fetchSamples(l)}const _=A(!1);function V(e){b.value?.forEach(t=>t.checked=e.checked),_.value=e.checked,x()}function F(e){const t=b.value.findIndex(a=>a.uid===e.uid);b.value[t].checked=e.checked,G()?_.value=!0:_.value=!1,x()}async function h(){b.value?.forEach(e=>e.checked=!1),_.value=!1,x()}function G(){return b.value?.every(e=>e.checked===!0)}function S(){let e=[];return b.value?.forEach(t=>{t.checked&&e.push(t)}),e}function x(){s.can_cancel=!1,s.can_receive=!1,s.can_reinstate=!1,s.can_download=!1,s.can_publish=!1,s.can_print=!1,s.can_reject=!1,s.can_store=!1,s.can_recover=!1,s.can_copy_to=!1,s.barcodes=!1;const e=S();e.length!==0&&(s.barcodes=!0,e.every(t=>t.status==="expected")&&(s.can_receive=!0),e.every(t=>["received","expected"].includes(t.status))&&(s.can_cancel=!0,s.can_reject=!0),e.every(t=>["received"].includes(t.status))&&(s.can_store=!0,s.can_copy_to=!0),e.every(t=>["stored"].includes(t.status))&&(s.can_recover=!0),e.every(t=>t.status==="cancelled")&&(s.can_reinstate=!0),e.every(t=>["approved","published"].includes(t.status))&&(s.can_copy_to=!0),e.every(t=>t.status==="approved")&&(s.can_publish=!0),e.every(t=>t.status==="published")&&(s.can_print=!0,s.can_download=!0))}function y(){const e=S();let t=[];return e?.forEach(a=>t.push(a.uid)),t}const{cancelSamples:J,reInstateSamples:K,receiveSamples:W,printSamples:Z,downloadSamplesImpress:z,publishSamples:Q,recoverSamples:X,cloneSamples:Y,barcodeSamples:ee}=we(),te=B(()=>v.getSamples?.length+" of "+v.getSampleCount+" samples"),ae=async()=>Y(y()).finally(()=>h()),se=async()=>J(y()).finally(()=>h()),ne=async()=>K(y()).finally(()=>h()),re=async()=>W(y()).finally(()=>h()),oe=async()=>{const e=y().map(t=>({uid:t,action:"publish"}));await Q(e).finally(()=>h())},le=async()=>await Z(y()).finally(()=>h()),ie=async()=>await z(y()).finally(()=>h()),ue=async()=>{const e=S();P.push({name:"reject-samples",state:{samples:JSON.stringify(e)}})},ce=async()=>{const e=S();P.push({name:"store-samples",state:{samples:JSON.stringify(e)}})},de=async()=>X(y()).finally(()=>h()),fe=async()=>await ee(y());return(e,t)=>(Ce(),_e(xe,null,[i("div",Le,[u(N(C(M),{to:"/patients/search",class:"px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"},{default:T(()=>[Se("Add Laboratory Request")]),_:1},512),[[c,f(m.CREATE,p.SAMPLE)]])]),Ee,N(C(D),{columns:j.value,data:b.value,toggleColumns:!0,loading:C(I),paginable:!0,pageMeta:{fetchCount:C(l).first,hasNextPage:C(L)?.hasNextPage,countNone:te.value},searchable:!0,filterable:!0,filterMeta:{defaultFilter:C(l).status,filters:q.value},selectable:!0,allChecked:_.value,onOnSearch:U,onOnPaginate:O,onOnCheck:F,onOnCheckAll:V},{footer:T(()=>[i("div",null,[u(i("button",{onClick:t[0]||(t[0]=d(a=>se(),["prevent"])),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Cancel ",512),[[c,f(m.CANCEL,p.SAMPLE)&&s.can_cancel]]),u(i("button",{onClick:t[1]||(t[1]=d(a=>ne(),["prevent"])),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," ReInstate ",512),[[c,f(m.CANCEL,p.SAMPLE)&&s.can_reinstate]]),u(i("button",{onClick:t[2]||(t[2]=d(a=>re(),["prevent"])),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Reveive ",512),[[c,f(m.CANCEL,p.SAMPLE)&&s.can_receive]]),u(i("button",{onClick:t[3]||(t[3]=d(a=>ce(),["prevent"])),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Store ",512),[[c,f(m.CANCEL,p.SAMPLE)&&s.can_store]]),u(i("button",{onClick:t[4]||(t[4]=d(a=>de(),["prevent"])),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Recover ",512),[[c,f(m.CANCEL,p.SAMPLE)&&s.can_recover]]),u(i("button",{onClick:t[5]||(t[5]=d(a=>ue(),["prevent"])),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Reject ",512),[[c,f(m.CANCEL,p.SAMPLE)&&s.can_reject]]),u(i("button",{onClick:t[6]||(t[6]=d(a=>ae(),["prevent"])),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Copy to New ",512),[[c,f(m.CANCEL,p.SAMPLE)&&s.can_copy_to]]),u(i("button",{onClick:t[7]||(t[7]=d(a=>ie(),["prevent"])),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Download ",512),[[c,f(m.CANCEL,p.SAMPLE)&&s.can_download]]),u(i("button",{onClick:t[8]||(t[8]=d(a=>oe(),["prevent"])),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Publish ",512),[[c,f(m.CANCEL,p.SAMPLE)&&s.can_publish]]),u(i("button",{onClick:t[9]||(t[9]=d(a=>le(),["prevent"])),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Print ",512),[[c,f(m.CANCEL,p.SAMPLE)&&s.can_print]]),u(i("button",{onClick:d(fe,["prevent"]),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Print Barcodes ",512),[[c,s.barcodes]])])]),_:1},8,["columns","data","loading","pageMeta","filterMeta","allChecked"])],64))}}),De=Ae(Pe,[["__file","/home/aurthur/Documents/Development/felicity-lims/webapp/views/components/SampleListing.vue"]]);export{De as default};
