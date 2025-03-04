export interface IDocument {
    uid: string;
    name: string;
    folderUid: string;
    folder?: IDocumentFolder
    content?: any;
    createdAt: Date;
    updatedAt: Date;
    previewUrl?: string; // URL to previewUrl image
    path?: string; // URL to document file
}

export interface IDocumentFolder {
    uid: string;
    name: string;
    parentUid: string | null;
    expanded?: boolean;
}