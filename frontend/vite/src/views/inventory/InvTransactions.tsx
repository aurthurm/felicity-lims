import { defineComponent, computed, reactive, toRefs, ref, watch } from 'vue';
import DataTable from "../../components/datatable/DataTable.vue";

const InventoryTransactions = defineComponent({
  name: 'stock-transactions',
  setup(props, ctx) {
    const tableColumns = ref([
      {
        name: "UID",
        value: "uid",
        sortable: true,
        sortBy: "asc",
        defaultSort: true,
        showInToggler: false,
        hidden: true,
      },
      {
        name: "ID",
        value: "id",
        sortable: false,
        sortBy: "asc",
        hidden: false,
      },
      {
        name: "Product",
        value: "name",
        sortable: false,
        sortBy: "asc",
        hidden: false,
      },
      {
        name: "Quantity Issued",
        value: "issued",
        sortable: false,
        sortBy: "asc",
        hidden: false,
      },
      {
        name: "Issued to",
        value: "to",
        sortable: false,
        sortBy: "asc",
        hidden: false,
      },
      {
        name: "Date Issued",
        value: "batch",
        sortable: false,
        sortBy: "asc",
        hidden: false,
      },
      {
        name: "transacion by",
        value: "size",
        sortable: false,
        sortBy: "asc",
        hidden: false,
      }

    ]);


    return {
      tableColumns
    };
  },
  render() {
    return (<>
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
          countNone: "",
      }}
      searchable={false}
      filterable={false}
      filterMeta={{
        defaultFilter: "",
        filters: [],
      }}
      selectable={false}
      allChecked={false}

      ></DataTable>
    </>);
  },
});

export { InventoryTransactions };
