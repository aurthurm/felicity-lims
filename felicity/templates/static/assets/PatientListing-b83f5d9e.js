import{d as B,A as N,B as k,s as A,r as f,az as l,aA as i,C as I,D as w,o as R,c as D,g as c,f as a,G as m,b as s,e as L,H as E,E as S,F as M,j as h,_ as p,k as H}from"./index-03fd00e9.js";import{h as V,a as F,o as O}from"./constants-0e2456be.js";const U=s("div",{class:"flex content-start items-center"},[s("span",{class:"text-sky-800"},[s("i",{class:"fas fa-info-circle"})]),s("p",{class:"ml-2 italic text-orange-600"}," Click register when you dont find your patient during search* ")],-1),j=s("hr",{class:"my-2"},null,-1),q=B({__name:"PatientListing",setup(G){const g=h(()=>p(()=>import("./FelDataTable-b2e5c7c1.js"),["assets/FelDataTable-b2e5c7c1.js","assets/index-03fd00e9.js","assets/index-91994633.css"])),_=h(()=>p(()=>import("./FelPageHeading-f1b46a01.js"),["assets/FelPageHeading-f1b46a01.js","assets/index-03fd00e9.js","assets/index-91994633.css"]));let n=N(),v=k();const{patients:u,fetchingPatients:b,patientPageInfo:r}=A(n),P=f([{name:"UID",value:"uid",sortable:!0,sortBy:"asc",defaultSort:!0,showInToggler:!1,hidden:!0},{name:"Patient Id",value:"patientId",sortable:!1,sortBy:"asc",hidden:!1,customRender:function(e,o){return l(i,{to:{name:"patient-detail",params:{patientUid:e?.uid}},innerHTML:e?.patientId})}},{name:"Full Name",value:"",sortable:!1,sortBy:"asc",hidden:!1,customRender:function(e,o){return l(i,{to:{name:"patient-detail",params:{patientUid:e?.uid}},innerHTML:T(e)})}},{name:"Age",value:"age",sortable:!1,sortBy:"asc",hidden:!1},{name:"Gender",value:"gender",sortable:!1,sortBy:"asc",hidden:!1},{name:"Client Patient ID",value:"clientPatientId",sortable:!1,sortBy:"asc",hidden:!1},{name:"Province",value:"client.district.province.name",sortable:!1,sortBy:"asc",hidden:!1},{name:"District",value:"client.district.name",sortable:!1,sortBy:"asc",hidden:!1},{name:"Client",value:"client.name",sortable:!1,sortBy:"asc",hidden:!1},{name:"",value:"",sortable:!1,sortBy:"asc",showInToggler:!1,hidden:!1,customRender:function(e,o){return l(i,{to:{name:"samples-add",params:{patientUid:e?.uid}},class:"px-2 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none",innerHTML:"+ Analysis Request"})}}]);v.fetchCountries();let t=I({first:50,before:"",text:"",sortBy:["-uid"],filterAction:!1});n.fetchPatients(t);let d=f("");function y(e){t.first=100,t.before=r?.value?.endCursor??"",t.text=e.filterText,t.filterAction=!0,d.value=e.filterText,n.fetchPatients(t)}const x=w(()=>u?.value?.length+" of "+n.getPatientCount+" patients");function C(e){t.first=e.fetchCount,t.before=r?.value?.endCursor??"",t.text=e.filterText,t.filterAction=!1,n.fetchPatients(t)}let T=e=>e.firstName+" "+e.lastName;return(e,o)=>(R(),D(M,null,[c(a(_),{title:"Patients"}),c(a(g),{columns:P.value,data:a(u),toggleColumns:!0,loading:a(b),paginable:!0,pageMeta:{fetchCount:a(t).first,hasNextPage:a(r)?.hasNextPage,countNone:x.value},searchable:!0,filterable:!1,onOnSearch:y,onOnPaginate:C,selectable:!1},{footer:m(()=>[s("div",null,[U,j,L(c(a(i),{to:{name:"patients-register",query:{cpid:a(d)}},class:"px-4 p-1 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100"},{default:m(()=>[E(" Register New Patiet ")]),_:1},8,["to"]),[[S,V(F.CREATE,O.PATIENT)]])])]),_:1},8,["columns","data","loading","pageMeta"])],64))}}),K=H(q,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/patient/PatientListing.vue"]]);export{K as default};
