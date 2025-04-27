import { defineStore } from 'pinia';
import { 
    GetPiceForProfileDocument, GetPiceForProfileQuery, GetPiceForProfileQueryVariables,
    GetDiscountForProfileDocument, GetDiscountForProfileQuery, GetDiscountForProfileQueryVariables,
    GetPriceForAnalysisDocument, GetPriceForAnalysisQuery, GetPriceForAnalysisQueryVariables,
    GetDiscountForAnalysisDocument, GetDiscountForAnalysisQuery, GetDiscountForAnalysisQueryVariables,
    GetAllVouchersDocument, GetAllVouchersQuery, GetAllVouchersQueryVariables,
    GetVoucherByUidDocument, GetVoucherByUidQueryVariables, GetVoucherByUidQuery,
    GetVoucherCodesDocument, GetVoucherCodesQueryVariables, GetVoucherCodesQuery,
    GetBillsForPatientDocument, GetBillsForPatientQueryVariables, GetBillsForPatientQuery,
    GetBillsForClientDocument, GetBillsForClientQueryVariables, GetBillsForClientQuery,
    GetBillTransactionsDocument, GetBillTransactionsQueryVariables, GetBillTransactionsQuery,
} from '@/graphql/operations/billing.queries'

import  useApiUtil  from '@/composables/api_util';
import { 
    ProfilePriceType, 
    ProfileDiscountType, 
    AnalysisPriceType, 
    AnalysisDiscountType, 
    VoucherType, 
    VoucherCodeType, 
    TestBillType, 
    TestBillTransactionType 
} from '@/types/gql';


const { withClientQuery } = useApiUtil();

// Define the state type
type BillingStateType = {
    profilePrice?: ProfilePriceType;
    profileDiscount?: ProfileDiscountType;
    fetchingPrice: boolean;
    analysisPrice?: AnalysisPriceType;
    analysisDiscount?: AnalysisDiscountType;
    fetchingDiscount: boolean;
    vouchers: VoucherType[];
    fetchingVouchers: boolean;
    fetchingVoucher: boolean;
    fetchingVoucherCodes: boolean;
    bills: TestBillType[];
    fetchingBills: boolean;
    transactions: TestBillTransactionType[];
    fetchingTransactions: boolean;
};

