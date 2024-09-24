import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { ServicesService } from '../../shared/services/services.service';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-all-facilties',
  templateUrl: './all-facilties.component.html',
  styleUrl: './all-facilties.component.scss'
})
export class AllFaciltiesComponent {
  token: string = '';
  serviceImageBaseurl: string = '';
  allFacilties: any[] = [];
  facilityImageBaseurl: string = '';
  lat!: number;
  lon!: number;
  noData: boolean = false;
  dataDone:boolean = false;
  loading:boolean = true;
  categoryName: string = '';
  constructor(
    public common:CommonService,
    private service:ServicesService,
    private activate:ActivatedRoute,
    private router:Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,


  ){
    // this.translate.use(this.common.lang_code);

    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('token')!;
      this.translate.use(localStorage.getItem('front-lang') == null ? 'ar' : localStorage.getItem('front-lang')!)

    }
  }
  
  ngOnInit(): void {
    this.spinner.show();
    this.serviceImageBaseurl = this.common.serviceImageUrl
    this.facilityImageBaseurl = this.service.facilityImageUrl
    this.activate.paramMap.subscribe(data =>{
      let ParentId = data.get('id')!
      this.categoryName = data.get('name')!
      
      navigator.geolocation.getCurrentPosition((position) => {
        
        this.lat = position.coords.latitude;

        this.lon = position.coords.longitude
        
        console.log(position);
      })
      console.log(this.allFacilties);
        
      setTimeout(() => {
        
        this.service.GetAllPageAccs(ParentId , this.lat , this.lon).subscribe({
          next:res =>{
            console.log(res);
        if (res?.success) {            
          this.allFacilties = res?.data;
          this.noData = false
          this.loading = false

        }else{
          this.allFacilties = [];
          this.noData = true
          this.loading = false

        }
        // this.spinner.hide();
      },error:err =>{
        console.log(err);
        this.spinner.hide();
        this.noData = true
        this.loading = false

      }
        })
      }, 1000);
    });
  }

  handleImage(e:any){
    e.target.src = 'assets/images/placeholder2.jpg'
  }

  
}
