import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  apiurl: any;
  apiurlAgg: any;
  constructor(private httpClient: HttpClient) {
    this.apiurl = environment.apiBaseUrl + environment.loanaccountgateway;
    this.apiurlAgg = environment.apiBaseUrl + environment.aggregator;
  }

  GetLoanAccountList(obj:any): Observable<any> {
    //debugger;
    return this.httpClient.post<any>(this.apiurl + '/GetLoanAccountList',obj);
  }

  AddRepaymentAccountDetails(obj:any): Observable<any> {
    // https://localhost:7000/services/loanaccount/v1/AddRepaymentAccountDetails
    return this.httpClient.post<any>(this.apiurl + '/AddRepaymentAccountDetails',obj);
  }
  
  GetStatusList(obj:string): Observable<any> {
    //debugger;
    return this.httpClient.get<any>(this.apiurlAgg + 'LeadAgg/GetStatusList?ProductType=' + obj);
  }

  GetRepaymentAccountDetailsForAdmin(LoanAccountId:any): Observable<any> {
    // https://localhost:7000/services/loanaccount/v1/GetRepaymentAccountDetails?LeadId=345
    return this.httpClient.get<any>(this.apiurl + '/GetRepaymentAccountDetailsForAdmin?LoanAccountId=' + LoanAccountId);
  }
  
  GetBusinessLoanAccountList(obj:any): Observable<any> {
    //debugger;
    return this.httpClient.post<any>(this.apiurlAgg + 'LoanAccountAgg/GetBusinessLoanAccountList',obj);
  }
  GetNBFCBusinessLoanAccountList(obj:any): Observable<any> {
    //debugger;
    return this.httpClient.post<any>(this.apiurlAgg + 'LoanAccountAgg/GetNBFCBusinessLoanAccountList',obj);
  }
  GetLoanAccountListExport(obj:any): Observable<any> {
    //debugger;
    return this.httpClient.post<any>(this.apiurl + '/GetLoanAccountListExport',obj);
  }

  GetLoanAccountDetails(loanAccountId: any): Observable<any> {
    return this.httpClient.get<any>(this.apiurl + '/GetLoanAccountDetail?loanAccountId='+loanAccountId);
  }

  PostLoanAccountToAnchor(AccountId: any): Observable<any> {
    return this.httpClient.get<any>(this.apiurl + '/PostLoanAccountToAnchor?AccountId='+AccountId);
  }

  ActiveInActiveAccount(payload: any): Observable<any> {
    return this.httpClient.get<any>(this.apiurl + '/ActiveInActiveAccount?loanAccountId='+payload.loanAccountId+'&IsAccountActive='+payload.IsAccountActive);
  }
  BlockUnblockAccount(payload: any): Observable<any> {
    return this.httpClient.get<any>(this.apiurl + '/BlockUnblockAccount?loanAccountId='+payload.loanAccountId+'&isBlock='+payload.isBlock+'&comment='+payload.comment);
  }
  
  
  GetTransactionDetailById(AccountTransactionsID:any): Observable<any> {
    //debugger;
    return this.httpClient.get<any>(this.apiurl + '/TransactionDetail?AccountTransactionsID='+AccountTransactionsID);
  }

  AnchorCityProductList(): Observable<any> {
    // services/loanaccount/v1/AnchorCityProductList
    return this.httpClient.get<any>(this.apiurl + '/AnchorCityProductList');
  }
  GetAccountTransaction(Obj:any): Observable<any> {
    //debugger;
    return this.httpClient.post<any>(this.apiurl + '/GetAccountTransaction',Obj);
  }
  
  GetBLAccountList(Obj:any): Observable<any> {
    // https://localhost:7000/aggregator/LoanAccountAgg/GetBLAccountList
    //debugger;
    return this.httpClient.post<any>(this.apiurlAgg + 'LeadAgg/GetBLAccountList',Obj);
  }
  GetNBFCBLAccountList(Obj:any): Observable<any> {
    return this.httpClient.post<any>(this.apiurlAgg + 'LeadAgg/GetNBFCBLAccountList',Obj);
  }
  GetSCAccountList(Obj:any): Observable<any> {
    // https://localhost:7000/aggregator/LoanAccountAgg/GetSCAccountList
    //debugger;
    return this.httpClient.post<any>(this.apiurlAgg + 'LeadAgg/GetSCAccountList',Obj);
  }

  GetInvoiceDetail(Obj:any): Observable<any> {
    //debugger;
    return this.httpClient.post<any>(this.apiurl + '/GetInvoiceDetail',Obj);
  }

  GetAuditLogs(Obj:any): Observable<any> {
    //debugger;
    return this.httpClient.post<any>(this.apiurl + '/GetAuditLogs',Obj);
  }
  
  GetAccountTransactionExport(Obj:any): Observable<any> {
    //debugger;
    return this.httpClient.post<any>(this.apiurl + '/GetAccountTransactionExport',Obj);
  }


  GetInvoiceDetailExport(Obj:any): Observable<any> {
    //debugger;
    return this.httpClient.post<any>(this.apiurl + '/GetInvoiceDetailExport',Obj);
  }
  
  TransactionSettleByManual(Obj:any): Observable<any> {
    return this.httpClient.post<any>(this.apiurl + '/TransactionSettleByManual',Obj);
  }

  GetPenaltyBounceCharges(referenceId:any,penaltytype:any): Observable<any> {
    //debugger;
    return this.httpClient.get<any>(this.apiurl + '/GetPenaltyBounceCharges?ReferenceId='+referenceId+'&Penaltytype='+penaltytype);
  }
  
  ClearInitiateLimit(LeadAccountId:any, AccountTransactionId:any): Observable<any> {
    //debugger;
    return this.httpClient.get<any>(this.apiurl + '/ClearInitiateLimit?LeadAccountId='+LeadAccountId+'&AccountTransactionId='+AccountTransactionId);
  }

  ClearInitiateLimitByReferenceId(LeadAccountId:any, ReferenceId:any): Observable<any> {
    //debugger;
    return this.httpClient.get<any>(this.apiurl + '/ClearInitiateLimitByReferenceId?LeadAccountId='+LeadAccountId+'&ReferenceId='+ReferenceId);
  }

  GetCityNameList(): Observable<any> {
    //debugger;
    return this.httpClient.get<any>(this.apiurl + '/GetCityNameList')
  }

  getCityList(): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.locationgateway + 'City/GetAllCities');
  }
  GetAllLeadCities(): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.aggregator + 'LeadAgg/GetAllLeadCities');
  }
  GetAnchorNameList(): Observable<any> {
    //debugger;
    return this.httpClient.get<any>(this.apiurl + '/GetAnchorNameList')

  }

  WaiveOffPenaltyBounce(obj:any): Observable<any> {
    //debugger;
    return this.httpClient.post<any>(this.apiurl + '/WaiveOffPenaltyBounce',obj);
  }
  // https://localhost:7000/services/loanaccount/v1/WaiveOffPenaltyBounce
  GetSalesAgentListByAnchorId(anchorCompanyId:any):Observable<any>{
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.prodgateway + 'GetSalesAgentListByAnchorId?anchorCompanyId='+anchorCompanyId);
  }
  GetCompanyList(): Observable<any> {

    return this.httpClient.get<any>(environment.apiBaseUrl + environment.companygateway + 'GetCompanyList');
  }
  GetAllCompanyList(): Observable<any> {
    return this.httpClient.get<any>(this.apiurlAgg + 'CompanyAgg/GetCompanyListForDropDown');
  }
  GetAnchorCompaniesByProduct(productType:string): Observable<any> {
    return this.httpClient.get<any>(this.apiurlAgg + 'CompanyAgg/GetAnchorCompaniesByProduct?productType=' + productType);
  }
}
