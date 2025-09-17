
export const MOCK_USERS: Userdto[] = [
  { id: 1, fullName: 'احمد خالد فوزي عبد العزيز', employeeNumber: '2222222', nationalId: '9988888888', mobile: '527372892', email: 'ahmed.khaled.dev@alq', department: 'امانة القمم', administration: 'ادارة', jobTitle: 'مدير', position: 'موظف' },
  { id: 2, fullName: 'احمد عزمي فوزي السيد', employeeNumber: '1111111', nationalId: '2999999999', mobile: '527372891', email: 'hovono8439@gardsiir.c', department: 'امانة القمم', administration: 'ادارة', jobTitle: 'مدير', position: 'موظف' },
  { id: 3, fullName: 'الغؤيو محمد سمير الجدع', employeeNumber: '8008888', nationalId: '2362255225', mobile: '523969855', email: 'Elfayomy.mohamed@alq', department: 'جهة ميت سعادان', administration: 'ادارة صيانة', jobTitle: 'موظف دعم', position: 'مشرف' },
  { id: 4, fullName: 'يدوي سعد اسماعيل عنتر', employeeNumber: '55599988', nationalId: '5599988774', mobile: '555999555', email: 'bug2@example.com', department: 'امانة القمم', administration: 'ادارة', jobTitle: 'موظف دعم', position: 'مشرف' },
  { id: 5, fullName: 'حسن محمد السيد توفيق', employeeNumber: '7777777', nationalId: '9927777777', mobile: '527372897', email: 'hassan.mohamed@alqe', department: 'جهة المنصورة', administration: 'ادارة', jobTitle: 'مدير', position: 'مدير' },
  { id: 6, fullName: 'حمزة احمد عزمي فوزي', employeeNumber: '3333333', nationalId: '9777777777', mobile: '527372893', email: 'hamza.ahmed.dev@alq', department: 'جهة ميت سعادان', administration: 'ادارة صيانة', jobTitle: 'موظف دعم', position: 'موظف' },
  { id: 7, fullName: 'خالد ن م م', employeeNumber: '9898989', nationalId: '8888888888', mobile: '1553703618', email: 'naguibk5@gmail.com', department: 'eqw', administration: 'مدير', jobTitle: 'مدير', position: 'مدير' },
  { id: 8, fullName: 'سعد محمود السيد محمد', employeeNumber: '1010101', nationalId: '1010101010', mobile: '01127372897', email: 'saad.mohmoud@alqem', department: 'امانة القمم', administration: 'ادارة', jobTitle: 'موظف', position: 'موظف' },
  { id: 9, fullName: 'صلاح محمد السيد رجب', employeeNumber: '4040404', nationalId: '2963558844', mobile: '589648863', email: 'salah.mohamed@alqem', department: 'جهة ميت سعادان', administration: 'ادارةصيانة', jobTitle: 'مدير', position: 'مدير' },
  { id: 10, fullName: 'صالح سعد السيد رجب', employeeNumber: '9999999', nationalId: '9999999999', mobile: '527372889', email: 'salah.saad@alqemam.c', department: 'امانة القمم', administration: 'ادارة', jobTitle: 'موظف دعم', position: 'موظف' },
  // add more if you want
];
export interface Userdto {
  id: number;
  fullName: string;
  employeeNumber?: string; // "الرقم الوظيفي"
  nationalId?: string;     // "رقم الهوية"
  mobile?: string;         // "رقم الجوال"
  email?: string;
  department?: string;     // "الجهة"
  administration?: string; // "الإدارة"
  jobTitle?: string;       // "الوظيفة"
  position?: string;       // "المنصب"
  active?: boolean;
  avatarUrl?: string;
  // add any other fields your backend uses
}
