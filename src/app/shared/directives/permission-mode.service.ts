import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionModeService {

  private permissionsSubject = new BehaviorSubject<string[]>([]);
  permissions$ = this.permissionsSubject.asObservable();
  permission : any[] = [];

  constructor() { }

  setPermission(permissions: any[]){
    this.permission = permissions;
    console.log("set permissions", this.permission)
    this.permissionsSubject.next(this.permission || []);
  }

  getPermissionList(){
    console.log("get permissions", this.permission)
    return this.permission;
  }

  hasPermission(permission: string): boolean {
    return this.permissionsSubject.getValue().includes(permission);
  }

  

}
