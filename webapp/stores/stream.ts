import { defineStore } from 'pinia';
import { urqlClient } from '@/urql';
import { SUBSCRIBE_TO_ACTIVITY_STREAM } from '@/graphql/operations/stream.subscriptions';
import { pipe, subscribe } from 'wonka';
import { useWorksheetStore } from './worksheet';
import { useSampleStore } from './sample';
import useAnalyticsComposable from '@/composables/analytics';

export const useStreamStore = defineStore('stream', {
    state: () =>
        ({
            streams: [],
        } as {
            streams: any[];
        }),
    getters: {
        getStreams: state => state.streams,
    },
    actions: {
        addStream(payload) {
            const { updateReport } = useAnalyticsComposable();
            const wsStore = useWorksheetStore();
            const sampleStore = useSampleStore();

            this.streams?.unshift(payload);

            if (payload.actionObjectType === 'sample') {
                sampleStore.updateSampleStatus(payload.actionObject);
            }

            if (payload.actionObjectType === 'worksheet') {
                wsStore.updateWorksheetStatus(payload.actionObject);
            }

            if (payload.actionObjectType === 'report') {
                updateReport(payload.actionObject);
            }

            if (payload.actionObjectType === 'result') {
                sampleStore.updateAnalysesResultsStatus([payload.actionObject]);
                wsStore.updateWorksheetResultsStatus([payload.actionObject]);
                // wsStore.updateAnalysesResults([payload.actionObject])
            }
        },
        subscribeToActivityStream() {
            pipe(
                urqlClient.subscription(SUBSCRIBE_TO_ACTIVITY_STREAM, {}),
                subscribe(result => {
                    if (result.data?.latestActivity) {
                        this.addStream(result.data?.latestActivity);
                    } else {
                    }
                })
            ).unsubscribe;
        },
    },
});
