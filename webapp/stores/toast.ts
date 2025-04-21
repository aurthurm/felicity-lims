import { defineStore } from 'pinia';
import { INotificationType, AlertType } from '@/types/notification';

type ToastStateType = {
    alert: AlertType;
    notification: INotificationType;
}

type ToastIcon = 'success' | 'error' | 'warning' | 'info' | 'question';

export const useToastStore = defineStore('toast', {
    state: (): ToastStateType => ({
        alert: {
            message: '',
            icon: 'info',
            ticks: 0,
            type: 'alert',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            data: null
        },
        notification: {
            data: null,
            icon: 'info',
            ticks: 0,
            message: '',
            uid: '',
            type: 'notification',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        }
    }),
    getters: {
        getCurrentToast: (state): ToastStateType => state,
    },
    actions: {
        // ALERTS
        alertSuccess(message: string): void {
            this.updateAlert(message, 'success');
        },

        alertError(message: string): void {
            this.updateAlert(message, 'error');
        },

        alertWarning(message: string): void {
            this.updateAlert(message, 'warning');
        },

        alertInfo(message: string): void {
            this.updateAlert(message, 'info');
        },

        alertQuestion(message: string): void {
            this.updateAlert(message, 'question');
        },

        // NOTIFICATIONS
        notifySuccess(payload: unknown): void {
            this.updateNotification(payload, 'success');
        },

        notifyError(payload: unknown): void {
            this.updateNotification(payload, 'error');
        },

        notifyWarning(payload: unknown): void {
            this.updateNotification(payload, 'warning');
        },

        notifyInfo(payload: unknown): void {
            this.updateNotification(payload, 'info');
        },

        // Helper methods
        updateAlert(message: string, icon: ToastIcon): void {
            this.alert = {
                ...this.alert,
                message,
                icon,
                ticks: Date.now()
            };
        },

        updateNotification(data: unknown, icon: ToastIcon): void {
            this.notification = {
                ...this.notification,
                data,
                icon,
                ticks: Date.now()
            };
        }
    },
});
