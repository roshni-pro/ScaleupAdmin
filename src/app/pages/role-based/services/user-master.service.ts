import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserMasterService {
  apiurl: string;
  constructor(private httpClient: HttpClient) { 
    this.apiurl = environment.apiBaseUrl
  }

  UserStatus(userId:string,isActive:boolean):Observable<any>{
    return this.httpClient.get(this.apiurl + environment.companygateway +'UserActiveInactive?UserId='+userId+'&IsActive='+isActive);
  }
  CheckCompanyAdminExist(obj:any):Observable<any>{
    return this.httpClient.post(this.apiurl + environment.aggregator +'CompanyAgg/CheckCompanyAdminExist',obj);
  }

  GetUserMasterList(UserMasterDC:any):Observable<any>{
    return this.httpClient.post(this.apiurl + environment.aggregator +'CompanyAgg/GetUserList',UserMasterDC);
  }




  UpdateUser(obj:any):Observable<any>{
    // return this.httpClient.post(environment.apiBaseUrl+environment.Identitygateway + 'UserRole/UpdateUser',obj); 
    // https://localhost:7000/aggregator/CompanyAgg/UpdateUserByUserId
    return this.httpClient.post(environment.apiBaseUrl+environment.aggregator + 'CompanyAgg/UpdateUserByUserId',obj); 

  }

  getCompanyDropdown():Observable<any>{
    return this.httpClient.get(this.apiurl + environment.companygateway +'GetCompanyList');
  }
  CreateUser(obj:any):Observable<any>{
   return this.httpClient.post(this.apiurl + environment.aggregator + 'CompanyAgg/CreateUserAsync',obj); 

  }



  GetUserById(userId:any):Observable<any>{
    return this.httpClient.get(environment.apiBaseUrl+environment.Identitygateway  + 'UserRole/GetUserById?UserId='+userId);

  }
  CreateRoleByName(roleName:any){
    return this.httpClient.get(environment.apiBaseUrl+environment.Identitygateway  + 'UserRole/CreateRoleByName?RoleName='+roleName);

  }

  UpdateRole(roleId:any,roleName:any){
    return this.httpClient.get(environment.apiBaseUrl+environment.Identitygateway  + 'UserRole/UpdateRole?RoleId='+roleId+'&NewRoleName='+roleName);

  }
  DeleteRole(roleId:any){
    return this.httpClient.get(environment.apiBaseUrl+environment.Identitygateway  + 'UserRole/DeleteRole?RoleId='+roleId);

  }
  getRoleList(keyword:any){
    return this.httpClient.get(environment.apiBaseUrl+environment.Identitygateway + 'UserRole/GetRoleList?Keyword='+keyword //changed
    
    )
  }

  sendMailForUserPassword(userId:any):Observable<any>{
    return this.httpClient.post(this.apiurl+ environment.aggregator + 'CompanyAgg/ResetUserPassword?UserId='+userId,null);
  }

}



