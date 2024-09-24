import { Component, ElementRef, Inject, PLATFORM_ID, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfileServiceService } from '../../shared/services/profile.service';
import { UserService } from '../../shared/services/user.service';
import { CommonService } from '../../shared/services/common.service';
import {  isPlatformBrowser } from '@angular/common';
import { countries } from 'country-data';
import { ServicesService } from '../../shared/services/services.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-facility-data',
  templateUrl: './facility-data.component.html',
  styleUrl: './facility-data.component.scss'
})
export class FacilityDataComponent {
  @ViewChildren('ImageContainer') ImageContainer!:QueryList<any>
  facilityForm:FormGroup = new FormGroup('')
  img: any;
  LastFacilityImage: any;

  display:any;
  zoom = 8;
  mapMode= false
  center!: google.maps.LatLngLiteral;
  options:any = {
    mapTypeId: 'roadmap'
  };
  markers:any;
  markersOptions:any = {draggable:false}
  markersPostion: any;
  locationDetails: any;
  countryCodes:any ;
  countrykeys = new Set<string>() ;
  facilityDetails: any ={};
  serviceImageBaseurl: string = '';
  AllServices: any[] = [];
  serviceMode: boolean = false;
  selectedService: any;
  accur: number = 0;
  constructor(
    public common:CommonService,
    private form:FormBuilder,
    private user:UserService,
    private profile:ProfileServiceService,
    private service:ServicesService,
    private router:Router,
    private render:Renderer2,
    private activate:ActivatedRoute,
    private spinner: NgxSpinnerService,
    private el: ElementRef,
    private message: MessageService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService,

  ){
  
  }
  ngOnInit(): void {

    countries.all.forEach(ele =>{
      if(ele.countryCallingCodes[0] && !this.countrykeys.has(ele.countryCallingCodes[0] )){
        this.countrykeys.add(ele.countryCallingCodes[0])
      }
      this.countryCodes = Array.from(this.countrykeys).sort();
    })  
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude ,
        lng: position.coords.longitude,
      };
      this.accur = position.coords.accuracy;
      if (position.coords.accuracy <= 100) {
        this.markersPostion = {
          lat: position.coords.latitude ,
          lng: position.coords.longitude,
        };
      }
      console.log(position);
    });
    
    if (isPlatformBrowser(this.platformId)) {
      this.user.facilityImage?.subscribe(res=>{
        this.img = res
      })
      this.user.LastFacilityImage?.subscribe(res=>{      
        this.LastFacilityImage = res
      })
      // this.center = {lat:31 , lng:31}
      
      this.createFrom();



    }
    
  }


  ngAfterViewInit(): void {
    const form = this.el.nativeElement.querySelector('.form');
    const telElePlaceholder = this.el.nativeElement.querySelector('input[type="tel"]');
    
    if(this.common.lang_code == 'ar')
    {
      this.render.addClass(form, 'rtl');
      this.render.addClass(telElePlaceholder, 'input-rtl');
    }
  }

  createFrom():void
  {
    this.user.facilityData.subscribe(res=>{
      console.log(res);
      if (res) {
        this.facilityDetails = res
      }
      console.log(this.facilityDetails);
      this.facilityForm = this.form.group({
        "user_name": [this.facilityDetails?.user_name, [Validators.required , Validators.minLength(4)]],
        "services_id":[this.facilityDetails?.service_name , [Validators.required]],
        "mobile": [this.facilityDetails?.mobile , [Validators.required]],
        "descr": [this.facilityDetails?.description  , [Validators.required]],
        "address": [this.facilityDetails?.address , [Validators.required]],
        "lat": [this.facilityDetails?.lat , [Validators.required]],
        "lon": [this.facilityDetails?.lon , [Validators.required]],
        "page_id": [this.facilityDetails?.page_id , [Validators.required]],
        "dial_code":[this.facilityDetails?.dial_code ? this.facilityDetails?.dial_code : '+20'  , [Validators.required]],
        "img": [this.img , [Validators.required]],
        "last_image": [null],
        "country_symbol": "EG",
      })
    })
  }

  addMarker(e:any){
    this.markersPostion = e.latLng.toJSON();
    console.log(this.markersPostion);
    
    this.getLocationDetails(this.markersPostion.lat , this.markersPostion.lng);

  }

  getLocationDetails(lat:any,lon:any)
  {
    const geocodingUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
    let apiKey= 'AIzaSyAMUS_eH_E0_qPzIuweJL_NWuRKoI8lj0w';

    const url = `${geocodingUrl}?latlng=${lat},${lon}&key=${apiKey}`;
    console.log(this.accur);
    
    if(this.accur > 1000)
    {
      this.translate.get('Signal is very bad please enter your location manually').subscribe((message: string) => {
        this.message.add({ severity: 'error', detail: message});
    });
    }
    this.accur = 0
    fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data && data.results && data.results.length > 0) {
        console.log(data.results[0]);
        this.locationDetails =data?.results[0].formatted_address;
      }        
    })
    .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
    });
  }

  saveLocation(){
    console.log(this.locationDetails);
    if(this.facilityDetails){
      this.facilityDetails['address'] = this.locationDetails
    }
    this.facilityForm.get('address')?.setValue(this.locationDetails);
    this.facilityForm.get('lat')?.setValue(this.markersPostion.lat);
    this.facilityForm.get('lon')?.setValue(this.markersPostion.lng);
    this.mapMode = false;
    
  }

  showMap()
  {
    this.getLocationDetails(this.center?.lat , this.center?.lng);
    this.mapMode = true
  }

  addOrEditFacility(EditProfileForm:any){
    this.spinner.show()
    console.log(this.img);
    
    let formData = new FormData();
    if(typeof this.img !== 'string'){
      formData.append('file' ,this.img , this.img.name )
      
    }
    this.user.uploadImage(formData , 'facility').subscribe({
      next:res=>{
        console.log(res);
        if(res?.newname){
          this.facilityForm.value['img'] = res.newname
        }else{
          this.facilityForm.value['img'] = this.img
          this.translate.get('please try again').subscribe(data=>{
            this.message.add({severity:'error' , detail:data})
          })
          this.spinner.hide()
          return;
        }
        
        this.facilityForm.value['last_image'] = this.LastFacilityImage
        this.facilityForm.value['services_id'] = this.facilityDetails?.service_id
        
        console.log(this.facilityForm.value);
        this.profile.addOrEditFacility(this.facilityForm.value).subscribe({
          next:res =>{
            console.log(res);
            this.spinner.hide();
            if(res?.success){
              this.common.updatefacility.next('update');
              localStorage.setItem('FacilityData' , JSON.stringify(this.facilityForm.value));
              this.translate.get('operation completed').subscribe((message: string) => {
                this.message.add({ severity: 'success', detail: message});
              });
            }else{
              this.translate.get('please try again').subscribe(data=>{
                this.message.add({severity:'error' , detail:data})
              })
            }
            this.spinner.hide();
          },
          error:err =>{
            console.log(err);
            this.spinner.hide();
          }
        })
          
      },
      error:err=>{
        console.log(err);
        this.spinner.hide();

      }
    });
    
  }

  showServices(){
    this.serviceMode = true;
    this.spinner.show();
    this.serviceImageBaseurl = this.common.serviceImageUrl
    this.service.getAllServices().subscribe({
    next:res => {
      console.log(res); 
      if(res?.success){
        this.AllServices = res?.data; 
        console.log(this.AllServices);
      }
      this.spinner.hide()
    },
    error:err =>{
      console.log(err);
      this.spinner.hide()
      
    }
  })
  }
  
  selectService(id:string , i:number){
    let service = this.AllServices.filter(ser=>ser.id == id)[0];
    this.ImageContainer.forEach((ele)=>{
        this.render.removeClass(ele.nativeElement , 'p-3');
    })
    let servElement = this.ImageContainer.filter((ele , index) => index == i)[0]
    console.log(servElement.nativeElement);
    this.render.addClass(servElement.nativeElement , 'p-3');
    if (service.parentCount == 0) {
      this.selectedService = service
    }else{
      this.spinner.show()
      this.service.getSubServices(id).subscribe({
        next:res =>{
          console.log(res);
          if (res?.success) {            
            this.AllServices = res?.data; 
          }
          this.spinner.hide()
        },error:err =>{
          console.log(err);
          this.spinner.hide()
        }
      })
    }
  }
  
  saveService(){
    this.facilityForm.get('services_id')?.setValue(this.selectedService.ser_name);
    if(this.facilityDetails){
      this.facilityDetails.service_id = this.selectedService.id;
      this.facilityDetails.service_name = this.selectedService.ser_name;
    }
    console.log(this.facilityDetails);
    
    console.log(this.facilityDetails);
    this.serviceMode =false
  }
}

