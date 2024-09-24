import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './config';
import { Observable } from 'rxjs';
import { getCurrentUserId } from './utils';

@Injectable({
  providedIn: 'root'
})
export class GymService {
  private apiUrl = 'https://api.ipify.org?format=json';


  constructor(
    private http : HttpClient
  ){ 
  
  }


  GetAllGyms(lat?:number , lon?:number, start:number = 0 , aIteamPerpage:any = 10 , dist:any = '' , price:any = '' ,optionsIds:any = '',sort:string = '' , type:string = '' , city_id:string = '' ): Observable<any> {
    const options = JSON.stringify(optionsIds);
    const params = new HttpParams()
      .set('lat', lat?.toString())
      .set('lon', lon?.toString())
      .set('start', start.toString())
      .set('aItemsPerPage', aIteamPerpage.toString())
      .set('dist', dist.toString())
      .set('price', price.toString())
      .set('optionsId', options)
      .set('sort', sort)
      .set('type', type)
      .set('city_id', city_id);
      return this.http.get(environment.apiUrl + 'gyms.php?action=getAllGyms', { params });
    }


  getGymDetails(id:number ): Observable<any> {
    console.log(getCurrentUserId());
    
    return this.http.get(environment.apiUrl + `gyms.php?action=getGymInfo&id=${id}` + `${getCurrentUserId() == undefined || getCurrentUserId() == null ? '&user_id='+ '' :'&user_id='+  getCurrentUserId()}`);
  }


  GetAllGymRating(id:number): Observable<any> 
  {
    return this.http.get(environment.apiUrl + `rating.php?action=getAllRating&gymId=${id}`)
  }

  addRating(data:any):Observable<any>
  {
    return this.http.post(environment.apiUrl + 'rating.php?action=AddEditRating' , data )
  }

  deleteRating(data:any):Observable<any>
  {
    return this.http.post(environment.apiUrl + 'rating.php?action=deleteRating' , data )
  }


  getIpAddress(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getAllOptions():Observable<any>
  {
    return this.http.get(environment.apiUrl + `options.php?action=getAllOptions`)
  }
}
