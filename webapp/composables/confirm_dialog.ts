import { reactive } from 'vue';

export type ConfirmDialogVariant = 'default' | 'destructive';

export interface ConfirmDialogOptions {
    title?: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: ConfirmDialogVariant;
}

export interface AlertDialogOptions {
    title?: string;
    description: string;
    confirmText?: string;
    variant?: ConfirmDialogVariant;
}

interface ConfirmDialogState {
    open: boolean;
    title: string;
    description: string;
    confirmText: string;
    cancelText: string;
    showCancel: boolean;
    variant: ConfirmDialogVariant;
    resolve?: (value: boolean) => void;
}

const state = reactive<ConfirmDialogState>({
    open: false,
    title: '',
    description: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    showCancel: true,
    variant: 'default',
    resolve: undefined,
});

const resetState = () => {
    state.title = '';
    state.description = '';
    state.confirmText = 'Confirm';
    state.cancelText = 'Cancel';
    state.showCancel = true;
    state.variant = 'default';
    state.resolve = undefined;
};

const closeDialog = (confirmed: boolean) => {
    if (!state.open) return;
    state.open = false;
    const resolver = state.resolve;
    resetState();
    resolver?.(confirmed);
};

const openConfirm = (options: ConfirmDialogOptions): Promise<boolean> =>
    new Promise(resolve => {
        state.title = options.title ?? 'Confirm';
        state.description = options.description;
        state.confirmText = options.confirmText ?? 'Confirm';
        state.cancelText = options.cancelText ?? 'Cancel';
        state.variant = options.variant ?? 'default';
        state.showCancel = true;
        state.resolve = resolve;
        state.open = true;
    });

const openAlert = (options: AlertDialogOptions): Promise<boolean> =>
    new Promise(resolve => {
        state.title = options.title ?? 'Notice';
        state.description = options.description;
        state.confirmText = options.confirmText ?? 'OK';
        state.cancelText = '';
        state.variant = options.variant ?? 'default';
        state.showCancel = false;
        state.resolve = resolve;
        state.open = true;
    });

export const useConfirmDialog = () => {
    return {
        state,
        confirm: openConfirm,
        alert: openAlert,
        close: closeDialog,
    };
};
