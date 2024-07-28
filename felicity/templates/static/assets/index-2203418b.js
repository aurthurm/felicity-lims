import{d as _,P as h,r as c,N as g,D as x,o as i,c as r,b as s,t as w,F as p,p as k,k as D}from"./index-a40c2365.js";import{u as S}from"./samples-a3187681.js";const C={class:"mx-auto w-fit"},Z={class:"flex justify-start items-center gap-x-1"},B={class:"mr-2"},N=s("span",null,"Print",-1),O=[N],U=s("hr",{class:"my-4"},null,-1),$={id:"printZoneOuter"},A={id:"printZone",class:"mx-auto w-fit overflow-y-scroll overscroll-contain max-h-[750px]"},M=["src"],P="40mm 30mm",E=_({__name:"index",setup(F){const u=h();let n=[];if(window.history.state.sampleUids)n=JSON.parse(window.history.state.sampleUids??"");else{const t=JSON.parse(u.query.sampleUids?.toString()??"");n=Array.isArray(t)?t:t?.split(",")}const o=c(2),a=(t=!0)=>{if(t)o.value++;else{if(o.value===1)return;o.value--}},l=c([]);g(async()=>{console.log(n),l.value=await y(n)});const m=x(()=>l.value.flatMap(t=>Array(o.value).fill(t))),{barcodeSamples:y}=S(),b=t=>`data:application/png;base64,${t}`,f=()=>{const t=document.getElementById("printZoneOuter").innerHTML,e=window.open("","_blank");e&&(e.document.open(),e.document.write(`
          <html>
            <head>
              <title>Print Stickers</title>
              <style>
                  @media print {
                    @page {
                      size: ${P};
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
          </html>`),e.document.close(),e.print(),e.close())};return(t,e)=>(i(),r(p,null,[s("div",C,[s("div",Z,[s("span",{class:"bg-gray-500 text-lg font-semibold px-2 py-0 rounded-sm hover:cursor-pointer select-none",onClick:e[0]||(e[0]=()=>a(!1))},"-"),s("span",B,"Count: "+w(o.value),1),s("span",{class:"bg-blue-500 text-lg font-semibold px-2 py-0 rounded-sm hover:cursor-pointer select-none",onClick:e[1]||(e[1]=()=>a(!0))},"+"),s("button",{type:"submit",class:"ml-4 px-2 py-1 border-orange-500 border text-orange-500rounded-smtransition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none",onClick:e[2]||(e[2]=d=>f())},[...O])])]),U,s("div",$,[s("div",A,[(i(!0),r(p,null,k(m.value,(d,v)=>(i(),r("div",{key:v,class:"mb-1"},[s("img",{src:b(d)},null,8,M)]))),128))])])],64))}}),j=D(E,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/barcode/index.vue"]]);export{j as default};
