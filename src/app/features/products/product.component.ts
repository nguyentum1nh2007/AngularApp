import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from './product.service';
import { CategoryService } from '../categories/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

import { CategoryNamePipe } from '../../shared/pipes/category-name-pipe';

@Component({
    selector: 'app-product',
    standalone: true,
    imports: [CommonModule, FormsModule, CategoryNamePipe],
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

    searchTerm = '';
    selectedCategoryFilter = '';
    selectedStatusFilter = 'ALL'; // ALL | IN_STOCK | OUT_OF_STOCK
    sortBy = ''; // name_asc | name_desc | stock_asc | stock_desc
    constructor(
        private productService: ProductService,
        private categoryService: CategoryService
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.categories = this.categoryService.getAll();

        let temp: any = this.productService.getAll();
        temp = temp.map((e: any) => {
            return {
                ...e,
                categoryName: this.getCategoryName(e.categoryId),
            }
        });

        this.products = temp;

        console.log(this.products);
    }

    get filteredProducts(): Product[] {
        return this.products
            .filter(p => {
                const term = this.searchTerm.trim().toLowerCase();
                const matchesSearch = !term ||
                    p.name.toLowerCase().includes(term) ||
                    p.id.toLowerCase().includes(term);

                const matchesCategory = !this.selectedCategoryFilter || p.categoryId === this.selectedCategoryFilter;

                let matchesStatus = true;
                if (this.selectedStatusFilter === 'IN_STOCK') {
                    matchesStatus = Number(p.stockQuantity) > 0;
                } else if (this.selectedStatusFilter === 'OUT_OF_STOCK') {
                    matchesStatus = Number(p.stockQuantity) <= 0;
                }

                return matchesSearch && matchesCategory && matchesStatus;
            })
            .sort((a, b) => {
                if (this.sortBy === 'name_asc') return a.name.localeCompare(b.name);
                if (this.sortBy === 'name_desc') return b.name.localeCompare(a.name);
                if (this.sortBy === 'stock_asc') return (Number(a.stockQuantity) || 0) - (Number(b.stockQuantity) || 0);
                if (this.sortBy === 'stock_desc') return (Number(b.stockQuantity) || 0) - (Number(a.stockQuantity) || 0);
                return 0;
            });
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
            stockQuantity: 0
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

        console.log(1);

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