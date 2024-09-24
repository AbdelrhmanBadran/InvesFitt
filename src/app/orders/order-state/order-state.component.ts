import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../shared/services/common.service';
import { OrderService } from '../../shared/services/order.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-order-state',
  templateUrl: './order-state.component.html',
  styleUrl: './order-state.component.scss',
  providers:[DecimalPipe]

})
export class OrderStateComponent {

  @Input('state') state:string = '';
  loading:boolean = true;
  noContent:boolean = true;
  orders: any[] = [];
  AllOrders!: Subscription;
  constructor(
    private translate: TranslateService,
    public common:CommonService,
    private order:OrderService,
    private spinner:NgxSpinnerService,
    private message:MessageService,
    private router:Router,
    public decimalPipe: DecimalPipe

  )
  {
    
  }
  
  ngOnInit(): void {
    this.spinner.show()
    console.log(this.state);
    this.AllOrders = this.order.getOrders(this.state).subscribe({
      next:res=>{
        console.log(res);
        if(res?.success)
        {
          this.orders = res?.data
          this.noContent = false
        }else{
          this.noContent = true
        }
        this.spinner.hide()
        this.loading = false
      },
      error:err=>{
        console.log(err);
        this.spinner.hide()
        this.noContent = true
        this.loading = false
      }
    })
  }

  reserveAgain(id:string , qtn:any)
  {
    // this.translate.get('sooooon').subscribe(data=>{
    //   this.message.add({severity:'error' , detail:data})
    // })

    this.order.reserveAgain(id).subscribe({
      next:res=>{
        console.log(res);
        if(res?.success)
        {
          let cartNum = this.order.cartNum.getValue()
          this.order.cartNum.next(qtn - 0 +cartNum)
          this.translate.get('reserve again done').subscribe(data=>{
            this.message.add({severity:'success' , detail:data})
          })
        }else{
          this.translate.get(res?.error).subscribe(data=>{
            this.message.add({severity:'error' , detail:data})
          })

        }
      },
      error:err=>{
        console.log(err);
        
      }
    })
  }

  getOrderDetails(id:string)
  {
    this.router.navigate(['/orders/orderDetails' , id])
  }

  ChangeStatus(id:string , status:string , i:number){
    this.orders.splice(i,1);
    this.order.ChangeStatus(id,'Canceled').subscribe({
      next:res=>{
        console.log(res);
        if (res?.success) {
          this.translate.get('order is canceled').subscribe(data=>{
            this.message.add({severity:'success' , detail:data})
          })
        }
      }
    })
  }
  
  goToMaps(facilityDetails:any){
    const url = `https://www.google.com/maps?q=${facilityDetails?.lat},${facilityDetails?.lon}`;

    setTimeout(() => {
      window.open(url, '_blank');
    }, 100);
  }

  ngOnDestroy(): void {
    this.AllOrders.unsubscribe();
  }
}
