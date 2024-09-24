import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { OrderService } from '../../shared/services/order.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../shared/services/common.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cartItems: any[] = [];
  totalCartPrice: any = '';
  qtnTotal:number[]= []
  loading:boolean = true;
  empty: boolean = false;
  Cart!: Subscription;
  postPrices: any[]=[];
  dataDone:boolean = false;
  constructor(
    public order:OrderService,
    private message:MessageService,
    private translate:TranslateService,
    private spinner:NgxSpinnerService,
    public common:CommonService,
    public router:Router,
    @Inject(PLATFORM_ID) private platformId: Object,


  )
  {
    if (isPlatformBrowser(this.platformId)) {
      this.translate.use(localStorage.getItem('front-lang') == null ? 'ar' : localStorage.getItem('front-lang')!)
    }
  }

  ngOnInit(): void {
    this.spinner.show()
    this.Cart = this.order.getCart().subscribe({
      next:res=>{
        console.log(res);
        if(res?.success)
          {
            this.spinner.hide()
          this.cartItems = res?.data.items;
          if (this.cartItems?.length > 0) {
            this.totalCartPrice = res?.data.total_price
            this.cartItems?.forEach((ele:any) => {
              this.qtnTotal.push(ele.quantity)
              this.postPrices.push(ele.price);
            });
            this.dataDone = true
            this.empty = false
          }else{
            this.empty = true
            this.dataDone = false
            this.spinner.hide()
          } 
        }else{
          this.spinner.hide();
          this.empty = true;
          this.dataDone = false;
        }
      },
      error:err=>{
        console.log(err);
        this.spinner.hide()
        this.dataDone = false
        this.empty = true

      }
    })
  }

  decrement(qtn:any , id:string , i:number)
  {
    let cartNum = this.order.cartNum.getValue()
    this.order.cartNum.next(cartNum - 1)
    if (qtn.value > 1) {
      this.qtnTotal[i]--;
      this.totalCartPrice = this.totalCartPrice - this.postPrices[i] * 1
      this.order.updateQuantity(id , qtn.value - 1).subscribe({
        next:res=>{
          console.log(res);
          if (res?.success) {
            this.translate.get('cart updated successfully').subscribe(data=>{
              this.message.add({severity:'success' , detail:data})
            })
          }
        },
        error:err=>{
          console.log(err);
        }
      })
    }else{
      if(this.cartItems?.length == 1){
        this.emptyCart();
      }else{
        this.deleteItemCart(id , i)
      }
    }
  }

  increment(qtn:any , id:string , i:number)
  {
    this.qtnTotal[i]++;
    let cartNum = this.order.cartNum.getValue()
    this.order.cartNum.next(cartNum + 1)
    this.totalCartPrice = this.totalCartPrice + this.postPrices[i] * 1
    this.order.updateQuantity(id , qtn.value -0+ 1).subscribe({
      next:res=>{
        console.log(res);
        if(res?.success)
        {
          this.translate.get('cart updated successfully').subscribe(data=>{
            this.message.add({severity:'success' , detail:data})
          })
        }else{
          this.translate.get('something went wrong').subscribe(data=>{
            this.message.add({severity:'error' , detail:data})
          })
        }
      },
      error:err=>{
        console.log(err);
        
      }
    })
  }


  deleteItemCart(id:string , i:number){
    this.cartItems.splice(i , 1)
    if (this.cartItems?.length == 0) {
      this.emptyCart();
      this.empty = true
      return;
    }
    this.order.deleteItem(id).subscribe({
      next:res=>{
        console.log(res);
        if(res?.success){
          this.translate.get('cart item deleted successfully').subscribe(data=>{
            this.message.add({severity:'success' , detail:data})
          })
        }
      },
      error:err=>{
        console.log(err);
        
      }
    })
  }

  emptyCart(){
    this.empty = true;
    this.dataDone = false;
    this.order.emptyCart().subscribe({
      next:res=>{
        console.log(res);
        if(res?.success){
          this.order.cartNum.next(0)
          this.translate.get('cart deleted successfully').subscribe(data=>{
            this.message.add({severity:'success' , detail:data})
          })
        }
      },
      error:err=>{
        console.log(err);
        
      }
    })
  }


  confirmOrder()
  {
    this.order.addOrder().subscribe({
      next:res=>{
        console.log(res);
        if(res?.success){
          this.order.cartNum.next(0)
          this.translate.get('order added successfully').subscribe(data=>{
            this.message.add({severity:'success' , detail:data})
          })
          setTimeout(() => {
          this.router.navigate(['/orders/Allorders'])
          }, 1000);
        }
      },
      error:err=>{
        console.log(err);
        
      }
    })
  }


  ngOnDestroy(): void {
    this.Cart.unsubscribe()
  }
}

