import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Renderer2 } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { Sidebar } from 'primeng/sidebar';
import { ProfileServiceService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [ConfirmationService]

})
export class HeaderComponent {
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  sidebarVisible: boolean = false;
  langCode!:string;
  currentLang!:string
  userName!:string;
  userLogged:boolean = false;
  userData!:any;
  userToken: any;
  userImg: any = 'assets/images/user-img.png';
  userImgUrl: string='';
  allAccounts: any;
  profileMode = '';
  facilityImgUrl: string ='';
  account:any;
  headerImg: any;
  facilityName: any;
  accountName: any;
  cartNum:number = 0;
  sub: any;

  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2,
    public common:CommonService,
    private user : UserService,
    private profile : ProfileServiceService,
    private router:Router,
    private order:OrderService,
    private confirm: ConfirmationService,
    private message: MessageService,

    
  )
  {
    this.sub = this.order.cartNum.subscribe({
      next:res=>{
        console.log(res);
          this.cartNum = res
      }
    })
    this.user.userdata.subscribe({
      next: data =>{
        if(data !== null){          
          this.userLogged = true;
          localStorage.setItem('isVisitor' , 'false')
        }else{
          this.userLogged = false;
          this.getAllAccounts();
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('isVisitor' , 'true')
          }
        }
      }
    })
    this.common.updatefacility.subscribe(data=>{
      if (data) {
        this.getAllAccounts();
      }
    })
    
  }
  handleImage(e:any){
    e.target.src = this.userImg
  }
  closeCallback(e:any): void {
      this.sidebarRef.close(e);
  }


  ngOnInit(): void {
      if (isPlatformBrowser(this.platformId)) {
        this.profileMode = localStorage.getItem('profile-mode') == null ? 'visitor' : localStorage.getItem('profile-mode')!
      }
      this.userImgUrl = this.user.userImageUrl
      this.facilityImgUrl = this.user.facilityImageUrl

      // console.log(this.profileMode);
      this.getAllAccounts();

      if (isPlatformBrowser(this.platformId)) {
      
        this.langCode = localStorage.getItem('front-lang') == 'en' ? 'ar' : 'en'

        this.translate.use(localStorage.getItem('front-lang') == null ? 'ar' : localStorage.getItem('front-lang')!)
  
        this.currentLang = localStorage.getItem('front-lang') == 'ar' ? 'ع' : 'EN'; 
      }
    

    
  }

  getAllAccounts()
  {
    this.profile.getAllAccounts().subscribe({
      next:res=>{
        console.log(res);
        if(res?.success){
          this.allAccounts = res?.data
          this.userData = this.profileMode =='user' ? res?.data.filter((ele:any) => ele.page_type== 'user')[0] : res?.data.filter((ele:any) => ele.page_type== 'page')[0] 
          this.common.currentUser.next(this.userData)
          this.allAccounts.forEach((ele:any) => {
            if(ele.page_type == 'user'){
              ele['fullImg'] = this.user.userImageUrl + ele.img
              this.accountName = ele['user_name']
            }else{
              ele['fullImg'] = this.user.facilityImageUrl + ele.img
              this.facilityName = ele['user_name']
            }
            if(ele.page_type == 'page'){
              localStorage.setItem('pageId' , ele.id)
            }
          });
          // console.log(this.userData);
          this.userName = this.userData?.user_name
          this.headerImg = this.userData?.fullImg
          this.allAccounts.reverse();
          // console.log(this.allAccounts);
          

        }
      },
      error:err=>{
        console.log(err);
        
      }
    })
  }

  changeLanguage(code: string) {

      if (code == "ar") {
        this.langCode = 'en';
        this.renderer.setAttribute(document.documentElement, 'dir', 'rtl');
        this.renderer.setAttribute(document.documentElement, 'lang', 'ar');
        localStorage.setItem("front-lang", "ar");
        this.common.lang_code = 'ar';
        this.currentLang = 'ع';
      } else {
        this.renderer.setAttribute(document.documentElement, 'dir', 'ltr');
        this.renderer.setAttribute(document.documentElement, 'lang', 'en');
        this.langCode = 'ar';
        document.body.classList.add("ltr");
        localStorage.setItem("front-lang", "en");
        this.common.lang_code = 'en';
        this.currentLang = 'EN';
      }

      this.translate.use(code);
    
    location.reload();
  }

  logout(){
    if (isPlatformBrowser(this.platformId)) {      
      this.profile.logout().subscribe({
        next:res =>{
          console.log(res);
          if (res?.success) {
            localStorage.clear();
            this.router.navigate(['/other-route']).then(() => {
              window.location.reload();
            });
          }
        },
        error:err =>{
          console.log(err);
          
        }
      })
    }
  }

  changeProfileMode(account:any)
  {
      if (account.page_type == 'user' && this.profileMode == 'page') {
        this.profileMode = 'user'
        localStorage.setItem('token' , account.code)
        localStorage.setItem('profile-mode' , 'user')
        this.userData = account
        location.reload();
      }
      else if(account.page_type == 'page' && this.profileMode == 'user'){
        this.profileMode = 'page'
        localStorage.setItem('profile-mode' , 'page')
        localStorage.setItem('token' , account.code)
        this.userData = account
        location.reload();
      }
    
    
  }


  toggleLayer(){
    this.common.layerOn = !this.common.layerOn
  }
  goToAccount(){
    this.router.navigate(['/profile'])
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  confirm1(event: Event) {
    this.confirm.confirm({
        target: event.target as EventTarget,
        message: this.translate.instant('Are you sure that you want to proceed ?'),
        header: this.translate.instant('Confirmation'),
        icon: 'pi pi-exclamation-triangle',
        acceptIcon:"none",
        rejectIcon:"none",
        rejectButtonStyleClass:"p-button-text",
        accept: () => {
          this.logout()
        },
        reject: () => {
          this.toggleLayer()
        }
    });
  }

  confirm2(event: Event) {
    this.confirm.confirm({
        target: event.target as EventTarget,
        message: this.translate.instant('Are you sure that you want to proceed ?'),
        header: this.translate.instant('Confirmation'),
        icon: 'pi pi-exclamation-triangle',
        acceptIcon:"none",
        rejectIcon:"none",
        rejectButtonStyleClass:"p-button-text",
        accept: () => {
          this.logout()
        },
        reject: () => {
        }
    });
  }

  showSoonMessage(){
    this.translate.get('sooooon').subscribe(data=>{
      this.message.add({severity:'error' , detail:data})
    })  
  }


  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      let avatarImg = document?.querySelectorAll('.p-avatar img')
      avatarImg.forEach(img=>{
        this.renderer.setAttribute(img , 'alt' , 'user-img')
      })
    }
  }
}
