import{d as v,aL as P,D as p,o,c as i,b as s,F as a,p as l,t as u,g as k,f as U,j as A,_ as D,bu as G,O as E,k as S}from"./index-e48f6898.js";const V={class:"overflow-x-auto mt-4"},B={class:"align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"},O={class:"relative"},z={class:"min-w-full"},C=s("th",{class:"sticky top-0 z-10 bg-white px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Permissions ",-1),F=s("th",{class:"sticky top-0 z-10 bg-white px-1 py-1 border-b-2 border-gray-300"},null,-1),L={class:"flex-1 overflow-y-auto max-h-[700px]"},R={class:"min-w-full"},T={class:"bg-white"},j={class:"bg-slate-100"},M={class:"py-1 font-bold px-1 text-gray-600"},N={class:"py-1 font-sm italic text-gray-500 px-1"},I=v({__name:"Permissions",setup(q){const h=A(()=>D(()=>import("./FelSwitch-01582d4b.js"),["assets/FelSwitch-01582d4b.js","assets/index-e48f6898.js","assets/index-7d22ceed.css"]));let d=P();const{withClientMutation:f}=E();d.fetchGroupsAndPermissions();const c=p(()=>d.getGroups);function m(r,n){return r?.permissions?.some(e=>e?.uid===n?.uid)??!1}const b=(r,n)=>r?.reduce(function(e,t){return(e[t[n]]=e[t[n]]||[]).push(t),e},{}),y=p(()=>Array.from(Object.entries(b(d.getPermissions,"target"))));function g(r,n){f(G,{groupUid:r?.uid,permissionUid:n?.uid},"updateGroupPermissions").then(e=>d.updateGroupsAndPermissions(e))}function x(r,n,e){e!==m(r,n)&&g(r,n)}return(r,n)=>(o(),i("div",V,[s("div",B,[s("div",O,[s("table",z,[s("thead",null,[s("tr",null,[C,(o(!0),i(a,null,l(c.value,e=>(o(),i("th",{key:e.uid,class:"sticky top-0 z-10 bg-white px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"},u(e.name),1))),128)),F])])]),s("div",L,[s("table",R,[s("tbody",T,[(o(!0),i(a,null,l(y.value,e=>(o(),i(a,{key:e[0]},[s("tr",j,[s("td",M,u(e[0]),1),(o(!0),i(a,null,l(c.value,t=>(o(),i("td",{class:"py-1 font-medium px-1 text-slate-100",key:t.uid},u(t.name),1))),128))]),(o(!0),i(a,null,l(e[1],t=>(o(),i("tr",{key:t.uid,class:"border-b border-slate-200"},[s("td",N,u(t.action),1),(o(!0),i(a,null,l(c.value,_=>(o(),i("td",{key:_.uid,class:"px-1"},[k(U(h),{"model-value":m(_,t),"onUpdate:modelValue":w=>x(_,t,w),reverse:""},null,8,["model-value","onUpdate:modelValue"])]))),128))]))),128))],64))),128))])])])])])]))}}),J=S(I,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/admin/users/Permissions.vue"]]);export{J as default};
