import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/productModel';
import { Category } from '../../models/categoryModel'; // Modelini ekle
import { CategoryService } from '../../services/category-service'; // Servisini ekle
import { ProductService } from '../../services/product-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SingleResponseModel } from '../../models/singleResponseModel';
import { PRODUCT_UPLOADS_BASE_URL } from '../../constants/categoryConstants';

@Component({
  selector: 'app-product-search-component',
  standalone: true, // Eğer standalone kullanıyorsan
  imports: [CommonModule, FormsModule],
  templateUrl: './product-search-component.html',
  styleUrl: './product-search-component.css',
})
export class ProductSearchComponent implements OnInit {
  readonly productUploadsBaseUrl = PRODUCT_UPLOADS_BASE_URL;
  searchName: string = '';
  allCategories: Category[] = []; // Tüm kategoriler burada duracak
  groupedProducts: { [key: string]: Product[] } = {}; // Gruplanmış hali
  
  noResults: boolean = false;
  searchResponseMessage: string = '';
  searched: boolean = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    // Bileşen yüklendiğinde kategorileri bir kez çekiyoruz
    this.categoryService.getAllCategories().subscribe(res => {
      this.allCategories = res.data;
    });
  }

  onSearch() {
    this.searched = true;

    if (!this.searchName.trim()) {
      this.noResults = true;
      this.searchResponseMessage = "Bir ürün adı girin";
      this.groupedProducts = {};
      return;
    }

    this.productService.productSearch(this.searchName).subscribe((res: SingleResponseModel<Product[]>) => {
      const results = res.data;

      if (!results || results.length === 0) {
        this.noResults = true;
        this.searchResponseMessage = "Sonuç Bulunamadı";
        this.groupedProducts = {};
      } else {
        this.noResults = false;
        this.searchResponseMessage = '';
        this.groupProductsByCategoryId(results);
      }
    });
  }

  private groupProductsByCategoryId(products: Product[]) {
    this.groupedProducts = {}; // Sıfırla

    products.forEach(product => {
      // Üründeki categoryId'ye göre allCategories içinden ismi bul
      const category = this.allCategories.find(c => c.categoryId === product.categoryId);
      const categoryName = category ? category.categoryName : 'Diğer';

      if (!this.groupedProducts[categoryName]) {
        this.groupedProducts[categoryName] = [];
      }
      this.groupedProducts[categoryName].push(product);
    });
  }
}