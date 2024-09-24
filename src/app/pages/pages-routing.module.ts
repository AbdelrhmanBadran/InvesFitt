import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { MainLoginComponent } from './main-login/main-login.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { NewPasswordComponent } from './auth/new-password/new-password.component';
import { mainLoginGuard } from '../shared/guards/main-login.guard';
import { newAccountGuard } from '../shared/guards/new-account.guard';

const routes: Routes = [
  {path:'' , redirectTo:'auth' , pathMatch:'full'},
  {path:'auth' , component:AuthComponent , children:[
    {path:'' , redirectTo:'main' , pathMatch:'full'},
    {path:'main' , component:MainLoginComponent},
    {path:'verify' , canActivate:[mainLoginGuard] , component:VerifyEmailComponent},
    {path:'login' , canActivate:[mainLoginGuard ] , component:LoginComponent},
    {path:'register' , canActivate:[mainLoginGuard ,newAccountGuard] , component:RegisterComponent},
    {path:'forget' , canActivate:[mainLoginGuard] , component:ForgetPasswordComponent},
    {path:'newPassowrd' , canActivate:[mainLoginGuard] , component:NewPasswordComponent},
    {path:'**' , redirectTo:'pages/auth'},
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
