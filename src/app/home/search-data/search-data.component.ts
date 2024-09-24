import { Component, Input } from '@angular/core';
import { PostService } from '../../shared/services/post.service';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-search-data',
  templateUrl: './search-data.component.html',
  styleUrl: './search-data.component.scss'
})
export class SearchDataComponent {
  @Input('posts') posts:any;
  postImageBaseurl: string = '';

  constructor(
    private post:PostService,
    public common:CommonService,
  )
  {

  }
  ngOnInit(): void {
    this.postImageBaseurl = this.post.PostImageUrl

  }
}
