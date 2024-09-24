import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  lang_code:any  = '';
  private serviceUrl: string = environment.baseUrl + "services.php?action=";
  public subServiceUrl :string = environment.baseUrl + 'user_page_acc.php?action=';
  public userUrl :string = environment.baseUrl + 'users.php?action=';
  public serviceImageUrl:string = 'https://api.dalilelsouq.com/uploads/services/';
  public facilityImageUrl:string = 'https://api.dalilelsouq.com/uploads/facility/';
  headers: any;
  token: any;
  constructor(    
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private user: UserService,

  )
  {
    if (isPlatformBrowser(this.platformId)) {
      this.lang_code = localStorage.getItem('front-lang') ==  null ? 'ar' : localStorage.getItem('front-lang')!
      this.user.userdata.subscribe(res=>{
        this.token  = localStorage.getItem('token')!  
        this.headers = {
          'User-Token':this.token,
          'lang':this.lang_code,
          'app-version':'1.1.1'
        }
      })
    }
  }

  
  getAllServices(parentId:any = ''):Observable<any>
  {
    let data={
      "start": 0,
      "aItemsPerService": 10,
      parentId:parentId
    }
    let body = JSON.stringify(data);
    return this.http.post(this.serviceUrl + 'getServicesByParams' , body )
  }
  
  getSubServices(parentId:any  , lat:any = '' , lon:any = ''):Observable<any>
  {
    let data={
      "parent_id": parentId,
      "start": 0,
      "aItemsPerService": 10,
    }
    let body = JSON.stringify(data);
    return this.http.post(this.subServiceUrl + 'getAllServices' , body )
  }

  GetAllPageAccs(serviceId:any , lat:any = '' , lon:any = ''):Observable<any>
  {
    let data={
      "start": 0,
      "aItemsPerService": 10,
      "searchKey": "",
      "service_id": serviceId,
      "lat": lat,
      "lon": lon,
    }
    let body = JSON.stringify(data);
    return this.http.post(this.userUrl + 'GetAllPageAccs' , body )
  }

  GetOneFacility(pageId:any):Observable<any>
  {
    let data={
      "page_id": pageId
    }
    let body = JSON.stringify(data);
    return this.http.post(this.subServiceUrl + 'get_one_acc', body )
  }
  followFacility(id:string):Observable<any>
  {
    let data={
      "follow_user_id": id
    }
    let body = JSON.stringify(data);
    return this.http.post(this.userUrl + 'followingHim' , body)
  }
  
  rateFacility(PageId:string , rate:any)
  {
    let data={
      "page_id": PageId,
      "rate": rate
    }
    let body = JSON.stringify(data);
    return this.http.post(this.userUrl + 'RateMe' , body )
  }
}
