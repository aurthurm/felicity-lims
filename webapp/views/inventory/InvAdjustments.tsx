import { defineAsyncComponent, defineComponent, ref, h } from 'vue';
import { useInventoryStore } from '@/stores/inventory';
const DataTable = defineAsyncComponent(
    () => import('@/components/ui/datatable/FelDataTable.vue')
)

const InventoryAdjustments = defineComponent({
    name: 'stock-adjustments',
    setup(props, ctx) {

        const inventoryStore = useInventoryStore();
        inventoryStore.fetchAdjustments({
            first: 50,
            after: '',
            text: '',
            sortBy: ['-uid'],
        });

        const tableColumns = ref([
            {
                name: 'UID',
                value: 'uid',
                sortable: true,
                sortBy: 'asc',
                defaultSort: true,
                showInToggler: false,
                hidden: true,
            },
            {
                name: 'ID',
                value: 'uid',
                sortable: false,
                sortBy: 'asc',
                hidden: false,
            },
            {
                name: 'Product',
                value: 'product.name',
                sortable: false,
                sortBy: 'asc',
                hidden: false,
            },
            {
                name: 'Adjustment Type',
                value: 'adjustmentType',
                sortable: false,
                sortBy: 'asc',
                hidden: false,
            },
            {
                name: 'Adjustment',
                value: 'adjust',
                sortable: false,
                sortBy: 'asc',
                hidden: false,
            },
            {
                name: 'Date Adjusted',
                value: 'adjustmentDate',
                sortable: false,
                sortBy: 'asc',
                hidden: false,
            },
            {
                name: 'Remarks',
                value: 'remarks',
                sortable: false,
                sortBy: 'asc',
                hidden: false,
            },
            {
                name: 'Adjusted by',
                value: 'adjustmentBy.firstName',
                sortable: false,
                sortBy: 'asc',
                hidden: false,
                customRender: function (adjustment) {
                    return h(
                        'span',
                        {
                            innerHTML: `${adjustment?.adjustmentBy?.firstName ?? "---"} ${adjustment?.adjustmentBy?.lastName ?? ""}`,
                        },
                        []
                    );
                },
            },
        ]);

        return {
            tableColumns,
            inventoryStore
        };
    },
    render() {
        return (
            <>
                <div></div>
                <DataTable
                    columns={this.tableColumns}
                    data={this.inventoryStore.adjustments}
                    toggleColumns={false}
                    loading={false}
                    paginable={false}
                    pageMeta={{
                        fetchCount: 10,
                        hasNextPage: false,
                        countNone: '',
                    }}
                    searchable={false}
                    filterable={false}
                    filterMeta={{
                        defaultFilter: '',
                        filters: [],
                    }}
                    selectable={false}
                    allChecked={false}
                ></DataTable>
            </>
        );
    },
});

export { InventoryAdjustments };
export default InventoryAdjustments