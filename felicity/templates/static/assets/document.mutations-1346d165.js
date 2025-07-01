import{g as o}from"./index-0a787601.js";const t=o`
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
    `,n=o`
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
    `,a=o`
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
    `;export{t as A,a as E,n as a};
