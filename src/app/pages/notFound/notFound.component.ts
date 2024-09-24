import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-notFound',
  templateUrl: './notFound.component.html',
  standalone: true,
  imports:[RouterModule],
  styleUrls: ['./notFound.component.css'],
})
export class NotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
