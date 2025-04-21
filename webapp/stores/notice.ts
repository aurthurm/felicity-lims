import { defineStore } from 'pinia';
import { ExtNoticeType } from '@/types/ext';
import { subtractDates } from '@/utils';

import useApiUtil from '@/composables/api_util';
import useNotifyToast from '@/composables/alert_toast';
import { GetNoticesByCreatorUidDocument, GetNoticesByCreatorUidQuery, GetNoticesByCreatorUidQueryVariables } from '@/graphql/operations/notice.queries';

const { withClientQuery } = useApiUtil();
const { toastError } = useNotifyToast();

export const useNoticeStore = defineStore('notice', {
    state: () =>
        ({
            notices: [],
            fetchingNotices: false,
            filterBy: 'all',
            filters: ['all', 'active', 'expired'],
        } as {
            notices: ExtNoticeType[];
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
            try {
                this.fetchingNotices = true;
                const payload = await withClientQuery<GetNoticesByCreatorUidQuery, GetNoticesByCreatorUidQueryVariables>(
                    GetNoticesByCreatorUidDocument, 
                    { uid }, 
                    'noticesByCreator'
                );
                
                // Check if payload is an array before mapping
                if (Array.isArray(payload)) {
                    // Cast each notice to ExtNoticeType before modifying
                    this.notices = payload.map(n => modifyExpiry(n as unknown as ExtNoticeType)).sort((a, b) => a.expiry > b.expiry ? 1 : -1);
                } else {
                    this.notices = [];
                    console.error('Expected array of notices but got:', payload);
                }
            } catch (error) {
                if (error instanceof Error) {
                    toastError(error.message);
                }
                this.notices = [];
            } finally {
                this.fetchingNotices = false;
            }
        },
        
        addNotice(notice: ExtNoticeType) {
            this.notices?.unshift(modifyExpiry(notice));
        },
        
        updateNotice(notice: ExtNoticeType) {
            const index = this.notices?.findIndex(x => x.uid === notice.uid);
            if (index > -1) this.notices[index] = modifyExpiry(notice);
        },
        
        deleteNotice(notice: ExtNoticeType) {
            const index = this.notices?.findIndex(x => x.uid === notice.uid);
            if (index > -1) this.notices?.splice(index, 1);
        },
    },
});

const hasExpired = (notice: ExtNoticeType) => new Date() > new Date(notice.expiry);

const daysToExpiry = (notice: ExtNoticeType) => subtractDates(new Date(), new Date(notice.expiry));

const modifyExpiry = (notice: ExtNoticeType): ExtNoticeType => {
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
