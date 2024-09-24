import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaciiltiesRoutingModule } from './faciilties-routing.module';
import { AllFaciltiesComponent } from './all-facilties/all-facilties.component';
import { HttpLoaderFactory, SharedModule } from '../shared/shared.module';
import { SingleFacilityComponent } from './single-facility/single-facility.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { PostDetailsComponent } from './post-details/post-details.component';
import {  HttpClientModule } from '@angular/common/http';
import { PostDialogComponent } from './post-dialog/post-dialog.component';
import { ProductDataComponent } from './post-dialog/product-data/product-data.component';
import { ImagetDataComponent } from './post-dialog/image-data/image-data.component';
import { VideotDataComponent } from './post-dialog/video-data/video-data.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';

@NgModule({
  declarations: [
    AllFaciltiesComponent,
    SingleFacilityComponent,
    PostDetailsComponent,
    PostDialogComponent,
    ProductDataComponent,
    ImagetDataComponent,
    VideotDataComponent,
  ],
  imports: [
    CommonModule,
    FaciiltiesRoutingModule,
    SharedModule,
    MatDividerModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }),
    MatListModule,
    HttpClientModule,
  ]

})
export class FaciiltiesModule { }
