import{g as _,V as T,a5 as B,f as E,aj as A,h as O,i as h,a8 as V,r as l,o as i,c as a,O as e,a as m,M as p,C as F,L as d,F as x,H as I,J as f,a6 as v,z as j,$ as L,ag as P,a0 as U,_ as z}from"./index-74595aff.js";import{u as R}from"./notice-e225ed84.js";import{u as Y}from"./setup-fa628218.js";const le=_`
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
    `,me=_`
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
    `,q=_`
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
    `,H={class:"space-y-4"},J={class:"overflow-hidden shadow ring-1 ring-border ring-opacity-5 rounded-lg"},G={class:"min-w-full divide-y divide-border"},K={class:"divide-y divide-border bg-background"},Q={class:"whitespace-nowrap px-3 py-4 text-sm text-foreground"},W={class:"flex items-center"},X=["onClick"],Z={class:"whitespace-nowrap px-3 py-4 text-sm text-foreground"},ee={class:"whitespace-nowrap px-3 py-4 text-sm text-right"},te=["onClick"],oe=["onClick"],ne={key:0,class:"py-4 text-center"},se={class:"text-lg font-medium text-foreground"},ie=T({__name:"Notices",setup(ae){const N=L(()=>U(()=>import("./NoticeForm-d7ae9ffd.js"),["assets/NoticeForm-d7ae9ffd.js","assets/index-74595aff.js","assets/index-8412b2a5.css","assets/index-6c11cf6c.js","assets/_baseForOwn-463b5fb5.js","assets/merge-671b15f8.js","assets/_isIterateeCall-7a6c2a8b.js","assets/isArray-513c67aa.js","assets/mapValues-89b08367.js","assets/isString-62275e3e.js","assets/clone-384d47a1.js","assets/_baseSet-10ded081.js","assets/index-25a679cd.css","assets/notice-e225ed84.js","assets/index-52e9caa2.js","assets/array-b292c9a7.js","assets/setup-fa628218.js","assets/_queries-3a88eae7.js"]));let w=Y();const r=R(),b=B(),{withClientMutation:C}=E(),{fetchingNotices:$}=A(r),o=O({notice:{},title:"",showModal:!1,newNotice:!0}),g=h(()=>b?.auth?.user);V(async()=>{w.fetchDepartments({}),await r.fetchMyNotices(g.value?.uid)});async function M(s){await P.fire({title:"Are you sure?",text:"You want to delete these notice",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, delete now!",cancelButtonText:"No, do not delete!"}).then(async t=>{t.isConfirmed&&C(q,{uid:s},"deleteNotice").then(u=>r.deleteNotice(u))})}function c(s,t={}){o.showModal=!0,o.title=(s?"ADD":"EDIT")+" Notice",s?o.notice={}:o.notice={...t}}const k=h(()=>r.getMyNotices(g.value?.uid));return(s,t)=>{const u=l("fel-heading"),D=l("fel-loader"),S=l("fel-modal");return i(),a(x,null,[e("div",H,[m(u,{title:"Notice Manager"},{default:p(()=>[e("button",{onClick:t[0]||(t[0]=F(n=>c(!0),["prevent"])),class:"px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"}," New Notice ")]),_:1}),d(" Notice Table View "),e("div",J,[e("table",G,[t[3]||(t[3]=e("thead",{class:"bg-muted"},[e("tr",null,[e("th",{class:"px-3 py-3.5 text-left text-sm font-medium text-foreground"},"Notice Title"),e("th",{class:"px-3 py-3.5 text-left text-sm font-medium text-foreground"},"Expiration"),e("th",{class:"px-3 py-3.5 text-right text-sm font-medium text-foreground"},"Actions")])],-1)),e("tbody",K,[(i(!0),a(x,null,I(k.value,n=>(i(),a("tr",{key:n.uid,class:"hover:bg-muted/50 transition-colors duration-150"},[e("td",Q,[e("div",W,[e("div",{class:"cursor-pointer",onClick:y=>c(!1,n)},f(n.title),9,X)])]),e("td",Z,f(n.status),1),e("td",ee,[e("button",{class:"px-3 py-1.5 mr-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200",onClick:y=>c(!1,n)}," View/Edit ",8,te),e("button",{class:"px-3 py-1.5 text-sm font-medium text-destructive-foreground bg-destructive border border-transparent rounded-md shadow-sm hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 transition-colors duration-200",onClick:y=>M(n.uid)}," Delete ",8,oe)])]))),128))])]),v($)?(i(),a("div",ne,[m(D,{message:"Fetching notices ..."})])):d("v-if",!0)])]),d(" Notice Form Modal "),o.showModal?(i(),j(S,{key:0,onClose:t[2]||(t[2]=n=>o.showModal=!1),"content-width":"w-1/2"},{header:p(()=>[e("h3",se,f(o.title),1)]),body:p(()=>[m(v(N),{notice:o.notice,onClose:t[1]||(t[1]=n=>o.showModal=!1)},null,8,["notice"])]),_:1})):d("v-if",!0)],64)}}}),re=z(ie,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/notice/Notices.vue"]]),pe=Object.freeze(Object.defineProperty({__proto__:null,default:re},Symbol.toStringTag,{value:"Module"}));export{le as A,me as E,pe as N};
