import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BreadcrumbLink } from '../../interfaces/common';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalstorageService } from '../../services/localstorage.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { countries } from 'country-data';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule ,BreadcrumbComponent , TranslateModule , CommonModule ,
    NgbAlertModule,FormsModule,NgbDropdownModule
  ]
  ,
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  @ViewChild('content') content: any;

  countrykeys = new Set<string>() ;
  countryCodes:any ;
  SignupForm!: FormGroup;
  notValidUser:boolean = false
  ExistUser:boolean = false
  showLoader:boolean;
  BreadcrumbLinks: BreadcrumbLink[] = [
    { label:'Home', route:'/home'},
    { label:'Register', route:''},
  ];
  private modalService = inject(NgbModal);
	userName:string = ''
	userPhone:any = '';
  type: string;
  userData: any;
  invalidUserName: boolean;
  somethingWrongErr: boolean;
  mobileErr: boolean;
  errMsg: any;
  invalidUserphone: boolean;
  userInputShow: boolean;
  constructor(
    private formbuilder: FormBuilder,
    private authService : AuthService,
    private localStorage : LocalstorageService,
    private router : Router,
  ) {
    countries.all.forEach(ele =>{
      if(ele.countryCallingCodes[0] && !this.countrykeys.has(ele.countryCallingCodes[0] )){
        this.countrykeys.add(ele.countryCallingCodes[0].slice(1))
      }
    }) 
    this.countryCodes = Array.from(this.countrykeys).sort();
  }
  
  ngOnInit() {
    this.InitSignupForm();
  }

  InitSignupForm() {
    this.SignupForm = this.formbuilder.group(
      {
        first_name: ['', [Validators.required]],
        last_name: ['' , [Validators.required]],
        email: ['' , [Validators.required , Validators.email]],
        mobile: ['', [Validators.required , Validators.pattern(/^\d{6,12}$/)]],
        postcode: ['', []],
        password: ['', [Validators.required , Validators.minLength(6)]],
        rePassword: ['', [Validators.required , Validators.minLength(6)]],
        findUs: [''],
        countryKey: ['20'],
      } ,
      {
        validators: this.rePasswordMatched
      }
    );
  }

  rePasswordMatched(SignupForm:any){
    let passwordControl = SignupForm.get('password')
    let rePasswordControl = SignupForm.get('rePassword')
    if (passwordControl?.value == rePasswordControl?.value) {
      return null
    }else{
      rePasswordControl?.setErrors({passwordMatch : 'Must match password'})
      return {passwordMatch : 'Must match password'}
    }
  }


  SubmitSignup() {
    if (this.SignupForm.valid) {
      this.showLoader = true
      
      const formData = new FormData();
      for (const key in this.SignupForm.value) {
        if ( key !== 'rePassword' && key !== 'countryKey' ) {
          let formValue =  this.SignupForm.value[key]
          key == 'mobile' ? formValue = '00' + this.SignupForm?.value?.countryKey + formValue : formValue = formValue
          formData.append(key, formValue);
        }
      }
      this.authService.addEdit(formData).subscribe({
        next: (res) => {
          console.log(res);
          if (res.status ==200 ) {
            this.ExistUser= false;
            this.notValidUser = false;
            this.mobileErr = false;
            this.somethingWrongErr = false
            this.localStorage.setItem('currentUser', JSON.stringify(res.data));
            this.localStorage.setItem('token', res.data?.authentication_code);
            this.localStorage.setItem('IsAuthinticated', JSON.stringify(this.authService.IsAuthinticated));
            this.authService.setUserValidity(true)
          this.router.navigateByUrl('/home');
          }else if (res.status == 409){
            this.ExistUser= true;
            this.mobileErr = false;
            this.somethingWrongErr = false
          }else if(res.status == 505){
            this.mobileErr = true
            this.somethingWrongErr = false
            this.ExistUser= false;
          }
          else if(res.status == 500){
            this.somethingWrongErr = true
            this.mobileErr = false;
            this.ExistUser= false;
          }
          this.showLoader = false
        },
        error: (err) => {
          console.log(err);
          this.showLoader = false
        },
      });
    }else{
      Object.keys(this.SignupForm.controls).forEach(key => {
        this.SignupForm.controls[key].markAsTouched();
      })
      this.notValidUser = true
    }
  }

  closeAlert() {
    this.notValidUser = false;
    this.ExistUser = false
  }

  async signinWithSocialApp(type:string) {
    try {
      let userCredential;
      if(type == 'google'){
        userCredential = await this.authService.signInwithGoogle();
      }else if(type == 'facebook'){
        userCredential = await this.authService.signInwithfaceBook();
      }else if(type == 'apple'){
        userCredential = await this.authService.signInwithApple();
      }
      console.log(userCredential);
      
      const user = userCredential.user;
      const _tokenResponse = userCredential._tokenResponse;
      // console.log(user);
      // console.log(_tokenResponse);
      if (_tokenResponse || user) {
        // You can now access the user's data
        // console.log('User ID:', _tokenResponse.localId);
        // console.log('User Name:', _tokenResponse.displayName);
        console.log('User Email:', _tokenResponse.email , user?.providerData[0]?.email);
        console.log('User Email:', user.email);
        // console.log('User Photo URL:', _tokenResponse.photoURL);
        if (!_tokenResponse.displayName && !user.displayName) {
          this.userInputShow = true
        }else{
          this.userInputShow = false
        }
        this.type = type
        this.userData={
          email :  _tokenResponse.email ?? user.email,
          displayName: user.displayName ?? _tokenResponse.displayName,
          uid: type== 'apple' ?  _tokenResponse.localId : user.uid
        };
        this.open()
      }
    } catch (error) {
      console.error('Error signing in with social:', error);
    }
  }

  addUserWithSocial(user:any , type:string) {
    this.showLoader = true
    console.log(user);
    const formData = new FormData();
    formData.append('email', user.email);
    formData.append('first_name', user.displayName?.split(' ')[0] ? user.displayName?.split(' ')[0]: '');
    formData.append('last_name', user.displayName?.split(' ')[1] ? user.displayName?.split(' ')[1]: '');
    formData.append('social_access_token', user.uid);
    formData.append('mobile', user.mobile);
    formData.append('social_type', type);
    this.authService.signupWithSocials(formData).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.status ==200 ) {
          this.ExistUser= false;
          this.notValidUser = false
          this.somethingWrongErr = false
          this.authService.IsAuthinticated = true;
          this.localStorage.setItem('currentUser', JSON.stringify(res.data));
          this.localStorage.setItem('token', res.data?.authentication_code);
          this.localStorage.setItem('IsAuthinticated', JSON.stringify(this.authService.IsAuthinticated));
          this.authService.setUserValidity(true)
          this.router.navigateByUrl('/home');
        }else {
          this.ExistUser= true;
        }
        this.showLoader = false

      },
      error: (err) => {
        console.log(err);
        this.showLoader = false

      },
    })
  }


  completeSubmission()
  {
    let data = {
      email : this.userData.email,
      displayName: this.userData?.displayName ? this.userData?.displayName: this.userName,
      mobile: this.userPhone,
      uid : this.userData.uid,

    }
    console.log(this.userName);
    console.log(this.userPhone);
    
    if (this.userName?.length == 0 && !this.userData?.displayName) {
      this.invalidUserName = true;
      this.invalidUserphone = false;
      return;
    }else if( this.userPhone?.length <= 6 || this.userPhone?.length > 12){
      this.invalidUserphone = true;
      this.invalidUserName = false
      return;
    }else{
      this.invalidUserName = false
      this.invalidUserphone = false;
    }
    this.addUserWithSocial(data , this.type)
    this.userName = '';
    this.userPhone = '';
    this.modalService.dismissAll()
  }
  open() {
		this.modalService.open(this.content , { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				console.log(result);
        
			}
		);
	}

}
