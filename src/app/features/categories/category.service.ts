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

    existsByName(name: string, excludeId?: string): boolean {
        const formattedName = name.trim().toLowerCase();
        return this.getAll().some(
            c => c.name.trim().toLowerCase() === formattedName && c.id !== excludeId
        );
    }

    private generateCategoryId(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `CAT-${year}${month}${day}-${hours}${minutes}${seconds}`;
    }

    add(name: string): boolean {
        if (!name.trim()) return false;
        if (this.existsByName(name)) {
            alert(`Cảnh báo: Danh mục "${name.trim()}" đã tồn tại!`);
            return false;
        }

        const items = this.getAll();
        const newCategory: Category = {
            id: this.generateCategoryId(),
            name: name.trim()
        };

        items.push(newCategory);
        this.storage.set(this.key, items);
        return true;
    }

    delete(id: string): void {
        const items = this.getAll().filter(c => c.id !== id);
        this.storage.set(this.key, items);
        alert('Xóa danh mục thành công!');
    }

    update(id: string, newName: string): boolean {
        const items = this.getAll();
        const category = items.find(c => c.id === id);
        if (category) {
            if (this.existsByName(newName)) {
                alert(`Cảnh báo: Danh mục "${newName.trim()}" đã tồn tại!`);
                return false;
            }
            else {
                category.name = newName;
                this.storage.set(this.key, items);
                return true;
            }
        }
        return false;
    }
}