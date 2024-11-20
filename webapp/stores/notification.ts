import { defineStore } from 'pinia';
import { INotification } from '@/models/notification';


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
