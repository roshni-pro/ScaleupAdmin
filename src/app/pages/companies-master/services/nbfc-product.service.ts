import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NbfcProductService {
  private apiurl: string = '';

  constructor(private httpClient: HttpClient) {
    this.apiurl = environment.apiBaseUrl + environment.prodgateway;

   }

   GetProductMasterList(companyId:number,companyType:any): Observable<any> {
    //debugger;
    return this.httpClient.get<any>(this.apiurl + 'GetProductMasterListById?companyId='+companyId+'&companyType='+companyType);
  }

  GetProductCompanyBycompanyId(CompanyId: number): Observable<any> {
    return this.httpClient.get<any>(
      this.apiurl + 'GetProductCompanyBycompanyId?CompanyId=' + CompanyId
    );
  }

 

  AddProductCompany(obj: any) : Observable<any>{
    return this.httpClient.post<any>(this.apiurl + 'AddProductCompany', obj);
  }

  GetProductCompanyConfig(CompanyId: number, ProductId: number): Observable<any> {
    return this.httpClient.get<any>(
      this.apiurl +
        'GetProductCompanyConfig?CompanyId=' +
        CompanyId +
        '&ProductId=' +
        ProductId
    );
  }


  GetProductActivityMasterList(ProductId:any, IsDefault:any): Observable<any> {
    return this.httpClient.get<any>(
      this.apiurl +
        'GetProductActivityMasterList?ProductId=' +ProductId+'&IsDefault='+
        IsDefault
    );
  }

  CheckCompanyIsDefault(CompanyId: any): Observable<any> {
    return this.httpClient.get<any>(
      environment.apiBaseUrl + environment.companygateway +
        'CheckCompanyIsDefault?CompanyId=' +
        CompanyId
    );
  }

  AddUpdateProductActivityMaster(obj: any) : Observable<any>{
    return this.httpClient.post<any>(
      this.apiurl + 'AddUpdateProductActivityMaster',
      obj
    );
  }

  ProductActivityMasterList(CompanyId: number, ProductId: number): Observable<any> {
    return this.httpClient.get<any>(
      this.apiurl +
        'ProductActivityMasterList?CompanyId=' +
        CompanyId +
        '&ProductId=' +
        ProductId
    );
  }
  NBFCProductActiveInactive(NBFCProductId: number,IsActive:boolean) : Observable<any>{
    return this.httpClient.get<any>(
      this.apiurl +
        'NBFCProductActiveInactive?NBFCProductId=' +
        NBFCProductId +'&IsActive='+IsActive
    );
  }
  
  SaveNBFCSubActivityApi(obj: any) : Observable<any>{
    return this.httpClient.post<any>(
      this.apiurl + 'SaveNBFCSubActivityApi',
      obj
    );
  }
  
  GetNBFCSubActivityApi(obj: any) : Observable<any>{
    return this.httpClient.post<any>(
      this.apiurl + 'GetNBFCSubActivityApi', obj
    );
  }



  PostSingleFile(formData:any): Observable<any>{
    return this.httpClient.post<any>(this.apiurl + environment.Mediagateway + 'PostSingleFile',formData)
  }

// For NBFC Product
AddUpdateNBFCProductConfig(obj: any): Observable<any> {
  return this.httpClient.post<any>(
    this.apiurl + 'AddUpdateNBFCProductConfig',
    obj
  );
}
GetNBFCProductConfig(CompanyId: number, ProductId: number): Observable<any> {
  return this.httpClient.get<any>(
    this.apiurl +
      'GetNBFCProductConfig?CompanyId=' +
      CompanyId +
      '&ProductId=' +
      ProductId
  );
}
// GetNBFCProductList(CompanyId: number): Observable<any> {
//   return this.httpClient.get<any>(
//     this.apiurl +
//       'GetNBFCProductList?CompanyId=' +
//       CompanyId 
//   );
// }
// NBFCProductActiveInactive(NBFCProductId: number,IsActive:boolean) : Observable<any>{
//   return this.httpClient.get<any>(
//     this.apiurl +
//       'NBFCProductActiveInactive?NBFCProductId=' +
//       NBFCProductId +'&IsActive='+IsActive
//   );
// }



GetCreditDayMastersList() : Observable<any>{
  return this.httpClient.get<any>(
    this.apiurl +
      'GetCreditDayMastersList' 
  );
}

//getGstRate
getGstRate(): Observable<any>{
  return this.httpClient.get<any>(
    environment.apiBaseUrl +environment.companygateway+
      'GetLatestGSTRate' 
  );
}

}
