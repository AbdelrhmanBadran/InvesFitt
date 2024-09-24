import { Component, ElementRef, Inject, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { countries } from 'country-data';
import { isPlatformBrowser } from '@angular/common';
import { Password } from 'primeng/password';
import { ProfileServiceService } from '../../shared/services/profile.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-profile-data',
  templateUrl: './profile-data.component.html',
  styleUrl: './profile-data.component.scss'
})
export class ProfileDataComponent {
  keys: any[]  = [];
  countryCodes:any ;
  countrykeys = new Set<string>() ;

  EditProfileForm:FormGroup = new FormGroup('');
  img: any = '';
  lastImg: any = null;
  profileData: any;

  constructor(
    public common:CommonService,
    private form:FormBuilder,
    private user:UserService,
    private profile:ProfileServiceService,
    private router:Router,
    private render:Renderer2,
    private activate:ActivatedRoute,
    private spinner: NgxSpinnerService,
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ){
    countries.all.forEach(ele =>{
      if(ele.countryCallingCodes[0] && !this.countrykeys.has(ele.countryCallingCodes[0] )){
        this.countrykeys.add(ele.countryCallingCodes[0])
      }
      this.countryCodes = Array.from(this.countrykeys).sort();
    })  
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      
    }
    this.spinner.show()

    this.user.userImage.subscribe(res=>{
      this.img = res
    })
    this.user.LastImage.subscribe(res=>{      
      this.lastImg = res
    })
    
    
    this.createFrom();
    this.profile.getProfileData('').subscribe(res=>{
      console.log(res);
      // this.spinner.hide()
    })
    
  }

  ngAfterViewInit(): void {
    const form = this.el.nativeElement.querySelector('.form');
    const telElePlaceholder = this.el.nativeElement.querySelector('input[type="tel"]');
    
    if(this.common.lang_code == 'ar')
    {
      this.render.addClass(form, 'rtl');
      this.render.setStyle(telElePlaceholder, 'text-align', 'right');
    }
  }

  createFrom():void
  {
    let email = localStorage.getItem('email')!
    let userData = JSON.parse(localStorage.getItem('userData')!)
    this.EditProfileForm = this.form.group({
      "full_name": [userData?.user_name , [Validators.required , Validators.minLength(4)]],
      "email":[email],
      "mobile": [userData?.mobile , ],
      "new_password": [null ],
      "old_password": [null ],
      "dial_code":[userData?.dial_code ],
      "country_symbol": [null],
      "img": [this.img],
      "last_image": [null]
    })
  }

  editProfile(data:FormGroup){
    console.log(this.img);
    console.log(this.lastImg);
    
    let formData = new FormData();
    if(typeof this.img !== 'string'){
      formData.append('file' ,this.img , this.img.name )
      
    }
    this.user.uploadImage(formData , 'users').subscribe({
      next:res=>{
        console.log(res);
        this.spinner.show();
        if(res?.newname){
          data.value['img'] = res.newname
        }else{
          data.value['img'] = this.img
        }
  
        data.value['last_image'] = this.lastImg
        console.log(data.value);
        
          this.profile.editProfile(data.value).subscribe({
            next:res =>{
              console.log(res);
              this.spinner.hide();
              if(res?.success){
                localStorage.setItem('userData' , JSON.stringify(res?.data))
                this.user.userdata.next(JSON.stringify(res?.data))
              } 
            },
            error:err =>{
              console.log(err);
              this.spinner.hide();
            }
          })
      },
      error:err=>{
        console.log(err);
        this.spinner.hide();
      }
    }
  );
  }  
}
