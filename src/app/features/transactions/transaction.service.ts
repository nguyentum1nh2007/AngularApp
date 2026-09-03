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
        return this.storage.get<StockTransaction>(this.key) || [];
    }

    // TRN-IN-YYYYMMDD-HHMMSS
    private generateTransactionId(type: TransactionType): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `TRN-${type}-${year}${month}${day}-${hours}${minutes}${seconds}`;
    }

    createTransaction(type: TransactionType, note: string, details: TransactionDetail[]): { success: boolean, errorMessage: string } {
        if (details.length === 0) {
            return { success: false, errorMessage: 'Phiếu phải có ít nhất 1 sản phẩm!' };
        }

        const products = this.productService.getAll();

        if (type === 'OUT') {
            for (const item of details) {
                const product = products.find(p => p.id === item.productId);
                if (!product) {
                    return { success: false, errorMessage: 'Không tìm thấy sản phẩm trong kho!' };
                }

                const currentStock = Number(product.stockQuantity) || 0;
                const itemQty = Number(item.quantity) || 0;

                if (currentStock < itemQty) {
                    return { success: false, errorMessage: `Sản phẩm "${product.name}" không đủ tồn kho! (Đang có: ${currentStock}, Cần xuất: ${itemQty})` };
                }
            }
        }

        const transaction: StockTransaction = {
            id: this.generateTransactionId(type),
            type,
            createdAt: new Date().toLocaleString('en-GB'),
            note: note.trim(),
            details
        };

        const transactions = this.getAll();
        transactions.push(transaction);
        this.storage.set(this.key, transactions);

        for (const item of details) {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                const currentStock = Number(product.stockQuantity) || 0;
                const itemQty = Number(item.quantity) || 0;
                const newPrice = Number(item.price);

                product.stockQuantity = currentStock + (type === 'IN' ? itemQty : -itemQty);
                if (newPrice > 0) {
                    product.price = newPrice;
                }

                this.productService.update(product);
            }
        }

        return { success: true, errorMessage: '' };
    }

    deleteTransaction(id: string): { success: boolean, errorMessage: string } {
        const transactions = this.getAll();
        const transactionIndex = transactions.findIndex(t => t.id === id);

        if (transactionIndex === -1) {
            return { success: false, errorMessage: 'Không tìm thấy phiếu!' };
        }

        const transaction = transactions[transactionIndex];
        const products = this.productService.getAll();

        if (transaction.type === 'IN') {
            for (const item of transaction.details) {
                const product = products.find(p => p.id === item.productId);
                if (product) {
                    const currentStock = Number(product.stockQuantity) || 0;
                    const itemQty = Number(item.quantity) || 0;

                    if (currentStock < itemQty) {
                        return {
                            success: false,
                            errorMessage: `Không thể xóa phiếu vì sản phẩm "${product.name}" sẽ bị âm tồn kho! (Đang có: ${currentStock}, Cần trừ đi để hoàn tác: ${itemQty})`
                        };
                    }
                }
            }
        }

        for (const item of transaction.details) {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                const currentStock = Number(product.stockQuantity) || 0;
                const itemQty = Number(item.quantity) || 0;
                product.stockQuantity = currentStock + (transaction.type === 'IN' ? -itemQty : itemQty);
                this.productService.update(product);
            }
        }

        transactions.splice(transactionIndex, 1);
        this.storage.set(this.key, transactions);

        return { success: true, errorMessage: '' };
    }
}