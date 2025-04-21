import { NotificationType } from "./gql";

type BaseINotificationType = {
    data: any;
    ticks: number;
    type: string;
    message: string;
    icon: string;
    toast: boolean;
    position: string;
    showConfirmButton: boolean;
    timer: number;
    timerProgressBar: boolean;
}

export type AlertType = BaseINotificationType & {}
export type ToastType = BaseINotificationType & {}

export type INotificationType = NotificationType & BaseINotificationType & {
    uid: string;
    message: string;
}