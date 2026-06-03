import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AfterViewInit } from '@angular/core';
import { ProductService } from '../../services/product-service';
import Swiper from 'swiper';
import { Product } from '../../models/productModel';
import { RouterOutlet } from '@angular/router';

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FreeMode } from 'swiper/modules';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CategoryService } from '../../services/category-service';
import { SignalService } from '../../services/signal-service';
import { AssetService } from '../../services/asset-service';
@Component({
  selector: 'app-menu-component',
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './menu-component.html',
  styleUrl: './menu-component.css',
})
export class MenuComponent implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }






  products: Product[] = []


  constructor(private categoryService: CategoryService,private signalService:SignalService,private productService: ProductService , public asset: AssetService) {} // kategory gelir
  
  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    // Slider başlat
    new Swiper('.swiper', {
      modules: [FreeMode],
      slidesPerView: 'auto',
      spaceBetween: 20,
      freeMode: true // mouse ve touch drag
    });

  // Başlangıçta ürünleri yükle
  this.loadFeaturedProducts();

  // 🔹 SignalR bağlantısını başlat
  this.signalService.startConnection();

  // 🔹 Sadece MenuUpdated event dinleniyor
  this.signalService.onMenuUpdated(() => {
    // Kategoriler veya ürünler değiştiğinde yenile
    this.loadFeaturedProducts();
  });

  }


      faSearch = faMagnifyingGlass;

       loadFeaturedProducts() {
    if (!this.isBrowser) {
      return;
    }

    // Backend'e category adıyla istekte bulun
    this.productService.getAllFeaturedProducts().subscribe(res => {
      this.products = res.data;
    });
  }

}
