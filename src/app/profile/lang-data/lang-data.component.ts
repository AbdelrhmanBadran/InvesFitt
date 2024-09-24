import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-lang-data',
  templateUrl: './lang-data.component.html',
  styleUrl: './lang-data.component.scss'
})
export class LangDataComponent {
  codes!: any[];
  selectedLang: any ;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService,
    private renderer: Renderer2,
    public common:CommonService,
    private el: ElementRef,
    private render:Renderer2,

  )
  {
  }

  ngOnInit() {
    if(localStorage.getItem('front-lang') == 'ar')
      {
        this.codes = [
          {code:'ar' , name:'العربية'},
          {code:'en' , name:'الانجليزية'}
        ]; 
        this.selectedLang = {code:'ar' , name:'العربية'};
      }else{
        this.codes = [
          {code:'ar' , name:'Arabic'},
          {code:'en' , name:'English'}
        ];
        this.selectedLang = {code:'en' , name:'English'}

      }

  }

  changeLanguage()
  {
    if (isPlatformBrowser(this.platformId)) {
      if(localStorage.getItem('front-lang') !== this.selectedLang?.code)
      {
        if(this.selectedLang?.code){
          if (this.selectedLang.code == "ar") {
            this.renderer.setAttribute(document.documentElement, 'dir', 'rtl');
            this.renderer.setAttribute(document.documentElement, 'lang', 'ar');
            localStorage.setItem("front-lang", "ar");
            this.common.lang_code = 'ar';
          } else if(this.selectedLang?.code == 'en') {
            this.renderer.setAttribute(document.documentElement, 'dir', 'ltr');
            this.renderer.setAttribute(document.documentElement, 'lang', 'en');
            document.body.classList.add("ltr");
            localStorage.setItem("front-lang", "en");
            this.common.lang_code = 'en';
          }
          this.translate.use(this.selectedLang?.code);
        }
        location.reload(); 
      }
    }
  }

  ngAfterViewInit(): void {
    const checkMark = document.querySelector('.lang-data .p-listbox .p-listbox-list .p-listbox-item.p-highlight::after');
    console.log(checkMark);
    
    if(checkMark){
      this.render.setStyle(checkMark, 'left' , '0');
      this.render.setStyle(checkMark, 'right' , 'initial');
    }
  }
}
