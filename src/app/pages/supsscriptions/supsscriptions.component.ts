import { BreadcrumbComponent } from './../../shared/breadcrumb/breadcrumb.component';
import { RouterModule } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbPaginationModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbLink, SubscriptionDetails } from '../../interfaces/common';
import { CommonModule } from '@angular/common';
import { SubscriptionsService } from '../../services/subscription.service';
import { TranslateModule } from '@ngx-translate/core';
import { getCurrentUserlang } from '../../services/utils';
import { CommonApiService } from '../../services/common-api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-supsscriptions',
  templateUrl: './supsscriptions.component.html',
  standalone: true,
  imports: [RouterModule,NgbPaginationModule,BreadcrumbComponent ,CommonModule , NgbRatingModule , TranslateModule],
  styleUrls: ['./supsscriptions.component.css']
})
export class SupsscriptionsComponent implements OnInit {
  @ViewChild('subscriptionsContainer') subscriptionsContainer: ElementRef;
  count: any;
getCurrentUserlang() {
  return getCurrentUserlang() 
}
  page = 1;
  BreadcrumbLinks: BreadcrumbLink[] = [
    { label: 'Home', route: '/home' },
    { label: 'Subscriptions', route: '' },
  ];
  Allsubscriptions:SubscriptionDetails[] = []
  paginatedItems: SubscriptionDetails[] = [];
  subscriptionInfo: SubscriptionDetails ;
  noSubs: boolean;
  sub:Subscription;
  detailsError:boolean
  showLoader:boolean
  constructor(
    private modalService: NgbModal,
    private common: CommonApiService,
    private subscribe: SubscriptionsService,
  ) { }

  ngOnInit() {
    this.sub = this.common.langUpdated.subscribe((res) => {
      this.getAllsubscriptions();
    })
  }

  getAllsubscriptions(start?:number,limit?:number)
  {
    this.showLoader = true
    this.subscribe.GetAllsubscriptions(start , limit).subscribe({
      next: (res) => {
        console.log(res);
        if (res?.status == 200) {
          this.Allsubscriptions = res.data;
          this.count = res?.count
        }
        if (this.Allsubscriptions?.length == 0) {
          this.noSubs = true
        }else{
          this.noSubs = false
        }
        this.showLoader = false
      },
      error:err=>{
        console.log(err);
        this.showLoader = false
        
      }
    })
  }

  open(content: any , item:any) {
    this.modalService.open(content, { centered: true, size: 'lg' });
    this.subscribe.GetSubscriptionInfo(item?.id).subscribe({
      next: (res) => {
        console.log(res);
        if (res?.status == 200) {
          this.detailsError = false
          this.subscriptionInfo = res.data;
        }else{
          this.detailsError = true
        }
      },
      error:err=>{
        console.log(err);
        this.detailsError = true
        
      }
    })
  }

  onPageChange(page: number)
  {
    this.Allsubscriptions = []
    let start = (page - 1) * 10
    this.getAllsubscriptions(start, 10);
    this.page = page;
    if (this.subscriptionsContainer) {
      this.subscriptionsContainer.nativeElement.scrollIntoView({ behavior: 'smooth' , block:'center' });
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }
  
}
