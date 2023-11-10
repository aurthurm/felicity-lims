import { defineStore } from 'pinia';
import { reactive, toRefs } from 'vue';
import { GET_NOTICES_BY_CREATOR } from '../graphql/operations/notice.queries';
import { INotification } from '../models/notification';

import useApiUtil from '../composables/api_util';
const { withClientQuery } = useApiUtil();

export const useNotificationStore = defineStore('notification', {
    state: () =>
        ({
            notifications: [],
            show: false,
        } as {
            notifications: INotification[];
            show: boolean;
        }),
    getters: {
        getNotifications: state => state.notifications,
        getShow: state => state.show,
    },
    actions: {
        showNotifications(val: boolean) {
            this.show = val;
        },
    },
});
