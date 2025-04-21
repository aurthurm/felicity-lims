import { defineStore } from 'pinia';
import { INotificationType } from '@/types/notification';

type NotificationStateType = {
    notifications: INotificationType[];
    show: boolean;
};

export const useNotificationStore = defineStore('notification', {
    state: (): NotificationStateType => ({
        notifications: [],
        show: false,
    }),
    getters: {
        getNotifications: (state): INotificationType[] => state.notifications,
        getShow: (state): boolean => state.show,
    },
    actions: {
        showNotifications(val: boolean): void {
            this.show = val;
        },
        
        addNotification(notification: INotificationType): void {
            if (!notification) {
                console.error('Invalid notification payload');
                return;
            }
            
            this.notifications.push(notification);
            this.show = true;
        },
        
        removeNotification(uid: string): void {
            if (!uid) {
                console.error('Invalid notification uid');
                return;
            }
            
            const index = this.notifications.findIndex(notification => notification.uid === uid);
            if (index > -1) {
                this.notifications.splice(index, 1);
                
                // Hide notification panel if no notifications left
                if (this.notifications.length === 0) {
                    this.show = false;
                }
            }
        },
        
        clearNotifications(): void {
            this.notifications = [];
            this.show = false;
        },
    },
});
