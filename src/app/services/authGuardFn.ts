import { inject } from "@angular/core";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { LocalstorageService } from "./localstorage.service";
import { TranslateService } from "@ngx-translate/core";

export const CanActivateFn = ()=>{
  const localstorageService = inject(LocalstorageService);
  const router = inject(Router);
  const lang = inject(TranslateService);
  let currentUser =  JSON.parse(localstorageService.getItem('currentUser')!);  
  if (!currentUser) {
    return true;
  } else {
    Swal.fire({
      text:  lang.instant("Sorry, you are logged in. Please log out."),
      icon: "warning",
      confirmButtonColor: "#4d7f9f",
    })
    router.navigate(['/home'])
    return false;
  }
}
