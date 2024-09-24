import { Component, Inject, PLATFORM_ID } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import { Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { getMessaging , getToken } from 'firebase/messaging';
import { environment } from '../environments/environment.development';
import { Router } from '@angular/router';
import { CommonService } from './shared/services/common.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'دليل السوق';

  constructor(
    private translate: TranslateService,
    private renderer: Renderer2,
    public common:CommonService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    translate.use('ar');

  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
    }
  }





  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      let lang_code = localStorage.getItem("front-lang") != null ? localStorage.getItem("front-lang") : "ar";
      localStorage.setItem( 'front-lang' , lang_code!)
      // localStorage.setItem( 'profile-mode' , 'visitor')
        if (localStorage.getItem('front-lang') == 'ar') {
          this.renderer.setAttribute(document.documentElement, 'dir', 'rtl');
          
          this.translate.setDefaultLang("ar");
          this.translate.addLangs(["en", "ar"]);
        }else{
          this.renderer.setAttribute(document.documentElement, 'dir', 'ltr');
          this.translate.setDefaultLang("ar");
          this.translate.addLangs(["en", "ar"]);
        }
      }
  }
}
