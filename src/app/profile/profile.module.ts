import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { MainComponent } from './main/main.component';
import { ProfileDataComponent } from './profile-data/profile-data.component';
import { FacilityDataComponent } from './facility-data/facility-data.component';
import { SharedModule } from '../shared/shared.module';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { LangDataComponent } from './lang-data/lang-data.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { MainProfileRoutingComponent } from './main-profile-routing/main-profile-routing.component';

@NgModule({
  declarations: [
    MainComponent,
    ProfileDataComponent,
    FacilityDataComponent,
    LangDataComponent,
    ContactUsComponent,
    MainProfileRoutingComponent,
    
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    MatDividerModule,
    MatListModule
  ]
})
export class ProfileModule { }
