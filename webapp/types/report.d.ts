import { AnalysisType, UserType } from "./gql";

export type ReportListingType = {
    uid?: string;
    report_type?: string;
    created_at?: string;
    created_by_uid?: string;
    created_by?: UserType;
    period_start?: string;
    period_end?: string;
    date_column?: string;
    status?: string;
    analyses?: Array<AnalysisType>;
    analyses_uids?: Array<number>;
    sample_states?: Array<string>;
    location?: string;
}