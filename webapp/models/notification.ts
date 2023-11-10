interface BaseNotification {
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

export interface IAlert extends BaseNotification {}
export interface IToast extends BaseNotification {}

export interface INotification extends BaseNotification {
    uid: string;
    message: string;
}
