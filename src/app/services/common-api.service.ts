import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from './config';
import { getCurrentUserAuthenticationCode, getCurrentUserId } from './utils';

@Injectable({
  providedIn: 'root'
})
export class CommonApiService {
  userUpdated = new BehaviorSubject(null);
  langUpdated = new BehaviorSubject(null);
  contactInfo = new BehaviorSubject(null);
  constructor(
    private http : HttpClient,
  ) { 
  }


  GetAllFaq():Observable<any>
  {
    return this.http.get(environment.apiUrl + 'faq.php?action=getAllFAQ')
  }

  getOnUser():Observable<any>
  {    
    return this.http.post(environment.apiUrl + `users.php?action=getOneUser&user_id=${getCurrentUserId()}` , {user_id : getCurrentUserId()} )
  }
  getContactInfo():Observable<any>
  {
    return this.http.get(environment.apiUrl + `Contact_us.php?action=getContactsInfo`)
  }

  contactUs(data):Observable<any>
  {
    return this.http.post(environment.apiUrl + `Contact_us.php?action=contact_us` , data)
  }
  
  getAllPage():Observable<any>
  {
    return this.http.get(environment.apiUrl + `pages.php?action=getAllPages&start=0&aItemsPerPage=5` )
  }
  
  getOnePage(id:number):Observable<any>
  {
    return this.http.get(environment.apiUrl + `pages.php?action=getOnePage&id=${id}` )
  }

  getAllCountries():Observable<any>
  {
    return this.http.get(environment.apiUrl + `citiesCountries.php?action=getAllCountries` )
  }

  showCity(id:number):Observable<any>
  {
    return this.http.get(environment.apiUrl + `citiesCountries.php?action=showCity&&id=${id}` )
  }
}
