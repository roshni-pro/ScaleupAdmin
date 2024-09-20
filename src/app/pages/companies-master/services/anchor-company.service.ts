import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class AnchorCompanyService {
  private apiurl: string = '';
  private productapiurl:string=''

  constructor(private httpClient: HttpClient) {
    this.apiurl = environment.apiBaseUrl;
    this.productapiurl=environment.apiBaseUrl + environment.prodgateway;
  }
  saveCompanyAndLocationAsync(obj: any): Observable<any> {
    return this.httpClient.post<any>(
      this.apiurl +
        environment.aggregator +
        'CompanyAgg/SaveCompanyAndLocationAsync',
      obj
    );
  }

  updateCompanyAndLocationAsync(obj: any): Observable<any> {
    return this.httpClient.post<any>(
      this.apiurl +
        environment.aggregator +
        'CompanyAgg/UpdateCompanyAsync  ',
      obj
    );
  }
  getGstInfoNew(GSTNO: string): Observable<any> {
    return this.httpClient.get<any>(
      this.apiurl + environment.companygateway + 'GetGSTDetail?GSTNO=' + GSTNO
    );
  }
  generateApiKey(): Observable<any>{
    return this.httpClient.get<any>(this.apiurl + environment.Identitygateway +'CreateClient');
  }
  // generateSecretKey(): Observable<any>{
  //   return this.httpClient.get<any>(this.apiurl + environment.companygateway +'GenerateSecretKey');
  // }

  getBusinessTypeMasterList(CompanyType:any): Observable<any>{
    return this.httpClient.get<any>(this.apiurl + environment.companygateway +'GetBusinessTypeMasterList?CompanyType='+CompanyType)
  }

  postSingleFile(formData:any): Observable<any>{
    return this.httpClient.post<any>(environment.apiBaseUrl + environment.Mediagateway + 'PostSingleFile',formData)
  }
  getCompanyById(Id:number): Observable<any>{
    return this.httpClient.get<any>(this.apiurl + environment.aggregator +'CompanyAgg/GetCompanyAddressAndDetails?companyId='+Id)
  }


  getAddressListByIds(addressIdList:any): Observable<any>{
    return this.httpClient.post<any>(this.apiurl + environment.locationgateway +'Address/GetAddressListByIds',addressIdList);
  }
  getCompanyLocationById(companyId:any): Observable<any>{
    return this.httpClient.get<any>(this.apiurl + environment.companygateway +'CompanyLocation/GetCompanyLocationById?companyId='+companyId);
  }
  checkCompanyGSTExist(GSTNO:string): Observable<any>{
    return this.httpClient.get<any>(this.apiurl + environment.companygateway +'CheckCompanyGSTExist?GSTNO='+ GSTNO);
  }
  getAddressTypelist(): Observable<any>{
    return this.httpClient.get<any>(this.apiurl + environment.locationgateway + 'Address/GetAddressType');
   }
// ========================================================product-api=================================================================
   GetProductMasterList(companyId:number,companyType:any): Observable<any> {
    //debugger;
    return this.httpClient.get<any>(this.productapiurl + 'GetProductMasterListById?companyId='+companyId+'&companyType='+companyType);
  }


  GetAnchorProductList(CompanyId: number) : Observable<any>{
    return this.httpClient.get<any>(
      this.productapiurl +
        'GetAnchorProductList?CompanyId=' +
        CompanyId 
    );
  }
  AnchorProductActiveInactive(AnchorProductId: number,IsActive:boolean) : Observable<any>{
    return this.httpClient.get<any>(
      this.productapiurl +
        'AnchorProductActiveInactive?AnchorProductId=' +
        AnchorProductId +'&IsActive='+IsActive
    );
  }
}
