import{J as y,d as $,K as A,L as B,l as I,s as O,q as L,x as h,y as V,o as r,c as d,g as p,f as i,b as e,w as P,F as b,E as F,D as f,A as R,B as x,t as _,j as l,_ as c,S as j,M as U,k as q}from"./index-53659ec0.js";const de=y`
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
`,le=y`
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
`,Y=y`
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
`,z={class:"overflow-x-auto mt-4"},H={class:"align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"},J={class:"min-w-full"},K=e("thead",null,[e("tr",null,[e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Notice Title "),e("th",{class:"px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"}," Expiration "),e("th",{class:"px-1 py-1 border-b-2 border-gray-300"})])],-1),G={class:"bg-white"},Q={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},W={class:"flex items-center"},X=["onClick"],Z={class:"px-1 py-1 whitespace-no-wrap border-b border-gray-500"},ee={class:"px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"},te=["onClick"],oe=["onClick"],ne={key:0,class:"py-4 text-center"},se=$({__name:"Notices",setup(ie){const w=l(()=>c(()=>import("./FelPageHeading-2a78da07.js"),["assets/FelPageHeading-2a78da07.js","assets/index-53659ec0.js","assets/index-5e1ff226.css"])),N=l(()=>c(()=>import("./FelLoadingMessage-95452cc5.js"),["assets/FelLoadingMessage-95452cc5.js","assets/index-53659ec0.js","assets/index-5e1ff226.css"])),v=l(()=>c(()=>import("./NoticeForm-9d18e051.js"),["assets/NoticeForm-9d18e051.js","assets/index-53659ec0.js","assets/index-5e1ff226.css","assets/array-acbc0ce2.js","assets/isArray-513c67aa.js","assets/NoticeForm-25a679cd.css"])),E=l(()=>c(()=>import("./FelModal-48146e4b.js"),["assets/FelModal-48146e4b.js","assets/index-53659ec0.js","assets/index-5e1ff226.css","assets/FelModal-780aeea9.css"]));let k=A();const a=B(),C=I(),{withClientMutation:T}=U(),{fetchingNotices:D}=O(a),n=L({notice:{},title:"",showModal:!1,newNotice:!0}),m=h(()=>C?.auth?.user);V(async()=>{k.fetchDepartments({}),await a.fetchMyNotices(m.value?.uid)});async function M(s){await j.fire({title:"Are you sure?",text:"You want to delete these notice",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, delete now!",cancelButtonText:"No, do not delete!"}).then(async o=>{o.isConfirmed&&T(Y,{uid:s},"deleteNotice").then(t=>a.deleteNotice(t))})}function u(s,o={}){n.showModal=!0,n.title=(s?"ADD":"EDIT")+" Notice",s?n.notice={}:n.notice={...o}}const S=h(()=>a.getMyNotices(m.value?.uid));return(s,o)=>(r(),d(b,null,[p(i(w),{title:"Notice Manager"}),e("button",{onClick:o[0]||(o[0]=P(t=>u(!0),["prevent"])),class:"px-4 my-2 p-1 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100"}," New Notice "),e("div",z,[e("div",H,[e("table",J,[K,e("tbody",G,[(r(!0),d(b,null,F(S.value,t=>(r(),d("tr",{key:t.uid},[e("td",Q,[e("div",W,[e("div",{class:"text-sm leading-5 text-gray-800",onClick:g=>u(!1,t)},_(t.title),9,X)])]),e("td",Z,_(t.status),1),e("td",ee,[e("button",{class:"px-2 py-1 mr-2 border-grey-500 border text-grey-500rounded-smtransition duration-300 hover:bg-gray-100 hover:text-black-700 focus:outline-none",onClick:g=>u(!1,t)}," View/Edit ",8,te),e("button",{class:"px-2 py-1 mr-2 ml-2 border-orange-600 border text-orange-600rounded-smtransition duration-300 hover:bg-orange-600 hover:text-black-700 focus:outline-none",onClick:g=>M(t.uid)}," Delete ",8,oe)])]))),128))])]),i(D)?(r(),d("div",ne,[p(i(N),{message:"Fetching notices ..."})])):f("",!0)])]),n.showModal?(r(),R(i(E),{key:0,onClose:o[2]||(o[2]=t=>n.showModal=!1),"content-width":"w-1/2"},{header:x(()=>[e("h3",null,_(n.title),1)]),body:x(()=>[p(i(v),{notice:n.notice,onClose:o[1]||(o[1]=t=>n.showModal=!1)},null,8,["notice"])]),_:1})):f("",!0)],64))}}),re=q(se,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/notice/Notices.vue"]]),ce=Object.freeze(Object.defineProperty({__proto__:null,default:re},Symbol.toStringTag,{value:"Module"}));export{de as A,le as E,ce as N};
