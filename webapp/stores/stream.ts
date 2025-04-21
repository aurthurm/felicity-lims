import { defineStore } from 'pinia';
import { urqlClient } from '@/urql';
import { pipe, subscribe } from 'wonka';
import { useWorksheetStore } from './worksheet';
import { useSampleStore } from './sample';
import useAnalyticsComposable from '@/composables/analytics';
import { GetSystemActivityDocument, GetSystemActivitySubscription, GetSystemActivitySubscriptionVariables } from '@/graphql/operations/stream.subscriptions';
import { ActivityStreamType, WorkSheetType, SampleType } from '@/types/gql';


type StreamStateType = {
    streams: ActivityStreamType[];
}

export const useStreamStore = defineStore('stream', {
    state: (): StreamStateType => ({
        streams: []
    }),
    getters: {
        getStreams: (state): ActivityStreamType[] => state.streams,
    },
    actions: {
        addStream(payload: ActivityStreamType): void {
            if (!payload?.actionObjectType || !payload?.actionObject) {
                console.error('Invalid stream payload:', payload);
                return;
            }

            const { updateReport } = useAnalyticsComposable();
            const wsStore = useWorksheetStore();
            const sampleStore = useSampleStore();

            this.streams.unshift(payload);

            try {
                switch (payload.actionObjectType) {
                    case 'SampleType':
                        sampleStore.updateSampleStatus(payload.actionObject as SampleType);
                        break;
                    case 'WorkSheetType':
                        wsStore.updateWorksheetStatus(payload.actionObject as WorkSheetType);
                        break;
                    case 'ReportMetaType':
                        updateReport(payload.actionObject as any); // ReportMetaType
                        break;
                    case 'AnalysisResultType':
                        sampleStore.updateAnalysesResultsStatus([payload.actionObject]);
                        wsStore.updateWorksheetResultsStatus([payload.actionObject]);
                        break;
                    default:
                        console.warn('Unknown action object type:', payload.actionObjectType);
                }
            } catch (error) {
                console.error('Error processing stream payload:', error);
            }
        },

        subscribeToActivityStream(): () => void {
            return pipe(
                urqlClient.subscription<GetSystemActivitySubscription, GetSystemActivitySubscriptionVariables>(
                    GetSystemActivityDocument, 
                    {}
                ),
                subscribe(result => {
                    if (result.error) {
                        console.error('Stream subscription error:', result.error);
                        return;
                    }

                    if (result.data?.latestActivity) {
                        this.addStream(result.data.latestActivity as ActivityStreamType);
                    }
                })
            ).unsubscribe;
        },
    },
});
