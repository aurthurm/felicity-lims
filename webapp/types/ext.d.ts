import { NoticeType, StockOrderProductType } from "./gql";


export type ExtNoticeType = NoticeType & {
    dayToExpiration: number;
    expired: boolean;
    status: string;
}

export type ExtStockOrderProductType = StockOrderProductType & {
    issue: number;
}