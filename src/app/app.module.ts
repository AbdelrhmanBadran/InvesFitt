import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule,HTTP_INTERCEPTORS, HttpClient,} from "@angular/common/http";
import {  SharedModule } from './shared/shared.module';
import { tokenIntecrptorInterceptor } from './token-intecrptor.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment.development';
import {initializeApp} from 'firebase/app';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
initializeApp(environment.firebase);


@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    BlankLayoutComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule ,
    HttpClientModule,
    
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: tokenIntecrptorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
