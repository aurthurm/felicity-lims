import{aT as T,aU as B,g as c,f as I,e as r,d as L,a0 as A,W as q,aV as f}from"./index-54016222.js";var D={exports:{}};(function(a,h){(function(l,d){a.exports=d()})(T,function(){var l="month",d="quarter";return function(b,g){var i=g.prototype;i.quarter=function(s){return this.$utils().u(s)?Math.ceil((this.month()+1)/3):this.month(this.month()%3+3*(s-1))};var m=i.add;i.add=function(s,u){return s=Number(s),this.$utils().p(u)===d?this.add(3*s,l):m.bind(this)(s,u)};var v=i.startOf;i.startOf=function(s,u){var y=this.$utils(),S=!!y.u(u)||u;if(y.p(s)===d){var p=this.quarter()-1;return S?this.month(3*p).startOf(l).startOf("day"):this.month(3*p+2).endOf(l).endOf("day")}return v.bind(this)(s,u)}}})})(D);var $=D.exports;const x=B($),E=c`
    query getSampleGroupByStatus {
  countSampleGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `,R=c`
    query getExtrasGroupByStatus {
  countExtrasGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `,W=c`
    query getAnalysisGroupByStatus {
  countAnalyteGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `,j=c`
    query getWorksheetGroupByStatus {
  countWorksheetGroupByStatus {
    data {
      __typename
      group
      count
    }
  }
}
    `,F=c`
    query getAnalysisGroupByInstrument($startDate: String!, $endDate: String!) {
  countAnalyteGroupByInstrument(startDate: $startDate, endDate: $endDate) {
    data {
      __typename
      group
      count
    }
  }
}
    `,V=c`
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
    `,Y=c`
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
    `,M=c`
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
    `,Q=c`
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
    `,{withClientQuery:n}=I();r.extend(x);const N=L("dashboard",()=>{const a=A({currentTab:"overview",tabs:["overview","resource","laggard","peformance","notices","line-listing"],showFilters:!1,filterRange:{from:"",fromIso:"",to:"",toIso:""},currentFilter:"TW",filters:["T","Y","TW","LW","TM","LM","TQ","LQ","TY"],overViewStats:{analyses:[],samples:[],extras:[],worksheets:[]},fetchingOverViewStats:!1,resourceStats:{instruments:[],samples:[]},fetchingResourceStats:!1,peformancePeriods:[30,60,90,180,365],currentPeformancePeriod:30,peformanceStats:{sample:[],analysis:[]},fetchingSampePeformanceStats:!1,fetchingAnalysisPeformanceStats:!1,currentPeformance:"received_to_published",performances:["received_to_published","received_to_submitted","submitted_to_verified","verified_to_published"],perfs:{received_to_published:"Received to Published",received_to_submitted:"Received to Submitted",submitted_to_verified:"Submitted to Verified",verified_to_published:"Verified to Published"},laggards:{},fetchingLaggards:!1}),h=e=>e==="T"?"Today":e==="Y"?"Yesterday":e==="TW"?"This Week":e==="LW"?"Last Week":e==="TM"?"This Month":e==="LM"?"Last Month":e==="TQ"?"This Quarter":e==="LQ"?"Last Quarter":e==="TY"?"This Year":"Unknown Filter",l=async()=>{a.value.fetchingOverViewStats=!0;try{await b(),await g(),await i(),await m()}catch(e){console.error("Error fetching overview stats:",e)}finally{a.value.fetchingOverViewStats=!1}},d=async()=>{a.value.fetchingResourceStats=!0;try{await v(),await s()}catch(e){console.error("Error fetching resource stats:",e)}finally{a.value.fetchingResourceStats=!1}},b=async()=>{try{const t=await n(E,{},"countSampleGroupByStatus","network-only");t&&typeof t=="object"&&"data"in t?a.value.overViewStats.samples=f(t.data,["scheduled","expected","received","awaiting","approved"],"group"):console.error("Invalid sample group by status data received:",t)}catch(e){console.error("Error counting samples groups by status:",e)}},g=async()=>{try{const e={},t=await n(W,{},"countAnalyteGroupByStatus","network-only");t&&typeof t=="object"&&"data"in t?a.value.overViewStats.analyses=f(t.data,["pending","resulted"],"group"):console.error("Invalid analysis group by status data received:",t)}catch(e){console.error("Error counting analysis groups by status:",e)}},i=async()=>{try{const t=await n(j,{},"countWorksheetGroupByStatus","network-only");t&&typeof t=="object"&&"data"in t?a.value.overViewStats.worksheets=f(t.data,["empty","awaiting","pending"],"group"):console.error("Invalid worksheet group by status data received:",t)}catch(e){console.error("Error counting worksheet groups by status:",e)}},m=async()=>{try{const t=await n(R,{},"countExtrasGroupByStatus","network-only");t&&typeof t=="object"&&"data"in t?a.value.overViewStats.extras=f(t.data,["sample cancelled","sample rejected","sample invalidated","analysis retracted","analysis retested"],"group"):console.error("Invalid extras group by status data received:",t)}catch(e){console.error("Error counting extras groups by status:",e)}},v=async()=>{try{const e={startDate:a.value.filterRange.fromIso,endDate:a.value.filterRange.toIso},t=await n(F,e,"countAnalyteGroupByInstrument","network-only");t&&typeof t=="object"&&"data"in t?a.value.resourceStats.instruments=t.data:console.error("Invalid analysis group by instrument data received:",t)}catch(e){console.error("Error counting analysis groups by instrument:",e)}},s=async()=>{try{const e={startDate:a.value.filterRange.fromIso,endDate:a.value.filterRange.toIso},t=await n(M,e,"countSampleGroupByAction","network-only");t&&typeof t=="object"&&"data"in t?a.value.resourceStats.samples=t.data:console.error("Invalid sample group by action data received:",t)}catch(e){console.error("Error getting sample groups by action:",e)}},u=async()=>{try{a.value.fetchingSampePeformanceStats=!0;const e={startDate:r().startOf("day").subtract(a.value.currentPeformancePeriod,"day").toISOString(),endDate:r().endOf("day").toISOString()},t=await n(V,e,"sampleProcessPerformance","network-only");t&&typeof t=="object"&&"data"in t?a.value.peformanceStats.sample=t.data:console.error("Invalid sample process performance data received:",t)}catch(e){console.error("Error getting sample process performance:",e)}finally{a.value.fetchingSampePeformanceStats=!1}},y=async()=>{try{a.value.fetchingAnalysisPeformanceStats=!0;const e={process:a.value.currentPeformance,startDate:r().startOf("day").subtract(a.value.currentPeformancePeriod,"day").toISOString(),endDate:r().endOf("day").toISOString()},t=await n(Y,e,"analysisProcessPerformance","network-only");t&&typeof t=="object"&&"data"in t?a.value.peformanceStats.analysis=t.data:console.error("Invalid analysis process performance data received:",t)}catch(e){console.error("Error getting analysis process performance:",e)}finally{a.value.fetchingAnalysisPeformanceStats=!1}},S=async()=>{try{a.value.fetchingLaggards=!0;const e=await n(Q,{},"sampleLaggards","network-only");e&&typeof e=="object"&&"data"in e?a.value.laggards=e.data:console.error("Invalid sample laggards data received:",e)}catch(e){console.error("Error getting sample laggards:",e)}finally{a.value.fetchingLaggards=!1}},p=e=>{a.value.currentTab=e},_=e=>{a.value.currentFilter=e},o=(e,t)=>{a.value.filterRange.from=e.toDate().toLocaleDateString(),a.value.filterRange.fromIso=e.toISOString(),a.value.filterRange.to=t.toDate().toLocaleDateString(),a.value.filterRange.toIso=t.toISOString()},P=e=>{const t=e.target;a.value.currentPeformance=t.value},O=e=>{const G=+e.target.value;a.value.currentPeformancePeriod=G},k=e=>{a.value.showFilters=e},w=e=>{switch(e){case"T":o(r().startOf("day"),r().endOf("day"));break;case"Y":o(r().startOf("day").subtract(1,"day"),r().endOf("day").subtract(1,"day"));break;case"TW":o(r().startOf("week"),r().endOf("week"));break;case"LW":o(r().startOf("week").subtract(1,"week"),r().endOf("week").subtract(1,"week"));break;case"TM":o(r().startOf("month"),r().endOf("month"));break;case"LM":o(r().startOf("month").subtract(1,"month"),r().endOf("month").subtract(1,"month"));break;case"TQ":o(r().startOf("quarter"),r().endOf("quarter"));break;case"LQ":o(r().startOf("quarter").subtract(1,"quarter"),r().endOf("quarter").subtract(1,"quarter"));break;case"TY":o(r().startOf("year"),r().endOf("year"));break;default:console.error("Unknown Range Selected");break}};return w(a.value.currentFilter),q(()=>a.value.currentFilter,e=>{w(e)}),{dashboard:a,setShowFilters:k,filterToolTip:h,setCurrentTab:p,setCurrentFilter:_,setFilterRange:o,getOverViewStats:l,getResourceStats:d,getSampleLaggards:S,getSampleProcessPeformance:u,getAnalysisProcessPeformance:y,setCurrentPeformance:P,setCurrentPeformancePeriod:O}});export{N as u};
