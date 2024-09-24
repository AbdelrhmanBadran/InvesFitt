import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CommonService } from './common.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, Observer } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileServiceService {
  token: string = '';
  private _url: string = environment.baseUrl + "user_auth.php?action=";
  private userOnlyurl: string = environment.baseUrl + "users.php?action=";
  private pageUurl: string = environment.baseUrl + "user_page_acc.php?action=";
  public userImageUrl: string = "hhttps://api.dalilelsouq.com/uploads/users/";
  headers: { 'User-Token': string; lang: any; 'app-version': string; } = {
    'User-Token': '',
    lang: undefined,
    'app-version': ''
  };

  constructor(
    private common: CommonService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) 
  { 
    if (isPlatformBrowser(this.platformId)) {  
      this.token  = localStorage.getItem('token')!  

      this.headers = {
        'User-Token':this.token,
        'lang':this.common.lang_code,
        'app-version':'1.1.1'
      }
    }
  }

  getProfileData(data:any):Observable<any>
  {
    let body = JSON.stringify(data);
    return this.http.post(this.userOnlyurl + 'getProfileInfoById' , body )
  }
  editProfile(data:any):Observable<any>
  {
    let body = JSON.stringify(data);
    return this.http.post(this.userOnlyurl + 'edit_user' , body )
  }
  addOrEditFacility(data:any):Observable<any>
  {
    let body = JSON.stringify(data);
    return this.http.post(this.pageUurl + 'addEdit_page_acc' , body )
  }
  logout():Observable<any>
  {
    let data ={
      "device_token_id" : localStorage.getItem('deviceTokenId')!
    }
    let body = JSON.stringify(data);
    return this.http.post(this.userOnlyurl + 'logOut' , body )
  }
  getAllAccounts():Observable<any>
  {
    let data = {}
    let body = JSON.stringify(data);
    return this.http.post(this.pageUurl + 'view_accs' , body )
  }

  


}
//AIzaSyA70IYMNs1m_OthYx60S3rKuDXQvfPAWWA