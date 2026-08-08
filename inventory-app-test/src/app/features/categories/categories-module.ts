import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CategoriesRoutingModule } from './categories-routing-module';
import { CategoryList } from './pages/category-list/category-list';
import { CategoryForm } from './pages/category-form/category-form';

@NgModule({
  declarations: [CategoryList, CategoryForm],
  imports: [CommonModule, CategoriesRoutingModule, FormsModule],
})
export class CategoriesModule { }
