import { IDistrict, IProvince } from "./location";
import { IClient, IClientContact } from "./client";

export interface IPatient {
    uid: string;
    clientPatientId: string;
    patientId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    client: IClient;
    clientUid: string;
    gender: string;
    age: number;
    dateOfBirth: Date;
    ageDobEstimated: boolean;
    phoneHome: string;
    phoneMobile: string;
    consentSms: boolean;
    district: IDistrict;
    districtUid: string;
    province: IProvince;
    provinceUid: string;
    country: IDistrict;
    countryUid: string;
}