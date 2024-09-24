import { BreadcrumbLink } from './../../interfaces/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { LocalstorageService } from '../../services/localstorage.service';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { getRedirectResult } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    NgbAlertModule,
    CommonModule,
    BreadcrumbComponent,
    AngularFireAuthModule,
    AngularFireModule
  ],
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  notValidUser: boolean = false;
  isUserValid: boolean = false;
  showLoader:boolean = false
  BreadcrumbLinks: BreadcrumbLink[] = [
    { label:'Home', route:'/home'},
    { label:'Log In', route:''},
  ];
  notValidSocialUser: boolean;

  private auth  = inject(Auth);


  constructor(
    private formbuilder: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private localStorage: LocalstorageService,
  ) {
  }
  ngOnInit() {
    this.InitloginForm();
  }

  InitloginForm() {
    this.loginForm = this.formbuilder.group({
      email: ['' , [Validators.required, Validators.email]],
      password: ['',[Validators.required , Validators.minLength(6)]],
    });
  }

  SubmitLogin() {
    if (this.loginForm.valid) {
      this.showLoader = true
      this.authService.LogIn(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.status !== 200 ) {
            this.notValidUser = true;
          } else {
            this.authService.IsAuthinticated = true;
            this.localStorage.setItem('currentUser', JSON.stringify(res.User_data));
            this.localStorage.setItem('token', res.User_data?.authentication_code);
            this.localStorage.setItem('IsAuthinticated', JSON.stringify(this.authService.IsAuthinticated));
            this.authService.setUserValidity(true)
            this.router.navigateByUrl('/home');
          }
          this.showLoader = false
        },
      error: (err) => {
          console.log(err);
          this.notValidUser = true;
          this.showLoader = false
        },
      })
    }else{
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.controls[key].markAsTouched();
      })
      this.notValidUser = true;
      this.showLoader = false
    }
    

  }
  closeAlert() {
    this.notValidUser = false;
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
        console.log('User Name:', _tokenResponse.displayName);
        console.log('User Email:', _tokenResponse.email , user?.providerData[0]?.email);
        console.log('User Email:', user.email);
        // console.log('User Photo URL:', _tokenResponse.photoURL);
        let userData={
          email :  _tokenResponse.email ?? user.email,
          displayName: user.displayName ?? _tokenResponse.displayName,
          uid: type== 'apple' ?  _tokenResponse.localId : user.uid
        };
        this.loginWithSocial(userData)
      }
    } catch (error) {
      console.error(`Error signing in with ${type}:`, error);
    }
  }

  loginWithSocial(user:any)
  {
    this.showLoader = true
    let data = {
      token:user.uid,
      email:user.email == null ? '' : user.email,
    }
    this.authService.LoginWithSocials(data).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.status ==200 ) {
          this.notValidSocialUser = false
          this.authService.IsAuthinticated = true;
          this.localStorage.setItem('currentUser', JSON.stringify(res.data));
          this.localStorage.setItem('token', res.data?.authentication_code);
          this.localStorage.setItem('IsAuthinticated', JSON.stringify(this.authService.IsAuthinticated));
          this.authService.setUserValidity(true)
          this.router.navigateByUrl('/home');
        }else{
          this.notValidSocialUser = true
        }
        this.showLoader = false
      },
      error: (err) => {
        console.log(err);
        this.showLoader = false
      },
    });
  }


}
