import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { ownFacilityGuard } from './shared/guards/own-facility.guard';
import { homeFacilityGuard } from './shared/guards/home-facility.guard';
import { logoutGuard } from './shared/guards/logout.guard';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';

const routes: Routes = [
  {path :'' , redirectTo:'home' , pathMatch:'full' },
  {path:'' , component:BlankLayoutComponent , children:[
    {path :'home' , canActivate:[homeFacilityGuard] , loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
    {path :'orders'  , canActivate:[homeFacilityGuard] , loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule) },
    {path :'profile' , canActivate:[logoutGuard] , loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },
    {path :'facility' , loadChildren: () => import('./faciilties/faciilties.module').then(m => m.FaciiltiesModule) },
  ]},
  {path:'auth' , component:AuthLayoutComponent , children:[
    {path :'pages' , canActivate:[authGuard]  , loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) },
  ]},
  {path :'**' , redirectTo:'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes , {
    useHash: false,
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
