export interface IComment {
    uid: number;
    comment: string;
    dateCommented: string;
    commentBy: string;
  }
  
  export interface IMileStone {
    uid: number;
    title: string;
    done: boolean;
    assignee: string;
    assigneeUid: number | undefined;
  }
  

  export interface ITask {
    uid: number;
    title: string;
    description: string;
    listingUid: number;
    milestones: IMileStone[];
    comments: IComment[];
    status: string;
    assignee: string;
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
