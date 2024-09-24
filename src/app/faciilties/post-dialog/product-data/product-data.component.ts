import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { PostService } from '../../../shared/services/post.service';
import { DynamicDialogConfig, DynamicDialogRef   } from 'primeng/dynamicdialog';
import { UserService } from '../../../shared/services/user.service';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-product-data',
  templateUrl: './product-data.component.html',
  styleUrl: './product-data.component.scss'
})
export class ProductDataComponent {
  producImg: any;
  imgOn:boolean = false;
  productForm:FormGroup = new FormGroup('');
  allErrors:boolean = false;
  FormInage: any = '';
  messageMode:string = 'added'
  @Input('postDetails') postDetails!:any
  baseurl: string = '';
  constructor(
    private message:MessageService,
    private translate:TranslateService,
    private form:FormBuilder,
    private post:PostService,
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig,
    private user: UserService,
    public common: CommonService,

  )
  {

  }
  ngOnInit(): void {
    this.createFrom();
    console.log(this.postDetails);
    this.messageMode = this.postDetails ? 'updated' : 'added'
    if(this.postDetails?.attachment){
      this.imgOn = true;
      this.producImg = this.post.PostImageUrl + this.postDetails?.attachment
    }
  }
  
  createFrom():void
  {
    this.productForm = this.form.group({
      "product_name": [this.postDetails?.product_name , [Validators.required] ],
      "description":[this.postDetails?.description.replace(/<br>/g, '\n') , [Validators.required ]],
      "attachment":['' , [Validators.required]],
      "avilability": ['Available' , Validators.required],
      "price":[this.postDetails?.price , Validators.required],
      "type": "post",
      "post_id":[this.postDetails?.id ],
      "last_attachment": ['']
    })
  }

  uploadImage(e:any){
    if(e.target.files){
      const file = e.target.files[0];
      this.FormInage =  e.target.files[0]
      if (file.type.includes('image')) {
        this.imgOn = true
        let reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.addEventListener('load' , (event:any)=>{
          this.producImg = event.target.result;
        })
      }else{
        e.target.value = '';
        this.translate.get('only images accepted').subscribe((translations) => {
          this.message.add({severity:'error' , detail:translations})
        })
      }
    }
  }

  addProduct(data:FormGroup)
  {
    console.log(this.FormInage);
    let formData = new FormData()
    if(this.FormInage){
      formData.append('file' , this.FormInage , this.FormInage.name);
      data.get('attachment')?.setValue(this.FormInage.name);
      data.get('last_attachment')?.setValue(this.postDetails?.attachment);
    }
    else{
      data.get('attachment')?.setValue(this.postDetails?.attachment);
      data.get('last_attachment')?.setValue('');
    }
    this.user.uploadImage(formData , 'posts').subscribe({
      next:res=>{
        console.log(res);
          if(res?.newname){
            data.value['attachment'] = res.newname
          }else{
            data.value['attachment'] = this.postDetails?.attachment
          }
          console.log(data.value);
          if(data.valid)
            {
              this.post.addEditPost(data.value).subscribe({
                next:res=>{
                  console.log(res);
                  this.dialogRef.close(this.messageMode)
                },
                error:err=>{
                  console.log(err);
                  this.dialogRef.close('not compelete')
                }
              })
            }else{
              console.log('ccc');
              this.translate.get('All Inputs are required').subscribe((translations) => {
                this.message.add({severity:'error' , detail:translations})
              })
              this.allErrors = true;
            }
        },
      error:err=>{
        console.log(err);
        this.dialogRef.close('not compelete')
      } 
    })
    
  }

  closeDialog(){
    this.dialogRef.close('')
  }
}
