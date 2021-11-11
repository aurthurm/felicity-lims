import { ILocation, IDistrict } from "./location";

export interface IClient extends ILocation {
  district?: IDistrict;
}

export interface IClientContact {
  uid?: number;
  firstName?: string;  
  lastname?: string;
  email?: string;
  emailCc?: string[];
  consentEmail?: boolean;
  businessPhone?: string;
  mobilePhone?: string;
  consentSms?: boolean;
  client?: IClient;
}
