import Swal from 'sweetalert2';
import { DOWNLOAD_INVOICE } from '@/graphql/operations/billing.queries';
import useApiUtil from './api_util';

export default function useBillComposable() {
    const { withClientQuery } = useApiUtil();

    // download Invoice
    const downloadInvoice = async billUid => {
        try {
            await Swal.fire({
                title: 'Are you sure?',
                text: 'You want to download this invoice',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, download now!',
                cancelButtonText: 'No, do not download!',
            }).then(async result => {
                if (result.isConfirmed) {
                    withClientQuery(DOWNLOAD_INVOICE, { billUid }, 'billInvoiceCreate', 'network-only').then(resp => {
                        const tempLink = document.createElement('a');
                        tempLink.href = `data:application/pdf;base64,${resp}`;
                        tempLink.setAttribute('download', 'invoice-report.pdf');
                        tempLink.click();
                    });
                    await Swal.fire('Its Happening!', 'Downloading .....', 'success').then(_ => {});
                }
            });
        } catch (error) {}
    };

    return {
        downloadInvoice,
    };
}
