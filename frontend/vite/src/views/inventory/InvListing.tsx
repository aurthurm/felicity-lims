import { computed, defineComponent, reactive, ref } from 'vue';
import DataTable from '../../components/datatable/DataTable.vue';
import Drawer from '../../components/Drawer.vue';
import StockProductForm from './StockProductForm.vue';
import { useInventoryStore } from '../../stores';

const InventoryListing = defineComponent({
  name: 'stock-listing',
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
        name: 'Name',
        value: 'name',
        sortable: false,
        sortBy: 'asc',
        hidden: false,
      },
      {
        name: 'Department',
        value: 'department.name',
        sortable: false,
        sortBy: 'asc',
        hidden: false,
      },
      {
        name: 'Supplier',
        value: 'supplier.name',
        sortable: false,
        sortBy: 'asc',
        hidden: false,
      },
      {
        name: 'Lot Number',
        value: 'lotNumber',
        sortable: false,
        sortBy: 'asc',
        hidden: false,
      },
      {
        name: 'Batch',
        value: 'batch',
        sortable: false,
        sortBy: 'asc',
        hidden: false,
      },
      {
        name: 'Size',
        value: 'size',
        sortable: false,
        sortBy: 'asc',
        hidden: false,
      },
      {
        name: 'Unit',
        value: 'unit.name',
        sortable: false,
        sortBy: 'asc',
        hidden: false,
      },
      {
        name: 'Packaging',
        value: 'packaging.name',
        sortable: false,
        sortBy: 'asc',
        hidden: false,
      },
      {
        name: 'Quantity Received',
        value: 'quantityReceived',
        sortable: false,
        sortBy: 'asc',
        hidden: false,
      },
      {
        name: 'Quantity Available',
        value: 'remaining',
        sortable: false,
        sortBy: 'asc',
        hidden: false,
      },
      {
        name: 'Expiration',
        value: 'expiryDate',
        sortable: false,
        sortBy: 'asc',
        hidden: false,
      },
    ]);

    let productParams = reactive({
      first: 50,
      before: '',
      text: '',
      sortBy: ['-uid'],
      filterAction: false,
    });

    return {
      tableColumns,
      inventoryStore,
      openDrawer: ref(false),
      filterProducts: (opts: any) => {
        productParams.first = 50;
        productParams.before = '';
        productParams.text = opts.filterText;
        productParams.filterAction = true;
        inventoryStore.fetchProducts(productParams);
      },
      showMoreProducts: (opts: any) => {
        productParams.first = opts.fetchCount;
        productParams.before = inventoryStore.productsPaging?.pageInfo?.endCursor ?? '';
        productParams.text = opts.filterText;
        productParams.filterAction = false;
        inventoryStore.fetchProducts(productParams);
      },
      countNone: computed(
        () =>
          inventoryStore.products?.length +
          ' of ' +
          inventoryStore.productsPaging.totalCount +
          ' products',
      ),
    };
  },
  render() {
    return (
      <>
        <div>
          <button
            onClick={() => (this.openDrawer = true)}
            class="px-4 my-2 p-1 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100"
          >
            New Stock
          </button>
        </div>
        <DataTable
          columns={this.tableColumns}
          data={this.inventoryStore.products}
          toggleColumns={false}
          loading={false}
          paginable={true}
          pageMeta={{
            fetchCount: 10,
            hasNextPage: false,
            countNone: this.countNone,
          }}
          searchable={true}
          filterable={false}
          selectable={false}
          onOnSearch={(x) => this.filterProducts(x)}
          onOnPaginate={(x) => this.showMoreProducts(x)}
        ></DataTable>
        {/* Drawer */}
        <Drawer show={this.openDrawer} onClose={() => (this.openDrawer = false)}>
          {{
            header: () => 'New Stock',
            body: () => [
              <StockProductForm product={null} onClose={() => (this.openDrawer = false)} />,
            ],
            footer: () => [<span>one</span>, <span>two</span>],
          }}
        </Drawer>
      </>
    );
  },
});

export { InventoryListing };
