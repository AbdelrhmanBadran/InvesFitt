import { Component } from '@angular/core';
import { OrderService } from '../../shared/services/order.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../shared/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss',
  providers:[DecimalPipe]
})
export class OrderDetailsComponent {


  breadCrumbItem:string = '';
  orderDetails: any;
  loading:boolean = true;
  messages: any[] = []
  constructor(
    private order:OrderService,
    private acttivate:ActivatedRoute,
    private translate: TranslateService,
    private common:CommonService,
    private message:MessageService,
    private spinner:NgxSpinnerService,
    public decimalPipe: DecimalPipe
  ){
  }

  ngOnInit(): void {
    this.spinner.show()
    this.acttivate.paramMap.subscribe(data=>{
      let orderId = data?.get('id')!
      this.order.getOrderDetails(orderId).subscribe({
        next:res=>{
          if (res?.success) {
            this.spinner.hide()
            this.orderDetails = res?.data
            this.loading = false;
            console.log(this.orderDetails);
            this.translate.get(this.orderDetails?.status).subscribe(data=>{
              if(this.orderDetails?.status == 'Processing')
              {
                this.messages = [{ severity: 'info', detail: data }]; 
              }else if(this.orderDetails?.status == 'Canceled'){
                this.messages = [{ severity: 'error', detail: data }]; 
              }
              else if(this.orderDetails?.status == 'Received'){
                this.messages = [{ severity: 'success', detail: data }]; 
              }
            })
          }

        },
        error:err=>{
          console.log(err);
          
        }
      })
    })
  }
  
  
}
