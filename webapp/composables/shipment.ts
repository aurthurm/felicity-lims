import Swal from 'sweetalert2';
import useApiUtil  from '@/composables/api_util';
import { useShipmentStore } from '@/stores/shipment';
import { ActionShipmentDocument, ActionShipmentMutation, ActionShipmentMutationVariables, ShipmentManageSamplesDocument, ShipmentManageSamplesMutation, ShipmentManageSamplesMutationVariables } from '@/graphql/operations/shipment.mutations';
import { ManifestReportDocument, ManifestReportQuery, ManifestReportQueryVariables } from '@/graphql/operations/shipment.queries';

export default function useShipmentComposable() {
    const { withClientMutation, withClientQuery } = useApiUtil();
    const shipmentStore = useShipmentStore()

    // manage shipment Samples
    const manageSamples = (shipmentUid, samplesMetadata, action="assign") => {
        try {
          Swal.fire({
            title: "Are you sure?",
            text: `You want to ${action} selected?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Yes, ${action} now!`,
            cancelButtonText: "No, cancel apply!",
          }).then((result) => {
            if (result.isConfirmed) {
              withClientMutation<ShipmentManageSamplesMutation, ShipmentManageSamplesMutationVariables>(
                ShipmentManageSamplesDocument,
                {
                  uid: shipmentUid,
                  payload: { samples: samplesMetadata, action }
                },
                "shipmentManageSamples"
              ).then((result) => shipmentStore.updateShipmentMetadata(result));
            }
          });
        } catch (error) {}
      };

    // manage shipment Samples
    const actionShipment = (uid, action="finalise") => {
      try {
        Swal.fire({
          title: "Are you sure?",
          text: `You want to ${action} the shipment?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: `Yes, ${action} now!`,
          cancelButtonText: "No, cancel apply!",
        }).then((result) => {
          if (result.isConfirmed) {
            withClientMutation<ActionShipmentMutation, ActionShipmentMutationVariables>(
              ActionShipmentDocument,
              { uid, action },
              "actionShipment"
            ).then((result) => shipmentStore.updateShipmentMetadata(result));
          }
        });
      } catch (error) {}
    };

    // DOWNLOAD_IMPRESS
    const downloadManifest = async uid => {
      try {
          await Swal.fire({
              title: 'Are you sure?',
              text: 'You want to download this report',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, download now!',
              cancelButtonText: 'No, do not download!',
          }).then(async result => {
              if (result.isConfirmed) {
                  withClientQuery<ManifestReportQuery, ManifestReportQueryVariables>(ManifestReportDocument, { uid }, 'manifestReportDownload').then(resp => {
                      const tempLink = document.createElement('a');
                      tempLink.href = `data:application/pdf;base64,${resp}`;
                      tempLink.setAttribute('download', 'manifest-report.pdf');
                      tempLink.click();
                  });

                  await Swal.fire('Its Happening!', 'Downloading .....', 'success').then(_ => {});
              }
          });
      } catch (error) {}
    };
  

    return {
        manageSamples,
        actionShipment,
        downloadManifest
    };
}
