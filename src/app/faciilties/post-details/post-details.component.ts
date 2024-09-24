import { Component, ElementRef, Inject, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../shared/services/post.service';
import { isPlatformBrowser } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../../shared/services/user.service';
import { ProfileServiceService } from '../../shared/services/profile.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { PostDialogComponent } from '../post-dialog/post-dialog.component';
import { OrderService } from '../../shared/services/order.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.scss',
  providers: [DialogService]

})
export class PostDetailsComponent {

  @ViewChild('popUpImageContainer') popUpImageContainer!:ElementRef;
  @ViewChild('popUpImageSrc') popUpImageSrc!:ElementRef;
  @ViewChild('closeBtn') closeBtn!:ElementRef;


  token: string = '';
  postDetails:any;
  postImageBaseurl: any;
  noOfLikesPost: any;
  postslike: any;
  comments: any;
  elapsedCommentTime: any[] = [];
  dateSacle: any[] = [];
  replies: any[] = [];
  commentlike: boolean[] = [];
  noOfLikeComment: any[] = [];
  replylike: any[] = [];
  noOfreplyComment: any[] = [];
  elapsedReplyTime: any[] =[];
  dateSacleReply: any[] = [];
  noOfComments: any;
  noOfRepliesComment: any[] = [];
  userId: string = '';
  loading:boolean = true;
  start:number = 10;
  commentUserImages: any[] = [];
  repliesUserImages: any[] = [];
  userCimmentImageUrl: string = '';
  myPostMode:boolean = false;
  userImage: any = '';
  facilityImage: string = '';
  postId: any = '';
  ref: DynamicDialogRef | undefined;
  visitorMode: boolean = true;
  currentUser: any;
  userImageComment: any;

  constructor(
    public common:CommonService,
    private activate:ActivatedRoute,
    private router:Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private post: PostService, 
    private render: Renderer2, 
    private spinner: NgxSpinnerService,
    private user: UserService,
    private profile: ProfileServiceService,
    private dialogService: DialogService,
    private message:MessageService,
    private translate: TranslateService,
    private order: OrderService,

  ){
    if (isPlatformBrowser(this.platformId)) {
      this.translate.use(localStorage.getItem('front-lang') == null ? 'ar' : localStorage.getItem('front-lang')!)
      this.token = localStorage.getItem('token')!;
      this.visitorMode = localStorage.getItem('isVisitor') == 'true' ? true :false;
      this.userId = JSON.parse(localStorage.getItem('userData')!)?.id;
      this.myPostMode =  localStorage.getItem('profile-mode') == 'page' ? true : false;
      this.profile.getAllAccounts().subscribe({
        next:res=>{
          console.log(res?.success);
          res?.data.forEach((ele:any) => {
            if(ele.page_type == 'user'){
              this.userImage = ele.img
              this.userImageComment = this.post.commentImageUrl + ele.img
            }else{
              this.facilityImage = ele.img
              this.userImageComment = this.post.commentImageUrl + ele.img
            }
          });
        }
      })
    }
  }

  ngOnInit(): void {
    this.userCimmentImageUrl = this.post.commentImageUrl;

    
    this.spinner.show();
    this.postImageBaseurl = this.post.PostImageUrl
    this.activate.paramMap.subscribe((data:any)=>{
      let postId = data.get('postId')
      this.postId = data.get('postId')
      console.log(this.postId);
      this.getPostDetails(postId)
      
    })
  }

