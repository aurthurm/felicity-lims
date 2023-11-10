import { ILocation, IDistrict } from './location';

export interface IClient extends ILocation {
    district: IDistrict;
    districtUid: string;
}

export interface IClientContact {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    emailCc: string[];
    consentEmail: boolean;
    businessPhone: string;
    mobilePhone: string;
    consentSms: boolean;
    client: IClient;
}
