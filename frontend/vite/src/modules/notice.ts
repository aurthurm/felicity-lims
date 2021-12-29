import { reactive, toRefs } from "vue"
import { urqlClient } from '../urql';
import {
  GET_NOTICES_BY_CREATOR
} from '../graphql/notice.queries';
import { INotice } from "../models/notice"
import useNotifyToast from "./alert_toast";
import { subtractDates } from  '../utils'

const { gqlResponseHandler } = useNotifyToast();

const _state = reactive({
    notices: [] as INotice[],
    filterBy: "all",
    filters: ['all', 'active', 'expired']
})

export default function useNoticeComposable(){

    const fetchMyNotices = async (uid: number) => {
        await urqlClient
          .query( GET_NOTICES_BY_CREATOR, { uid })
          .toPromise()
          .then((res) => {
            const data = gqlResponseHandler(res)
            setNotices(data?.noticesByCreator)
          });
    }

    return {
        state: _state, 
        _myNotices,
        fetchMyNotices,
        _addNotice, _updateNotice, _deleteNotice
    }
}

const setNotices = (notices: INotice[]) => {
    notices?.forEach(n => modifyExpiry(n))
    _state.notices = notices;
}

const _addNotice = (notice: INotice) => _state.notices.push(modifyExpiry(notice))

const _myNotices = (uid: number) => _state.notices.filter(n => n.createdByUid === uid)

const _updateNotice = (notice: INotice) => {
    const index = _state.notices.findIndex(x => x.uid === notice.uid);
    if(index > -1) _state.notices[index] = modifyExpiry(notice);
}

const _deleteNotice = (notice: INotice) => {
    const index = _state.notices.findIndex(x => x.uid === notice.uid);
    if(index > -1) _state.notices.splice(index,1);
}

const hasExpired = (notice: INotice) => new Date() > new Date(notice.expiry) 

const daysToExpiry = (notice: INotice) => subtractDates(new Date(), new Date(notice.expiry))

const modifyExpiry = (notice: INotice): INotice => {
    const expired = hasExpired(notice);
    const days = +daysToExpiry(notice);
    notice.expired = expired
    notice.dayToExpiration = days
    if(expired === true) {
        if(days === 0){
            notice.status = "expired today"
        } else {
            notice.status = "expired " + days + " days ago"
        }
    } else {
        if(days === 0){
            notice.status = "expiring today"
        } else {
            notice.status = "expiring in " + days + " days"
        }
    }
    return notice;
}