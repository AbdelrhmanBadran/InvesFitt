import { Component, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../shared/services/common.service';
import { isPlatformBrowser } from '@angular/common';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss'
})
export class NewPasswordComponent {

  code:any
  passwordInput: boolean = false;
  constructor(
    public common:CommonService,
    private form:FormBuilder,
    private user:UserService,
    private router:Router,
    private renderer:Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    private message: MessageService,
    private translateService: TranslateService
  ){

  }



  
  verifyForm:any;
  newPassowrdForm:any;
  wrongCode:boolean = false;
  userEmail:string = ''
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {    
      this.createFrom();
      this.userEmail = localStorage.getItem('ForgetEmail')!
    }
  }
  createFrom():void
  {
    
    this.verifyForm = this.form.group({
      code:['' , [Validators.required]],
      email:[localStorage.getItem('ForgetEmail')!]
    })

    this.newPassowrdForm = this.form.group({
      email:[localStorage.getItem('ForgetEmail')!],
      new_password:['' , Validators.required]
    })
  }

  verify(data:FormGroup):void
  {
    if (data.valid) {
      this.user.verifyCode(data.value).subscribe({
        next:res =>{
          console.log(res);
          if(res.success == true){
            this.wrongCode = false
            this.passwordInput = true
          }else{
            this.wrongCode = true;
            this.passwordInput = false

          }
        },
        error:err =>{
          console.log(err);
        }
      })
    }
  }

  resend(){
    let data = {
      email : this.verifyForm.value.email
    }
    this.user.mainRegister(data).subscribe({
      next:res => {

        console.log(res);
      },
    
      error:err => {
        console.log(err);
      }
    })
  }

  autoRedirectToVerifyCode(data:any):void
  {
    if(this.verifyForm.get('code').value.length == 6){
      this.verify(data)
    }
  }

  setNewPassword(data:any):void
  {
    let newData = {
      ...data.value,
      code : this.verifyForm.value.code
    }
    console.log(newData );
    if (data.valid) {
      this.user.updatePassword(newData).subscribe({
        next:res =>{
          console.log(res);
          if(res.success == true){
            localStorage.removeItem('ForgetEmail');
            let loginData = {
              email : data.value.email,
              password : data.value.new_password,
            }
            console.log(loginData);
            this.login(loginData)
          }else{
            // this.passwordInput = false
            this.message.add({ severity: 'error', summary: 'Error', detail: 'some thimg went wrong plase enter another password' });
          }
        },
        error:err =>{
          console.log(err);
        }
      })
    }
  }

  login(data:any):void
  { 
    this.user.login(data).subscribe({
      next:res =>{
        console.log(res);
        if(res.success){
          let data = JSON.stringify(res.data)
          localStorage.setItem('userData' , data)
          this.user.userdata.next(res.data)
          this.router.navigate(['/'])
        }
      },
      error:err =>{
        console.log(err);
      }
    })
  }
}
