import{d as g,a$ as y,r as k,x as p,o as s,c as _,b as n,A as i,F as S,E as x,I as D,f as e,i as b,t as E,B as o,j as r,_ as l,k as A}from"./index-4d0d48ab.js";const C={class:""},L={class:"col-span-12"},T={class:"bg-white shadow-md mt-2"},V={class:"-mb-px flex justify-start"},w=["onClick"],B=g({__name:"ShipmentDetail",setup(I){const m=r(()=>l(()=>import("./ShipmentAssign-9dc1828e.js"),["assets/ShipmentAssign-9dc1828e.js","assets/index-4d0d48ab.js","assets/index-c2286288.css","assets/FelButton-f535b4fc.js","assets/shipment-f4d68a6b.js"])),d=r(()=>l(()=>import("./ShipmentSamples-f358cabf.js"),["assets/ShipmentSamples-f358cabf.js","assets/index-4d0d48ab.js","assets/index-c2286288.css","assets/shipment-f4d68a6b.js"])),u=r(()=>l(()=>import("./Manifest-86878ed3.js"),["assets/Manifest-86878ed3.js","assets/index-4d0d48ab.js","assets/index-c2286288.css","assets/shipment-f4d68a6b.js"])),f=r(()=>l(()=>import("./FelAuditLog-c991af1a.js"),["assets/FelAuditLog-c991af1a.js","assets/index-4d0d48ab.js","assets/index-c2286288.css"]));let v=y(),t=k("detail");const c=p(()=>v.getShipment),h=p(()=>["preperation","empty"].includes(c.value?.state??"")?["detail","assign-samples","logs"]:["detail","manifest","logs"]);return(P,R)=>(s(),_("div",C,[n("section",L,[i(" Sample and Case Data "),n("nav",T,[n("div",V,[(s(!0),_(S,null,x(h.value,a=>(s(),_("a",{key:a,class:D(["no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-sky-600 hover:text-gray-200",{"tab-active":e(t)===a}]),onClick:O=>b(t)?t.value=a:t=a},E(a),11,w))),128))])]),n("div",null,[e(t)==="detail"?(s(),o(e(d),{key:0})):i("v-if",!0),e(t)==="assign-samples"?(s(),o(e(m),{key:1})):i("v-if",!0),e(t)==="manifest"?(s(),o(e(u),{key:2})):i("v-if",!0),e(t)==="logs"?(s(),o(e(f),{key:3,targetType:"shipment",targetUid:c.value?.uid},null,8,["targetUid"])):i("v-if",!0)])])]))}}),F=A(B,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/shipment/_id/ShipmentDetail.vue"]]);export{F as default};
