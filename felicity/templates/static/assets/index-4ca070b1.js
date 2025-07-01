import{V as x,a7 as _,i as d,a1 as u,a8 as h,o,c as i,O as s,J as w,F as p,H as k,_ as D}from"./index-74595aff.js";import{u as S}from"./samples-32befe81.js";import"./analyses.mutations-185deb2b.js";import"./storage.mutations-3f78de8a.js";const C={class:"mx-auto w-fit"},Z={class:"flex items-center justify-start gap-x-1"},B={class:"mr-2"},O={id:"printZoneOuter"},U={id:"printZone",class:"mx-auto w-fit max-h-[750px] overflow-y-scroll overscroll-contain"},$=["src"],A="40mm 30mm",J=x({__name:"index",setup(M){const m=_(),{barcodeSamples:c}=S(),v=d(()=>{if(window.history.state.sampleUids)return JSON.parse(window.history.state.sampleUids);const e=JSON.parse(m.query.sampleUids?.toString()??"");return Array.isArray(e)?e:e?.split(",")}),n=u(2),r=(e=!0)=>{if(e)n.value++;else{if(n.value===1)return;n.value--}},a=u([]);h(async()=>{a.value=await c(v.value)});const f=d(()=>a.value.flatMap(e=>Array(n.value).fill(e))),y=e=>`data:application/png;base64,${e}`,b=()=>{const e=document.getElementById("printZoneOuter").innerHTML,t=window.open("","_blank");t&&(t.document.open(),t.document.write(`
      <html>
        <head>
          <title>Print Stickers</title>
          <style>
            @media print {
              @page {
                size: ${A};
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
          ${e}
        </body>
      </html>`),t.document.close(),t.print(),t.close())};return(e,t)=>(o(),i(p,null,[s("div",C,[s("div",Z,[s("span",{class:"select-none rounded-sm bg-muted px-2 py-0 text-lg font-semibold hover:cursor-pointer",onClick:t[0]||(t[0]=()=>r(!1))}," - "),s("span",B,"Count: "+w(n.value),1),s("span",{class:"select-none rounded-sm bg-accent px-2 py-0 text-lg font-semibold hover:cursor-pointer",onClick:t[1]||(t[1]=()=>r(!0))}," + "),s("button",{type:"submit",class:"ml-4 rounded-sm border border-destructive px-2 py-1 text-orange-500 transition duration-300 hover:bg-destructive hover:text-primary-foreground focus:outline-none",onClick:t[2]||(t[2]=l=>b())},t[3]||(t[3]=[s("span",null,"Print",-1)]))])]),t[4]||(t[4]=s("hr",{class:"my-4"},null,-1)),s("div",O,[s("div",U,[(o(!0),i(p,null,k(f.value,(l,g)=>(o(),i("div",{key:g,class:"mb-1"},[s("img",{src:y(l)},null,8,$)]))),128))])])],64))}}),L=D(J,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/barcode/index.vue"]]);export{L as default};
