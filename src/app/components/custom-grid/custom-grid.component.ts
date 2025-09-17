import { Component, Input, OnInit } from '@angular/core';
import { GridConfig, GridRequest, GridResponse } from '../models/grid.models';
import { User } from 'src/app/pages/users/user.model';
import { UserService } from 'src/app/pages/users/user.service';

@Component({
  selector: 'app-custom-grid',
  templateUrl: './custom-grid.component.html',
  styleUrls: ['./custom-grid.component.css']
})
export class CustomGridComponent implements OnInit {
  @Input() config!: GridConfig;

  data: User[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  sortColumn: string | undefined;
  sortDirection: 'asc' | 'desc' | null = null;
  searchTerm = '';   

  // Checkbox selection
  selectedIds = new Set<number>();
  selectAllCurrentPage = false;

  // expose Math so template can use Math.ceil()
  Math = Math;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
      console.log('Server mode?', this.config.serverMode); // 👈 check value
    this.pageSize = this.config.defaultPageSize || 10;
    this.loadData();
  }
  onSearchChange(): void {
    this.currentPage = 1;         // reset to first page
    this.config.searchTerm = this.searchTerm;
    this.loadData();
  }

loadData(): void {
  const req: GridRequest = {
    page: this.currentPage,
    pageSize: this.pageSize,
    sortColumn: this.sortColumn,
    sortDirection: this.sortDirection,
    search: this.config.searchTerm || ''   // 👈 include search
  };

  if (this.config.serverMode) {
    // ✅ Server-side search
    this.userService.getPagedUsers(req).subscribe((res: GridResponse<User>) => {
      this.data = res.data;
      this.totalRecords = res.totalRecords;
      this.syncCheckboxState();
    });
  } else {
    // ✅ Client-side search
    this.userService.getAll().subscribe(users => {
      // Apply search
      if (this.config.searchTerm) {
        const term = this.config.searchTerm.toLowerCase();
        users = users.filter(u =>
          Object.values(u).some(v =>
            v && v.toString().toLowerCase().includes(term)
          )
        );
      }

      this.totalRecords = users.length;

      // Apply sorting
      if (this.sortColumn) {
        users = [...users].sort((a, b) => {
          const valA = (a as any)[this.sortColumn!];
          const valB = (b as any)[this.sortColumn!];
          if (valA == null) return -1;
          if (valB == null) return 1;
          return this.sortDirection === 'asc'
            ? valA.toString().localeCompare(valB.toString())
            : valB.toString().localeCompare(valA.toString());
        });
      }

      // Apply pagination
      this.data = users.slice(
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
      this.sortColumn = col;
      this.sortDirection = 'asc';
    }
    this.loadData();
  }

  onPageChange(page: number) {
    if (page < 1 || page > Math.ceil(this.totalRecords / this.pageSize)) return;
    this.currentPage = page;
    this.loadData();
  }

  // ✅ Helpers to avoid inline type-casting in template
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
    if (checked) {
      this.data.forEach(u => this.selectedIds.add(u.id));
    } else {
      this.data.forEach(u => this.selectedIds.delete(u.id));
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
getCellValue(row: User, field: string): any {
  return row[field as keyof User];
}

  private syncCheckboxState() {
    this.selectAllCurrentPage = this.data.every(u => this.selectedIds.has(u.id));
  }
}
