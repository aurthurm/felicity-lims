import { IUser } from './auth'
export interface IComment {
    uid: number;
    comment: string;
    dateCommented: string;
    commentBy: string;
    updatedAt: string;
    updatedBy: IUser;
  }
  
  export interface IMileStone {
    uid: number;
    title: string;
    done: boolean;
    assignee: IUser;
    assigneeUid: number | undefined;
  }
  

  export interface ITask {
    uid: number;
    assigneeUid: number,
    title: string;
    description: string;
    listingUid: number;
    taskMilestones: IMileStone[];
    taskComments: IComment[];
    status: string;
    assignee: IUser;
    dueDate: string,
    members: any[];
    tags: string[];
    complete: boolean;
  }

   export interface IListing {
      uid: number;
      title: string;
      description: string;
      listingTasks: ITask[];
    }
    
  
  export interface IBoard {
    uid: number;
    title: string;
    description: string;
    departmentUid: string;
    department: any;
    boardListings: IListing[];
  }
