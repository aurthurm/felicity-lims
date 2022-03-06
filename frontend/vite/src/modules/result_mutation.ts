import useNotifyToast from "./alert_toast";
import { IAnalysisResult } from "../models/analysis";

const { toastWarning } = useNotifyToast();

export default function useResultMutationComposable(){

    const mutateResult = (result: IAnalysisResult): IAnalysisResult => {
        if(!result.result) return result;

        const analysis = result.analysis;
        const correctionFactors = analysis?.correctionFactors
        const specifications = analysis?.specifications
        const detectionLimits = analysis?.detectionLimits
        const uncertainties = analysis?.uncertainties

        if(typeof(+result?.result!) === "number") {
            // Corection factor
            correctionFactors?.forEach(cf => {
                if(cf?.instrumentUid == result?.instrumentUid && cf.methodUid == result.methodUid) {
                    result.result = "" + (+result?.result! * +cf?.factor!);
                } 
            })

            // Specifications: Take more priority than DL
            specifications?.forEach(spec => {
                // Min
                if(+result?.result! < +spec?.minWarn!) {
                    result.result = spec.minReport;
                } else if (+result?.result! < +spec?.min!){
                    result.result = result.result;
                }
                // Max
                if(+result?.result! > +spec?.maxWarn!) {
                    result.result = spec.maxReport;
                }
                if(+result?.result! > +spec?.max!) {
                    result.result = result.result;
                }
            })

            // Detection Limit Check
            detectionLimits?.forEach(dLim => {
                if(+result?.result! < +dLim?.lowerLimit!) {
                    result.result = "> " + dLim?.lowerLimit;
                }
                if(+result?.result! <= +dLim?.upperLimit!) {
                    result.result = "> " + dLim?.upperLimit;
                }
            })

            // uncertainty
            if(typeof(+result?.result!) === "number") {
                uncertainties?.forEach(uncert => {
                    if(+result?.result! >= +uncert?.min! && +result?.result! <= +uncert?.max!) {
                        result.result = "+/- " + result.result;
                    }
                })
            }

        } else if(typeof(result?.result) === "string") {
            specifications?.forEach(spec => {
                if(spec?.warnValues!.includes(result?.result!)) {
                    result.result = spec.warnReport;
                }
            })
        }  

        return result
    }

    const mutateResults = (results: IAnalysisResult[]):IAnalysisResult[] => {
        return results?.map(result => mutateResult(result))
    }

    return { mutateResults, mutateResult }
}
