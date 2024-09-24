import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { AuthComponent } from './auth/auth.component';
import { MainLoginComponent } from './main-login/main-login.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { NewPasswordComponent } from './auth/new-password/new-password.component';


@NgModule({
  declarations: [
    AuthComponent,
    MainLoginComponent,
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    VerifyEmailComponent,
    NewPasswordComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    HttpClientModule,
    SharedModule
  ]
})
export class PagesModule { }
