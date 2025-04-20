/**
 * Check if a string is null, undefined, or whitespace
 * @param str - String to check
 * @returns boolean indicating if string is empty
 */
export const isNullOrWs = (str: any): boolean => 
    typeof str === 'undefined' || str === null || (typeof str === 'string' && str.trim().length === 0);

/**
 * Check if a value has no content
 * @param x - Value to check
 * @returns boolean indicating if value is empty
 */
export const hasValue = (x: any): boolean => [undefined, null, ''].includes(x);

/**
 * Convert snake_case to camelCase
 * @param val - String or object to convert
 * @returns Converted string or object
 */
export const snakeToCamel = (val: any): any => {
    const convert = (s: string): string => s.replace(/(_\w)/g, (k: string) => k[1].toUpperCase());
    
    if (typeof val === 'object') {
        return Object.entries(val).reduce((x: any, [k, v]) => (x[convert(k)] = v) && x, {});
    }
    
    if (typeof val === 'string') {
        return convert(val);
    }
    
    throw new Error('Invalid input for snakeToCamel conversion');
};

/**
 * Convert string to camelCase
 * @param str - String to convert
 * @returns Converted string
 */
export const toCamel = (str: string): string => {
    return str.replace(/([-_][a-z])/gi, $1 => {
        return $1.toUpperCase().replace('-', '').replace('_', '');
    });
};

/**
 * Generate a color from a string
 * @param str - Input string
 * @returns HSL color string
 */
export const stringToColor = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 70%, 60%)`;
};

/**
 * Get user initials from first and last name
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @returns Initials string
 */
export const getUserInitials = (firstName?: string, lastName?: string): string => {
    const first = firstName?.charAt(0).toUpperCase() || '';
    const last = lastName?.charAt(0).toUpperCase() || '';
    return `${first}${last}`;
}; 