import { defineStore } from 'pinia';
import { random } from 'lodash-es';
import useApiUtil from '@/composables/api_util';
import { 
    GetDocumentAllDocument, 
    GetDocumentAllQuery, 
    GetDocumentAllQueryVariables,
    GetDocumentFolderAllDocument, 
    GetDocumentFolderAllQuery, 
    GetDocumentFolderAllQueryVariables 
} from '@/graphql/operations/document.queries';
import { DocumentType, DocumentFolderType, PageInfo } from '@/types/gql';

const { withClientQuery } = useApiUtil();

type DocumentStateType = {
    documents: DocumentType[];
    folders: DocumentFolderType[];
    currentFolder: string | null;
    selectedDocument: DocumentType | null;
    isPreviewOpen: boolean;
    recentDocuments: DocumentType[];
};

export const useDocumentStore = defineStore('documents', {
    state: (): DocumentStateType => ({
        documents: [],
        folders: [],
        currentFolder: null,
        selectedDocument: null,
        isPreviewOpen: false,
        recentDocuments: []
    }),
    
    actions: {
        async fetchDocuments(params: any, recent: boolean = false): Promise<void> {
            try {
                const result = await withClientQuery<GetDocumentAllQuery, GetDocumentAllQueryVariables>(
                    GetDocumentAllDocument, 
                    {
                        "first": 100,
                        "text": "",
                        "sortBy": ["-created_at"],
                        ...params
                    }, 
                    "documentAll"
                );
                
                if (result && typeof result === 'object' && 'items' in result) {
                    this.documents = result.items as DocumentType[];
                    
                    if (recent) {
                        this.recentDocuments = this.documents
                            .sort((a, b) => {
                                const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
                                const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
                                return dateB - dateA;
                            })
                            .slice(0, 25);
                    }
                } else {
                    console.error('Invalid documents data received:', result);
                }
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        },

        addDocument(document: DocumentType): void {
            if (!document?.uid) {
                console.error('Invalid document payload:', document);
                return;
            }
            
            this.documents.push(document);
            this.recentDocuments = [document, ...this.recentDocuments].slice(0, 5);
        },
        
        updateDocument(document: DocumentType): void {
            if (!document?.uid) {
                console.error('Invalid document payload:', document);
                return;
            }
            
            const updatedDoc = { 
                ...document, 
                updatedAt: new Date().toISOString() 
            };
            
            this.documents = this.documents.map(doc => 
                doc.uid === document.uid ? updatedDoc : doc
            );
            
            this.recentDocuments = [
                updatedDoc,
                ...this.recentDocuments.filter(doc => doc.uid !== document.uid)
            ].slice(0, 5);
        },
        
        deleteDocument(id: string): void {
            if (!id) {
                console.error('Invalid document ID provided to deleteDocument');
                return;
            }
            
            this.documents = this.documents.filter(doc => doc.uid !== id);
            this.recentDocuments = this.recentDocuments.filter(doc => doc.uid !== id);
        },
        
        duplicateDocument(id: string): void {
            if (!id) {
                console.error('Invalid document ID provided to duplicateDocument');
                return;
            }
            
            const docToDuplicate = this.documents.find(doc => doc.uid === id);
            if (!docToDuplicate) {
                console.error('Document not found:', id);
                return;
            }
            
            const newDoc: DocumentType = {
                ...docToDuplicate,
                uid: random(1000, 9999).toString(),
                name: `${docToDuplicate.name} (Copy)`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            this.documents.push(newDoc);
            this.recentDocuments = [newDoc, ...this.recentDocuments].slice(0, 5);
        },
        
        async setCurrentFolder(id: string | null): Promise<void> {
            this.currentFolder = id;
            await this.fetchDocuments({ folderUid: id });
        },

        async getFolders(): Promise<void> {
            try {
                const result = await withClientQuery<GetDocumentFolderAllQuery, GetDocumentFolderAllQueryVariables>(
                    GetDocumentFolderAllDocument, 
                    {}, 
                    "documentFolderAll"
                );
                
                if (result && typeof result === 'object' && 'items' in result) {
                    this.folders = result.items as DocumentFolderType[];
                } else {
                    console.error('Invalid folders data received:', result);
                }
            } catch (error) {
                console.error('Error fetching folders:', error);
            }
        },
        
        addFolder(folder: DocumentFolderType): void {
            if (!folder?.uid) {
                console.error('Invalid folder payload:', folder);
                return;
            }
            
            this.folders.push(folder);
        },
        
        deleteFolder(id: string): void {
            if (!id) {
                console.error('Invalid folder ID provided to deleteFolder');
                return;
            }
            
            this.folders = this.folders.filter(folder => folder.uid !== id);
            this.documents = this.documents.filter(doc => doc.folderUid !== id);
        },
        
        updateFolder(folder: DocumentFolderType): void {
            if (!folder?.uid) {
                console.error('Invalid folder payload:', folder);
                return;
            }
            
            this.folders = this.folders.map(f => 
                f.uid === folder.uid ? folder : f
            );
        },
        
        setSelectedDocument(document: DocumentType | null): void {
            this.selectedDocument = document;
        },
        
        togglePreview(isOpen: boolean): void {
            this.isPreviewOpen = isOpen;
        },
        
        toggleFolderExpanded(id: string): void {
            if (!id) {
                console.error('Invalid folder ID provided to toggleFolderExpanded');
                return;
            }
            
            this.folders = this.folders.map(folder => {
                if (folder.uid === id) {
                    // Create a new folder object with the expanded property
                    return { 
                        ...folder, 
                        expanded: !(folder as any).expanded 
                    };
                }
                return folder;
            });
        }
    },
    
    getters: {
        getChildFolders: (state) => (parentUid: string | null): DocumentFolderType[] => {
            return state.folders.filter(folder => folder.parentUid === parentUid);
        },
        
        getDocumentsInFolder: (state) => (folderUid: string): DocumentType[] => {
            return state.documents.filter(doc => doc.folderUid === folderUid);
        }
    }
});

// Helper functions
export function createDocument(name: string, folderUid: string, type: 'pdf' | 'doc' | 'txt' = 'doc'): DocumentType {
    // Create a base document with required properties
    const baseDoc: Partial<DocumentType> = {
        uid: random(1000, 9999).toString(),
        name,
        folderUid,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        documentId: random(1000, 9999).toString()
    };
    
    // Add custom properties with type assertion
    return {
        ...baseDoc,
        // @ts-ignore - Custom properties not in the GraphQL schema
        previewUrl: `https://via.placeholder.com/400x500?text=${encodeURIComponent(name)}`,
        // @ts-ignore - Custom properties not in the GraphQL schema
        path: `/sample/${name.toLowerCase().replace(/\s+/g, '-')}.pdf`
    } as DocumentType;
}