export const useBillingStore = defineStore('billing', {
    state: (): BillingStateType => {
        return {
            profilePrice: undefined,
            profileDiscount: undefined,
            fetchingPrice: false,
            analysisPrice: undefined,
            analysisDiscount: undefined,
            fetchingDiscount: false,
            vouchers: [],
            fetchingVouchers: false,
            fetchingVoucher: false,
            fetchingVoucherCodes: false,
            bills: [],
            fetchingBills: false,
            transactions: [],
            fetchingTransactions: false,
        };
    },
    getters: {
        getVouchers: (state): VoucherType[] => state.vouchers,
        getProfilePrice: (state): ProfilePriceType | undefined => state.profilePrice,
        getAnalysisPrice: (state): AnalysisPriceType | undefined => state.analysisPrice,
        getBills: (state): TestBillType[] => state.bills,
    },
    actions: {
        // Clear all billing data
        async clear(): Promise<void> {
            this.analysisPrice = undefined;
            this.analysisDiscount = undefined;
            this.profilePrice = undefined;
            this.profileDiscount = undefined;
        },
        
        // Profile price and discount
        async fetchProfilePrice(profileUid: string): Promise<void> {
            if (!profileUid) {
                console.error('Invalid profile UID provided to fetchProfilePrice');
                return;
            }
            
            try {
                this.fetchingPrice = true;
                const result = await withClientQuery<GetPiceForProfileQuery, GetPiceForProfileQueryVariables>(
                    GetPiceForProfileDocument, 
                    { profileUid }, 
                    'priceForProfile'
                );
                
                if (result) {
                    this.profilePrice = result as unknown as ProfilePriceType;
                } else {
                    console.error('Invalid profile price data received:', result);
                }
            } catch (error) {
                console.error('Error fetching profile price:', error);
            } finally {
                this.fetchingPrice = false;
            }
        },
        
        async fetchProfileDiscount(profileUid: string): Promise<void> {
            if (!profileUid) {
                console.error('Invalid profile UID provided to fetchProfileDiscount');
                return;
            }
            
            try {
                this.fetchingDiscount = true;
                const result = await withClientQuery<GetDiscountForProfileQuery, GetDiscountForProfileQueryVariables>(
                    GetDiscountForProfileDocument, 
                    { profileUid }, 
                    'discountForProfile'
                );
                
                if (result) {
                    this.profileDiscount = result as unknown as ProfileDiscountType;
                } else {
                    console.error('Invalid profile discount data received:', result);
                }
            } catch (error) {
                console.error('Error fetching profile discount:', error);
            } finally {
                this.fetchingDiscount = false;
            }
        },
        
        // Analysis price and discount
        async fetchAnalysisPrice(analysisUid: string): Promise<void> {
            if (!analysisUid) {
                console.error('Invalid analysis UID provided to fetchAnalysisPrice');
                return;
            }
            
            try {
                this.fetchingPrice = true;
                const result = await withClientQuery<GetPriceForAnalysisQuery, GetPriceForAnalysisQueryVariables>(
                    GetPriceForAnalysisDocument, 
                    { analysisUid }, 
                    'priceForAnalysis'
                );
                
                if (result) {
                    this.analysisPrice = result as unknown as AnalysisPriceType;
                } else {
                    console.error('Invalid analysis price data received:', result);
                }
            } catch (error) {
                console.error('Error fetching analysis price:', error);
            } finally {
                this.fetchingPrice = false;
            }
        },
        
        async fetchAnalysisDiscount(analysisUid: string): Promise<void> {
            if (!analysisUid) {
                console.error('Invalid analysis UID provided to fetchAnalysisDiscount');
                return;
            }
            
            try {
                this.fetchingDiscount = true;
                const result = await withClientQuery<GetDiscountForAnalysisQuery, GetDiscountForAnalysisQueryVariables>(
                    GetDiscountForAnalysisDocument, 
                    { analysisUid }, 
                    'discountForAnalysis'
                );
                
                if (result) {
                    this.analysisDiscount = result as unknown as AnalysisDiscountType;
                } else {
                    console.error('Invalid analysis discount data received:', result);
                }
            } catch (error) {
                console.error('Error fetching analysis discount:', error);
            } finally {
                this.fetchingDiscount = false;
            }
        },
        
        // Vouchers
        async fetchVouchers(): Promise<void> {
            try {
                this.fetchingVouchers = true;
                const result = await withClientQuery<GetAllVouchersQuery, GetAllVouchersQueryVariables>(
                    GetAllVouchersDocument, 
                    {}, 
                    'voucherAll'
                );
                
                if (result && Array.isArray(result)) {
                    this.vouchers = result as unknown as VoucherType[];
                } else {
                    console.error('Invalid vouchers data received:', result);
                }
            } catch (error) {
                console.error('Error fetching vouchers:', error);
            } finally {
                this.fetchingVouchers = false;
            }
        },
        
        async fetchVoucherByUid(uid: string): Promise<void> {
            if (!uid) {
                console.error('Invalid voucher UID provided to fetchVoucherByUid');
                return;
            }
            
            try {
                this.fetchingVoucher = true;
                const result = await withClientQuery<GetVoucherByUidQuery, GetVoucherByUidQueryVariables>(
                    GetVoucherByUidDocument, 
                    { uid }, 
                    'voucherByUid'
                );
                
                if (result && typeof result === 'object' && 'uid' in result) {
                    const voucher = result as unknown as VoucherType;
                    const index = this.vouchers?.findIndex(item => item.uid === voucher.uid);
                    
                    if (index > -1) {
                        this.vouchers[index] = voucher;
                    } else {
                        this.vouchers = [voucher, ...this.vouchers];
                    }
                } else {
                    console.error('Invalid voucher data received:', result);
                }
            } catch (error) {
                console.error('Error fetching voucher by UID:', error);
            } finally {
                this.fetchingVoucher = false;
            }
        },
        
        async fetchVoucherCodes(voucherUid: string): Promise<void> {
            if (!voucherUid) {
                console.error('Invalid voucher UID provided to fetchVoucherCodes');
                return;
            }
            
            try {
                this.fetchingVoucherCodes = true;
                const result = await withClientQuery<GetVoucherCodesQuery, GetVoucherCodesQueryVariables>(
                    GetVoucherCodesDocument, 
                    { voucherUid }, 
                    'voucherCodes'
                );
                
                if (result && Array.isArray(result)) {
                    const codes = result as unknown as VoucherCodeType[];
                    const index = this.vouchers?.findIndex(item => item.uid === voucherUid);
                    
                    if (index > -1) {
                        this.vouchers[index] = {
                            ...this.vouchers[index],
                            codes: codes
                        };
                    }
                } else {
                    console.error('Invalid voucher codes data received:', result);
                }
            } catch (error) {
                console.error('Error fetching voucher codes:', error);
            } finally {
                this.fetchingVoucherCodes = false;
            }
        },
        
        addVoucher(voucher: VoucherType): void {
            if (!voucher?.uid) {
                console.error('Invalid voucher payload:', voucher);
                return;
            }
            
            this.vouchers = [voucher, ...this.vouchers];
        },
        
        updateVoucher(voucher: VoucherType): void {
            if (!voucher?.uid) {
                console.error('Invalid voucher payload:', voucher);
                return;
            }
            
            const index = this.vouchers?.findIndex(item => item.uid === voucher.uid);
            if (index > -1) {
                this.vouchers[index] = {
                    ...this.vouchers[index],
                    ...voucher
                };
            }
        },
        
        addVoucherCode(voucherCode: VoucherCodeType): void {
            if (!voucherCode?.uid || !voucherCode?.voucherUid) {
                console.error('Invalid voucher code payload:', voucherCode);
                return;
            }
            
            const index = this.vouchers?.findIndex(item => item.uid === voucherCode.voucherUid);
            if (index > -1) {
                this.vouchers[index] = {
                    ...this.vouchers[index],
                    codes: [voucherCode, ...(this.vouchers[index].codes || [])]
                };
            }
        },
        
        updateVoucherCode(voucherCode: VoucherCodeType): void {
            if (!voucherCode?.uid || !voucherCode?.voucherUid) {
                console.error('Invalid voucher code payload:', voucherCode);
                return;
            }
            
            const index = this.vouchers?.findIndex(item => item.uid === voucherCode.voucherUid);
            if (index > -1) {
                const codes = this.vouchers[index].codes || [];
                const codeIndex = codes?.findIndex(item => item.uid === voucherCode.uid);
                
                if (codeIndex > -1) {
                    codes[codeIndex] = { ...codes[codeIndex], ...voucherCode };
                    this.vouchers[index] = {
                        ...this.vouchers[index],
                        codes: codes
                    };
                }
            }
        },
        
        // Bills
        async fetchBillsForPatient(patientUid: string): Promise<void> {
            if (!patientUid) {
                console.error('Invalid patient UID provided to fetchBillsForPatient');
                return;
            }
            
            try {
                this.fetchingBills = true;
                const result = await withClientQuery<GetBillsForPatientQuery, GetBillsForPatientQueryVariables>(
                    GetBillsForPatientDocument, 
                    { patientUid }, 
                    'billsForPatient'
                );
                
                if (result && Array.isArray(result)) {
                    this.bills = result as unknown as TestBillType[];
                } else {
                    console.error('Invalid bills data received:', result);
                }
            } catch (error) {
                console.error('Error fetching bills for patient:', error);
            } finally {
                this.fetchingBills = false;
            }
        },

        async fetchBillsForClient(clientUid: string): Promise<void> {
            if (!clientUid) {
                console.error('Invalid client UID provided to fetchBillsForClient');
                return;
            }

            try {
                this.fetchingBills = true;
                const result = await withClientQuery<GetBillsForClientQuery, GetBillsForClientQueryVariables>(
                    GetBillsForClientDocument,
                    { clientUid },
                    'billsForClient'
                );

                if (result && Array.isArray(result)) {
                    this.bills = result as unknown as TestBillType[];
                } else {
                    console.error('Invalid bills data received:', result);
                }
            } catch (error) {
                console.error('Error fetching bills for client:', error);
            } finally {
                this.fetchingBills = false;
            }
        },

        // Transactions
        async fetchBillTransactions(billUid: string): Promise<void> {
            if (!billUid) {
                console.error('Invalid bill UID provided to fetchBillTransactions');
                return;
            }
            
            try {
                this.fetchingTransactions = true;
                this.transactions = [];
                
                const result = await withClientQuery<GetBillTransactionsQuery, GetBillTransactionsQueryVariables>(
                    GetBillTransactionsDocument, 
                    { billUid }, 
                    'billTransactions'
                );
                
                if (result && Array.isArray(result)) {
                    this.transactions = result as unknown as TestBillTransactionType[];
                } else {
                    console.error('Invalid bill transactions data received:', result);
                }
            } catch (error) {
                console.error('Error fetching bill transactions:', error);
            } finally {
                this.fetchingTransactions = false;
            }
        },
        
        addTransaction(transaction: TestBillTransactionType): void {
            if (!transaction?.uid) {
                console.error('Invalid transaction payload:', transaction);
                return;
            }
            
            this.transactions = [transaction, ...this.transactions];
        },
        
        updateTransaction(transaction: TestBillTransactionType): void {
            if (!transaction?.uid) {
                console.error('Invalid transaction payload:', transaction);
                return;
            }
            
            const index = this.transactions?.findIndex(item => item.uid === transaction.uid);
            if (index > -1) {
                this.transactions[index] = {
                    ...this.transactions[index],
                    ...transaction
                };
            }
        }
    },
});