import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
// import { UploadPhotoService } from '../../../services/upload-photo-service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../../services/auth-service';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { PRODUCT_UPLOADS_BASE_URL } from '../../../constants/categoryConstants';

@Component({
  selector: 'app-admin-panel-component',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './admin-panel-component.html',
  styleUrl: './admin-panel-component.css',
})
export class AdminPanelComponent implements OnInit {
  readonly productUploadsBaseUrl = PRODUCT_UPLOADS_BASE_URL;



  isSidebarOpen = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

   currentUser : any;

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;

    if (isPlatformBrowser(this.platformId) && !this.currentUser) {
      this.authService.me().subscribe({
        next: (user) => {
          this.currentUser = user;
        },
        error: () => {
          this.router.navigate(['/login']);
        },
      });
    }

  }


  openSidebar() {
    this.isSidebarOpen = true;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }


    // ✅ Logout fonksiyonu
  logout() {
    this.authService.logout().subscribe({
      next: (res) => {
        console.log(res.message); // backend’den gelen "Logout başarılı"
        // Frontend state temizleme (ör: localStorage)
        // Login sayfasına yönlendir
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout sırasında hata:', err);
      },
    });
  }









}
