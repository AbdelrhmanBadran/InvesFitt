import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalstorageService } from './localstorage.service';
import { environment } from './config';
import { BehaviorSubject, Observable } from 'rxjs';
import { getCurrentUserAuthenticationCode, getCurrentUserId } from './utils';
import { PaymentData } from '../interfaces/common';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {

  enrollData:BehaviorSubject<PaymentData> = new BehaviorSubject({});
  constructor(
      private http : HttpClient,
  ) { 

  }


  GetAllsubscriptions(start:number = 0 ,aIteamPerpage :number = 10):Observable<any>
  {
      return this.http.get(environment.apiUrl + `subscription.php?action=getAllSubscriptionRecords&user_id=${getCurrentUserId()}&start=${start}&aItemsPerPage=${aIteamPerpage}` )
  }


  GetSubscriptionInfo(subscriptionId:any):Observable<any>
  {
    return this.http.get(environment.apiUrl + `subscription.php?action=getSubscriptionInfo&user_id=${getCurrentUserId()}&subscriptionId=${subscriptionId}` )
  }


  EnrollSubscription(data:any):Observable<any>
  {
    return this.http.post(environment.apiUrl + `subscription.php?action=enrollsubscribtion`,data)
  }


  GetAllpointsRecords(start:number = 0 ,aIteamPerpage :number = 10 ):Observable<any>
  {
    return this.http.get(environment.apiUrl + `points.php?action=getAllPointsRecords&user_id=${getCurrentUserId()}&start=${start}&aItemsPerPage=${aIteamPerpage}` )
  }

  
}
