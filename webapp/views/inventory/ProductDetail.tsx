import { defineComponent, computed, ref, watch, PropType } from 'vue';
import useApiUtil from '@/composables/api_util';
import { StockAdjustmentType, StockLotType, StockItemVariantType, StockAdjustmentCursorPage } from '@/types/gql';
import {
    GetAllStockLotsDocument,
    GetAllStockLotsQuery,
    GetAllStockLotsQueryVariables,
    GetAllStockAdjustmentsDocument,
    GetAllStockAdjustmentsQuery,
    GetAllStockAdjustmentsQueryVariables,
} from '@/graphql/operations/inventory.queries';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { parseDate } from '@/utils';

const ProductDetail = defineComponent({
    name: 'product-detail',
    emits: ['close'],
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
        watch(
            () => props.product?.uid,
            async (newUid, old) => {
                if (newUid) {
                    withClientQuery<GetAllStockLotsQuery, GetAllStockLotsQueryVariables>(
                        GetAllStockLotsDocument,
                        { productUid: newUid },
                        'stockLots',
                    ).then(result => {
                        stockLots.value = result as StockLotType[];
                    });
                    withClientQuery<GetAllStockAdjustmentsQuery, GetAllStockAdjustmentsQueryVariables>(
                        GetAllStockAdjustmentsDocument,
                        {
                            first: 25,
                            after: '',
                            text: '',
                            sortBy: ['-uid'],
                            productUid: newUid,
                        },
                        'stockAdjustmentAll',
                    ).then(paging => {
                        stockAdjustments.value = (paging as StockAdjustmentCursorPage).items || [];
                    });
                }
            },
        );

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
            emit,
        };
    },
    render() {
        return (
            <>
                <div class="space-y-4">
                    <h3 class="text-foreground text-lg font-medium">Stock Item: {this.props.product?.stockItem?.name}</h3>
                    <p class="text-muted-foreground text-sm">{this.props.product?.stockItem?.description}</p>
                    <div class="border-border my-4 border-t"></div>

                    <h3 class="text-foreground text-lg font-medium">Stock Variant: {this.props.product?.name}</h3>
                    <p class="text-muted-foreground text-sm">{this.props.product?.description}</p>
                    <div class="border-border my-4 border-t"></div>

                    <nav class="bg-background flex justify-between rounded-md shadow-md">
                        <div class="flex justify-start">
                            {this.inventoryTabs?.map(tab => (
                                <a
                                    key={tab}
                                    class={[
                                        'text-muted-foreground rounded-md px-4 py-2 text-xs font-bold tracking-wide uppercase no-underline transition-colors duration-200',
                                        {
                                            'bg-primary text-primary-foreground': this.currentTab === tab,
                                            'hover:bg-muted': this.currentTab !== tab,
                                        },
                                    ]}
                                    onClick={() => (this.currentTab = tab)}
                                >
                                    {tab}
                                </a>
                            ))}
                        </div>
                    </nav>

                    <div class="pt-4">
                        {this.currentTab === 'stock-lots' && (
                            <>
                                <div class="bg-background overflow-hidden rounded-lg shadow-md">
                                    <Table class="divide-border min-w-full divide-y">
                                        <TableHeader class="bg-muted">
                                            <TableRow>
                                                <TableHead class="text-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                                    Lot Number
                                                </TableHead>
                                                <TableHead class="text-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                                    Quantity
                                                </TableHead>
                                                <TableHead class="text-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                                    Expiry Date
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody class="bg-background divide-border divide-y">
                                            {this.stockLots.length === 0 ? (
                                                <TableEmpty colspan={3}>
                                                    <Empty class="border-0 bg-transparent p-0">
                                                        <EmptyContent>
                                                            <EmptyHeader>
                                                                <EmptyTitle>No stock lots available</EmptyTitle>
                                                                <EmptyDescription>
                                                                    Lots will appear here once stock is received.
                                                                </EmptyDescription>
                                                            </EmptyHeader>
                                                        </EmptyContent>
                                                    </Empty>
                                                </TableEmpty>
                                            ) : (
                                                this.stockLots.map(lot => (
                                                    <TableRow key={lot.uid} class="hover:bg-muted transition-colors duration-150">
                                                        <TableCell class="text-foreground px-4 py-3 text-sm">{lot.lotNumber}</TableCell>
                                                        <TableCell class="text-foreground px-4 py-3 text-sm">{lot.quantity}</TableCell>
                                                        <TableCell class="text-foreground px-4 py-3 text-sm">
                                                            {parseDate(lot.expiryDate, false)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                        )}
                        {this.currentTab === 'ledger' && (
                            <>
                                <div class="bg-background overflow-hidden rounded-lg shadow-md">
                                    <Table class="divide-border min-w-full divide-y">
                                        <TableHeader class="bg-muted">
                                            <TableRow>
                                                <TableHead class="text-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                                    Date
                                                </TableHead>
                                                <TableHead class="text-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                                    Lot
                                                </TableHead>
                                                <TableHead class="text-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                                    Transaction Type
                                                </TableHead>
                                                <TableHead class="text-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                                    Quantity
                                                </TableHead>
                                                <TableHead class="text-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                                    By
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody class="bg-background divide-border divide-y">
                                            {this.stockAdjustments.length === 0 ? (
                                                <TableEmpty colspan={5}>
                                                    <Empty class="border-0 bg-transparent p-0">
                                                        <EmptyContent>
                                                            <EmptyHeader>
                                                                <EmptyTitle>No adjustments recorded</EmptyTitle>
                                                                <EmptyDescription>
                                                                    Ledger activity will appear here after updates.
                                                                </EmptyDescription>
                                                            </EmptyHeader>
                                                        </EmptyContent>
                                                    </Empty>
                                                </TableEmpty>
                                            ) : (
                                                this.stockAdjustments.map(adjustment => (
                                                    <TableRow key={adjustment.uid} class="hover:bg-muted transition-colors duration-150">
                                                        <TableCell class="text-foreground px-4 py-3 text-sm">
                                                            {parseDate(adjustment?.adjustmentDate)}
                                                        </TableCell>
                                                        <TableCell class="text-foreground px-4 py-3 text-sm">
                                                            {adjustment?.stockLot?.lotNumber}
                                                        </TableCell>
                                                        <TableCell class="text-foreground px-4 py-3 text-sm">
                                                            {adjustment?.adjustmentType}
                                                        </TableCell>
                                                        <TableCell class="text-foreground px-4 py-3 text-sm">
                                                            {adjustment?.adjust}
                                                        </TableCell>
                                                        <TableCell class="text-foreground px-4 py-3 text-sm">
                                                            {adjustment?.adjustmentBy?.firstName}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </>
        );
    },
});

export { ProductDetail };
export default ProductDetail;
