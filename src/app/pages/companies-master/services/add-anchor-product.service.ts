import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddAnchorProductService {
  private apiurl: string = '';
  constructor(private httpClient: HttpClient) {
    this.apiurl = environment.apiBaseUrl + environment.prodgateway;
  }
  GetProductMasterList(companyId: number, companyType: any): Observable<any> {
    //debugger;
    return this.httpClient.get<any>(
      this.apiurl +
        'GetProductMasterListById?companyId=' +
        companyId +
        '&companyType=' +
        companyType
    );
  }

  GetProductCompanyBycompanyId(CompanyId: number): Observable<any> {
    return this.httpClient.get<any>(
      this.apiurl + 'GetProductCompanyBycompanyId?CompanyId=' + CompanyId
    );
  }

  CompanyProductActiveInactive(
    CompanyId: number,
    ProductId: number,
    IsActive: boolean
  ): Observable<any> {
    return this.httpClient.get<any>(
      this.apiurl +
        'CompanyProductActiveInactive?CompanyId=' +
        CompanyId +
        '&ProductId=' +
        ProductId +
        '&IsActive=' +
        IsActive
    );
  }
  PostSingleFile(formData:any): Observable<any>{
    return this.httpClient.post<any>(environment.apiBaseUrl + environment.Mediagateway + 'PostSingleFile',formData)
  }

  AddProductCompany(obj: any): Observable<any> {
    return this.httpClient.post<any>(this.apiurl + 'AddProductCompany', obj);
  }

  GetProductCompanyConfig(
    CompanyId: number,
    ProductId: number
  ): Observable<any> {
    return this.httpClient.get<any>(
      this.apiurl +
        'GetProductCompanyConfig?CompanyId=' +
        CompanyId +
        '&ProductId=' +
        ProductId
    );
  }
  UpdateProductCompany(obj: any): Observable<any> {
    return this.httpClient.post<any>(this.apiurl + 'UpdateProductCompany', obj);
  }

  GetProductActivityMasterList(
    ProductId: any,
    IsDefault: any
  ): Observable<any> {
    return this.httpClient.get<any>(
      this.apiurl +
        'GetProductActivityMasterList?ProductId=' +
        ProductId +
        '&IsDefault=' +
        IsDefault
    );
  }

  CheckCompanyIsDefault(CompanyId: any): Observable<any> {
    return this.httpClient.get<any>(
      environment.apiBaseUrl +
        environment.companygateway +
        'CheckCompanyIsDefault?CompanyId=' +
        CompanyId
    );
  }

  AddUpdateProductActivityMaster(obj: any): Observable<any> {
    return this.httpClient.post<any>(
      this.apiurl + 'AddUpdateProductActivityMaster',
      obj
    );
  }

  ProductActivityMasterList(
    CompanyId: number,
    ProductId: number
  ): Observable<any> {
    return this.httpClient.get<any>(
      this.apiurl +
        'ProductActivityMasterList?CompanyId=' +
        CompanyId +
        '&ProductId=' +
        ProductId
    );
  }

  // For ANCHOR PRODUCT
  AddUpdateAnchorProductConfig(obj: any): Observable<any> {
    return this.httpClient.post<any>(
      this.apiurl + 'AddUpdateAnchorProductConfig',
      obj
    );
  }

  GetAnchorProductConfig(
    CompanyId: number,
    ProductId: number
  ): Observable<any> {
    return this.httpClient.get<any>(
      this.apiurl +
        'GetAnchorProductConfig?CompanyId=' +
        CompanyId +
        '&ProductId=' +
        ProductId
    );
  }
  GetAnchorProductList(CompanyId: number): Observable<any> {
    return this.httpClient.get<any>(
      this.apiurl + 'GetAnchorProductList?CompanyId=' + CompanyId
    );
  }
  AnchorProductActiveInactive(
    AnchorProductId: number,
    IsActive: boolean
  ): Observable<any> {
    return this.httpClient.get<any>(
      this.apiurl +
        'AnchorProductActiveInactive?AnchorProductId=' +
        AnchorProductId +
        '&IsActive=' +
        IsActive
    );
  }

  GetEMIOptionMasterList(): Observable<any> {
    return this.httpClient.get<any>(this.apiurl + 'GetEMIOptionMasterList');
  }

  GetCreditDayMastersList(): Observable<any> {
    return this.httpClient.get<any>(this.apiurl + 'GetCreditDayMastersList');
  }

  //getGstRate
  getGstRate(): Observable<any> {
    return this.httpClient.get<any>(
      environment.apiBaseUrl + environment.companygateway + 'GetLatestGSTRate'
    );
  }
}
