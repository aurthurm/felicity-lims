import{d as k,X as x,r as D,D as p,n as h,o as s,c as l,e as E,b as m,F as C,p as S,y as T,t as w,q as r,f as o,x as i,j as c,_,k as A}from"./index-467d1dc5.js";const L={class:"col-span-12"},V={class:"bg-white shadow-md mt-2"},I={class:"-mb-px flex justify-start"},O=["onClick"],P=k({__name:"SampleDetail",setup(R){const d=c(()=>_(()=>import("./Results-3d5ac4c0.js"),["assets/Results-3d5ac4c0.js","assets/index-467d1dc5.js","assets/index-fbaa55c8.css","assets/analysis-3a30d8cb.js","assets/constants-090318e0.js"])),v=c(()=>_(()=>import("./ManageAnalyses-77f9b00f.js"),["assets/ManageAnalyses-77f9b00f.js","assets/index-467d1dc5.js","assets/index-fbaa55c8.css"])),y=c(()=>_(()=>import("./Impress-c5aab0ac.js"),["assets/Impress-c5aab0ac.js","assets/index-467d1dc5.js","assets/index-fbaa55c8.css","assets/samples-c4e3f64b.js"])),f=c(()=>_(()=>import("./FelAuditLog-03fcd94d.js"),["assets/FelAuditLog-03fcd94d.js","assets/index-467d1dc5.js","assets/index-fbaa55c8.css"])),u=x(),e=D("analysis-results"),g=p(()=>{const n=["analysis-results","manage-analyses","logs","impress-reports"];if(u.sample?.status==="published"){const a=n.indexOf("manage-analyses");a!==-1&&n.splice(a,1)}return n});return p(()=>"tab-"+e),(n,a)=>{const b=h("motion-slide-left");return s(),l("section",L,[E((s(),l("nav",V,[m("div",I,[(s(!0),l(C,null,S(g.value,t=>(s(),l("a",{key:t,class:T(["no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-sky-600 hover:text-gray-200",{"tab-active":e.value===t}]),onClick:B=>e.value=t},w(t),11,O))),128))])])),[[b]]),m("div",null,[e.value==="analysis-results"?(s(),r(o(d),{key:0})):i("",!0),e.value==="manage-analyses"?(s(),r(o(v),{key:1,onChangeTab:a[0]||(a[0]=t=>e.value=t)})):i("",!0),e.value==="logs"?(s(),r(o(f),{key:2,targetType:"sample",targetUid:o(u).sample?.uid},null,8,["targetUid"])):i("",!0),e.value==="impress-reports"?(s(),r(o(y),{key:3})):i("",!0)])])}}}),F=A(P,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/sample/_id/SampleDetail.vue"]]);export{F as default};
