import{P as g,a9 as x,Z as d,aa as h,h as w,o as i,c as r,b as s,E as _,F as u,D as k,_ as D}from"./index-e1b11e1a.js";import{u as S}from"./samples-638c9b20.js";import"./analyses.mutations-53bc24e5.js";import"./storage.mutations-05515c2a.js";const Z={class:"mx-auto w-fit"},C={class:"flex justify-start items-center gap-x-1"},B={class:"mr-2"},O={id:"printZoneOuter"},U={id:"printZone",class:"mx-auto w-fit overflow-y-scroll overscroll-contain max-h-[750px]"},$=["src"],A="40mm 30mm",E=g({__name:"index",setup(M){const m=x();let n=[];if(window.history.state.sampleUids)n=JSON.parse(window.history.state.sampleUids??"");else{const t=JSON.parse(m.query.sampleUids?.toString()??"");n=Array.isArray(t)?t:t?.split(",")}const o=d(2),a=(t=!0)=>{if(t)o.value++;else{if(o.value===1)return;o.value--}},l=d([]);h(async()=>{l.value=await y(n)});const c=w(()=>l.value.flatMap(t=>Array(o.value).fill(t))),{barcodeSamples:y}=S(),b=t=>`data:application/png;base64,${t}`,f=()=>{const t=document.getElementById("printZoneOuter").innerHTML,e=window.open("","_blank");e&&(e.document.open(),e.document.write(`
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
              ${t}
            </body>
          </html>`),e.document.close(),e.print(),e.close())};return(t,e)=>(i(),r(u,null,[s("div",Z,[s("div",C,[s("span",{class:"bg-gray-500 text-lg font-semibold px-2 py-0 rounded-sm hover:cursor-pointer select-none",onClick:e[0]||(e[0]=()=>a(!1))},"-"),s("span",B,"Count: "+_(o.value),1),s("span",{class:"bg-blue-500 text-lg font-semibold px-2 py-0 rounded-sm hover:cursor-pointer select-none",onClick:e[1]||(e[1]=()=>a(!0))},"+"),s("button",{type:"submit",class:"ml-4 px-2 py-1 border-orange-500 border text-orange-500rounded-smtransition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none",onClick:e[2]||(e[2]=p=>f())},e[3]||(e[3]=[s("span",null,"Print",-1)]))])]),e[4]||(e[4]=s("hr",{class:"my-4"},null,-1)),s("div",O,[s("div",U,[(i(!0),r(u,null,k(c.value,(p,v)=>(i(),r("div",{key:v,class:"mb-1"},[s("img",{src:b(p)},null,8,$)]))),128))])])],64))}}),L=D(E,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/barcode/index.vue"]]);export{L as default};
