export interface IBase {
    uid?: string;
    name?: string;
    code?: string;
}

export interface ICountry extends IBase {
    //
}

export interface ILocation extends IBase {
    email?: string;
    emailCc?: string[];
    consentEmail?: boolean;
    businessPhone?: string;
    mobilePhone?: string;
    consentSms?: boolean;
}

export interface IProvince extends ILocation {
    country?: ICountry;
}

export interface IDistrict extends ILocation {
    province?: IProvince;
}

export interface IGenericLocation extends ILocation {
    district?: IDistrict;
    province?: IProvince;
    country?: ICountry;
}
