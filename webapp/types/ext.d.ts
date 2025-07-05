import { AnalysisResultType, NoticeType, SampleType, StockOrderProductType } from "./gql";


export type ExtNoticeType = NoticeType & {
    dayToExpiration: number;
    expired: boolean;
    status: string;
}

export type ExtStockOrderProductType = StockOrderProductType & {
    issue: number;
}


export type ExtSampleType = SampleType & {
    checked: boolean;
}
