import { UserType } from "@/graphql/schema";
import { IUser } from "./auth";

export interface IDocument {
    uid: string;
    name: string;
    folderUid: string;
    folder?: IDocumentFolder
    content?: any;
    editor: string;
    createdAt: Date;
    updatedAt: Date;
    previewUrl?: string; // URL to previewUrl image
    path?: string; // URL to document file
    latestVersion?: IDocumentVersion
}

export interface IDocumentFolder {
    uid: string;
    name: string;
    parentUid: string | null;
    expanded?: boolean;
}

export interface IDocumentVersion {
    uid: string;
    documentUid: string;
    document?: IDocument,
    versionNumber: string;
    content: string;
    editor: string;
    thumbnail?: string;
    changeSummary: string;
    createdAt: string;
    createdByUid: string;
    createdBy: IUser;
    updatedAt: string;
    updatedByUid: string;
    updatedBy: IUser;
}