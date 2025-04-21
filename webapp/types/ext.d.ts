import { NoticeType } from "./gql";


export type ExtNoticeType = NoticeType & {
    dayToExpiration: number;
    expired: boolean;
    status: string;
}