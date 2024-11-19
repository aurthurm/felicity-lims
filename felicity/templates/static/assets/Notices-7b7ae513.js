import{J as m,d as $,K as A,L as B,l as I,s as O,q as V,x as b,y as L,o as i,c as d,g as _,f as r,b as e,w as P,A as l,F as f,E as F,B as R,C as x,t as y,j as c,_ as u,S as j,M as U,k as q}from"./index-4d0d48ab.js";const de=m`
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
`,le=m`
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
`,Y=m`
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
`,z={class:"overflow-x-auto mt-4"},H={class:"align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"},J={class:"min-w-full"},K=e("thead",null,[e("tr",null,[e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Notice Title "),e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Expiration "),e("th",{class:"px-1 py-1 border-b-2 border-gray-300"})])],-1),G={class:"bg-white"},Q={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},W={class:"flex items-center"},X=["onClick"],Z={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},ee={class:"px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"},te=["onClick"],oe=["onClick"],ne={key:0,class:"py-4 text-center"},se=$({__name:"Notices",setup(re){const w=c(()=>u(()=>import("./FelPageHeading-67d86e24.js"),["assets/FelPageHeading-67d86e24.js","assets/index-4d0d48ab.js","assets/index-c2286288.css"])),N=c(()=>u(()=>import("./FelLoadingMessage-e29e7357.js"),["assets/FelLoadingMessage-e29e7357.js","assets/index-4d0d48ab.js","assets/index-c2286288.css"])),v=c(()=>u(()=>import("./NoticeForm-1291791c.js"),["assets/NoticeForm-1291791c.js","assets/index-4d0d48ab.js","assets/index-c2286288.css","assets/array-93349b7b.js","assets/isArray-513c67aa.js","assets/NoticeForm-25a679cd.css"])),E=c(()=>u(()=>import("./FelModal-599b9c12.js"),["assets/FelModal-599b9c12.js","assets/index-4d0d48ab.js","assets/index-c2286288.css","assets/FelModal-780aeea9.css"]));let k=A();const a=B(),C=I(),{withClientMutation:T}=U(),{fetchingNotices:D}=O(a),n=V({notice:{},title:"",showModal:!1,newNotice:!0}),g=b(()=>C?.auth?.user);L(async()=>{k.fetchDepartments({}),await a.fetchMyNotices(g.value?.uid)});async function M(s){await j.fire({title:"Are you sure?",text:"You want to delete these notice",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, delete now!",cancelButtonText:"No, do not delete!"}).then(async o=>{o.isConfirmed&&T(Y,{uid:s},"deleteNotice").then(t=>a.deleteNotice(t))})}function p(s,o={}){n.showModal=!0,n.title=(s?"ADD":"EDIT")+" Notice",s?n.notice={}:n.notice={...o}}const S=b(()=>a.getMyNotices(g.value?.uid));return(s,o)=>(i(),d(f,null,[_(r(w),{title:"Notice Manager"}),e("button",{onClick:o[0]||(o[0]=P(t=>p(!0),["prevent"])),class:"px-4 my-2 p-1 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100"}," New Notice "),l(" Notice Table View "),e("div",z,[e("div",H,[e("table",J,[K,e("tbody",G,[(i(!0),d(f,null,F(S.value,t=>(i(),d("tr",{key:t.uid},[e("td",Q,[e("div",W,[e("div",{class:"text-sm leading-5 text-gray-800",onClick:h=>p(!1,t)},y(t.title),9,X)])]),e("td",Z,y(t.status),1),e("td",ee,[e("button",{class:"px-2 py-1 mr-2 border-grey-500 border text-grey-500rounded-smtransition duration-300 hover:bg-gray-100 hover:text-black-700 focus:outline-none",onClick:h=>p(!1,t)}," View/Edit ",8,te),e("button",{class:"px-2 py-1 mr-2 ml-2 border-orange-600 border text-orange-600rounded-smtransition duration-300 hover:bg-orange-600 hover:text-black-700 focus:outline-none",onClick:h=>M(t.uid)}," Delete ",8,oe)])]))),128))])]),r(D)?(i(),d("div",ne,[_(r(N),{message:"Fetching notices ..."})])):l("v-if",!0)])]),l(" Notice Form Modal "),n.showModal?(i(),R(r(E),{key:0,onClose:o[2]||(o[2]=t=>n.showModal=!1),"content-width":"w-1/2"},{header:x(()=>[e("h3",null,y(n.title),1)]),body:x(()=>[_(r(v),{notice:n.notice,onClose:o[1]||(o[1]=t=>n.showModal=!1)},null,8,["notice"])]),_:1})):l("v-if",!0)],64))}}),ie=q(se,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/notice/Notices.vue"]]),ce=Object.freeze(Object.defineProperty({__proto__:null,default:ie},Symbol.toStringTag,{value:"Module"}));export{de as A,le as E,ce as N};
