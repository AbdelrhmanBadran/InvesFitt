import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const homeFacilityGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const platformId = inject(PLATFORM_ID)
  let pageId = ''
  let profileMode = ''
  if(isPlatformBrowser(platformId)){
    pageId = localStorage.getItem('pageId')!
    profileMode = localStorage.getItem('profile-mode')!
  }
  if(profileMode !== 'page'){
    return true;
  }else{
    router.navigate(['/facility/details/' , pageId])
    return false
  }

};
