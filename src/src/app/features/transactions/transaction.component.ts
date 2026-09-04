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

    editingIndex: number | null = null;
    editQuantity = 1;
    editPrice = 0;

    // xem chi tiet phieu
    selectedTransaction: any = null;

    // loc lich su giao dich
    searchTermTx = '';
    filterType = 'ALL'; // 'ALL' | 'IN' | 'OUT'
    sortByTx = 'date_desc'; // 'date_desc' | 'date_asc'

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
        if (this.inputPrice === null || this.inputPrice === undefined || this.inputPrice <= 0) {
            this.itemError = 'Bắt buộc phải nhập đơn giá lớn hơn 0!';
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

    // xem chi tiet phieu
    viewDetails(transaction: any) {
        this.selectedTransaction = transaction;
    }

    closeDetails() {
        this.selectedTransaction = null;
    }

    calculateTotal(transaction: any): number {
        if (!transaction || !transaction.details) return 0;
        return transaction.details.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0);
    }

    // danh sach lich su da loc va sap xep
    get filteredTransactions() {
        return this.transactions
            .filter(t => {
                // Tìm kiếm theo ID phiếu hoặc Ghi chú
                const term = this.searchTermTx.trim().toLowerCase();
                const matchesSearch = !term ||
                    t.id.toLowerCase().includes(term) ||
                    (t.note && t.note.toLowerCase().includes(term));

                // Lọc theo Loại phiếu (Nhập / Xuất)
                const matchesType = this.filterType === 'ALL' || t.type === this.filterType;

                return matchesSearch && matchesType;
            })
            .sort((a, b) => {
                // Lấy phần thời gian từ mã ID (VD: 20260904-105045) để sắp xếp
                const timeA = a.id.split('-').slice(2).join('');
                const timeB = b.id.split('-').slice(2).join('');

                if (this.sortByTx === 'date_desc') return timeB.localeCompare(timeA); // Mới nhất trước
                if (this.sortByTx === 'date_asc') return timeA.localeCompare(timeB);  // Cũ nhất trước
                return 0;
            });
    }

    // dat lai bo loc
    resetTxFilters() {
        this.searchTermTx = '';
        this.filterType = 'ALL';
        this.sortByTx = 'date_desc';
    }

    startEditItem(index: number) {
        this.editingIndex = index;
        this.editQuantity = this.tempDetails[index].quantity;
        this.editPrice = this.tempDetails[index].price;
        this.itemError = '';
    }

    saveEditItem(index: number) {
        if (this.editQuantity <= 0) {
            this.itemError = 'Số lượng sửa phải lớn hơn 0!';
            return;
        }
        if (this.editPrice <= 0) {
            this.itemError = 'Đơn giá sửa phải lớn hơn 0!';
            return;
        }

        this.tempDetails[index].quantity = this.editQuantity;
        this.tempDetails[index].price = this.editPrice;
        this.editingIndex = null;
        this.itemError = '';
    }

    cancelEditItem() {
        this.editingIndex = null;
        this.itemError = '';
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

    onProductSelect() {
        const product = this.products.find(p => p.id === this.selectedProductId);
        if (product) {
            this.inputPrice = Number(product.price) || 0;
        } else {
            this.inputPrice = 0;
        }
        this.itemError = '';
        // console.log(2);
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