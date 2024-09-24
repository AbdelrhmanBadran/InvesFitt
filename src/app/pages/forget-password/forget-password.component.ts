import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { BreadcrumbLink } from '../../interfaces/common';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    CommonModule,
    BreadcrumbComponent,
    NgbAlert
  ],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
})
export class ForgetPasswordComponent implements OnInit {
  ForgetForm!: FormGroup;
  BreadcrumbLinks: BreadcrumbLink[] = [
    { label: 'Home', route: '/home' },
    { label: 'general.Forget Password', route: '' },
  ];
  notValidUser:boolean = false
  showLoader:boolean 
  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private lang: TranslateService,
  ) {
    this.InitForgetForm();
  }

  ngOnInit() {}

  InitForgetForm() {
    this.ForgetForm = this.formbuilder.group({
      email: ['' , [Validators.required , Validators.email]],
    });
  }
  closeAlert()
  {
    this.notValidUser = false
  }

  SubmitForgetPassword() {

    if (this.ForgetForm.valid) {
      this.notValidUser = false
      this.showLoader = true
      this.authService.forgetPasword(this.ForgetForm.value).subscribe(
        {
          next: (res) => {
            console.log(res);
            if(res.data !== 'No account found with that email address.')
            {
              Swal.fire(
                this.lang.instant('Success'),
                this.lang.instant('Password reset link has been sent to your email'),
                'success'
              )
            }else{
              Swal.fire(
                this.lang.instant('No account found with that email address.'),
                'error'
              )
            }
            this.showLoader = false
          },
          error: (err) => {
            console.log(err);
            Swal.fire(
              this.lang.instant('something went wrong'),
              'error'
            )
            this.showLoader = false
          },
        }
      )
    }else
    {
      this.notValidUser = true
    }
  }
}
