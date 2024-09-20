import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) {

  }
  userAuthentication(userName:string, password:string): Observable<any> {
    return this.httpClient.get(environment.apiBaseUrl+environment.Identitygateway  + 'GenerateToken?username='+userName+'&password='+password , {responseType: 'text'});
    // return this.httpClient.get('https://localhost:7008/GenerateToken?username=mayur&password=Mayur@123'   , {responseType: 'text'});

  }


  resetPassword(userid:any,OldPassword:string,NewPassword:string): Observable<any> {
    // debugger
    return this.httpClient.post<any>(environment.apiBaseUrl+environment.Identitygateway + 'UserRole/ChangeUserPassword?UserId='+userid+'&OldPassword='+OldPassword+'&NewPassword='+NewPassword,null)
  };

  resetUserPassword(email:any):Observable<any>{
    return this.httpClient.get(environment.apiBaseUrl+ environment.aggregator + 'CompanyAgg/ForgotUserPassword?userName='+email);
  }
}
