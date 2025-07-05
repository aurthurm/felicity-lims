import{g as f,W as B,a6 as E,f as T,ak as A,h as O,i as g,a9 as F,r as u,o as i,c as a,O as e,a as l,M as m,C as I,F as h,H as V,J as p,a7 as x,L as v,z as L,a0 as P,ah as U,a1 as j,_ as z}from"./index-93739211.js";import{u as R}from"./notice-edf80533.js";import{u as Y}from"./setup-e711c708.js";const le=f`
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
    `,H={class:"space-y-4"},J={class:"overflow-hidden shadow ring-1 ring-border ring-opacity-5 rounded-lg"},W={class:"min-w-full divide-y divide-border"},G={class:"divide-y divide-border bg-background"},K={class:"whitespace-nowrap px-3 py-4 text-sm text-foreground"},Q={class:"flex items-center"},X=["onClick"],Z={class:"whitespace-nowrap px-3 py-4 text-sm text-foreground"},ee={class:"whitespace-nowrap px-3 py-4 text-sm text-right"},te=["onClick"],oe=["onClick"],ne={key:0,class:"py-4 text-center"},se={class:"text-lg font-medium text-foreground"},ie=B({__name:"Notices",setup(ae){const N=P(()=>j(()=>import("./NoticeForm-6f522047.js"),["assets/NoticeForm-6f522047.js","assets/index-93739211.js","assets/index-0f090789.css","assets/index-f9e617fb.js","assets/_baseForOwn-5f1ab8a8.js","assets/merge-e828024a.js","assets/_isIterateeCall-55fac397.js","assets/isArray-513c67aa.js","assets/mapValues-8cd0d122.js","assets/isString-990f006b.js","assets/clone-66f8c967.js","assets/_baseSet-5e4485cc.js","assets/index-25a679cd.css","assets/notice-edf80533.js","assets/index-0f6f1926.js","assets/array-2f9882bb.js","assets/setup-e711c708.js","assets/_queries-2ba61825.js"]));let w=Y();const r=R(),b=E(),{withClientMutation:C}=T(),{fetchingNotices:k}=A(r),o=O({notice:{},title:"",showModal:!1,newNotice:!0}),_=g(()=>b?.auth?.user);F(async()=>{w.fetchDepartments({}),await r.fetchMyNotices(_.value?.uid)});async function $(s){await U.fire({title:"Are you sure?",text:"You want to delete these notice",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, delete now!",cancelButtonText:"No, do not delete!"}).then(async t=>{t.isConfirmed&&C(q,{uid:s},"deleteNotice").then(c=>r.deleteNotice(c))})}function d(s,t={}){o.showModal=!0,o.title=(s?"ADD":"EDIT")+" Notice",s?o.notice={}:o.notice={...t}}const D=g(()=>r.getMyNotices(_.value?.uid));return(s,t)=>{const c=u("fel-heading"),M=u("fel-loader"),S=u("fel-modal");return i(),a(h,null,[e("div",H,[l(c,{title:"Notice Manager"},{default:m(()=>[e("button",{onClick:t[0]||(t[0]=I(n=>d(!0),["prevent"])),class:"px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"}," New Notice ")]),_:1}),e("div",J,[e("table",W,[t[3]||(t[3]=e("thead",{class:"bg-muted"},[e("tr",null,[e("th",{class:"px-3 py-3.5 text-left text-sm font-medium text-foreground"},"Notice Title"),e("th",{class:"px-3 py-3.5 text-left text-sm font-medium text-foreground"},"Expiration"),e("th",{class:"px-3 py-3.5 text-right text-sm font-medium text-foreground"},"Actions")])],-1)),e("tbody",G,[(i(!0),a(h,null,V(D.value,n=>(i(),a("tr",{key:n.uid,class:"hover:bg-muted/50 transition-colors duration-150"},[e("td",K,[e("div",Q,[e("div",{class:"cursor-pointer",onClick:y=>d(!1,n)},p(n.title),9,X)])]),e("td",Z,p(n.status),1),e("td",ee,[e("button",{class:"px-3 py-1.5 mr-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200",onClick:y=>d(!1,n)}," View/Edit ",8,te),e("button",{class:"px-3 py-1.5 text-sm font-medium text-destructive-foreground bg-destructive border border-transparent rounded-md shadow-sm hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 transition-colors duration-200",onClick:y=>$(n.uid)}," Delete ",8,oe)])]))),128))])]),x(k)?(i(),a("div",ne,[l(M,{message:"Fetching notices ..."})])):v("",!0)])]),o.showModal?(i(),L(S,{key:0,onClose:t[2]||(t[2]=n=>o.showModal=!1),"content-width":"w-1/2"},{header:m(()=>[e("h3",se,p(o.title),1)]),body:m(()=>[l(x(N),{notice:o.notice,onClose:t[1]||(t[1]=n=>o.showModal=!1)},null,8,["notice"])]),_:1})):v("",!0)],64)}}}),re=z(ie,[["__file","/home/aurthurm/Documents/Development/felicity/felicity-lims/webapp/views/notice/Notices.vue"]]),pe=Object.freeze(Object.defineProperty({__proto__:null,default:re},Symbol.toStringTag,{value:"Module"}));export{le as A,me as E,pe as N};
