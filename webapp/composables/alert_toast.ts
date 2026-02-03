import { toast } from 'vue-sonner';
import { useConfirmDialog } from '@/composables/confirm_dialog';

interface SwalOptions {
    title?: string;
    text: string;
    icon: 'success' | 'info' | 'warning' | 'error' | 'question';
    confirmButtonText?: string;
    showCancelButton?: boolean;
    cancelButtonText?: string;
}

const truncateMessage = (message: string, maxLength: number = 120): string => {
    if (!message) return '';
    if (message.length <= maxLength) return message;
    return `${message.substring(0, maxLength)}...`;
};

const mapVariant = (icon: SwalOptions['icon']) => {
    if (icon === 'warning' || icon === 'error') return 'destructive';
    return 'default';
};

export default function useNotifyToast() {
    const { confirm, alert } = useConfirmDialog();

    return {
        toastSuccess: (message: string, duration?: number) => toast.success(message, { duration }),

        toastInfo: (message: string, duration?: number) => toast(message, { duration }),

        toastWarning: (message: string, duration?: number) => toast.warning(message, { duration }),

        toastError: (message: string, duration?: number) => {
            const errorMessage = truncateMessage(message?.toString() || 'Unknown error');
            toast.error(errorMessage, { duration: duration ?? 10000 });
        },

        swalSuccess: async (message: string, title?: string) => {
            await alert({
                title: title || 'Success',
                description: message,
                confirmText: 'OK',
                variant: 'default',
            });
            return { isConfirmed: true };
        },

        swalInfo: async (message: string, title?: string) => {
            await alert({
                title: title || 'Information',
                description: message,
                confirmText: 'OK',
                variant: 'default',
            });
            return { isConfirmed: true };
        },

        swalWarning: async (message: string, title?: string) => {
            await alert({
                title: title || 'Warning',
                description: message,
                confirmText: 'OK',
                variant: 'destructive',
            });
            return { isConfirmed: true };
        },

        swalError: async (message: string, title?: string) => {
            await alert({
                title: title || 'Error',
                description: message,
                confirmText: 'OK',
                variant: 'destructive',
            });
            return { isConfirmed: true };
        },

        swalConfirm: async (message: string, title?: string) => {
            const isConfirmed = await confirm({
                title: title || 'Confirm',
                description: message,
                confirmText: 'Yes',
                cancelText: 'No',
                variant: 'default',
            });
            return { isConfirmed };
        },

        swalCustom: async (options: SwalOptions) => {
            if (options.showCancelButton) {
                const isConfirmed = await confirm({
                    title: options.title || 'Confirm',
                    description: options.text,
                    confirmText: options.confirmButtonText || 'Confirm',
                    cancelText: options.cancelButtonText || 'Cancel',
                    variant: mapVariant(options.icon),
                });
                return { isConfirmed };
            }

            await alert({
                title: options.title || 'Notice',
                description: options.text,
                confirmText: options.confirmButtonText || 'OK',
                variant: mapVariant(options.icon),
            });
            return { isConfirmed: true };
        },

        notyfSuccess: (message: string) => toast.success(message),
        notyfError: (message: string) => toast.error(truncateMessage(message)),
        notyfInfo: (message: string) => toast(truncateMessage(message)),
        notyfWarning: (message: string) => toast.warning(truncateMessage(message)),
    };
}
