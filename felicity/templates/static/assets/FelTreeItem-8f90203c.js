import{k as h,aN as v,y as k,n as y,o as a,c as s,b as T,D as p,t as l,E as i,J as u,f as n,F as C,G as x,B}from"./index-ab5e4518.js";const I={class:"cursor-pointer leading-6 mb-2"},S={key:0},D={name:"TreeItem"},F=Object.assign(D,{props:{tree:{type:Object,required:!0}},setup(e){const t=e,{tags:r,setActiveTree:m,activePath:o}=v(),d=()=>m(t.tree),g=k(()=>{if(!t.tree)return!1;switch(t.tree.tag){case r.storeRoom:return o.value.room===t.tree.uid;case r.storageLocation:return o.value.location===t.tree.uid;case r.storageSection:return o.value.section===t.tree.uid;case r.storageContainer:return o.value.container===t.tree.uid;default:return!1}});return(N,O)=>{const f=y("TreeItem");return a(),s("li",I,[T("div",{class:u([{"text-blue-500 font-bold":g.value}]),onClick:d},[p(l(e.tree?.name)+" ",1),e.tree.children?.length?(a(),s("span",S," ["+l(e.tree.isOpen?"-":"+")+"] ",1)):i("",!0)],2),e.tree.children?.length&&e.tree.isOpen?(a(),s("ul",{key:0,class:u(["pl-4 border-l-2",{"border-l-orange-200":e.tree.tag===n(r).storeRoom,"border-l-blue-200":e.tree.tag===n(r).storageLocation,"border-l-green-200":e.tree.tag===n(r).storageSection}])},[(a(!0),s(C,null,x(e.tree?.children,(c,b)=>(a(),B(f,{key:c.uid||b,tree:c},null,8,["tree"]))),128))],2)):i("",!0)])}}}),V=h(F,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/components/storage/FelTreeItem.vue"]]);export{V as default};
