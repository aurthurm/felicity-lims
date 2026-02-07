const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/NoticeForm-ETGP12Qn.js","assets/index-OdhKCqIc.js","assets/index-DD18L2yL.css","assets/index-BQ5jAWaE.js","assets/index-CxNZi_Cj.css","assets/notice-B8DN-4O0.js","assets/index-CXV6PIcj.js","assets/index.esm-BfHj8iGm.js","assets/Input-BEm5S0CJ.js","assets/FormMessage-CgXFMXx9.js","assets/FormLabel-DxP9wnWS.js","assets/Label-CS46LzLb.js","assets/setup-BcFG_bXr.js","assets/Spinner-Bl8RfjFA.js","assets/PageHeading-Czi_4opS.js"])))=>i.map(i=>d[i]);
import{g as h,Y as E,Z as B,u as F,aB as H,av as O,a7 as T,ah as P,aN as V,a5 as I,a6 as $,_ as R,r as i,c as N,o as f,z as s,A as C,C as M,a as n,K as o,M as _,F as D,H as j,I as v}from"./index-OdhKCqIc.js";import{u as z}from"./notice-B8DN-4O0.js";import{u as U}from"./setup-BcFG_bXr.js";import{S as Y}from"./Spinner-Bl8RfjFA.js";import{P as L}from"./PageHeading-Czi_4opS.js";const ue=h`
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
    `,me=h`
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
    `,q=h`
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
    `,K=E({name:"NoticesView",__name:"Notices",setup(k,{expose:t}){t();const w=I(()=>$(()=>import("./NoticeForm-ETGP12Qn.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14])));let e=U();const d=z(),g=B(),{withClientMutation:l}=F(),{confirm:u}=V(),{fetchingNotices:y}=H(d),a=O({notice:{},title:"",showModal:!1,newNotice:!0}),m=T(()=>g?.auth?.user);P(async()=>{e.fetchDepartments({}),await d.fetchMyNotices(m.value?.uid)});async function b(c){if(!await u({title:"Are you sure?",description:"You want to delete these notice",confirmText:"Yes, delete now!",cancelText:"No, do not delete!",variant:"destructive"}))return;const A=await l(q,{uid:c},"deleteNotice");d.deleteNotice(A)}function x(c,S={}){a.showModal=!0,a.title=(c?"ADD":"EDIT")+" Notice",c?a.notice={}:a.notice={...S}}const r=T(()=>d.getMyNotices(m.value?.uid)),p={NoticeForm:w,get setupStore(){return e},set setupStore(c){e=c},noticeStore:d,authStore:g,withClientMutation:l,confirm:u,fetchingNotices:y,modalState:a,user:m,deleteNotice:b,FormManager:x,notices:r,get Spinner(){return Y},PageHeading:L};return Object.defineProperty(p,"__isScriptSetup",{enumerable:!1,value:!0}),p}}),Z={class:"space-y-4"},G={class:"border border-border bg-card rounded-lg shadow-md"},J={class:"relative w-full overflow-auto"},Q={class:"flex items-center"},W=["onClick"],X=["onClick"],ee=["onClick"],te={key:0,class:"py-4 text-center"},oe={class:"inline-flex items-center gap-2"},ne={class:"text-lg font-medium text-foreground"};function re(k,t,w,e,d,g){const l=i("TableHead"),u=i("TableRow"),y=i("TableHeader"),a=i("TableCell"),m=i("TableBody"),b=i("Table"),x=i("Modal");return f(),N(D,null,[s("div",Z,[n(e.PageHeading,{title:"Notice Manager"},{default:o(()=>[s("button",{onClick:t[0]||(t[0]=r=>e.FormManager(!0)),class:"px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"}," New Notice ")]),_:1}),s("div",G,[s("div",J,[n(b,{class:"w-full caption-bottom text-sm"},{default:o(()=>[n(y,{class:"[&_tr]:border-b"},{default:o(()=>[n(u,{class:"border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"},{default:o(()=>[n(l,{class:"h-12 px-4 text-left align-middle font-medium text-muted-foreground"},{default:o(()=>[...t[3]||(t[3]=[_("Notice Title",-1)])]),_:1}),n(l,{class:"h-12 px-4 text-left align-middle font-medium text-muted-foreground"},{default:o(()=>[...t[4]||(t[4]=[_("Expiration",-1)])]),_:1}),n(l,{class:"h-12 px-4 text-right align-middle font-medium text-muted-foreground"},{default:o(()=>[...t[5]||(t[5]=[_("Actions",-1)])]),_:1})]),_:1})]),_:1}),n(m,{class:"[&_tr:last-child]:border-0"},{default:o(()=>[(f(!0),N(D,null,j(e.notices,r=>(f(),C(u,{key:r.uid,class:"border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"},{default:o(()=>[n(a,{class:"px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground"},{default:o(()=>[s("div",Q,[s("div",{class:"cursor-pointer",onClick:p=>e.FormManager(!1,r)},v(r.title),9,W)])]),_:2},1024),n(a,{class:"px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground"},{default:o(()=>[_(v(r.status),1)]),_:2},1024),n(a,{class:"px-4 py-3 align-middle text-right"},{default:o(()=>[s("button",{class:"px-3 py-1.5 mr-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200",onClick:p=>e.FormManager(!1,r)}," View/Edit ",8,X),s("button",{class:"px-3 py-1.5 text-sm font-medium text-destructive-foreground bg-destructive border border-transparent rounded-md shadow-sm hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 transition-colors duration-200",onClick:p=>e.deleteNotice(r.uid)}," Delete ",8,ee)]),_:2},1024)]),_:2},1024))),128))]),_:1})]),_:1})]),e.fetchingNotices?(f(),N("div",te,[s("span",oe,[n(e.Spinner,{class:"size-4"}),t[6]||(t[6]=s("span",{class:"text-sm"},"Fetching notices ...",-1))])])):M("",!0)])]),e.modalState.showModal?(f(),C(x,{key:0,onClose:t[2]||(t[2]=r=>e.modalState.showModal=!1),"content-width":"w-1/2"},{header:o(()=>[s("h3",ne,v(e.modalState.title),1)]),body:o(()=>[n(e.NoticeForm,{notice:e.modalState.notice,onClose:t[1]||(t[1]=r=>e.modalState.showModal=!1)},null,8,["notice"])]),_:1})):M("",!0)],64)}const se=R(K,[["render",re],["__file","/home/administrator/Documents/Development/beak-insights/felicity/felicity-lims/webapp/views/notice/Notices.vue"]]),pe=Object.freeze(Object.defineProperty({__proto__:null,default:se},Symbol.toStringTag,{value:"Module"}));export{ue as A,me as E,pe as N};
