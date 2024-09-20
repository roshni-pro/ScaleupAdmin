import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderService } from 'app/shared/services/loader.service';
import { LocalStogareService } from 'app/shared/services/local-storage.service';

import { LoginService } from '../services/login.service';
// import { UserMasterService } from 'app/pages/role-based/services/user-master.service';
import { jwtDecode } from 'jwt-decode';
import { MessageService } from 'primeng/api';
import { PermissionModeService } from '../../../shared/directives/permission-mode.service';
import { AuthService } from '../../../shared/auth/auth.service';

@Component({
  selector: 'app-credential-login',
  templateUrl: './credential-login.component.html',
  styleUrls: ['./credential-login.component.scss'],
})
export class CredentialLoginComponent implements OnInit {

  username!: string;
  password!: string;
  isFormSubmitted: boolean = false;
  email: any;
  Loader: boolean = false;
  decoded: any

  constructor(
    private loginService: LoginService,
    private localStorageService: LocalStogareService,
    private router: Router,
    // private loaderService: LoaderService,
    private messageService: MessageService,
    private permissionService: PermissionModeService,
    private authSer: AuthService
  ) {
    // debugger
    let isToken = localStorage.getItem("clUserToken")
    if (isToken) {
      this.router.navigateByUrl("/pages/admin/welcome");
    } else {
      localStorage.clear();
    }
  }

  ngOnInit() {
    // if (
    //   this.localStorageService.getItemString(this.localStorageService.tokenKey)
    // ) {
    //   this.router.navigateByUrl('/pages/customer/application');
    // }
  }
  
  togglePasswordVisibility(): void {
    const passwordField = document.querySelector('input[name="mobInpit"]');
    if (passwordField) {
      if (passwordField.getAttribute('type') === 'password') {
        passwordField.setAttribute('type', 'text');
      } else {
        passwordField.setAttribute('type', 'password');
      }
    }
  }

  onSubmit(mobileForm: NgForm) {
    // debugger;
    if (mobileForm.value.mobInpit && mobileForm.value.mobInpits) {
      console.log('mobileForm', mobileForm);

      this.Loader = true;
      this.loginService
        .userAuthentication(this.username, this.password)
        .subscribe(
          (x: any) => {
            console.log(x);
            this.Loader = false;
            this.localStorageService.set(this.localStorageService.tokenKey, x);
            // debugger;
            // alert(x.message);
            // this.messageService.add({ severity: 'error', summary: x.message });
            this.localStorageService.set('tokenData', JSON.stringify(x));
            // let  user= localStorage.getItem("tokenData");
            const token = JSON.stringify(x);
            this.decoded = jwtDecode(token);
            console.log(jwtDecode(token), 'token');
            const expirationTime = new Date().getTime() + 8 * 60 * 60 * 1000; // 8 hours in milliseconds
            // const expirationTime = new Date().getTime() + 5 * 60 * 1000; // 5 mins in milliseconds
            // this.setLogoutTime(expirationTime);
            this.localStorageService.set('clUserToken', x);
            localStorage.setItem('token_expiration', expirationTime.toString());
            this.localStorageService.set('username', this.decoded.username);
            this.localStorageService.set('usertype', this.decoded.usertype);
            this.localStorageService.set('email', this.decoded.email);
            this.localStorageService.set('password', this.password);
            this.localStorageService.set("companyId", this.decoded.companyid);
            this.localStorageService.set("roles", this.decoded.roles);
            this.localStorageService.set('userId', this.decoded.userId);
            this.authSer.initializeLogoutTimer();
            // let permissions = ["view", 'add', 'edit']
            // this.localStorageService.set('permission', permissions.toString());
            // this.permissionService.setPermission(permissions)
            // this.localStorageService.set("userName", x.username);
            // this.localStorageService.set("expires_in", x.expires_in);
            // this.localStorageService.set("token_type", x.token_type);
            // if (x.role == "SuperAdmin") {
            // this.router.navigateByUrl('pages/admin/company-master');

            //   // this.router.navigateByUrl("/pages/admin/country");
            // } else
            this.router.navigateByUrl("/pages/admin/welcome");
          },
          (error: any) => {
            // debugger
            console.log(error);
            this.Loader = false;
            if (error && error.status == 400) {
              // alert(error.error);
              this.messageService.add({ severity: 'error', summary: error.error });

            } else {
              // alert("Server Busy - Unable to Login, Please Try Again Later");
              this.messageService.add({ severity: 'error', summary: "Server Busy - Unable to Login, Please Try Again Later" });

            }
            // window.location.reload();
            // this.messageService.add({ severity: 'error', summary: error.error });
          }
        );
    } else {
      // alert('please enter username and password');
      this.messageService.add({ severity: 'error', summary: "please enter username and password" });

      // this.messageService.add({ severity: 'error', summary: 'please enter username and password' });
    }
  }

  // setLogoutTime(durationInMinutes: number) {
  //   const logoutTime = new Date();
  //   logoutTime.setMinutes(logoutTime.getMinutes() + durationInMinutes);
  //   localStorage.setItem('logoutTime', logoutTime.toString());
  // }



  navigate() {
    this.router.navigateByUrl('/login/reset-password');
  }


  display: boolean = false;
  ondailogclick() {
    this.display = true;
    this.email = '';
  }

  resetPassword() {
    if (this.email) {
      this.Loader = true;
      this.loginService.resetUserPassword(this.email).subscribe((x: any) => {
        console.log(x);
        // alert(x.message);
        this.messageService.add({ severity: 'info', summary: x.message });

        this.Loader = false;
        this.display = false;
      });
    }
    else {
      // alert('Enter Email!')
      this.messageService.add({ severity: 'error', summary: 'Enter Email' });
    }
  }


}
