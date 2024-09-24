import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';import { CommonService } from '../../shared/services/common.service';
import { UserService } from '../../shared/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent implements  OnInit{

  code:any
  constructor(
    public common:CommonService,
    private form:FormBuilder,
    private user:UserService,
    private router:Router,
    private renderer:Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
  ){

  }



  verifyForm:any;
  wrongCode:boolean = false;
  userEmail:string = ''
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {    
      this.createFrom();
      this.userEmail = localStorage.getItem('email')!
    }
  }
  createFrom():void
  {
    
    this.verifyForm = this.form.group({
      code:['' , [Validators.required]],
      email:[localStorage.getItem('email')!]
    })
  }

  verify(data:FormGroup):void
  {
    if (data.valid) {

      localStorage.setItem('resetCode' , this.verifyForm.value.code);
      this.user.verifyCode(data.value).subscribe({
        next:res =>{
          console.log(res);
          if(res.success == true){
            this.wrongCode = false
            this.router.navigate(['/pages/auth/register'])
          }else{
            this.wrongCode = true
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
    if(this.verifyForm.get('code')?.value.length == 6){
      this.verify(data)
    }
  }
}
