import{bf as B,k as u,d as L,f as q,e as r,a7 as A,a5 as $,bg as p}from"./index-DCVfsbos.js";var m={exports:{}},I=m.exports,O;function x(){return O||(O=1,(function(a,w){(function(l,f){a.exports=f()})(I,(function(){var l="month",f="quarter";return function(b,g){var i=g.prototype;i.quarter=function(s){return this.$utils().u(s)?Math.ceil((this.month()+1)/3):this.month(this.month()%3+3*(s-1))};var S=i.add;i.add=function(s,c){return s=Number(s),this.$utils().p(c)===f?this.add(3*s,l):S.bind(this)(s,c)};var h=i.startOf;i.startOf=function(s,c){var y=this.$utils(),v=!!y.u(c)||c;if(y.p(s)===f){var d=this.quarter()-1;return v?this.month(3*d).startOf(l).startOf("day"):this.month(3*d+2).endOf(l).endOf("day")}return h.bind(this)(s,c)}}}))})(m)),m.exports}var R=x();const W=B(R),Y=u`
    query getSampleGroupByStatus {
  countSampleGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `,j=u`
    query getExtrasGroupByStatus {
  countExtrasGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `,F=u`
    query getAnalysisGroupByStatus {
  countAnalyteGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `,Q=u`
    query getWorksheetGroupByStatus {
  countWorksheetGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `,V=u`
    query getAnalysisGroupByInstrument($startDate: String!, $endDate: String!) {
  countAnalyteGroupByInstrument(startDate: $startDate, endDate: $endDate) {
    data {
      __typename
      group
      count
    }
  }
}
    `,E=u`
    query SampleProcessPeformance($startDate: String!, $endDate: String!) {
  sampleProcessPerformance(startDate: $startDate, endDate: $endDate) {
    __typename
    data {
      process
      counts {
        totalSamples
        totalLate
        totalNotLate
        processAverage
        avgExtraDays
      }
    }
  }
}
    `,M=u`
    query getAnalysisProcessPeformance($process: String!, $startDate: String!, $endDate: String!) {
  analysisProcessPerformance(
    process: $process
    startDate: $startDate
    endDate: $endDate
  ) {
    __typename
    data {
      process
      groups {
        totalSamples
        totalLate
        totalNotLate
        processAverage
        avgExtraDays
        service
      }
    }
  }
}
    `,C=u`
    query SampleGroupByAction($startDate: String!, $endDate: String!) {
  countSampleGroupByAction(startDate: $startDate, endDate: $endDate) {
    __typename
    data {
      __typename
      group
      counts {
        __typename
        group
        count
      }
    }
  }
}
    `,N=u`
    query getSampleLaggards {
  sampleLaggards {
    __typename
    data {
      __typename
      category
      counts {
        __typename
        totalIncomplete
        totalDelayed
        totalNotDelayed
        lessThanTen
        tenToTwenty
        twentyToThirty
        graterThanThirty
      }
    }
  }
}
    `,{withClientQuery:o}=q();r.extend(W);const z=L("dashboard",()=>{const a=A({currentTab:"overview",tabs:["overview","resource","laggard","peformance","notices","line-listing","inventory"],showFilters:!1,filterRange:{from:"",fromIso:"",to:"",toIso:""},currentFilter:"TW",filters:["T","Y","TW","LW","TM","LM","TQ","LQ","TY"],overViewStats:{analyses:[],samples:[],extras:[],worksheets:[]},fetchingOverViewStats:!1,resourceStats:{instruments:[],samples:[]},fetchingResourceStats:!1,peformancePeriods:[30,60,90,180,365],currentPeformancePeriod:30,peformanceStats:{sample:[],analysis:[]},fetchingSampePeformanceStats:!1,fetchingAnalysisPeformanceStats:!1,currentPeformance:"received_to_published",performances:["received_to_published","received_to_submitted","submitted_to_verified","verified_to_published"],perfs:{received_to_published:"Received to Published",received_to_submitted:"Received to Submitted",submitted_to_verified:"Submitted to Verified",verified_to_published:"Verified to Published"},laggards:{},fetchingLaggards:!1}),w=t=>t==="T"?"Today":t==="Y"?"Yesterday":t==="TW"?"This Week":t==="LW"?"Last Week":t==="TM"?"This Month":t==="LM"?"Last Month":t==="TQ"?"This Quarter":t==="LQ"?"Last Quarter":t==="TY"?"This Year":"Unknown Filter",l=async()=>{a.value.fetchingOverViewStats=!0;try{await b(),await g(),await i(),await S()}catch{}finally{a.value.fetchingOverViewStats=!1}},f=async()=>{a.value.fetchingResourceStats=!0;try{await h(),await s()}catch{}finally{a.value.fetchingResourceStats=!1}},b=async()=>{try{const e=await o(Y,{},"countSampleGroupByStatus","network-only");e&&typeof e=="object"&&"data"in e&&(a.value.overViewStats.samples=p(e.data,["scheduled","expected","received","awaiting","approved"],"group"))}catch{}},g=async()=>{try{const t={},e=await o(F,{},"countAnalyteGroupByStatus","network-only");e&&typeof e=="object"&&"data"in e&&(a.value.overViewStats.analyses=p(e.data,["pending","resulted"],"group"))}catch{}},i=async()=>{try{const e=await o(Q,{},"countWorksheetGroupByStatus","network-only");e&&typeof e=="object"&&"data"in e&&(a.value.overViewStats.worksheets=p(e.data,["empty","awaiting","pending"],"group"))}catch{}},S=async()=>{try{const e=await o(j,{},"countExtrasGroupByStatus","network-only");e&&typeof e=="object"&&"data"in e&&(a.value.overViewStats.extras=p(e.data,["sample cancelled","sample rejected","sample invalidated","analysis retracted","analysis retested"],"group"))}catch{}},h=async()=>{try{const t={startDate:a.value.filterRange.fromIso,endDate:a.value.filterRange.toIso},e=await o(V,t,"countAnalyteGroupByInstrument","network-only");e&&typeof e=="object"&&"data"in e&&(a.value.resourceStats.instruments=e.data)}catch{}},s=async()=>{try{const t={startDate:a.value.filterRange.fromIso,endDate:a.value.filterRange.toIso},e=await o(C,t,"countSampleGroupByAction","network-only");e&&typeof e=="object"&&"data"in e&&(a.value.resourceStats.samples=e.data)}catch{}},c=async()=>{try{a.value.fetchingSampePeformanceStats=!0;const t={startDate:r().startOf("day").subtract(a.value.currentPeformancePeriod,"day").toISOString(),endDate:r().endOf("day").toISOString()},e=await o(E,t,"sampleProcessPerformance","network-only");e&&typeof e=="object"&&"data"in e&&(a.value.peformanceStats.sample=e.data)}catch{}finally{a.value.fetchingSampePeformanceStats=!1}},y=async()=>{try{a.value.fetchingAnalysisPeformanceStats=!0;const t={process:a.value.currentPeformance,startDate:r().startOf("day").subtract(a.value.currentPeformancePeriod,"day").toISOString(),endDate:r().endOf("day").toISOString()},e=await o(M,t,"analysisProcessPerformance","network-only");e&&typeof e=="object"&&"data"in e&&(a.value.peformanceStats.analysis=e.data)}catch{}finally{a.value.fetchingAnalysisPeformanceStats=!1}},v=async()=>{try{a.value.fetchingLaggards=!0;const t=await o(N,{},"sampleLaggards","network-only");t&&typeof t=="object"&&"data"in t&&(a.value.laggards=t.data)}catch{}finally{a.value.fetchingLaggards=!1}},d=t=>{a.value.currentTab=t},_=t=>{a.value.currentFilter=t},n=(t,e)=>{a.value.filterRange.from=t.toDate().toLocaleDateString(),a.value.filterRange.fromIso=t.toISOString(),a.value.filterRange.to=e.toDate().toLocaleDateString(),a.value.filterRange.toIso=e.toISOString()},P=t=>{a.value={...a.value,currentPeformance:t}},G=t=>{const T=+t.target.value;a.value.currentPeformancePeriod=T},k=t=>{a.value.showFilters=t},D=t=>{switch(t){case"T":n(r().startOf("day"),r().endOf("day"));break;case"Y":n(r().startOf("day").subtract(1,"day"),r().endOf("day").subtract(1,"day"));break;case"TW":n(r().startOf("week"),r().endOf("week"));break;case"LW":n(r().startOf("week").subtract(1,"week"),r().endOf("week").subtract(1,"week"));break;case"TM":n(r().startOf("month"),r().endOf("month"));break;case"LM":n(r().startOf("month").subtract(1,"month"),r().endOf("month").subtract(1,"month"));break;case"TQ":n(r().startOf("quarter"),r().endOf("quarter"));break;case"LQ":n(r().startOf("quarter").subtract(1,"quarter"),r().endOf("quarter").subtract(1,"quarter"));break;case"TY":n(r().startOf("year"),r().endOf("year"));break}};return D(a.value.currentFilter),$(()=>a.value.currentFilter,t=>{D(t)}),{dashboard:a,setShowFilters:k,filterToolTip:w,setCurrentTab:d,setCurrentFilter:_,setFilterRange:n,getOverViewStats:l,getResourceStats:f,getSampleLaggards:v,getSampleProcessPeformance:c,getAnalysisProcessPeformance:y,setCurrentPeformanceById:P,setCurrentPeformancePeriod:G}});export{z as u};
