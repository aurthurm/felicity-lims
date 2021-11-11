import { IDistrict, IProvince } from "./location";
import { IClientContact } from "./client";

export interface IPatient {
    uid?: string;
    clientPatientId?: string;
    patientId?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    client?: IClientContact;
    clientUid?: String;
    gender?: string;
    age?: number;
    dateOfBirth?: Date;
    ageDobEstimated?: Boolean;
    phoneHome?: string;
    phoneMobile?: string;
    consentSms?: string;
    district?: IDistrict;
    districtUid?: string;
    province?: IProvince;
    provinceUid?: string;
}