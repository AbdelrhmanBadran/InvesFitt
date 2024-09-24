import { Component, ElementRef, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ServicesService } from '../../shared/services/services.service';
import { CommonService } from '../../shared/services/common.service';
import { isPlatformBrowser } from '@angular/common';
import { PostService } from '../../shared/services/post.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PostDialogComponent } from '../post-dialog/post-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { OrderService } from '../../shared/services/order.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-single-facility',
  templateUrl: './single-facility.component.html',
  styleUrl: './single-facility.component.scss',
  providers: [DialogService]
})
export class SingleFacilityComponent {
  token: string = '';
  serviceImageBaseurl: string = '';
  facilityImageBaseurl: string = '';
  facilityDetails: any;
  isLove: any;
  noOfLovers:any
  posts: any[] = [];
  postImageBaseurl: string = '';
  isFollow: any;
  noOfFollowers: any;
  postslike:boolean[] = [];
  noOfLikesPost: number[] = [];
  ratingValue:any= '';
  visible: boolean = false;
  pageId: string ='';
  allRates:string = ''
  ownFacility: boolean = false;
  userMode: boolean = true;
  ref: DynamicDialogRef | undefined;
  visitorMode: boolean = true;
  subUpdate!: Subscription;
  dataDone:boolean = false;
  isParentInitialized:boolean = false;

  constructor(
    public common:CommonService,
    private service:ServicesService,
    private activate:ActivatedRoute,
    private router:Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService,
    private post: PostService,
    private render: Renderer2,
    private el: ElementRef,
    private dialogService: DialogService,
    private spinner:NgxSpinnerService,
    private message:MessageService,
    private order:OrderService

  ){
    // this.translate.use(this.common.lang_code);

    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('token')!;
      this.userMode = localStorage.getItem('profile-mode') == 'user' ? true : false
      this.visitorMode = localStorage.getItem('isVisitor') == 'true' ? true :false;
      this.translate.use(localStorage.getItem('front-lang') == null ? 'ar' : localStorage.getItem('front-lang')!)

    }

  }
  
  ngOnInit(): void {
    this.serviceImageBaseurl = this.common.serviceImageUrl
    this.facilityImageBaseurl = this.service.facilityImageUrl
    this.postImageBaseurl = this.post.PostImageUrl

    this.activate.paramMap.subscribe((data:any) =>{
      this.pageId = data.get('pageId');
      let pageId = data.get('pageId');
      
      this.getFacilityDetails(pageId);
      this.subUpdate = this.common.updatedPost.subscribe(res=>{
        if(res){
          this.getFacilityDetails(pageId);
        }
      })
    })

  }

  getFacilityDetails(pageId:any){
    this.spinner.show()
    this.service.GetOneFacility(pageId).subscribe({
      next:res =>{
        console.log();
        if (isPlatformBrowser(this.platformId)) {
          if(pageId !== localStorage.getItem('pageId') && !this.userMode && this.token)
          {
            this.router.navigate(['/facility/details/' , localStorage.getItem('pageId')!])
          }
        }
        if (res?.success) {    
          this.dataDone = true;        
          this.facilityDetails = res?.data;
          if (isPlatformBrowser(this.platformId)) {
            this.ownFacility = pageId == localStorage.getItem('pageId') ? true : false
          }
          console.log(this.facilityDetails);
          this.isLove = res?.data.likePage
          this.isFollow = res?.data.followHim
          this.noOfLovers = res?.data.statistics.like;
          this.noOfFollowers = res?.data.statistics.followHimNum;
          this.ratingValue = res?.data.rate_info.my_rate
          
          this.allRates = res?.data.rate_info.rate
          this.posts = res?.data.posts
          this.posts.forEach((ele:any) => {
            this.postslike.push(ele.likePost)
            this.noOfLikesPost.push(ele.statistics.like)
          });
        }else{
          this.router.navigate(['/home'])
        }
        this.spinner.hide()

      },error:err =>{
        console.log(err);
        this.spinner.hide()
      }
    })
  }





  handleImage(e:any){
    e.target.src = 'assets/images/placeholder2.jpg'
  }

  likePage(id:string){
    if(!this.visitorMode)
    {
      if(this.isLove == true){
        this.noOfLovers--;
      }else{
        this.noOfLovers++;
      }
      this.isLove = !this.isLove
      this.post.likePageOrPost(id , 'page').subscribe({
        next:res=>{
          console.log(res);
        }
      })
    }else{
      this.translate.get('please  log in').subscribe(data=>{
        this.message.add({severity:'warn', detail:data})
      })
    }
  }

  followFacility(id:string){
    if(!this.visitorMode)
    {
      if(this.isFollow == true){
        this.noOfFollowers--;
      }else{
        this.noOfFollowers++;
      }
      this.isFollow = !this.isFollow;
      this.service.followFacility(id).subscribe({
        next:res =>{
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

  
  

  showDialog() {
    if(!this.visitorMode)
    {    
      this.visible = true;
    }else{
      this.translate.get('please  log in').subscribe(data=>{
        this.message.add({severity:'warn', detail:data})
      })
    }
  }

  rateFacility(){
    if(!this.visitorMode)
    {
      console.log(this.ratingValue);
      this.visible = false;
      this.service.rateFacility(this.pageId , this.ratingValue).subscribe({
        next:(res:any)=>{
          console.log(res);
          if (res?.success) {
            this.allRates = res?.data.rate
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
  styleCloseIcon(op:any){
    setTimeout(() => {
    let closeEle = op.container.querySelector('.p-overlaypanel-close')
    this.common.lang_code == 'ar' ? this.render.addClass(closeEle , 'isRight') : this.render.addClass(closeEle , 'isLeft')
    }, 50);
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
        this.getFacilityDetails(this.pageId)
        this.message.add({severity:'success' , detail:'post is added'})
      }else if(data == 'not compelete'){
        this.message.add({severity:'error' , detail:'something went wrong'})
      }
      else if(data == 'updated')
      {
        this.getFacilityDetails(this.pageId)
        this.message.add({severity:'success' , detail:'post updated successfully'})
      }
    });
  }

  toggleLayer(){
    this.common.layerOn = !this.common.layerOn
  }



  goToMaps(){
    const url = `https://www.google.com/maps?q=${this.facilityDetails?.lat},${this.facilityDetails?.lon}`;

    setTimeout(() => {
      window.open(url, '_blank');
    }, 100);
  }

  ngOnDestroy(): void {
    this.subUpdate.unsubscribe()
  }
}

