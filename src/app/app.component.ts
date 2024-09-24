import { Component, Inject, inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterLink,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ScrollTopDirective } from './directives/scroll-top.directive';
import { LocalstorageService } from './services/localstorage.service';
import { CommonApiService } from './services/common-api.service';
import { getCurrentUser, getCurrentUserId } from './services/utils';
import { Meta } from '@angular/platform-browser';
import { ContactInfo } from './interfaces/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet,
    TranslateModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    ScrollTopDirective,
  ],
})
export class AppComponent {
  title = 'InvesFit';
  showLoader = false;
  constructor(
    private translate: TranslateService,
    private router: Router,
    private localStorage: LocalstorageService,
    private common: CommonApiService,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId,
    private meta:Meta
  ) {}
  ngOnInit() {
    this.showLoader = true

    //updata points
    this.getOneUser();
    this.getContactInfo();
    
    //change language
    const selectedLanguage = this.localStorage.getItem('selectedLanguage') || 'English';
    if (getCurrentUser()) {
      this.localStorage.setItem('currentUser',JSON.stringify(getCurrentUser())); 
    }
    let lang = selectedLanguage == 'English' ? 'EN' : 'AR';
    this.translate.setDefaultLang(lang);
    if (isPlatformBrowser(this.platformId)) {
      if(lang === "AR"){
        document.documentElement.setAttribute('dir', 'rtl');
      }
      else{
        document.documentElement.setAttribute('dir', 'ltr');
      }
    }

    this.localStorage.setItem('selectedLanguage', selectedLanguage);

    //show loading indicator
    this.router.events.subscribe((event) => {
      
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        if (isPlatformBrowser(this.platformId)) {
          window.setTimeout(() => {
            this.showLoader = false;
            }, 1000); // 1 second
            window.scrollTo(0, 0);
          }
        }
    });
  }

  getOneUser()
  {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart && getCurrentUserId() != null) {
        this.common.getOnUser().subscribe({
          next: (res) => {
            if (res.status == 200) {
              this.localStorage.setItem('currentUser',  JSON.stringify(res?.data))
            }
          },
          error: (err) => {
            console.log(err);
          }
        })
      }
    })
  }

  getContactInfo()
  {
    this.showLoader = true
    this.common.getContactInfo().subscribe({
      next: (res) => {
        if (res.status == 200) {
          this.common.contactInfo.next(res.data);
          let data:ContactInfo = res?.data
          this.meta.addTag({name:'keywords',content:data?.site_keywords})
          this.meta.addTag({property:'description',content:data?.site_desc})
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
