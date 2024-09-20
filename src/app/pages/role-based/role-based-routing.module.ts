import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolePagePermissionsComponent } from './components/role-page-permissions/role-page-permissions.component';
import { UserMasterComponent } from './components/user-master/user-master.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { authGuard } from 'app/shared/auth/auth.guard';
const routes: Routes = [

  { path: 'user-master', component:UserMasterComponent, canActivate: [authGuard]},
  { path: 'user-master/add-user/:Id', component:AddUserComponent, canActivate: [authGuard]},
  { path: 'user-master/:Id', component:UserMasterComponent, canActivate: [authGuard]},

  { path: 'user-role-management', component:UserManagementComponent , canActivate: [authGuard]},
  { path: 'page-permissions', component:RolePagePermissionsComponent, canActivate: [authGuard]},
  

  { path: 'user-profile', component:ProfileComponent, canDeactivate: [authGuard]},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleBasedRoutingModule { }
