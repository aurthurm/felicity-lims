import { useQuery } from '@urql/vue';
import { urqlClient } from '../../urql';
import { RootState } from '../state';
import { ActionTree, GetterTree, MutationTree } from 'vuex';

import {
  GET_ALL_BOARDS,
  GET_BOARD_BY_UID,
  GET_LISTING_TASK_BY_UID
} from '../../graphql/kanban.queries';
import { IBoard, IListing, ITask, IMileStone, IComment } from '../../models/kanban'

// state contract
export interface IState {
  boards: IBoard[];
  board: IBoard | null;
  listingTask: ITask | null;
}

export const initialState = () => {
  return <IState>{
    boards: [],
    board: null,
    listingTask: null,
  };
};

export const state: IState = initialState();

export enum MutationTypes {
  RESET_STATE = 'RESET_STATE',

  RESET_BOARD = 'RESET_BOARD',
  SET_BOARDS = 'SET_BOARDS',
  SET_BOARD = 'SET_BOARD',
  ADD_BOARD = 'ADD_BOARD',
  DELETE_BOARD = 'DELETE_BOARD',

  ADD_BOARD_LISTING = 'ADD_BOARD_LISTING',
  DELETE_BOARD_LISTING = 'DELETE_BOARD_LISTING',

  ADD_LISTING_TASK = 'ADD_LISTING_TASK',
  MOVE_LISTING_TASK = 'MOVE_LISTING_TASK',
  UPDATE_LISTING_TASK = 'UPDATE_LISTING_TASK',
  DELETE_LISTING_TASK = 'DELETE_LISTING_TASK',
  DUPLICATE_LISTING_TASK = 'DUPLICATE_LISTING_TASK',
  RESET_LISTING_TASK = 'RESET_LISTING_TASK',
  FETCH_LISTING_TASK = 'FETCH_LISTING_TASK',
  SET_LISTING_TASK = 'SET_LISTING_TASK',

  ADD_TASK_COMMENT = 'ADD_TASK_COMMENT',

  ADD_TASK_MILESTONE = 'ADD_TASK_MILESTONE',
}

export enum ActionTypes {
  RESET_STATE = 'RESET_STATE',

  RESET_BOARD = 'RESET_BOARD',
  FETCH_BOARDS = 'FETCH_BOARDS',
  FETCH_BOARD_BY_UID = 'FETCH_BOARD_BY_UID',
  ADD_BOARD = 'ADD_BOARD',
  DELETE_BOARD = 'DELETE_BOARD',

  ADD_BOARD_LISTING = 'ADD_BOARD_LISTING',
  DELETE_BOARD_LISTING = 'DELETE_BOARD_LISTING',

  ADD_LISTING_TASK = 'ADD_LISTING_TASK',
  MOVE_LISTING_TASK = 'MOVE_LISTING_TASK',
  UPDATE_LISTING_TASK = 'UPDATE_LISTING_TASK',
  DELETE_LISTING_TASK = 'DELETE_LISTING_TASK',
  DUPLICATE_LISTING_TASK = 'DUPLICATE_LISTING_TASK',
  RESET_LISTING_TASK = 'RESET_LISTING_TASK',
  FETCH_LISTING_TASK_BY_UID = 'FETCH_LISTING_TASK_BY_UID',
  SET_LISTING_TASK = 'SET_LISTING_TASK',

  ADD_TASK_COMMENT = 'ADD_TASK_COMMENT',

  ADD_TASK_MILESTONE = 'ADD_TASK_MILESTONE',
  
}

// Getters
export const getters = <GetterTree<IState, RootState>>{
  getBoards: (state) => state.boards,
  getBoard: (state) => state.board,
  getListingTask: (state) => state.listingTask,
};

