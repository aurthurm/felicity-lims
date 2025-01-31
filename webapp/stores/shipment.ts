import { defineStore } from 'pinia';
import { addListsUnique } from '@/utils/helpers';
import { ISample } from '@/models/analysis';
import { IShipment, IReferralLaboratory, IShippedSample } from '@/models/shipment';
import { IPageInfo } from '@/models/pagination';

import  useApiUtil  from '@/composables/api_util';
import { GetAllReferralLaboratoriesDocument, GetAllReferralLaboratoriesQuery, GetAllReferralLaboratoriesQueryVariables, GetAllShipmentsDocument, GetAllShipmentsQuery, GetAllShipmentsQueryVariables, GetShipmentByUidDocument, GetShipmentByUidQuery, GetShipmentByUidQueryVariables } from '@/graphql/operations/shipment.queries';
import { UpdateShipmentDocument, UpdateShipmentMutation, UpdateShipmentMutationVariables } from '@/graphql/operations/shipment.mutations';
import { GetSamplesForShipmentAssignDocument, GetSamplesForShipmentAssignQuery, GetSamplesForShipmentAssignQueryVariables } from '@/graphql/operations/analyses.queries';

const { withClientQuery, withClientMutation } = useApiUtil();

export const useShipmentStore = defineStore('shipment', {
    state: () => {
        return {
            laboratories: [],
            fetchingLaboratories: false,
            shipments: [],
            fetchingShipments: false,
            shipment: undefined,
            shipmentCount: 0,
            shipmentPageInfo: undefined,
            fetchingSamples: false,
            samples: [], // for SH Assign
            sampleCount: 0,
            samplePageInfo: undefined,
        } as {
            laboratories: IReferralLaboratory[]
            fetchingLaboratories: boolean,
            shipments: IShipment[];
            fetchingShipments: boolean;
            shipment?: IShipment;
            shipmentCount: number;
            shipmentPageInfo?: IPageInfo;
            fetchingSamples?: boolean;
            samples: IShippedSample[];
            sampleCount: number;
            samplePageInfo?: IPageInfo;
        };
    },
    getters: {
        getReferalLaboratories: state => state.laboratories,
        getShipments: state => state.shipments,
        getShipment: state => state.shipment,
        getShipmentByUid: state => (uid: string) => state.shipments?.find(ws => ws.uid === uid),
        getShipmentCount: state => state.shipmentCount,
        getShipmentPageInfo: state => state.shipmentPageInfo,
        getSamples: state => state.samples,
        getSampleCount: state => state.sampleCount,
        getSamplePageInfo: state => state.samplePageInfo,
    },
    actions: {
        // referral laboratories
        async fetchReferralLaboratories() {
            this.fetchingLaboratories = true;
            await withClientQuery<GetAllReferralLaboratoriesQuery, GetAllReferralLaboratoriesQueryVariables>(GetAllReferralLaboratoriesDocument, {}, 'referralLaboratoryAll')
                .then(payload => {
                    this.fetchingLaboratories = false;
                    this.laboratories = payload;
                })
                .catch(err => (this.fetchingLaboratories = false));
        },
        updateReferralLaboratory(payload) {
            const index = this.laboratories.findIndex(item => item.uid === payload?.uid);
            if (index > -1) this.laboratories[index] = payload;
        },
        addReferralLaboratory(payload) {
            this.laboratories?.unshift(payload);
        },
        // Shipments
        async fetcShipments(params) {
            this.fetchingShipments = true;
            await withClientQuery<GetAllShipmentsQuery, GetAllShipmentsQueryVariables>(GetAllShipmentsDocument, params, undefined)
                .then(payload => {
                    this.fetchingShipments = false;
                    const page = payload.shipmentAll;
                    const shipments = page.items;
                    if (params.filterAction) {
                        this.shipments = [];
                        this.shipments = shipments;
                    } else {
                        this.shipments = addListsUnique(this.shipments, shipments, 'uid');
                    }
                    this.shipmentCount = page?.totalCount;
                    this.shipmentPageInfo = page?.pageInfo;
                })
                .catch(err => (this.fetchingShipments = false));
        },
        async fetchShipmentByUid(uid: string) {
            await withClientQuery<GetShipmentByUidQuery, GetShipmentByUidQueryVariables>(GetShipmentByUidDocument, { shipmentUid: uid }, 'shipmentByUid').then(
                payload => (this.shipment = payload)
            );
        },
        addShipment(payload) {
            payload.shipments?.forEach(shipment => this.shipments?.unshift(shipment));
        },
        clearShipment() {
            this.shipments = [];
        },
        removeShipment() {
            this.shipment = undefined;
        },
        async updateShipment(payload) {
            await withClientMutation<UpdateShipmentMutation, UpdateShipmentMutationVariables>(UpdateShipmentDocument, payload, 'updateShipment').then(payload => {
                this.updateShipmentMetadata(payload)
            });
        },
        async updateShipmentMetadata(payload) {
            this.shipment = {
                ...this.shipment,
                ...payload
            }
        },
        updateShipmentStatus(shipment: any) {
            const index = this.shipments.findIndex(x => x.uid === shipment.uid);
            if (index > -1) {
                this.shipments[index].state = shipment.state;
            }
            if (this.shipment?.uid === shipment.uid) {
                this.shipment!.state = shipment.state;
            }
        },

        // Samples for SH Assign
        async fetchFoShipmentAssign(params) {
            this.fetchingSamples = true;
            await withClientQuery<GetSamplesForShipmentAssignQuery, GetSamplesForShipmentAssignQueryVariables>(GetSamplesForShipmentAssignDocument, params, undefined)
                .then(payload => {
                    this.fetchingSamples = false;
                    const page = payload.samplesForShipmentAssign;
                    const samples = page.items.map((s: ISample) => {
                        s.analysisResults = s.analysisResults?.filter(r => r.status === "pending")
                        return s;
                    });
                    if (params.filterAction) {
                        this.samples = [];
                        this.samples = samples;
                    } else {
                        this.samples = samples;
                    }
                    this.sampleCount = page?.totalCount;
                    this.samplePageInfo = page?.pageInfo;
                })
                .catch(err => (this.fetchingSamples = false));
        },

        // analysis samples
        updateShipmentSamplesStatus(payload) {
            payload?.forEach(result => {
                this.shipment?.samples?.forEach((sample, index) => {
                    if (sample?.uid == result.uid) {
                        sample.status = result.status;
                    }
                });
                this.shipment?.shippedSamples?.forEach((shipped, index) => {
                    if (shipped?.sampleUid == result.uid) {
                        shipped.sample!.status = result.status;
                    }
                });
            });
        },
        updateSamples(payload: ISample[]) {
            payload?.forEach(result => {
                const index = this.samples.findIndex(x => x.sampleUid === result.uid);
                if (index > -1) {
                    this.samples[index].sample = {
                        ...this.samples[index].sample,
                        ...result,
                    };
                }
            });
        },
    },
});