import{g as e}from"./index-54016222.js";const a=e`
    query getLaboratory($setupName: String! = "felicity") {
  laboratory(setupName: $setupName) {
    uid
    setupName
    labName
    tagLine
    labManagerUid
    email
    emailCc
    mobilePhone
    businessPhone
    address
    banking
    logo
    qualityStatement
  }
}
    `,r=e`
    query getLaboratorySetting($setupName: String! = "felicity") {
  laboratorySetting(setupName: $setupName) {
    uid
    laboratoryUid
    allowSelfVerification
    allowPatientRegistration
    allowSampleRegistration
    allowWorksheetCreation
    defaultRoute
    passwordLifetime
    inactivityLogOut
    defaultTheme
    autoReceiveSamples
    stickerCopies
    allowBilling
    allowAutoBilling
    currency
    paymentTermsDays
  }
}
    `,i=e`
    query userAll($first: Int, $after: String, $text: String, $sortBy: [String!] = ["uid"]) {
  userAll(pageSize: $first, afterCursor: $after, text: $text, sortBy: $sortBy) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      uid
      firstName
      lastName
      email
      isActive
      isSuperuser
      mobilePhone
      userName
      isBlocked
      groups {
        uid
        name
        keyword
        pages
        permissions {
          uid
          action
          target
        }
      }
    }
  }
}
    `,s=e`
    query groupsAndPermissions {
  groupAll {
    uid
    name
    keyword
    pages
    active
    permissions {
      uid
      action
      target
    }
  }
  permissionAll {
    uid
    action
    target
  }
}
    `,o=e`
    query getAuditLogs($targetType: String!, $targetUid: String!) {
  auditLogsFilter(targetType: $targetType, targetUid: $targetUid) {
    uid
    userUid
    targetType
    targetUid
    action
    stateBefore
    stateAfter
  }
}
    `,n=e`
    query getAllDepartments {
  departmentAll {
    uid
    name
    code
    description
  }
}
    `;export{s as G,i as U,n as a,a as b,r as c,o as d};
