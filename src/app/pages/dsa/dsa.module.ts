import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DsaRoutingModule } from './dsa-routing.module';
import { DsaMasterComponent } from './components/dsa-master/dsa-master.component';
import { DsaDetailComponent } from './components/dsa-detail/dsa-detail.component';
import { ScaleUpSharedModule } from 'app/shared/scale-up-shared/scale-up-shared.module';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SharedModule } from 'app/shared/shared.module';
import { DsaUsersComponent } from './components/dsa-users/dsa-users.component';
import { DsaProfileComponent } from './components/dsa-profile/dsa-profile.component';


@NgModule({
  declarations: [
    DsaMasterComponent,
    DsaDetailComponent,
    DsaUsersComponent,
    DsaProfileComponent
  ],
  imports: [
    CommonModule,
    DsaRoutingModule,
    ScaleUpSharedModule,SelectButtonModule,CommonModule,SharedModule
  ]
})
export class DsaModule { }
