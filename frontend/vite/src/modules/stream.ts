import { reactive, toRefs } from "vue"
import { urqlClient } from '../urql';
import {
    SUBSCRIBE_TO_ACTIVITY_STREAM
} from '../graphql/stream.subscriptions';
import { INotification } from "../models/notification";
import { IUser } from "../models/auth";
import { pipe, subscribe } from 'wonka';


const _state = reactive({
    streams: [] as INotification[],
})

export default function useStreamComposable(){

    return {
        ...toRefs(_state), 
        initSubscriptions,
        setStreams, myStreams, addStream, viewStream   
    }
}

const setStreams = (streams: INotification[]) =>  _state.streams = streams

const myStreams = (uid: number) => _state.streams.filter(s => s.uid === uid)


const addStream = (stream: INotification) =>  _state.streams?.unshift(stream)

const viewStream = (stream: INotification, viewer: IUser) => {
    //
}


const initSubscriptions = () =>  {
    console.log("initSubscriptions")
    pipe(
        urqlClient.subscription(SUBSCRIBE_TO_ACTIVITY_STREAM, { }),
        subscribe(result => (console.log('result', result),addStream(result.data?.latestStream),console.log(_state)))
      ).unsubscribe;
}  