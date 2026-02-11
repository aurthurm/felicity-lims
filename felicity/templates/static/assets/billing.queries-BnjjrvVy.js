import{k as e}from"./index-Daoe3XS9.js";const t=e`
    query GetPiceForProfile($profileUid: String!) {
  priceForProfile(profileUid: $profileUid) {
    uid
    profileUid
    isActive
    amount
  }
}
    `,a=e`
    query GetPriceForAnalysis($analysisUid: String!) {
  priceForAnalysis(analysisUid: $analysisUid) {
    uid
    analysisUid
    isActive
    amount
  }
}
    `,s=e`
    query GetBatchPrices($profileUids: [String!]!, $analysisUids: [String!]!) {
  pricesForBatch(profileUids: $profileUids, analysisUids: $analysisUids) {
    profilePrices {
      uid
      profileUid
      profile {
        uid
        name
      }
      isActive
      amount
    }
    analysisPrices {
      uid
      analysisUid
      analysis {
        uid
        name
      }
      isActive
      amount
    }
  }
}
    `,r=e`
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
    `,d=e`
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
    `,n=e`
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
    `,o=e`
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
    `,l=e`
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
    `,c=e`
    query SearchBills($pageSize: Int!, $afterCursor: String, $beforeCursor: String, $text: String, $isActive: Boolean, $partial: Boolean, $clientUid: String, $sortBy: [String!]) {
  searchBills(
    pageSize: $pageSize
    afterCursor: $afterCursor
    beforeCursor: $beforeCursor
    text: $text
    isActive: $isActive
    partial: $partial
    clientUid: $clientUid
    sortBy: $sortBy
  ) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
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
        patientUid
        patient {
          firstName
          lastName
          clientPatientId
          gender
          dateOfBirth
        }
        samples {
          uid
          sampleId
          status
        }
      }
      createdAt
      updatedAt
    }
  }
}
    `,u=e`
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
    `,p=e`
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
    `,m=e`
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
    `,U=e`
    query impressBillingReport($billUid: String!) {
  billInvoiceCreate(billUid: $billUid)
}
    `,y=e`
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
    `,g=e`
    query getBillingOverviewMetrics($startDate: DateTime, $endDate: DateTime) {
  billingOverviewMetrics(startDate: $startDate, endDate: $endDate) {
    keyMetrics {
      totalCharged
      totalPaid
      outstandingBalance
      collectionRate
    }
    volumeMetrics {
      activeBills
      inactiveBills
      pendingConfirmation
      partialBills
      completeBills
    }
    transactionMetrics {
      successfulTransactions
      failedTransactions
      pendingTransactions
      totalTransactionAmount
    }
    discountMetrics {
      totalDiscountAmount
      activeVouchers
      totalVouchers
      voucherRedemptionRate
      vouchersWithAvailableUsage
    }
  }
}
    `;export{s as G,U as I,c as S,m as a,p as b,u as c,l as d,o as e,n as f,d as g,a as h,r as i,t as j,g as k,y as l};
