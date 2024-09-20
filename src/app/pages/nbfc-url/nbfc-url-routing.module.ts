import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NbfcUrlTestComponent } from './nbfc-url-test/nbfc-url-test.component';
import { authGuard } from 'app/shared/auth/auth.guard';

const routes: Routes = [
  {
    path:"",
    component:NbfcUrlTestComponent,
    canActivate:[authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NbfcUrlRoutingModule { }
