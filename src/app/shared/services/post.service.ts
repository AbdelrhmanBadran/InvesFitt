import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postUrl: string = environment.baseUrl + "posts.php?action=";

  public serviceImageUrl:string = 'https://api.dalilelsouq.com/uploads/services/';
  public facilityImageUrl:string = 'https://api.dalilelsouq.com/uploads/facility/';
  public PostImageUrl:string = 'https://api.dalilelsouq.com/uploads/posts/';
  public commentImageUrl:string = 'https://api.dalilelsouq.com/uploads/users/';
  lang_code: string = '';
  token: string = '';

  constructor(    
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,

  )
  {
    if (isPlatformBrowser(this.platformId)) {
      this.lang_code = localStorage.getItem('front-lang') ==  null ? 'ar' : localStorage.getItem('front-lang')!
      this.token = localStorage.getItem('token')!
    }
  }

  likePageOrPost(id:string , type:string):Observable<any>
  {
    let data={
      node_id:id,
      is_on:type
    }
    let body = JSON.stringify(data);
    return this.http.post(this.postUrl + 'likeOrDisLike' , body )
  }

  getPostDetails(id:string):Observable<any>
  {
    let data={
      post_id:id
    }
    let body = JSON.stringify(data);
    return this.http.post(this.postUrl + 'getPostDetails' , body )
  }
  
  
  addCommentOrReply(PostId:string , description:string , ownerId:string , parent_id:any = '',img:any =''  ):Observable<any>
  {
    let data=
    {
      "description" : description,
      "post_id" : PostId,
      "parent_id" : parent_id,
      "type": "text",
      "owner_node_id": ownerId,
      "img": ""
    }
    let body = JSON.stringify(data);
    return this.http.post(this.postUrl + 'addComment' , body )
  }
  
  deleteComment(id:string):Observable<any>
  {
    let data=
    {
      "id":id
    }
    let body = JSON.stringify(data);
    return this.http.post(this.postUrl + 'deleteComment' , body )
  }
  
  EditComment(commentId:string , postId:string , description:string , parentId:any = '' , img:any = ''):Observable<any>
  {
    let data=
    {
      "comment_id": commentId,
      "post_id": postId,
      "description": description,
      "parent_id": parentId,
      "img": img
    }
    let body = JSON.stringify(data);
    return this.http.post(this.postUrl + 'editComment' , body )
  }

  getMoreComment(postId:string , start:number , limit:number = 10):Observable<any>
  {
    let data=
    {
      "post_id": postId,
      "start": start,
      "limit": limit
    }
    let body = JSON.stringify(data);
    return this.http.post(this.postUrl + 'getcommentsByPostId' , body )
  }
  
  addEditPost(data:any):Observable<any>
  {
    let body = JSON.stringify(data);
    return this.http.post(this.postUrl + 'addEditPost' , body )
  }


  getNearbyPosts(product_name:string , start:number = 0 , limit:number = 10):Observable<any>
  {
    let data ={
      "start": 0,
      "limit": 10,
      "product_name": product_name
    }
    let body = JSON.stringify(data);
    return this.http.post(this.postUrl + 'getNearbyPosts' , body )
  }
}
