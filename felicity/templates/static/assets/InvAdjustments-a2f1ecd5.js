import{_ as s,aB as l}from"./billing-356772f3.js";import{G as n,f as r,r as o,C as u,B as e,F as d}from"./_plugin-vue_export-helper-3f67fb71.js";const f=n(()=>s(()=>import("./DataTable-6e858f1d.js"),["assets/DataTable-6e858f1d.js","assets/_plugin-vue_export-helper-3f67fb71.js","assets/runtime-dom.esm-bundler-6e07ef74.js"])),h=r({name:"stock-adjustments",setup(m,i){const a=l();return a.fetchAdjustments({first:50,after:"",text:"",sortBy:["-uid"]}),{tableColumns:o([{name:"UID",value:"uid",sortable:!0,sortBy:"asc",defaultSort:!0,showInToggler:!1,hidden:!0},{name:"ID",value:"uid",sortable:!1,sortBy:"asc",hidden:!1},{name:"Product",value:"product.name",sortable:!1,sortBy:"asc",hidden:!1},{name:"Adjustment Type",value:"adjustmentType",sortable:!1,sortBy:"asc",hidden:!1},{name:"Adjustment",value:"adjust",sortable:!1,sortBy:"asc",hidden:!1},{name:"Date Adjusted",value:"adjustmentDate",sortable:!1,sortBy:"asc",hidden:!1},{name:"Remarks",value:"remarks",sortable:!1,sortBy:"asc",hidden:!1},{name:"Adjusted by",value:"adjustmentBy.firstName",sortable:!1,sortBy:"asc",hidden:!1,customRender:function(t){return u("span",{innerHTML:`${t?.adjustmentBy?.firstName??"---"} ${t?.adjustmentBy?.lastName??""}`},[])}}]),inventoryStore:a}},render(){return e(d,null,[e("div",null,null),e(f,{columns:this.tableColumns,data:this.inventoryStore.adjustments,toggleColumns:!1,loading:!1,paginable:!1,pageMeta:{fetchCount:10,hasNextPage:!1,countNone:""},searchable:!1,filterable:!1,filterMeta:{defaultFilter:"",filters:[]},selectable:!1,allChecked:!1},null)])}});export{h as InventoryAdjustments,h as default};
