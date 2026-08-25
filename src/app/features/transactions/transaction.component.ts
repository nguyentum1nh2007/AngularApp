import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from './transaction.service';
import { ProductService } from '../products/product.service';
import { StockTransaction, TransactionType, TransactionDetail } from '../../models/transaction.model';
import { Product } from '../../models/product.model';

@Component({
    selector: 'app-transaction',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './transaction.component.html'
})
export class TransactionComponent implements OnInit {
    transactions: StockTransaction[] = [];
    products: Product[] = [];

    type: TransactionType = 'IN';
    note = '';
    tempDetails: TransactionDetail[] = [];
    saveError = '';

    selectedProductId = '';
    inputQuantity = 1;
    inputPrice = 0;
    itemError = '';

    // 
    deleteError = '';

    constructor(
        private transactionService: TransactionService,
        private productService: ProductService
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.transactions = this.transactionService.getAll();
        this.products = this.productService.getAll();
    }
    addItem() {
        if (!this.selectedProductId) {
            this.itemError = 'Vui lòng chọn một sản phẩm!';
            return;
        }
        if (this.inputQuantity <= 0) {
            this.itemError = 'Số lượng phải lớn hơn 0!';
            return;
        }
        if (this.inputPrice < 0) {
            this.itemError = 'Đơn giá không được âm!';
            return;
        }

        this.itemError = '';

        const existingItem = this.tempDetails.find(item => item.productId === this.selectedProductId);
        if (existingItem) {
            existingItem.quantity += this.inputQuantity;
            existingItem.price = this.inputPrice;
        } else {
            this.tempDetails.push({
                productId: this.selectedProductId,
                quantity: this.inputQuantity,
                price: this.inputPrice
            });
        }

        this.selectedProductId = '';
        this.inputQuantity = 1;
        this.inputPrice = 0;
        this.saveError = '';
    }

    removeItem(index: number) {
        this.tempDetails.splice(index, 1);
        this.saveError = '';
    }

    saveTransaction() {
        const result = this.transactionService.createTransaction(this.type, this.note, this.tempDetails);

        if (!result.success) {
            this.saveError = result.errorMessage;
        } else {
            this.saveError = '';
            this.tempDetails = [];
            this.note = '';
            this.loadData();
        }
    }

    getProductName(id: string): string {
        const p = this.products.find(item => item.id === id);
        return p ? p.name : 'N/A';
    }

    clearErrors() {
        this.itemError = '';
        this.saveError = '';
        this.deleteError = '';
    }
    deleteTransaction(id: string) {
        if (confirm('Bạn có chắc chắn muốn xóa phiếu này? Số lượng tồn kho sẽ được hoàn tác.')) {
            const result = this.transactionService.deleteTransaction(id);

            if (!result.success) {
                this.deleteError = result.errorMessage;
            } else {
                this.deleteError = '';
                this.loadData();
            }
        }
    }
}