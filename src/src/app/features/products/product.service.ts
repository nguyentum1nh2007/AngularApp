import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { Product } from '../../models/product.model';
import { log } from 'node:console';

@Injectable({ providedIn: 'root' })
export class ProductService {
    private key = 'PRODUCTS';

    constructor(private storage: LocalStorageService) { }

    getAll(): Product[] {
        console.log(this.storage.get<Product>(this.key));

        return this.storage.get<Product>(this.key);
    }

    existsByNameAndCategory(name: string, categoryId: string, excludeId?: string): boolean {
        const formattedName = name.trim().toLowerCase();
        return this.getAll().some(
            p => p.name.trim().toLowerCase() === formattedName &&
                p.categoryId === categoryId &&
                p.id !== excludeId
        );
    }

    add(product: Product): boolean {
        if (this.existsByNameAndCategory(product.name, product.categoryId)) {
            return false;
        }

        const items = this.getAll();
        items.push(product);
        this.storage.set(this.key, items);
        return true; // Thành công
    }

    update(product: Product): boolean {

        const items = this.getAll();
        const index = items.findIndex(p => p.id === product.id);
        if (index !== -1) {
            items[index] = product;
            this.storage.set(this.key, items);
            return true;
        }
        return false;
    }

    delete(id: string): void {
        const items = this.getAll().filter(p => p.id !== id);
        this.storage.set(this.key, items);
    }
}