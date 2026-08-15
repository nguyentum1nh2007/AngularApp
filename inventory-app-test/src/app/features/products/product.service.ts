import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { Product } from '../../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
    private key = 'PRODUCTS';

    constructor(private storage: LocalStorageService) { }

    getAll(): Product[] {
        return this.storage.get<Product>(this.key);
    }

    add(product: Product): void {
        const items = this.getAll();
        items.push(product);
        this.storage.set(this.key, items);
    }

    update(product: Product): void {
        const items = this.getAll();
        const index = items.findIndex(p => p.id === product.id);
        if (index !== -1) {
            items[index] = product;
            this.storage.set(this.key, items);
        }
    }

    delete(id: string): void {
        const items = this.getAll().filter(p => p.id !== id);
        this.storage.set(this.key, items);
    }
}