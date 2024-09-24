import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { ProfileDataComponent } from './profile-data/profile-data.component';
import { FacilityDataComponent } from './facility-data/facility-data.component';
import { LangDataComponent } from './lang-data/lang-data.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { MainProfileRoutingComponent } from './main-profile-routing/main-profile-routing.component';
import { ownFacilityGuard } from '../shared/guards/own-facility.guard';

const routes: Routes = [
  {path:'' , component:MainProfileRoutingComponent , children:[
    {path:'' , component:MainComponent , children:[
    {path:'' ,redirectTo:'profileData' , pathMatch:'full'},
      {path:'profileData' , canActivate:[ownFacilityGuard] , component:ProfileDataComponent},
      {path:'facilityData' , component:FacilityDataComponent},
      {path:'langData' , component:LangDataComponent},
    ]},
    {path:'contactUs' , component:ContactUsComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
