import { GridConfig } from '../models/grid.models';

export const USER_GRID_CONFIG: GridConfig = {
  serverMode: true,
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 25, 50],
  checkboxSelection: true,
  selectionMode: 'page',
  columns: [
    { field: 'id', header: 'ID', sortable: false, width: '80px' },
    { field: 'firstNameEN', header: 'User.FirstNameEN', sortable: true },
    { field: 'lastNameEN', header: 'User.LastNameEN', sortable: true },
    { field: 'firstNameAR', header: 'User.FirstNameAR', sortable: true },
    { field: 'lastNameAR', header: 'User.LastNameAR', sortable: true },
    { field: 'email', header: 'User.Email', sortable: false },
    { field: 'mobileNumber', header: 'User.Mobile', sortable: true },
    { field: 'maritalStatus', header: 'User.MaritalStatus', sortable: true },
    { field: 'address', header: 'User.Address', sortable: false },
    {
      field: 'isActive',
      header: 'User.activity',
    },
  ],
};
