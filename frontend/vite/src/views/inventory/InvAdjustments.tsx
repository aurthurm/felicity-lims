import { defineComponent, ref } from 'vue';
import DataTable from '../../components/datatable/DataTable.vue';

const InventoryAdjustments = defineComponent({
  name: 'stock-adjustments',
  setup(props, ctx) {
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
        value: 'id',
        sortable: false,
        sortBy: 'asc',
        hidden: false,
      },
      {
        name: 'Product',
        value: 'name',
        sortable: false,
        sortBy: 'asc',
        hidden: false,
      },
      {
        name: 'Adjustment Type',
        value: 'issued',
        sortable: false,
        sortBy: 'asc',
        hidden: false,
      },
      {
        name: 'Adjustment',
        value: 'to',
        sortable: false,
        sortBy: 'asc',
        hidden: false,
      },
      {
        name: 'Date Adjusted',
        value: 'batch',
        sortable: false,
        sortBy: 'asc',
        hidden: false,
      },
      {
        name: 'Remarks',
        value: 'size',
        sortable: false,
        sortBy: 'asc',
        hidden: false,
      },
      {
        name: 'Adjusted by',
        value: 'size',
        sortable: false,
        sortBy: 'asc',
        hidden: false,
      },
    ]);

    return {
      tableColumns,
    };
  },
  render() {
    return (
      <>
        <div></div>
        <DataTable
          columns={this.tableColumns}
          data={[]}
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
