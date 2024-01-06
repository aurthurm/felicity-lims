import{_ as y,w as B,n as T}from"./billing-356772f3.js";import{f as j,G as b,r as c,c as F,d as f,h as l,k as u,x as e,F as g,ak as N,D as i,u as r,y as x,j as O,A as v,B as P,i as w,_ as V}from"./_plugin-vue_export-helper-3f67fb71.js";const I={class:""},L={class:"container w-full my-4"},R=e("hr",null,null,-1),$=e("hr",null,null,-1),U=e("hr",null,null,-1),G={class:"overflow-x-auto mt-4"},H={class:"align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"},Y={class:"min-w-full"},q=e("thead",null,[e("tr",null,[e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"},"Name"),e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"},"Instruments"),e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"},"Analyses"),e("th",{class:"px-1 py-1 border-b-2 border-gray-300"})])],-1),z={class:"bg-white"},J={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},K={class:"text-sm leading-5 text-gray-800"},Q={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},W={class:"text-sm leading-5 text-gray-800"},X={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},Z={class:"text-sm leading-5 text-sky-800"},ee={class:"px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"},te=["onClick"],se=j({__name:"Methods",setup(oe){const k=b(()=>y(()=>import("./SimpleModal-1f91868a.js"),["assets/SimpleModal-1f91868a.js","assets/_plugin-vue_export-helper-3f67fb71.js","assets/runtime-dom.esm-bundler-6e07ef74.js","assets/SimpleModal-f645a074.css"])),A=b(()=>y(()=>import("./MethodForm-23ec597b.js"),["assets/MethodForm-23ec597b.js","assets/billing-356772f3.js","assets/_plugin-vue_export-helper-3f67fb71.js","assets/instrument.mutations-c5d0ba02.js","assets/runtime-dom.esm-bundler-6e07ef74.js","assets/vue-multiselect-b0b22fef.css"])),h=B(),_=T();let o=c(!1),m=c("");const E=c(!0);let a=F({});const M={first:1e3,after:"",text:"",sortBy:["name"]};h.fetchAnalysesServices(M);const S=f(()=>h.getAnalysesServicesSimple);_.fetchMethods();const C=f(()=>_.getMethods);function p(n,t={}){E.value=n,o.value=!0,m.value=(n?"CREATE":"EDIT")+" ANALYSES METHOD",n?Object.assign(a,{}):Object.assign(a,{...t})}function D(n){let t=[];return S.value?.forEach(s=>{s?.methods?.some(d=>d.uid==n?.uid)&&t.push(s?.name)}),t.join(", ")}return(n,t)=>(l(),u(g,null,[e("div",I,[e("div",L,[R,e("button",{class:"px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none",onClick:t[0]||(t[0]=s=>p(!0))}," Add Method"),$]),U,e("div",G,[e("div",H,[e("table",Y,[q,e("tbody",z,[(l(!0),u(g,null,N(r(C),s=>(l(),u("tr",{key:s?.uid},[e("td",J,[e("div",K,i(s?.name),1)]),e("td",Q,[e("div",W,i(s?.instruments?.map(d=>d?.name)?.join(",")),1)]),e("td",X,[e("div",Z,i(D(s)),1)]),e("td",ee,[e("button",{onClick:d=>p(!1,s),class:"px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"},"Edit",8,te)])]))),128))])])])])]),x(" AnaltsisProfile Form Modal "),r(o)?(l(),O(r(k),{key:0,onClose:t[2]||(t[2]=s=>w(o)?o.value=!1:o=!1)},{header:v(()=>[e("h3",null,i(r(m)),1)]),body:v(()=>[P(r(A),{method:r(a),methodUid:r(a)?.uid,onClose:t[1]||(t[1]=s=>w(o)?o.value=!1:o=!1)},null,8,["method","methodUid"])]),_:1})):x("v-if",!0)],64))}}),ae=V(se,[["__file","/home/aurthurm/Development/felicity-lims/webapp/views/admin/instruments/Methods.vue"]]);export{ae as default};
