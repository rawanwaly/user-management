export type SortDirection = 'asc' | 'desc' | null;

export interface GridRequest {
  page: number;
  pageSize: number;
  search?: string;
  sortColumn?: string;
  sortDirection?: SortDirection;
}

export interface GridResponse<T> {
  data: T[];
  totalRecords: number;
}

export interface GridColumn {
  field: string;          // model property name
  header: string;         // shown label
  sortable?: boolean;
  width?: string;         // e.g. '120px' or '10%'
  type?: 'text'|'number'|'email'|'checkbox'|'actions'|'date';
  visible?: boolean;
  align?: 'left'|'center'|'right';
}

export interface GridConfig {
  columns: GridColumn[];
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  serverMode?: boolean;         // true => ask server for pages
  selectionMode?: 'page'|'all'; // which "select all" behavior
  checkboxSelection?: boolean;
    searchTerm?: string;   // 👈 new

}


