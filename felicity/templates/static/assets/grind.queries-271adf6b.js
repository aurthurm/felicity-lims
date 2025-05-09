import{g as e}from"./index-6c3e61f6.js";const r=e`
    mutation AddGrindErrand($payload: GrindCreateErrandInput!) {
  createGrindErrand(payload: $payload) {
    ... on GrindErrandType {
      uid
      title
      description
      posterUid
      createdByUid
      createdAt
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,i=e`
    mutation EditGrindErrand($uid: String!, $payload: GrindUpdateErrandInput!) {
  updateGrindErrand(uid: $uid, payload: $payload) {
    ... on GrindErrandType {
      uid
      title
      description
      category
      priority
      startDate
      endDate
      poster {
        uid
      }
      stamps {
        uid
      }
      label {
        uid
      }
      assignee {
        uid
        firstName
        lastName
      }
      reporter {
        uid
        firstName
        lastName
      }
      members {
        uid
        firstName
        lastName
      }
      createdBy {
        uid
        firstName
        lastName
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,a=e`
    mutation AddGrindErrandDiscussion($payload: GrindCreateErrandDiscussionInput!) {
  createGrindErrandDiscussion(payload: $payload) {
    ... on GrindErrandDiscussionType {
      uid
      comment
      errandUid
      parentUid
      canEdit
      createdAt
      createdByUid
      createdBy {
        uid
        firstName
        lastName
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;e`
    mutation EditGrindErrandDiscussion($uid: String!, $payload: GrindUpdateErrandDiscussionInput!) {
  updateGrindErrandDiscussion(uid: $uid, payload: $payload) {
    ... on GrindErrandDiscussionType {
      uid
      comment
      errandUid
      parentUid
      canEdit
      createdAt
      createdByUid
      createdBy {
        uid
        firstName
        lastName
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;const d=e`
    mutation AddGrindMilestone($payload: GrindCreateMilestoneInput!) {
  createGrindMilestone(payload: $payload) {
    ... on GrindMilestoneType {
      uid
      title
      description
      errand {
        uid
      }
      createdBy {
        uid
        firstName
        lastName
      }
      assignee {
        uid
        firstName
        lastName
      }
      createdAt
      complete
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,n=e`
    mutation EditGrindMilestone($uid: String!, $payload: GrindUpdateMilestoneInput!) {
  updateGrindMilestone(uid: $uid, payload: $payload) {
    ... on GrindMilestoneType {
      uid
      title
      description
      errand {
        uid
      }
      createdBy {
        uid
        firstName
        lastName
      }
      assignee {
        uid
        firstName
        lastName
      }
      createdAt
      complete
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;e`
    mutation DeleteMilestone($uid: String!) {
  deleteGrindMilestone(uid: $uid) {
    ... on DeletedItem {
      uid
    }
  }
}
    `;const s=e`
    mutation AddGrindScheme($payload: GrindCreateSchemeInput!) {
  createGrindScheme(payload: $payload) {
    ... on GrindSchemeType {
      uid
      title
      description
      startDate
      endDate
      assignee {
        uid
        firstName
        lastName
      }
      members {
        uid
        firstName
        lastName
      }
      createdBy {
        uid
        firstName
        lastName
      }
      createdAt
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,o=e`
    mutation EditGrindScheme($uid: String!, $payload: GrindUpdateSchemeInput!) {
  updateGrindScheme(uid: $uid, payload: $payload) {
    ... on GrindSchemeType {
      uid
      title
      description
      startDate
      endDate
      assignee {
        uid
        firstName
        lastName
      }
      members {
        uid
        firstName
        lastName
      }
      createdBy {
        uid
        firstName
        lastName
      }
      createdAt
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,u=e`
    mutation AddGrindBoard($payload: GrindCreateBoardInput!) {
  createGrindBoard(payload: $payload) {
    ... on GrindBoardType {
      uid
      title
      description
      scheme {
        uid
        title
      }
      createdBy {
        uid
        firstName
        lastName
      }
      createdAt
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,m=e`
    mutation EditGrindBoard($uid: String!, $payload: GrindUpdateBoardInput!) {
  updateGrindBoard(uid: $uid, payload: $payload) {
    ... on GrindBoardType {
      uid
      title
      description
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,l=e`
    mutation AddGrindPoster($payload: GrindCreatePosterInput!) {
  createGrindPoster(payload: $payload) {
    ... on GrindPosterType {
      uid
      title
      errands {
        uid
      }
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;e`
    mutation AddGrindLabel($payload: GrindCreateLabelInput!) {
  createGrindLabel(payload: $payload) {
    ... on GrindLabelType {
      uid
      title
      category
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `;const p=e`
    mutation AddGrindStamp($payload: GrindCreateStampInput!) {
  createGrindStamp(payload: $payload) {
    ... on GrindStampType {
      uid
      title
      category
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,c=e`
    mutation AddGrindMedia($payload: GrindCreateMediaInput!) {
  createGrindMedia(payload: $payload) {
    ... on GrindMediaType {
      uid
      target
      targetUid
      filename
      originalName
      path
      size
      mimetype
    }
    ... on OperationError {
      __typename
      error
      suggestion
    }
  }
}
    `,y=e`
    mutation DeleteGrindMedia($uid: String!) {
  deleteGrindMedia(uid: $uid) {
    ... on DeletedItem {
      uid
    }
  }
}
    `;e`
    query GetGrindErrands($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
  grindErrandAll(
    pageSize: $first
    afterCursor: $after
    text: $text
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
      title
      description
      category
      priority
      startDate
      endDate
      milestonesAt
      poster {
        uid
        title
      }
      stamps {
        uid
        title
      }
      label {
        uid
        title
      }
      createdBy {
        uid
        firstName
        lastName
      }
      assignee {
        uid
        firstName
        lastName
      }
      reporter {
        uid
        firstName
        lastName
      }
      members {
        uid
        firstName
        lastName
      }
      createdAt
    }
  }
}
    `;const g=e`
    query GetGrindErrand($uid: String!) {
  grindErrandByUid(uid: $uid) {
    uid
    title
    description
    category
    priority
    startDate
    endDate
    posterUid
    milestonesAt
    poster {
      uid
      title
    }
    stamps {
      uid
      title
    }
    labelUid
    label {
      uid
      title
    }
    assignee {
      uid
      firstName
      lastName
    }
    reporter {
      uid
      firstName
      lastName
    }
    members {
      uid
      firstName
      lastName
    }
    createdBy {
      uid
      firstName
      lastName
    }
    createdAt
  }
}
    `,G=e`
    query GetGrindErrandDiscussions($errandUid: String!) {
  grindErrandDiscussions(errandUid: $errandUid) {
    uid
    comment
    errandUid
    parentUid
    subdiscussions {
      uid
      comment
      errandUid
      parentUid
    }
    canEdit
    createdAt
    createdByUid
    createdBy {
      uid
      firstName
      lastName
    }
  }
}
    `,$=e`
    query GetGrindErrandDiscussionsByParent($parentUid: String!) {
  grindErrandDiscussionsByParent(parentUid: $parentUid) {
    uid
    comment
    errandUid
    parentUid
    subdiscussions {
      uid
      comment
      errandUid
      parentUid
    }
    canEdit
    createdAt
    createdByUid
    createdBy {
      uid
      firstName
      lastName
    }
  }
}
    `;e`
    query GetGrindOccurrenciesByTarget($target: String!, $targetUid: String!) {
  grindOccurrencesByTarget(target: $target, targetUid: $targetUid) {
    uid
    description
    target
    targetUid
    actor {
      uid
      firstName
      lastName
    }
    createdAt
  }
}
    `;const N=e`
    query GetGrindMilestonesByErrand($errandUid: String!) {
  grindMilestonesByErrand(errandUid: $errandUid) {
    uid
    title
    description
    errand {
      uid
    }
    createdBy {
      uid
      firstName
      lastName
    }
    assignee {
      uid
      firstName
      lastName
    }
    createdAt
    complete
  }
}
    `,f=e`
    query GetGrindMedia($target: String!, $targetUid: String!) {
  grindMediaByTarget(target: $target, targetUid: $targetUid) {
    uid
    target
    targetUid
    destination
    encoding
    filename
    mimetype
    originalName
    path
    size
    createdBy {
      uid
      firstName
      lastName
    }
    createdAt
  }
}
    `,B=e`
    query GetGrindSchemeAll($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
  grindSchemeAll(
    pageSize: $first
    afterCursor: $after
    text: $text
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
      title
      description
      startDate
      endDate
      assignee {
        uid
        firstName
        lastName
      }
      members {
        uid
        firstName
        lastName
      }
      createdBy {
        uid
        firstName
        lastName
      }
      createdAt
    }
  }
}
    `,D=e`
    query GetGrindScheme($uid: String!) {
  grindSchemeByUid(uid: $uid) {
    uid
    title
    description
    startDate
    endDate
    assignee {
      uid
      firstName
      lastName
    }
    members {
      uid
      firstName
      lastName
    }
    boards {
      uid
      title
      description
    }
    createdBy {
      uid
      firstName
      lastName
    }
    createdAt
  }
}
    `,S=e`
    query GetGrindPostersByBoard($boardUid: String!) {
  grindPostersByBoard(boardUid: $boardUid) {
    uid
    title
    boardUid
    errands {
      uid
      title
      description
      priority
      startDate
      endDate
      progress
      posterUid
      milestonesAt
      stamps {
        uid
        title
      }
      labelUid
      assignee {
        uid
        firstName
        lastName
      }
      members {
        uid
        firstName
        lastName
      }
    }
  }
}
    `;e`
    query GetGrindStampAll($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
  grindStampAll(
    pageSize: $first
    afterCursor: $after
    text: $text
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
      title
      category
    }
  }
}
    `;const E=e`
    query GetGrindStampByCategory($category: StampCategory!) {
  grindStampByCategory(category: $category) {
    uid
    title
    category
  }
}
    `;e`
    query GetGrindLabelAll($first: Int!, $after: String, $text: String!, $sortBy: [String!] = ["uid"]) {
  grindLabelAll(
    pageSize: $first
    afterCursor: $after
    text: $text
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
      title
      category
    }
  }
}
    `;e`
    query DownloadGrindMediaFileUrl($uid: String!) {
  downloadGrindMediaFileUrl(uid: $uid) {
    uid
    mimetype
    filename
    downloadUrl
  }
}
    `;const U=e`
    query DownloadGrindMediaFile($uid: String!) {
  downloadGrindMediaFile(uid: $uid) {
    uid
    filename
    mimetype
    content
    size
  }
}
    `;export{s as A,y as D,o as E,B as G,D as a,u as b,m as c,g as d,S as e,E as f,p as g,i as h,f as i,U as j,c as k,N as l,d as m,n,l as o,r as p,a as q,$ as r,G as s};
