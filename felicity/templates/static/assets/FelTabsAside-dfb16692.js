import{d as h,o as s,c as l,b as o,t as i,D as r,F as _,E as g,I as d,C as b,A as k,aI as C,aD as V,k as v}from"./index-6a324368.js";const D={class:"flex w-full h-full mt-4"},T={class:"w-48 sticky top-0"},w={class:"p-4"},A={key:0,class:"text-lg font-semibold text-gray-700 mb-4"},B=o("hr",{class:"my-1"},null,-1),F={class:"space-y-2"},S=["onClick"],q={class:"flex-1 p-8 bg-slate-50"},x=h({__name:"FelTabsAside",props:{title:{type:String,required:!1,default:"Navigation"},items:{type:Array,required:!0},modelValue:{type:String,required:!0},hideTitle:{type:Boolean,required:!1,default:!1}},emits:["update:modelValue"],setup(c,{emit:u}){const a=c,m=u,p=e=>{m("update:modelValue",e)},f=e=>!!a.items.find(t=>t.id===e)?.component,y=e=>a.items.find(t=>t.id===e)?.component||null;return(e,n)=>(s(),l("div",D,[o("aside",T,[o("nav",w,[e.hideTitle?r("",!0):(s(),l("h2",A,i(e.title),1)),B,o("ul",F,[(s(!0),l(_,null,g(e.items,t=>(s(),l("li",{key:t.id},[o("button",{onClick:N=>p(t.id),class:d(["w-full text-left p-2  transition-colors duration-150 flex items-center gap-2",{"bg-sky-600 text-white":e.modelValue===t.id,"text-gray-600 hover:bg-gray-100":e.modelValue!==t.id}])},[t.icon?(s(),l("i",{key:0,class:d(t.icon)},null,2)):r("",!0),b(" "+i(t.label),1)],10,S)]))),128))])])]),o("main",q,[f(e.modelValue)?(s(),k(C(y(e.modelValue)),{key:0})):V(e.$slots,"default",{key:1})])]))}}),I=v(x,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/components/ui/tabs/FelTabsAside.vue"]]);export{I as default};
