import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CommonApiService } from '../../../services/common-api.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  standalone: true,
  imports: [CommonModule,NgbAccordionModule , TranslateModule],
  styleUrls: ['./faq.component.css'],
})
export class FaqComponent implements OnInit {
  faq: any[] = [];
  sub: Subscription | undefined;
  constructor(
    private common : CommonApiService,
  ) {
  }

  ngOnInit() {
    this.sub = this.common.langUpdated.subscribe(() => {
      this.getAllFaq();
    })
  }



  getAllFaq()
  {
    this.common.GetAllFaq().subscribe({
      next: (res) => {
        console.log(res);
        
        this.faq = res.data;
      },error: (err) => {
        console.log(err);
        
      }
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();  
  }
}
