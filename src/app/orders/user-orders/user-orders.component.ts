import { Component, Inject, Input, PLATFORM_ID, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../shared/services/common.service';
import { StepperPanel } from 'primeng/stepper';
import { TabPanel, TabViewChangeEvent } from 'primeng/tabview';
import { OrderService } from '../../shared/services/order.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.scss'
})
export class UserOrdersComponent {

  breadCrumbItem:string = '';
  states:string[] = ['Received' , 'Processing' , 'Canceled' ]
  statesOn:boolean[] = [false , true , false ]
  
  constructor(
    private translate: TranslateService,
    private common:CommonService,
    private order:OrderService,
    @Inject(PLATFORM_ID) private platformId: Object,

  ){
    if (isPlatformBrowser(this.platformId)) {
      this.translate.use(localStorage.getItem('front-lang') == null ? 'ar' : localStorage.getItem('front-lang')!)
    }
  }
  
  ngOnInit(): void {
    
  }
  ngAfterViewInit(): void {
    setTimeout(() => {  
      this.breadCrumbItem = this.states[1];
    }, 100);
  }
  onActiveTabChange(value: number) {
    console.log('Active tab changed:', value);
    // Perform any other actions here
  }
  onTabChange(event: TabViewChangeEvent) {
    if (event.index === 0) {
      this.breadCrumbItem = this.states[0]
      this.statesOn[0] = true
      this.statesOn[1] = false
      this.statesOn[2] = false
    } else if (event.index === 1) {
      this.breadCrumbItem = this.states[1]
      this.statesOn[1] = true
      this.statesOn[0] = false
      this.statesOn[2] = false
    }
    else if (event.index === 2) {
      this.breadCrumbItem = this.states[2]
      this.statesOn[2] = true
      this.statesOn[0] = false
      this.statesOn[1] = false
    }
  }
  
}
