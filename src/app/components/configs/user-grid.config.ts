import { GridConfig } from "../models/grid.models";

export const USER_GRID_CONFIG: GridConfig = {
  serverMode: false,
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 25, 50],
  checkboxSelection: true,
  selectionMode: 'page',
  columns: [
    { field: 'id', header: 'ID', sortable: true, width: '80px' },
    { field: 'firstNameEN', header: 'First Name (EN)', sortable: true },
    { field: 'lastNameEN', header: 'Last Name (EN)', sortable: true },
    { field: 'firstNameAR', header: 'الاسم الأول (AR)', sortable: true },
    { field: 'lastNameAR', header: 'الاسم الأخير (AR)', sortable: true },
    { field: 'email', header: 'Email', sortable: false },
    { field: 'mobileNumber', header: 'Mobile', sortable: true },
    { field: 'maritalStatus', header: 'Marital Status', sortable: true },
    { field: 'address', header: 'Address', sortable: false },
  ]
};

