import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  
  apiurl: any;
  apiaggurl:any

  constructor(private httpClient: HttpClient) {
    this.apiurl = environment.apiBaseUrl + environment.loanaccountgateway;
    this.apiaggurl = environment.apiBaseUrl + environment.aggregator;


  }

  TransactionDetailByInvoiceId(InvoiceId: any, HeadType: any): Observable<any> {
    return this.httpClient.get<any>(this.apiurl + '/TransactionDetailByInvoiceId?InvoiceId='+InvoiceId+'&HeadType='+HeadType);
  }
  
  
  InvoiceDetail(InvoiceId: any): Observable<any> {
    return this.httpClient.get<any>(this.apiurl + '/InvoiceDetail?InvoiceId='+InvoiceId);
  }

  GetCompanyInvoiceDetails(obj: any): Observable<any> {
    return this.httpClient.post<any>(this.apiaggurl + 'LoanAccountAgg/GetCompanyInvoiceDetails',obj);
  }

}
