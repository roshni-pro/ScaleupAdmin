import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyMasterService {

  private apiurl:string='';
  private invoiceurl:string='';
  constructor(private httpClient: HttpClient) {
    this.apiurl=environment.apiBaseUrl ;
    this.invoiceurl = environment.apiBaseUrl + environment.loanaccountgateway;

   }

   getInvoiceList(obj:any): Observable<any> {
    //debugger;
    return this.httpClient.post<any>(this.invoiceurl + '/GetInvoiceList',obj);
  }

  postNBFCInvoice(invoiceId:any,loanAccountId:any): Observable<any> {
    //debugger;
    return this.httpClient.get<any>(this.invoiceurl + '/PostNBFCInvoice?invoiceId='+invoiceId+'&loanAccountId='+loanAccountId,);
  }
  getInvoiceRequestResponse(invoiceId:any,loanAccountId:any): Observable<any> {
    //debugger;
    return this.httpClient.get<any>(this.invoiceurl + '/GetInvoiceRequestResponse?invoiceId='+invoiceId+'&loanAccountId='+loanAccountId,);
  }

  // =========================================================================================================================

  getCompanyList(obj:any): Observable<any>{
    return this.httpClient.post<any>(this.apiurl + environment.aggregator + 'CompanyAgg/GetCompanyList',obj);
   }
   saveCompanyDetails(obj:any): Observable<any>{
        return this.httpClient.post<any>(this.apiurl + environment.aggregator + 'CompanyAgg/CreateCompanyAsync', obj);
   }

   saveCompanyAddress(obj:any): Observable<any>{
     return this.httpClient.post<any>(this.apiurl + environment.aggregator + 'CompanyAgg/CreateCompanyLocationAsync', obj);
    }


    activeInactiveAddress(companyId:number,locationId:number,IsActive:boolean): Observable<any>{
      return this.httpClient.get<any>(this.apiurl +  'CompanyLocation/ActiveInActiveCompanyLocation?companyId='+companyId+'&locationId='+locationId+'&IsActive'+IsActive)

    }
    GetCompanyLocationById(companyId:any): Observable<any>{
      return this.httpClient.get<any>(this.apiurl + environment.companygateway +'CompanyLocation/GetCompanyLocationById?companyId='+companyId);
    }
        
    getAddressTypelist(): Observable<any>{
      return this.httpClient.get<any>(this.apiurl + environment.locationgateway + 'Address/GetAddressType');
     }
    GetAddressListByIds(addressIdList:any): Observable<any>{
      return this.httpClient.post<any>(this.apiurl + environment.locationgateway +'Address/GetAddressListByIds',addressIdList);
    }

    GenerateApiKey(): Observable<any>{
      return this.httpClient.get<any>(this.apiurl + environment.companygateway +'GenerateApiKey');
    }
    GenerateSecretKey(): Observable<any>{
      return this.httpClient.get<any>(this.apiurl + environment.companygateway +'GenerateSecretKey');
    }

    GetGstInfo(input:string): Observable<any>{
      return this.httpClient.get<any>(this.apiurl + environment.kycgateway +'KYCDoc/GetGstInfo?input='+input);
    }

    GetGstInfoNew(GSTNO:string): Observable<any>{
      return this.httpClient.get<any>(this.apiurl + environment.companygateway +'GetGSTDetail?GSTNO='+GSTNO);
    }

    GetBusinessTypeMasterList(CompanyType:any): Observable<any>{
      return this.httpClient.get<any>(this.apiurl + environment.companygateway +'GetBusinessTypeMasterList?CompanyType='+CompanyType)
    }

    updateCompanyAddress(obj:any): Observable<any>{
      return this.httpClient.post<any>(this.apiurl + environment.locationgateway + 'Address/UpdateAddress',obj)
    }

    GetCompanyById(Id:number): Observable<any>{
      return this.httpClient.get<any>(this.apiurl + environment.companygateway +'GetCompanyById?companyId='+Id)
    }
    activeInActiveCompany(Id:number,isActive:boolean): Observable<any>{
      return this.httpClient.get<any>(this.apiurl + environment.companygateway +'ActiveInActiveCompany?companyId='+Id+'&IsActive='+isActive)
    }

    updatecompany(obj:any): Observable<any>{
      return this.httpClient.post<any>(this.apiurl + environment.companygateway + 'UpdateCompany',obj)
    }

    PostSingleFile(formData:any): Observable<any>{
      return this.httpClient.post<any>(this.apiurl + environment.Mediagateway + 'PostSingleFile',formData)
    }

    companyAuditLogs(companyId:any): Observable<any>{
      return this.httpClient.get<any>(this.apiurl + environment.companygateway + 'GetCompanyAuditLogs?companyId='+companyId)
    }
}
