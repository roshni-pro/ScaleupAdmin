import { Component } from '@angular/core';
import { UserMasterService } from '../../services/user-master.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent {
  userroleList: any;
  display: boolean = false;
  addRole: any;
  keyword: any;
  Loader:boolean=false;
  ngOnInit(): void {
    this.getRoleList();
  }

  constructor(private userMasterservice: UserMasterService) {}

  getRoleList() {
    this.Loader=true
    this.userMasterservice
      .getRoleList(this.keyword != undefined ? this.keyword : '')
      .subscribe((x: any) => {
        this.Loader=false
        if (x.status) {

          this.userroleList = x.returnObject;
        }
        console.log(x);
      });
  }

  createRolebyRoleName(roleName: any) {
    this.userMasterservice.CreateRoleByName(roleName).subscribe((x: any) => {
      console.log(x);
      if (x.status) {
        this.display=false;
        this.getRoleList();
      }
      
      alert(x.message);
    });
  }
  openDialog() {
    this.addRole="";
    this.display = true;
  }
  editdisplay:boolean=false;
  roleId:any;
  editDialog(ir:any){

    this.editdisplay=true
    this.addRole=ir.name
    this.roleId=ir.id


  }
  updateRole(){
    this.Loader=true;
    this.userMasterservice.UpdateRole(this.roleId,this.addRole).subscribe((x:any)=>{
      this.Loader=false;
      if (x.status) {
        this.editdisplay=false;
        this.getRoleList();
      }
      alert(x.message);
      console.log(x);      
    })
  }
  deleteRole(ir:any){
    if (confirm("Do u want to Delete this Role?")) {
      this.userMasterservice.DeleteRole(ir.id).subscribe((x:any)=>{
        if (x.status) {
          this.getRoleList();
        }
        alert(x.message);
        
      })
      return true;
    } else {
      return false;
    }  }
}
