import { IDistrict, IProvince } from "./location";
import { IClient, IClientContact } from "./client";

export interface IPatient {
    uid?: number;
    clientPatientId?: string;
    patientId?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    client?: IClient;
    clientUid?: number;
    gender?: string;
    age?: number;
    dateOfBirth?: Date;
    ageDobEstimated?: boolean;
    phoneHome?: string;
    phoneMobile?: string;
    consentSms?: boolean;
    district?: IDistrict;
    districtUid?: number;
    province?: IProvince;
    provinceUid?: number;
}