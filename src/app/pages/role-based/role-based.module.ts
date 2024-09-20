import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleBasedRoutingModule } from './role-based-routing.module';
import { RolePagePermissionsComponent } from './components/role-page-permissions/role-page-permissions.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserMasterComponent } from './components/user-master/user-master.component';
import { SharedModule } from 'app/shared/shared.module';
import { AddUserComponent } from './components/add-user/add-user.component';
import {DropdownModule} from 'primeng/dropdown';
import {MultiSelectModule} from 'primeng/multiselect';
import { UserManagementComponent } from './components/user-management/user-management.component';

@NgModule({
  declarations: [
    RolePagePermissionsComponent,
    ProfileComponent,
    UserMasterComponent,
    AddUserComponent,
    UserManagementComponent
  ],
  imports: [
    CommonModule,
    RoleBasedRoutingModule,
    SharedModule,DropdownModule,MultiSelectModule
  ]
})
export class RoleBasedModule { }
