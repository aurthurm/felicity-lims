import{d as L,b6 as A,s as N,q as j,r as I,y as $,V as _,m as P,o as i,c as u,b as t,e as f,P as x,f as o,F as y,E as w,B as k,C as h,D as U,t as p,I as H,i as R,A as g,g as O,v as C,w as W,h as q,j as S,_ as T,b7 as D,k as z}from"./index-4d0d48ab.js";import{C as G}from"./index-edbf3be2.js";const J={class:"flex justify-between"},K={class:"flex justify-end align-items-center mt-4 mb-8"},Q=["onClick"],X={key:0,class:"text-start my-4 w-100"},Y=t("h1",{class:"text-xl text-gray-700 font-semibold"},"Instrument Matrix / Load",-1),Z=t("hr",{class:"my-2"},null,-1),ee={key:0},te={key:1,class:"flex justify-start"},se={class:"mr-4 font-bold text-gray-600 text-xl"},oe={class:"font-semibold text-gray-400 text-l"},re=q('<h1 class="mt-8 text-xl text-gray-700 font-semibold">User Matrix / Load</h1><hr class="my-2"><div class="flex flex-wrap justify-start" id="user-matrix"><div><div id="registration"></div></div><div><div id="submission"></div></div><div><div id="verification"></div></div><div><div id="publication"></div></div></div>',3),ne=t("h3",null,"Custom Filter Date Range",-1),ae={action:"post",class:"p-1"},ie={class:"grid grid-cols-2 gap-x-4 mb-4"},le={class:"block col-span-2 mb-2"},de=t("span",{class:"text-gray-700"},"Date From",-1),ce={class:"block col-span-2 mb-2"},ue=t("span",{class:"text-gray-700"},"Date To",-1),me=t("hr",null,null,-1),pe=L({__name:"Resource",setup(ve){const F=S(()=>T(()=>import("./FelModal-599b9c12.js"),["assets/FelModal-599b9c12.js","assets/index-4d0d48ab.js","assets/index-c2286288.css","assets/FelModal-780aeea9.css"])),M=S(()=>T(()=>import("./FelLoadingMessage-e29e7357.js"),["assets/FelLoadingMessage-e29e7357.js","assets/index-4d0d48ab.js","assets/index-c2286288.css"])),c=A(),{dashboard:r}=N(c),m=j({range:{from:"",to:""}});let l=I(!1);const V=()=>{c.setFilterRange(D(m.range.from),D(m.range.to)),l.value=!1};$(async()=>{b(),c.setShowFilters(!0),c.getResourceStats()}),_(()=>r.value.filterRange.from,(d,s)=>{b(),c.getResourceStats()}),_(()=>r.value.resourceStats?.samples,(d,s)=>{r.value.resourceStats?.samples?.forEach(a=>{let e=[],v=0;a.counts?.forEach(n=>v+=n.count),a.counts?.forEach(n=>{e.push({item:n.group,count:n.count,percent:n.count/v})}),B(e,a.group,a.group)})});const E=d=>{let s=0;return r.value.resourceStats?.instruments?.forEach(e=>s+=e.count),(d/s*100).toFixed(2)+" %"},B=(d,s,a)=>{const e=new G({container:s,autoFit:!0,height:250,width:500,localRefresh:!1});e.coordinate("theta",{radius:.75,innerRadius:.5}),e.data(d),e.scale("percent",{formatter:n=>(n=(n*100).toFixed(2)+"%",n)}),e.tooltip({showTitle:!1,showMarkers:!1}),e.legend(!1),e.interval().position("percent").color("item").label("percent",{layout:[{type:"pie-spider"},{type:"hide-overlap"}],offset:8,labelHeight:38,content:n=>`${n.item} (${n.count})`,labelLine:{style:{lineWidth:.5}}}).adjust("stack"),e.createView().annotation().text({position:["50%","50%"],content:a,style:{fill:"#262626",textAlign:"center"}}),e.interaction("element-active"),e.render()},b=()=>{document.getElementById("user-matrix").innerHTML="";const d=`
      <div>
        <div id="registration"></div>
      </div>
      <div>
        <div id="submission"></div>
      </div>
      <div>
        <div id="verification"></div>
      </div>
      <div>
        <div id="publication"></div>
      </div>
    `;document.getElementById("user-matrix").innerHTML=d};return(d,s)=>{const a=P("VTooltip");return i(),u(y,null,[t("section",J,[f(t("div",K,[(i(!0),u(y,null,w(o(r).filters,(e,v)=>f((i(),k(a,{key:v,placements:["right-start"]},{popper:h(()=>[U(p(o(c).filterToolTip(e)),1)]),default:h(()=>[t("button",{onClick:n=>o(c).setCurrentFilter(e),type:"button",class:H(["px-2 py-1 mr-2 border-gray-800 border text-gray-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none",{"bg-sky-800 text-white":o(r).currentFilter===e}])},p(e),11,Q)]),_:2},1024)),[[x,e!==o(r).filters[o(r).filters.length]]])),128)),t("button",{onClick:s[0]||(s[0]=e=>R(l)?l.value=!0:l=!0),class:"ml-4 mr-1 px-2 py-1 border-gray-500 border text-gray-500 rounded-sm transition duration-300 hover:bg-gray-700 hover:text-white focus:outline-none"},p(o(r).filterRange.from)+" - "+p(o(r).filterRange.to),1),g(` <button\r
        type="button"\r
        class="px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"\r
      >\r
        Apply\r
      </button> `)],512),[[x,o(r).showFilters]])]),o(r).fetchingResourceStats?(i(),u("div",X,[O(o(M),{message:"fetching resource stats ..."})])):g("v-if",!0),t("section",null,[Y,Z,o(r).resourceStats?.instruments?.length===0?(i(),u("div",ee,"NO DATA")):(i(),u("div",te,[(i(!0),u(y,null,w(o(r).resourceStats?.instruments,e=>(i(),u("div",{key:e.group,class:"flex items-center bg-white shadow rounded-sm px-6 pt-3 pb-5 border border-white mr-8"},[t("span",se,p(E(e?.count)),1),t("span",oe,p(e.group),1)]))),128))])),re]),g(" Custome Dat Range Modal "),o(l)?(i(),k(o(F),{key:1,onClose:s[4]||(s[4]=e=>R(l)?l.value=!1:l=!1),contentWidth:"w-1/4"},{header:h(()=>[ne]),body:h(()=>[t("form",ae,[t("div",ie,[t("label",le,[de,f(t("input",{type:"datetime-local",class:"form-input mt-1 block w-full",autocomplete:"off","onUpdate:modelValue":s[1]||(s[1]=e=>m.range.from=e),placeholder:"Name ..."},null,512),[[C,m.range.from]])]),t("label",ce,[ue,f(t("input",{type:"datetime-local",class:"form-input mt-1 block w-full","onUpdate:modelValue":s[2]||(s[2]=e=>m.range.to=e),placeholder:"Name ..."},null,512),[[C,m.range.to]])])]),me,t("button",{type:"button",onClick:s[3]||(s[3]=W(e=>V(),["prevent"])),class:"-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"}," Save Form ")])]),_:1})):g("v-if",!0)],64)}}}),ge=z(pe,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/dashboard/Resource.vue"]]);export{ge as default};
