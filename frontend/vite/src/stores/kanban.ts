import { defineStore } from 'pinia'
import {
  GET_ALL_BOARDS,
  GET_BOARD_BY_UID,
  GET_LISTING_TASK_BY_UID
} from '../graphql/kanban.queries';
import { IBoard, IListing, ITask, IMileStone, IComment } from '../models/kanban'

import { useApiUtil } from '../composables'

const { withClientQuery } = useApiUtil()

export const useKanbanStore = defineStore('kanban', { 
  state: () => {
    return {
      boards: [],
      board: undefined,
      listingTask: undefined,
    } as {
      boards: IBoard[];
      board?: IBoard;
      listingTask?: ITask;
    }
  },
  getters: {
    getBoards: (state) => state.boards,
    getBoard: (state) => state.board,
    getListingTask: (state) => state.listingTask,
  },
  actions: {
    async resetBoard() {
      this.board = undefined;
    },
    async fetchBoards(){
      await withClientQuery(GET_ALL_BOARDS, {}, "boardAll")
            .then(payload => this.boards = payload.items);
    },
    addBoard(payload){
      this.boards?.unshift(payload)
    },
    updateBoard(payload){
      this.board = payload;
      const index = this.boards?.findIndex(item => item.uid === payload.uid);
      if (index > -1) {
        this.boards[index] = payload;
      }
    },
    async fetchBoardByUid(uid){
      await withClientQuery(GET_BOARD_BY_UID, { uid }, "boardByUid")
      .then(payload => this.board = payload)
    },
    deleteBoard(uid){
      const index = this.boards?.findIndex(item => item.uid === uid);
      if (index > -1) {
        this.boards!.splice(index, 1);
      }
      this.board = undefined;
    },
    
    // listings
    addBoardListing(payload){
      if(this.board?.boardListings) {
        this.board.boardListings.push(payload)
      }else{
        this.board!.boardListings = [payload];
      }
    }, 
    deleteBoardListing(uid){
      const index = this.board?.boardListings?.findIndex(x => x.uid === uid)!;
      if (index > -1) {
        this.board?.boardListings?.splice(index, 1);
      }    
    },
    
    // LISTING TASKS
    resetListingTask() {
      this.listingTask = undefined;
    },
    addListingTask(payload){
      let board = this.board;
      this.board?.boardListings?.forEach((listing: IListing) => {
        if (listing.uid === payload?.listingUid) {
          if(listing.listingTasks?.length > 0) {
            listing.listingTasks!.push(payload)
          } else {
            listing.listingTasks = [payload]
          }
        }
      })
    },
    async fetchListingTaskByUid(uid){
      await withClientQuery(GET_LISTING_TASK_BY_UID, { uid }, "listingTaskByUid")
      .then(payload => this.listingTask = payload)
    },
    moveListingTask(payload){
      this.board?.boardListings?.forEach(listing => {
        // remove old payload
        const index = listing?.listingTasks?.findIndex(x => x.uid === payload.uid);
        if (index > -1) {
          listing.listingTasks?.splice(index, 1);
        }
        // add payload in new position
        if(listing?.uid === payload?.listingUid) {
          listing?.listingTasks?.push(payload);
        }
      })    
    },
    deleteListingTask(uid){
      this.board?.boardListings!.forEach(listing => {
        const index = listing?.listingTasks?.findIndex(x => x.uid === uid);
        if (index > -1) {
          listing.listingTasks?.splice(index, 1);
        }
      })    
    },
    duplicateListingTask(payload){
      this.board?.boardListings?.forEach((listing: IListing) => {
        if (listing.uid === payload.listingUid) {
          listing.listingTasks?.push(payload)
        }
      })
    },
    updateListingTask(payload){
      this.listingTask = payload
    },
  
    //  TASKS COMMENTS
    addTaskComment(payload: IComment){
      this.listingTask?.taskComments?.push(payload)
    },
  
    //  TASKS MILESTONES
    addTaskMilestone(payload: IMileStone){
      this.listingTask?.taskMilestones?.push(payload)    
    },
  }

})