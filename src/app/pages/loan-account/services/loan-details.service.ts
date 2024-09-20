import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanDetailsService {
  apiurl: any;
  constructor(private httpClient: HttpClient) { 
    this.apiurl = environment.apiBaseUrl + environment.loanaccountgateway;
  }

  LoanRepaymentScheduleDetails(id:number): Observable<any> {
    return this.httpClient.get<any>(this.apiurl + '/LoanRepaymentScheduleDetails?loanAccountId='+id);
  }
  GetBusinessLoanDetails(id:number): Observable<any> {
    return this.httpClient.get<any>(this.apiurl + '/GetBusinessLoanDetails?loanAccountId='+id);
  }
    
}
