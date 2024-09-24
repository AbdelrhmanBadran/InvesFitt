import { HttpInterceptorFn } from '@angular/common/http';
import { getCurrentUserAuthenticationCode, getCurrentUserlang } from './utils';

export const addHeadersInterceptor: HttpInterceptorFn = (req, next) => {
  let time = new Date().getTime().toString();
  let modifiedReq = req.clone({
    headers: req.headers
            .set('Authorization', 'Bearer ' + getCurrentUserAuthenticationCode()),
    params: req.params
            .set('lang', getCurrentUserlang())
            .set('time' , time)
  });
  
  return next(modifiedReq);
};
