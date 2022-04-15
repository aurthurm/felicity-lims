import { defineStore } from 'pinia'

import { GET_ALL_DOCUMENTS, GET_DOCUMENT_BY_UID } from '../graphql/markdown.queries';
import { IDocument } from '../models/document';

import { useApiUtil } from '../composables';

const{ withClientQuery } = useApiUtil()


export const useDocumentStore = defineStore('document', { 
  state: () => {
    return {
      documents: [],
      fetchingDocuments: false,
      document: undefined,
      fetchingDocument: false
    } as {
      documents: IDocument[];
      fetchingDocuments: boolean;
      document?: IDocument;
      fetchingDocument: boolean;
    }
  },
  getters: {
    getDocuments: (state) => state.documents,
    getDocument: (state) => state.document,
  },
  actions: {
    async fetchDocuments(){
      this.fetchingDocuments = true
      await withClientQuery(GET_ALL_DOCUMENTS, {}, "documentAll")
            .then(payload => {
              this.fetchingDocuments = false
              this.documents = payload
            }).catch(err => this.fetchingDocuments = false)
    },
    addDocument(payload) {
      this.documents?.unshift(payload)
    },
    updateDocument(payload){
      this.document =  { ...this.document, ...payload }
    },
    updateDocumentContent(content){
      this.document!.content = content
    },
    async fetchDocumentByUid(uid){
      if(!uid){ return }
      this.fetchingDocument = true
      await withClientQuery(GET_DOCUMENT_BY_UID, { uid }, "documentByUid")
      .then(payload => {
        this.fetchingDocument = false
        this.document = payload
      }).catch(err => this.fetchingDocument = false)
    },
  }
})
