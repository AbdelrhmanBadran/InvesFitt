import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../shared/services/common.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  
  
  constructor(
    private translate: TranslateService,
    private common:CommonService
  ){
    this.translate.use(this.common.lang_code);
    
  }
}
