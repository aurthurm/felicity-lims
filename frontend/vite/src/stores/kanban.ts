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
      fetchingBoards: false,
      board: undefined,
      fetchingBoard: false,
      listingTask: undefined,
      fetchingListingTask: false,
    } as {
      boards: IBoard[];
      fetchingBoards: boolean;
      board?: IBoard;
      fetchingBoard: boolean;
      listingTask?: ITask;
      fetchingListingTask?: boolean;
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
      this.fetchingBoards = true;
      await withClientQuery(GET_ALL_BOARDS, {}, "boardAll")
            .then(payload => {
              this.fetchingBoards = false
              this.boards = payload.items
            }).catch(err => this.fetchingBoards = false);
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
      if(!uid){ return }
      this.fetchingBoard = true;
      await withClientQuery(GET_BOARD_BY_UID, { uid }, "boardByUid")
      .then(payload => {
        this.fetchingBoard = false
        this.board = payload
      }).catch(err => this.fetchingBoard = false)
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
      if(!uid){ return }
      this.fetchingListingTask = true
      await withClientQuery(GET_LISTING_TASK_BY_UID, { uid }, "listingTaskByUid")
      .then(payload => {
        this.fetchingListingTask = false
        this.listingTask = payload
      }).catch(err => this.fetchingListingTask = false)
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
      if(!uid){ return }
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