import { Observable } from 'rxjs';

export type SortDirection = 'asc' | 'desc' | null;

export interface GridRequest<T = any> {
  page: number;
  pageSize: number;
  search?: string;
  sortColumn?: keyof T;
  sortDirection?: SortDirection;
}

export interface GridResponse<T> {
  data: T[];
  totalRecords: number;
}

export interface GridColumn {
  field: string;
  header: string;
  sortable?: boolean;
  width?: string;
  type?: 'text' | 'number' | 'email' | 'checkbox' | 'actions' | 'date';
  template?: any;
  align?: 'left' | 'center' | 'right';
}
export interface GridConfig<T = any> {
  columns: GridColumn[];
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  serverMode?: boolean;
  selectionMode?: 'page' | 'all';
  checkboxSelection?: boolean;
  searchTerm?: string;
  actions?: GridAction[];
  reloadFlag?: number;
  fetchPagedData?: (req: GridRequest) => Observable<GridResponse<T>>;
  fetchAllData?: () => Observable<T[]>;
  fetchAllIds?: (search: string) => Observable<number[]>;
  onBulkDeactivate?: (ids: number[]) => void;
  onBulkActivate?: (ids: number[]) => void;
  onBulkExport?: (ids: number[]) => void;
  rowClass?: (row: T) => string;
}
export interface GridAction {
  label: string | ((row: any) => string);
  type?:
    | 'primary'
    | 'danger'
    | 'success'
    | 'default'
    | ((row: any) => 'primary' | 'danger' | 'success' | 'default');
  onClick: (row: any) => void;
}
