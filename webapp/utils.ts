import dayjs from 'dayjs';
import CryptoJs from 'crypto-js';

// https://www.aesencryptiononline.com/ to decrypto online
export const encrypter = async (data: any, key: string) => await CryptoJs.AES.encrypt(JSON.stringify(data), key).toString();
export const decrypter = async (data: any, key: string) => {
    if (!data) return {};
    return await JSON.parse(CryptoJs.AES.decrypt(data, key).toString(CryptoJs.enc.Utf8));
};
export const decrypter2 = (data: any, key: string) => {
    if (!data) return {};
    return JSON.parse(CryptoJs.AES.decrypt(data, key).toString(CryptoJs.enc.Utf8));
};

export const parseDate = function (str: any, withTime=true) {
    let date = dayjs(str);
    if (date.isValid()) {
        if(withTime) return date.format('D MMMM YYYY, h:mm:ss a');
        return date.format('D MMMM YYYY')
    }
    return str ?? "---";
};

export const subtractDates = (first: any, second: any) => Math.floor(Math.abs(first - second) / (1000 * 60 * 60 * 24));

export const parseEdgeNodeToList = (payload: any) => {
    const list: any[] = [];
    if (!payload || !payload?.edges) return payload;
    payload?.edges.forEach((item: any) => list.push(item?.node));
    return list;
};

export const isNullOrWs = function (str: any) {
    return typeof str === 'undefined' || str === null || (typeof str === 'string' && str.trim().length === 0);
};

const isValidJson = function (str: any) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

export const isEmptyObject = (obj: any) => {
    return obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype;
};

export const parseData = function (data: any) {
    if (!data) return {};
    if (typeof data === 'object') return data;
    if (typeof data === 'string') return JSON.parse(data);
    return {};
};

export const parseUrlParams = () => {
    const search = window.location.search.substring(1);
    if (!search) return {};

    const str = search.replace(/&/g, '","').replace(/=/g, '":"');
    const json = `{"${str}"}`;
    const transform = (key: any, value: any) => (isNullOrWs(key) ? value : decodeURIComponent(value));

    return isValidJson(json) ? JSON.parse(json, transform) : {};
};

export const startsWith = (str: any, word: any) => {
    return str.lastIndexOf(word, 0) === 0;
};

export function ifZeroEmpty(val: any): any {
    if (val === undefined) return '';
    return val === 0 ? '' : val;
}

export function ifNoValEmpty(val: any): any {
    if (val === undefined) return '';
    if (val === null) return '';
    if (!val) return '';
    return val;
}

export function deDuplicateArrayBy(arr: any[], key: string): any[] {
    return [...new Map(arr.map(item => [item[key], item])).values()];
}

export function addListsUnique(f: any[], s: any[], key: string): any[] {
    const c = f?.concat(s);
    return deDuplicateArrayBy(c, key);
}

export const snakeToCamel = (val: any) => {
    const convert = (s: any) => s.replace(/(_\w)/g, (k: any) => k[1].toUpperCase());
    if (typeof val === 'object') {
        const data = Object.entries(val).reduce((x: any, [k, v]) => (x[convert(k)] = v) && x, {});
        return data;
    }
    if (typeof val === 'string') {
        return convert(val);
    }
    throw '--- error converting ---';
};

export const toCamel = (str: string) => {
    return str.replace(/([-_][a-z])/gi, $1 => {
        return $1.toUpperCase().replace('-', '').replace('_', '');
    });
};

export const isObject = (obj: any) => {
    return obj === Object(obj) && !Array.isArray(obj) && typeof obj !== 'function';
};

export const keysToCamel = (obj: any): any => {
    if (isObject(obj)) {
        const n: any = {};

        Object.keys(obj).forEach(k => {
            n[toCamel(k)] = keysToCamel(obj[k]);
        });

        return n;
    } else if (Array.isArray(obj)) {
        return obj.map(i => {
            return keysToCamel(i);
        });
    }

    return obj;
};

const special = [
    'zeroth',
    'first',
    'second',
    'third',
    'fourth',
    'fifth',
    'sixth',
    'seventh',
    'eighth',
    'ninth',
    'tenth',
    'eleventh',
    'twelfth',
    'thirteenth',
    'fourteenth',
    'fifteenth',
    'sixteenth',
    'seventeenth',
    'eighteenth',
    'nineteenth',
];
const deca = ['twent', 'thirt', 'fort', 'fift', 'sixt', 'sevent', 'eight', 'ninet'];

export const stringifyNumber = (n: number): string => {
    if (n < 20) return special[n];
    if (n % 10 === 0) return deca[Math.floor(n / 10) - 2] + 'ieth';
    return deca[Math.floor(n / 10) - 2] + 'y-' + special[n % 10];
};

/**
 * Sort array of objects based on another array
 */

export const mapOrder = (array, order, key) => {
    return array.sort(function (a, b) {
        var A = a[key],
            B = b[key];

        if (order.indexOf(A) > order.indexOf(B)) {
            return 1;
        } else {
            return -1;
        }
    });
};

/**
 * sample storge Slot Mapper
 */

export const storgeSlotMapper = (colNum: number, rowNum: number, isColumn: boolean, byRow: boolean) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const columns = letters.slice(0, colNum);
    const rows = Array.from({ length: rowNum }, (_, i) => i + 1);

    if (isColumn) {
        return Array.from({ length: (rowNum ?? 1) * colNum }, (_, i) => i + 1).map(d => ({
            storageSlot: d.toString(),
            storageSlotIndex: d,
        }));
    } else {
        const data: any[] = [];
        let i = 1;
        if (byRow) {
            columns.forEach((column, cIdx) => {
                rows.forEach(row => {
                    data.push({
                        storageSlot: column + row.toString(),
                        storageSlotIndex: i,
                    });
                    i++;
                });
            });
        } else {
            rows.forEach(row => {
                columns.forEach((column, cIdx) => {
                    data.push({
                        storageSlot: column + row.toString(),
                        storageSlotIndex: i,
                    });
                    i++;
                });
            });
        }
        return data;
    }
};

export default {
    isNullOrWs,
    parseUrlParams,
    startsWith,
    mapOrder,
};
