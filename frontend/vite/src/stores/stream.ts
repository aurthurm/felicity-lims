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
            this.streams.unshift(payload)
        },
        subscribeToActivityStream(){
            pipe(
                urqlClient.subscription(SUBSCRIBE_TO_ACTIVITY_STREAM, { }),
                subscribe(result => (console.log('result', result), this.addStream(result.data?.latestStream), console.log(this.streams)))
              ).unsubscribe;
        }
    }
})