import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { UserOrdersComponent } from './user-orders/user-orders.component';
import { SharedModule } from '../shared/shared.module';
import { CartComponent } from './cart/cart.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderStateComponent } from './order-state/order-state.component';


@NgModule({
  declarations: [
    UserOrdersComponent,
    CartComponent,
    OrderDetailsComponent,
    OrderStateComponent,
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    SharedModule
  ]
})
export class OrdersModule { }
