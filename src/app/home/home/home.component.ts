import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { OrderService } from '../../shared/services/order.service';
import { Router } from '@angular/router';
import {TranslateService} from "@ngx-translate/core";
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(
    private order:OrderService,
    private router:Router,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object,

  ){
    if (isPlatformBrowser(this.platformId)) {
      this.translate.use(localStorage.getItem('front-lang') == null ? 'ar' : localStorage.getItem('front-lang')!)
    }
  }
  ngOnInit(): void {
    this.order.getCartNum().subscribe({
      next:res=>{
        console.log(res);
        if(res?.success)
        {
          this.order.cartNum.next(res?.data)
        }
      },
      error:err=>{
        console.log(err);
        
      }
    })
  }

}
