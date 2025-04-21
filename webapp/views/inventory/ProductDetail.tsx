import { defineComponent, computed, ref, watch, PropType } from 'vue';
import  useApiUtil  from '@/composables/api_util';
import { StockAdjustmentType, StockLotType, StockItemVariantType, StockAdjustmentCursorPage } from '@/types/gql';
import { 
    GetAllStockLotsDocument, GetAllStockLotsQuery, GetAllStockLotsQueryVariables,
    GetAllStockAdjustmentsDocument, GetAllStockAdjustmentsQuery, GetAllStockAdjustmentsQueryVariables
 } from '@/graphql/operations/inventory.queries';
import { parseDate } from '@/utils';

const ProductDetail = defineComponent({
    name: 'product-detail',
    emits: ["close"],  
    props: {
        product: {
            type: Object as PropType<StockItemVariantType>,
        },
    },
    setup(props, { emit }) {
        const { withClientQuery } = useApiUtil();

        // Prefetch data
        const stockLots = ref([] as StockLotType[]);
        const stockAdjustments = ref([] as StockAdjustmentType[]);
        watch(() => props.product?.uid, async (newUid, old) => {
            if (newUid) {
                withClientQuery<GetAllStockLotsQuery, GetAllStockLotsQueryVariables>(GetAllStockLotsDocument, { productUid: newUid }, 'stockLots').then(result => {
                    stockLots.value = result as StockLotType[];
                })
                withClientQuery<GetAllStockAdjustmentsQuery, GetAllStockAdjustmentsQueryVariables>(GetAllStockAdjustmentsDocument, {
                    first: 25,
                    after: '',
                    text: '',
                    sortBy: ['-uid'],
                    productUid: newUid
                }, 'stockAdjustmentAll')
                .then((paging) => {
                    stockAdjustments.value = (paging as StockAdjustmentCursorPage).items || [];
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
                <div class="space-y-4">
                    <h3 class="text-lg font-medium text-foreground">Stock Item: {this.props.product?.stockItem?.name}</h3>
                    <p class="text-sm text-muted-foreground">{this.props.product?.stockItem?.description}</p>
                    <div class="border-t border-border my-4"></div>

                    <h3 class="text-lg font-medium text-foreground">Stock Variant: {this.props.product?.name}</h3>
                    <p class="text-sm text-muted-foreground">{this.props.product?.description}</p>
                    <div class="border-t border-border my-4"></div>

                    <nav class="flex justify-between bg-background shadow-md rounded-md">
                        <div class="flex justify-start">
                            {this.inventoryTabs?.map(tab => (
                                <a
                                    key={tab}
                                    class={[
                                        'no-underline text-muted-foreground uppercase tracking-wide font-bold text-xs py-2 px-4 rounded-md transition-colors duration-200',
                                        { 'bg-primary text-primary-foreground': this.currentTab === tab, 'hover:bg-muted': this.currentTab !== tab },
                                    ]}
                                    onClick={() => (this.currentTab = tab)}
                                >
                                    {tab}
                                </a>
                            ))}
                        </div>
                    </nav>

                    <div class="pt-4">
                        {this.currentTab === 'stock-lots' && (<>
                            <div class="overflow-hidden bg-background shadow-md rounded-lg">
                                <table class="min-w-full divide-y divide-border">
                                    <thead class="bg-muted">
                                        <tr>
                                            <th class="px-4 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                                                Lot Number
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                                                Expiry Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-background divide-y divide-border">
                                        {this.stockLots?.map(lot => (
                                            <tr key={lot.uid} class="hover:bg-muted transition-colors duration-150">
                                                <td class="px-4 py-3 text-sm text-foreground">{lot.lotNumber}</td>
                                                <td class="px-4 py-3 text-sm text-foreground">{lot.quantity}</td>
                                                <td class="px-4 py-3 text-sm text-foreground">{parseDate(lot.expiryDate, false)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>)}
                        {this.currentTab === 'ledger' && (<>
                            <div class="overflow-hidden bg-background shadow-md rounded-lg">
                                <table class="min-w-full divide-y divide-border">
                                    <thead class="bg-muted">
                                        <tr>
                                            <th class="px-4 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                                                Lot
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                                                Transaction Type
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th class="px-4 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                                                By
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-background divide-y divide-border">
                                        {this.stockAdjustments?.map(adjustment => (<>
                                            <tr key={adjustment.uid} class="hover:bg-muted transition-colors duration-150">
                                                <td class="px-4 py-3 text-sm text-foreground">{parseDate(adjustment?.adjustmentDate)}</td>
                                                <td class="px-4 py-3 text-sm text-foreground">{adjustment?.stockLot?.lotNumber}</td>
                                                <td class="px-4 py-3 text-sm text-foreground">{adjustment?.adjustmentType}</td>
                                                <td class="px-4 py-3 text-sm text-foreground">{adjustment?.adjust}</td>
                                                <td class="px-4 py-3 text-sm text-foreground">{adjustment?.adjustmentBy?.firstName}</td>
                                            </tr>
                                        </>))}
                                    </tbody>
                                </table>
                            </div>
                        </>)}
                    </div>
                </div>
            </>
        );
    },
});

export { ProductDetail };
export default ProductDetail
