import { Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  lang_code:any  = '';
  private serviceUrl: string = environment.baseUrl + "services.php?action=";
  public serviceImageUrl:string = 'https://api.dalilelsouq.com/uploads/services/';
  public noImage:string = 'https://api.dalilelsouq.com/uploads/no_image.jpg';
  layerOn:boolean = false;
  profileMode: string = '';
  updatedPost:BehaviorSubject<string> = new BehaviorSubject('');
  currentUser:BehaviorSubject<any> = new BehaviorSubject(null);
  updatefacility:BehaviorSubject<any> = new BehaviorSubject(null);
  
  constructor(    
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,

  )
  {
    if (isPlatformBrowser(this.platformId)) {
      this.profileMode = localStorage.getItem('profile-mode') == null ? 'visitor' : localStorage.getItem('profile-mode')!
      this.lang_code = localStorage.getItem('front-lang') ==  null ? 'ar' : localStorage.getItem('front-lang')!
    }
  }

  handleImage(e:any){
    e.target.src = 'assets/images/placeholder2.jpg';
  }
}
