import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentSlide = 0;
  totalSlides = 3; // Cambia esto si agregas o quitas imágenes

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoSlide();
    }
  }

  startAutoSlide() {
    setInterval(() => {
      this.nextSlide();
    }, 4000); // Cambia el tiempo de intervalo si es necesario
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateSlide();
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.updateSlide();
  }

  updateSlide() {
    if (isPlatformBrowser(this.platformId)) {
      const container = document.querySelector('.carousel-container') as HTMLElement;
      if (container) {
        const translateX = -this.currentSlide * 100;
        container.style.transform = `translateX(${translateX}%)`;
      }
    }
  }

  redirectTo(route: string) {
    this.router.navigate([route]);
  }
}
