import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

   apiurl: string;
  constructor(private httpClient: HttpClient) {
    // this.apiurl = environment.apiBaseUrl;
    this.apiurl='https://localhost:7008/';
  }

  GetUsersRolesPages(userName:string): Observable<any> {
    // debugger
    //return this.httpClient.get<any>(this.apiurl + 'GetPageMasterList');
    return this.httpClient.get<any>(environment.apiBaseUrl+environment.Identitygateway +'UserRole/GetPageMasterList?userName='+userName);
  }


}
