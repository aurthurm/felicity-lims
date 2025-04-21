import { defineStore } from 'pinia';
import { addListsUnique } from '@/utils';

import  useApiUtil  from '@/composables/api_util';
import { GetAllReferralLaboratoriesDocument, GetAllReferralLaboratoriesQuery, GetAllReferralLaboratoriesQueryVariables, GetAllShipmentsDocument, GetAllShipmentsQuery, GetAllShipmentsQueryVariables, GetShipmentByUidDocument, GetShipmentByUidQuery, GetShipmentByUidQueryVariables } from '@/graphql/operations/shipment.queries';
import { UpdateShipmentDocument, UpdateShipmentMutation, UpdateShipmentMutationVariables } from '@/graphql/operations/shipment.mutations';
import { GetSamplesForShipmentAssignDocument, GetSamplesForShipmentAssignQuery, GetSamplesForShipmentAssignQueryVariables } from '@/graphql/operations/analyses.queries';
import { PageInfo, ReferralLaboratoryType, SampleCursorPage, ShipmentCursorPage, ShipmentType, ShippedSampleType } from '@/types/gql';

const { withClientQuery, withClientMutation } = useApiUtil();

type ExtShipmentsQueryVariables = GetAllShipmentsQueryVariables & {
    filterAction?: boolean;
}

type ExtSamplesForShipmentAssignQueryVariables = GetSamplesForShipmentAssignQueryVariables & {
    filterAction?: boolean;
}

type ShipmentStateType = {
    laboratories: ReferralLaboratoryType[];
    fetchingLaboratories: boolean;
    shipments: ShipmentType[];
    fetchingShipments: boolean;
    shipment?: ShipmentType;
    shipmentCount: number;
    shipmentPageInfo?: PageInfo;
    fetchingSamples: boolean;
    samples: ShippedSampleType[];
    sampleCount: number;
    samplePageInfo?: PageInfo;
}

