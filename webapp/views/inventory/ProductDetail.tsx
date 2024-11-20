import { defineComponent, computed, ref, watch, PropType } from 'vue';
import  useApiUtil  from '@/composables/api_util';
import { IStockAdjustment, IStockLot, IStockProduct } from '@/models/inventory';
import { 
    GetAllStockLotsDocument, GetAllStockLotsQuery, GetAllStockLotsQueryVariables,
    GetAllStockAdjustmentsDocument, GetAllStockAdjustmentsQuery, GetAllStockAdjustmentsQueryVariables
 } from '@/graphql/operations/inventory.queries';
import { parseDate } from '@/utils/helpers';
import { IPagination } from '@/models/pagination';

const ProductDetail = defineComponent({
    name: 'product-detail',
    emits: ["close"],  
    props: {
        product: {
            type: Object as PropType<IStockProduct>,
        },
    },
    setup(props, { emit }) {
        const { withClientQuery } = useApiUtil();

        // Prefetch data
        const stockLots = ref([] as IStockLot[]);
        const stockAdjustments = ref([] as IStockAdjustment[]);
        watch(() => props.product?.uid, async (newUid, old) => {
            if (newUid) {
                withClientQuery<GetAllStockLotsQuery, GetAllStockLotsQueryVariables>(GetAllStockLotsDocument, { productUid: newUid }, 'stockLots').then(result => {
                    stockLots.value = result;
                })
                withClientQuery<GetAllStockAdjustmentsQuery, GetAllStockAdjustmentsQueryVariables>(GetAllStockAdjustmentsDocument, {
                    first: 25,
                    after: '',
                    text: '',
                    sortBy: ['-uid'],
                    productUid: newUid
                }, 'stockAdjustmentAll')
                .then((paging: IPagination<IStockAdjustment>) => {
                    stockAdjustments.value = paging.items ?? [];
                })
            }
        });
        
        // Tabs
        const currentTab = ref('stock-lots');
        const inventoryTabs = ref(['stock-lots', 'ledger']);
        const currentTabComponent = computed(() => 'tab-' + currentTab.value);

        return {
            currentTab,
            inventoryTabs,
            currentTabComponent,
            props,
            stockLots,
            stockAdjustments,
            emit
        };
    },
    render() {
        return (
            <>
                <h3 class="font-bold text-l text-gray-600">Stock Item: {this.props.product?.stockItem?.name}</h3>
                <p class="italic text-gray-500">{this.props.product?.stockItem?.description}</p>
                <hr class="my-2" />

                <h3 class="font-bold text-l text-gray-600">Stock Variant: {this.props.product?.name}</h3>
                <p class="italic text-gray-500">{this.props.product?.description}</p>
                <hr class="mt-2 mb-4" />

                <nav class="flex justify-between bg-white shadow-md mt-2">
                    <div class="-mb-px flex justify-start">
                        {this.inventoryTabs?.map(tab => (
                            <a
                                key={tab}
                                class={[
                                    'no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-sky-600 hover:text-gray-200',
                                    { 'tab-active': this.currentTab === tab },
                                ]}
                                onClick={() => (this.currentTab = tab)}
                                
                            >
                                {tab}
                            </a>
                        ))}
                    </div>
                </nav>

                <div class="pt-2">
                    {this.currentTab === 'stock-lots' && (<>
                        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard p-2 rounded-bl-lg rounded-br-lg">
                            <table class="min-w-full">
                                <thead>
                                    <tr>
                                        <th class="px-1 py-1 border-b-2 border-gray-500 text-left text-sm leading-4 text-gray-800 tracking-wider">
                                            Lot Number
                                        </th>
                                        <th class="px-1 py-1 border-b-2 border-gray-500 text-left text-sm leading-4 text-gray-800 tracking-wider">
                                            Quantity
                                        </th>
                                        <th class="px-1 py-1 border-b-2 border-gray-500 text-left text-sm leading-4 text-gray-800 tracking-wider">
                                            Expiry Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.stockLots?.map(lot => (
                                        <tr key={lot.uid}>
                                            <td class="border-b-2 border-gray-200 p-1 text-sm">{lot.lotNumber}</td>
                                            <td class="border-b-2 border-gray-200 p-1 text-sm">{lot.quantity}</td>
                                            <td class="border-b-2 border-gray-200 p-1 text-sm">{parseDate(lot.expiryDate, false)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>)}
                    {this.currentTab === 'ledger' && (<>
                        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard p-2 rounded-bl-lg rounded-br-lg">
                            <table class="min-w-full">
                                <thead>
                                    <tr>
                                        <th class="px-1 py-1 border-b-2 border-gray-500 text-left text-sm leading-4 text-gray-800 tracking-wider">
                                            Date
                                        </th>
                                        <th class="px-1 py-1 border-b-2 border-gray-500 text-left text-sm leading-4 text-gray-800 tracking-wider">
                                            Lot
                                        </th>
                                        <th class="px-1 py-1 border-b-2 border-gray-500 text-left text-sm leading-4 text-gray-800 tracking-wider">
                                            Transaction Type
                                        </th>
                                        <th class="px-1 py-1 border-b-2 border-gray-500 text-left text-sm leading-4 text-gray-800 tracking-wider">
                                            Quantity
                                        </th>
                                        <th class="px-1 py-1 border-b-2 border-gray-500 text-left text-sm leading-4 text-gray-800 tracking-wider">
                                            By
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.stockAdjustments?.map(adjustment => (<>
                                        <tr>
                                            <td class="border-b-2 border-gray-200 p-1 text-sm">{parseDate(adjustment?.adjustmentDate)}</td>
                                            <td class="border-b-2 border-gray-200 p-1 text-sm">{adjustment?.lotNumber}</td>
                                            <td class="border-b-2 border-gray-200 p-1 text-sm">{adjustment?.adjustmentType}</td>
                                            <td class="border-b-2 border-gray-200 p-1 text-sm">{adjustment?.adjust}</td>
                                            <td class="border-b-2 border-gray-200 p-1 text-sm">{adjustment?.adjustmentBy?.firstName}</td>
                                        </tr>
                                    </>))}
                                </tbody>
                            </table>
                        </div>
                    </>)}
                </div>
            </>
        );
    },
});

export { ProductDetail };
export default ProductDetail
