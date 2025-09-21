import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { GridConfig, GridRequest, GridResponse } from '../models/grid.models';

@Component({
  selector: 'app-custom-grid',
  templateUrl: './custom-grid.component.html',
  styleUrls: ['./custom-grid.component.css'],
})
export class CustomGridComponent<T extends { id: number }> implements OnInit {
  @Input() config!: GridConfig<T>;

  data: T[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  sortColumn?: keyof T;
  sortDirection: 'asc' | 'desc' | null = null;
  searchTerm = '';

  selectedIds = new Set<number>();
  selectAllCurrentPage = false;

  Math = Math;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']?.currentValue?.reloadFlag) {
      this.loadData();
    }
  }

  ngOnInit(): void {
    this.pageSize = this.config.defaultPageSize || 10;
    this.loadData();
  }
  onDeactivateSelected() {
    if (this.config.onBulkDeactivate) {
      this.config.onBulkDeactivate([...this.selectedIds]);
    }
    this.selectedIds.clear();
    this.syncCheckboxState();
  }
  onBulkExport() {
    if (this.config.onBulkExport) {
      this.config.onBulkExport(Array.from(this.selectedIds));
    }
  }
  onClearSelection() {
    this.selectedIds.clear();
    this.syncCheckboxState();
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.config.searchTerm = this.searchTerm;
    this.loadData();
  }
  onPageSizeChange() {
    this.currentPage = 1;
    this.loadData();
  }
  loadData(): void {
    const req: GridRequest = {
      page: this.currentPage,
      pageSize: this.pageSize,
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
      search: this.config.searchTerm || '',
    };

    if (this.config.serverMode) {
      this.config.fetchPagedData?.(req).subscribe((res: GridResponse<any>) => {
        this.data = res.data;
        this.totalRecords = res.totalRecords;
        this.syncCheckboxState();
      });
    } else {
      this.config.fetchAllData?.().subscribe((allItems) => {
        let items = [...allItems];

        if (this.config.searchTerm) {
          const term = this.config.searchTerm.toLowerCase();
          items = items.filter((u) =>
            Object.values(u).some(
              (v) => v && v.toString().toLowerCase().includes(term)
            )
          );
        }

        this.totalRecords = items.length;

        if (this.sortColumn) {
          items = items.sort((a, b) => {
            const valA = (a as any)[this.sortColumn!];
            const valB = (b as any)[this.sortColumn!];
            return this.sortDirection === 'asc'
              ? valA?.toString().localeCompare(valB?.toString())
              : valB?.toString().localeCompare(valA?.toString());
          });
        }

        this.data = items.slice(
          (this.currentPage - 1) * this.pageSize,
          this.currentPage * this.pageSize
        );

        this.syncCheckboxState();
      });
    }
  }

  onSort(col: string) {
    if (this.sortColumn === col) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = col as keyof T;
      this.sortDirection = 'asc';
    }
    this.loadData();
  }

  onPageChange(page: number) {
    if (page < 1 || page > Math.ceil(this.totalRecords / this.pageSize)) return;
    this.currentPage = page;
    this.loadData();
  }

  onSelectAllChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.toggleSelectAllCurrentPage(input.checked);
  }

  onSelectRowChange(id: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.toggleSelectRow(id, input.checked);
  }

  toggleSelectAllCurrentPage(checked: boolean) {
    this.selectAllCurrentPage = checked;

    if (this.config.selectionMode === 'all') {
      if (checked) {
        if (this.config.serverMode) {
          this.config
            .fetchAllIds?.(this.config.searchTerm || '')
            .subscribe((ids) => {
              ids.forEach((id) => this.selectedIds.add(id));
            });
        } else {
          this.config.fetchAllData?.().subscribe((allItems) => {
            allItems.forEach((u) => this.selectedIds.add((u as any).id));
          });
        }
      } else {
        this.selectedIds.clear();
      }
    } else {
      if (checked) {
        this.data.forEach((u) => this.selectedIds.add((u as any).id));
      } else {
        this.data.forEach((u) => this.selectedIds.delete((u as any).id));
      }
    }
  }
  onActivateSelected() {
    if (
      confirm(
        `Are you sure you want to activate ${this.selectedIds.size} user(s)?`
      )
    ) {
      if (this.config.onBulkActivate) {
        this.config.onBulkActivate([...this.selectedIds]);
      }
      this.selectedIds.clear();
      this.syncCheckboxState();
    }
  }

  toggleSelectRow(id: number, checked: boolean) {
    if (checked) {
      this.selectedIds.add(id);
    } else {
      this.selectedIds.delete(id);
    }
    this.syncCheckboxState();
  }

  getCellValue(row: any, field: string): any {
    return row[field as keyof typeof row];
  }

  get anySelected(): boolean {
    return this.selectedIds.size > 0;
  }

  private syncCheckboxState() {
    this.selectAllCurrentPage = this.data.every((u) =>
      this.selectedIds.has((u as any).id)
    );
  }
}
