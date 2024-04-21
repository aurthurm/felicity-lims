import{d as u,L as c,W as i,r as p,D as _,g as t,j as s,_ as a}from"./index-2a6c9271.js";const m=s(()=>a(()=>import("./StockCategory-a5c0f217.js"),["assets/StockCategory-a5c0f217.js","assets/index-2a6c9271.js","assets/index-88806377.css","assets/inventory.mutations-6db1ac57.js"])),d=s(()=>a(()=>import("./StockItem-81e6c79e.js"),["assets/StockItem-81e6c79e.js","assets/index-2a6c9271.js","assets/index-88806377.css","assets/inventory.mutations-6db1ac57.js"])),v=s(()=>a(()=>import("./StockPackaging-f15bc74a.js"),["assets/StockPackaging-f15bc74a.js","assets/index-2a6c9271.js","assets/index-88806377.css","assets/inventory.mutations-6db1ac57.js"])),k=s(()=>a(()=>import("./StockUnit-c338f5b6.js"),["assets/StockUnit-c338f5b6.js","assets/index-2a6c9271.js","assets/index-88806377.css","assets/inventory.mutations-6db1ac57.js"])),g=s(()=>a(()=>import("./Hazard-fff66ffb.js"),["assets/Hazard-fff66ffb.js","assets/index-2a6c9271.js","assets/index-88806377.css","assets/inventory.mutations-6db1ac57.js"])),S=u({name:"InventoryHome",setup(e){const n=c(),o=i();let l=p("stock-items");const r=["stock-items","stock-categories","hazards","stock-units","stock-packaging"];return _(()=>"tab-"+l.value),o.fetchSampleTypes(),n.fetchDepartments({}),{exposed:{currentTab:l,tabs:r}}},render(){const{currentTab:e,tabs:n}=this.exposed;return t("div",{class:"mt-4"},[t("nav",{class:"bg-white shadow-md mt-2"},[t("div",{class:"-mb-px flex justify-start"},[n.map(o=>t("a",{key:o,class:["no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-sky-600 hover:text-gray-200",{"tab-active":e.value===o}],onClick:()=>e.value=o,role:"tab"},[o]))])]),e.value==="stock-items"?t(d,null,null):null,e.value==="stock-categories"?t(m,null,null):null,e.value==="stock-packaging"?t(v,null,null):null,e.value==="stock-units"?t(k,null,null):null,e.value==="hazards"?t(g,null,null):null])}});export{S as InventoryHome,S as default};
