import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonApiService } from '../../services/common-api.service';
import { ContactInfo } from '../../interfaces/common';
import { HttpClient } from '@angular/common/http';
import { getCurrentUserlang } from '../../services/utils';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, CommonModule , TranslateModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
  contactInfo: ContactInfo;
  lon: number;
  lat: number;
  country: string;
  AllCountries: {id?:number,name?:string}[] = [];
  cities: {id?:number,name?:string}[] = [];
  constructor(
    private common : CommonApiService,
    private http : HttpClient,
    @Inject(PLATFORM_ID) private platformId
  ) {}
  ngOnInit() {
    this.common.contactInfo.subscribe(res => {
      this.contactInfo = res;
    });    
    if (isPlatformBrowser(this.platformId)) {
      this.common.langUpdated.subscribe((res) => {
        this.getCurrentLocation();
      })
    }
  }


  getCurrentLocation(): void {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
        this.lat = position.coords.latitude;
        this.lon = position.coords.longitude;
        this.getCountryName()
      },
      (err)=>{
        this.getIPLocation()
        console.log("User denied the request for geolocation." );
      }
    );
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
            this.getCountryName()
          },
          error: err => {
            console.log("Unable to retrieve location via IP geolocation." , err);
          }
        }
      );
    }

    
  getCountryName() {
    let apiKey = 'AIzaSyAaOhVIrDNyGa9Go0waT8dwJp5XcoCZDqU';
    let apiUrl = `https://maps.googleapis.com/maps/api/geocode/json`
    const url = `${apiUrl}?latlng=${this.lat},${this.lon}&key=${apiKey}&language=${getCurrentUserlang()}`;
    this.http.get(url).subscribe((data: any) => {
      const results = data.results;
      if (results.length > 0) {
        const addressComponents = results[0].address_components;
        const countryComponent = addressComponents.find((component) =>
          component.types.includes('country')
        );
        
        this.country = countryComponent ? countryComponent.long_name : 'Unknown';
        console.log(this.country);
        this.getAllCountries();
      } else {
        this.country = 'Unknown';
        console.log(this.country);
      }
    });
  }

  getAllCountries()
  {
    this.common.getAllCountries().subscribe({
      next: (res) => {
        if (res?.status == 200) {
          this.AllCountries = res.data
          let myCountry = this.AllCountries.filter(c => c.name.toLowerCase() == this.country.toLowerCase())[0];
          this.showCities(myCountry.id)
        }
      },
      error: err => {
        console.log(err);
      }
    })
  }

  showCities(id:number)
  {
    this.common.showCity(id).subscribe({
      next: (res) => {
        if (res?.status == 200) {
          this.cities = res.data
        }
      },
      error: err => {
        console.log(err);
      }
    })
  }
}
