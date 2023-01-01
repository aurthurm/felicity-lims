import { defineStore } from 'pinia'
import { IGroup, IPermission, IUser } from '../models/auth'
import { IPagination } from '../models/pagination'
import { useApiUtil } from '../composables'

const { withClientQuery } = useApiUtil()

import {
  GET_GROUPS_AND_PERMISSIONS, GET_ALL_USERS
} from '../graphql/_queries';


interface IUserPage extends IPagination<IUser> {}

export const useUserStore = defineStore('user', {
  state: () => {
      return {
          users: {
            items: []
          }, 
          fetchingUsers: false,
          groups: [],
          fetchingGroups: false,
          permissions: [],
      } as {
        users: IUserPage;
        fetchingUsers: boolean;
        groups: IGroup[];
        fetchingGroups: boolean;
        permissions: IPermission[];
      }
  },
  getters: {
      getUsers: (state) => state.users.items,
      getGroups: (state) => state.groups,
      getPermissions: (state) => state.permissions,
  },
  actions: {
    async fetchUsers(params){
      this.fetchingUsers = true;
      await withClientQuery(GET_ALL_USERS, params, "userAll")
      .then((users: IUserPage) => {
        this.fetchingUsers = false;
        this.users = users
      }).catch((err) => this.fetchingUsers = false)
    },
    addUser(payload: IUser): void {
      this.users.items?.unshift(payload);
    },
    updateUser(payload: IUser): void {
      const index = this.users.items?.findIndex(user => user.uid === payload?.uid)
      if(index && index > -1) this.users.items![index] = payload
    },

    async fetchGroupsAndPermissions() {
      this.fetchingGroups = true;
      await withClientQuery(GET_GROUPS_AND_PERMISSIONS, {}, undefined)
      .then((resp: any) => {
        this.fetchingGroups = false;
        this.groups = resp.groupAll
        this.permissions = resp.permissionAll
      }).catch(err => this.fetchingGroups = false)
    },
    addGroup(payload: IGroup): void {
      this.groups?.unshift(payload);
    },
    updateGroup(payload: IGroup): void {
      const index = this.groups?.findIndex(group => group.uid === payload?.uid)
      if(index > -1) this.groups[index] = payload
    },
    updateGroupsAndPermissions(payload) {
      let group = payload?.group
      const index = this.groups?.findIndex(g => g.uid === group?.uid)
      if(index > -1){
        group.permissions = group?.permissions || []
        this.groups[index] = group
      }
    },
    getRoles(){
      const final = new Map();
      for (const role of this.groups) {
        final.set(role.name, role.name)
      }
      return final
    },
    addUserAuth(payload) {},
    updateUserAuth(payload) {}
  
  }
})
