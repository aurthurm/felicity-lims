import useApiUtil from './api_util';
import useNotifyToast from './alert_toast';
import { ImpressBillingReportDocument, ImpressBillingReportQuery, ImpressBillingReportQueryVariables } from '@/graphql/operations/billing.queries';

export default function useBillComposable() {
    const { withClientQuery } = useApiUtil();
    const { swalConfirm, toastSuccess, toastError } = useNotifyToast();

    // download Invoice
    const downloadInvoice = async (billUid: string): Promise<void> => {
        try {
            const result = await swalConfirm(
                'You want to download this invoice',
                'Are you sure?'
            );

            if (result.isConfirmed) {
                const response = await withClientQuery<ImpressBillingReportQuery, ImpressBillingReportQueryVariables>(
                    ImpressBillingReportDocument, 
                    { billUid }, 
                    'billInvoiceCreate', 
                    'network-only'
                );

                if (response) {
                    const tempLink = document.createElement('a');
                    tempLink.href = `data:application/pdf;base64,${response}`;
                    tempLink.setAttribute('download', 'invoice-report.pdf');
                    tempLink.click();
                    toastSuccess('Invoice downloaded successfully');
                }
            }
        } catch (error) {
            toastError(`Failed to download invoice: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    return {
        downloadInvoice,
    };
}
