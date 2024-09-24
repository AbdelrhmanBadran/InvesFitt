import { Component, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { BreadcrumbLink } from '../../interfaces/common';
import { ActivatedRoute } from '@angular/router';
import { CommonApiService } from '../../services/common-api.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  standalone:true,
  imports:[BreadcrumbComponent],
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
  BreadcrumbLinks: BreadcrumbLink[] = [];
  pageList = {1:'Terms & Conditions', 2:'Privacy Policy'}
  currentTitle = '';
  pageInnerData = {};
  pageId: any;
  pageContent:any;

  constructor(
    private route:ActivatedRoute,
    private common:CommonApiService,
  ) {
  }


  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.pageId = params['id'];
      this.getAllPages();
      this.common.langUpdated.subscribe((res) => {
        this.getOnePage(this.pageId)
      })
    });
  
  }

  GetPageInnerData(){
    this.pageInnerData= {}
  }

  getAllPages(){
    this.common.getAllPage().subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  getOnePage(id:number){
    this.common.getOnePage(id).subscribe({
      next: (res) => {
        console.log(res);
        if (res?.status == 200) {
          this.pageContent = res?.data[0]
          this.currentTitle = this.pageContent?.title
          const obj = {label: `${this.currentTitle}`, route: ''};
          this.BreadcrumbLinks = [{ label: 'Home', route: '/home' },obj];
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
