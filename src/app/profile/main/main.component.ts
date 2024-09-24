import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { CommonService } from '../../shared/services/common.service';
import { ProfileServiceService } from '../../shared/services/profile.service';
import { NavigationEnd, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

  FullImageSrc: string ='';
  lastImg: any = null
  sidebarVisible= false;
  profileMode: boolean = true;
  facilityMode  : boolean = false;
  imageSrc:string = '';
  breadCrunbText:string = ''
  facilityDetails: any;
  facilityImg: any;
  lastFacilityImg: any;
  pageMode: boolean = false;
  constructor(
    public user:UserService,
    public common:CommonService,
    private profile:ProfileServiceService,
    private router:Router,
    private spinner: NgxSpinnerService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private translate:TranslateService

  ){    
    if (isPlatformBrowser(this.platformId)) {
      this.translate.use(localStorage.getItem('front-lang') == null ? 'ar' : localStorage.getItem('front-lang')!)
    }
    if (localStorage.getItem('profile-mode') == 'page' ) {
      this.pageMode = true
    }else{
      this.pageMode = false
    }
    console.log(this.pageMode);
    this.spinner.show()       
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        
        if(event.url.includes('facilityData')){
          this.facilityMode = true;
          this.profileMode = false;
          this.spinner.hide();
          this.breadCrunbText = 'Facility Data';
        }else if(event.url.includes('profileData')){
          this.facilityMode = false;
          this.profileMode = true;
          this.breadCrunbText = 'Profile Data';
          this.spinner.hide()       

        }else if(event.url.includes('langData')){
          this.facilityMode = false;
          this.profileMode = false;    
          this.breadCrunbText = 'Langauage';

          this.spinner.hide()       
        }
      }
    });
  }
  ngOnInit(): void {
    
    
    this.spinner?.show();
    if(this.router.url.includes('facilityData')){      
      this.breadCrunbText = 'Facility Data';
      this.facilityMode = true;
      this.profileMode = false;
    }else if(this.router.url.includes('profileData')){
      this.breadCrunbText = 'Profile Data';
      this.facilityMode = false;
      this.profileMode = true;
    }else if(this.router.url.includes('langData')){
      this.breadCrunbText = 'Langauage';
      this.facilityMode = false;
      this.profileMode = false;   
    }
    
    this.profile.getAllAccounts().subscribe(res=>{
      console.log(res);
      if(res?.success){
        res.data.forEach((ele:any) => {
          this.spinner?.hide();
          if(ele.page_type == 'user'){
            this.FullImageSrc = this.user.userImageUrl + ele?.img;      
            this.lastImg = ele?.img
            this.user.userImage.next(ele?.img)
          }else{
            localStorage.setItem('pageId' , ele?.id);
            this.lastFacilityImg = ele?.img
            this.user.facilityImage.next(ele?.img)
            this.facilityImg = this.user.facilityImageUrl +  ele?.img
            let obj ={
              page_id:ele?.id
            }
            this.profile.getProfileData(obj).subscribe(res=>{
              console.log(res);
              if (res?.success) {
                this.user.facilityData.next(res?.data)
                localStorage.setItem('FacilityData' , JSON.stringify(res?.data));

              }

            })
          }
        });
      }
    })

  }

  getUserImageSrc(e:any)
  {
    if(e.target.files){
      this.user.userImage.next(e.target.files[0]);
      this.user.LastImage.next(this.lastImg)
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.addEventListener('load' , (event:any)=>{
        this.FullImageSrc = event.target.result;
      })
    }
  }

  getFacilityImageSrc(e:any)
  {
    if(e.target.files){
      this.user.facilityImage.next(e.target.files[0]);
      this.user.LastFacilityImage.next(this.lastFacilityImg)
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.addEventListener('load' , (event:any)=>{
        this.facilityImg = event.target.result;
      })
    }
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
}
