import{r as y,_ as d,t as $,v as A,b as I,m as B,S as O,w as V}from"./shipment-53265c2d.js";import{f as L,G as l,c as P,d as b,I as F,h as s,k as c,B as _,u as r,x as e,y as u,F as x,ak as R,j,A as f,D as m,_ as U}from"./_plugin-vue_export-helper-dacf3d65.js";import{a as Y}from"./runtime-dom.esm-bundler-98433118.js";const ce=y`
    mutation AddNotice($payload: NoticeInputType!) {
        createNotice(payload: $payload) {
            ... on NoticeType {
                __typename
                uid
                title
                body
                expiry
                createdByUid
                departments {
                    uid
                    name
                }
                groups {
                    uid
                    name
                }
            }
            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`,ue=y`
    mutation editNotice($uid: String!, $payload: NoticeInputType!) {
        updateNotice(uid: $uid, payload: $payload) {
            ... on NoticeType {
                __typename
                uid
                title
                body
                expiry
                createdByUid
                departments {
                    uid
                    name
                }
                groups {
                    uid
                    name
                }
            }
            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`,q=y`
    mutation deleteNotice($uid: String!) {
        deleteNotice(uid: $uid) {
            ... on DeletedItem {
                __typename
                uid
            }
            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`,z={class:"overflow-x-auto mt-4"},G={class:"align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"},H={class:"min-w-full"},J=e("thead",null,[e("tr",null,[e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Notice Title "),e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Expiration "),e("th",{class:"px-1 py-1 border-b-2 border-gray-300"})])],-1),K={class:"bg-white"},Q={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},W={class:"flex items-center"},X=["onClick"],Z={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},ee={class:"px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"},te=["onClick"],oe=["onClick"],ne={key:0,class:"py-4 text-center"},re=L({__name:"index",setup(se){const w=l(()=>d(()=>import("./PageHeading-f8f1dd15.js"),["assets/PageHeading-f8f1dd15.js","assets/_plugin-vue_export-helper-dacf3d65.js"])),v=l(()=>d(()=>import("./LoadingMessage-097e117a.js"),["assets/LoadingMessage-097e117a.js","assets/_plugin-vue_export-helper-dacf3d65.js"])),N=l(()=>d(()=>import("./NoticeForm-b13241fe.js"),["assets/NoticeForm-b13241fe.js","assets/_plugin-vue_export-helper-dacf3d65.js","assets/shipment-53265c2d.js","assets/array-9d3d6c63.js","assets/runtime-dom.esm-bundler-98433118.js"])),k=l(()=>d(()=>import("./SimpleModal-9e28c074.js"),["assets/SimpleModal-9e28c074.js","assets/_plugin-vue_export-helper-dacf3d65.js","assets/runtime-dom.esm-bundler-98433118.js","assets/SimpleModal-f645a074.css"]));let E=$();const a=A(),C=I(),{withClientMutation:T}=V(),{fetchingNotices:D}=B(a),n=P({notice:{},title:"",showModal:!1,newNotice:!0}),g=b(()=>C?.auth?.user);F(async()=>{E.fetchDepartments({}),await a.fetchMyNotices(g.value?.uid)});async function M(i){await O.fire({title:"Are you sure?",text:"You want to delete these notice",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, delete now!",cancelButtonText:"No, do not delete!"}).then(async o=>{o.isConfirmed&&T(q,{uid:i},"deleteNotice").then(t=>a.deleteNotice(t))})}function p(i,o={}){n.showModal=!0,n.title=(i?"ADD":"EDIT")+" Notice",i?n.notice={}:n.notice={...o}}const S=b(()=>a.getMyNotices(g.value?.uid));return(i,o)=>(s(),c(x,null,[_(r(w),{title:"Notice Manager"}),e("button",{onClick:o[0]||(o[0]=Y(t=>p(!0),["prevent"])),class:"px-4 my-2 p-1 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100"}," New Notice "),u(" Notice Table View "),e("div",z,[e("div",G,[e("table",H,[J,e("tbody",K,[(s(!0),c(x,null,R(r(S),t=>(s(),c("tr",{key:t.uid},[e("td",Q,[e("div",W,[e("div",{class:"text-sm leading-5 text-gray-800",onClick:h=>p(!1,t)},m(t.title),9,X)])]),e("td",Z,m(t.status),1),e("td",ee,[e("button",{class:"px-2 py-1 mr-2 border-grey-500 border text-grey-500rounded-smtransition duration-300 hover:bg-gray-100 hover:text-black-700 focus:outline-none",onClick:h=>p(!1,t)}," View/Edit ",8,te),e("button",{class:"px-2 py-1 mr-2 ml-2 border-orange-600 border text-orange-600rounded-smtransition duration-300 hover:bg-orange-600 hover:text-black-700 focus:outline-none",onClick:h=>M(t.uid)}," Delete ",8,oe)])]))),128))])]),r(D)?(s(),c("div",ne,[_(r(v),{message:"Fetching notices ..."})])):u("v-if",!0)])]),u(" Notice Form Modal "),n.showModal?(s(),j(r(k),{key:0,onClose:o[2]||(o[2]=t=>n.showModal=!1)},{header:f(()=>[e("h3",null,m(n.title),1)]),body:f(()=>[_(r(N),{notice:n.notice,onClose:o[1]||(o[1]=t=>n.showModal=!1)},null,8,["notice"])]),_:1})):u("v-if",!0)],64))}}),ie=U(re,[["__file","/home/aurthurm/Development/felicity-lims/webapp/views/notice/index.vue"]]),pe=Object.freeze(Object.defineProperty({__proto__:null,default:ie},Symbol.toStringTag,{value:"Module"}));export{ce as A,ue as E,pe as i};
