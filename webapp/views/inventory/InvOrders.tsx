import { computed, defineComponent, reactive, ref, h } from 'vue';
import DataTable from '../../components/datatable/DataTable.vue';
import Drawer from '../../components/Drawer.vue';
import { useInventoryStore } from '../../stores';
import { IStockOrder, IStockOrderProduct } from '../../models/inventory';
import { useApiUtil } from '../../composables';
import { GET_ALL_STOCK_ORDER_PRODUCTS } from '../../graphql/inventory.queries';
import {
  EDIT_STOCK_ORDER,
  ISSUE_STOCK_ORDER,
  SUBMIT_STOCK_ORDER,
} from '../../graphql/inventory.mutations';

const InventoryOrders = defineComponent({
  name: 'stock-orders',
  setup(props, ctx) {
    const { withClientQuery, withClientMutation } = useApiUtil();
    const inventoryStore = useInventoryStore();

    const openDrawer = ref(false);
    const slectedStockOrder = reactive({
      order: {} as IStockOrder,
      products: [] as IStockOrderProduct[],
    });

    const getOrderProducts = async (stockOrderUid: number) => {
      await withClientQuery(
        GET_ALL_STOCK_ORDER_PRODUCTS,
        { stockOrderUid },
        'stockOrderProductAll',
      ).then((products: IStockOrderProduct[]) => {
        slectedStockOrder.products = products?.map((op) => ({ ...op, issue: op.quantity }));
      });
    };

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
        name: 'Order Number',
        value: 'orderNumber',
        sortable: false,
        sortBy: 'asc',
        hidden: false,
        customRender: function (order) {
          return h(
            'span',
            {
              innerHTML: order?.orderNumber,
              onClick: () => {
                slectedStockOrder.order = order;
                getOrderProducts(order?.uid);
                openDrawer.value = true;
              },
            },
            [],
          );
        },
      },
      {
        name: 'Department',
        value: 'department.name',
        sortable: false,
        sortBy: 'asc',
        hidden: false,
      },
      {
        name: 'Orderer',
        value: 'orderBy.firstName',
        sortable: false,
        sortBy: 'asc',
        hidden: false,
      },
      {
        name: 'Status',
        value: 'status',
        sortable: false,
        sortBy: 'asc',
        hidden: false,
      },
    ]);

    let stockOrderParams = reactive({
      first: 50,
      before: '',
      text: '',
      sortBy: ['-uid'],
      filterAction: false,
      status: 'preperation',
    });

    return {
      tableColumns,
      inventoryStore,
      slectedStockOrder,
      openDrawer,
      stockOrderParams,
      filterOptions: [
        { name: 'All', value: '' },
        { name: 'Preperation', value: 'preperation' },
      ],
      filterStockOrders: (opts: any) => {
        stockOrderParams.first = 50;
        stockOrderParams.before = '';
        stockOrderParams.text = opts.filterText;
        stockOrderParams.filterAction = true;
        inventoryStore.fetchStockOrders(stockOrderParams);
      },
      showMoreStockOrders: (opts: any) => {
        stockOrderParams.first = opts.fetchCount;
        stockOrderParams.before = inventoryStore.stockOrdersPaging?.pageInfo?.endCursor ?? '';
        stockOrderParams.text = opts.filterText;
        stockOrderParams.filterAction = false;
        inventoryStore.fetchStockOrders(stockOrderParams);
      },
      countNone: computed(
        () =>
          inventoryStore.stockOrders?.length +
          ' of ' +
          inventoryStore.stockOrdersPaging.totalCount +
          ' orders',
      ),
      issueOrder: () => {
        const payload: any[] = [];
        for (const orderProduct of slectedStockOrder.products) {
          payload.push({
            productUid: orderProduct.product.uid,
            quantity: orderProduct.issue,
            remarks: '',
          });
        }
        withClientMutation(
          ISSUE_STOCK_ORDER,
          {
            uid: slectedStockOrder?.order?.uid,
            payload,
          },
          'issueStockOrder',
        ).then((result) => {
          inventoryStore.issueStockOrder(result);
          openDrawer.value = false;
        });
      },
      removeOrderProduct: (productUid: string) => {
        slectedStockOrder.products = [
          ...slectedStockOrder.products.filter((oi) => oi.product.uid !== productUid),
        ];
      },
      updateOrder: () => {
        const payload: any[] = [];

        for (const op of slectedStockOrder.products) {
          payload.push({
            productUid: op.product.uid,
            quantity: op.quantity,
            remarks: '',
          });
        }

        withClientMutation(
          EDIT_STOCK_ORDER,
          {
            uid: slectedStockOrder.order.uid,
            payload,
          },
          'updateStockOrder',
        ).then((result) => {
          inventoryStore.updateStockOrder(result?.stockOrder);
          openDrawer.value = false;
        });
      },
      submitOrder: () => {
        withClientMutation(
          SUBMIT_STOCK_ORDER,
          {
            uid: slectedStockOrder.order.uid,
          },
          'submitStockOrder',
        ).then((result) => {
          inventoryStore.updateStockOrder(result);
          openDrawer.value = false;
        });
      },
    };
  },
  render() {
    return (
      <div class="mt-2">
        <DataTable
          columns={this.tableColumns}
          data={this.inventoryStore.stockOrders}
          toggleColumns={false}
          loading={false}
          paginable={true}
          pageMeta={{
            fetchCount: 10,
            hasNextPage: false,
            countNone: this.countNone,
          }}
          searchable={true}
          filterable={true}
          filterMeta={{
            defaultFilter: this.stockOrderParams.status,
            filters: this.filterOptions,
          }}
          selectable={false}
          onOnSearch={(x) => this.filterStockOrders(x)}
          onOnPaginate={(x) => this.showMoreStockOrders(x)}
        ></DataTable>
        {/* Drawer */}
        <Drawer show={this.openDrawer} onClose={() => (this.openDrawer = false)}>
          {{
            header: () => `Order: ${this.slectedStockOrder?.order.orderNumber}`,
            body: () => (
              <>
                {this.slectedStockOrder?.order?.status == 'preparation' && (
                  <>
                    <div>Status: {this.slectedStockOrder?.order?.status}</div>
                    <div class="overflow-x-auto mt-2 mb-4">
                      <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
                        <table class="min-w-full">
                          <thead>
                            <tr>
                              <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider">
                                Product Name
                              </th>
                              <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
                                Quantity
                              </th>
                              <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"></th>
                            </tr>
                          </thead>
                          <tbody class="bg-white">
                            {this.slectedStockOrder.products.map((item) => (
                              <tr key={item.product.uid} v-motion-slide-right>
                                <td>
                                  <p>{item.product.name}</p>
                                </td>
                                <td class="px-1 py-1 whitespace-no-wrap">
                                  <label class="block">
                                    <input
                                      class="form-input"
                                      type="number"
                                      v-model={item.quantity}
                                      placeholder={''}
                                    />
                                  </label>
                                </td>
                                <td class="px-1 whitespace-no-wrap">
                                  <button
                                    type="button"
                                    class="bg-sky-800 text-white rounded-sm leading-none px-2 py-1"
                                    onClick={() => this.removeOrderProduct(item.product.uid)}
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <hr />
                    <div class="flex justify-start gap-x-4">
                      <button
                        type="button"
                        class="mt-4 bg-sky-800 text-white rounded-sm leading-none px-2 py-1"
                        onClick={() => this.updateOrder()}
                      >
                        Update Order
                      </button>
                      <button
                        type="button"
                        class="mt-4 bg-sky-800 text-white rounded-sm leading-none px-2 py-1"
                        onClick={() => this.submitOrder()}
                      >
                        Finalize Order
                      </button>
                    </div>
                  </>
                )}
                {['pending', 'submitted'].includes(this.slectedStockOrder?.order?.status ?? '') && (
                  <>
                    <div>Status: {this.slectedStockOrder?.order?.status}</div>
                    <hr />
                    <div class="overflow-x-auto mt-4 mb-4">
                      <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
                        <table class="min-w-full">
                          <thead>
                            <tr>
                              <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider">
                                Product Name
                              </th>
                              <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
                                Available
                              </th>
                              <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
                                Requested
                              </th>
                              <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
                                Issue
                              </th>
                              <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"></th>
                            </tr>
                          </thead>
                          <tbody class="bg-white">
                            {this.slectedStockOrder.products.map((orderProduct) => (
                              <tr key={orderProduct.uid} v-motion-slide-right>
                                <td>
                                  <p>{orderProduct.product.name}</p>
                                </td>
                                <td>
                                  <p>{orderProduct.product.remaining}</p>
                                </td>
                                <td>
                                  <p>{orderProduct.quantity}</p>
                                </td>
                                <td class="px-1 py-1 whitespace-no-wrap">
                                  <label class="block">
                                    <input
                                      class="form-input"
                                      type="number"
                                      v-model={orderProduct.issue}
                                      placeholder={''}
                                    />
                                  </label>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <hr />
                    <button
                      type="button"
                      class="mt-4 bg-sky-800 text-white rounded-sm leading-none px-2 py-1"
                      onClick={() => this.issueOrder()}
                    >
                      Issue Order
                    </button>
                  </>
                )}
                {['processed'].includes(this.slectedStockOrder?.order?.status ?? '') && (
                  <>
                    <div>Status: {this.slectedStockOrder?.order?.status}</div>
                    <hr />
                    <h4>Request Details</h4>
                    <hr />
                    <div class="overflow-x-auto mt-4 mb-4">
                      <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
                        <table class="min-w-full">
                          <thead>
                            <tr>
                              <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider">
                                Product Name
                              </th>
                              <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
                                Available
                              </th>
                              <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
                                Requested
                              </th>
                              <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"></th>
                            </tr>
                          </thead>
                          <tbody class="bg-white">
                            {this.slectedStockOrder.products.map((orderProduct) => (
                              <tr key={orderProduct.uid} v-motion-slide-right>
                                <td>
                                  <p>{orderProduct.product.name}</p>
                                </td>
                                <td>
                                  <p>{orderProduct.product.remaining}</p>
                                </td>
                                <td>
                                  <p>{orderProduct.quantity}</p>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <hr />
                  </>
                )}
              </>
            ),
            footer: () => [],
          }}
        </Drawer>
      </div>
    );
  },
});

export { InventoryOrders };
