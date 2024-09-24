import { Component } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  
  constructor(
    public common:CommonService,
    private form:FormBuilder,
    private user:UserService,
    private router:Router,
    private message: MessageService,
    private translateService: TranslateService
  ){

  }

  ForgetForm:FormGroup = new FormGroup('');

  ngOnInit(): void {
    this.createFrom();
  }
  createFrom():void
  {
    this.ForgetForm = this.form.group({
      email:[localStorage.getItem('email') , [Validators.required , Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
    })
  }

  forget(data:FormGroup):void
  { 
    if (data.valid) {
      localStorage.setItem('ForgetEmail' , this.ForgetForm.value.email)
      this.user.forgetPassword(data.value).subscribe({
        next:res =>{
          console.log(res);
          if(res.success){
            this.router.navigate(['/pages/auth/newPassowrd'])
            this.message.add({ severity: 'success', summary: 'success', detail: 'check your email'});
          }else{
            console.log('cc');  
            this.message.add({ severity: 'error', summary: 'Error', detail: 'email not exist' });
          
          }
        },
        error:err =>{
          console.log(err);
        }
      })
    }
  }
}
