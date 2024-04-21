import{d as P,am as $,ah as j,s as q,r as b,o as r,c as m,b as e,e as d,E as y,F as T,p as A,t as u,H as B,f as s,g as z,x as h,q as g,G as D,v,w as G,i as I,O as H,k as L,D as U,y as J}from"./index-2a6c9271.js";import K from"./SampleListing-fce78963.js";import Q from"./LoadingMessage-72d34fcf.js";import W from"./SimpleModal-0c0664c5.js";import{D as X,a as Y,b as Z}from"./clients.mutations-9d5def10.js";import{h as x,o as w,a as k}from"./constants-b0c30fb3.js";import ee from"./AuditLog-1297894b.js";import"./samples-f733dee1.js";const te={class:"overflow-x-auto"},oe={class:"align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"},se={class:"min-w-full"},ae=e("thead",null,[e("tr",null,[e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Full Name "),e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Email "),e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Phone "),e("th",{class:"px-1 py-1 border-b-2 border-gray-300"})])],-1),le={class:"bg-white"},ne={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},ie={class:"flex items-center"},re={class:"text-sm leading-5 text-gray-800"},ce={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},de={class:"text-sm leading-5 text-sky-800"},ue={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},me={class:"text-sm leading-5 text-sky-800"},pe={class:"px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"},be=["onClick"],he=["onClick"],_e={key:0,class:"py-4 text-center"},fe={action:"post",class:"p-1"},ge={class:"grid grid-cols-2 gap-x-4 mb-4"},Ce={class:"block col-span-1 mb-2"},ye=e("span",{class:"text-gray-700"},"Full Name",-1),ve={class:"block col-span-1 mb-2"},xe=e("span",{class:"text-gray-700"},"Email",-1),we={class:"block col-span-1 mb-2"},ke=e("span",{class:"text-gray-700"},"Mobile Phone",-1),Te=e("hr",null,null,-1),Ne=P({__name:"ContactTable",props:{clientUid:String},setup(F){let c=$(),l=j();const{withClientMutation:p}=H(),{clientContacts:_,fetchingClientContacts:N}=q(c);let C=b(""),n=b(!1),f=b(!1),a=b({});c.fetchClientContacts(l.query.clientUid);function M(){p(Y,{payload:{clientUid:l.query.clientUid,firstName:a.value.firstName,mobilePhone:a.value.mobilePhone,email:a.value.email}},"createClientContact").then(i=>c.addClientContact(i))}function S(){p(Z,{uid:a.value.uid,payload:{clientUid:l.query.clientUid,firstName:a.value.firstName,mobilePhone:a.value.mobilePhone,email:a.value.email}},"updateClientContact").then(i=>c.updateClientContact(i))}function E(i,t={}){f.value=i,C.value=(i?"CREATE":"EDIT")+" CONTACT",n.value=!0,i?Object.assign(a,{}):Object.assign(a.value,{...t})}function O(){f.value===!0&&M(),f.value||S(),n.value=!1}function V(i){p(X,{uid:i},"deleteClientContact").then(t=>c.deleteClientContact(t?.uid))}return(i,t)=>(r(),m(T,null,[e("div",te,[d(e("button",{onClick:t[0]||(t[0]=o=>E(!0)),class:"px-1 py-0 mb-4 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"}," Add Contact ",512),[[y,x(k.CREATE,w.CLIENT)]]),e("div",oe,[e("table",se,[ae,e("tbody",le,[(r(!0),m(T,null,A(s(_),o=>(r(),m("tr",{key:o.uid},[e("td",ne,[e("div",ie,[e("div",null,[e("div",re,u(o.firstName)+" "+u(o.lastName),1)])])]),e("td",ce,[e("div",de,u(o.email),1)]),e("td",ue,[e("div",me,u(o.mobilePhone),1)]),e("td",pe,[d(e("button",{onClick:R=>E(!1,o),class:"px-2 py-1 mr-2 border-gray-500 border text-orange-500rounded-smtransition duration-300 hover:bg-gray-700 hover:text-white focus:outline-none"}," Edit ",8,be),[[y,x(k.UPDATE,w.CLIENT)]]),B(),d(e("button",{onClick:R=>V(o?.uid),class:"px-2 py-1 mr-2 border-orange-500 border text-orange-500rounded-smtransition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none"}," Deactivate ",8,he),[[y,x(k.UPDATE,w.CLIENT)]])])]))),128))])]),s(N)?(r(),m("div",_e,[z(Q,{message:"Fetching client contacts ..."})])):h("",!0)])]),s(n)?(r(),g(W,{key:0,onClose:t[5]||(t[5]=o=>I(n)?n.value=!1:n=!1)},{header:D(()=>[e("h3",null,u(s(C)),1)]),body:D(()=>[e("form",fe,[e("div",ge,[e("label",Ce,[ye,d(e("input",{class:"form-input mt-1 block w-full",autocomplete:"off","onUpdate:modelValue":t[1]||(t[1]=o=>s(a).firstName=o),placeholder:"Full Name ..."},null,512),[[v,s(a).firstName]])]),e("label",ve,[xe,d(e("input",{class:"form-input mt-1 block w-full",autocomplete:"off","onUpdate:modelValue":t[2]||(t[2]=o=>s(a).email=o),placeholder:"Email ..."},null,512),[[v,s(a).email]])]),e("label",we,[ke,d(e("input",{class:"form-input mt-1 block w-full",autocomplete:"off","onUpdate:modelValue":t[3]||(t[3]=o=>s(a).mobilePhone=o),placeholder:"Mobile Phone ..."},null,512),[[v,s(a).mobilePhone]])])]),Te,e("button",{type:"button",onClick:t[4]||(t[4]=G(o=>O(),["prevent"])),class:"-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Save Form ")])]),_:1})):h("",!0)],64))}}),Ee=L(Ne,[["__file","/home/aurthur/Documents/Development/felicity-lims/webapp/views/client/_id/ContactTable.vue"]]),De={class:"col-span-12"},Ue={class:"bg-white shadow-md mt-2"},Pe={class:"-mb-px flex justify-start"},$e=["onClick"],Ae={class:"pt-4"},Ie=P({__name:"ClientDetail",setup(F){const c=$();let l=b("samples");const p=["samples","contacts","logs"];U(()=>"tab-"+l.value);let _=U(()=>c.getClient);return(N,C)=>(r(),m("section",De,[e("nav",Ue,[e("div",Pe,[(r(),m(T,null,A(p,n=>e("a",{key:n,class:J(["no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-sky-600 hover:text-gray-200",{"tab-active":s(l)===n}]),onClick:f=>I(l)?l.value=n:l=n},u(n),11,$e)),64))])]),e("div",Ae,[s(l)==="samples"?(r(),g(K,{key:0})):h("",!0),s(l)==="contacts"?(r(),g(Ee,{key:1,clientUid:s(_)?.uid},null,8,["clientUid"])):h("",!0),s(l)==="logs"?(r(),g(ee,{key:2,targetType:"client",targetId:s(_)?.uid},null,8,["targetId"])):h("",!0)])]))}}),qe=L(Ie,[["__file","/home/aurthur/Documents/Development/felicity-lims/webapp/views/client/_id/ClientDetail.vue"]]);export{qe as default};
