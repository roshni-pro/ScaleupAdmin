import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  
  private apiURL: string;
  constructor(private httpClient: HttpClient) { 
    this.apiURL=environment.apiBaseUrl 
  }

  LoanAccSaveModifyTemplateMaster(TemMasterDc:any): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + 'services/LoanAccount/v1/SaveModifyTemplateMaster' , TemMasterDc);
  }

  SaveModifyTemplateMaster(TemMasterDc:any): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + 'services/lead/v1/SaveModifyTemplateMaster' , TemMasterDc);
  }

  productSaveModifyTemplateMaster(TemMasterDc:any): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + 'services/product/v1/SaveModifyTemplateMaster' , TemMasterDc);
  }

  companySaveModifyTemplateMaster(TemMasterDc:any): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + 'services/company/v1/SaveModifyTemplateMaster' , TemMasterDc);
  }

  GetTemplateMasterAsync(): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + 'aggregator/CompanyAgg/GetTemplateMasterAsync');
  }

  GetTemplateById(id:number,type:string): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + 'aggregator/CompanyAgg/GetTemplateById?Id='+id+'&type='+type);
  }
}
