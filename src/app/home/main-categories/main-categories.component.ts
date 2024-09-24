import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { isPlatformBrowser } from '@angular/common';
import { ServicesService } from '../../shared/services/services.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-main-categories',
  templateUrl: './main-categories.component.html',
  styleUrl: './main-categories.component.scss'
})
export class MainCategoriesComponent {
  token: string = '';
  AllServices: any;
  serviceImageBaseurl:string = '';
  dataDone:boolean = false
  items = [1,2,3,4]

  constructor(
    public common:CommonService,
    public service:ServicesService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private spinner:NgxSpinnerService
  ){
    if(isPlatformBrowser(this.platformId)){
      this.token = localStorage.getItem('token') == null ? '' : localStorage.getItem('token')!;
    }
    
  }
  ngOnInit(): void {
    this.spinner.show()

    this.serviceImageBaseurl = this.common.serviceImageUrl
      this.service.getAllServices().subscribe({
        next:res => {
          console.log(res); 
          if (res == null) {
            // location.reload();
          }
          if(res?.success){
            this.AllServices = res?.data;
            this.dataDone = true;
          }
          this.spinner.hide()
        },
        error:err =>{
          console.log(err);
          this.spinner.hide()
          
        }
      })
    
  }
}
