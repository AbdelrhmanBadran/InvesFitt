import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalstorageService } from './localstorage.service';
import { Auth, AuthProvider, FacebookAuthProvider, GoogleAuthProvider , signInWithPopup  } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from './config';
import {  OAuthProvider } from "firebase/auth";
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  IsAuthinticated = true;
  private isUserValid$ = new BehaviorSubject<boolean>(false);

  private auth  = inject(Auth);
  
  constructor(
    private localStorage: LocalstorageService,
    private http: HttpClient,
    private lang: TranslateService,
    
    ) {

    }

  LogIn(user:any):Observable<any> {
    let body = JSON.stringify(user)
    
    return this.http.post(environment.apiUrl + 'users.php?action=login', body)
  }


  addEdit(data:any):Observable<any>
  {

    return this.http.post(environment.apiUrl + 'users.php?action=addEditUser', data )
  }

  forgetPasword(data:any):Observable<any>
  {
    let body = JSON.stringify(data)
    return this.http.post(environment.apiUrl + 'users.php?action=ForgotPassword' , body)
  }
  

  LogOut() {
    this.IsAuthinticated = false;
    this.localStorage.setItem('IsAuthinticated', JSON.stringify(this.IsAuthinticated));
    this.localStorage.setItem('currentUser',null);
    this.localStorage.setItem('token',null);
    this.setUserValidity(this.IsAuthinticated)
    this.signOut();
  }

  IsAuthinticatedUser() {
    return this.IsAuthinticated;
  }

  get isUserValid() {
    return this.isUserValid$.asObservable();
  }

  setUserValidity(isValid: boolean) {
    this.isUserValid$.next(isValid);
  }

  uploadImage(formData:any)
  {
    return this.http.post(environment.apiUrl + 'upload.php?action=uploadAttachment' , formData)
  }
  LoginWithSocials(data:any)
  {
    let body = JSON.stringify(data)
    return this.http.post(environment.apiUrl + 'users.php?action=LoginWithSocials' , body)
  }
  signupWithSocials(formData:any)
  {
    return this.http.post(environment.apiUrl + 'users.php?action=signupWithSocials' , formData)
  }
  signInwithGoogle():Promise<any> | Observable<any> {
    const provider = new GoogleAuthProvider();
    provider.addScope('email'); 
    return this.callpopup(provider);
  }
  signInwithfaceBook():Promise<any> | Observable<any> {
    const provider = new FacebookAuthProvider();
    provider.addScope('email'); 
    return this.callpopup(provider);
  }
  signInwithApple():Promise<any> | Observable<any> {
    const provider = new OAuthProvider('apple.com');  
    provider.addScope('email'); 
    return this.callpopup(provider);
  }

  async callpopup(provider:AuthProvider) {
    try {
      const result = await signInWithPopup(this.auth , provider);
      return result;
    } catch (error) {
      console.log(error);
      if (error.code === 'auth/account-exists-with-different-credential') {
        console.log('Error during Facebook sign-in:', error);
      } else {
        console.error('Error during Facebook sign-in:', error);
        return error;
      }
    }

  }
  


  
  signOut()
  {
    return this.auth.signOut().then(() => {
      console.log('You have been successfully logged out!');
    }).catch((error) => {
      console.log(error);
    });;
  }


}
