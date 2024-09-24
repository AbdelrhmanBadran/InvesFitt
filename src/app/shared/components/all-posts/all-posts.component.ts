import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { PostService } from '../../services/post.service';
import { isPlatformBrowser } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { PostDialogComponent } from '../../../faciilties/post-dialog/post-dialog.component';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrl: './all-posts.component.scss',
  providers: [DialogService]

})
export class AllPostsComponent {

  @Input('posts') posts:any[] = [];
  postImageBaseurl: string = '';
  postslike: any[] = [];
  noOfLikesPost: any[] = [];
  pageId: any;
  token: string = '';
  userMode: boolean = true;
  ownFacility: boolean= false;
  ref: DynamicDialogRef | undefined;
  visitorMode: boolean=true;
  myPostMode: boolean = false;
  visible: boolean[] = [];
  isInCart: any[] = [];
  tooltipOptions:any = {
    showDelay: 150,
    autoHide: false,
    tooltipEvent: 'hover',
  };


  constructor(
    public common:CommonService,
    private post: PostService,
    private order: OrderService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private dialogService: DialogService,
    private spinner:NgxSpinnerService,
    private message:MessageService,
    private translate: TranslateService,
    private router: Router,

    
  )
  {
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('token')!;
      this.userMode = localStorage.getItem('profile-mode') == 'user' ? true : false
      this.visitorMode = localStorage.getItem('isVisitor') == 'true' ? true :false;
      this.myPostMode =  localStorage.getItem('profile-mode') == 'page' ? true : false;
    }
  }

  ngOnInit(): void {
    this.postImageBaseurl = this.post.PostImageUrl
    setTimeout(() => {
      console.log(this.posts);

    }, 100);      
    this.posts?.forEach((post:any) => {
      this.visible.push(false)
      this.isInCart.push(post.is_in_cart)
      this.pageId = post.page_acc_id
      this.postslike.push(post.likePost)
      this.noOfLikesPost.push(post.statistics.like - 0)
    });
    if (isPlatformBrowser(this.platformId)) {
      this.ownFacility = this.pageId == localStorage.getItem('pageId') ? true : false
    }
  }



  addToCart(id:string , pageId:string , quantity:string = '1' , i:number){
    if(!this.visitorMode)
    {
      this.isInCart[i] = this.isInCart[i] == '0' ? '1' : '1'
      this.order.addToCart(id,pageId,quantity).subscribe({
        next:res=>{
          console.log(res);
          if (res?.success) {
            let cartNum = this.order.cartNum.getValue()
            this.order.cartNum.next(cartNum + 1)
            this.translate.get('Item added successfully').subscribe((translations) => {
              this.message.add({severity:'success' , detail:translations})
            })
            
          }else if(res?.error){
            this.translate.get(res?.error).subscribe((translations) => {
              this.message.add({severity:'error' , detail:translations})
            })
          }else{
            this.translate.get('please try again').subscribe((translations) => {
              this.message.add({severity:'error' , detail:translations})
            })
          }
        },
        error:err=>{
          console.log(err);
          
        }
      })
    }else{
      this.translate.get('please  log in').subscribe(data=>{
        this.message.add({severity:'warn', detail:data})
      })
    }
  }

  goToPostDetails(id:string)
  {
    this.router.navigate(['/facility/post' , id]);
  }

  likePost(id:string , type:string , i :number){
    if(!this.visitorMode)
    {
      if(this.postslike[i] == true){
        this.noOfLikesPost[i]--;
      }else{
        this.noOfLikesPost[i]++;
      }
      console.log(id);
      
      this.postslike[i] = !this.postslike[i]
      this.post.likePageOrPost(id , type ).subscribe({
        next:res=>{
          console.log(res);
        },
        error:err=>{
          console.log(err);
        }
      })
    }else{
        this.translate.get('please  log in').subscribe(data=>{
          this.message.add({severity:'warn', detail:data})
        })
      }
  }

  openDialog(data:string , post:any = null , action:any = 'add') {
    if(data == 'post'){
      data = 'product'
    }
    let header = action + ' ' + data
    this.translate.get(header).subscribe((translatedHeader: string) => {
      this.ref = this.dialogService.open(PostDialogComponent , {
        data : {
          type:data,
          post:post
        },
        header: translatedHeader,
        width: '50vw',
        modal:true,
        breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
        },
      });
    });
    this.ref?.onClose.subscribe((data: any) => {
      this.common.layerOn = false
      console.log(data);
      if (data == 'updated') {
        this.common.updatedPost.next('update')
      }
    });
  }


  showDialog(i:any) {
      this.visible[i] = true;
  }
  
}
