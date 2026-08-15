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

    editingProduct: Product | null = null;

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
        if (!this.newName.trim() || !this.newCategoryId) {
            alert('Vui lòng nhập tên sản phẩm và chọn danh mục!');
            return;
        }

        const newProduct: Product = {
            id: Date.now().toString(),
            name: this.newName,
            categoryId: this.newCategoryId,
            price: this.newPrice,
            stockQuantity: this.newQuantity
        };

        this.productService.add(newProduct);
        this.resetForm();
        this.loadData();
    }

    startEdit(product: Product) {
        this.editingProduct = { ...product };
    }

    saveEdit() {
        if (this.editingProduct) {
            if (!this.editingProduct.name.trim() || !this.editingProduct.categoryId) {
                alert('Tên và danh mục không được để trống!');
                return;
            }
            this.productService.update(this.editingProduct);
            this.editingProduct = null;
            this.loadData();
        }
    }

    cancelEdit() {
        this.editingProduct = null;
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

    private resetForm() {
        this.newName = '';
        this.newCategoryId = '';
        this.newPrice = 0;
        this.newQuantity = 0;
    }
}