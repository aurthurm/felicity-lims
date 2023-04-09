import{d as A,a3 as z,ad as O,ac as q,s as $,r as c,U as G,B as H,o as a,g as d,h as t,y as u,j as l,l as U,L as J,t as n,i as m,C as K,D as Q,E as D,v as E,k as y,F as v,z as b,R as C,w as W,I as X,ak as Y,_ as Z}from"./index-8125dc25.js";import{A as tt,E as et}from"./clients.mutations-c292c093.js";import{h as st,o as ot,a as lt}from"./constants-06e43bc1.js";const nt={class:""},it={class:"grid grid-cols-12 gap-4 mt-2"},at={class:"col-span-12"},dt={class:"bg-white rounded-sm shadow-sm hover:shadow-lg duration-500 px-4 sm:px-6 md:px-2 py-4"},ct={key:0,class:"py-4 text-center"},rt={key:1,class:"grid grid-cols-12 gap-3"},ut={class:"col-span-12 px-3 sm:px-0"},mt={class:"flex justify-between sm:text-sm md:text-md lg:text-lg text-gray-700 font-bold"},_t=t("svg",{class:"w-4 h-4 fill-current",viewBox:"0 0 20 20"},[t("path",{d:"M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"})],-1),pt=[_t],ft=t("hr",null,null,-1),ht={class:"grid grid-cols-2 mt-2"},vt={class:"col-span-1"},xt={class:"flex"},gt=t("span",{class:"text-gray-800 text-sm font-medium w-16"},"Province:",-1),yt={class:"text-gray-600 text-sm md:text-md"},bt={class:"flex"},Ct=t("span",{class:"text-gray-800 text-sm font-medium w-16"},"District:",-1),wt={class:"text-gray-600 text-sm md:text-md"},kt={class:"flex"},Ut=t("span",{class:"text-gray-800 text-sm font-medium w-16"},"Code:",-1),Dt={class:"text-gray-600 text-sm md:text-md"},Et={class:"col-span-1"},Mt={class:"flex"},Lt=t("span",{class:"text-gray-800 text-sm font-medium w-16"},"Email:",-1),Tt={class:"text-gray-600 text-sm md:text-md"},Bt={class:"flex"},It=t("span",{class:"text-gray-800 text-sm font-medium w-16"},"Mobile:",-1),St={class:"text-gray-600 text-sm md:text-md"},Vt={action:"post",class:"p-1"},Nt={class:"grid grid-cols-2 gap-x-4 mb-4"},Pt={class:"block col-span-1 mb-2"},Ft=t("span",{class:"text-gray-700"},"Name",-1),jt={class:"block col-span-1 mb-2"},Rt=t("span",{class:"text-gray-700"},"Code",-1),At={class:"grid grid-cols-3 gap-x-4 mb-4"},zt={class:"block col-span-1 mb-2"},Ot=t("span",{class:"text-gray-700"},"Country",-1),qt=t("option",null,null,-1),$t=["value"],Gt={class:"block col-span-1 mb-2"},Ht=t("span",{class:"text-gray-700"},"Province",-1),Jt=t("option",null,null,-1),Kt=["value"],Qt={class:"block col-span-1 mb-2"},Wt=t("span",{class:"text-gray-700"},"District",-1),Xt=t("option",null,null,-1),Yt=["value"],Zt=t("hr",null,null,-1),te=A({__name:"index",setup(ee){const f=z(),{withClientMutation:w}=Y(),M=O(),h=q(),{client:o,fetchingClient:L}=$(h);let r=c(!1),x=c(!1),T=c(""),B=c([]),I=c([]),_=c(),p=c(),k=c("");h.fetchClientByUid(M.query.clientUid),f.fetchCountries();const S=G(()=>f.getCountries);function V(){w(tt,{name:o?.value?.name,code:o?.value?.code,districtUid:o?.value?.districtUid},"createClient").then(i=>h.addClient(i))}function N(){w(et,{uid:o?.value?.uid,name:o?.value?.name,code:o?.value?.code,districtUid:o?.value?.districtUid},"updateClient").then(i=>h.updateClient(i))}function P(i){f.filterProvincesByCountry(_.value)}function F(i){f.filterDistrictsByProvince(p.value)}function j(i,s,g={}){x.value=i,T.value=s,k.value=(i?"CREATE":"EDIT")+" "+s.toUpperCase(),s=="client"&&(r.value=!0),i?s=="client"&&Object.assign(o,{}):s=="client"&&Object.assign(o,{...g})}function R(){x.value&&V(),x.value||N(),r.value=!1}return(i,s)=>{const g=H("router-view");return a(),d(v,null,[t("div",nt,[t("div",it,[t("section",at,[u(" Listing Item Card "),t("div",dt,[l(L)?(a(),d("div",ct,[U(J,{message:"Fetching client metadata ..."})])):(a(),d("div",rt,[u(" Summary Column "),t("div",ut,[t("div",mt,[t("span",null,n(l(o)?.name),1),t("div",null,[m(t("button",{onClick:s[0]||(s[0]=e=>j(!1,"client",l(o))),class:"ml-4 inline-flex items-center justify-center w-8 h-8 mr-2 border-sky-800 border text-gray-900 transition-colors duration-150 bg-white rounded-full focus:outline-none hover:bg-gray-200"},pt,512),[[K,st(lt.UPDATE,ot.CLIENT)]])])]),ft,t("div",ht,[t("div",vt,[u(" Client Details "),t("div",xt,[gt,t("span",yt,n(l(o)?.name),1)]),t("div",bt,[Ct,t("span",wt,n(l(o)?.district?.name),1)]),t("div",kt,[Ut,t("span",Dt,n(l(o)?.code),1)])]),t("div",Et,[u(" Communication Details "),t("div",Mt,[Lt,t("span",Tt,n(l(o)?.email),1)]),t("div",Bt,[It,t("span",St,n(l(o)?.mobilePhone),1)])])])])]))])])]),U(g)]),u(" Location Edit Form Modal "),l(r)?(a(),Q(X,{key:0,onClose:s[9]||(s[9]=e=>y(r)?r.value=!1:r=!1)},{header:D(()=>[t("h3",null,n(l(k)),1)]),body:D(()=>[t("form",Vt,[t("div",Nt,[t("label",Pt,[Ft,m(t("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":s[1]||(s[1]=e=>l(o).name=e),placeholder:"Name ..."},null,512),[[E,l(o).name]])]),t("label",jt,[Rt,m(t("input",{class:"form-input mt-1 block w-full","onUpdate:modelValue":s[2]||(s[2]=e=>l(o).code=e),placeholder:"Code ..."},null,512),[[E,l(o).code]])])]),t("div",At,[t("label",zt,[Ot,m(t("select",{class:"form-select block w-full mt-1","onUpdate:modelValue":s[3]||(s[3]=e=>y(_)?_.value=e:_=e),onChange:s[4]||(s[4]=e=>P(e))},[qt,(a(!0),d(v,null,b(l(S),e=>(a(),d("option",{key:e.uid,value:e.uid},n(e.name)+" "+n(e.uid),9,$t))),128))],544),[[C,l(_)]])]),t("label",Gt,[Ht,m(t("select",{class:"form-select block w-full mt-1","onUpdate:modelValue":s[5]||(s[5]=e=>y(p)?p.value=e:p=e),onChange:s[6]||(s[6]=e=>F(e))},[Jt,(a(!0),d(v,null,b(l(B),e=>(a(),d("option",{key:e.uid,value:e.uid},n(e.name)+" "+n(e.uid),9,Kt))),128))],544),[[C,l(p)]])]),t("label",Qt,[Wt,m(t("select",{class:"form-select block w-full mt-1","onUpdate:modelValue":s[7]||(s[7]=e=>l(o).districtUid=e)},[Xt,(a(!0),d(v,null,b(l(I),e=>(a(),d("option",{key:e.uid,value:e.uid},n(e.name)+" "+n(e.uid),9,Yt))),128))],512),[[C,l(o).districtUid]])])]),Zt,t("button",{type:"button",onClick:s[8]||(s[8]=W(e=>R(),["prevent"])),class:"-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Save Form ")])]),_:1})):u("v-if",!0)],64)}}}),ne=Z(te,[["__file","/home/aurthur/Development/Python/felicity/felicity-lims/webapp/views/client/_id/index.vue"]]);export{ne as default};
