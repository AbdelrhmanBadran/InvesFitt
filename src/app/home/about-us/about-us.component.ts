import { Component } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {


  constructor(
    public common:CommonService
  ){

  }
}
