export interface IUser {
    uid?: string;
    userUid?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    mobilePhone?: string;
    businessPhone?: string;
    groupUid?: string;
    group?: IGroup;
    role?: string; // group name
    groups?: IGroup[];
    isActive?: boolean;
    isSuperuser?: boolean;
    authUid?: string;
    auth?: IUserAuth;
    // for API axios
    first_name?: string;
    last_name?: string;
}

export interface IUserAuth {
    uid?: string;
    userName?: string;
    isBlocked?: boolean;
    userType?: string;
    userUid?: string;
    password?: string;
    passwordc?: string;
}

export interface IPermission {
    uid?: string;
    action?: string;
    target?: string;
    active?: boolean;
    checked?: boolean;
}

export interface IGroup {
    uid?: string;
    name?: string;
    keyword?: string;
    permissions?: IPermission[];
    active?: boolean;
    pages?: string | string[];
}
