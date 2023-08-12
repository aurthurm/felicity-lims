import { defineComponent, ref, h } from 'vue';
import DataTable from '../../components/datatable/DataTable.vue';
import { useInventoryStore } from '../../stores';

const InventoryTransactions = defineComponent({
    name: 'stock-transactions',
    setup(props, ctx) {
        const inventoryStore = useInventoryStore();
        inventoryStore.fetchTransactions({
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
                customRender: function (transaction) {
                    return h(
                        'div',
                        {},
                        [
                            h(
                                'div',
                                {
                                    class: "mr-2",
                                    innerHTML: `${transaction?.department?.name ?? "No Department"}`,
                                },
                                []
                            ),
                            h(
                                'div',
                                {
                                    innerHTML: `${transaction?.transactionBy?.firstName ?? "---"} ${transaction?.transactionBy?.lastName ?? ""}`,
                                },
                                []
                            )                 
                        ]
                    );
                },
            },
            {
                name: 'Transacion By',
                value: 'transactionBy.firstName',
                sortable: false,
                sortBy: 'asc',
                hidden: false,
                customRender: function (transaction) {
                    return h(
                        'span',
                        {
                            innerHTML: `${transaction?.transactionBy?.firstName ?? "---"} ${transaction?.transactionBy?.lastName ?? ""}`,
                        },
                        []
                    );
                },
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