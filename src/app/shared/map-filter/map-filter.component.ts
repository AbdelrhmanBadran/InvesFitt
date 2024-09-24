import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Gym } from '../../interfaces/common';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../services/config';
@Component({
  selector: 'app-map-filter',
  templateUrl: './map-filter.component.html',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule ,RouterModule],
  styleUrls: ['./map-filter.component.css']
})
export class MapFilterComponent implements OnInit {
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;
  @Input() myLocation: any = {};
  @Input() locations: any[] = [];
  center: google.maps.LatLngLiteral ;
  zoom = 8;
  selectedGym: Gym | null = null;
  MarkerOptions = {
    icon:  '../../../assets/images/mapSmall.png',
  }
  environment = environment
  constructor(private router:Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.center =  { lat: this.myLocation.lat, lng: this.myLocation.lng }
    }, 100);
    // this.locations.forEach((location) => {
    //   console.log(this.parseFloat(location.lat) + ',' + this.parseFloat(location.lng));
      
    // })
    
  }



  handleImgError(event: any) {
    event.target.src = 'assets/images/gyms/gym-8.png';
  }
  parseFloat(str: string) {
    return parseFloat(str);
  }

  openInfoWindow(marker: MapMarker, gym: Gym ) {
    this.selectedGym = gym;
    this.infoWindow.open(marker);
  }
  GoGymDetails(id){
    this.router.navigate(['/gym/',id])
  }
  addMarker(e)
  {
  }
}
