import{g as t}from"./index-fa13e788.js";const o=t`
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
    `,r=t`
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
    `,n=t`
    mutation AddDocumentFolder($payload: DocumentFolderInputType!) {
  createDocumentFolder(payload: $payload) {
    ... on DocumentFolderType {
      uid
      name
      parentUid
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `,a=t`
    mutation AddDocument($payload: DocumentInputType!) {
  createDocument(payload: $payload) {
    ... on DocumentType {
      uid
      name
      documentId
      folderUid
      createdAt
      latestVersion {
        uid
        content
        editor
        thumbnail
      }
      createdBy {
        firstName
        lastName
      }
      updatedAt
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `,i=t`
    mutation EditDocumentVersion($uid: String!, $payload: DocumentVersionUpdateInputType!) {
  updateDocumentVersion(uid: $uid, payload: $payload) {
    ... on DocumentVersionType {
      uid
      thumbnail
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}
    `;export{n as A,i as E,d as G,o as a,a as b,r as c};
