import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { HeaderAnimationDirective } from '../../directives/header-animation.directive';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule } from '@angular/router';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LocalstorageService } from '../../services/localstorage.service';
import { User } from 'firebase/auth';
import { CommonApiService } from '../../services/common-api.service';
import { environment } from '../../services/config';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    HeaderAnimationDirective,
    NgbDropdownModule,
    RouterModule,
    CommonModule,
    TranslateModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  languages = ['French', 'English' , "Arabic"];
  selectedLanguage: string = 'English';

  isUserValid: boolean = true ;
  @ViewChild('navMenue') navMenue!: ElementRef;
  public emviroment = environment
  subscription: Subscription;
  subscriptionUser: Subscription;
  userData: any;
  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router,
    private localStorage: LocalstorageService,
    private common: CommonApiService,
    @Inject(PLATFORM_ID) private platformId: Object

  ) {}
  ngOnInit(): void {
    const lang = this.localStorage.getItem('selectedLanguage') || 'English';
    this.selectedLanguage = lang;
    this.userData = JSON.parse(this.localStorage.getItem('currentUser'))

    if (this.userData) {
      this.authService.setUserValidity(true)
    }else{
      this.authService.setUserValidity(false)
    }
    
    this.subscription = this.authService.isUserValid.subscribe((isValid) => {
      this.userData = JSON.parse(this.localStorage.getItem('currentUser'))
      this.isUserValid = isValid;
    });
    
    this.subscriptionUser = this.common.userUpdated.subscribe((res) => {
      if (res == 'update') {
        this.userData = JSON.parse(this.localStorage.getItem('currentUser'))
      }
    });

  }
  handleImageError(e)
  {
    e.target.src ='assets/images/user.jpg'
  }
  selectLanguage(language: string) {
    this.selectedLanguage = language;
    let lang = language == 'English' ? 'EN' : 'AR';
    this.translate.use(lang);
    if(this.selectedLanguage === 'عربي'){
      this.setDirection('rtl');
    }
    else{
      this.setDirection('ltr');
    }
    this.localStorage.setItem('selectedLanguage', this.selectedLanguage);
    this.common.langUpdated.next('update');
  }

  ToggleSideMenu() {
    this.navMenue.nativeElement.classList.toggle('open');
  }
  CloseSideMenu() {
    this.navMenue.nativeElement.classList.remove('open');
  }
  LogOut() {
    this.authService.LogOut();
    this.router.navigate(['login']);
  }

  NavigatTo(url:string , params?:any){
    this.router.navigateByUrl(`/${url}`);
    this.CloseSideMenu()
  }

  setDirection(direction: 'ltr' | 'rtl') {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.setAttribute('dir', direction);
    }
  }

  logoutWithSocial()
  { 
    return this.authService.signOut();
  }


}
