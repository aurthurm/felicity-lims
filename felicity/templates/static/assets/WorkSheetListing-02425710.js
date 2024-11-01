import{d as J,ar as Q,aL as X,s as Y,P as ee,r as b,az as _,aA as te,C as se,aZ as ae,D as C,o as i,c as u,g as E,f as n,b as t,e as c,E as oe,w as R,i as d,G as y,q as ne,F as m,p as g,t as S,at as M,v as re,x as le,j as w,O as ie,_ as x,k as ue}from"./index-467d1dc5.js";import{c as de,d as f,u as ce,b as h}from"./array-67ff21ae.js";import{h as me,o as fe,a as he}from"./constants-090318e0.js";const ve={class:"flex justify-between items-center"},pe=t("h3",null,"Create Worksheet",-1),ke=t("hr",null,null,-1),be={action:"post",class:"p-1"},_e={class:"grid grid-cols-3 gap-x-4 mb-4"},ye={class:"block col-span-1 mb-2"},ge=t("span",{class:"text-gray-700"},"Analyst",-1),Se=["value"],we={class:"block col-span-1 mb-2"},xe=t("span",{class:"text-gray-700"},"Worksheet Template",-1),We=t("option",{value:"undefined"},null,-1),Ae=["value"],Te={class:"block col-span-1 mb-2"},Ue=t("span",{class:"text-gray-700"},"How Many",-1),Ce=t("hr",null,null,-1),Ee=J({__name:"WorkSheetListing",setup(Re){const N=w(()=>x(()=>import("./FelModal-1cd675c6.js"),["assets/FelModal-1cd675c6.js","assets/index-467d1dc5.js","assets/index-fbaa55c8.css","assets/FelModal-a7d23795.css"])),P=w(()=>x(()=>import("./FelDataTable-6c53843b.js"),["assets/FelDataTable-6c53843b.js","assets/index-467d1dc5.js","assets/index-fbaa55c8.css"])),D=w(()=>x(()=>import("./FelPageHeading-7416d7de.js"),["assets/FelPageHeading-7416d7de.js","assets/index-467d1dc5.js","assets/index-fbaa55c8.css"])),l=Q(),W=X(),{withClientMutation:L}=ie(),{workSheets:A,fetchingWorkSheets:B,workSheetPageInfo:T,workSheetTemplates:I}=Y(l);ee();let r=b(!1);const O=b([{name:"All",value:""},{name:"Pending",value:"pending"},{name:"Awaiting",value:"awaiting"},{name:"Approved",value:"approved"},{name:"Empty",value:"empty"}]),V=b([{name:"UID",value:"uid",sortable:!0,sortBy:"asc",defaultSort:!0,showInToggler:!1,hidden:!0},{name:"WorkSheet Id",value:"workSheetId",sortable:!1,sortBy:"asc",hidden:!1,customRender:function(e,a){return _(te,{to:{name:"worksheet-detail",params:{workSheetUid:e?.uid}},innerHTML:e?.worksheetId})}},{name:"Analysis/Test",value:"analysis.name",sortable:!1,sortBy:"asc",hidden:!1},{name:"Samples",value:"assignedCount",sortable:!1,sortBy:"asc",hidden:!1},{name:"Instrument",value:"instrument.name",sortable:!1,sortBy:"asc",hidden:!1},{name:"Analyst",value:"clientPatientId",sortable:!1,sortBy:"asc",hidden:!1,customRender:function(e,a){return _("div",{innerHTML:U(e?.analyst)})}},{name:"Status",value:"",sortable:!1,sortBy:"asc",hidden:!1,customRender:function(e,a){return _("button",{type:"button",class:"bg-sky-800 text-white py-1 px-2 rounded-sm leading-none",innerHTML:e?.state||"unknown"})}}]);l.removeWorksheet();let o=se({first:25,before:"",status:"",text:"",sort:["-uid"],filterAction:!1});l.fetchWorkSheets(o),l.fetchWorkSheetTemplates(),W.fetchUsers({});const F=de({analystUid:f().required("Analyst is Required").typeError("Analyst is Required"),templateUid:f().typeError("Worksheet Template is required"),instrumentUid:f(),count:f().typeError("Required number of worksheets must be defined")}),{handleSubmit:H,errors:q}=ce({validationSchema:F,initialValues:{count:1,analystUid:void 0,templateUid:void 0,instrumentUid:void 0}}),{value:v}=h("count"),{value:p}=h("analystUid"),{value:k}=h("templateUid");h("instrumentUid");const j=H(e=>{r.value=!1,L(ae,e,"createWorksheet").then(a=>{l.addWorksheet(a),r.value=!1})});function $(e){o.first=e.fetchCount,o.before=T?.value?.endCursor??"",o.text=e.filterText,o.status=e.filterStatus,o.filterAction=!1,l.fetchWorkSheets(o)}function K(e){o.first=25,o.before="",o.text=e.filterText,o.status=e.filterStatus,o.filterAction=!0,l.fetchWorkSheets(o)}const z=C(()=>W.getUsers),U=e=>e?.auth?.userName?e?.auth?.userName:e?.firstName?e.firstName+" "+e.lastName:"----",G=C(()=>A?.value?.length+" of "+l.getWorkSheetCount+" WorkSheets");return(e,a)=>(i(),u(m,null,[E(n(D),{title:"Worksheets"}),t("div",ve,[t("div",null,[c(t("button",{onClick:a[0]||(a[0]=R(s=>d(r)?r.value=!0:r=!0,["prevent"])),class:"p-2 h-10 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Add WorkSheet ",512),[[oe,me(he.CREATE,fe.WORKSHEET)]])])]),E(n(P),{columns:V.value,data:n(A),toggleColumns:!0,loading:n(B),paginable:!0,pageMeta:{fetchCount:n(o).first,hasNextPage:n(T)?.hasNextPage,countNone:G.value},searchable:!0,filterable:!0,filterMeta:{defaultFilter:n(o).status,filters:O.value},onOnSearch:K,onOnPaginate:$,selectable:!1},{footer:y(()=>[]),_:1},8,["columns","data","loading","pageMeta","filterMeta"]),n(r)?(i(),ne(n(N),{key:0,onClose:a[5]||(a[5]=s=>d(r)?r.value=!1:r=!1)},{header:y(()=>[t("div",null,[pe,ke,t("ul",null,[(i(!0),u(m,null,g(Object.values(n(q)),(s,Z)=>(i(),u("li",{key:Z,class:"text-orange-600"},S(s),1))),128))])])]),body:y(()=>[t("form",be,[t("div",_e,[t("label",ye,[ge,c(t("select",{class:"form-select block w-full mt-1","onUpdate:modelValue":a[1]||(a[1]=s=>d(p)?p.value=s:null)},[(i(!0),u(m,null,g(z.value,s=>(i(),u("option",{key:s.uid,value:s.uid},S(U(s)),9,Se))),128))],512),[[M,n(p)]])]),t("label",we,[xe,c(t("select",{class:"form-select block w-full mt-1","onUpdate:modelValue":a[2]||(a[2]=s=>d(k)?k.value=s:null)},[We,(i(!0),u(m,null,g(n(I),s=>(i(),u("option",{key:s.uid,value:s.uid},S(s.name),9,Ae))),128))],512),[[M,n(k)]])]),t("label",Te,[Ue,c(t("input",{type:"number",class:"form-input mt-1 block w-full","onUpdate:modelValue":a[3]||(a[3]=s=>d(v)?v.value=s:null),min:"1"},null,512),[[re,n(v)]])])]),Ce,t("button",{type:"button",onClick:a[4]||(a[4]=R(s=>n(j)(),["prevent"])),class:"-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Save Form ")])]),_:1})):le("",!0)],64))}}),De=ue(Ee,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/worksheet/WorkSheetListing.vue"]]);export{De as default};
