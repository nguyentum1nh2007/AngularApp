import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './features/categories/category.component';
import { ProductComponent } from './features/products/product.component';
import { TransactionComponent } from './features/transactions/transaction.component';

const routes: Routes = [
  { path: '', redirectTo: 'categories', pathMatch: 'full' },
  { path: 'categories', component: CategoryComponent },
  { path: 'products', component: ProductComponent },
  { path: 'transactions', component: TransactionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }