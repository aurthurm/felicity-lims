import Swal from 'sweetalert2';
// import JSConfetti from 'js-confetti';
import { Notyf } from 'notyf';
import { notify } from "@kyvg/vue3-notification";

// const jsConfetti = new JSConfetti();

// jsConfetti.addConfetti({
//     emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸'],
// });

// Define types for notification options
interface ToastOptions {
  text: string;
  type: 'success' | 'info' | 'warn' | 'error';
  duration?: number;
}

interface SwalOptions {
  title?: string;
  text: string;
  icon: 'success' | 'info' | 'warning' | 'error' | 'question';
  confirmButtonText?: string;
  showCancelButton?: boolean;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
}

// Configure Notyf with better defaults
const notyf = new Notyf({
  // https://github.com/caroso1222/notyf
  duration: 5000,
  position: {
    x: 'right',
    y: 'bottom',
  },
  types: [
    {
      type: 'info',
      className: 'bg-primary',
      icon: false,
    },
    {
      type: 'warning',
      background: 'orange',
      icon: {
        className: 'material-icons',
        tagName: 'i',
        text: 'warning',
      },
    },
    {
      type: 'error',
      background: 'indianred',
      duration: 10000,
      dismissible: true,
    },
  ],
});

/**
 * Fire a SweetAlert2 dialog with the given options
 * @param options - Configuration options for the alert
 * @returns Promise that resolves when the alert is closed
 */
const fireAlert = async (options: SwalOptions): Promise<any> => {
  try {
    return await Swal.fire({
      title: options.title || 'Yay!',
      text: options.text,
      icon: options.icon,
      confirmButtonText: options.confirmButtonText || 'OK',
      showCancelButton: options.showCancelButton || false,
      cancelButtonText: options.cancelButtonText || 'Cancel',
      confirmButtonColor: options.confirmButtonColor || '#3085d6',
      cancelButtonColor: options.cancelButtonColor || '#d33',
    });
  } catch (error) {
    console.error('Error showing alert:', error);
    return null;
  }
};

/**
 * Truncate a message to a reasonable length for display
 * @param message - The message to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated message
 */
const truncateMessage = (message: string, maxLength: number = 50): string => {
  if (!message) return '';
  if (message.length <= maxLength) return message;
  return `${message.substring(0, maxLength)}...`;
};

export default function useNotifyToast() {
  return {
    // Toast notifications using vue3-notification
    toastSuccess: (message: string, duration?: number) => 
      notify({ text: message, type: 'success', duration }),
    
    toastInfo: (message: string, duration?: number) => 
      notify({ text: message, type: 'info', duration }),
    
    toastWarning: (message: string, duration?: number) => 
      notify({ text: message, type: 'warn', duration }),
    
    toastError: (message: string, duration?: number) => {
      const errorMessage = truncateMessage(message?.toString() || 'Unknown error');
      notify({ text: errorMessage, type: 'error', duration: duration || 10000 });
    },
    
    // SweetAlert2 dialogs
    swalSuccess: (message: string, title?: string) => 
      fireAlert({ 
        title: title || 'Success', 
        text: message, 
        icon: 'success',
        confirmButtonText: 'OK'
      }),
    
    swalInfo: (message: string, title?: string) => 
      fireAlert({ 
        title: title || 'Information', 
        text: message, 
        icon: 'info',
        confirmButtonText: 'OK'
      }),
    
    swalWarning: (message: string, title?: string) => 
      fireAlert({ 
        title: title || 'Warning', 
        text: message, 
        icon: 'warning',
        confirmButtonText: 'OK'
      }),
    
    swalError: (message: string, title?: string) => 
      fireAlert({ 
        title: title || 'Error', 
        text: message, 
        icon: 'error',
        confirmButtonText: 'OK'
      }),
    
    // Confirmation dialog
    swalConfirm: (message: string, title?: string) => 
      fireAlert({ 
        title: title || 'Confirm', 
        text: message, 
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }),
    
    // Custom alert with full options
    swalCustom: (options: SwalOptions) => fireAlert(options),
    
    // Notyf notifications (alternative to vue3-notification)
    notyfSuccess: (message: string) => notyf.success(message),
    notyfError: (message: string) => notyf.error(truncateMessage(message)),
    notyfInfo: (message: string) => notyf.open({ type: 'info', message }),
    notyfWarning: (message: string) => notyf.open({ type: 'warning', message }),
  };
}
