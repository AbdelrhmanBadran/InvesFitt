import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { BreadcrumbLink, ContactInfo } from '../../interfaces/common';
import { CommonModule, formatDate } from '@angular/common';
import { LocalstorageService } from '../../services/localstorage.service';
import { getCurrentUser, getCurrentUserlang } from '../../services/utils';
import { User } from '../../interfaces/user';
import { CommonApiService } from '../../services/common-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports:[RouterModule, TranslateModule,ReactiveFormsModule,BreadcrumbComponent , CommonModule],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  ContactForm:FormGroup;
  BreadcrumbLinks: BreadcrumbLink[] = [
    { label: 'Home', route: '/home' },
    { label: 'Contact Us', route: '' },
  ];
  userData: any;
  contactInfo: ContactInfo;
  lang:string
  constructor( 
    private formBuilder:FormBuilder,
    private common:CommonApiService,

  ) {
    this.InitContactForm();
  }

  InitContactForm(){
    this.userData = getCurrentUser()
    console.log(this.userData);
    
    this.ContactForm = this.formBuilder.group({
      name:[ this.userData ? this.userData?.first_name + ' ' + this.userData?.last_name : '', Validators.required],
      email:[this.userData?.email , [Validators.required , Validators.email]],
      phone:[this.userData?.mobile, Validators.required],
      found_us_by: [''],
      message:['' , Validators.required]
    })
  }

  ngOnInit() {
    this.lang = getCurrentUserlang()
    console.log(this.lang);
    
    this.common.contactInfo.subscribe(res => {
      this.contactInfo = res;
    });    
  }
  SubmitContactForm(){
    if(this.ContactForm.valid){
      let formData = new FormData();
      Object.keys(this.ContactForm.value).forEach(key => {
        formData.append(key, this.ContactForm.value[key]);
      })
      console.log(this.ContactForm.value);

      this.common.contactUs(formData).subscribe({
        next: (res) => {
          console.log(res);
          if(res?.status == 200){
            Swal.fire({
              icon: 'success',
              title: 'Your message has been sent successfully',
              showConfirmButton: true,
            })
          }else{
            Swal.fire({
              icon: 'error',
              title: 'somenthing went wrong , please try later',
              showConfirmButton: true,
            })
          }
        },
        error: (err) => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'somenthing went wrong , please try later',
            showConfirmButton: true,
          })
        }
      })
    }else{
      Object.keys(this.ContactForm.controls).forEach(key => {
        this.ContactForm.controls[key].markAsTouched();
      })
    }
  }




}
