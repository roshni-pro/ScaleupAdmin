import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { LocalStogareService } from '../services/local-storage.service';

@Injectable()

export class authGuard {

  constructor(private authService: AuthService, public router: Router, public localStogareService: LocalStogareService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //console.log('state.url', state.url);

    // debugger
    if (!this.authService.isAuthenticated()) {
      this.localStogareService.set('login', state.url);
      this.router.navigateByUrl('login');
      return false;
    } else {
      // debugger
      return this.checkAuth(route);
    }
    return true;
  }

  canActivateChild(route: any) {
    const aithRoutList: any[] = JSON.parse(this.localStogareService.getItemString('PagePermission'));
    console.log(route._routerState.url, aithRoutList);
    return this.checkAuth(route);
    return true;
  }

  canDeactivate(component: any): boolean {
    // if (component.hasUnsavedChanges()) {
    //   return window.confirm('You have unsaved changes. Do you really want to leave?');
    // }
    return true;
  }

  canLoad(route: ActivatedRouteSnapshot): boolean {
    return this.checkAuth(route);
  }



  private checkAuth(route: any) {
    console.log("check rout");
    // return true;
    if (this.authService.isAuthenticatedRout(route)) {
      return true;
    } else {
      // Redirect to the login page if the user is not authenticated
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }

}
