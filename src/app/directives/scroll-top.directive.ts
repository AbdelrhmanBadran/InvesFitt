import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appScrollTop]',
  standalone: true
})
export class ScrollTopDirective {
  @Input() scrollToTopThreshold: number = 100;
  @Input() scrollDuration: number = 300;

  constructor(private elementRef: ElementRef) {}

  @HostListener('click')
  onElementClick(): void {
    this.scrollToTop();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (window.pageYOffset >= this.scrollToTopThreshold) {
      this.elementRef.nativeElement.classList.add('show');
    } else {
      this.elementRef.nativeElement.classList.remove('show');
    }
  }

  private scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}

