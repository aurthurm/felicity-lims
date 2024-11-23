import{d as _,J as h,r as p,q as g,p as x,o as i,c as r,b as s,t as w,F as c,C as k,k as C}from"./index-b31857b9.js";import{u as D}from"./samples-888596b0.js";import"./analyses.mutations-e540caf1.js";import"./storage.mutations-06ebd601.js";const S={class:"mx-auto w-fit"},Z={class:"flex justify-start items-center gap-x-1"},B={class:"mr-2"},O=s("span",null,"Print",-1),U=[O],$=s("hr",{class:"my-4"},null,-1),A={id:"printZoneOuter"},J={id:"printZone",class:"mx-auto w-fit overflow-y-scroll overscroll-contain max-h-[750px]"},M=["src"],N="40mm 30mm",q=_({__name:"index",setup(E){const u=h();let n=[];if(window.history.state.sampleUids)n=JSON.parse(window.history.state.sampleUids??"");else{const t=JSON.parse(u.query.sampleUids?.toString()??"");n=Array.isArray(t)?t:t?.split(",")}const o=p(2),a=(t=!0)=>{if(t)o.value++;else{if(o.value===1)return;o.value--}},l=p([]);g(async()=>{console.log(n),l.value=await y(n)});const m=x(()=>l.value.flatMap(t=>Array(o.value).fill(t))),{barcodeSamples:y}=D(),b=t=>`data:application/png;base64,${t}`,f=()=>{const t=document.getElementById("printZoneOuter").innerHTML,e=window.open("","_blank");e&&(e.document.open(),e.document.write(`
          <html>
            <head>
              <title>Print Stickers</title>
              <style>
                  @media print {
                    @page {
                      size: ${N};
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
          </html>`),e.document.close(),e.print(),e.close())};return(t,e)=>(i(),r(c,null,[s("div",S,[s("div",Z,[s("span",{class:"bg-gray-500 text-lg font-semibold px-2 py-0 rounded-sm hover:cursor-pointer select-none",onClick:e[0]||(e[0]=()=>a(!1))},"-"),s("span",B,"Count: "+w(o.value),1),s("span",{class:"bg-blue-500 text-lg font-semibold px-2 py-0 rounded-sm hover:cursor-pointer select-none",onClick:e[1]||(e[1]=()=>a(!0))},"+"),s("button",{type:"submit",class:"ml-4 px-2 py-1 border-orange-500 border text-orange-500rounded-smtransition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none",onClick:e[2]||(e[2]=d=>f())},[...U])])]),$,s("div",A,[s("div",J,[(i(!0),r(c,null,k(m.value,(d,v)=>(i(),r("div",{key:v,class:"mb-1"},[s("img",{src:b(d)},null,8,M)]))),128))])])],64))}}),z=C(q,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/barcode/index.vue"]]);export{z as default};
