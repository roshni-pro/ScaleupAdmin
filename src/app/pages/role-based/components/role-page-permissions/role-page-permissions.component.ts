import { Component } from '@angular/core';
import { RolePagePermissionsService } from '../../services/role-page-permissions.service';
import { ToasterMessageService } from 'app/shared/services/toaster-message.service';
@Component({
  selector: 'app-role-page-permissions',
  templateUrl: './role-page-permissions.component.html',
  styleUrls: ['./role-page-permissions.component.scss']
})
export class RolePagePermissionsComponent {
  rolelist:any;
  selectedIndex:number=0;
  roleId:number=0;
  roleName:string='';
  keyword:string='';
  rolePermission:any;
  updateRolePageDCList:any=[];
  Loader:boolean=false;
constructor(
  private _roleService:RolePagePermissionsService,private toasterService:ToasterMessageService
){
  this.getRoleList();
 

}
getRolePagePermissions(roleId:number,roleName:string,keyword?:string){
  this.roleId = roleId;
  this.roleName = roleName;
  this.Loader=true;
  this._roleService.GetRolePagePermissions(roleId,this.keyword).subscribe((res:any)=>{
    this.Loader=false;
    this.rolePermission = res;
    console.log(res);
   
  })
}
changeColor(i:number){
  this.selectedIndex = i;
}
parentEachCheckboxChange(event:any,PageMasterId:number,str:string){}
childEachCheckboxChange(event:any,PageMasterId:number,PageName:string,str:string){}
parentallCheckboxChange(event:any,PageMasterId:number,str:string){}
allChildllCheckboxChange(event:any,PageMasterId:number,PageName:string,str:string){}
updateRolePagePermissions(){
  this.rolePermission.forEach((element: any) => {
    let obj={
      RoleId:element.roleId,
      PageMasterId:element.pageMasterId, 
      PageName :element.pageName,
      IsView :element.isView,
      IsAdd :element.isAdd,
      IsEdit:element.isEdit,
      IsDelete:false,
      IsAll :false
    };
    this.updateRolePageDCList.push(obj);
  })
  
  this.Loader=true;
  this._roleService.AddUpdateRolePagePermissions(this.updateRolePageDCList).subscribe((res:any)=>{
    this.Loader=false;  
    console.log(res);

      // alert(res.message);
      this.toasterService.showSuccess(res.message)

      // if(res.status)
      this.getRolePagePermissions(this.roleId,this.roleName,'')
      
  })
}
getRoleList(){
  this.Loader=true;
  this._roleService.getRoleList().subscribe((res:any)=>{
    console.log(res);
    this.Loader=false;
    this.rolelist=res.returnObject;
    this.getRolePagePermissions(res.returnObject[0].id,res.returnObject[0].name, '');
  })
}
}
