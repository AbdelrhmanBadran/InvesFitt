import { Component, ElementRef, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { BreadcrumbLink, PaymentData } from '../../interfaces/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbAlert, NgbDropdownModule, NgbModal, NgbRatingModule , NgbModalRef  } from '@ng-bootstrap/ng-bootstrap';
import { FaqComponent } from '../home/faq/faq.component';
import { PhotoGalleryComponent } from '../../shared/photo-gallery/photo-gallery.component';
import { FormsModule } from '@angular/forms';
import { GymService } from '../../services/gym.service';
import { environment } from '../../services/config';
import { LocalstorageService } from '../../services/localstorage.service';
import { User } from '../../interfaces/user';
import {  getCurrentUser, getCurrentUserId } from '../../services/utils';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SubscriptionsService } from '../../services/subscription.service';
import { CommonApiService } from '../../services/common-api.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { ToastService } from '../../services/toast.service';
import { ToastsContainer } from '../../shared/toasts/toasts.component';
import { RedirectComponent } from "../redirect/redirect.component";

@Component({
  selector: 'app-gym-details',
  standalone: true,
  imports: [BreadcrumbComponent, CommonModule, NgbRatingModule, FaqComponent, PhotoGalleryComponent, NgbAlert, FormsModule, TranslateModule, NgbDropdownModule, ToastsContainer, RedirectComponent],
  templateUrl: './gym-details.component.html',
  styleUrls: ['./gym-details.component.css']
})
export class GymDetailsComponent implements OnInit {
  @ViewChild('successTpl') successTpl:TemplateRef<any>;
  @ViewChild('dangerTpl') dangerTpl:TemplateRef<any>;
  @ViewChild('warningTpl') warningTpl:TemplateRef<any>;
  public environment = environment
  BreadcrumbLinks: BreadcrumbLink[] = [
    { label: 'Home', route: '/home' },
    { label: 'Find Gym', route: '/find-gym' , queryParams:this.localStorage.getItem('searchValue')},
    { label: 'The Gym Ways', route: '' }
  ];
  gymdDtails:any
  images: any[] = [];
  allImages: any[] = []
  imageIndex: any;
  comments = [];
  commentsInView: {
    img?: string;
    author?: string;
    rating?: number;
    comment?: string;
    Accessibility?: number;
    price?: number;
    Facilities_available?: number;
    Range_of_facilities?: number;
    Customer_service?: number;
    user_id?: number;
    id?: number;
  }[] = [];
  loadMoreClicked: number = 0;
  newComment: {
    img?: string;
    author?: string;
    rating?: number;
    comment?: string;
    Accessibility?: number;
    price?: number;
    Facilities_available?: number;
    Range_of_facilities?: number;
    Customer_service?: number;
    user_id?: number;
    id?: number;
  } = {}
  SubscribtionData : {
    total?: number,
    points?: number,
    pointsValue?: number,
    remaining?: number,
    title?:string,
    plan_id?:number,
    duration?:number,
  } = { }

  willReplacePoints: boolean = false;
  gymInfo: any;
  plans: any;
  ratings: any;
  options: any;
  accesibiltyRating: number = 0;
  Facilities_available: number = 0;
  Range_of_facilities: number = 0;
  ratingPrice: number = 0;
  Customer_service: number = 0;
  userRate: number;
  userData: User;
  addCommentError: boolean = false;
  subscribed_status: string = '';
  sub:Subscription ;
  IsSubscribed: string = '';
  type: string;
  EditiedCommentIndex: number;
	toastService = inject(ToastService);
  enrollData: PaymentData;
  redirectOn:boolean = false;
  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private gymService: GymService,
    private subscriptionsService: SubscriptionsService,
    private localStorage: LocalstorageService,
    private common: CommonApiService,
    private translate: TranslateService,
    private lang: TranslateService,
    private router: Router
  ) { }

  ngOnInit() {    
    this.userData = JSON.parse(this.localStorage.getItem('currentUser'));
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.sub =  this.common.langUpdated.subscribe((res) => {
          this.comments = [];
          this.images = [];
          this.accesibiltyRating = 0 
          this.Facilities_available = 0
          this.Range_of_facilities = 0
          this.ratingPrice = 0
          this.Customer_service = 0
          this.getGymInfo(id);
      })
    });
  }

  getGymInfo(id:number)
  {
    this.gymService.getGymDetails(id).subscribe({
      next: (res) => {
        if (res?.status == 200) {
          this.gymInfo = res?.['gyms info'][0]
          res?.['images'].forEach((element:any) => {
            this.images.push(element.file)
          })
          this.allImages = [this.gymInfo?.logo,...this.images]
          this.IsSubscribed = res?.['subscribed_status'];
          this.plans = res?.['plans']; 
          this.options = res?.['options'];
          this.ratings = res?.['ratings'];
          this.options = res?.['options'];
          this.subscribed_status = res?.['subscribed_status'];
          this.ratings?.forEach((element:any) => {            
            this.accesibiltyRating = this.accesibiltyRating + parseInt(element?.Accessibility);
            this.Facilities_available = this.Facilities_available + parseInt(element?.Facilities_available);
            this.Range_of_facilities = this.Range_of_facilities + parseInt(element?.Range_of_facilities);
            this.ratingPrice = this.ratingPrice + parseInt(element?.price);
            this.Customer_service = this.Customer_service + parseInt(element?.Customer_service);
          })
          console.log(this.ratingPrice);
          
          res?.['ratings'].forEach(element => {
            this.comments.push({
              img: element?.img ? environment.imgUrl + 'users/'+ element?.img : 'assets/images/user.jpg',
              author: element?.first_name + ' ' + element?.last_name,
              comment: element?.comment,
              rating: element?.user_rate,
              user_id: element?.user_id,
              id: element?.id,
              Accessibility: element?.Accessibility,
              price: element?.price,
              Customer_service: element?.Customer_service,
              Facilities_available: element?.Facilities_available,
              Range_of_facilities: element?.Range_of_facilities,
            })
            
          });
          this.LoadMore();
        }
      },
      error: (err) => {
        console.log(err);
      }
    })  
  }

  handleUserImageError(e)
  {
    e.target.src ='assets/images/user.jpg'
  }

  openImageGallery(content: TemplateRef<any>, index) {
    this.imageIndex = index;
    this.modalService.open(content, { fullscreen: true, windowClass: 'photo-gallery' });
  }

  LoadMore() {
    const nextIndex = this.loadMoreClicked * 5;
    this.commentsInView = this.comments.slice(0, nextIndex + 5);
    this.loadMoreClicked++;
  }

  OpenRatingModal(content: TemplateRef<any> , data:any , type:string , index:number = 0) {
    console.log(data);
    
    this.type = type
    this.EditiedCommentIndex = index
    this.newComment = data
    this.modalService.open(content ,  { centered: true, size: 'lg' });
  }

  AddComment() { 
    if (this.newComment.comment && this.newComment.rating) {
      this.newComment['img'] = this.userData?.img ? environment.imgUrl + 'users/'+ this.userData?.img : 'assets/images/user.jpg';
      this.newComment['author'] = this.userData?.first_name + ' ' + this.userData?.last_name;
      this.newComment['user_id'] = this.userData?.id;
      console.log(this.newComment);
      let formData = new FormData()
      if (this.type == 'Add') {
        this.commentsInView.push(this.newComment);
        this.comments.push(this.newComment);
        this.showSuccess(this.successTpl)    
      }else{
        this.commentsInView[this.EditiedCommentIndex] = this.newComment;
        this.comments[this.EditiedCommentIndex] = this.newComment;
        this.newComment['id'] = this.commentsInView[this.EditiedCommentIndex]?.id;
        formData.append('rateId' , this.newComment?.id.toString()) 
        this.showWarning(this.warningTpl)
      }
      Object.keys(this.newComment).forEach(key => {
        if (key !== 'img' && key !== 'author') {
          formData.append(key, this.newComment[key]);
        }
      })
      formData.append('gym_id' , this.gymInfo.id)
      this.gymService.addRating(formData).subscribe({
        next: (res) => {
          console.log(res);
          if (res.status == 200) {
            this.newComment['id'] = res?.message
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
      this.addCommentError = false;
      this.modalService.dismissAll()
    }else{
      this.addCommentError = true;
    }
  }

  DeleteComment(item , i:number)
  {
    console.log(item);
    let data ={
      id:this.commentsInView[i].id,
      user_id: item.user_id
    }
    let formData = new FormData()
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    })
    Swal.fire({
      title: this.translate.instant("gym.Are you sure?"),
      text: this.translate.instant("gym.You won't be able to revert this!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D27A01",
      cancelButtonColor: "#d33",
      confirmButtonText: this.translate.instant("gym.Yes, delete it!"),
      cancelButtonText: this.translate.instant("gym.cancel")
    }).then((result) => {
      if (result.isConfirmed) {
        this.commentsInView.splice(i, 1);
        this.comments.splice(i, 1);
        this.gymService.deleteRating(formData).subscribe({
          next: (res) => {
            console.log(res);
            this.showDanger(this.dangerTpl)
          },
          error: (err) => {
            console.log(err);
          }
        })

      }
    });
  }

  openSupscripeModal(content: TemplateRef<any> , planIndex:any) {
    this.SubscribtionData = {
      total: this.plans[planIndex].price,
      plan_id: this.plans[planIndex].id,
      points: this.userData?.points,
      pointsValue: this.userData?.calculation,
      remaining: this.plans[planIndex].price,
      title: this.plans[planIndex].title,
      duration: this.plans[planIndex].duration,
    }

    if (this.SubscribtionData?.total < this.SubscribtionData?.pointsValue) {
      this.SubscribtionData.pointsValue = this.SubscribtionData.total;
      this.SubscribtionData.points = this.SubscribtionData.pointsValue * (this.userData?.points / this.userData?.calculation);
    }
    
    this.modalService.open(content , {centered:true , size:'lg'});
  }
  
  addsubscription() {
    if (getCurrentUser() == null) {
      Swal.fire({
        icon: "error",
        text: this.translate.instant('please login first'),
      });
      this.modalService.dismissAll()
      return;
    }
    let data = {
      user_id: getCurrentUserId(),
      ammount: this.SubscribtionData.remaining == 0 ? Math.round(this.SubscribtionData.pointsValue *100) /100 :Math.round( this.SubscribtionData.remaining * 100)/100,
      subscription:
      [
        {
          user_id: getCurrentUserId(),
          gym_id: this.gymInfo.id , 
          plan_id: this.SubscribtionData.plan_id , 
          ammount: this.SubscribtionData.remaining == 0 ? Math.round(this.SubscribtionData.pointsValue *100)/100: Math.round(this.SubscribtionData.remaining*100)/100,
          points: this.willReplacePoints ? Math.round(this.SubscribtionData.points *100)/100 : 0,
          points_ammount: this.willReplacePoints ? Math.round(this.SubscribtionData.pointsValue *100)/100 : 0
        }
      ]
    }
    console.log(data)

    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, JSON.stringify(data[key]));
    })
    this.subscriptionsService.EnrollSubscription(formData).subscribe({
      next: (res) => {
        console.log(res);
        if(res?.data){
          this.enrollData = res?.data
          this.redirectOn = true;
          setTimeout(() => {
            this.redirectOn = false;
          }, 1000);
        }
        else if(res?.message == 'Subscription process completed successfully.')
        {
          Swal.fire({
            icon: "success",
            text: this.translate.instant('Process is added successfully'),
          });
        }
        else{
          this.redirectOn = false;
          Swal.fire({
            icon: "error",
            text: this.translate.instant('some thing went wrong , please try again later'),
          });
        }
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          text: this.translate.instant('some thing went wrong , please try again later'),
        });
      }
    })
    this.modalService.dismissAll()
  }

  RepalcePoints() {
    this.willReplacePoints = true;
    if (this.SubscribtionData?.total < this.SubscribtionData?.pointsValue) {
      this.SubscribtionData.remaining = 0; 
    }else{
      this.SubscribtionData.remaining = this.SubscribtionData.total - this.SubscribtionData.pointsValue;
    }
  }

  DontRepalcePoints() {
    this.willReplacePoints = false;
    this.SubscribtionData.remaining = this.SubscribtionData.total;
  }

  handleGymImageError(event: any) {
    event.target.src = '../../../assets/images/gyms/gym-8.png';
  }
  
  RateChanged() {
    this.newComment.rating = (this.newComment.Accessibility + this.newComment.price + this.newComment.Facilities_available + this.newComment.Range_of_facilities + this.newComment.Customer_service) / 5
  }

  closeAlert(){
    this.addCommentError = !this.addCommentError
  }

  goTomaps(lat:any , lon :any)
  {
    let url = "https://www.google.com/maps/search/?api=1&query=" + lat + "," + lon;
    window.open(url, '_blank');
  }

	showSuccess(template: TemplateRef<any>) {
		this.toastService.show({ template, classname: 'bg-success text-light', delay: 3000 });
	}

  showDanger(template: TemplateRef<any>) {
		this.toastService.show({ template, classname: 'bg-danger text-light', delay: 3500 });
	}

  showWarning(template: TemplateRef<any>) {
		this.toastService.show({ template, classname: 'bg-warning bg-opacity-75 text-light', delay: 3500 });
	}

  ngOnDestroy(): void {
    this.sub.unsubscribe()
    this.toastService.clear();
  }

}

