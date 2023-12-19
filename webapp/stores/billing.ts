import { defineStore } from 'pinia';
import { 
    GET_PRICE_FOR_PROFILE, GET_DISCOUNT_FOR_PROFILE, 
    GET_PRICE_FOR_ANALYSIS, GET_DISCOUNT_FOR_ANALYSIS,
    GET_ALL_VOUCHERS, GET_VOUCHER_BY_UID, GET_VOUCHER_CODES, GET_BILLS_FOR_PATIENT, GET_BILL_TRANSACTIONS
} from '../graphql/operations/billing.queries'

import { useApiUtil } from '../composables';
import { 
    IAnalysisDiscount, IAnalysisPrice, IProfileDiscount, 
    IProfilePrice, IVoucher, IVoucherCode, ITestBill, ITestBillTransaction 
} from '../models/billing';

const { withClientQuery } = useApiUtil();


export const useBillingStore = defineStore('billing', {
    state: () =>
        ({
            profilePrice: undefined,
            profileDiscount: undefined,
            fetchingPrice: false,
            analysisPrice: undefined,
            analyisDiscount: undefined,
            fetchingDiscount: false,
            vouchers: [], 
            fetchingVouchers: false,
            fetchingVoucher: false,
            fetchingVoucherCodes: false,
            bills: [],
            fetchingBills: false,
            transactions: [],
            fetchingTransactions: false,
        } as {
            profilePrice?: IProfilePrice,
            profileDiscount?: IProfileDiscount,
            fetchingPrice: boolean,
            analysisPrice?: IAnalysisPrice,
            analyisDiscount?: IAnalysisDiscount,
            fetchingDiscount: boolean,
            vouchers: IVoucher[], 
            fetchingVouchers: boolean,
            fetchingVoucher: boolean,
            fetchingVoucherCodes: boolean,
            bills: ITestBill[],
            fetchingBills: boolean,
            transactions: ITestBillTransaction[],
            fetchingTransactions: boolean,
        }),
    getters: {
        getVouchers: state => state.vouchers,
        getProfilePrice: state => state.profilePrice,
        getAnalysisPrice: state => state.analysisPrice,
        getBills: state => state.bills,
    },
    actions: {
        // clear
        async clear(): Promise<void> {
            this.analysisPrice = undefined;
            this.analyisDiscount = undefined;
            this.profilePrice = undefined;
            this.profileDiscount = undefined;
        },
        // Profiles
        async fetchProfilePrice(profileUid: string) {
            this.fetchingPrice = true;
            await withClientQuery(GET_PRICE_FOR_PROFILE, { profileUid }, 'priceForProfile')
                .then(payload => {
                    this.fetchingPrice = false;
                    this.profilePrice = payload;
                })
                .catch(err => (this.fetchingPrice = false));
        },
        async fetchProfileDiscount(profileUid: string) {
            this.fetchingDiscount = true;
            await withClientQuery(GET_DISCOUNT_FOR_PROFILE, { profileUid }, 'discountForProfile')
                .then(payload => {
                    this.fetchingDiscount = false;
                    this.profileDiscount = payload;
                })
                .catch(err => (this.fetchingDiscount = false));
        },
        // Analyses
        async fetchAnalysisPrice(analysisUid: string) {
            this.fetchingPrice = true;
            await withClientQuery(GET_PRICE_FOR_ANALYSIS, { analysisUid }, 'priceForAnalysis')
                .then(payload => {
                    this.fetchingPrice = false;
                    this.analysisPrice = payload;
                })
                .catch(err => (this.fetchingPrice = false));
        },
        async fetchAnalysisDiscount(analysisUid: string) {
            this.fetchingDiscount = true;
            await withClientQuery(GET_DISCOUNT_FOR_ANALYSIS, { analysisUid }, 'discountForAnalysis')
                .then(payload => {
                    this.fetchingDiscount = false;
                    this.analyisDiscount = payload;
                })
                .catch(err => (this.fetchingDiscount = false));
        },
        // Vouchers
        async fetchVouchers() {
            this.fetchingVouchers = true;
            await withClientQuery(GET_ALL_VOUCHERS, {}, 'voucherAll')
                .then(payload => {
                    this.fetchingVouchers = false;
                    this.vouchers = payload;
                })
                .catch(err => (this.fetchingVouchers = false));
        },
        async fetchVoucherbyUid(uid: string) {
            this.fetchingVoucher = true;
            await withClientQuery(GET_VOUCHER_BY_UID, { uid }, 'voucherAll')
                .then(payload => {
                    this.fetchingVoucher = false;
                    this.vouchers = payload;
                    const index = this.vouchers?.findIndex(item => item.uid === payload.uid);
                    if (index > -1) {
                        this.vouchers[index] = payload;
                    } else {
                        this.vouchers = [payload, ...this.vouchers];
                    }
                })
                .catch(err => (this.fetchingVoucher = false));
        },
        async fetchVoucherCodes(voucherUid: string) {
            this.fetchingVoucherCodes = true;
            await withClientQuery(GET_VOUCHER_CODES, { voucherUid }, 'voucherCodes')
                .then(payload => {
                    this.fetchingVoucherCodes = false;
                    const index = this.vouchers?.findIndex(item => item.uid === payload.uid);
                    if (index > -1) {
                        this.vouchers[index] = {
                            ...this.vouchers[index],
                            codes: payload
                        };
                    }
                })
                .catch(err => (this.fetchingVoucherCodes = false));
        },
        async addVoucher(voucher: IVoucher) {
            this.vouchers = [voucher, ...this.vouchers]
        },
        async updateVoucher(voucher: IVoucher) {  
            const index = this.vouchers?.findIndex(item => item.uid === voucher.uid);
            if (index > -1) {
                this.vouchers[index] = {
                    ...this.vouchers[index],
                    ...voucher
                };
            }
        },
        async addVoucherCode(voucherCode: IVoucherCode) {
            const index = this.vouchers?.findIndex(item => item.uid === voucherCode.voucherUid);
            if (index > -1) {
                this.vouchers[index] = {
                    ...this.vouchers[index],
                    codes: [voucherCode, ...this.vouchers[index].codes]
                };
            }
        },
        async updateVoucherCode(voucherCode: IVoucherCode) {  
            const index = this.vouchers?.findIndex(item => item.uid === voucherCode.voucherUid);
            const codes =this.vouchers[index].codes
            const ci = codes?.findIndex(item => item.uid === voucherCode.uid);
            if (index > -1 && ci > -1) {
                codes[ci] = {...codes[ci], ...voucherCode}
                this.vouchers[index] = {
                    ...this.vouchers[index],
                    codes: codes
                };
            }
        },
        // Bills
        async fetchBillsForPatient(patientUid: string) {
            this.fetchingBills = true;
            await withClientQuery(GET_BILLS_FOR_PATIENT, { patientUid }, 'billsForPatient')
                .then(payload => {
                    this.fetchingBills = false;
                    this.bills = payload;
                })
                .catch(err => (this.fetchingBills = false));
        },
        // Transactions
        async fetchBillTransactions(billUid: string) {
            this.fetchingTransactions = true;
            this.transactions = [];
            await withClientQuery(GET_BILL_TRANSACTIONS, { billUid }, 'billTransactions')
                .then(payload => {
                    this.fetchingTransactions = false;
                    this.transactions = payload;
                })
                .catch(err => (this.fetchingTransactions = false));
        },
        async addTransaction(transaction: ITestBillTransaction) {
            this.transactions = [transaction, ...this.transactions]
        }
    },
});