  //?--Error Image--//
  handleImage(e:any){
    // this.common.handleImage(e);
    e.target.src = 'assets/images/user.jpg'
  }

//?--getPostDetails--//
  getPostDetails(postId:any)
  {
    this.post.getPostDetails(postId).subscribe({
      next:res=>{
        if (isPlatformBrowser(this.platformId)) {
          if(res?.data.page_acc_id !== localStorage.getItem('pageId')! && this.myPostMode){
            this.router.navigate(['/home'])
          }
        }
        console.log(res);
        this.spinner.hide();
        this.loading = false
        if(res?.success){  
          this.postDetails = res?.data
          console.log(this.postDetails);
          this.noOfLikesPost = res?.data.statistics.like;
          this.noOfComments = res?.data.statistics.commentCount
          this.postslike = res?.data.likePost;
          this.comments = res?.data.comments;
          this.comments.forEach((ele:any) => {
            this.commentlike.push(ele?.likeComment)            
            this.noOfLikeComment.push(ele?.statistics.like);
            this.commentUserImages.push(ele?.user_details.img)
            this.noOfRepliesComment.push(ele?.statistics.commentCount);
            this.getElpasedAndScaleTime(this.elapsedCommentTime ,this.dateSacle ,ele.date_added);            
            this.replies.push(ele.replays);
          });
          this.replies.forEach((ele:any , index) =>{
            this.elapsedReplyTime.push([])
            this.dateSacleReply.push([])
            this.replylike.push([])
            this.noOfreplyComment.push([])
            this.repliesUserImages.push([])
            ele.forEach((reply:any) => {
              this.replylike[index].push(reply?.likeComment);            
              this.noOfreplyComment[index].push(reply?.statistics.like);
              this.repliesUserImages[index].push(reply?.user_details.img)
              this.getElpasedAndScaleTime(this.elapsedReplyTime[index] ,this.dateSacleReply[index] ,reply.date_added);
            });
          })            
        }
      },
      error:err=>{
        console.log(err);
        
      }
    })
  }
//?--Likwe---//
  likePost(id: any,type: any) {
    if(!this.visitorMode)
    {
      if(this.postslike == true){
        this.noOfLikesPost--;
      }else{
        this.noOfLikesPost++;
      }
      this.postslike = !this.postslike
      this.post.likePageOrPost(id , type).subscribe({
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

  likeComment(id:string , i:number){
    if(!this.visitorMode)
      {
    this.commentlike[i] = !this.commentlike[i]
    if(this.commentlike[i] == true){
      this.noOfLikeComment[i]++;
    }else{
      this.noOfLikeComment[i]--;  
    }
    this.post.likePageOrPost(id , 'comment').subscribe({
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

  likeReply(id:string , i:number ,  comentIndex:number){
    if(!this.visitorMode)
      {
    this.replylike[comentIndex][i] = !this.replylike[comentIndex][i]
    if(this.replylike[comentIndex][i] == true){
      this.noOfreplyComment[comentIndex][i]++;
    }else{
      this.noOfreplyComment[comentIndex][i]--;  
    }
    this.post.likePageOrPost(id , 'comment').subscribe({
      next:res=>{
        console.log(res);
      },
      error:err=>{
        console.log(err);
        
      }
    })}else{
      this.translate.get('please  log in').subscribe(data=>{
        this.message.add({severity:'warn', detail:data})
      })
    }
  }


  //?--Crud Comment--//
  AddCommentOrReply(id:string ,description:any , parentId = 0 , i:number = 0  ){
    if(!this.visitorMode)
      {
    console.log(description.value);
    
    this.post.addCommentOrReply(id,description.value , this.userId , parentId).subscribe({
      next:res=>{
        description.value = ''
        console.log(res);
        if(parentId == 0){
          let newComment ={
            "id": res?.data.id,
            "parent_id": "0",
            "description": res?.data.description,
            "img": res?.data.img,
            "date_added": res?.data.date_added,
            "user_id": res?.data.user_id,
            "post_id": res?.data.post_id,
            "app_version": res?.data.app_version,
            "commentIndex": this.comments.length,
            "likeComment": false,
            "statistics": {
              "like": "0",
              "commentCount": "0"
            },
            "replays": [],
          } 
          this.getElpasedAndScaleTime(this.elapsedCommentTime ,this.dateSacle ,res?.data.date_added );
          this.comments.push(newComment)
          this.commentUserImages.push(this.myPostMode ? this.facilityImage : this.userImage)
          this.replies.push(newComment.replays)
          this.noOfLikeComment.push('0')
        }else{
          let newReply =
          {
            "id": res?.data.id,
            "parent_id": res?.data.parent_id,
            "description": res?.data.description,
            "img": res?.data.img,
            "date_added": res?.data.date_added,
            "user_id": res?.data.user_id,
            "post_id": res?.data.post_id,
            "app_version": "1.1.1",
            "likeComment": false,
            "statistics": {
              "like": 0,
              "commentCount": 0
            }
          }
          this.replies[i].push(newReply)
          this.repliesUserImages[i].push(this.myPostMode ? this.facilityImage : this.userImage)
          this.elapsedReplyTime[i].push(this.common.lang_code == 'ar' ? 'الان' : 'now')
          console.log(this.elapsedReplyTime);
          this.dateSacleReply[i].push(''); 
        }
      },
      error:err=>{
        console.log(err);
      }
    })}else{
      this.translate.get('please  log in').subscribe(data=>{
        this.message.add({severity:'warn', detail:data})
      })
    }

    
  }

  deleteComment(id:string , i:number)
  {

    console.log(id , i);
    this.comments.splice(i,1);
    this.elapsedCommentTime.splice(i,1);
    this.dateSacle.splice(i,1);
    this.noOfLikeComment.splice(i,1);
    this.commentlike.splice(i,1);
    this.noOfRepliesComment.splice(i,1);
    this.noOfComments--;
    this.post.deleteComment(id).subscribe({
      next:res=>{
        console.log(res);
      },
      error:err=>{
        console.log(err);
      }
    })
  }

  showEditComment( inputEdit:HTMLElement , userComment:HTMLElement)
  {
    // console.log(commentId , postId , inputEdit , userComment);
    if(!this.visitorMode)
      {
    this.render.removeClass(inputEdit , 'h-0');
    this.render.addClass(inputEdit , 'h-auto');
    this.render.addClass(userComment , 'h-0');
    this.render.removeClass(userComment , 'h-auto');
    inputEdit .querySelectorAll('input')[0].focus();
  }else{
    this.translate.get('please  log in').subscribe(data=>{
      this.message.add({severity:'warn', detail:data})
    })
  }
  }

  editComment(commentId:string , postId:string , editDescription:any , i:number )
  {
    this.post.EditComment(commentId,postId ,editDescription.value).subscribe({
      next:res=>{
        editDescription.value = ''
        console.log(res);
        this.comments[i].description = res?.data.description;
        this.comments[i].date_added = res?.data.date_added;
        this.comments[i].app_version = res?.data.app_version;
        
        this.elapsedCommentTime[i] = this.common.lang_code == 'ar' ? 'الان' : 'now';
        this.dateSacle[i] = ''; 

      },
      error:err=>{
        console.log(err);
        
      }
    })
  }

  showReplyComment(userEle:HTMLElement , inputEdit:HTMLElement )
  {
    if(!this.visitorMode)
      {
    this.render.removeClass(userEle , 'h-0');
    this.render.addClass(userEle , 'h-auto');
    this.render.addClass(inputEdit , 'h-0');
    this.render.removeClass(inputEdit , 'h-auto');
    userEle.querySelectorAll('input')[0].focus();
  }else{
    this.translate.get('please  log in').subscribe(data=>{
      this.message.add({severity:'warn', detail:data})
    })
  }
  }


  //?--UI function
  popUpImage(e:any)
  {
    this.render.setAttribute(this.popUpImageSrc.nativeElement ,'src' , e.src);
    this.render.removeClass(this.popUpImageContainer.nativeElement ,'w-0');
    this.render.addClass(this.popUpImageContainer.nativeElement ,'w-100');
    this.render.removeClass(this.closeBtn.nativeElement ,'d-none');
    this.render.addClass(this.closeBtn.nativeElement ,'d-block');   
  }

  popDown(e:any){
    this.render.removeClass(this.popUpImageContainer.nativeElement ,'w-100')
    this.render.addClass(this.popUpImageContainer.nativeElement ,'w-0')
    this.render.removeClass(this.closeBtn.nativeElement ,'d-block')
    this.render.addClass(this.closeBtn.nativeElement ,'d-none')
  }



  //?--post ElpasedTime
  getElpasedAndScaleTime(elapsedArr:any , scaleArr:any , date:any){
    let diference = (new Date().getTime()  - new Date(date).getTime())/1000/60/60 ;  
    // console.log(diference);
      
    if (diference < 0 ) {
      elapsedArr.push(this.common.lang_code == 'ar' ? 'الان' : 'now')
      scaleArr.push('') 
    }
    if (diference < 1 && diference > 0 ) {
      elapsedArr.push(Math.floor(diference * 60))
      scaleArr.push(this.common.lang_code == 'ar' ? 'د' : 'min') 
    }
    else if(diference > 1 && diference < 24){
      elapsedArr.push(Math.floor(diference))
      scaleArr.push(this.common.lang_code == 'ar' ? 'س' : 'h') 
    }
    else if(diference > 24 && diference < 8760 ){
      elapsedArr.push(Math.floor(diference/24))
      scaleArr.push(this.common.lang_code == 'ar' ? 'يوم' : 'd') 
    }
    else if(diference > 8760)
    {
      elapsedArr.push(Math.floor(diference/24/365.25))
      scaleArr.push(this.common.lang_code == 'ar' ? 'سنة' : 'y') 
    }
  }



  onScroll(): void {
    this.spinner.show();
    this.loading = true;
    this.post.getMoreComment(this.postDetails?.id , this.start).subscribe({
      next:res=>{
        console.log(res);
        if(res.success){
          this.spinner.hide();
          this.loading = false;
          let newComments = res?.data;
          newComments.forEach((ele:any) => {
            this.comments.push(ele) ;
            this.commentlike.push(ele?.likeComment)            
            this.noOfLikeComment.push(ele?.statistics.like);
            this.noOfRepliesComment.push(ele?.statistics.commentCount);
            this.getElpasedAndScaleTime(this.elapsedCommentTime ,this.dateSacle ,ele.date_added);            
            this.replies.push(ele.replays);
          });
          this.replies.forEach((ele:any) =>{
            ele.forEach((reply:any) => {
              this.replylike.push(reply?.likeComment);            
              this.noOfreplyComment.push(reply?.statistics.like);
              this.getElpasedAndScaleTime(this.elapsedReplyTime ,this.dateSacleReply ,reply.date_added);
            });
          })
        }else{
          this.spinner.hide();
          this.loading = false;
        }
      }
    })
    this.start = this.start + 10
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
      if (data == 'added') {
        this.getPostDetails(this.postId)
        this.message.add({severity:'success' , detail:'post is added'})
      }else if(data == 'not compelete'){
        this.message.add({severity:'error' , detail:'something went wrong'})
      }
      else if(data == 'updated')
      {
        this.getPostDetails(this.postId)
        this.message.add({severity:'success' , detail:'post updated successfully'})
      }
    });
  }

  toggleLayer(){
    this.common.layerOn = !this.common.layerOn
  }

  visible1: boolean = false;
  visible2: boolean = false;

  showDialog1() {
      this.visible1 = true;
  }
  showDialog2() {
      this.visible2 = true;
  }
  

  addToCart(id:string , pageId:string , quantity:string = '1'){
    if(!this.visitorMode)
      {
    if (this.postDetails?.is_in_cart == '0') {
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
      this.translate.get('you already added it to your cart').subscribe(data=>{
        this.message.add({severity:'error' , detail:data})
      })
    }
  }else{
    this.translate.get('please  log in').subscribe(data=>{
      this.message.add({severity:'warn', detail:data})
    })
  }
  }
}
