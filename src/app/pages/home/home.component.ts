import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FaqComponent } from './faq/faq.component';
import { HowWorksComponent } from './how-works/how-works.component';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FaqComponent,
    HowWorksComponent,
    TranslateModule,
    RouterModule,
  ],
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  SearchForm!: FormGroup;
  IsSubmitted = false;

  constructor(private formBuilder: FormBuilder, private router: Router,
    private localstorageService: LocalstorageService
  ) {
  }
  
  ngOnInit() {
    this.InitSearchForm();
  }

  InitSearchForm() {
    this.SearchForm = this.formBuilder.group({
      SearchValue: [''],
    });
  }

  SubmitSearch() {    
    const queryParams = this.SearchForm.get('SearchValue').value;
    this.localstorageService.setItem('searchValue', queryParams);
    this.router.navigate(['/find-gym'], { queryParams: {searchValue: queryParams}});
  }
  
}
