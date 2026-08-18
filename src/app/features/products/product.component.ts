import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from './product.service';
import { CategoryService } from '../categories/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
    selector: 'app-product',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {
    products: Product[] = [];
    categories: Category[] = [];

    newName = '';
    newCategoryId = '';
    newPrice = 0;
    newQuantity = 0;
    addError = '';

    editingProduct: Product | null = null;
    editError = '';

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.products = this.productService.getAll();
        this.categories = this.categoryService.getAll();
    }

    addProduct() {
        if (!this.newName.trim()) {
            this.addError = 'Tên sản phẩm không được để trống!';
            return;
        }
        if (!this.newCategoryId) {
            this.addError = 'Vui lòng chọn danh mục cho sản phẩm!';
            return;
        }
        if (this.productService.existsByNameAndCategory(this.newName, this.newCategoryId)) {
            this.addError = `Sản phẩm "${this.newName.trim()}" đã tồn tại trong danh mục này!`;
            return;
        }

        this.addError = '';

        const newProduct: Product = {
            id: Date.now().toString(),
            name: this.newName.trim(),
            categoryId: this.newCategoryId,
            price: this.newPrice,
            stockQuantity: this.newQuantity
        };

        const success = this.productService.add(newProduct);
        if (success) {
            this.resetForm();
            this.loadData();
        }
    }
    startEdit(product: Product) {
        this.editingProduct = { ...product };
        this.editError = '';
    }

    saveEdit() {
        if (this.editingProduct) {
            if (!this.editingProduct.name.trim()) {
                this.editError = 'Tên sản phẩm không được để trống!';
                return;
            }
            if (!this.editingProduct.categoryId) {
                this.editError = 'Vui lòng chọn danh mục!';
                return;
            }

            if (this.productService.existsByNameAndCategory(this.editingProduct.name, this.editingProduct.categoryId, this.editingProduct.id)) {
                this.editError = `Sản phẩm này đã bị trùng tên trong cùng danh mục!`;
                return;
            }

            this.editError = '';
            const success = this.productService.update(this.editingProduct);
            if (success) {
                this.editingProduct = null;
                this.loadData();
            }
        }
    }

    cancelEdit() {
        this.editingProduct = null;
        this.editError = '';
    }

    deleteProduct(id: string) {
        if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
            this.productService.delete(id);
            this.loadData();
        }
    }

    getCategoryName(catId: string): string {
        const cat = this.categories.find(c => c.id === catId);
        return cat ? cat.name : 'Chưa phân loại';
    }

    clearAddError() {
        this.addError = '';
    }

    clearEditError() {
        this.editError = '';
    }

    private resetForm() {
        this.newName = '';
        this.newCategoryId = '';
        this.newPrice = 0;
        this.newQuantity = 0;
    }
}