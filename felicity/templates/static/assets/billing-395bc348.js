import{g as t,f as a,d as c}from"./index-54016222.js";const A=t`
    mutation EditProfilePricing($uid: String!, $payload: PriceInput!) {
  updateProfilePrice(uid: $uid, payload: $payload) {
    ... on ProfilePriceType {
      __typename
      uid
      isActive
      amount
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,D=t`
    mutation EditAnalysisPricing($uid: String!, $payload: PriceInput!) {
  updateAnalysisPrice(uid: $uid, payload: $payload) {
    ... on AnalysisPriceType {
      __typename
      uid
      isActive
      amount
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,U=t`
    mutation EditProfileDiscount($uid: String!, $payload: PriceDiscountInput!) {
  updateProfileDiscount(uid: $uid, payload: $payload) {
    ... on ProfileDiscountType {
      __typename
      uid
      profileUid
      name
      discountType
      valueType
      startDate
      endDate
      voucherUid
      valuePercent
      valueAmount
      isActive
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,P=t`
    mutation EditAnalysisDiscount($uid: String!, $payload: PriceDiscountInput!) {
  updateAnalysisDiscount(uid: $uid, payload: $payload) {
    ... on AnalysisDiscountType {
      __typename
      uid
      analysisUid
      name
      discountType
      valueType
      startDate
      endDate
      voucherUid
      valuePercent
      valueAmount
      isActive
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,B=t`
    mutation addVoucher($payload: VoucherInput!) {
  createVoucher(payload: $payload) {
    __typename
    ... on VoucherType {
      uid
      name
      usageLimit
      used
      startDate
      endDate
      oncePerCustomer
      oncePerOrder
      createdAt
      createdByUid
      updatedAt
      updatedByUid
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `,I=t`
    mutation editVoucher($uid: String!, $payload: VoucherInput!) {
  updateVoucher(uid: $uid, payload: $payload) {
    __typename
    ... on VoucherType {
      uid
      name
      usageLimit
      used
      startDate
      endDate
      oncePerCustomer
      oncePerOrder
      createdAt
      createdByUid
      updatedAt
      updatedByUid
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `,$=t`
    mutation addVoucherCode($payload: VoucherCodeInput!) {
  createVoucherCode(payload: $payload) {
    __typename
    ... on VoucherCodeType {
      uid
      voucherUid
      code
      usageLimit
      used
      isActive
      createdAt
      createdByUid
      updatedAt
      updatedByUid
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `,T=t`
    mutation editVoucherCode($uid: String!, $payload: VoucherCodeInput!) {
  updateVoucherCode(uid: $uid, payload: $payload) {
    __typename
    ... on VoucherCodeType {
      uid
      voucherUid
      code
      usageLimit
      used
      isActive
      createdAt
      createdByUid
      updatedAt
      updatedByUid
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `,V=t`
    mutation addTestBillTransaction($payload: BillTransactionInput!) {
  createTestBillTransaction(payload: $payload) {
    __typename
    ... on TestBillTransactionType {
      uid
      testBillUid
      kind
      amount
      isSuccess
      actionRequired
      processed
      notes
      createdAt
      createdByUid
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `,E=t`
    mutation confirmTestBillTransaction($uid: String!, $notes: String) {
  confirmTestBillTransaction(uid: $uid, notes: $notes) {
    __typename
    ... on TestBillTransactionType {
      uid
      testBillUid
      kind
      amount
      isSuccess
      actionRequired
      processed
      notes
      createdAt
      createdByUid
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `,_=t`
    mutation applyBillVoucher($payload: ApplyVoucherInput!) {
  applyVoucher(payload: $payload) {
    __typename
    ... on TestBillTransactionType {
      uid
      testBillUid
      kind
      amount
      isSuccess
      actionRequired
      processed
      notes
      createdAt
      createdByUid
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `,d=t`
    query GetPiceForProfile($profileUid: String!) {
  priceForProfile(profileUid: $profileUid) {
    uid
    profileUid
    isActive
    amount
  }
}
    `,u=t`
    query GetPriceForAnalysis($analysisUid: String!) {
  priceForAnalysis(analysisUid: $analysisUid) {
    uid
    analysisUid
    isActive
    amount
  }
}
    `,l=t`
    query GetDiscountForProfile($profileUid: String!) {
  discountForProfile(profileUid: $profileUid) {
    uid
    profileUid
    name
    discountType
    valueType
    startDate
    endDate
    voucherUid
    voucher {
      uid
      name
      usageLimit
      used
      startDate
      endDate
    }
    valuePercent
    valueAmount
    isActive
  }
}
    `,h=t`
    query GetDiscountForAnalysis($analysisUid: String!) {
  discountForAnalysis(analysisUid: $analysisUid) {
    uid
    analysisUid
    name
    discountType
    valueType
    startDate
    endDate
    voucherUid
    voucher {
      uid
      name
      usageLimit
      used
      startDate
      endDate
    }
    valuePercent
    valueAmount
    isActive
  }
}
    `,y=t`
    query getAllVouchers {
  voucherAll {
    uid
    name
    usageLimit
    used
    startDate
    endDate
    oncePerCustomer
    oncePerOrder
    codes {
      uid
      code
      usageLimit
      used
      isActive
      createdAt
      createdByUid
      updatedAt
      updatedByUid
    }
    createdAt
    createdByUid
    updatedAt
    updatedByUid
  }
}
    `,p=t`
    query getVoucherByUid($uid: String!) {
  voucherByUid(uid: $uid) {
    uid
    name
    usageLimit
    used
    startDate
    endDate
    oncePerCustomer
    oncePerOrder
    codes {
      uid
      code
      usageLimit
      used
      isActive
      createdAt
      createdByUid
      updatedAt
      updatedByUid
    }
    createdAt
    createdByUid
    updatedAt
    updatedByUid
  }
}
    `,f=t`
    query getVoucherCodes($voucherUid: String!) {
  voucherCodes(voucherUid: $voucherUid) {
    uid
    voucherUid
    code
    usageLimit
    used
    isActive
    createdAt
    createdByUid
    updatedAt
    updatedByUid
  }
}
    `,v=t`
    query getBillsForPatient($patientUid: String!) {
  billsForPatient(patientUid: $patientUid) {
    uid
    billId
    patientUid
    clientUid
    client {
      name
    }
    isActive
    toConfirm
    partial
    totalCharged
    totalPaid
    orders {
      uid
      requestId
      clientRequestId
    }
    createdAt
    updatedAt
  }
}
    `,g=t`
    query getBillTransactions($billUid: String!) {
  billTransactions(billUid: $billUid) {
    uid
    testBillUid
    kind
    amount
    isSuccess
    actionRequired
    processed
    notes
    createdAt
    createdByUid
  }
}
    `,b=t`
    query impressBillingReport($billUid: String!) {
  billInvoiceCreate(billUid: $billUid)
}
    `,{withClientQuery:s}=a(),S=c("billing",{state:()=>({profilePrice:void 0,profileDiscount:void 0,fetchingPrice:!1,analysisPrice:void 0,analysisDiscount:void 0,fetchingDiscount:!1,vouchers:[],fetchingVouchers:!1,fetchingVoucher:!1,fetchingVoucherCodes:!1,bills:[],fetchingBills:!1,transactions:[],fetchingTransactions:!1}),getters:{getVouchers:e=>e.vouchers,getProfilePrice:e=>e.profilePrice,getAnalysisPrice:e=>e.analysisPrice,getBills:e=>e.bills},actions:{async clear(){this.analysisPrice=void 0,this.analysisDiscount=void 0,this.profilePrice=void 0,this.profileDiscount=void 0},async fetchProfilePrice(e){if(!e){console.error("Invalid profile UID provided to fetchProfilePrice");return}try{this.fetchingPrice=!0;const i=await s(d,{profileUid:e},"priceForProfile");i?this.profilePrice=i:console.error("Invalid profile price data received:",i)}catch(i){console.error("Error fetching profile price:",i)}finally{this.fetchingPrice=!1}},async fetchProfileDiscount(e){if(!e){console.error("Invalid profile UID provided to fetchProfileDiscount");return}try{this.fetchingDiscount=!0;const i=await s(l,{profileUid:e},"discountForProfile");i?this.profileDiscount=i:console.error("Invalid profile discount data received:",i)}catch(i){console.error("Error fetching profile discount:",i)}finally{this.fetchingDiscount=!1}},async fetchAnalysisPrice(e){if(!e){console.error("Invalid analysis UID provided to fetchAnalysisPrice");return}try{this.fetchingPrice=!0;const i=await s(u,{analysisUid:e},"priceForAnalysis");i?this.analysisPrice=i:console.error("Invalid analysis price data received:",i)}catch(i){console.error("Error fetching analysis price:",i)}finally{this.fetchingPrice=!1}},async fetchAnalysisDiscount(e){if(!e){console.error("Invalid analysis UID provided to fetchAnalysisDiscount");return}try{this.fetchingDiscount=!0;const i=await s(h,{analysisUid:e},"discountForAnalysis");i?this.analysisDiscount=i:console.error("Invalid analysis discount data received:",i)}catch(i){console.error("Error fetching analysis discount:",i)}finally{this.fetchingDiscount=!1}},async fetchVouchers(){try{this.fetchingVouchers=!0;const e=await s(y,{},"voucherAll");e&&Array.isArray(e)?this.vouchers=e:console.error("Invalid vouchers data received:",e)}catch(e){console.error("Error fetching vouchers:",e)}finally{this.fetchingVouchers=!1}},async fetchVoucherByUid(e){if(!e){console.error("Invalid voucher UID provided to fetchVoucherByUid");return}try{this.fetchingVoucher=!0;const i=await s(p,{uid:e},"voucherByUid");if(i&&typeof i=="object"&&"uid"in i){const r=i,o=this.vouchers?.findIndex(n=>n.uid===r.uid);o>-1?this.vouchers[o]=r:this.vouchers=[r,...this.vouchers]}else console.error("Invalid voucher data received:",i)}catch(i){console.error("Error fetching voucher by UID:",i)}finally{this.fetchingVoucher=!1}},async fetchVoucherCodes(e){if(!e){console.error("Invalid voucher UID provided to fetchVoucherCodes");return}try{this.fetchingVoucherCodes=!0;const i=await s(f,{voucherUid:e},"voucherCodes");if(i&&Array.isArray(i)){const r=i,o=this.vouchers?.findIndex(n=>n.uid===e);o>-1&&(this.vouchers[o]={...this.vouchers[o],codes:r})}else console.error("Invalid voucher codes data received:",i)}catch(i){console.error("Error fetching voucher codes:",i)}finally{this.fetchingVoucherCodes=!1}},addVoucher(e){if(!e?.uid){console.error("Invalid voucher payload:",e);return}this.vouchers=[e,...this.vouchers]},updateVoucher(e){if(!e?.uid){console.error("Invalid voucher payload:",e);return}const i=this.vouchers?.findIndex(r=>r.uid===e.uid);i>-1&&(this.vouchers[i]={...this.vouchers[i],...e})},addVoucherCode(e){if(!e?.uid||!e?.voucherUid){console.error("Invalid voucher code payload:",e);return}const i=this.vouchers?.findIndex(r=>r.uid===e.voucherUid);i>-1&&(this.vouchers[i]={...this.vouchers[i],codes:[e,...this.vouchers[i].codes||[]]})},updateVoucherCode(e){if(!e?.uid||!e?.voucherUid){console.error("Invalid voucher code payload:",e);return}const i=this.vouchers?.findIndex(r=>r.uid===e.voucherUid);if(i>-1){const r=this.vouchers[i].codes||[],o=r?.findIndex(n=>n.uid===e.uid);o>-1&&(r[o]={...r[o],...e},this.vouchers[i]={...this.vouchers[i],codes:r})}},async fetchBillsForPatient(e){if(!e){console.error("Invalid patient UID provided to fetchBillsForPatient");return}try{this.fetchingBills=!0;const i=await s(v,{patientUid:e},"billsForPatient");i&&Array.isArray(i)?this.bills=i:console.error("Invalid bills data received:",i)}catch(i){console.error("Error fetching bills for patient:",i)}finally{this.fetchingBills=!1}},async fetchBillTransactions(e){if(!e){console.error("Invalid bill UID provided to fetchBillTransactions");return}try{this.fetchingTransactions=!0,this.transactions=[];const i=await s(g,{billUid:e},"billTransactions");i&&Array.isArray(i)?this.transactions=i:console.error("Invalid bill transactions data received:",i)}catch(i){console.error("Error fetching bill transactions:",i)}finally{this.fetchingTransactions=!1}},addTransaction(e){if(!e?.uid){console.error("Invalid transaction payload:",e);return}this.transactions=[e,...this.transactions]},updateTransaction(e){if(!e?.uid){console.error("Invalid transaction payload:",e);return}const i=this.transactions?.findIndex(r=>r.uid===e.uid);i>-1&&(this.transactions[i]={...this.transactions[i],...e})}}});export{B as A,E as C,A as E,b as I,D as a,U as b,P as c,I as d,$ as e,T as f,V as g,_ as h,S as u};
