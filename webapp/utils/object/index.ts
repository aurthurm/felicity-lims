import { isNullOrWs, toCamel } from '../string';

/**
 * Check if a value is a valid JSON string
 */
const isValidJson = (str: any): boolean => {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
};

/**
 * Check if an object is empty
 */
export const isEmptyObject = (obj: any): boolean => 
    obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype;

/**
 * Check if  empty
 */
export const ifZeroEmpty = (val: any): any => {
    if (val === undefined) return '';
    return val === 0 ? '' : val;
}

/**
 * Parse data into an object
 */
export const parseData = (data: any): any => {
    if (!data) return {};
    if (typeof data === 'object') return data;
    if (typeof data === 'string') return JSON.parse(data);
    return {};
};

/**
 * Parse URL parameters into an object
 */
export const parseUrlParams = (): Record<string, string> => {
    const search = window.location.search.substring(1);
    if (!search) return {};

    const str = search.replace(/&/g, '","').replace(/=/g, '":"');
    const json = `{"${str}"}`;
    const transform = (key: any, value: any) => 
        (isNullOrWs(key) ? value : decodeURIComponent(value));

    return isValidJson(json) ? JSON.parse(json, transform) : {};
};

/**
 * Check if an object is a plain object
 */
export const isObject = (obj: any): boolean => 
    obj === Object(obj) && !Array.isArray(obj) && typeof obj !== 'function';

/**
 * Convert all object keys to camelCase
 */
export const keysToCamel = (obj: any): any => {
    if (isObject(obj)) {
        const n: any = {};
        Object.keys(obj).forEach(k => {
            n[toCamel(k)] = keysToCamel(obj[k]);
        });
        return n;
    } else if (Array.isArray(obj)) {
        return obj.map(i => keysToCamel(i));
    }
    return obj;
}; 