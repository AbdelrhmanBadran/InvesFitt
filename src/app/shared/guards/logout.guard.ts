import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const logoutGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const platformId = inject(PLATFORM_ID)
  if(isPlatformBrowser(platformId)){
    if(localStorage.getItem('token') !== null){
      return true;
    }else{
      router.navigate(['/home'])
      return false;
    }
  }else{
    return false;
  }
};
