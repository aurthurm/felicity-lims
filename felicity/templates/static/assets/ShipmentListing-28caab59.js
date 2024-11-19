import{d as K,a$ as Q,s as W,N as X,r as p,ay as r,az as Y,q as Z,b0 as ee,x as te,o as u,c as m,g as M,f as n,b as e,A as x,w as L,i as c,C as h,e as f,at as se,D as ae,B as oe,F as S,E as T,t as A,as as ne,v as w,j as E,M as le,_ as R,k as ie}from"./index-4d0d48ab.js";import re from"./FelModal-599b9c12.js";import{c as ue,d as B,a as D,u as ce,b}from"./array-93349b7b.js";const de={class:"flex justify-between items-center"},me={class:"flex"},fe=e("span",{class:"mx-2"},"InBound",-1),pe=e("h3",null,"Create Shipment",-1),he=e("hr",null,null,-1),be={action:"post",class:"p-1"},ve={class:"grid grid-cols-3 gap-x-4 mb-4"},ge={class:"block col-span-1 mb-2"},_e=e("span",{class:"text-gray-700"},"External Laboratory",-1),ye=["value"],xe={class:"block col-span-1 mb-2"},Se=e("span",{class:"text-gray-700"},"Courier",-1),we={class:"block col-span-1 mb-2"},ke=e("span",{class:"text-gray-700"},"How Many",-1),Ce={class:"grid grid-cols-3 gap-x-4 mb-4"},Me={class:"block col-span-3 mb-2"},Le=e("span",{class:"text-gray-700"},"Comment",-1),Te=e("hr",null,null,-1),Ae=K({__name:"ShipmentListing",setup(Ee){const I=E(()=>R(()=>import("./FelPageHeading-67d86e24.js"),["assets/FelPageHeading-67d86e24.js","assets/index-4d0d48ab.js","assets/index-c2286288.css"])),N=E(()=>R(()=>import("./FelDataTable-98793ba6.js"),["assets/FelDataTable-98793ba6.js","assets/index-4d0d48ab.js","assets/index-c2286288.css"])),l=Q(),{withClientMutation:U}=le(),{shipments:k,fetchingShipments:V,shipmentPageInfo:C}=W(l);X();let i=p(!1);const d=p(!1),P=p([{name:"All",value:""},{name:"Due",value:"due"},{name:"Awaiting",value:"awaiting"},{name:"Failed",value:"failed"}]),F=p([{name:"UID",value:"uid",sortable:!0,sortBy:"asc",defaultSort:!0,showInToggler:!1,hidden:!0},{name:"Shipment Id",value:"shipmentId",sortable:!1,sortBy:"asc",hidden:!1,customRender:function(o,t){return r(Y,{to:{name:"shipment-detail",params:{shipmentUid:o?.uid}},innerHTML:o?.shipmentId})}},{name:"External Laboratory",value:"laboratory.name",sortable:!1,sortBy:"asc",hidden:!1},{name:"Courier",value:"courier",sortable:!1,sortBy:"asc",hidden:!1},{name:"Flow Detail",value:"",sortable:!1,sortBy:"asc",hidden:!1},{name:"Assigned Count",value:"assignedCount",sortable:!1,sortBy:"asc",hidden:!1},{name:"Current Status",value:"",sortable:!1,sortBy:"asc",hidden:!1,customRender:function(o,t){return r("button",{type:"button",class:"bg-sky-800 text-white py-1 px-2 rounded-sm leading-none",innerHTML:o?.state||"unknown"})}},{name:"",value:"",sortable:!1,showInToggler:!1,hidden:!1,customRender:function(o,t){return o.incoming?r("span",{class:"text-green-600"},r("i",{class:"fa fa-reply-all"})):r("span",{class:"text-orange-600"},r("i",{class:"fa fa-share-from-square"}))}}]);l.removeShipment();let a=Z({first:25,before:"",incoming:d.value,status:"",text:"",sort:["-uid"],filterAction:!1});l.fetcShipments(a),l.fetchReferralLaboratories();const q=ue({laboratoryUid:B().required("Laboratory is Required").typeError("Laboratory is Required"),comment:D().nullable(),courier:D().required("Courier is required"),count:B()}),{handleSubmit:H,errors:O}=ce({validationSchema:q,initialValues:{laboratoryUid:void 0,comment:"",courier:"",count:1}}),{value:v}=b("laboratoryUid"),{value:g}=b("comment"),{value:_}=b("courier"),{value:y}=b("count"),$=H(o=>{i.value=!1,U(ee,{payload:o},"createShipment").then(t=>{l.addShipment(t),i.value=!1})});function j(o){a.first=o.fetchCount,a.before=C?.value?.endCursor??"",a.text=o.filterText,a.status=o.filterStatus,a.incoming=d.value,a.filterAction=!1,l.fetcShipments(a)}function z(o){a.first=25,a.before="",a.text=o.filterText,a.status=o.filterStatus,a.incoming=d.value,a.filterAction=!0,l.clearShipment(),l.fetcShipments(a)}const G=te(()=>k?.value?.length+" of "+l.getShipmentCount+" Shipments");return(o,t)=>(u(),m(S,null,[M(n(I),{title:"Shipments"}),e("div",de,[e("div",null,[x(' v-show="shield.hasRights(shield.actions.CREATE, shield.objects.SHIPMENT)" '),e("button",{onClick:t[0]||(t[0]=L(s=>c(i)?i.value=!0:i=!0,["prevent"])),class:"p-2 h-10 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Add Shipment ")])]),M(n(N),{columns:F.value,data:n(k),toggleColumns:!0,loading:n(V),paginable:!0,pageMeta:{fetchCount:n(a).first,hasNextPage:n(C)?.hasNextPage,countNone:G.value},searchable:!0,filterable:!0,filterMeta:{defaultFilter:n(a).status,filters:P.value},onOnSearch:z,onOnPaginate:j,selectable:!1},{"pre-filter":h(()=>[e("label",me,[f(e("input",{type:"checkbox","onUpdate:modelValue":t[1]||(t[1]=s=>d.value=s)},null,512),[[se,d.value]]),ae(),fe])]),footer:h(()=>[]),_:1},8,["columns","data","loading","pageMeta","filterMeta"]),x(" Location Edit Form Modal "),n(i)?(u(),oe(re,{key:0,onClose:t[7]||(t[7]=s=>c(i)?i.value=!1:i=!1)},{header:h(()=>[e("div",null,[pe,he,e("ul",null,[(u(!0),m(S,null,T(Object.values(n(O)),(s,J)=>(u(),m("li",{key:J,class:"text-orange-600"},A(s),1))),128))])])]),body:h(()=>[e("form",be,[e("div",ve,[e("label",ge,[_e,f(e("select",{class:"form-select block w-full mt-1","onUpdate:modelValue":t[2]||(t[2]=s=>c(v)?v.value=s:null)},[(u(!0),m(S,null,T(n(l).laboratories,s=>(u(),m("option",{key:s.uid,value:s.uid},A(s.name),9,ye))),128))],512),[[ne,n(v)]])]),e("label",xe,[Se,f(e("input",{type:"text",class:"form-input mt-1 block w-full","onUpdate:modelValue":t[3]||(t[3]=s=>c(_)?_.value=s:null)},null,512),[[w,n(_)]])]),e("label",we,[ke,f(e("input",{type:"number",class:"form-input mt-1 block w-full","onUpdate:modelValue":t[4]||(t[4]=s=>c(y)?y.value=s:null),min:"1",default:"1/"},null,512),[[w,n(y)]])])]),e("div",Ce,[e("label",Me,[Le,f(e("textarea",{class:"form-input mt-1 block w-full",rows:"2",placeholder:"Notes ...","onUpdate:modelValue":t[5]||(t[5]=s=>c(g)?g.value=s:null)},null,512),[[w,n(g)]])])]),Te,e("button",{type:"button",onClick:t[6]||(t[6]=L(s=>n($)(),["prevent"])),class:"-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Create Shipment ")])]),_:1})):x("v-if",!0)],64))}}),Ie=ie(Ae,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/shipment/ShipmentListing.vue"]]);export{Ie as default};
