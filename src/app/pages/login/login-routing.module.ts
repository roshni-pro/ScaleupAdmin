import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CredentialLoginComponent } from './credential-login/credential-login.component'; 

const routes: Routes = [
  {path: '', component: CredentialLoginComponent},
 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
