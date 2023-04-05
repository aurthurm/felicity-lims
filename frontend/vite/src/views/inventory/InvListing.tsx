import { computed, defineComponent, reactive, ref, h } from 'vue';
import DataTable from '../../components/datatable/DataTable.vue';
import Drawer from '../../components/Drawer.vue';
import Modal from '../../components/SimpleModal.vue';
import StockProductForm from './StockProductForm.vue';
import { useInventoryStore } from '../../stores';
import { IStockProduct } from '../../models/inventory';

const InventoryListing = defineComponent({
  name: 'stock-listing',
  setup(props, ctx) {
    const inventoryStore = useInventoryStore();

    const choiceProduct = reactive({
      product: {} as IStockProduct,
      quantity: 0,
    });
    const openAddProduct = ref(false);

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
      {
        name: 'Actions',
        value: '',
        sortable: false,
        sortBy: 'asc',
        hidden: false,
        customRender: function (product, _) {
          return h(
            'div',
            {
              class: 'flex justify-between align-items-center',
            },
            [
              h(
                'button',
                {
                  type: 'button',
                  class: 'bg-sky-800 text-white py-1 px-2 rounded-sm leading-none',
                  innerHTML: '+ Basket',
                  onClick: () => {
                    choiceProduct.product = product;
                    choiceProduct.quantity = 0;
                    openAddProduct.value = true;
                  },
                },
                [],
              ),
              h(
                'button',
                {
                  type: 'button',
                  class: 'bg-sky-800 text-white py-1 px-2 rounded-sm leading-none',
                  innerHTML: 'Adjust',
                },
                [],
              ),
            ],
          );
        },
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
      openAddProduct,
      choiceProduct,
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
      validateMinMax: (event) => {
        const value = Math.max(
          0,
          Math.min(choiceProduct.product.remaining ?? 0, Number(event.target.value)),
        );
        choiceProduct.quantity = value;
      },
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
        {this.openAddProduct && (
          <Modal onClose={() => (this.openAddProduct = false)} contentWidth="w-1/4">
            {{
              header: () => <h3>{this.choiceProduct.product.name}</h3>,
              body: () => {
                return (
                  <form action="post" class="p-1">
                    <label class="flex justify-between items-center gap-4 mb-4">
                      <span class="text-gray-700">Quantiy</span>
                      <input
                        class="form-input mt-1 block w-full"
                        type="number"
                        onChange={this.validateMinMax}
                        v-model={this.choiceProduct.quantity}
                        placeholder="Name ..."
                      />
                    </label>
                    <hr />
                    <button
                      type="button"
                      onClick={() => {
                        this.inventoryStore.addToBasket(
                          this.choiceProduct.product.uid,
                          this.choiceProduct.quantity,
                        );
                        this.openAddProduct = false;
                      }}
                      class="-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"
                    >
                      Add to basket
                    </button>
                  </form>
                );
              },
            }}
          </Modal>
        )}
      </>
    );
  },
});

export { InventoryListing };
