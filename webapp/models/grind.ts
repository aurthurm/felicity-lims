import { addListsUnique } from '@/utils';
import { IUser } from "./auth";

  export interface IGrindScheme {
    uid?: string;
    title: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    assignee?: IUser;
    assigneeUid?: string;
    members?: IUser[] | string[];
    createdBy?: IUser;
    createdByUid?: string;
    createdAt?: string;
    updatedAt?: string;
    updatedBy?: IUser;
    updatedByUid?: string;
    boards?: IGrindBoard[];
  }
  
  export interface IGrindBoard {
    uid: string;
    title: string;
    description?: string;
    schemeUid: string;
  }
  
export interface IGrindPoster {
    uid: string;
    title: string;
    description: string;
    boardUid: string;
    category: string;
    errands: IGrindErrand[];
}

export interface IGrindErrand {
  uid: string;
  title: string;
  category: string;
  description: string;
  milestonesAt: number;
  labelUid: string;
  priority: string;
  posterUid: string;
  poster: IGrindPoster;
  reporterUid: string;
  reporter: IUser;
  assigneeUid: string;
  assignee: IUser;
  startDate: string;
  endDate: string;
  progress: number;
  members: IUser[] | string[];
  stamps: IGrindStamp[]| string[];
  milestones: IGrindMilestone[]| string[]
  createdAt: string;
  createdBy: IUser;
}

export interface IGrindStamp {
  uid: string;
  title: string;
}

export interface IGrindMilestone {
  uid: string;
  title: string;
  errandUid: string;
  description: string;
  complete: boolean;
  assigneeUid: string;
  assignee: IUser;
}

export interface IGrindErrandDiscussion {
  uid: string;
  comment: string;
  errandUid: string;
  errand: IGrindErrand;
  parentUid?: string;
  parent?: IGrindErrandDiscussion;
  subdiscussions?: IGrindErrandDiscussion[];
  canEdit: boolean;
}

export interface IGrindMedia {
  uid: string;
  target: string;
  targetUid: string;
  path: string;
  mimetype: string;
  destination: string;
  filename: string;
  size: string;
}