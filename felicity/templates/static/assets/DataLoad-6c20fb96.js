import{d as u,r,o as s,c as t,w as p,g as _,f,b as e,j as m,a as n,_ as h,aq as v,k as y}from"./index-03fd00e9.js";const b={class:"mt-4"},g=e("div",{class:"mt-2"},[e("h2",{class:"h2 mb-4"},"Load Default Setup Data"),e("hr"),e("p",null,"Load analysis, services, profiles, sample types etc")],-1),k={key:1,class:"mt-4"},D=u({__name:"DataLoad",setup(L){const l=m(()=>h(()=>import("./FelLoadingMessage-6ca9c805.js"),["assets/FelLoadingMessage-6ca9c805.js","assets/index-03fd00e9.js","assets/index-91994633.css"])),{toastSuccess:d}=v(),a=r(!1),i=c=>{a.value=!0,n.defaults.timeout=1e3*30,n.post("setup/load-default-setup").then(o=>d(o.data.message)).finally(()=>a.value=!1)};return(c,o)=>(s(),t("div",b,[g,a.value?(s(),t("div",k,[_(f(l),{message:"Loading default setup data ..."})])):(s(),t("button",{key:0,type:"button",onClick:p(i,["prevent"]),class:"mt-4 px-2 py-1 border border-sky-800 bg-sky-800 text-white rounded-sm transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," load setup data "))]))}}),x=y(D,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/admin/data-load/DataLoad.vue"]]);export{x as default};
