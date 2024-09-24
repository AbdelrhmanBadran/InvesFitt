import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef   } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-post-dialog',
  templateUrl: './post-dialog.component.html',
  styleUrl: './post-dialog.component.scss'
})
export class PostDialogComponent {


  mode:string = ''
  postDetails: any;
  constructor(
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    private translate:TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { 
    if (isPlatformBrowser(this.platformId)) {
      this.translate.use(localStorage.getItem('front-lang')!)
    }
  }

  ngOnInit(): void {
    this.mode = this.dialogConfig.data.type;
    this.postDetails = this.dialogConfig.data.post;    
  }



}
