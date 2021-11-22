export interface IComment {
    uid?: string;
    comment?: string;
    dateCommented?: string;
    commentBy?: string;
  }
  
  export interface IMileStone {
    uid?: string;
    title?: string;
    done?: boolean;
    assignee?: string;
    assigneeUid?: number;
  }
  

  export interface ITask {
    uid?: string;
    title?: string;
    description?: string;
    listingUid?: string;
    milestones?: IMileStone[];
    comments?: IComment[];
    status?: string;
    assignee?: string;
    dueDate?: string,
    members?: any[];
    tags?: string[];
    complete?: boolean;
  }

   export interface IListing {
      uid?: string;
      title?: string;
      description?: string;
      listingTasks?: ITask[];
    }
    
  
  export interface IBoard {
    uid?: string;
    title?: string;
    description?: string;
    departmentUid?: string;
    department?: any;
    boardListings?: IListing[];
  }
