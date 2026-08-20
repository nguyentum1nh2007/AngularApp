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

}