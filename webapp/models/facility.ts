import { ILocation, IDistrict } from './location';

export interface IFacility extends ILocation {
    district: IDistrict;
}

export interface IRAxor {
    district: string;
}

export interface IFacilityContact {
    uid: string;
    firstName: string;
    lastname: string;
    email: string;
    emailCc: string[];
    consentEmail: boolean;
    businessPhone: string;
    mobilePhone: string;
    consentSms: boolean;
    client: IFacility;
}
