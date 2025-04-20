import { defineStore } from 'pinia';
import { INotice } from '@/models/notice';
import { subtractDates } from '@/utils';

import  useApiUtil  from '@/composables/api_util';
import { GetNoticesByCreatorUidDocument, GetNoticesByCreatorUidQuery, GetNoticesByCreatorUidQueryVariables } from '@/graphql/operations/notice.queries';

const { withClientQuery } = useApiUtil();

export const useNoticeStore = defineStore('notice', {
    state: () =>
        ({
            notices: [],
            fetchingNotices: false,
            filterBy: 'all',
            filters: ['all', 'active', 'expired'],
        } as {
            notices: INotice[];
            fetchingNotices: boolean;
            filterBy: string;
            filters: string[];
        }),
    getters: {
        getNotices: state => state.notices,
        getActiveNotices: state => state.notices?.filter(n => !n.expired),
        getMyNotices: state => uid => state.notices?.filter(n => n.createdByUid === uid),
        getFilterBy: state => state.filterBy,
        getFilters: state => state.filters,
    },
    actions: {
        async fetchMyNotices(uid: string) {
            this.fetchingNotices = true;
            await withClientQuery<GetNoticesByCreatorUidQuery, GetNoticesByCreatorUidQueryVariables>(GetNoticesByCreatorUidDocument, { uid }, 'noticesByCreator')
                .then(payload => {
                    this.fetchingNotices = false;
                    this.notices = payload?.map(n => modifyExpiry(n)).sort((a, b) => a.expiry > b.expiry ? 1 : -1);
                })
                .catch(err => (this.fetchingNotices = false));
        },
        addNotice(notice: INotice) {
            this.notices?.unshift(modifyExpiry(notice));
        },
        updateNotice(notice: INotice) {
            const index = this.notices?.findIndex(x => x.uid === notice.uid);
            if (index > -1) this.notices[index] = modifyExpiry(notice);
        },
        deleteNotice(notice: INotice) {
            const index = this.notices?.findIndex(x => x.uid === notice.uid);
            if (index > -1) this.notices?.splice(index, 1);
        },
    },
});

const hasExpired = (notice: INotice) => new Date() > new Date(notice.expiry);

const daysToExpiry = (notice: INotice) => subtractDates(new Date(), new Date(notice.expiry));

const modifyExpiry = (notice: INotice): INotice => {
    const expired = hasExpired(notice);
    const days = +daysToExpiry(notice);
    notice.expired = expired;
    notice.dayToExpiration = days;
    if (expired === true) {
        if (days === 0) {
            notice.status = 'expired today';
        } else {
            notice.status = 'expired ' + days + ' days ago';
        }
    } else {
        if (days === 0) {
            notice.status = 'expiring today';
        } else {
            notice.status = 'expiring in ' + days + ' days';
        }
    }
    return notice;
};
