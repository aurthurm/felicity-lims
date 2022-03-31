import { defineStore } from 'pinia'
import { IGroup, IPermission, IUser } from '../models/auth'
import { IPagination } from '../models/pagination'
import useApiUtil from '../modules/api_util'

const { withUseQuery } = useApiUtil()

import {
  GET_GROUPS_AND_PERMISSIONS, GET_ALL_USERS
} from '../graphql/_queries';


interface IUserPage extends IPagination {
  items: IUser[],
}

export const useUserStore = defineStore('users', {
  state: () => {
      return {
          users: {
            items: [],
          } as IUserPage, 
          groups: [],
          permissions: []
      } as {
        users: IUserPage,
        groups: IGroup[],
        permissions: IPermission[],
      }
  },
  getters: {
      getUsers: (state) => state.users.items,
      getGroups: (state) => state.groups,
      getPermissions: (state) => state.permissions,
  },
  actions: {
    async fetchUsers(params){
      await withUseQuery(GET_ALL_USERS, params, "userAll")
      .then((users: IUserPage) => {
          this.users = users
        })
    },
    addUser(payload: IUser): void {
      this.users.items.unshift(payload);
    },
    updateUser(payload: IUser): void {
      const index = this.users.items.findIndex(user => user.uid === payload?.uid)
      if(index > -1) this.users.items[index] = payload
    },

    async fetchGroupsAndPermissions() {
      await withUseQuery(GET_GROUPS_AND_PERMISSIONS, {}, undefined)
      .then((resp: any) => {
        this.groups = resp.groupAll
        this.permissions = resp.permissionAll
      })
    },
    addGroup(payload: IGroup): void {
      this.groups.unshift(payload);
    },
    updateGroup(payload: IGroup): void {
      const index = this.groups?.findIndex(group => group.uid === payload?.uid)
      if(index > -1) this.groups[index] = payload
    },
    updateGroupsAndPermissions(payload) {
      const data = payload.data.updateGroupsAndPermissions
      let group = data?.group
      const index = this.groups?.findIndex(g => g.uid === group?.uid)
      if(index > -1){
        group.permissions = group?.permissions || []
        this.groups[index] = group
      }
    },
  
  }
})
