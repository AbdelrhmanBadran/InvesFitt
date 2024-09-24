import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { from } from 'rxjs';

@Directive({
  selector: '[appHeaderAnimation]',
  standalone: true,
})
export class HeaderAnimationDirective {
  headerElement: HTMLElement;
  navItems: HTMLElement[];
  topNav: any;
  initialOpacity = 0;
  finalOpacity = 1;
  scrollThreshold = 100; // Adjust this value to change the scroll threshold

  private lastScrollTop = 0; // Keep track of the last scroll position
  private defaultNavHeight = 50; // Set the default navigation height

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    this.headerElement = this.elementRef.nativeElement;
    this.navItems = Array.from(
      this.headerElement.querySelectorAll('.nav-link')
    );
    // this.navItems.forEach((navItem) => (navItem.style.color = '#fff'));
    this.topNav = this.headerElement.querySelector('.top_nav');
    this.renderer.setStyle(
      this.headerElement,
      'background-color',
      '#000000'
    );
    this.renderer.setStyle(this.headerElement, 'box-shadow', 'none');
    this.renderer.setStyle(
      this.headerElement,
      'transition',
      'background-color 0.5s ease, opacity 0.5s ease'
    );
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const opacity = this.calculateOpacity(scrollTop);
    // this.renderer.setStyle(
    //   this.headerElement,
    //   'background-color',
    //   `rgba(255,255,255,${opacity.toString()})`
    // );
    this.renderer.setStyle(
      this.headerElement,
      'box-shadow',
      `rgba(0, 0, 0, ${(opacity / 100).toString()}) 0px 16px 32px`
    );
    if (scrollTop >= 0) {
      const newHeight = Math.max(this.defaultNavHeight - scrollTop, 0); // Ensure minimum height
      this.renderer.setStyle(this.topNav, 'height', `${newHeight}px`);
      this.renderer.setStyle(this.topNav, 'opacity', `${newHeight}`);
    }
    // if (scrollTop < 40) {
    //   this.navItems.forEach((navItem) => (navItem.style.color = '#fff'));
    // } else {
    //   this.navItems.forEach((navItem) => (navItem.style.color = '#000'));
    // }
  }

  private calculateOpacity(scrollTop: number): number {
    if (scrollTop < this.scrollThreshold) {
      return this.initialOpacity;
    } else {
      const progress =
        (scrollTop - this.scrollThreshold) / this.scrollThreshold;
      return (
        this.initialOpacity +
        (this.finalOpacity - this.initialOpacity) * progress
      );
    }
  }
}
