import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { BreadcrumbLink, Gym, option } from '../../interfaces/common';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MapFilterComponent } from '../../shared/map-filter/map-filter.component';
import { Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GymService } from '../../services/gym.service';
import { GoogleMapsModule } from '@angular/google-maps';
import { environment } from '../../services/config';
import { TranslateModule } from '@ngx-translate/core';
import { CommonApiService } from '../../services/common-api.service';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'app-find-gym',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    CommonModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    RouterModule, NgbDropdownModule,
    MapFilterComponent,
    GoogleMapsModule,
    TranslateModule,
    FormsModule
  ],
  templateUrl: './find-gym.component.html',
  styleUrls: ['./find-gym.component.css'],
})
export class FindGymComponent implements OnInit {
  @ViewChild('targetElement') targetElement!: ElementRef;

  public environment = environment;
  BreadcrumbLinks: BreadcrumbLink[] = [
    { label: 'Home', route: '/home' },
    { label: 'Find Gym', route: '' },
  ];
  page = 1;
  showFilter = false;
  showOnMap = false;
  Amenities: option[] = [];
  selectedOptions: number[] = [];
  nearGym:Gym[]=[];
  gymList: Gym[] = [];
  location: any;
  lon: any = '';
  lat: any = '';
  paginatedItems: any;
  noAddress: boolean;
  params: any;
  sub:Subscription;
  start:number = 0;
  distance:any = '';
  budget:any ='';
  distanceCondition: string = 'ASC';
  sortDistanceDone: boolean ;
  sortPriceDone: boolean;
  priceCondition: string = '';
  SearchValue: string = '';
  sortLastDone: boolean;
  optionsFilter: any;
  count: any;
  myLocation:any;
  selectedCity: any;
  constructor(
    private route: ActivatedRoute,
    private http:HttpClient,
    private gym:GymService,
    private common:CommonApiService,
    private localstorageService:LocalstorageService,
    private renderer: Renderer2
  ) {

  }


  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.SearchValue = params['searchValue']? params['searchValue'] : '';
      this.selectedCity = params['selectedCity']? params['selectedCity'] : '';
      this.localstorageService.setItem('searchValue' , this.SearchValue)
      this.sub = this.common.langUpdated.subscribe((res) => {
        this.getAllOptions();
        if (this.SearchValue == '' || this.selectedCity !== '') {
          this.getCurrentLocation();
        }
        else{
          this.getLocation(this.SearchValue)
        }
      })
    });
  }


  scrollToElement(): void {
    this.renderer.setProperty(window, 'scrollTo', {
      top: this.targetElement.nativeElement.offsetTop,
      behavior: 'smooth'
    });
  }

  
  handleImgError(event: any) {
    event.target.src = 'assets/images/gyms/gym-8.png';
  }

  SubmitSearch() {
    this.selectedCity = ''
    this.localstorageService.setItem('searchValue', this.SearchValue);
    if (this.SearchValue == '') {
      this.getCurrentLocation()
    }else{
      this.getLocation(this.SearchValue)
    }
  }

  //?------------start filter form----------------//

  // filter form region
  SubmitFilterForm() {
    // this.router.navigate([], {
    //   relativeTo: this.route,
    //   queryParams: { filter: JSON.stringify(filterObj) },
    //   queryParamsHandling: 'merge' // Merge with existing query parameters,
    // });
    this.getAllGyms(0,10, this.distance, this.budget , this.selectedOptions , this.selectedCity)
    this.page = 1;
  }
  
  resetFilterForm() {
    this.selectedOptions = [];
    this.distance = '';
    this.budget = '';
    this.getAllGyms(0,10, this.distance, this.budget , [] ,'' ,'' ,this.selectedCity)
  }

  ToggleShowFilter() {
    this.showFilter = !this.showFilter;
    if (this.showFilter) {
      this.selectedOptions = [];
    }
  }

  toggleSelection(optionId: number): void {
    const index = this.selectedOptions.indexOf(optionId);
    if (index > -1) {
      this.selectedOptions.splice(index, 1);
    } else {
      this.selectedOptions.push(optionId);
    }
  }

  isSelected(optionId: number): boolean {
    return this.selectedOptions.includes(optionId);
  }
  //?------------End  filter form----------------//

  ShowMap(){
    this.showOnMap =!this.showOnMap;
  }

  //?------------start Main Method----------------//

  getAllGyms(start :number = 0 , aIteamPerpage:number = 10 , dist:any = '' , price:any = '' , optionsIds:number[] = [] , sort:string = '' , type:string ='' , city_id:string = '')
  {    
    this.gym.GetAllGyms(this.lat , this.lon , this.start , aIteamPerpage , dist , price , optionsIds , sort ,type , city_id ).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status == 200) {
          this.gymList = res.data
          this.nearGym = this.gymList.filter(gym => gym.distance <= 20);
          this.count = res.count
          this.noAddress = false
          if (this.gymList?.length == 0) {
            this.noAddress = true
          }
        }else{
          this.noAddress = true
          this.gymList = []
        }
      },
      error: (err) => {
        console.log(err);
        this.gymList = []
        this.nearGym = []
        
      }
    })
  }

  getAllOptions()
  {
    this.gym.getAllOptions().subscribe({
      next: (res) => {
        if (res?.status == 200) {
          this.Amenities = res?.data
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  //?------------End Main Method----------------//
  
  //?------------start Location----------------//

  getLocationByPostalCode(postalCode: string): Observable<any> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${postalCode}&key=AIzaSyAaOhVIrDNyGa9Go0waT8dwJp5XcoCZDqU`;
    return this.http.get<any>(url);
  }

  getLocation(postalCode: string): void {
    this.getLocationByPostalCode(postalCode).subscribe(
      response => {
        if (response.status === 'OK' && response.results.length > 0) {
          this.location = response.results[0].geometry.location;
          console.log('Location:', this.location);
          this.lat = this.location.lat;
          this.lon = this.location.lng;
          this.noAddress = false
          this.getAllGyms(0,10,'','',[],'','',this.selectedCity);
            this.myLocation = { lat: parseFloat(this.lat), lng: parseFloat(this.lon) }        } else {
          console.error('No results found');
          this.gymList = []
          this.noAddress = true
        }
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  getCurrentLocation(): void {
    if (navigator !== undefined) {
      navigator?.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lon = position.coords.longitude;
        console.log('Location:', {lat:this.lat,lon:this.lon});
        this.noAddress = false
        this.myLocation = { lat: parseFloat(this.lat), lng: parseFloat(this.lon) }
        this.getAllGyms(0,10,'','',[],'','',this.selectedCity);
      },
      (error)=>{
        console.log('user denied access location', error);
        this.getIPLocation()
      } 
    )
    }else{
      this.getIPLocation()
    }
  }

  getIPLocation(): void {
    this.http.get<any>('https://ipinfo.io?token=70b5427b995b1e')
      .subscribe(
        {
          next: (data) => {
            console.log(data);
            const loc = data.loc.split(',');
            this.lat = parseFloat(loc[0]);
            this.lon = parseFloat(loc[1]);
            this.getAllGyms(0,10,'','',[],'','',this.selectedCity);
            this.myLocation = { lat: parseFloat(this.lat), lng: parseFloat(this.lon) }
          },
          error: err => {
            console.log("Unable to retrieve location via IP geolocation." , err);
            this.noAddress = true
          }
        }
      );
  }

  //?------------End Location----------------//

  //?------------start Sorting----------------//

  sortbyDistance()
  {
    this.sortDistanceDone = true
    this.sortLastDone = false
    this.sortPriceDone = false
    this.getAllGyms(0 , 10 , this.distance , this.budget , this.selectedOptions ,'distance' , this.distanceCondition , this.selectedCity );
    this.distanceCondition == 'ASC' ? this.distanceCondition = 'DESC' : this.distanceCondition = 'ASC'
    this.page = 1;
  }
  sortbyPrice(sort:string)
  {
    this.sortDistanceDone = false
    this.sortLastDone = false
    this.sortPriceDone = true
    this.getAllGyms(0 , 10 , this.distance , this.budget , this.selectedOptions , 'price'  , sort , this.selectedCity);
    this.priceCondition == sort
    this.page = 1;
  }
  sortbyLastAdded()
  {
    this.sortDistanceDone = false
    this.sortPriceDone = false
    this.sortLastDone = true
    this.getAllGyms(0 , 10 , this.distance , this.budget , this.selectedOptions , 'id'  , 'ASC' , this.selectedCity);
    this.page = 1;
  }

  //?------------End Sorting----------------//

  //?------------start Pagination----------------//

  onPageChange(page: number)
  {
    
    this.page = page;
    let start = (page - 1) * 10
    if (this.sortDistanceDone) {
      this.getAllGyms(start, 10 , this.distance , this.budget , this.selectedOptions, 'distance' , this.distanceCondition ,this.selectedCity);
    }else if(this.sortPriceDone){
      this.getAllGyms(start , 10 , this.distance, this.budget ,this.selectedOptions, 'price', this.priceCondition , this.selectedCity );
    }else if(this.sortLastDone){
      this.getAllGyms(start , 10 , this.distance , this.budget , this.selectedOptions, 'id' , 'ASC' , this.selectedCity);
    }else{
      this.getAllGyms(start , 10 , this.distance , this.budget , this.selectedOptions , this.selectedCity);
    }
  }

  //?------------End Pagination----------------//
  
  ngOnDestroy(): void {
    this.sub.unsubscribe();    
  }
}
