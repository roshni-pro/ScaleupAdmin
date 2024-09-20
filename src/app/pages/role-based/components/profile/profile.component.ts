import { Component, OnInit } from '@angular/core';
import { UserMasterService } from '../../services/user-master.service';
import { LocalStogareService } from 'app/shared/services/local-storage.service';
import { jwtDecode } from "jwt-decode";
import { Token } from '@angular/compiler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  Loader: boolean = false;
  userid: any;
  userDetail: UserDetail = {
    Name: '',
    Mobile: '',
    Email: '',
    UserName: '',
    Roles: [],
  };
  decoded:any;
  constructor(
    private userMasterService: UserMasterService,
  private router:Router
    ) {}

  ngOnInit() {
    debugger
// = this.localStorageService.getItemObject('userId');
this.userid = localStorage.getItem("tokenData");
const token = this.userid ;
 this.decoded = jwtDecode(token);
console.log(jwtDecode(token),'token');


    this.getuserDetail();
  }

  role:any=[];

  getuserDetail() {
    debugger
    this.userMasterService.GetUserById(this.decoded.userId).subscribe((x: any) => {
      this.userDetail = x;
      this.userDetail.Email=x.email,
      this.userDetail.Mobile=x.mobileNo,
      this.userDetail.UserName=x.name
       this.role=[]
      x.roles.forEach((element:any) => {
        debugger
        this.role.push(element)
        
      });
   
      this.userDetail.Roles=this.role
      
      
    });
  }
  changePassword(){
    this.router.navigateByUrl('pages/admin/reset-password')
  }
  changeRole(){
    this.router.navigateByUrl('pages/permission/user-role-management')
  }
}

interface UserDetail {
  Name: string;
  Mobile: string;
  Email: string;
  UserName: string;
  Roles: Array<string>;
}
