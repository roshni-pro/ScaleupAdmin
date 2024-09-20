import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DsaMasterComponent } from './components/dsa-master/dsa-master.component';
import { DsaDetailComponent } from './components/dsa-detail/dsa-detail.component';
const routes: Routes = [
  {path:'dsa-master',component:DsaMasterComponent},
  {path:'dsa-master/dsa-detail',component:DsaDetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DsaRoutingModule { }
