import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { Category } from '../../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
    private key = 'CATEGORIES';

    constructor(private storage: LocalStorageService) { }

    getAll(): Category[] {
        return this.storage.get<Category>(this.key);
    }

    add(name: string): void {
        if (!name.trim()) return;
        const items = this.getAll();
        items.push({ id: Date.now().toString(), name });
        this.storage.set(this.key, items);
    }

    delete(id: string): void {
        const items = this.getAll().filter(c => c.id !== id);
        this.storage.set(this.key, items);
        alert('Xóa danh mục thành công!');
    }

    update(id: string, newName: string): void {
        if (!newName.trim()) return;
        const items = this.getAll();
        const category = items.find(c => c.id === id);
        if (category) {
            category.name = newName;
            this.storage.set(this.key, items);
        }
    }
}