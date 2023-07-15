import { defineComponent, computed, reactive, toRefs, ref, watch } from 'vue';
import DataTable from '../../components/datatable/DataTable.vue';
import { useInventoryStore } from '../../stores';

const InventoryTransactions = defineComponent({
    name: 'stock-transactions',
    setup(props, ctx) {
        const inventoryStore = useInventoryStore();

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
                name: 'Date Created',
                value: 'createdAt',
                sortable: false,
                sortBy: 'asc',
                hidden: false,
            },
            {
                name: 'Product Name',
                value: 'product.name',
                sortable: false,
                sortBy: 'asc',
                hidden: false,
            },
            {
                name: 'Quantity Issued',
                value: 'issued',
                sortable: false,
                sortBy: 'asc',
                hidden: false,
            },
            {
                name: 'Issued To',
                value: 'department.name',
                sortable: false,
                sortBy: 'asc',
                hidden: false,
            },
            {
                name: 'Transacion By',
                value: 'transactionBy.firstName',
                sortable: false,
                sortBy: 'asc',
                hidden: false,
            },
        ]);

        return {
            tableColumns,
            inventoryStore,
        };
    },
    render() {
        return (
            <>
                <div></div>
                <DataTable
                    columns={this.tableColumns}
                    data={this.inventoryStore.transactions}
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

export { InventoryTransactions };
export default InventoryTransactions