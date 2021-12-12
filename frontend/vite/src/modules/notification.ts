import { reactive, toRefs } from "vue"
import { urqlClient } from '../urql';
import {
  GET_NOTICES_BY_CREATOR
} from '../graphql/notice.queries';
import useNotifyToast from "./alert_toast";
import { INotification } from "../models/notification";

const { gqlResponseHandler } = useNotifyToast();

const _state = reactive({
    notifications: [] as INotification[],
    show: false,
})

export default function useNotificationComposable(){

    return {
        state: toRefs(_state), 
        showNotifications, _myNotifications, _viewNotification, setNotifications   
    }
}

const showNotifications = (val: boolean) => _state.show = val

const setNotifications = (notifications: INotification[]) =>  _state.notifications = notifications

const _myNotifications = (uid: number) => _state.notifications.filter(n => n.uid === uid)

const _viewNotification = (notification: INotification) => {
    const index = _state.notifications.findIndex(x => x.uid === notification.uid);
    if(index > -1) _state.notifications[index] = notification;
}