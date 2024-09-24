import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/notFound/notFound.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { CanActivateFn } from './services/authGuardFn';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { PageComponent } from './pages/page/page.component';
import { SupsscriptionsComponent } from './pages/supsscriptions/supsscriptions.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { GymDetailsComponent } from './pages/gym-details/gym-details.component';
import { FindGymComponent } from './pages/find-gym/find-gym.component';
import { PointsComponent } from './pages/points/points.component';
import { RedirectComponent } from './pages/redirect/redirect.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'page/:id', component: PageComponent },
  { path: 'supsscriptions', component: SupsscriptionsComponent },
  { path: 'find-gym', component: FindGymComponent },
  { path: 'gym/:id', component: GymDetailsComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'points', component: PointsComponent },
  { path: 'login' , canActivate:[CanActivateFn], component: LoginComponent },
  { path: 'signup' , canActivate:[CanActivateFn], component: SignupComponent },
  // { path: 'redirect' ,component: RedirectComponent },
  { path: 'forget-password' , canActivate:[CanActivateFn], component: ForgetPasswordComponent },
  { path: '**', component:NotFoundComponent },
];
