import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private cartUrl: string = environment.baseUrl + "cart.php?action=";
  private orderUrl: string = environment.baseUrl + "orders.php?action=";
  public productUrl:string = "https://api.dalilelsouq.com/uploads/posts/"
  cartNum:BehaviorSubject<number> = new BehaviorSubject(0)

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
  ) 
  { 
    if (isPlatformBrowser(this.platformId)) {
      this.getCartNum().subscribe({
        next:res=>{
          console.log(res);
          
          if(res?.success)
          {
            this.cartNum.next(res?.data)
          }else{
            this.cartNum.next(0)
          
          }
        },
        error:err=>{
          console.log(err);
          
        }
      })
    }
  }

  addToCart(postId:string , pageId:string , quantity:string):Observable<any>
  {
    let data={
      "post_id": postId,
      "page_id": pageId,
      "quantity": quantity
    }
    let body = JSON.stringify(data);
    return this.http.post(this.cartUrl + 'Add_TO_Cart' , body )
  }

  updateQuantity(postId:string , quantity:number):Observable<any>
  {
    let data={
      "post_id": postId,
      "quantity": quantity
    }

    let body = JSON.stringify(data);
    return this.http.post(this.cartUrl + 'Update_Quantity' , body )
  }

  deleteItem(postId:string):Observable<any>
  {
    let data={
      "post_id": postId,
    }

    let body = JSON.stringify(data);
    return this.http.post(this.cartUrl + 'Delete_From_Cart' , body )
  }

  emptyCart():Observable<any>
  {
    let data={
    }
    let body = JSON.stringify(data);
    return this.http.post(this.cartUrl + 'Delete_Cart'  , body)
  }
  
  
  getCart():Observable<any>
  {
    let data={
    }

    let body = JSON.stringify(data);
    return this.http.post(this.cartUrl + 'Get_Cart' , body )
  }
  
  
  getCartNum():Observable<any>
  {
    let data={
    }
    let body = JSON.stringify(data);
    return this.http.post(this.cartUrl + 'Get_Cart_NUM' , body )
  }

  getOrders(status:string):Observable<any>
  {
    let data={
      "status": status,
      "start": 0,
      "limit": 10
    }

    let body = JSON.stringify(data);
    return this.http.post(this.orderUrl + 'getOrders' , body )
  }


  getOrderDetails(orderId:string):Observable<any>
  {
    let data={
      "order_id": orderId,
    }
    let body = JSON.stringify(data);
    return this.http.post(this.orderUrl + 'getOrderDetails' , body )
  }


  addOrder():Observable<any>
  {
    let data={
    }
    let body = JSON.stringify(data);
    return this.http.post(this.orderUrl + 'addOrder' , body )
  }


  reserveAgain(orderId:string):Observable<any>
  {
    let data={
      "order_id": orderId,
    }
    let body = JSON.stringify(data);
    return this.http.post(this.orderUrl + 'Reserve_Again' , body )
  }


  ChangeStatus(orderId:string , orderStatus:string):Observable<any>
  {
    let data={
      "order_id": orderId,
      "status": orderStatus
    }
    let body = JSON.stringify(data);
    return this.http.post(this.orderUrl + 'ChangeStatus' , body )
  }









}
