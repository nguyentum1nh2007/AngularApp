import { Component, OnInit } from '@angular/core';
import { CategoryService } from './category.service';
import { Category } from '../.././models/category.model';
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
    addError = '';


    editingId: string | null = null;
    editingName = '';
    editError = '';

    constructor(private categoryService: CategoryService) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.categories = this.categoryService.getAll();
    }

    addCategory() {
        if (!this.newCategoryName.trim()) {
            this.addError = 'Tên danh mục không được để trống!';
            return;
        }
        this.addError = '';

        const success = this.categoryService.add(this.newCategoryName);
        if (success) {
            this.newCategoryName = '';
            this.loadData();
        }
    }

    deleteCategory(id: string) {
        if (confirm('Bạn có chắc muốn xóa danh mục này?')) {
            this.categoryService.delete(id);
            this.loadData();
        }
    }

    startEdit(cat: Category) {
        this.editingId = cat.id;
        this.editingName = cat.name;
        this.editError = '';
    }

    saveEdit() {
        if (!this.editingName.trim()) {
            this.editError = 'Tên danh mục không được để trống!';
            return;
        }
        this.editError = '';

        if (this.editingId) {
            const success = this.categoryService.update(this.editingId, this.editingName);
            if (success) {
                this.editingId = null;
                this.editingName = '';
                this.loadData();
            }
        }
    }

    cancelEdit() {
        this.editingId = null;
        this.editingName = '';
        this.editError = '';
    }

    clearAddError() {
        this.addError = '';
    }

    clearEditError() {
        this.editError = '';
    }
}