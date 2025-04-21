import useApiUtil from '@/composables/api_util';
import { useShipmentStore } from '@/stores/shipment';
import useNotifyToast from '@/composables/alert_toast';
import { ActionShipmentDocument, ActionShipmentMutation, ActionShipmentMutationVariables, ShipmentManageSamplesDocument, ShipmentManageSamplesMutation, ShipmentManageSamplesMutationVariables } from '@/graphql/operations/shipment.mutations';
import { ManifestReportDocument, ManifestReportQuery, ManifestReportQueryVariables } from '@/graphql/operations/shipment.queries';
import { ReferenceSampleInput } from '@/types/gql';


export default function useShipmentComposable() {
    const { withClientMutation, withClientQuery } = useApiUtil();
    const shipmentStore = useShipmentStore();
    const { swalConfirm, toastSuccess, toastError } = useNotifyToast();

    // Manage shipment samples
    const manageSamples = async (shipmentUid: string, samplesMetadata: Array<ReferenceSampleInput>, action: string = "assign") => {
        try {
            const confirmed = await swalConfirm(
                `You want to ${action} selected?`,
                'Confirm Action'
            );

            if (!confirmed.isConfirmed) return;

            const result = await withClientMutation<ShipmentManageSamplesMutation, ShipmentManageSamplesMutationVariables>(
                ShipmentManageSamplesDocument,
                {
                    uid: shipmentUid,
                    payload: { samples: samplesMetadata, action }
                },
                "shipmentManageSamples"
            );

            shipmentStore.updateShipmentMetadata(result);
            toastSuccess(`Successfully ${action}ed samples`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Failed to ${action} samples`;
            toastError(errorMessage);
        }
    };

    // Action shipment (finalise, dispatch, etc.)
    const actionShipment = async (uid: string, action: string = "finalise") => {
        try {
            const confirmed = await swalConfirm(
                `You want to ${action} the shipment?`,
                'Confirm Action'
            );

            if (!confirmed.isConfirmed) return;

            const result = await withClientMutation<ActionShipmentMutation, ActionShipmentMutationVariables>(
                ActionShipmentDocument,
                { uid, action },
                "actionShipment"
            );

            shipmentStore.updateShipmentMetadata(result);
            toastSuccess(`Successfully ${action}ed shipment`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Failed to ${action} shipment`;
            toastError(errorMessage);
        }
    };

    // Download manifest report
    const downloadManifest = async (uid: string) => {
        try {
            const confirmed = await swalConfirm(
                'You want to download this report',
                'Confirm Download'
            );

            if (!confirmed.isConfirmed) return;

            const resp = await withClientQuery<ManifestReportQuery, ManifestReportQueryVariables>(
                ManifestReportDocument, 
                { uid }, 
                'manifestReportDownload'
            );

            const tempLink = document.createElement('a');
            tempLink.href = `data:application/pdf;base64,${resp}`;
            tempLink.setAttribute('download', 'manifest-report.pdf');
            tempLink.click();

            toastSuccess('Manifest report downloaded successfully');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to download manifest report';
            toastError(errorMessage);
        }
    };

    return {
        manageSamples,
        actionShipment,
        downloadManifest
    };
}
