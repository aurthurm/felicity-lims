
import useApiUtil from '@/composables/api_util';
import { GetDocumentFolderAllDocument, GetDocumentFolderAllQuery, GetDocumentFolderAllQueryVariables } from '@/graphql/operations/document.queries';
import { IDocument, IDocumentFolder } from '@/models/document';
import { random } from 'lodash-es';
import { defineStore } from 'pinia'

const { withClientQuery } = useApiUtil();


export const useDocumentStore = defineStore('documents', {
  state: () => ({
    documents: [] as IDocument[],
    folders: [] as IDocumentFolder[],
    currentFolder: null as string | null,
    selectedDocument: null as IDocument | null,
    isPreviewOpen: false,
    recentDocuments: ([] as IDocument[])
      .sort((a, b) => b.updatedAt?.getTime() - a.updatedAt?.getTime())
      .slice(0, 5)
  }),
  
  actions: {
    addDocument(document: IDocument) {
      this.documents.push(document)
      this.recentDocuments = [document, ...this.recentDocuments].slice(0, 5)
    },
    
    updateDocument(document: IDocument) {
      const updatedDoc = { ...document, updatedAt: new Date() }
      
      this.documents = this.documents.map(doc => 
        doc.uid === document.uid ? updatedDoc : doc
      )
      
      this.recentDocuments = [
        updatedDoc,
        ...this.recentDocuments.filter(doc => doc.uid !== document.uid)
      ].slice(0, 5)
    },
    
    deleteDocument(id: string) {
      this.documents = this.documents.filter(doc => doc.uid !== id)
      this.recentDocuments = this.recentDocuments.filter(doc => doc.uid !== id)
    },
    
    duplicateDocument(id: string) {
      const docToDuplicate = this.documents.find(doc => doc.uid === id)
      if (!docToDuplicate) return
      
      const newDoc: IDocument = {
        ...docToDuplicate,
        uid: random(1000, 9999).toString(),
        name: `${docToDuplicate.name} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      this.documents.push(newDoc)
      this.recentDocuments = [newDoc, ...this.recentDocuments].slice(0, 5)
    },
    
    setCurrentFolder(id: string | null) {
      this.currentFolder = id
    },

    getFolders() {
      withClientQuery<GetDocumentFolderAllQuery, GetDocumentFolderAllQueryVariables>(
        GetDocumentFolderAllDocument, {}, "documentFolderAll"
      ).then((payload) => {
        this.folders = payload?.items as IDocumentFolder[]
      })
    },
    
    addFolder(folder: IDocumentFolder) {
      this.folders.push(folder)
    },
    
    deleteFolder(id: string) {
      this.folders = this.folders.filter(folder => folder.uid !== id)
      this.documents = this.documents.filter(doc => doc.folderUid !== id)
    },
    
    updateFolder(folder: IDocumentFolder) {
      this.folders = this.folders.map(f => 
        f.uid === folder.uid ? folder : f
      )
    },
    
    setSelectedDocument(document: IDocument | null) {
      this.selectedDocument = document
    },
    
    togglePreview(isOpen: boolean) {
      this.isPreviewOpen = isOpen
    },
    
    toggleFolderExpanded(id: string) {
      this.folders = this.folders.map(folder => 
        folder.uid === id ? { ...folder, expanded: !folder.expanded } : folder
      )
    }
  },
  
  getters: {
    getChildFolders: (state) => (parentUid: string | null) => {
      return state.folders?.filter(folder => folder.parentUid === parentUid)
    },
    
    getDocumentsInFolder: (state) => (folderUid: string) => {
      return state.documents.filter(doc => doc.folderUid === folderUid)
    }
  }
})

// Helper functions
export function createDocument(name: string, folderUid: string, type: 'pdf' | 'doc' | 'txt' = 'doc'): IDocument {
  return {
    uid: random(1000, 9999).toString(),
    name,
    folderUid,
    updatedAt: new Date(),
    createdAt: new Date(),
    previewUrl: `https://via.placeholder.com/400x500?text=${encodeURIComponent(name)}`,
    path: `/sample/${name.toLowerCase().replace(/\s+/g, '-')}.pdf`
  }
}
