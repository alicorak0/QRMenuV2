import { Component, inject, PLATFORM_ID, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Category } from '../../models/categoryModel';
import { CategoryService } from '../../services/category-service';
import { SignalService } from '../../services/signal-service';

@Component({
  selector: 'app-categories-component',
  imports: [CommonModule,RouterModule],
  templateUrl: './categories-component.html',
  styleUrl: './categories-component.css',
})
export class CategoriesComponent implements OnInit, AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  constructor(
    private categoryService: CategoryService,
    private signalService: SignalService
  ) {}

  categories: Category[] = [];

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.signalService.startConnection();
    this.signalService.onMenuUpdated(() => {
      this.getAllCategories();
    });

    this.getAllCategories();
  }


ngAfterViewInit(): void {
   
}
    


 getAllCategories(){  
   if (!this.isBrowser) {
     return;
   }

   // Backend'e category adıyla istekte bulun
    this.categoryService.getAllCategories().subscribe(res => {

  console.log(res.data); // categoryName mi var yoksa name mi
      this.categories = res.data;
    });
 }
   
 // ---- slugify fonksiyonu ----
slugify(name: string): string {
  if (!name) return '';

  return name
    .trim()
    .toLowerCase()
    // Önce Türkçe karakterleri güvenli bir şekilde değiştiriyoruz
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i') // İşte senin sorununun ilacı bu satır
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    // Sonra standart temizlik işlemlerine devam ediyoruz
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') 
    .replace(/[\s\_]+/g, '-') 
    .replace(/[^\w\-]+/g, '') 
    .replace(/\-\-+/g, '-') 
    .replace(/^-+/, '') 
    .replace(/-+$/, '');
}


}
