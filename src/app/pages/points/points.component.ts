import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { BreadcrumbLink, Points} from '../../interfaces/common';
import { NgbPaginationModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { LocalstorageService } from '../../services/localstorage.service';
import { User } from '../../interfaces/user';
import { SubscriptionsService } from '../../services/subscription.service';
import { TranslateModule } from '@ngx-translate/core';
import {  RouterModule } from '@angular/router';
import { CommonApiService } from '../../services/common-api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-points',
  standalone:true,
  imports:[NgbPaginationModule,BreadcrumbComponent ,CommonModule , NgbRatingModule , TranslateModule , RouterModule],
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.css']
})
export class PointsComponent implements OnInit {
  @ViewChild('pointsContainer') pointsContainer: ElementRef;
  BreadcrumbLinks: BreadcrumbLink[] = [
    { label: 'Home', route: '/home' },
    { label: 'Points', route: '' },
  ];
  page = 1;
  userData: User;
  pointsList: Points[] = [];
  loadMoreClicked: number = 0;
  pontsInView: Points[] = [];
  noPoints: boolean;
  sub:Subscription
  showLoader:boolean;
  count: any;
  constructor(
    private localstorage : LocalstorageService,
    private subscribeService : SubscriptionsService,
    private common :CommonApiService,

  ) { }

  ngOnInit() {
    this.userData = JSON.parse(this.localstorage.getItem('currentUser'));
    this.sub = this.common.langUpdated.subscribe((res) => {
      this.getAllPoints();
    })
  }

  getAllPoints(start:number = 0 ,aIteamPerpage :number = 10)
  {
    this.showLoader = true
    this.subscribeService.GetAllpointsRecords(start,aIteamPerpage).subscribe({
      next: (res) => {
        console.log(res);
        if (res?.status == 200) {
          this.pointsList = res?.data  
          this.count = res?.count
          if (this.pointsList?.length == 0) {
            this.noPoints = true
          }else{
            this.noPoints = false
          }
          this.showLoader = false
        }
      },error: (err) => {
        console.log(err);
        this.noPoints = true
        this.showLoader = false
      }
  })
  }

  onPageChange(page: number)
  {
    this.pointsList = []
    let start = (page - 1) * 10
    this.getAllPoints(start, 10);
    this.page = page;
    if (this.pointsContainer) {
      this.pointsContainer.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }
}
