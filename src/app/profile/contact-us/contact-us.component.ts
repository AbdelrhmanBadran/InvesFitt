import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {


    constructor(
      private translate: TranslateService,
      @Inject(PLATFORM_ID) private platformId: Object,

    )
    {
      if (isPlatformBrowser(this.platformId)) {
        this.translate.use(localStorage.getItem('front-lang') == null ? 'ar' : localStorage.getItem('front-lang')!)
      }
    }
}
