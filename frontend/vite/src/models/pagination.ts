interface IPageInfo {
  endCursor?: string,
  hasNextPage?: boolean,
  hasPreviousPage?:  boolean,
  startCursor?: string,
}

export interface IPagination {
  items?: any[],
  totalCount?: number,
  pageInfo?: IPageInfo,
}
