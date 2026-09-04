import { Pipe, PipeTransform, inject } from '@angular/core';
import { CategoryService } from '../../features/categories/category.service';

@Pipe({
  name: 'categoryName',
  standalone: true
})
export class CategoryNamePipe implements PipeTransform {
  private categoryService = inject(CategoryService);

  transform(categoryId: string): string {
    const categories = this.categoryService.getAll();
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : 'Chưa phân loại';
  }
}