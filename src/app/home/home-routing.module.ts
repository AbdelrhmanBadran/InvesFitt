import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SubServicesComponent } from './sub-services/sub-services.component';
import { ownFacilityGuard } from '../shared/guards/own-facility.guard';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {path:'' , component:HomeComponent },
  {path:'sub/:id/:name'  , component:SubServicesComponent },
  {path:'search'  , component:SearchComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
