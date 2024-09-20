import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStogareService } from '../services/local-storage.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string | undefined;

  constructor(private localStorageService: LocalStogareService, private router: Router) {
  }

  initializeLogoutTimer() {
    // debugger
    // if (!localStorage.getItem('intervalSet')) {
    setInterval(() => {
      this.checkLogoutTime();
    }, 5000);
    // localStorage.setItem('intervalSet', 'true');
    // }
  }

  checkLogoutTime() {
    const expirationTime = localStorage.getItem('token_expiration');
    const loginTime = new Date().getTime()
    // console.log(loginTime, expirationTime);
    localStorage.setItem("loginTime", loginTime.toString())
    if (expirationTime) {
      if (loginTime >= parseInt(expirationTime)) {
        alert("Session Expired - Please Login to Continue");
        this.logout();
      }
    } else {
      // alert("Session Expired - Please Login to Continue");
      this.logout();
    }
  }



  signupUser(email: string, password: string) {
    //your code for signing up the new user
  }

  signinUser(email: string, password: string) {
    //your code for checking credentials and getting tokens for for signing in user
  }

  // auth.service.ts
  isTokenExpired(): boolean {
    const expiration = localStorage.getItem('token_expiration');
    if (!expiration) {
      return true;
    }
    return new Date().getTime() > parseInt(expiration, 10);
  }

  getToken(): string | null {
    if (this.isTokenExpired()) {
      this.logout(); // Handle logout or token renewal
      return null;
    }
    return localStorage.getItem('clUserToken');
  }




  logout() {
    localStorage.clear();
    localStorage.removeItem('clUserToken');
    this.router.navigateByUrl('/login');
  }

  // getToken() {
  //   return this.token;
  // }

  isAuthenticated() {
    const token = this.localStorageService.getItemString('clUserToken');
    // debugger
    // here you can check if user is authenticated or not through his token 
    if (this.getToken()) {
      return true;
    }
    else {
      return false;
    }
  }

  isAuthenticatedRout(route: any) {
    const aithRoutList: any[] = JSON.parse(this.localStorageService.getItemString('PagePermission'));
    // here you can check if user is authenticated or not through his token 
    let url = route._routerState.url
    console.log("aithRoutList", aithRoutList, route._routerState.url);

    // debugger
    if (url != "/pages/admin/welcome") {
      if (aithRoutList && aithRoutList.length > 0) {
        // let routVar: any =  aithRoutList.filter(x => x.routeName == url)[0];

        let routVar: number = 0;
        aithRoutList.forEach((element: any) => {
          if (url.includes(element.routeName)) {
            routVar = 1
          }
        });

        if (routVar > 0) {
          return true;
        } else {
          return false;
        }
      }
      else {
        return true;
      }
    } else {
      return true;
    }

  }





}