/**
 * Convert GraphQL edge/node structure to a flat array
 * @param payload - GraphQL response with edges and nodes
 * @returns Flat array of nodes
 */
export const parseEdgeNodeToList = (payload: any): any[] => {
    const list: any[] = [];
    if (!payload || !payload?.edges) return payload;
    payload?.edges.forEach((item: any) => list.push(item?.node));
    return list;
};

/**
 * Remove duplicates from array based on a key
 * @param arr - Array to deduplicate
 * @param key - Key to compare
 * @returns Deduplicated array
 */
export const deDuplicateArrayBy = <T>(arr: T[], key: keyof T): T[] => 
    [...new Map(arr.map(item => [item[key], item])).values()];

/**
 * Combine two arrays and remove duplicates based on a key
 * @param first - First array
 * @param second - Second array
 * @param key - Key to compare
 * @returns Combined and deduplicated array
 */
export const addListsUnique = <T>(first: T[], second: T[], key: keyof T): T[] => {
    const combined = first?.concat(second);
    return deDuplicateArrayBy(combined, key);
};

/**
 * Sort array of objects based on another array's order
 * @param array - Array to sort
 * @param order - Array defining the order
 * @param key - Key to compare
 * @returns Sorted array
 */
export const mapOrder = <T>(array: T[], order: any[], key: keyof T): T[] => {
    return array.sort((a, b) => {
        const A = a[key];
        const B = b[key];
        return order.indexOf(A) > order.indexOf(B) ? 1 : -1;
    });
};

/**
 * Generate storage slot mappings
 * @param colNum - Number of columns
 * @param rowNum - Number of rows
 * @param isColumn - Whether to use column-based mapping
 * @param byRow - Whether to map by row first
 * @returns Array of storage slot mappings
 */
export const storageSlotMapper = (
    colNum: number, 
    rowNum: number, 
    isColumn: boolean, 
    byRow: boolean
): Array<{ storageSlot: string; storageSlotIndex: number }> => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const columns = letters.slice(0, colNum);
    const rows = Array.from({ length: rowNum }, (_, i) => i + 1);

    if (isColumn) {
        return Array.from({ length: (rowNum ?? 1) * colNum }, (_, i) => i + 1).map(d => ({
            storageSlot: d.toString(),
            storageSlotIndex: d,
        }));
    }

    const data: Array<{ storageSlot: string; storageSlotIndex: number }> = [];
    let i = 1;

    if (byRow) {
        columns.forEach(column => {
            rows.forEach(row => {
                data.push({
                    storageSlot: column + row.toString(),
                    storageSlotIndex: i++,
                });
            });
        });
    } else {
        rows.forEach(row => {
            columns.forEach(column => {
                data.push({
                    storageSlot: column + row.toString(),
                    storageSlotIndex: i++,
                });
            });
        });
    }

    return data;
}; 