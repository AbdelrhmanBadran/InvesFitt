import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-how-works',
  imports:[TranslateModule],
  standalone: true,
  templateUrl: './how-works.component.html',
  styleUrls: ['./how-works.component.css']
})
export class HowWorksComponent implements OnInit {

  constructor(
    private router:Router
  ) { }

  ngOnInit() {
  }


  navigateTo()
  {
    this.router.navigate(['/find-gym'] , {queryParams:{searchValue:""}}) 
  }
}
