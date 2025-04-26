import{S as x,a6 as _,i as d,a0 as p,a7 as w,o,c as i,N as s,H as h,F as u,E as k,_ as S}from"./index-54016222.js";import{u as D}from"./samples-7242f2e2.js";import"./analyses.mutations-fdbdb917.js";import"./storage.mutations-f3ea605c.js";const C={class:"mx-auto w-fit"},Z={class:"flex items-center justify-start gap-x-1"},B={class:"mr-2"},U={id:"printZoneOuter"},N={id:"printZone",class:"mx-auto w-fit max-h-[750px] overflow-y-scroll overscroll-contain"},O=["src"],$="40mm 30mm",A=x({__name:"index",setup(E){const m=_(),{barcodeSamples:c}=D(),v=d(()=>{if(window.history.state.sampleUids)return JSON.parse(window.history.state.sampleUids);const t=JSON.parse(m.query.sampleUids?.toString()??"");return Array.isArray(t)?t:t?.split(",")}),n=p(2),r=(t=!0)=>{if(t)n.value++;else{if(n.value===1)return;n.value--}},a=p([]);w(async()=>{a.value=await c(v.value)});const f=d(()=>a.value.flatMap(t=>Array(n.value).fill(t))),y=t=>`data:application/png;base64,${t}`,b=()=>{const t=document.getElementById("printZoneOuter").innerHTML,e=window.open("","_blank");e&&(e.document.open(),e.document.write(`
      <html>
        <head>
          <title>Print Stickers</title>
          <style>
            @media print {
              @page {
                size: ${$};
                margin: 0;
              }
              body * {
                visibility: hidden;
              }
              #printZone, #printZone * {
                visibility: visible;
              }
              #printZone {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
              }
            }
          </style>
        </head>
        <body>
          ${t}
        </body>
      </html>`),e.document.close(),e.print(),e.close())};return(t,e)=>(o(),i(u,null,[s("div",C,[s("div",Z,[s("span",{class:"select-none rounded-sm bg-muted px-2 py-0 text-lg font-semibold hover:cursor-pointer",onClick:e[0]||(e[0]=()=>r(!1))}," - "),s("span",B,"Count: "+h(n.value),1),s("span",{class:"select-none rounded-sm bg-accent px-2 py-0 text-lg font-semibold hover:cursor-pointer",onClick:e[1]||(e[1]=()=>r(!0))}," + "),s("button",{type:"submit",class:"ml-4 rounded-sm border border-destructive px-2 py-1 text-orange-500 transition duration-300 hover:bg-destructive hover:text-primary-foreground focus:outline-none",onClick:e[2]||(e[2]=l=>b())},e[3]||(e[3]=[s("span",null,"Print",-1)]))])]),e[4]||(e[4]=s("hr",{class:"my-4"},null,-1)),s("div",U,[s("div",N,[(o(!0),i(u,null,k(f.value,(l,g)=>(o(),i("div",{key:g,class:"mb-1"},[s("img",{src:y(l)},null,8,O)]))),128))])])],64))}}),L=S(A,[["__file","/Users/admin/Documents/Development/felicity/felicity-lims/webapp/views/barcode/index.vue"]]);export{L as default};
