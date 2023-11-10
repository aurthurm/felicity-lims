import { isNullOrWs } from '../utils/helpers';

export const simpleValidator = (form: any, required: string[] = []) => {
    if (required.length == 0) alert('There are no validation fields');
    if (typeof form !== 'object') alert('Form must a Map Object');

    let response = { hasError: false, data: new Map() };

    for (let field of required) {
        if (isNullOrWs(form[field])) {
            response.hasError = true;
            response.data.set(field, 'This field is required');
        }
    }

    return response;
};

export const isRequired = (value: any) => {
    if (value && value.trim()) {
        return true;
    }
    return 'This is required';
};
