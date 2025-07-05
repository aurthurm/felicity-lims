import{g as o,f as a,d as n,k as c}from"./index-93739211.js";import{s as d}from"./index-0f6f1926.js";const y=o`
    query getNoticesByCreatorUid($uid: String!) {
  noticesByCreator(uid: $uid) {
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
}
    `,{withClientQuery:f}=a(),{toastError:u}=c(),h=n("notice",{state:()=>({notices:[],fetchingNotices:!1,filterBy:"all",filters:["all","active","expired"]}),getters:{getNotices:e=>e.notices,getActiveNotices:e=>e.notices?.filter(t=>!t.expired),getMyNotices:e=>t=>e.notices?.filter(i=>i.createdByUid===t),getFilterBy:e=>e.filterBy,getFilters:e=>e.filters},actions:{async fetchMyNotices(e){try{this.fetchingNotices=!0;const t=await f(y,{uid:e},"noticesByCreator");Array.isArray(t)?this.notices=t.map(i=>s(i)).sort((i,r)=>i.expiry>r.expiry?1:-1):(this.notices=[],console.error("Expected array of notices but got:",t))}catch(t){t instanceof Error&&u(t.message),this.notices=[]}finally{this.fetchingNotices=!1}},addNotice(e){this.notices?.unshift(s(e))},updateNotice(e){const t=this.notices?.findIndex(i=>i.uid===e.uid);t>-1&&(this.notices[t]=s(e))},deleteNotice(e){const t=this.notices?.findIndex(i=>i.uid===e.uid);t>-1&&this.notices?.splice(t,1)}}}),l=e=>new Date>new Date(e.expiry),p=e=>d(new Date,new Date(e.expiry)),s=e=>{const t=l(e),i=+p(e);return e.expired=t,e.dayToExpiration=i,t===!0?i===0?e.status="expired today":e.status="expired "+i+" days ago":i===0?e.status="expiring today":e.status="expiring in "+i+" days",e};export{h as u};
