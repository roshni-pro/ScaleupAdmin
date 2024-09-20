import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStogareService } from 'app/shared/services/local-storage.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiURL: string;

  constructor(private httpClient: HttpClient) {
    this.apiURL = environment.apiBaseUrl
  }

  ScaleupDashboardDetails(obj: any): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + 'aggregator/LeadAgg/ScaleupDashboardDetails', obj);
  }

  GetDisbursementDashboardData(obj: any): Observable<any> {
    // https://gateway-qa.scaleupfin.com/aggregator/LoanAccountAgg/GetDisbursementDashboardData
    return this.httpClient.post<any>(this.apiURL + 'aggregator/LoanAccountAgg/GetDisbursementDashboardData', obj);
  }

  getDashboardCompanyList(obj: any): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + 'services/company/v1/GetCompanyListByCompanyType?CompanyType=Anchor');
  }

  GetLeadCityList(): Observable<any> {
    // let obj={}
    return this.httpClient.get<any>(this.apiURL + 'aggregator/LeadAgg/GetLeadCityList');
  }

  GetProductMasterList(): Observable<any> {
    //debugger;
    return this.httpClient.get<any>(this.apiURL + 'services/product/v1/GetProductList');
  }
  
  LeadExport(obj: any): Observable<any> {
    //debugger;
    return this.httpClient.post<any>(this.apiURL + 'aggregator/LeadAgg/LeadExport', obj);
  }
  //https://localhost:7000/aggregator/LeadAgg/LeadExport
}
