import { IDepartment } from './setup'

export interface IDocument {
    uid: number;
    name: string;  
    subtitle: string;
    content: string;
    version: string;
    status: string;
    departmentUid?: number;
    department?: IDepartment;
  }