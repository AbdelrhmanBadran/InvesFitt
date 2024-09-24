import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { isPlatformBrowser } from '@angular/common';
import { ServicesService } from '../../shared/services/services.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sub-services',
  templateUrl: './sub-services.component.html',
  styleUrl: './sub-services.component.scss'
})
export class SubServicesComponent {
  token: string = '';
  AllServices: any = [];
  serviceImageBaseurl: string = '';
  subServices: any[] = [];
  noData:boolean = false;
  dataDone:boolean = false;
  loading:boolean = true;
  categoryName: string = '';
  facilityImageBaseurl: string = '';
  
  constructor(
    public common:CommonService,
    private service:ServicesService,
    private activate:ActivatedRoute,
    private router:Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,


  ){
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('token')!;
      this.translate.use(localStorage.getItem('front-lang') == null ? 'ar' : localStorage.getItem('front-lang')!)

    }
  }
  
  ngOnInit(): void {
    this.spinner.show();
    this.serviceImageBaseurl = this.common.serviceImageUrl;
    this.facilityImageBaseurl = this.service.facilityImageUrl

    this.activate.paramMap.subscribe(data =>{
      let ParentId = data.get('id')!
      this.categoryName = data.get('name')!
      console.log(ParentId);
      this.service.getSubServices(ParentId).subscribe({
        next:res =>{
          console.log(res);
          if (res?.success) {            
            this.subServices = res?.data;
            this.dataDone = true
            this.loading = false;
          }else{
            this.noData = true
            this.loading = false;
          }
          this.spinner.hide();
        },error:err =>{
          console.log(err);
          this.noData = true
          this.loading = false;
          this.spinner.hide();
          
        }
      })
      
    })
    
  }
}
