import{d as m,m as p,s as x,N as f,W as y,o as s,c as o,f as r,g as v,x as i,b as t,F as d,p as l,t as n,j as g,_ as w,k as b}from"./index-8a5660e7.js";const S={key:0,class:"text-start my-4 w-100"},V=t("h1",{class:"text-xl text-gray-700 font-semibold"},"Analyses Status",-1),k=t("hr",{class:"my-2"},null,-1),O={class:"flex justify-start"},j={class:"mr-4 font-bold text-gray-600 text-xl"},B={class:"font-semibold text-gray-400 text-l"},D={key:0,class:"my-4"},I=t("h1",{class:"mt-4 text-xl text-gray-700 font-semibold"},"Sample Status",-1),E=t("hr",{class:"my-2"},null,-1),N={class:"flex justify-start"},A={class:"mr-4 font-bold text-gray-600 text-xl"},C={class:"font-semibold text-gray-400 text-l"},L={key:1,class:"my-4"},R=t("h1",{class:"mt-4 text-xl text-gray-700 font-semibold"},"WorkSheet Status",-1),F=t("hr",{class:"my-2"},null,-1),M={class:"flex justify-start"},P={class:"mr-4 font-bold text-gray-600 text-xl"},T={class:"font-semibold text-gray-400 text-l"},W={key:2,class:"my-4"},q=t("h1",{class:"mt-4 text-xl text-gray-700 font-semibold"},"Extras",-1),z=t("hr",{class:"my-2"},null,-1),G={class:"flex justify-start"},H={class:"mr-4 font-bold text-gray-600 text-xl"},J={class:"font-semibold text-gray-400 text-l"},K={key:0,class:"my-4"},Q=m({__name:"Overview",setup(U){const _=g(()=>w(()=>import("./FelLoadingMessage-160ea06c.js"),["assets/FelLoadingMessage-160ea06c.js","assets/index-8a5660e7.js","assets/index-227a7d92.css"])),c=p(),{dashboard:a}=x(c);return f(async()=>{c.getOverViewStats()}),y(()=>a.value.filterRange,(h,u)=>{c.getOverViewStats()},{deep:!0}),(h,u)=>(s(),o(d,null,[r(a).fetchingOverViewStats?(s(),o("div",S,[v(r(_),{message:"fetching updated overview stats ..."})])):i("v-if",!0),t("section",null,[V,k,t("div",O,[(s(!0),o(d,null,l(r(a).overViewStats?.analyses,e=>(s(),o("div",{key:e.group,class:"flex items-center bg-white shadow rounded-sm px-6 pt-3 pb-5 border border-white mr-8"},[t("span",j,n(e.count),1),t("span",B,n(e.group),1)]))),128))]),r(a).overViewStats?.analyses?.length?i("v-if",!0):(s(),o("p",D,"I did not find any analyses indicators to show")),I,E,t("div",N,[(s(!0),o(d,null,l(r(a).overViewStats?.samples,e=>(s(),o("div",{key:e.group,class:"flex items-center bg-white shadow rounded-sm px-6 pt-3 pb-5 border border-white mr-8"},[t("span",A,n(e.count),1),t("span",C,n(e.group),1)]))),128))]),r(a).overViewStats?.samples?.length?i("v-if",!0):(s(),o("p",L,"I did not find any sample indicators to show")),R,F,t("div",M,[(s(!0),o(d,null,l(r(a).overViewStats?.worksheets,e=>(s(),o("div",{key:e.group,class:"flex items-center bg-white shadow rounded-sm px-6 pt-3 pb-5 border border-white mr-8"},[t("span",P,n(e.count),1),t("span",T,n(e.group),1)]))),128))]),r(a).overViewStats?.worksheets?.length?i("v-if",!0):(s(),o("p",W,"I did not find any worksheet indicators to show")),q,z,t("div",G,[(s(!0),o(d,null,l(r(a).overViewStats?.extras,e=>(s(),o("div",{key:e.group,class:"flex items-center bg-white shadow rounded-sm px-6 pt-3 pb-5 border border-white mr-8"},[t("span",H,n(e.count),1),t("span",J,n(e.group),1)]))),128)),r(a).overViewStats?.extras?.length?i("v-if",!0):(s(),o("p",K,"I did not find any extra indicators to show"))])])],64))}}),Y=b(Q,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/dashboard/Overview.vue"]]);export{Y as default};
