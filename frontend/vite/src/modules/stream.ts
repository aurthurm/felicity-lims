import { reactive, toRefs } from "vue"
import { urqlClient } from '../urql';
import {
    SUBSCRIBE_TO_ACTIVITY_STREAM
} from '../graphql/stream.subscriptions';
import useNotifyToast from "./alert_toast";
import { INotification } from "../models/notification";
import { IUser } from "../models/auth";

const { gqlResponseHandler } = useNotifyToast();

const _state = reactive({
    streams: [] as INotification[],
})

export default function useStreamComposable(){

    return {
        state: toRefs(_state), 
        initSubscriptions,
        setStreams, _myStreams, _addStream, _viewStream   
    }
}

const setStreams = (streams: INotification[]) =>  _state.streams = streams

const _myStreams = (uid: number) => _state.streams.filter(s => s.uid === uid)

const _addStream = (stream: INotification) => {
    const index = _state.streams.findIndex(s => s.uid === stream.uid);
    if(index > -1) _state.streams[index] = stream;
}

const _viewStream = (stream: INotification, viewer: IUser) => {
    //
}


const initSubscriptions = () =>  {
    console.log("initSubscriptions")
    urqlClient.subscription(SUBSCRIBE_TO_ACTIVITY_STREAM, (messages = [], res: any) => {
        console.log("return initSubscriptions .....")
        console.log([res.newMessages, ...messages])
    })
}  