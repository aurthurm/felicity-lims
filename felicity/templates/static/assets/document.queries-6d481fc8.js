import{g as t}from"./index-3686e2f1.js";const r=t`
    query GetDocumentFolderAll {
  documentFolderAll {
    items {
      uid
      name
      parentUid
    }
  }
}
    `,d=t`
    query GetDocumentAll($first: Int!, $after: String, $folderUid: String, $categoryUid: String, $tagUid: String, $status: String, $authorUid: String, $readerUid: String, $departmentUid: String, $text: String!, $sortBy: [String!] = ["uid"]) {
  documentAll(
    pageSize: $first
    afterCursor: $after
    folderUid: $folderUid
    categoryUid: $categoryUid
    tagUid: $tagUid
    status: $status
    authorUid: $authorUid
    readerUid: $readerUid
    departmentUid: $departmentUid
    text: $text
    sortBy: $sortBy
  ) {
    items {
      uid
      name
      documentId
      folderUid
      latestVersion {
        uid
        content
        editor
        thumbnail
      }
      createdAt
      createdBy {
        firstName
        lastName
      }
      updatedAt
    }
  }
}
    `,i=t`
    query GetDocumentVersionByBid($uid: String!) {
  documentVersionByUid(uid: $uid) {
    uid
    content
    editor
    versionNumber
    changeSummary
    thumbnail
    document {
      uid
      name
      documentId
      createdAt
      createdBy {
        firstName
        lastName
      }
      updatedAt
      updatedBy {
        firstName
        lastName
      }
    }
    createdAt
    createdBy {
      firstName
      lastName
    }
  }
}
    `;export{i as G,d as a,r as b};
