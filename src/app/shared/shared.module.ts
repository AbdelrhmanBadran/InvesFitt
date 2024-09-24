import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { FooterComponent } from './components/footer/footer.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputOtpModule } from 'primeng/inputotp';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { PasswordModule } from 'primeng/password';
import {MatStepperModule} from '@angular/material/stepper';
import { CarouselModule } from 'primeng/carousel';
import { StepperModule } from 'primeng/stepper';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { RatingModule } from 'primeng/rating';
import { DialogModule } from 'primeng/dialog';
import {MatMenuModule} from '@angular/material/menu';
import { AccordionModule } from 'primeng/accordion';
import { SkeletonModule } from 'primeng/skeleton';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from "ngx-spinner";
import { ListboxModule } from 'primeng/listbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { GoogleMapsModule } from '@angular/google-maps'
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AllPostsComponent } from './components/all-posts/all-posts.component';
import { ImageModule } from 'primeng/image';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    AllPostsComponent
  ],
  imports: [
  CommonModule,
  MatIconModule,
  MatButtonModule,
  AvatarModule,
  AvatarGroupModule,
  SidebarModule,
  ButtonModule,
  TranslateModule.forRoot({
    loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
    }
  }),
  OverlayPanelModule,
  MatInputModule,
  MatFormFieldModule,
  DropdownModule,
  InputNumberModule,
  FormsModule,
  ReactiveFormsModule,
  InputOtpModule,
  InputMaskModule,
  InputTextModule,
  RouterModule,
  ToastModule,
  MessagesModule,
  PasswordModule,
  MatStepperModule,
  CarouselModule,
  StepperModule,
  CardModule ,
  TabViewModule,
  MatDividerModule,
  MatListModule,
  RatingModule,
  DialogModule,
  MatMenuModule,
  AccordionModule,
  SkeletonModule,
  InfiniteScrollModule,
  NgxSpinnerModule,
  ListboxModule ,
  InputTextareaModule,
  GoogleMapsModule,
  DynamicDialogModule,
  CascadeSelectModule,
  ConfirmDialogModule,
  FloatLabelModule,
  InputIconModule,
  IconFieldModule,
  ImageModule,
  TooltipModule
  
  ],
  exports: [
    CommonModule,
    TranslateModule,
    HeaderComponent,
    AllPostsComponent,
    FooterComponent,
    MatIconModule,
    MatButtonModule,
    AvatarModule,
    AvatarGroupModule,
    SidebarModule,
    ButtonModule,
    MatInputModule,
    MatFormFieldModule,
    DropdownModule,
    InputNumberModule,
    FormsModule,
    ReactiveFormsModule,
    InputOtpModule,
    InputMaskModule,
    InputTextModule,
    ToastModule,
    MessagesModule,
    PasswordModule,
    MatStepperModule,
    CarouselModule,
    StepperModule,     
    CardModule,
    TabViewModule,
    RatingModule,     
    DialogModule,
    MatMenuModule,
    AccordionModule,
    SkeletonModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    ListboxModule,
    InputTextareaModule,
    GoogleMapsModule,
    OverlayPanelModule,
    DynamicDialogModule,
    CascadeSelectModule,
    ConfirmDialogModule,
    FloatLabelModule,
    InputIconModule,
    IconFieldModule,
    ImageModule,
    TooltipModule
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [MessageService]
})
export class SharedModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}