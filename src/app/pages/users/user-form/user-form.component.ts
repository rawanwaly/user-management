import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  AsyncValidatorFn,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { MobilePrefixValidator } from 'src/app/shared/validators/MobilePrefixValidator';
import { AsyncExistanceValidator } from 'src/app/shared/validators/AsyncExistanceValidator';
import {
  toMaritalStatusString,
  toMaritalStatusValue,
} from 'src/app/shared/helper/enumConverter';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode = false;
  userId?: number;
  // add modal state
  modalVisible = false;
  modalTitle = '';
  modalMessage = '';
  modalConfirmAction?: () => void;
  showCancelBtn = true;
  // Options for marital status dropdown
  maritalStatusOptions = [
    { value: 1, label: 'User.Status.Single' },
    { value: 2, label: 'User.Status.Married' },
    { value: 3, label: 'User.Status.Divorced' },
    { value: 4, label: 'User.Status.Widower' },
  ];
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  private openModal(
    title: string,
    message: string,
    confirmAction?: () => void,
    showCancel = true
  ): void {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalConfirmAction = confirmAction;
    this.showCancelBtn = showCancel;
    this.modalVisible = true;
  }
  ngOnInit(): void {
    this.buildForm();

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.userId = +params['id'];
        this.loadUser(this.userId);
      }
    });
  }
  onModalConfirm(): void {
    if (this.modalConfirmAction) this.modalConfirmAction();
    this.modalVisible = false;
  }

  onModalCancel(): void {
    this.modalVisible = false;
  }

  onCancel(): void {
    if (this.userForm.dirty) {
      this.openModal(
        'Unsaved Changes',
        '⚠️ You have unsaved changes. Are you sure you want to leave?',
        () => this.router.navigate(['/users']),
        true
      );
    } else {
      this.router.navigate(['/users']);
    }
  }

  buildForm(): void {
    console.log('userId in buildForm:', this.userId);
    this.userForm = this.fb.group({
      firstNameEN: ['', Validators.required],
      lastNameEN: ['', Validators.required],
      firstNameAR: ['', Validators.required],
      lastNameAR: ['', Validators.required],
      email: [
        '',
        [Validators.required, Validators.email],
        [
          AsyncExistanceValidator((value) =>
            this.userService.checkEmailExists(value, this.userId)
          ),
        ],
      ],
      mobileNumber: [
        '',
        [Validators.required, MobilePrefixValidator],
        [
          AsyncExistanceValidator((value) =>
            this.userService.checkMobileExists(value, this.userId)
          ),
        ],
      ],
      maritalStatus: [null, Validators.required],
      address: ['', [Validators.maxLength(200)]],
    });
  }

  loadUser(id: number): void {
    this.userService.getById(id).subscribe({
      next: (user) => {
        console.log('Loaded user:', user);

        if (user) {
          this.clearAsyncValidators();

          // Patch the form with user data
          this.userForm.patchValue({
            firstNameEN: user.firstNameEN,
            lastNameEN: user.lastNameEN,
            firstNameAR: user.firstNameAR,
            lastNameAR: user.lastNameAR,
            email: user.email,
            mobileNumber: user.mobileNumber,
            maritalStatus: toMaritalStatusValue(user.maritalStatus),
            address: user.address,
          });
          // ✅ Re-apply async validators with userId
          this.userForm
            .get('email')
            ?.setAsyncValidators(
              AsyncExistanceValidator((value) =>
                this.userService.checkEmailExists(value, this.userId)
              )
            );
          this.userForm
            .get('mobileNumber')
            ?.setAsyncValidators(
              AsyncExistanceValidator((value) =>
                this.userService.checkMobileExists(value, this.userId)
              )
            );
        } else {
          console.error('User not found with ID:', id);
          this.router.navigate(['/users']);
        }
      },
      error: (err) => {
        console.error('Failed to load user:', err);
        this.router.navigate(['/users']);
      },
    });
  }

  private clearAsyncValidators(): void {
    this.userForm.get('email')?.clearAsyncValidators();
    this.userForm.get('mobileNumber')?.clearAsyncValidators();
  }
  private updateUser(userData: any): void {
    this.userService.update(this.userId!, userData).subscribe({
      next: () => {
        this.openModal(
          'Success',
          '✅ User updated successfully',
          () => this.router.navigate(['/users']),
          false
        );
      },
      error: () => {
        this.openModal('Error', '❌ Failed to update user.', undefined, false);
      },
    });
  }

  private createUser(userData: any): void {
    this.userService.create(userData).subscribe({
      next: () => {
        this.openModal(
          'Success',
          '✅ User created successfully',
          () => this.router.navigate(['/users']),
          false
        );
      },
      error: () => {
        this.openModal('Error', '❌ Failed to add user.', undefined, false);
      },
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.value;
    const userData = {
      ...formValue,
      id: this.userId,
      maritalStatus: formValue.maritalStatus,
    };

    if (this.isEditMode && this.userId) {
      // ⚠️ Ask for confirmation before update
      this.openModal(
        'Confirm Update',
        'Are you sure you want to update this user?',
        () => this.updateUser(userData)
      );
    } else {
      // ⚠️ Ask for confirmation before add
      this.openModal(
        'Confirm Save',
        'Are you sure you want to add this user?',
        () => this.createUser(userData)
      );
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.userForm.get(controlName);
    return !!(control && control.touched && control.invalid);
  }
}
