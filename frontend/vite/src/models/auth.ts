export interface IUser {
    uid: number;
    userUid: number;
    firstName: string;
    lastName: string;
    email: string;
    mobilePhone: string;
    businessPhone: string;
    groupUid: number;
    group: IGroup;
    groups: IGroup[];
    isActive: boolean;
    isSuperuser: boolean;
    authUid: number;
    auth: IUserAuth;
}

export interface IUserAuth {
    uid: number;
    userName: string;
    isBlocked: boolean;
    userType: string;
    userUid: number;
    password: string;
    passwordc: string;
}

export interface IPermission {
    uid: number;
    action: string;
    target: string;
    active: boolean;
}

export interface IGroup {
    uid: number;
    name: string;
    keyword: string;
    permissions: IPermission[];
    active: boolean;
}