import { IDistrict, IProvince } from './location';
import { IClient } from './client';

export interface IIdentification {
    uid: string;
    name: string;
}

export interface IPatientIdentification {
    uid: string;
    identificationUid: string;
    identification: IIdentification;
    patientUid: string;
    value: string;
}

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
    identifications: IPatientIdentification[];
}

export interface IPatientIdentificationForm {
    identificationUid: string;
    value: string;
}
