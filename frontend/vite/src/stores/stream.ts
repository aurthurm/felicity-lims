import { defineStore } from 'pinia'
import { urqlClient } from '../urql';
import {
    SUBSCRIBE_TO_ACTIVITY_STREAM
} from '../graphql/stream.subscriptions';
import { pipe, subscribe } from 'wonka';


export const useStreamStore = defineStore('stream', { 
    state: () => ({
        streams: [],
    } as {
        streams: any[]
    }),
    getters: {
        getStreams: (state) => state.streams
    },
    actions: {
        addStream(payload){
            this.streams?.unshift(payload)
        },
        subscribeToActivityStream(){
            console.log("subscribeToActivityStream")
            pipe(
                urqlClient.subscription(SUBSCRIBE_TO_ACTIVITY_STREAM, { }),
                subscribe(result => (this.addStream(result.data?.latestStream)))
              ).unsubscribe;
        }
    }
})