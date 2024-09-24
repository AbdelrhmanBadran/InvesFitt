import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const userOrderGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const platformId = inject(PLATFORM_ID)
  if(isPlatformBrowser(platformId)){
    let pageId = localStorage.getItem('pageId')!
    if(localStorage.getItem('profile-mode') == 'user'){
      return true;
    }else{
      router.navigate(['/facility/details/' , pageId])
      return false
    }
  }else{
    return false
  }

};
