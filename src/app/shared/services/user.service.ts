import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {  Inject, Injectable,  PLATFORM_ID } from '@angular/core';
import { CommonService } from './common.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private _url: string = environment.baseUrl + "user_auth.php?action=";
  public userImageUrl: string = "https://api.dalilelsouq.com/uploads/users/";
  public facilityImageUrl: string = "https://api.dalilelsouq.com/uploads/facility/";
  userdata:BehaviorSubject<any> = new BehaviorSubject(null)
  facilityData:BehaviorSubject<any> = new BehaviorSubject(null)
  headers:any;
  token: any;
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) 
  { 
    
    if (isPlatformBrowser(this.platformId)) {  
      this.token  = localStorage.getItem('token')!  
      let user = JSON.parse(localStorage.getItem('userData')!)
      this.userdata.next(user)
      
    }
  }
  userImage:BehaviorSubject<any> = new BehaviorSubject('');
  LastImage:BehaviorSubject<any> = new BehaviorSubject('');
  facilityImage:BehaviorSubject<any> = new BehaviorSubject('');
  LastFacilityImage:BehaviorSubject<any> = new BehaviorSubject('');

  mainRegister(data: any):Observable<any>{
    let body = JSON.stringify(data);
    return this.http.post(this._url + 'checkIfEmailExist' , body);
  }

  verifyCode(data: any):Observable<any>{
    let body = JSON.stringify(data);
    return this.http.post(this._url + 'check_code' , body);
  }
  
  register(data:any):Observable<any>
  {
    let body = JSON.stringify(data);
    return this.http.post(this._url + 'register' , body)
  }

  login(data:any):Observable<any>
  {
    let body = JSON.stringify(data);
    return this.http.post(this._url + 'login' , body)
  }

  forgetPassword(data:any):Observable<any>
  {
    let body = JSON.stringify(data);
    return this.http.post(this._url + 'forgotPassword' , body)
  }

  updatePassword(data:any ):Observable<any>
  {
    let body = JSON.stringify(data);
    return this.http.post(this._url + 'updatePassword' , body)
  }
  uploadImage(fd:any , type:string):Observable<any>
  {
    return this.http.post(`https://api.dalilelsouq.com/app-api/uploadImage.php?uploadFolder=mo/dalilelsouq/uploads/${type}` , fd  , {headers:{
      "user-token" : ''
    }} )
  }
}
