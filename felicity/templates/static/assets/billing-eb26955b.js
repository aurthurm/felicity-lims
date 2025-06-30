import{g as t,f as a,d as c}from"./index-56caabce.js";const U=t`
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
    `,P=t`
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
    `,B=t`
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
    `,I=t`
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
    `,$=t`
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
    `,T=t`
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
    `,V=t`
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
    `,E=t`
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
    `,b=t`
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
    `,C=t`
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
    `,l=t`
    query GetPriceForAnalysis($analysisUid: String!) {
  priceForAnalysis(analysisUid: $analysisUid) {
    uid
    analysisUid
    isActive
    amount
  }
}
    `,u=t`
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
    query getBillsForClient($clientUid: String!) {
  billsForClient(clientUid: $clientUid) {
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
    `,m=t`
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
    `,_=t`
    query impressBillingReport($billUid: String!) {
  billInvoiceCreate(billUid: $billUid)
}
    `,F=t`
    query getOrdersByBillUid($uid: String!) {
  ordersByBillUid(uid: $uid) {
    uid
    clientRequestId
    requestId
    createdAt
    patient {
      uid
      firstName
      lastName
      clientPatientId
      gender
      dateOfBirth
      age
      ageDobEstimated
      consentSms
    }
    samples {
      uid
      sampleType {
        name
      }
      sampleId
      priority
      status
      analyses {
        uid
        name
        sortKey
      }
      profiles {
        uid
        name
      }
    }
  }
}
    `,{withClientQuery:s}=a(),S=c("billing",{state:()=>({profilePrice:void 0,profileDiscount:void 0,fetchingPrice:!1,analysisPrice:void 0,analysisDiscount:void 0,fetchingDiscount:!1,vouchers:[],fetchingVouchers:!1,fetchingVoucher:!1,fetchingVoucherCodes:!1,bills:[],fetchingBills:!1,transactions:[],fetchingTransactions:!1}),getters:{getVouchers:i=>i.vouchers,getProfilePrice:i=>i.profilePrice,getAnalysisPrice:i=>i.analysisPrice,getBills:i=>i.bills},actions:{async clear(){this.analysisPrice=void 0,this.analysisDiscount=void 0,this.profilePrice=void 0,this.profileDiscount=void 0},async fetchProfilePrice(i){if(!i){console.error("Invalid profile UID provided to fetchProfilePrice");return}try{this.fetchingPrice=!0;const e=await s(d,{profileUid:i},"priceForProfile");e?this.profilePrice=e:console.error("Invalid profile price data received:",e)}catch(e){console.error("Error fetching profile price:",e)}finally{this.fetchingPrice=!1}},async fetchProfileDiscount(i){if(!i){console.error("Invalid profile UID provided to fetchProfileDiscount");return}try{this.fetchingDiscount=!0;const e=await s(u,{profileUid:i},"discountForProfile");e?this.profileDiscount=e:console.error("Invalid profile discount data received:",e)}catch(e){console.error("Error fetching profile discount:",e)}finally{this.fetchingDiscount=!1}},async fetchAnalysisPrice(i){if(!i){console.error("Invalid analysis UID provided to fetchAnalysisPrice");return}try{this.fetchingPrice=!0;const e=await s(l,{analysisUid:i},"priceForAnalysis");e?this.analysisPrice=e:console.error("Invalid analysis price data received:",e)}catch(e){console.error("Error fetching analysis price:",e)}finally{this.fetchingPrice=!1}},async fetchAnalysisDiscount(i){if(!i){console.error("Invalid analysis UID provided to fetchAnalysisDiscount");return}try{this.fetchingDiscount=!0;const e=await s(h,{analysisUid:i},"discountForAnalysis");e?this.analysisDiscount=e:console.error("Invalid analysis discount data received:",e)}catch(e){console.error("Error fetching analysis discount:",e)}finally{this.fetchingDiscount=!1}},async fetchVouchers(){try{this.fetchingVouchers=!0;const i=await s(y,{},"voucherAll");i&&Array.isArray(i)?this.vouchers=i:console.error("Invalid vouchers data received:",i)}catch(i){console.error("Error fetching vouchers:",i)}finally{this.fetchingVouchers=!1}},async fetchVoucherByUid(i){if(!i){console.error("Invalid voucher UID provided to fetchVoucherByUid");return}try{this.fetchingVoucher=!0;const e=await s(p,{uid:i},"voucherByUid");if(e&&typeof e=="object"&&"uid"in e){const r=e,o=this.vouchers?.findIndex(n=>n.uid===r.uid);o>-1?this.vouchers[o]=r:this.vouchers=[r,...this.vouchers]}else console.error("Invalid voucher data received:",e)}catch(e){console.error("Error fetching voucher by UID:",e)}finally{this.fetchingVoucher=!1}},async fetchVoucherCodes(i){if(!i){console.error("Invalid voucher UID provided to fetchVoucherCodes");return}try{this.fetchingVoucherCodes=!0;const e=await s(f,{voucherUid:i},"voucherCodes");if(e&&Array.isArray(e)){const r=e,o=this.vouchers?.findIndex(n=>n.uid===i);o>-1&&(this.vouchers[o]={...this.vouchers[o],codes:r})}else console.error("Invalid voucher codes data received:",e)}catch(e){console.error("Error fetching voucher codes:",e)}finally{this.fetchingVoucherCodes=!1}},addVoucher(i){if(!i?.uid){console.error("Invalid voucher payload:",i);return}this.vouchers=[i,...this.vouchers]},updateVoucher(i){if(!i?.uid){console.error("Invalid voucher payload:",i);return}const e=this.vouchers?.findIndex(r=>r.uid===i.uid);e>-1&&(this.vouchers[e]={...this.vouchers[e],...i})},addVoucherCode(i){if(!i?.uid||!i?.voucherUid){console.error("Invalid voucher code payload:",i);return}const e=this.vouchers?.findIndex(r=>r.uid===i.voucherUid);e>-1&&(this.vouchers[e]={...this.vouchers[e],codes:[i,...this.vouchers[e].codes||[]]})},updateVoucherCode(i){if(!i?.uid||!i?.voucherUid){console.error("Invalid voucher code payload:",i);return}const e=this.vouchers?.findIndex(r=>r.uid===i.voucherUid);if(e>-1){const r=this.vouchers[e].codes||[],o=r?.findIndex(n=>n.uid===i.uid);o>-1&&(r[o]={...r[o],...i},this.vouchers[e]={...this.vouchers[e],codes:r})}},async fetchBillsForPatient(i){if(!i){console.error("Invalid patient UID provided to fetchBillsForPatient");return}try{this.fetchingBills=!0;const e=await s(v,{patientUid:i},"billsForPatient");e&&Array.isArray(e)?this.bills=e:console.error("Invalid bills data received:",e)}catch(e){console.error("Error fetching bills for patient:",e)}finally{this.fetchingBills=!1}},async fetchBillsForClient(i){if(!i){console.error("Invalid client UID provided to fetchBillsForClient");return}try{this.fetchingBills=!0;const e=await s(g,{clientUid:i},"billsForClient");e&&Array.isArray(e)?this.bills=e:console.error("Invalid bills data received:",e)}catch(e){console.error("Error fetching bills for client:",e)}finally{this.fetchingBills=!1}},async fetchBillTransactions(i){if(!i){console.error("Invalid bill UID provided to fetchBillTransactions");return}try{this.fetchingTransactions=!0,this.transactions=[];const e=await s(m,{billUid:i},"billTransactions");e&&Array.isArray(e)?this.transactions=e:console.error("Invalid bill transactions data received:",e)}catch(e){console.error("Error fetching bill transactions:",e)}finally{this.fetchingTransactions=!1}},addTransaction(i){if(!i?.uid){console.error("Invalid transaction payload:",i);return}this.transactions=[i,...this.transactions]},updateTransaction(i){if(!i?.uid){console.error("Invalid transaction payload:",i);return}const e=this.transactions?.findIndex(r=>r.uid===i.uid);e>-1&&(this.transactions[e]={...this.transactions[e],...i})}}});export{E as A,b as C,U as E,F as G,_ as I,D as a,P as b,B as c,C as d,I as e,$ as f,T as g,V as h,S as u};
