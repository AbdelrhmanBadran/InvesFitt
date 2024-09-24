import { Component } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-login',
  templateUrl: './main-login.component.html',
  styleUrl: './main-login.component.scss'
})
export class MainLoginComponent {


  constructor(
    public common:CommonService,
    private form:FormBuilder,
    private user:UserService,
    private router:Router
  ){

  }
  loginForm!:FormGroup;

  ngOnInit(): void {
    this.createFrom();
  }
  createFrom():void
  {
    this.loginForm = this.form.group({
      email:['' , [Validators.required , Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
    })
  }

  login(data:FormGroup):void
  { 
    if (data.valid) {
      localStorage.setItem('email' , this.loginForm.value.email)
      this.user.mainRegister(data.value).subscribe({
        next:res =>{
          console.log(res);
          if(res?.message === 'sended_email'){
            this.router.navigate(['/pages/auth/verify'])
            localStorage.setItem('main-login' , res?.message )
          }else if(res?.message === 'go_to_login'){
            this.router.navigate(['/pages/auth/login'])
            localStorage.setItem('main-login' , res?.message )
          }
        },
        error:err =>{
          console.log(err);
        }
      })
    }
  }
}
