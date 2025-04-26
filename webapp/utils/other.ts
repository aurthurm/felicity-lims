
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