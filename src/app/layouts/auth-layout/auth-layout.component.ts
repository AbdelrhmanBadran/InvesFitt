import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService,
  ){
    
  }

  ngOnInit(): void {
    
    if (isPlatformBrowser(this.platformId)) {
      this.translate.use(localStorage.getItem('front-lang') == null ? 'ar' : localStorage.getItem('front-lang')!)
    }
  }
}
