import { AnalysisResultType } from "./gql";

// Extended type for AnalysisResultType
export type ExtAnalysisResultType = AnalysisResultType & {
    editResult?: string;
    checked?: boolean;
    editable?: boolean;
}