import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolePagePermissionsService {
  apiurl: string;
  constructor(private httpClient: HttpClient) { 
    this.apiurl = environment.apiBaseUrl;
  }

  GetPageMasterList(){
    //return this.httpClient.get(this.apiurl + environment.Identitygateway +'GetPageMasterList');
    return this.httpClient.get(environment.apiBaseUrl+environment.Identitygateway  +'UserRole/GetPageMasterList');
  }

  GetRolePagePermissions(RoleId:number,keyword:string){
   // return this.httpClient.get(this.apiurl + environment.Identitygateway + 'GetRolePagePermissions?RoleId='+RoleId+'&keyword='+keyword);
    return this.httpClient.get(environment.apiBaseUrl+environment.Identitygateway + 'UserRole/GetRolePagePermissions?RoleId='+RoleId+'&keyword='+keyword); //changed
  }

  AddUpdateRolePagePermissions(obj:any){
//    return this.httpClient.post(this.apiurl + environment.Identitygateway + 'AddUpdateRolePagePermissions',obj);
    return this.httpClient.post(environment.apiBaseUrl+environment.Identitygateway  + 'UserRole/AddUpdateRolePagePermissions',obj);

  }

  getRoleList(){
    // debugger
    return this.httpClient.get(environment.apiBaseUrl+environment.Identitygateway + 'UserRole/GetRoleList' //changed
    // return this.httpClient.get('https://localhost:7008/UserRole/GetRoleList'
    
    )
  }
}
