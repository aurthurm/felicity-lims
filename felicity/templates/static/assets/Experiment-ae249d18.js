import{d as p,C as n,o as u,q as d,f as h,j as f,_,k as v}from"./index-2a6c9271.js";const b=p({__name:"Experiment",setup(y){const s=f(()=>_(()=>import("./DataTable-ef278be7.js"),["assets/DataTable-ef278be7.js","assets/index-2a6c9271.js","assets/index-88806377.css"])),l=n([{name:"UID",value:"uid",sortable:!0,sortBy:"asc",defaultSort:!0,hidden:!0},{name:"Patient Name",value:"patient.name",sortable:!1,sortBy:"asc",hidden:!1},{name:"Gender",value:"patient.gender",sortable:!1,sortBy:"asc",hidden:!0},{name:"BirthDate",value:"patient.birthDate",sortable:!1,sortBy:"asc",hidden:!0},{name:"Sample ID",value:"sampleId",sortable:!1,sortBy:"asc",hidden:!1},{name:"Sample Type",value:"sampleType.name",sortable:!1,sortBy:"asc",hidden:!1}]),a=n([{sampleId:"BP23-982392",sampleType:{name:"Blood Plasma"},patient:{name:"Aurthur",gender:"Female",birthDate:"2020-12-12"}},{sampleId:"DBS23-0001",sampleType:{name:"Dry Blood Spot"},patient:{name:"Tatenda",gender:"Female",birthDate:"2020-12-12"}}]),r=e=>{},o=e=>{},m=e=>{},c=e=>{Object.assign(a,[...a.map(t=>t.sampleId===e.entry.sampleId?{...t,checked:!0}:t)])},i=()=>Object.assign(a,[...a.map(e=>({...e,checked:!0}))]);return(e,t)=>(u(),d(h(s),{columns:l,data:a,toggleColumns:!0,loading:!1,onOnSort:r,paginable:!0,pageMeta:{fetchCount:50,hasNextPage:!1},onOnPaginate:o,searchable:!0,searchMeta:{defaultFilter:"all",filters:[{name:"All",value:"all"}]},onOnSearch:m,onOnCheck:c,onOnCheckAll:i},null,8,["columns","data"]))}}),B=v(b,[["__file","/home/aurthur/Documents/Development/felicity-lims/webapp/views/experiment/Experiment.vue"]]);export{B as default};
