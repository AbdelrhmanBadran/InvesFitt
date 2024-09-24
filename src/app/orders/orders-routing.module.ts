import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserOrdersComponent } from './user-orders/user-orders.component';
import { CartComponent } from './cart/cart.component';
import { OrderDetailsComponent } from './order-details/order-details.component';

const routes: Routes = [
  {path:'' , redirectTo:'Allorders' , pathMatch:'full'},
  {path:'Allorders' , component : UserOrdersComponent},
  {path:'orderDetails/:id' , component :OrderDetailsComponent},
  {path:'cart' , component : CartComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
