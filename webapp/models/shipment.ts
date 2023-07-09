import {  ISample } from './analysis';
import { IUser } from './auth';


export interface IReferralLaboratory {
    uid?: string
    name?: string
    code?: string
    url?: string
    username?: string
    password?: string
    isReference?: boolean
    isReferral?: boolean
}


export interface IShipment {
    uid?: string
    shipmentId?: string
    comment?: string
    courier?: string
    assignedCount?: number
    data?: any
    jsonContent: any
    samples?: ISample[]
    shippedSamples?: IShippedSample[]
    state?: string
    laboratoryUid?: string
    laboratory?: IReferralLaboratory
    incoming?: boolean
    finalisedByUid?: string    
    finalisedBy?: IUser
    dateFinalised?: string
    dispatchedByUid?: string
    dispatchedBy?: IUser
    dateDispatched?: string
    recalledByUid?: string
    recalledBy?: IUser
    dateRecalled?: string
    rejectedByUid?: string
    rejectedBy?: IUser
    dateRejected?: string
    receivedByUid?: string
    receivedBy?: IUser
    dateReceived?: string
}

export interface IShippedSample {
    sampleUid?: string
    sample?: ISample
    shipmentUid?: string
    shipment?: IShipment
    resultNotified?: boolean
    extSampleUid?: string
    extSampleId?: string
    checked?: boolean
}