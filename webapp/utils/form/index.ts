import { isEmptyObject } from '../object';

/**
 * Reset a form by removing all properties
 * @param form - Form object to reset
 */
export const resetForm = (form: Record<string, any>): void => 
    Object.keys(form).forEach(k => delete form[k]);

/**
 * Mutate a form with new data
 * @param form - Form object to mutate
 * @param payload - New data to apply
 * @param reset - Whether to reset the form before applying new data
 */
export const mutateForm = (
    form: Record<string, any>, 
    payload: Record<string, any>, 
    reset = true
): void => {
    if (reset) resetForm(form);
    if (!isEmptyObject(payload)) {
        Object.assign(form, { ...payload });
    }
}; 