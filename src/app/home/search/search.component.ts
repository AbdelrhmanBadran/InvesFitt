import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { PostService } from '../../shared/services/post.service';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  searchTerm:string = '';
  postSub!:Subscription
  timeOut!: NodeJS.Timeout;
  dataDone:boolean = false;
  posts: any[] = [];
  noData: boolean =false;
  dataNone:boolean = true;
  constructor(
    private post:PostService,
    private message:MessageService,
    private spinner:NgxSpinnerService,
    private translate:TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object,

  )
  {
    // this.spinner.show();
      // console.log(this.dataNone);
      // console.log(this.noData);
      if (isPlatformBrowser(this.platformId)) {
        this.translate.use(localStorage.getItem('front-lang') == null ? 'ar' : localStorage.getItem('front-lang')!)
      }
    
  }

  getNearbyPosts(searchTerm:any)
  {
    clearTimeout(this.timeOut)
    this.noData=false;
    this.spinner.show();
    this.timeOut = setTimeout(() => {
      this.dataNone = searchTerm?.length == 0 ? true : false
      this.noData = searchTerm?.length == 0 ? true : false
      if (searchTerm) {
        this.post.getNearbyPosts(searchTerm).subscribe({
          next:res=>{
            console.log(res);
            if (res?.success) {
              this.dataDone = true;
              this.posts = res?.data
              this.spinner.hide();
            }else{
              this.noData = true;
              this.spinner.hide();
            }
          },
          error:err=>{
            console.log(err);
            this.spinner.hide();
            
          }
        })
      }else{
        this.noData = true;
        this.spinner.hide();
      }
    }, 1000);
  }


  showSoonMessage(){
    this.translate.get('sooooon').subscribe(data=>{
      this.message.add({severity:'error' , detail:data})
    })  }

  tellMe(){
    this.showSoonMessage();
  }

  showLastSearch(){
    this.showSoonMessage();
  }
}
