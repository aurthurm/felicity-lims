import{d as u,L as c,X as i,r as p,D as d,g as e,j as o,_ as a}from"./index-03fd00e9.js";const m=o(()=>a(()=>import("./StockCategory-6ee42a53.js"),["assets/StockCategory-6ee42a53.js","assets/index-03fd00e9.js","assets/index-91994633.css","assets/inventory.mutations-f6707a36.js"])),_=o(()=>a(()=>import("./StockItem-24f2f7b8.js"),["assets/StockItem-24f2f7b8.js","assets/index-03fd00e9.js","assets/index-91994633.css","assets/inventory.mutations-f6707a36.js"])),v=o(()=>a(()=>import("./StockUnit-bfa45be8.js"),["assets/StockUnit-bfa45be8.js","assets/index-03fd00e9.js","assets/index-91994633.css","assets/inventory.mutations-f6707a36.js"])),k=o(()=>a(()=>import("./Hazard-0ade83d3.js"),["assets/Hazard-0ade83d3.js","assets/index-03fd00e9.js","assets/index-91994633.css","assets/inventory.mutations-f6707a36.js"])),f=u({name:"InventoryHome",setup(t){const r=c(),s=i();let n=p("stock-categories");const l=["stock-categories","hazards","stock-units","stock-items"];return d(()=>"tab-"+n.value),s.fetchSampleTypes(),r.fetchDepartments({}),{exposed:{currentTab:n,tabs:l}}},render(){const{currentTab:t,tabs:r}=this.exposed;return e("div",{class:"mt-4"},[e("nav",{class:"bg-white shadow-md mt-2"},[e("div",{class:"-mb-px flex justify-start"},[r.map(s=>e("a",{key:s,class:["no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-sky-600 hover:text-gray-200",{"tab-active":t.value===s}],onClick:()=>t.value=s,role:"tab"},[s]))])]),t.value==="stock-items"?e(_,null,null):null,t.value==="stock-categories"?e(m,null,null):null,t.value==="stock-units"?e(v,null,null):null,t.value==="hazards"?e(k,null,null):null])}});export{f as InventoryHome,f as default};
