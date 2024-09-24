import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../services/config';

@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.css'],
  standalone: true,
})
export class PhotoGalleryComponent implements OnInit {
@Input()
images: string[] = [];
@Input()
currentIndex: number = 0;
public environment = environment
constructor() { }

ngOnInit() {
    console.log("🚀 ~ PhotoGalleryComponent ~ currentIndex:", this.currentIndex)
  }

  nextImage() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    }
  }

  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

}
