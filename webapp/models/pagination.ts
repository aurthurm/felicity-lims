export interface IPageInfo {
    endCursor?: string;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    startCursor?: string;
}

export interface IPagination<T> {
    items?: T[];
    totalCount?: number;
    pageInfo?: IPageInfo;
}

export interface IPaginationMeta {
    totalCount?: number;
    pageInfo?: IPageInfo;
}
