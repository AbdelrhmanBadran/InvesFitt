import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { HomeSearchComponent } from './home-search/home-search.component';
import { MainCategoriesComponent } from './main-categories/main-categories.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { HttpLoaderFactory, SharedModule } from '../shared/shared.module';
import {  HttpClientModule } from '@angular/common/http';
import { SubServicesComponent } from './sub-services/sub-services.component';
import { SearchComponent } from './search/search.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import { SearchDataComponent } from './search-data/search-data.component';

@NgModule({
  declarations: [
    HomeComponent,
    HomeSearchComponent,
    MainCategoriesComponent,
    AboutUsComponent,
    SubServicesComponent,
    SearchComponent,
    SearchDataComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }),
    SharedModule, 
  ],
})
export class HomeModule { }
