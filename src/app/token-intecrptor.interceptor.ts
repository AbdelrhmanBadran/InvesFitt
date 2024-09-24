
import { Inject, Injectable, Injector, PLATFORM_ID, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './shared/services/user.service';
import { CommonService } from './shared/services/common.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class tokenIntecrptorInterceptor implements HttpInterceptor {
  token: string = '';
    
  constructor(
    public authService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object,
    public common:CommonService,
  )
  {
    
  } 
  

  intercept(req: any, next: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.token  = localStorage.getItem('token') == null ? '':localStorage.getItem('token')!
    }
    const modifiedRequest = req.clone({
      headers: req.headers
      .set('User-Token', this.token)
      .set('lang', this.common.lang_code)
      .set('app-version' , '1.1.1')
    });

    return next.handle(modifiedRequest);

  }
}