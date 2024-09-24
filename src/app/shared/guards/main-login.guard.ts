import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const mainLoginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const platformId = inject(PLATFORM_ID)
  if(isPlatformBrowser(platformId)){
    if(localStorage.getItem('main-login') == 'sended_email' || localStorage.getItem('main-login') == 'go_to_login'){
      return true;
    }else{
      router.navigate(['/pages/auth/main'])
      return false;
    }
  }else{
    return false;
  }  
};
