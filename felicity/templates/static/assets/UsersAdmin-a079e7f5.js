import{d as p,r as f,x as v,o as r,c as _,b as o,F as y,E as k,I as h,f as s,i as x,t as b,B as a,A as i,j as n,_ as c,k as g}from"./index-4d0d48ab.js";const A={class:"mt-4"},E={class:"bg-white shadow-md mt-2"},C={class:"-mb-px flex justify-start"},D=["onClick"],w=p({__name:"UsersAdmin",setup(B){const m=n(()=>c(()=>import("./UsersListing-b13db15d.js"),["assets/UsersListing-b13db15d.js","assets/index-4d0d48ab.js","assets/index-c2286288.css"])),u=n(()=>c(()=>import("./Groups-113a65c6.js"),["assets/Groups-113a65c6.js","assets/index-4d0d48ab.js","assets/index-c2286288.css"])),l=n(()=>c(()=>import("./Permissions-2b56bf7d.js"),["assets/Permissions-2b56bf7d.js","assets/index-4d0d48ab.js","assets/index-c2286288.css"]));let e=f("users");const d=["users","groups","permissions"];return v(()=>"tab-"+e.value),(P,V)=>(r(),_("div",A,[o("nav",E,[o("div",C,[(r(),_(y,null,k(d,t=>o("a",{key:t,class:h(["no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-sky-600 hover:text-gray-200",{"tab-active":s(e)===t}]),onClick:I=>x(e)?e.value=t:e=t},b(t),11,D)),64))])]),s(e)==="users"?(r(),a(s(m),{key:0})):i("v-if",!0),s(e)==="groups"?(r(),a(s(u),{key:1})):i("v-if",!0),s(e)==="permissions"?(r(),a(s(l),{key:2})):i("v-if",!0)]))}}),R=g(w,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/admin/users/UsersAdmin.vue"]]);export{R as default};
