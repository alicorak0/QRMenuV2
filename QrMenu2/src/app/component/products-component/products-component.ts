import { Component, inject, PLATFORM_ID } from '@angular/core';
import { Product } from '../../models/productModel';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { RouterModule, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ProductSearchComponent } from '../product-search-component/product-search-component';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Category } from '../../models/categoryModel';
import { CategoryService } from '../../services/category-service';
import { SignalService } from '../../services/signal-service';
import { AssetService } from '../../services/asset-service';  

@Component({
  selector: 'app-products-component',
  imports: [CommonModule, RouterModule, ProductSearchComponent],
  templateUrl: './products-component.html',
  styleUrl: './products-component.css',
})

export class ProductsComponent implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);


  @ViewChild('bgVideo') bgVideo!: ElementRef<HTMLVideoElement>;

  allCategories: Category[] = [];
  products: Product[] = [];
  currentTitle: string = '';
  activeKey: string = ''; // URL'den gelen slug: 'tatlilar'
activeCategoryId: number = 0; // component class içinde


  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router, 
    private signalService:SignalService ,//Web Socket için
    public asset: AssetService 

  ) { }

  ngOnInit(): void {
  if (!this.isBrowser) {
    return;
  }

  // 1️⃣ SignalR bağlantısını başlat
  this.signalService.startConnection();

  // 2️⃣ Tüm menü güncellemelerini merkezi olarak dinle
  this.signalService.onMenuUpdated(() => {
      this.loadAllCategories();

    // Ürünler değiştiğinde aktif kategorinin ürünlerini yenile
    if (this.activeKey) {
      this.loadProducts(this.activeKey);
    }

  });

  // 3️⃣ Mevcut kategorileri yükle
  this.loadAllCategories();

  // 4️⃣ Route değişimlerini dinle - nested route'dan 'name' parametresini al
  this.route.params.subscribe(params => {
    this.activeKey = params['name']; // URL'den slug (ör: 'tatlilar')

    if (this.activeKey) {
      console.log('Aktif kategori slug:', this.activeKey);
      this.updateTitle();
      this.loadProducts(this.activeKey);
    }
  });
}
  loadAllCategories() {
    this.categoryService.getAllCategories().subscribe((response: any) => {
      this.allCategories = response.data;

      // KRİTİK NOKTA: Kategoriler API'den geldiği anda başlığı ve ürünleri güncelle
      // Bu, sayfa ilk açıldığında (refresh) verilerin gelmesini sağlar.
      if (this.activeKey) {
        this.updateTitle();
        this.loadProducts(this.activeKey);
      }
    });
  }

  loadProducts(slug: string) {
    // Strategy: Try to find exact category match, or use slug as fallback
    
    let categoryName = slug;
    
    // If categories are loaded, try to find exact match
    if (this.allCategories.length > 0) {
      const foundCategory = this.allCategories.find(c => this.slugify(c.categoryName) === slug);
      
      if (foundCategory) {
        categoryName = foundCategory.categoryName;
        this.activeCategoryId = foundCategory.categoryId;
      } else {
        // Kategoriler yüklendi ama eşleşme yok - hatalı URL
        console.error('Kategori bulunamadı:', slug);
        // this.router.navigate(['/menu']);
        return;
      }
    } else {
      // Kategoriler henüz yüklenmedi - slug'ı kategori adı olarak kullan (fallback)
      // Slug'ı normal forma çevir: 'tatlilar' -> 'Tatlilar'
      categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
      console.log('Kategoriler henüz yüklenmedi. Slug kullanılıyor:', categoryName);
    }

    // Backend'e ürünleri iste
    this.productService.getProductsByCategory(categoryName).subscribe(
      (res) => {
        this.products = res.data;
        console.log('Ürünler yüklendi:', this.products.length);
      },
      (error) => {
        console.error('Ürün yükleme hatası:', error);
        this.products = [];
      }
    );
  }

  updateTitle() {
    const found = this.allCategories.find(c => this.slugify(c.categoryName) === this.activeKey);
    this.currentTitle = found ? found.categoryName : '';
  }

  slugify(name: string): string {
    if (!name) return '';
    return name
      .trim()
      .toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[\s\_]+/g, '-').replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
  }

  ngAfterViewInit() {
    if (!this.isBrowser || !this.bgVideo) {
      return;
    }

    // Video kodların aynı kalsın...
    const vid = this.bgVideo.nativeElement;
    vid.muted = true;
    const tryPlay = () => {
      vid.play().catch(() => setTimeout(() => vid.play(), 300));
    };
    if (vid.readyState >= 2) tryPlay(); else vid.onloadeddata = tryPlay;
  }
}

