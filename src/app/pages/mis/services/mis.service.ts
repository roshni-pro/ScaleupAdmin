import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MisService {
  apiurl: any;

  constructor(private httpClient: HttpClient) {
    this.apiurl = environment.apiBaseUrl ;
   }

  AnchorCityProductList(): Observable<any> {
    // services/loanaccount/v1/AnchorCityProductList
    return this.httpClient.get<any>(this.apiurl+ environment.loanaccountgateway + '/AnchorCityProductList');
  }
  getDashboardCompanyList(obj:any): Observable<any> {
    return this.httpClient.get<any>(this.apiurl + 'services/company/v1/GetCompanyListByCompanyType?CompanyType=Anchor');
  }
  getnbfcDropdown():Observable<any>{
    return this.httpClient.get(this.apiurl + environment.companygateway +'GetCompanyList');
  }

  GetAnchorMISList(obj:any):Observable<any>{
    return this.httpClient.post(this.apiurl+environment.aggregator  +'LoanAccountAgg/GetAnchorMISList',obj);
  }

  GetNbfcMISList(obj:any):Observable<any>{
    return this.httpClient.post(this.apiurl+environment.aggregator  +'LoanAccountAgg/GetNbfcMISList',obj);
  }

  GetDsaMISList(obj:any):Observable<any>{
    return this.httpClient.post(this.apiurl+environment.aggregator  +'LoanAccountAgg/GetDSAMISList',obj);
  }
  GetInvoiceRegisterData(obj:any):Observable<any>{
    return this.httpClient.post(this.apiurl + environment.aggregator  +'LoanAccountAgg/GetInvoiceRegisterData',obj);
  }
  GetAllCompanyList(): Observable<any> {
    return this.httpClient.get<any>(this.apiurl+environment.aggregator + 'CompanyAgg/GetCompanyListForDropDown');
  }
  GetProductMasterList(): Observable<any> {
    //debugger;
    return this.httpClient.get<any>(environment.apiBaseUrl +environment.prodgateway+ 'GetProductList');
  }

}
