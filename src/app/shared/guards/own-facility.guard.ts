import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const ownFacilityGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const platformId = inject(PLATFORM_ID)
  if(isPlatformBrowser(platformId)){
    if(localStorage.getItem('profile-mode') !== 'page'){
      return true;
    }else{
      router.navigate(['/profile/facilityData'])
      return false
    }
  }else{
    return false
  }
};
