import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { ProductService } from '../products/product.service';
import { StockTransaction, TransactionType, TransactionDetail } from '../../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
    private key = 'TRANSACTIONS';

    constructor(
        private storage: LocalStorageService,
        private productService: ProductService
    ) { }

    getAll(): StockTransaction[] {
        return this.storage.get<StockTransaction>(this.key);
    }


}