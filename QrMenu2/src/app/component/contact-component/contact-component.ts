import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import{ RouterModule } from '@angular/router';
import { SafeResourceUrl } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-contact-component',
  imports: [CommonModule, RouterModule],
  templateUrl: './contact-component.html',
  styleUrl: './contact-component.css',
})
export class ContactComponent {

  googleMapUrl!: SafeResourceUrl;

 constructor(private sanitizer: DomSanitizer) {
    const url = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2737.232113504815!2d27.175655275321315!3d39.10612603436234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b9f969f1c47953%3A0xf16df9a1ff0e5f81!2sQuattro%20Coffee%20%26%20Kitchen%20Bergama!5e1!3m2!1str!2str!4v1771681420826!5m2!1str!2str" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
    this.googleMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

  }




isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

}
