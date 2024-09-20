import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { CredentialLoginComponent } from './credential-login/credential-login.component';
import { ResetPasswordComponent } from '../admin/components/reset-password/reset-password.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [
    CredentialLoginComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class LoginModule { }
