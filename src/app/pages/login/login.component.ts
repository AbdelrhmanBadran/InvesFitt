import { Component, ElementRef, Renderer2 } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment.development';
import { getMessaging, getToken } from 'firebase/messaging';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  hide : boolean = true;
  loginForm!: FormGroup;
  passwordError: boolean = false;
  emailError: boolean = false;
  deviceTokenId: string = '';
  
  constructor(
    public common:CommonService,
    private form:FormBuilder,
    private user:UserService,
    private router:Router,
    private message: MessageService,
    private translateService: TranslateService,
    private render:Renderer2,
    private el:ElementRef,
  ){

  }

  ngOnInit(): void {
    this.createFrom();
  }
  ngAfterViewInit(): void {
    const passwordInput = this.el.nativeElement.querySelector('.password-input');    
    if(this.common.lang_code == 'ar' )
    {
      this.render.addClass(passwordInput, 'rtl');
    }
  }
  createFrom():void
  {
    this.loginForm = this.form.group({
      "email":[localStorage.getItem('email') , [Validators.required , Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
      "password": ['' , Validators.required],
    })
  }

  login(data:FormGroup):void
  { 
    if (data.valid) {
      // this.requestPermission();
      this.user.login(data.value).subscribe({
        next:res =>{
          console.log(res);
          if(res.success){
            this.passwordError = false;
            this.emailError = false
            let data = JSON.stringify(res.data)
            localStorage.setItem('userData' , data)
            localStorage.setItem('token' , res.data.code)
            this.user.userdata.next('logged In')
            localStorage.setItem('profile-mode' , 'user')
            localStorage.setItem('deviceTokenId' , this.deviceTokenId);
            localStorage.setItem('isVisitor' , 'false');
            this.router.navigate(['/home'])
          }else if(res.error == 'Incorrect_Password'){
            this.passwordError = true;
            this.emailError = false
            this.translateService.get('Password is incorrect' , 'Error').subscribe((translations: any) => {
              this.message.add({ severity: 'error', summary: 'Error', detail: translations });
          });

          }else if(res.error == 'Email_Not_Exist'){
            this.passwordError = false;
            this.emailError = true
            this.translateService.get('Email is not exist').subscribe((translations: any) => {
              this.message.add({ severity: 'error', summary: 'Error', detail: translations });
          });
          }else{
            this.passwordError = false;
            this.emailError = false
          }
        },
        error:err =>{
          console.log(err);
        }
      })
    }
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
