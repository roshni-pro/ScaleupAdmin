import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NbfcTestService {
  
  private apiURL: string = '';
  private apiURLCompany: string = '';
  private apiURLProduct: string = '';
  
  constructor(private httpClient: HttpClient) {
    this.apiURLCompany = environment.apiBaseUrl + environment.companygateway
    this.apiURLProduct = environment.apiBaseUrl + environment.prodgateway
  }

  // dropdown list
  GetCompanyListByCompanyTypeNBFC(): Observable<any> {
    return this.httpClient.get<any>(this.apiURLCompany + 'GetCompanyListByCompanyType?CompanyType=NBFC');
  }

  GetCompanyListByCompanyTypeAnchor(): Observable<any> {
    return this.httpClient.get<any>(this.apiURLCompany + 'GetCompanyListByCompanyType?CompanyType=Anchor');
  }

  // list of else
  GetNBFCComapanyApiData(NBFCComapanyId: any): Observable<any> {
    return this.httpClient.get<any>(this.apiURLProduct + 'GetNBFCComapanyApiData?NBFCComapanyId='+NBFCComapanyId);
  }

  SaveNBFCCompanyApiData(payload: any): Observable<any> {
    return this.httpClient.post<any>(this.apiURLProduct + 'SaveNBFCCompanyApiData', payload);
  }

  UpdateNBFCCompanyApi(payload: any): Observable<any> {
    return this.httpClient.post<any>(this.apiURLProduct + 'UpdateNBFCCompanyApi', payload);
  }
  
}