export const useShipmentStore = defineStore('shipment', {
    state: (): ShipmentStateType => ({
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
    }),
    getters: {
        getReferalLaboratories: (state): ReferralLaboratoryType[] => state.laboratories,
        getShipments: (state): ShipmentType[] => state.shipments,
        getShipment: (state): ShipmentType | undefined => state.shipment,
        getShipmentByUid: (state) => (uid: string): ShipmentType | undefined => 
            state.shipments.find(ws => ws.uid === uid),
        getShipmentCount: (state): number => state.shipmentCount,
        getShipmentPageInfo: (state): PageInfo | undefined => state.shipmentPageInfo,
        getSamples: (state): ShippedSampleType[] => state.samples,
        getSampleCount: (state): number => state.sampleCount,
        getSamplePageInfo: (state): PageInfo | undefined => state.samplePageInfo,
    },
    actions: {
        // referral laboratories
        async fetchReferralLaboratories(): Promise<void> {
            try {
                this.fetchingLaboratories = true;
                const result = await withClientQuery<GetAllReferralLaboratoriesQuery, GetAllReferralLaboratoriesQueryVariables>(
                    GetAllReferralLaboratoriesDocument, 
                    {}, 
                    'referralLaboratoryAll'
                );
                
                if (result && Array.isArray(result)) {
                    this.laboratories = result;
                } else {
                    console.error('Invalid laboratories data received:', result);
                }
            } catch (error) {
                console.error('Error fetching referral laboratories:', error);
            } finally {
                this.fetchingLaboratories = false;
            }
        },
        updateReferralLaboratory(payload: ReferralLaboratoryType): void {
            if (!payload?.uid) {
                console.error('Invalid laboratory payload:', payload);
                return;
            }
            const index = this.laboratories.findIndex(item => item.uid === payload.uid);
            if (index > -1) {
                this.laboratories[index] = payload;
            }
        },
        addReferralLaboratory(payload: ReferralLaboratoryType): void {
            if (!payload?.uid) {
                console.error('Invalid laboratory payload:', payload);
                return;
            }
            this.laboratories.unshift(payload);
        },
        // Shipments
        async fetchShipments(params: ExtShipmentsQueryVariables): Promise<void> {
            try {
                this.fetchingShipments = true;
                const result = await withClientQuery<GetAllShipmentsQuery, GetAllShipmentsQueryVariables>(
                    GetAllShipmentsDocument, 
                    params, 
                    undefined
                );
                
                if (result && typeof result === 'object' && 'shipmentAll' in result) {
                    const page = result.shipmentAll as ShipmentCursorPage;
                    const shipments = page.items || [];
                    
                    if (params.filterAction) {
                        this.shipments = shipments as ShipmentType[];
                    } else {
                        this.shipments = addListsUnique(this.shipments, shipments as ShipmentType[], 'uid');
                    }
                    
                    this.shipmentCount = page.totalCount;
                    this.shipmentPageInfo = page.pageInfo;
                } else {
                    console.error('Invalid shipments data received:', result);
                }
            } catch (error) {
                console.error('Error fetching shipments:', error);
            } finally {
                this.fetchingShipments = false;
            }
        },
        async fetchShipmentByUid(uid: string): Promise<void> {
            if (!uid) {
                console.error('Shipment UID is required');
                return;
            }

            try {
                const result = await withClientQuery<GetShipmentByUidQuery, GetShipmentByUidQueryVariables>(
                    GetShipmentByUidDocument, 
                    { shipmentUid: uid }, 
                    'shipmentByUid'
                );
                
                if (result && typeof result === 'object') {
                    this.shipment = result as ShipmentType;
                } else {
                    console.error('Invalid shipment data received:', result);
                }
            } catch (error) {
                console.error('Error fetching shipment by UID:', error);
            }
        },
        addShipment(payload: { shipments: ShipmentType[] }): void {
            if (!payload?.shipments || !Array.isArray(payload.shipments)) {
                console.error('Invalid shipment payload:', payload);
                return;
            }
            
            payload.shipments.forEach(shipment => {
                if (shipment?.uid) {
                    this.shipments.unshift(shipment);
                }
            });
        },
        clearShipment(): void {
            this.shipments = [];
        },
        removeShipment(): void {
            this.shipment = undefined;
        },
        async updateShipment(payload: UpdateShipmentMutationVariables): Promise<void> {
            try {
                const result = await withClientMutation<UpdateShipmentMutation, UpdateShipmentMutationVariables>(
                    UpdateShipmentDocument, 
                    payload, 
                    'updateShipment'
                );
                
                if (result && typeof result === 'object') {
                    this.updateShipmentMetadata(result);
                } else {
                    console.error('Invalid update shipment result:', result);
                }
            } catch (error) {
                console.error('Error updating shipment:', error);
            }
        },
        updateShipmentMetadata(payload: Partial<ShipmentType>): void {
            if (!this.shipment) {
                console.error('No shipment to update');
                return;
            }
            
            this.shipment = {
                ...this.shipment,
                ...payload
            };
        },
        updateShipmentStatus(shipment: { uid: string; state: string }): void {
            if (!shipment?.uid) {
                console.error('Invalid shipment status update:', shipment);
                return;
            }
            
            const index = this.shipments.findIndex(x => x.uid === shipment.uid);
            if (index > -1) {
                this.shipments[index].state = shipment.state;
            }
            
            if (this.shipment?.uid === shipment.uid) {
                this.shipment.state = shipment.state;
            }
        },

        // Samples for SH Assign
        async fetchForShipmentAssign(params: ExtSamplesForShipmentAssignQueryVariables): Promise<void> {
            try {
                this.fetchingSamples = true;
                const result = await withClientQuery<GetSamplesForShipmentAssignQuery, GetSamplesForShipmentAssignQueryVariables>(
                    GetSamplesForShipmentAssignDocument, 
                    params, 
                    undefined
                );
                
                if (result && typeof result === 'object' && 'samplesForShipmentAssign' in result) {
                    const page = result.samplesForShipmentAssign as SampleCursorPage;
                    const items = page.items || [];
                    const samples = items.map((s: any) => {
                        s.analysisResults = s.analysisResults?.filter((r: any) => r.status === "pending");
                        return s;
                    });
                    
                    if (params.filterAction) {
                        this.samples = samples as ShippedSampleType[];
                    } else {
                        this.samples = addListsUnique(this.samples, samples as ShippedSampleType[], 'extSampleUid');
                    }
                    
                    this.sampleCount = page.totalCount;
                    this.samplePageInfo = page.pageInfo;
                } else {
                    console.error('Invalid samples data received:', result);
                }
            } catch (error) {
                console.error('Error fetching samples for shipment assign:', error);
            } finally {
                this.fetchingSamples = false;
            }
        },

        // analysis samples
        updateShipmentSamplesStatus(payload: { uid: string; status: string }[]): void {
            if (!payload || !Array.isArray(payload)) {
                console.error('Invalid samples status update payload:', payload);
                return;
            }
            
            payload.forEach(result => {
                if (!result?.uid) {
                    console.error('Invalid sample result:', result);
                    return;
                }
                
                this.shipment?.samples?.forEach(sample => {
                    if (sample?.uid === result.uid) {
                        sample.status = result.status;
                    }
                });
                
                this.shipment?.shippedSamples?.forEach(shipped => {
                    if (shipped?.sampleUid === result.uid && shipped.sample) {
                        shipped.sample.status = result.status;
                    }
                });
            });
        },
        updateSamples(payload: any[]): void {
            if (!payload || !Array.isArray(payload)) {
                console.error('Invalid samples update payload:', payload);
                return;
            }
            
            payload.forEach(result => {
                if (!result?.uid) {
                    console.error('Invalid sample result:', result);
                    return;
                }
                
                const index = this.samples.findIndex(x => x.sampleUid === result.uid);
                if (index > -1 && this.samples[index].sample) {
                    this.samples[index].sample = {
                        ...this.samples[index].sample,
                        ...result,
                    };
                }
            });
        },
    },
});