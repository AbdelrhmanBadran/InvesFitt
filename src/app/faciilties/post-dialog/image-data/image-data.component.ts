import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserService } from '../../../shared/services/user.service';
import { CommonService } from '../../../shared/services/common.service';
import { PostService } from '../../../shared/services/post.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-image-data',
  templateUrl: './image-data.component.html',
  styleUrl: './image-data.component.scss'
})
export class ImagetDataComponent {
  producImg: any;
  imgOn:boolean = false;
  @Input('postDetails') postDetails!:any
  messageMode:string = 'added'
  ImageForm:FormGroup = new FormGroup('');
  allErrors:boolean = false;
  FormInage: any = '';

  constructor(
    private message:MessageService,
    private translate:TranslateService,
    private form:FormBuilder,
    private post:PostService,
    private dialogRef: DynamicDialogRef,
    private user: UserService,
    public common: CommonService,
  )
  {
  
  }
  ngOnInit() {
    console.log(this.postDetails);
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
    this.ImageForm = this.form.group({
      "description":[this.postDetails?.description.replace(/<br>/g, '\n') , [Validators.required ]],
      "attachment":['' , [Validators.required]],
      "last_attachment": [''],
      "type": "image",
      "post_id":[this.postDetails?.id ]
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

  addImage(data:FormGroup)
  {
    let formData = new FormData()
    console.log(this.FormInage);
    if(this.FormInage){
      formData.append('file' , this.FormInage , this.FormInage?.name);
      data.get('attachment')?.setValue(this.FormInage?.name);
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
