export interface PaginationInterface {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryPaginationInterface {
  page?: number;
  limit?: number;
  search?: string;
}
