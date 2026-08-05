import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category.service';
import { Category } from '../../../models/category.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-category',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './category.component.html'
})
export class CategoryComponent implements OnInit {
    categories: Category[] = [];
    newCategoryName = '';

    constructor(private categoryService: CategoryService) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.categories = this.categoryService.getAll();
    }

    addCategory() {
        this.categoryService.add(this.newCategoryName);
        this.newCategoryName = '';
        this.loadData();
    }

    deleteCategory(id: string) {

    }
}