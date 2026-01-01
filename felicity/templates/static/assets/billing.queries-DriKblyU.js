import{k as e}from"./index-Cdc6vSVw.js";const i=e`
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
    `,s=e`
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
    `,d=e`
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
    `,n=e`
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
    `,o=e`
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
    `,l=e`
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
    `,c=e`
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
    `,u=e`
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
    `,p=e`
    query impressBillingReport($billUid: String!) {
  billInvoiceCreate(billUid: $billUid)
}
    `,U=e`
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
    `,y=e`
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
    `;export{m as G,p as I,l as S,u as a,c as b,o as c,n as d,d as e,s as f,a as g,r as h,i,y as j,U as k};
