import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BreadcrumbLink } from '../../interfaces/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  standalone: true,
  imports: [RouterModule, CommonModule ,TranslateModule],
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  @Input() links: BreadcrumbLink[] = [];
  @Input() currentTitle: string = '';

  constructor(private router: Router) {}
  ngOnInit(): void { }


  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
