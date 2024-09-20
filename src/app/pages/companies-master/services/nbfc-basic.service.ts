import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStogareService } from 'app/shared/services/local-storage.service'; 
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NbfcBasicService {
  private apiURL: string;
  constructor(private httpClient: HttpClient, private localStorageService: LocalStogareService) { 
    this.apiURL=environment.apiBaseUrl 
  }
  
GetCompanyAndLocationAsync(Id:number): Observable<any>{
    return this.httpClient.get<any>(this.apiURL + environment.aggregator + 'CompanyAgg/GetCompanyAddressAndDetails?companyId='+Id);
  }
SaveCompanyAndLocationAsync(obj:any): Observable<any>{
    return this.httpClient.post<any>(this.apiURL + environment.aggregator + 'CompanyAgg/SaveCompanyAndLocationAsync', obj);
}

UpdateCompanyAsync(obj:any): Observable<any>{
  return this.httpClient.post<any>(this.apiURL + environment.aggregator + 'CompanyAgg/UpdateCompanyAsync', obj);
}

PostSingleFile(formData:any): Observable<any>{
  return this.httpClient.post<any>(this.apiURL + environment.Mediagateway + 'PostSingleFile',formData)
}
GetBusinessTypeMasterList(CompanyType:any): Observable<any>{
  return this.httpClient.get<any>(this.apiURL + environment.companygateway +'GetBusinessTypeMasterList?CompanyType='+CompanyType)
}

GetGstInfoNew(GSTNO:string): Observable<any>{
  return this.httpClient.get<any>(this.apiURL + environment.companygateway +'GetGSTDetail?GSTNO='+GSTNO);
}

//for product
GetNBFCProductList(CompanyId: number): Observable<any> {
  return this.httpClient.get<any>(
    this.apiURL + environment.prodgateway+
      'GetNBFCProductList?CompanyId=' +
      CompanyId 
  );
}
}
