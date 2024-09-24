import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllFaciltiesComponent } from './all-facilties/all-facilties.component';
import { SingleFacilityComponent } from './single-facility/single-facility.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { ownFacilityGuard } from '../shared/guards/own-facility.guard';

const routes: Routes = [
  {path:'all/:id/:name' , canActivate: [ownFacilityGuard] ,  component:AllFaciltiesComponent},
  {path:'details/:pageId' , component:SingleFacilityComponent},
  {path:'post/:postId' , component:PostDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaciiltiesRoutingModule { }
