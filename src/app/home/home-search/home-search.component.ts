import { Component, ElementRef, OnInit, ViewChild, viewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-search',
  templateUrl: './home-search.component.html',
  styleUrl: './home-search.component.scss'
})
export class HomeSearchComponent implements OnInit {

  @ViewChild("searchInput") searchInput!:ElementRef ;

  empty:boolean = true;

  constructor(
    private router:Router
  ){

  }
  ngOnInit(): void {

  }

  search(){
    if(this.searchInput.nativeElement.value.length > 0){
      this.empty = false
    }else{
      this.empty = true
    }
    
  }

  goToSearch()
  {
    this.router.navigate(['/home/search'])
  }
}
