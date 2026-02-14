import{a0 as g,ac as x,h as u,a7 as f,ad as h,_ as w,c,o as p,A as n,L as k,J as v,K as D}from"./index-DApeomWQ.js";import{u as S}from"./samples-DyvvG50W.js";import"./analyses.mutations-Bu696l9I.js";import"./storage.mutations-DsadjqQH.js";const b="40mm 30mm",B=g({name:"BarcodePrintView",__name:"index",setup(y,{expose:e}){e();const l=x(),{barcodeSamples:s}=S(),d=u(()=>{if(window.history.state.sampleUids)return JSON.parse(window.history.state.sampleUids);const t=JSON.parse(l.query.sampleUids?.toString()??"");return Array.isArray(t)?t:t?.split(",")}),i=f(2),a=(t=!0)=>{if(t)i.value++;else{if(i.value===1)return;i.value--}},r=f([]);h(async()=>{r.value=await s(d.value)});const _=u(()=>r.value.flatMap(t=>Array(i.value).fill(t))),m={route:l,barcodeSamples:s,sampleUids:d,multiplier:i,increment:a,originalData:r,barcodes:_,imgData:t=>`data:application/png;base64,${t}`,printDimensions:b,printBarcodes:()=>{const t=document.getElementById("printZoneOuter").innerHTML,o=window.open("","_blank");o&&(o.document.open(),o.document.write(`
      <html>
        <head>
          <title>Print Stickers</title>
          <style>
            @media print {
              @page {
                size: ${b};
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
      </html>`),o.document.close(),o.print(),o.close())}};return Object.defineProperty(m,"__isScriptSetup",{enumerable:!1,value:!0}),m}}),C={class:"mx-auto w-fit"},Z={class:"flex items-center justify-start gap-x-1"},O={class:"mr-2"},A={id:"printZoneOuter"},P={id:"printZone",class:"mx-auto w-fit max-h-[750px] overflow-y-scroll overscroll-contain"},U=["src"];function J(y,e,l,s,d,i){return p(),c(v,null,[n("div",C,[n("div",Z,[n("span",{class:"select-none rounded-sm bg-muted px-2 py-0 text-lg font-semibold hover:cursor-pointer",onClick:e[0]||(e[0]=()=>s.increment(!1))}," - "),n("span",O,"Count: "+k(s.multiplier),1),n("span",{class:"select-none rounded-sm bg-accent px-2 py-0 text-lg font-semibold hover:cursor-pointer",onClick:e[1]||(e[1]=()=>s.increment(!0))}," + "),n("button",{type:"submit",class:"ml-4 rounded-sm border border-destructive px-2 py-1 text-destructive transition duration-300 hover:bg-destructive hover:text-primary-foreground focus:outline-none",onClick:e[2]||(e[2]=a=>s.printBarcodes())},[...e[3]||(e[3]=[n("span",null,"Print",-1)])])])]),e[4]||(e[4]=n("hr",{class:"my-4"},null,-1)),n("div",A,[n("div",P,[(p(!0),c(v,null,D(s.barcodes,(a,r)=>(p(),c("div",{key:r,class:"mb-1"},[n("img",{src:s.imgData(a)},null,8,U)]))),128))])])],64)}const $=w(B,[["render",J],["__file","/home/administrator/Documents/Development/beak-insights/felicity/felicity-lims/webapp/views/barcode/index.vue"]]);export{$ as default};
