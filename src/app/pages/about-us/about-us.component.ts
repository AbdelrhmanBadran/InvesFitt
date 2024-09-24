import { Component, OnInit } from '@angular/core';
import { FaqComponent } from '../home/faq/faq.component';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports:[FaqComponent],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
