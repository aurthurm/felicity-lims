import{d as E,K as b,W as h,N as D,r as x,x as R,o as t,c as i,b as l,F as T,E as g,I as C,f as e,i as L,t as P,A as a,D as S,j as o,_ as n,k as V}from"./index-6a324368.js";const I={class:"mt-4"},O={class:"bg-white shadow-md mt-2"},j={class:"-mb-px flex justify-start"},q=["onClick"],w=E({__name:"AnalysesAdmin",setup(B){const c=o(()=>n(()=>import("./AnalysesCategories-9d6a102f.js"),["assets/AnalysesCategories-9d6a102f.js","assets/index-6a324368.js","assets/index-fa5ef3d8.css"])),_=o(()=>n(()=>import("./AnalysesProfiles-808afcca.js"),["assets/AnalysesProfiles-808afcca.js","assets/index-6a324368.js","assets/index-fa5ef3d8.css"])),m=o(()=>n(()=>import("./AnalysesTemplates-b41dbcca.js"),["assets/AnalysesTemplates-b41dbcca.js","assets/index-6a324368.js","assets/index-fa5ef3d8.css"])),p=o(()=>n(()=>import("./ServicesAdmin-3be9b5a3.js"),["assets/ServicesAdmin-3be9b5a3.js","assets/index-6a324368.js","assets/index-fa5ef3d8.css"])),y=o(()=>n(()=>import("./QCLevels-758f6954.js"),["assets/QCLevels-758f6954.js","assets/index-6a324368.js","assets/index-fa5ef3d8.css","assets/QCLevels-b0e61712.css"])),u=o(()=>n(()=>import("./QCTemplates-ecf60844.js"),["assets/QCTemplates-ecf60844.js","assets/index-6a324368.js","assets/index-fa5ef3d8.css"])),d=o(()=>n(()=>import("./RejectionReasons-b6d2a083.js"),["assets/RejectionReasons-b6d2a083.js","assets/index-6a324368.js","assets/index-fa5ef3d8.css"])),v=b(),f=h(),A=D();let s=x(A.query.tab||"analyses-profiles");const k=["analyses-profiles","analyses-services","analyses-templates","analyses-categories","quality-control-levels","quality-control-templates","rejection-reasons"];return R(()=>"tab-"+s.value),f.fetchSampleTypes(),v.fetchDepartments({}),(N,F)=>(t(),i("div",I,[l("nav",O,[l("div",j,[(t(),i(T,null,g(k,r=>l("a",{key:r,class:C(["no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-sky-600 hover:text-gray-200",{"tab-active":e(s)===r}]),onClick:Q=>L(s)?s.value=r:s=r},P(r),11,q)),64))])]),e(s)==="analyses-profiles"?(t(),a(e(_),{key:0})):e(s)==="analyses-services"?(t(),a(e(p),{key:1})):e(s)==="analyses-templates"?(t(),a(e(m),{key:2})):e(s)==="analyses-categories"?(t(),a(e(c),{key:3})):e(s)==="quality-control-levels"?(t(),a(e(y),{key:4})):e(s)==="quality-control-templates"?(t(),a(e(u),{key:5})):e(s)==="rejection-reasons"?(t(),a(e(d),{key:6})):S("",!0)]))}}),K=V(w,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/admin/analyses/AnalysesAdmin.vue"]]);export{K as default};
