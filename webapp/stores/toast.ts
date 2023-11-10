import { defineStore } from 'pinia';
import { INotification, IAlert } from '../models/notification';

export const useToastStore = defineStore('toast', {
    state: () => {
        return {
            alert: {} as IAlert,
            notification: {} as INotification,
        };
    },
    getters: {
        getCurrentToast: state => state,
    },
    actions: {
        // ALERTS
        alertSuccess(message: string): void {
            this.alert.message = message;
            this.alert.icon = 'success';
            this.alert.ticks = new Date().getTime();
        },

        alertError(message: string): void {
            this.alert.message = message;
            this.alert.icon = 'error';
            this.alert.ticks = new Date().getTime();
        },

        alertWaring(message: string): void {
            this.alert.message = message;
            this.alert.icon = 'warning';
            this.alert.ticks = new Date().getTime();
        },

        alertInfo(message: string): void {
            this.alert.message = message;
            this.alert.icon = 'info';
            this.alert.ticks = new Date().getTime();
        },

        alertQuestion(message: string): void {
            this.alert.message = message;
            this.alert.icon = 'question';
            this.alert.ticks = new Date().getTime();
        },

        //NOTOFICATIONS
        notiySuccess(payload: any): void {
            this.notification.data = payload;
            this.notification.icon = 'success';
            this.notification.ticks = new Date().getTime();
        },

        notifyError(payload: any): void {
            this.notification.data = payload;
            this.notification.icon = 'error';
            this.notification.ticks = new Date().getTime();
        },

        notifyWaring(payload: any): void {
            this.notification.data = payload;
            this.notification.icon = 'warning';
            this.notification.ticks = new Date().getTime();
        },

        notifyInfo(payload: any): void {
            this.notification.data = payload;
            this.notification.icon = 'info';
            this.notification.ticks = new Date().getTime();
        },
    },
});
