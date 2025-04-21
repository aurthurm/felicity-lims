import { defineStore } from 'pinia';

import useApiUtil from '@/composables/api_util';
import useNotifyToast from '@/composables/alert_toast';
import { GroupsAndPermissionsDocument, GroupsAndPermissionsQuery, GroupsAndPermissionsQueryVariables, UserAllDocument, UserAllQuery, UserAllQueryVariables } from '@/graphql/operations/_queries';
import { GroupType, PageInfo, PermissionType, UserCursorPage, UserType } from '@/types/gql';

const { withClientQuery } = useApiUtil();
const { toastError } = useNotifyToast();

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            users: [],
            usersPageInfo: undefined,
            usersTotalCount: 0,
            fetchingUsers: false,
            groups: [],
            fetchingGroups: false,
            permissions: [],
        } as {
            users: UserType[];
            usersPageInfo?: PageInfo;
            usersTotalCount?: number;
            fetchingUsers: boolean;
            groups: GroupType[];
            fetchingGroups: boolean;
            permissions: PermissionType[];
        };
    },
    getters: {
        getUsers: state => state.users,
        getSamplePageInfo: state => state.usersPageInfo,
        getGroups: state => state.groups,
        getPermissions: state => state.permissions,
    },
    actions: {
        async fetchUsers(params) {
            try {
                this.fetchingUsers = true;
                const resp = await withClientQuery<UserAllQuery, UserAllQueryVariables>(
                    UserAllDocument, 
                    params, 
                    'userAll'
                );
                
                const cursor = resp as UserCursorPage;
                this.users = cursor.items?.filter(user => user.email != 'system_daemon@system.daemon') ?? [];
                this.usersTotalCount = cursor.totalCount;
                this.usersPageInfo = cursor.pageInfo;
            } catch (error) {
                if (error instanceof Error) {
                    toastError(error.message);
                }
                this.users = [];
            } finally {
                this.fetchingUsers = false;
            }
        },
        
        addUser(payload: UserType): void {
            this.users?.unshift(payload);
        },
        
        updateUser(payload: UserType): void {
            const index = this.users?.findIndex(user => user.uid === payload?.uid);
            if (index && index > -1) this.users[index] = payload;
        },

        async fetchGroupsAndPermissions() {
            try {
                this.fetchingGroups = true;
                const resp = await withClientQuery<GroupsAndPermissionsQuery, GroupsAndPermissionsQueryVariables>(
                    GroupsAndPermissionsDocument, 
                    {}, 
                    undefined
                );
                
                if (resp && typeof resp === 'object') {
                    const typedResp = resp as any;
                    this.groups = typedResp.groupAll || [];
                    this.permissions = typedResp.permissionAll || [];
                } else {
                    this.groups = [];
                    this.permissions = [];
                    console.error('Unexpected response format:', resp);
                }
            } catch (error) {
                if (error instanceof Error) {
                    toastError(error.message);
                }
                this.groups = [];
                this.permissions = [];
            } finally {
                this.fetchingGroups = false;
            }
        },
        
        addGroup(payload: GroupType): void {
            this.groups?.unshift(payload);
        },
        
        updateGroup(payload: GroupType): void {
            const index = this.groups?.findIndex(group => group.uid === payload?.uid);
            if (index > -1) this.groups[index] = payload;
        },
        
        updateGroupsAndPermissions(payload) {
            let group = payload?.group;
            const index = this.groups?.findIndex(g => g.uid === group?.uid);
            if (index > -1) {
                group.permissions = group?.permissions || [];
                this.groups[index] = group;
            }
        },
        
        getRoles() {
            const final = new Map();
            for (const role of this.groups) {
                final.set(role.name, role.name);
            }
            return final;
        },
        
        addUserAuth(payload) {},
        
        updateUserAuth(payload) {},
    },
});
