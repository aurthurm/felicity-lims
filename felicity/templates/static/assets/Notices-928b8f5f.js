import{g as f,W as B,a6 as E,f as T,am as A,h as O,i as g,a9 as F,r as u,o as i,c as a,O as e,a as l,M as m,C as I,F as h,H as V,J as p,a7 as x,L as v,z as j,a0 as L,aj as P,a1 as U,_ as z}from"./index-5d85e9da.js";import{u as R}from"./notice-771b5e09.js";import{u as Y}from"./setup-d31371ee.js";const le=f`
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
`,me=f`
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
`,q=f`
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
`,H={class:"space-y-4"},J={class:"overflow-hidden shadow ring-1 ring-border ring-opacity-5 rounded-lg"},W={class:"min-w-full divide-y divide-border"},G={class:"divide-y divide-border bg-background"},K={class:"whitespace-nowrap px-3 py-4 text-sm text-foreground"},Q={class:"flex items-center"},X=["onClick"],Z={class:"whitespace-nowrap px-3 py-4 text-sm text-foreground"},ee={class:"whitespace-nowrap px-3 py-4 text-sm text-right"},te=["onClick"],oe=["onClick"],ne={key:0,class:"py-4 text-center"},se={class:"text-lg font-medium text-foreground"},ie=B({__name:"Notices",setup(ae){const N=L(()=>U(()=>import("./NoticeForm-37ac16a8.js"),["assets/NoticeForm-37ac16a8.js","assets/index-5d85e9da.js","assets/index-8a6751fe.css","assets/index-7a228534.js","assets/_baseForOwn-de271e35.js","assets/merge-a22f6153.js","assets/_isIterateeCall-19e805e5.js","assets/isArray-513c67aa.js","assets/mapValues-c1d730ef.js","assets/isString-6f480322.js","assets/clone-0ac34464.js","assets/_baseSet-b312c4a3.js","assets/index-25a679cd.css","assets/notice-771b5e09.js","assets/index-4972ba4e.js","assets/array-5c68cccc.js","assets/setup-d31371ee.js","assets/_queries-0bd36c18.js"]));let w=Y();const r=R(),b=E(),{withClientMutation:C}=T(),{fetchingNotices:$}=A(r),o=O({notice:{},title:"",showModal:!1,newNotice:!0}),_=g(()=>b?.auth?.user);F(async()=>{w.fetchDepartments({}),await r.fetchMyNotices(_.value?.uid)});async function k(s){await P.fire({title:"Are you sure?",text:"You want to delete these notice",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, delete now!",cancelButtonText:"No, do not delete!"}).then(async t=>{t.isConfirmed&&C(q,{uid:s},"deleteNotice").then(c=>r.deleteNotice(c))})}function d(s,t={}){o.showModal=!0,o.title=(s?"ADD":"EDIT")+" Notice",s?o.notice={}:o.notice={...t}}const D=g(()=>r.getMyNotices(_.value?.uid));return(s,t)=>{const c=u("fel-heading"),M=u("fel-loader"),S=u("fel-modal");return i(),a(h,null,[e("div",H,[l(c,{title:"Notice Manager"},{default:m(()=>[e("button",{onClick:t[0]||(t[0]=I(n=>d(!0),["prevent"])),class:"px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"}," New Notice ")]),_:1}),e("div",J,[e("table",W,[t[3]||(t[3]=e("thead",{class:"bg-muted"},[e("tr",null,[e("th",{class:"px-3 py-3.5 text-left text-sm font-medium text-foreground"},"Notice Title"),e("th",{class:"px-3 py-3.5 text-left text-sm font-medium text-foreground"},"Expiration"),e("th",{class:"px-3 py-3.5 text-right text-sm font-medium text-foreground"},"Actions")])],-1)),e("tbody",G,[(i(!0),a(h,null,V(D.value,n=>(i(),a("tr",{key:n.uid,class:"hover:bg-muted/50 transition-colors duration-150"},[e("td",K,[e("div",Q,[e("div",{class:"cursor-pointer",onClick:y=>d(!1,n)},p(n.title),9,X)])]),e("td",Z,p(n.status),1),e("td",ee,[e("button",{class:"px-3 py-1.5 mr-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200",onClick:y=>d(!1,n)}," View/Edit ",8,te),e("button",{class:"px-3 py-1.5 text-sm font-medium text-destructive-foreground bg-destructive border border-transparent rounded-md shadow-sm hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 transition-colors duration-200",onClick:y=>k(n.uid)}," Delete ",8,oe)])]))),128))])]),x($)?(i(),a("div",ne,[l(M,{message:"Fetching notices ..."})])):v("",!0)])]),o.showModal?(i(),j(S,{key:0,onClose:t[2]||(t[2]=n=>o.showModal=!1),"content-width":"w-1/2"},{header:m(()=>[e("h3",se,p(o.title),1)]),body:m(()=>[l(x(N),{notice:o.notice,onClose:t[1]||(t[1]=n=>o.showModal=!1)},null,8,["notice"])]),_:1})):v("",!0)],64)}}}),re=z(ie,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/notice/Notices.vue"]]),pe=Object.freeze(Object.defineProperty({__proto__:null,default:re},Symbol.toStringTag,{value:"Module"}));export{le as A,me as E,pe as N};
