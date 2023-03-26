import { defineComponent, computed, reactive, toRefs, ref, watch } from 'vue';
import DataTable from "../../components/datatable/DataTable.vue";

const InventoryOrders = defineComponent({
  name: 'stock-orders',
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
        name: "Name",
        value: "name",
        sortable: false,
        sortBy: "asc",
        hidden: false,
      },
      {
        name: "Department",
        value: "department.name",
        sortable: false,
        sortBy: "asc",
        hidden: false,
      },
      {
        name: "Supplier",
        value: "supplier.name",
        sortable: false,
        sortBy: "asc",
        hidden: false,
      },
      {
        name: "Lot Number",
        value: "lotNumber",
        sortable: false,
        sortBy: "asc",
        hidden: false,
      },
      {
        name: "Batch",
        value: "batch",
        sortable: false,
        sortBy: "asc",
        hidden: false,
      },
      {
        name: "Size",
        value: "size",
        sortable: false,
        sortBy: "asc",
        hidden: false,
      },
      {
        name: "Unit",
        value: "unit",
        sortable: false,
        sortBy: "asc",
        hidden: false,
      },
      {
        name: "Packaging",
        value: "package.name",
        sortable: false,
        sortBy: "asc",
        hidden: false,
      },
      {
        name: "Quantity Received",
        value: "quantity",
        sortable: false,
        sortBy: "asc",
        hidden: false,
      },
      {
        name: "Quantity Available",
        value: "available",
        sortable: false,
        sortBy: "asc",
        hidden: false,
      },
      {
        name: "Expiration",
        value: "expiry",
        sortable: false,
        sortBy: "asc",
        hidden: false,
      },

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


export { InventoryOrders };
