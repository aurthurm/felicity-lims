import{d as p,r as f,x as v,o as r,c as _,b as o,F as y,E as k,I as h,f as s,i as x,t as b,A as a,D as n,j as i,_ as c,k as g}from"./index-6a324368.js";const A={class:"mt-4"},E={class:"bg-white shadow-md mt-2"},D={class:"-mb-px flex justify-start"},C=["onClick"],w=p({__name:"UsersAdmin",setup(P){const m=i(()=>c(()=>import("./UsersListing-a5ee2c3a.js"),["assets/UsersListing-a5ee2c3a.js","assets/index-6a324368.js","assets/index-fa5ef3d8.css"])),u=i(()=>c(()=>import("./Groups-0cd050ba.js"),["assets/Groups-0cd050ba.js","assets/index-6a324368.js","assets/index-fa5ef3d8.css"])),l=i(()=>c(()=>import("./Permissions-e5faf405.js"),["assets/Permissions-e5faf405.js","assets/index-6a324368.js","assets/index-fa5ef3d8.css"]));let e=f("users");const d=["users","groups","permissions"];return v(()=>"tab-"+e.value),(V,B)=>(r(),_("div",A,[o("nav",E,[o("div",D,[(r(),_(y,null,k(d,t=>o("a",{key:t,class:h(["no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-sky-600 hover:text-gray-200",{"tab-active":s(e)===t}]),onClick:I=>x(e)?e.value=t:e=t},b(t),11,C)),64))])]),s(e)==="users"?(r(),a(s(m),{key:0})):n("",!0),s(e)==="groups"?(r(),a(s(u),{key:1})):n("",!0),s(e)==="permissions"?(r(),a(s(l),{key:2})):n("",!0)]))}}),R=g(w,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/admin/users/UsersAdmin.vue"]]);export{R as default};
