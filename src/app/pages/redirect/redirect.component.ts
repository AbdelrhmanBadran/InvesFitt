import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SubscriptionsService } from '../../services/subscription.service';
import { PaymentData } from '../../interfaces/common';

@Component({
  selector: 'app-redirect',
  standalone: true,
  imports: [],
  templateUrl: './redirect.component.html',
  styleUrl: './redirect.component.scss'
})
export class RedirectComponent {
  @ViewChild('autoSubmitForm') form!: ElementRef;
  @Input('enrollData') enrollData:PaymentData;

  constructor(
    private subscriptionsService: SubscriptionsService,
    
  ) { }



  ngOnInit(): void {
    console.log('redirect rendered',this.enrollData);

  }

  ngAfterViewInit(): void {
    this.submitForm();
  }

  submitForm() {
    console.log('nofrom');
    if (this.form) {
      console.log('before submit');
      this.form.nativeElement.submit();
      console.log('after submit');
    } else {
      console.error('Form element not found!');
    }
  }
}
