import{H as t,I as r,Q as c}from"./index-68ba4247.js";const U=t`
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
    `,A=t`
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
    `,D=t`
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
    `,V=t`
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
    `,_=t`
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
    `,C=t`
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
    `,I=t`
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
    `,p=t`
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
    `,y=t`
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
    `,g=t`
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
    `,S=t`
    query impressBillingReport($billUid: String!) {
  billInvoiceCreate(billUid: $billUid)
}
    `,{withClientQuery:o}=r(),E=c("billing",{state:()=>({profilePrice:void 0,profileDiscount:void 0,fetchingPrice:!1,analysisPrice:void 0,analyisDiscount:void 0,fetchingDiscount:!1,vouchers:[],fetchingVouchers:!1,fetchingVoucher:!1,fetchingVoucherCodes:!1,bills:[],fetchingBills:!1,transactions:[],fetchingTransactions:!1}),getters:{getVouchers:i=>i.vouchers,getProfilePrice:i=>i.profilePrice,getAnalysisPrice:i=>i.analysisPrice,getBills:i=>i.bills},actions:{async clear(){this.analysisPrice=void 0,this.analyisDiscount=void 0,this.profilePrice=void 0,this.profileDiscount=void 0},async fetchProfilePrice(i){this.fetchingPrice=!0,await o(d,{profileUid:i},"priceForProfile").then(e=>{this.fetchingPrice=!1,this.profilePrice=e}).catch(e=>this.fetchingPrice=!1)},async fetchProfileDiscount(i){this.fetchingDiscount=!0,await o(l,{profileUid:i},"discountForProfile").then(e=>{this.fetchingDiscount=!1,this.profileDiscount=e}).catch(e=>this.fetchingDiscount=!1)},async fetchAnalysisPrice(i){this.fetchingPrice=!0,await o(u,{analysisUid:i},"priceForAnalysis").then(e=>{this.fetchingPrice=!1,this.analysisPrice=e}).catch(e=>this.fetchingPrice=!1)},async fetchAnalysisDiscount(i){this.fetchingDiscount=!0,await o(h,{analysisUid:i},"discountForAnalysis").then(e=>{this.fetchingDiscount=!1,this.analyisDiscount=e}).catch(e=>this.fetchingDiscount=!1)},async fetchVouchers(){this.fetchingVouchers=!0,await o(p,{},"voucherAll").then(i=>{this.fetchingVouchers=!1,this.vouchers=i}).catch(i=>this.fetchingVouchers=!1)},async fetchVoucherbyUid(i){this.fetchingVoucher=!0,await o(y,{uid:i},"voucherByUid").then(e=>{this.fetchingVoucher=!1;const s=this.vouchers?.findIndex(a=>a.uid===e.uid);s>-1?this.vouchers[s]=e:this.vouchers=[e,...this.vouchers]}).catch(e=>this.fetchingVoucher=!1)},async fetchVoucherCodes(i){this.fetchingVoucherCodes=!0,await o(f,{voucherUid:i},"voucherCodes").then(e=>{this.fetchingVoucherCodes=!1;const s=this.vouchers?.findIndex(a=>a.uid===e.uid);s>-1&&(this.vouchers[s]={...this.vouchers[s],codes:e})}).catch(e=>this.fetchingVoucherCodes=!1)},async addVoucher(i){this.vouchers=[i,...this.vouchers]},async updateVoucher(i){const e=this.vouchers?.findIndex(s=>s.uid===i.uid);e>-1&&(this.vouchers[e]={...this.vouchers[e],...i})},async addVoucherCode(i){const e=this.vouchers?.findIndex(s=>s.uid===i.voucherUid);e>-1&&(this.vouchers[e]={...this.vouchers[e],codes:[i,...this.vouchers[e].codes]})},async updateVoucherCode(i){const e=this.vouchers?.findIndex(n=>n.uid===i.voucherUid),s=this.vouchers[e].codes,a=s?.findIndex(n=>n.uid===i.uid);e>-1&&a>-1&&(s[a]={...s[a],...i},this.vouchers[e]={...this.vouchers[e],codes:s})},async fetchBillsForPatient(i){this.fetchingBills=!0,await o(g,{patientUid:i},"billsForPatient").then(e=>{this.fetchingBills=!1,this.bills=e}).catch(e=>this.fetchingBills=!1)},async fetchBillTransactions(i){this.fetchingTransactions=!0,this.transactions=[],await o(m,{billUid:i},"billTransactions").then(e=>{this.fetchingTransactions=!1,this.transactions=e}).catch(e=>this.fetchingTransactions=!1)},async addTransaction(i){this.transactions=[i,...this.transactions]},async updateTransaction(i){const e=this.transactions?.findIndex(s=>s.uid===i.uid);e>-1&&(this.transactions[e]={...this.transactions[e],...i})}}});export{_ as A,C,$ as E,S as I,I as a,B as b,U as c,A as d,P as e,D as f,V as g,T as h,E as u};
