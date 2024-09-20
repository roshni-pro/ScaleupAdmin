import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceGenerationService {
  apiurl: any;
  apiaggurl:any;

  constructor(private httpClient: HttpClient) {
    this.apiurl = environment.apiBaseUrl + environment.loanaccountgateway;
    this.apiaggurl = environment.apiBaseUrl + environment.aggregator;

  }

  GetCompanyInvoiceList(payload:any): Observable<any> {
    return this.httpClient.post<any>(this.apiaggurl + 'LoanAccountAgg/GetCompanyInvoiceList',payload);
  }

  GetCompanyInvoiceCharges(payload:any): Observable<any> {
    return this.httpClient.post<any>(this.apiaggurl + 'LoanAccountAgg/GetCompanyInvoiceCharges',payload);
  }

  SendInvoiceEmail(payload:any): Observable<any> {
    return this.httpClient.post<any>(this.apiaggurl + 'LoanAccountAgg/SendInvoiceEmail',payload);
  }

  GetCompanyInvoiceStatusList(AccountTransactionId:any): Observable<any> {
    return this.httpClient.get<any>( this.apiurl+ '/GetCompanyInvoiceDetailsByType?AccountTransactionId='+AccountTransactionId);
  }

  
  getStatusList(): Observable<any> {
    return this.httpClient.get<any>( this.apiurl+ '/GetCompanyInvoiceStatusList ');
  }

  GetCompanyInvoiceDetails(payload:any): Observable<any> {
    return this.httpClient.post<any>(this.apiaggurl + 'LoanAccountAgg/GetCompanyInvoiceDetails',payload);
  }
  UpdateCompanyInvoiceDetails(payload:any): Observable<any> {
    
    return this.httpClient.post<any>(this.apiaggurl + 'LoanAccountAgg/UpdateCompanyInvoiceDetails',payload);
    
  }
  GetInvoiceSettlement(companyInvoiceId:any): Observable<any> {

    return this.httpClient.get<any>(environment.apiBaseUrl + environment.loanaccountgateway + '/CompanyInvoiceSettlement?CompanyInvoiceId='+companyInvoiceId)
  }

  SettleCompanyInvoiceTransactions(payload:any): Observable<any> {
    return this.httpClient.post<any>(this.apiaggurl + 'LoanAccountAgg/SettleCompanyInvoiceTransactions',payload );
  }
  // GetCompanyInvoiceDetails(payload:any): Observable<any> {
  //   return this.httpClient.post<any>( 'https://localhost:7004/LoanAccountAgg/GetCompanyInvoiceDetails',payload);
  // }
  // UpdateCompanyInvoiceDetails(payload:any): Observable<any> {
  //   return this.httpClient.post<any>('https://localhost:7004/LoanAccountAgg/UpdateCompanyInvoiceDetails',payload);
  // }


}