// Mutations
export const mutations = <MutationTree<IState>>{
  [MutationTypes.RESET_STATE](state: IState): void {
    Object.assign(state, initialState());
  },

  [MutationTypes.RESET_BOARD](state: IState): void {
    state.board = null;;
  },

  [MutationTypes.SET_BOARDS](state: IState, payload: any): void {
    state.boards = payload.items;
  },

  [MutationTypes.ADD_BOARD](state: IState, board: IBoard): void {
    state.boards.push(board)
  },

  [MutationTypes.SET_BOARD](state: IState, payload: IBoard): void {
    state.board = payload;
  },


  [MutationTypes.DELETE_BOARD](state: IState, boardUid: any): void {
    if(boardUid){
      const index = state!.boards?.findIndex(x => parseInt(x.uid!) === parseInt(boardUid!));
      if (index! > -1) {
        state!.boards!.splice(index!, 1);
      }
    }
    state.board = null;
  },

  // listing
  [MutationTypes.ADD_BOARD_LISTING](state: IState, payload: any): void {
    if(state.board!.boardListings) {
      state!.board!.boardListings.push(payload)
    }else{
      state!.board!.boardListings = [payload];
    }
  },

  [MutationTypes.DELETE_BOARD_LISTING](state: IState, listingUid: any): void {
    if(listingUid){
      const index = state!.board!.boardListings?.findIndex(x => parseInt(x.uid!) === parseInt(listingUid!));
      if (index! > -1) {
        state!.board!.boardListings!.splice(index!, 1);
      }
    }
  },

  // LISTING TASKS
  [MutationTypes.RESET_LISTING_TASK](state: IState): void {
    state.listingTask = null;
  },

  [MutationTypes.ADD_LISTING_TASK](state: IState, task: any): void {
    let board = state.board;
    state!.board!.boardListings?.forEach((listing: IListing) => {
      if (listing.uid?.toString() === task.listingUid?.toString()) {
        if(listing.listingTasks!.length > 0) {
          listing.listingTasks!.push(task)
        } else {
          listing.listingTasks = [task]
        }
      }
    })
  },

  [MutationTypes.SET_LISTING_TASK](state: IState, task: any): void {
    state.listingTask = task;
  },

  [MutationTypes.MOVE_LISTING_TASK](state: IState, task: any): void {

    state!.board!.boardListings!.forEach(listing => {
      // remove old task
      const index = listing?.listingTasks?.findIndex(x => parseInt(x.uid!) === parseInt(task.uid!));
      if (index! > -1) {
        listing!.listingTasks!.splice(index!, 1);
      }
      // add task in new position
      if(parseInt(listing?.uid!) === parseInt(task?.listingUid!)) {
        listing?.listingTasks?.push(task);
      }
    })
  },

  [MutationTypes.DELETE_LISTING_TASK](state: IState, taskUid: any): void {
    if(taskUid){
      state!.board!.boardListings!.forEach(listing => {
        const index = listing?.listingTasks?.findIndex(x => parseInt(x.uid!) === parseInt(taskUid!));
        if (index! > -1) {
          listing!.listingTasks!.splice(index!, 1);
        }
      })
    }
  },

  [MutationTypes.DUPLICATE_LISTING_TASK](state: IState, payload: any): void {
    let board = state.board;
    board!.boardListings?.forEach((listing: IListing) => {
      if (listing.uid?.toString() === payload.listingUid?.toString()) {
        listing.listingTasks!.push(payload)
      }
    })
    state.board = board;
  },

  [MutationTypes.UPDATE_LISTING_TASK](state: IState, task: any): void {
    state.listingTask = task;
  },

  //  TASKS COMMENTS
  [MutationTypes.ADD_TASK_COMMENT](state: IState, payload: IComment): void {
    state.listingTask?.comments?.push(payload)
  },

  //  TASKS MILESTONES
  [MutationTypes.ADD_TASK_MILESTONE](state: IState, payload: IMileStone): void {
    state.listingTask?.milestones?.push(payload)
  },

};

// Actions
export const actions = <ActionTree<IState, RootState>>{
  async [ActionTypes.RESET_STATE]({ commit }) {
    commit(MutationTypes.RESET_STATE);
  },
  
  async [ActionTypes.RESET_BOARD]({ commit }) {
    commit(MutationTypes.RESET_BOARD);
  },

  async [ActionTypes.FETCH_BOARDS]({ commit }, payload){
    await useQuery({ query: GET_ALL_BOARDS })
          .then(payload => commit(MutationTypes.SET_BOARDS, payload.data.value.boardAll));
  },
  
  async [ActionTypes.ADD_BOARD]({ commit }, payload){
    commit(MutationTypes.ADD_BOARD, payload.data.createBoard);
  },

  async [ActionTypes.FETCH_BOARD_BY_UID]({ commit }, uid){
    await urqlClient
    .query( GET_BOARD_BY_UID, { uid })
    .toPromise()
    .then(result => commit(MutationTypes.SET_BOARD, result.data.boardByUid))
  },
  
  async [ActionTypes.DELETE_BOARD]({ commit }, payload){
    commit(MutationTypes.DELETE_BOARD, payload.data.deleteBoard.boardUid);
  },
  
  // listings
  async [ActionTypes.ADD_BOARD_LISTING]({ commit }, payload){
    commit(MutationTypes.ADD_BOARD_LISTING, payload.data.createBoardListing);
  },
  
  async [ActionTypes.DELETE_BOARD_LISTING]({ commit }, payload){
    commit(MutationTypes.DELETE_BOARD_LISTING, payload.data.deleteBoardListing.uid);
  },
  
  
  // LISTING TASKS
  async [ActionTypes.RESET_LISTING_TASK]({ commit }) {
    commit(MutationTypes.RESET_LISTING_TASK);
  },
  
  async [ActionTypes.ADD_LISTING_TASK]({ commit }, payload){
    commit(MutationTypes.ADD_LISTING_TASK, payload.data.createListingTask);
  },

  async [ActionTypes.FETCH_LISTING_TASK_BY_UID]({ commit }, uid){
    await urqlClient
    .query( GET_LISTING_TASK_BY_UID, { uid })
    .toPromise()
    .then(result => commit(MutationTypes.SET_LISTING_TASK, result.data.listingTaskByUid))
  },
  
  async [ActionTypes.MOVE_LISTING_TASK]({ commit }, payload){
    commit(MutationTypes.MOVE_LISTING_TASK, payload.data.updateListingTask);
  },
  
  async [ActionTypes.DELETE_LISTING_TASK]({ commit }, payload){
    commit(MutationTypes.DELETE_LISTING_TASK, payload.data.deleteListingTask.uid);
  },
  
  async [ActionTypes.DUPLICATE_LISTING_TASK]({ commit }, payload){
    commit(MutationTypes.DUPLICATE_LISTING_TASK, payload.data.duplicateListingTask);
  },
  
  async [ActionTypes.UPDATE_LISTING_TASK]({ commit }, payload){
    commit(MutationTypes.UPDATE_LISTING_TASK, payload.data.updateListingTask);
  },

  //  TASKS COMMENTS
  async [ActionTypes.ADD_TASK_COMMENT]({ commit }, payload){
    commit(MutationTypes.ADD_TASK_COMMENT, payload.data.createTaskComment);
  },

  //  TASKS MILESTONES
  async [ActionTypes.ADD_TASK_MILESTONE]({ commit }, payload){
    commit(MutationTypes.ADD_TASK_MILESTONE, payload.data.createTaskMilestone);
  },

};

// namespaced: true,
export const kanban = {
  state,
  mutations,
  actions,
  getters,
};