import{d as R,p as $,N as q,aA as j,s as z,r as p,m as D,o as i,c as d,b as t,A as v,f as o,g as y,t as a,e as f,P as G,B as H,C as E,v as T,i as b,F as x,E as C,as as w,w as J,M as K,k as O}from"./index-4d0d48ab.js";import Q from"./FelLoadingMessage-e29e7357.js";import W from"./FelModal-599b9c12.js";import{A as X,E as Y}from"./clients.mutations-e8fd6a58.js";import{h as Z,o as tt,a as et}from"./constants-f934664e.js";const st={class:""},ot={class:"grid grid-cols-12 gap-4 mt-2"},lt={class:"col-span-12"},nt={class:"bg-white rounded-sm shadow-sm hover:shadow-lg duration-500 px-4 sm:px-6 md:px-2 py-4"},it={key:0,class:"py-4 text-center"},at={key:1,class:"grid grid-cols-12 gap-3"},dt={class:"col-span-12 px-3 sm:px-0"},ct={class:"flex justify-between sm:text-sm md:text-md lg:text-lg text-gray-700 font-bold"},rt=t("hr",null,null,-1),ut={class:"grid grid-cols-2 mt-2"},mt={class:"col-span-1"},_t={class:"flex"},pt=t("span",{class:"text-gray-800 text-sm font-medium w-16"},"Province:",-1),vt={class:"text-gray-600 text-sm md:text-md"},ft={class:"flex"},ht=t("span",{class:"text-gray-800 text-sm font-medium w-16"},"District:",-1),xt={class:"text-gray-600 text-sm md:text-md"},gt={class:"flex"},yt=t("span",{class:"text-gray-800 text-sm font-medium w-16"},"Code:",-1),bt={class:"text-gray-600 text-sm md:text-md"},Ct={class:"col-span-1"},wt={class:"flex"},kt=t("span",{class:"text-gray-800 text-sm font-medium w-16"},"Email:",-1),Ut={class:"text-gray-600 text-sm md:text-md"},Dt={class:"flex"},Et=t("span",{class:"text-gray-800 text-sm font-medium w-16"},"Mobile:",-1),Tt={class:"text-gray-600 text-sm md:text-md"},Mt={action:"post",class:"p-1"},Nt={class:"grid grid-cols-2 gap-x-4 mb-4"},Lt={class:"block col-span-1 mb-2"},St=t("span",{class:"text-gray-700"},"Name",-1),Bt={class:"block col-span-1 mb-2"},It=t("span",{class:"text-gray-700"},"Code",-1),Pt={class:"grid grid-cols-3 gap-x-4 mb-4"},Vt={class:"block col-span-1 mb-2"},At=t("span",{class:"text-gray-700"},"Country",-1),Ft=t("option",null,null,-1),Rt=["value"],$t={class:"block col-span-1 mb-2"},qt=t("span",{class:"text-gray-700"},"Province",-1),jt=t("option",null,null,-1),zt=["value"],Gt={class:"block col-span-1 mb-2"},Ht=t("span",{class:"text-gray-700"},"District",-1),Jt=t("option",null,null,-1),Kt=["value"],Ot=t("hr",null,null,-1),Qt=R({__name:"Client",setup(Wt){const r=$(),{withClientMutation:k}=K(),M=q(),h=j(),{client:c,fetchingClient:N}=z(h);let u=p(!1),g=p(!1),U=p(""),l=p({}),m=p(),_=p();h.fetchClientByUid(M.query.clientUid),r.fetchCountries();function L(n){r.filterProvincesByCountry(m.value)}function S(n){r.filterDistrictsByProvince(_.value)}function B(n,s={}){g.value=n,U.value=`${n?"CREATE":"EDIT"} CLIENT`,u.value=!0,n?l.value={}:(m.value=s?.district?.province?.countryUid,_.value=s?.district?.provinceUid,l.value=s)}function I(){k(X,{payload:{name:l?.value?.name,code:l?.value?.code,districtUid:l?.value?.districtUid}},"createClient").then(n=>h.addClient(n))}function P(){k(Y,{uid:l?.value?.uid,payload:{name:l?.value?.name,code:l?.value?.code,districtUid:l?.value?.districtUid}},"updateClient").then(n=>h.updateClient(n))}function V(){g.value&&I(),g.value||P(),u.value=!1,l.value={}}return(n,s)=>{const A=D("font-awesome-icon"),F=D("router-view");return i(),d(x,null,[t("div",st,[t("div",ot,[t("section",lt,[v(" Listing Item Card "),t("div",nt,[o(N)?(i(),d("div",it,[y(Q,{message:"Fetching client metadata ..."})])):(i(),d("div",at,[v(" Summary Column "),t("div",dt,[t("div",ct,[t("span",null,a(o(c)?.name),1),t("div",null,[f(t("button",{onClick:s[0]||(s[0]=e=>B(!1,o(c))),class:"p-1 ml-2 border-white border text-gray-500 text-md rounded-sm transition duration-300 hover:text-sky-800 focus:outline-none"},[y(A,{icon:"fa-edit"})],512),[[G,Z(et.UPDATE,tt.CLIENT)]])])]),rt,t("div",ut,[t("div",mt,[v(" Client Details "),t("div",_t,[pt,t("span",vt,a(o(c)?.name),1)]),t("div",ft,[ht,t("span",xt,a(o(c)?.district?.name),1)]),t("div",gt,[yt,t("span",bt,a(o(c)?.code),1)])]),t("div",Ct,[v(" Communication Details "),t("div",wt,[kt,t("span",Ut,a(o(c)?.email),1)]),t("div",Dt,[Et,t("span",Tt,a(o(c)?.mobilePhone),1)])])])])]))])])]),y(F)]),v(" Location Edit Form Modal "),o(u)?(i(),H(W,{key:0,onClose:s[9]||(s[9]=e=>b(u)?u.value=!1:u=!1)},{header:E(()=>[t("h3",null,a(o(U)),1)]),body:E(()=>[t("form",Mt,[t("div",Nt,[t("label",Lt,[St,f(t("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":s[1]||(s[1]=e=>o(l).name=e),placeholder:"Name ..."},null,512),[[T,o(l).name]])]),t("label",Bt,[It,f(t("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":s[2]||(s[2]=e=>o(l).code=e),placeholder:"Code ..."},null,512),[[T,o(l).code]])])]),t("div",Pt,[t("label",Vt,[At,f(t("select",{class:"form-select block w-full mt-1","onUpdate:modelValue":s[3]||(s[3]=e=>b(m)?m.value=e:m=e),onChange:s[4]||(s[4]=e=>L(e))},[Ft,(i(!0),d(x,null,C(o(r).countries,e=>(i(),d("option",{key:e.uid,value:e.uid},a(e.name),9,Rt))),128))],544),[[w,o(m)]])]),t("label",$t,[qt,f(t("select",{class:"form-select block w-full mt-1","onUpdate:modelValue":s[5]||(s[5]=e=>b(_)?_.value=e:_=e),onChange:s[6]||(s[6]=e=>S(e))},[jt,(i(!0),d(x,null,C(o(r).provinces,e=>(i(),d("option",{key:e.uid,value:e.uid},a(e.name),9,zt))),128))],544),[[w,o(_)]])]),t("label",Gt,[Ht,f(t("select",{class:"form-select block w-full mt-1","onUpdate:modelValue":s[7]||(s[7]=e=>o(l).districtUid=e)},[Jt,(i(!0),d(x,null,C(o(r).districts,e=>(i(),d("option",{key:e.uid,value:e.uid},a(e.name),9,Kt))),128))],512),[[w,o(l).districtUid]])])]),Ot,t("button",{type:"button",onClick:s[8]||(s[8]=J(e=>V(),["prevent"])),class:"-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Save Form ")])]),_:1})):v("v-if",!0)],64)}}}),se=O(Qt,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/client/_id/Client.vue"]]);export{se as default};
