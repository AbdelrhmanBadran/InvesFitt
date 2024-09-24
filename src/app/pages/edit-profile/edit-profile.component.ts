import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { BreadcrumbLink } from '../../interfaces/common';
import { LocalstorageService } from '../../services/localstorage.service';
import { User } from '../../interfaces/user';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { CommonApiService } from '../../services/common-api.service';
import { getCurrentUserId } from '../../services/utils';
import { environment } from '../../services/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  standalone: true,
  imports: [ReactiveFormsModule ,BreadcrumbComponent,TranslateModule , CommonModule],
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  EditProfileForm: FormGroup;
  BreadcrumbLinks: BreadcrumbLink[] = [
    { label: 'Home', route: '/home' },
    { label: 'Edit Profile', route: '' },
  ];
  selectedFile: File;
  imgUrl: string | ArrayBuffer = '';
  userData: User;
  uploadedFile: any;
  constructor(private formBuilder: FormBuilder,
    private localstorage:LocalstorageService,
    private auth:AuthService,
    private common:CommonApiService,
    private lang:TranslateService,

  ) {
  }
  
  ngOnInit() {
    this.userData = JSON.parse(this.localstorage.getItem('currentUser'));
    this.InitEditProfileForm();
  }

  InitEditProfileForm() {
    this.imgUrl = environment.imgUrl + 'users/'+ this.userData?.img
    this.EditProfileForm = this.formBuilder.group({
      first_name: [this.userData?.first_name , Validators.required],
      last_name: [this.userData?.last_name , Validators.required],
      email: [this.userData?.email , [Validators.required , Validators.email]],
      mobile: [this.userData?.mobile , [Validators.required , Validators.minLength(9)]],
      old_password: [''],
      new_password: [''],
      confirm_password: [''],
      user_id: [this.userData?.id],
      img: [''],
    },{validators: this.rePasswordMatched });
  }
  rePasswordMatched(EditProfileForm:any){
    let passwordControl = EditProfileForm.get('new_password')
    let rePasswordControl = EditProfileForm.get('confirm_password')
    if (passwordControl?.value == rePasswordControl?.value) {
      return null
    }else{
      rePasswordControl?.setErrors({passwordMatch : 'Must match password'})
      return {passwordMatch : 'Must match password'}
    }
  }

  handleImageError(e)
  {
    e.target.src = 'assets/images/user.jpg';
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imgUrl = reader.result;
      reader.readAsDataURL(this.selectedFile);
      this.uploadImage();
    }
  }

  uploadImage() {
    const formData = new FormData();
    formData.append('class_name', 'users');
    formData.append('file', this.selectedFile);
    this.auth.uploadImage(formData).subscribe(
      {
        next: (res:any) => {
          console.log(res);
          if (res?.status) {
            this.uploadedFile = res?.file
          }
        },
        error: (err) => {
          console.log(err);
        }
      }
    )
  }
  SubmitEditProfile() {
    if (this.uploadedFile) {
      this.EditProfileForm.patchValue({
        img: this.uploadedFile
      });
    }
    
    console.log(this.EditProfileForm.value);
    console.log(this.EditProfileForm);

    if ((this.EditProfileForm.get('old_password').value !== '' && this.EditProfileForm.get('new_password').value == '') || (this.EditProfileForm.get('new_password').value !== '' && this.EditProfileForm.get('old_password').value == '')) {
      console.log('old password error');
      return;
    }

    const formData = new FormData();
    Object.keys(this.EditProfileForm.controls).forEach(key => {
      if (key !== 'confirm_password' ) {
        formData.append(key, this.EditProfileForm.get(key)?.value);
      }
    });

    if (this.EditProfileForm.valid) {
      this.auth.addEdit(formData).subscribe({
        next: (res) => {
          console.log(res);
          if (res?.status == 200) {
            this.getOneUser();
            Swal.fire({
              icon:'success',
              text:this.lang.instant('Process is added successfully'),
            })
          }else{
            Swal.fire({
              icon: "error",
              text:this.lang.instant('some thing went wrong'),
            })
          }
        },
        error: (err) => {
          console.log(err);
            Swal.fire({
              icon: 'error',
              text:this.lang.instant('something went wrong'),
            })
        }
      })
    }else{
      this.markAllAsTouched(this.EditProfileForm);
        console.log('there are some errors');
    }
  }


  private markAllAsTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      
      const control = formGroup.get(field);
    
      control?.markAsTouched({ onlySelf: true });
      control?.updateValueAndValidity({ onlySelf: true });
    });
  }


  getOneUser()
  {
    this.common.getOnUser().subscribe({
      next: (res) => {
        console.log(res);
        if (res.status == 200) {
          this.userData = res.data
          this.localstorage.setItem('currentUser',  JSON.stringify(res?.data))
          this.common.userUpdated.next('update')
          this.imgUrl = environment.imgUrl + 'users/' +this.userData?.img
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
