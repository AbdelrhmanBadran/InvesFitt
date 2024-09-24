import { Component, ElementRef, Renderer2 } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { countries } from 'country-data';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { getMessaging, getToken } from 'firebase/messaging';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  countryCodes:any ;
  countrykeys = new Set<string>() ;
  registerForm:FormGroup = new FormGroup('');
  deviceTokenId: string = '';
  allErrors:boolean = false;

  constructor(
    public common:CommonService,
    private form:FormBuilder,
    private user:UserService,
    private router:Router,
    private render:Renderer2,
    private el:ElementRef,
    private translate:TranslateService,
    private message:MessageService,
  ){
    countries.all.forEach(ele =>{
      if(ele.countryCallingCodes[0] && !this.countrykeys.has(ele.countryCallingCodes[0] )){
        this.countrykeys.add(ele.countryCallingCodes[0])
      }
      this.countryCodes = Array.from(this.countrykeys).sort();
    })  
  }
  ngAfterViewInit(): void {
    const passwordInput = this.el.nativeElement.querySelector('.password-input');    
    if(this.common.lang_code == 'ar' )
    {
      this.render.addClass(passwordInput, 'rtl');
    }
  }
  ngOnInit(): void {
    this.createFrom();
  }
  createFrom():void
  {
    this.registerForm = this.form.group({
      "full_name": ['' , [Validators.required , Validators.minLength(4)]],
      "email":[localStorage.getItem('email') , [Validators.required , Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
      "mobile":['' , [Validators.required , Validators.pattern(/^[0-9]+$/)]],
      "password": ['' , [Validators.required , Validators.minLength(6)]],
      "dial_code":['+20' , Validators.required],
      "country_symbol": "",
      "img": ""
    })
  }


  regsiter(data:FormGroup):void
  { 
    // if (data.valid) {
      // this.requestPermission();
      console.log(this.registerForm.get('full_name')?.getError('minlength'));
      console.log(this.registerForm.get('full_name')?.hasError('minlength'));
      
      this.user.register(data.value).subscribe({
        next:res =>{
          console.log(res);
          if(res.success){
            this.requestPermission();
            let data = JSON.stringify(res.data)
            localStorage.setItem('userData' , data)
            localStorage.setItem('token' , res.data.code)
            this.user.userdata.next('logged In')
            localStorage.setItem('profile-mode' , 'user')
            localStorage.setItem('deviceTokenId' , this.deviceTokenId)
            localStorage.setItem('isVisitor' , 'false');
            this.router.navigate(['/'])
          }else{
            this.translate.get(res?.error).subscribe(data=>{
              this.message.add({severity:'error' , detail:data})
            })
          }
        },
        error:err =>{
          console.log(err);
          
        }
      })
    // }
  }


  requestPermission(){
    const message = getMessaging();
    getToken(message , {vapidKey:environment.firebase.vpaidKey}).then(
      (currentToken)=>{
        if(currentToken){
          console.log(currentToken);
          this.deviceTokenId = currentToken
        }else{
          console.log('no token');
        }
      }
    )
  }
}
