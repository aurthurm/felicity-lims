import { defineStore } from 'pinia'

import { GET_ALL_DOCUMENTS, GET_DOCUMENT_BY_UID } from '../graphql/markdown.queries';
import { IDocument } from '../models/document';

import { useApiUtil } from '../composables';

const{ withClientQuery } = useApiUtil()


export const useDocumentStore = defineStore('document', { 
  state: () => {
    return {
      documents: [],
      document: undefined,
    } as {
      documents: IDocument[];
      document?: IDocument;
    }
  },
  getters: {
    getDocuments: (state) => state.documents,
    getDocument: (state) => state.document,
  },
  actions: {
    async fetchDocuments(){
      await withClientQuery(GET_ALL_DOCUMENTS, {}, "documentAll")
            .then(payload => this.documents = payload)
    },
    addDocument(payload) {
      this.documents.unshift(payload)
    },
    updateDocument(payload){
      this.document =  { ...this.document, ...payload }
    },
    updateDocumentContent(content){
      this.document!.content = content
    },
    async fetchDocumentByUid(uid){
      await withClientQuery(GET_DOCUMENT_BY_UID, { uid }, "documentByUid")
      .then(payload => this.document = payload)
    },
  }
})
