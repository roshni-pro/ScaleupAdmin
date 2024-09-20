import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeadService {


  private localData = new BehaviorSubject<any>({});
  currentdata = this.localData.asObservable();

  lookAtThis(msg: string, data: any) {
    debugger
    console.log(this.localData);
    this.localData.next(data);
    console.log(this.localData);
    console.log(this.currentdata);
  }

  




  private apiurl: string = '';
  private mediaApiurl: string = '';
  private locationApiurl: string = '';
  constructor(private httpClient: HttpClient) {
    this.apiurl = environment.apiBaseUrl + environment.aggregator;
    this.mediaApiurl = environment.apiBaseUrl + environment.Mediagateway;
    this.locationApiurl = environment.apiBaseUrl + environment.locationgateway;
  }


  GetLeadListPage(obj: any): Observable<any> {
    return this.httpClient.post<any>(this.apiurl + 'LeadAgg/GetLeadForListPage', obj);
  }

  refreshPurchaseInvoice(obj: any): Observable<any> {
    return this.httpClient.get<any>(this.apiurl + 'LeadAgg/refreshPurchaseInvoice', obj);
  }


  GetLeadUpdateHistorie(obj: any): Observable<any> {
    // https://localhost:7000/services/lead/v1/GetLeadUpdateHistorie
    return this.httpClient.post<any>(environment.apiBaseUrl + environment.leadgateway + 'GetLeadUpdateHistorie', obj);
  }

  UpdateAddress(obj: any): Observable<any> {
    // https://localhost:7000/aggregator/LeadAgg/UpdateAddress
    return this.httpClient.post<any>(this.apiurl + 'LeadAgg/UpdateAddress', obj);
  }

  GetLeadDetailsByUserId(Userid: any, LeadId: any): Observable<any> {
    return this.httpClient.get<any>(this.apiurl + 'LeadAgg/GetLeadDetailAll?Usersid=' + Userid + '&LeadId=' + LeadId + '&KycCode=' + 5);
  }
  getallProductList(): Observable<any>{
    return this.httpClient.get<any>(environment.apiBaseUrl+ environment.prodgateway + 'GetProductList');
  }

  GetLeadPANImage(DocumentId: number): Observable<any> {
    debugger
    return this.httpClient.get<any>(this.apiurl + 'LeadAgg/GetLeadImageByDocumentId?DocumentId=' + DocumentId);
  }

  GetLeadActivityProgressList(leadId: number): Observable<any> {

    return this.httpClient.get<any>(this.apiurl + 'LeadAgg/GetLeadActivityProgressList?leadId=' + leadId);
  }

  GetLeadActivityDetails(Usersid: string, KycCode: string): Observable<any> {
    return this.httpClient.get<any>(this.apiurl + 'LeadAgg/GetLeadDetailByKycCode?Usersid=' + Usersid + '&KycCode=' + KycCode);
  }

  GetCompanyList(): Observable<any> {

    return this.httpClient.get<any>(environment.apiBaseUrl + environment.companygateway + 'GetCompanyList');
  }

  GetProductMasterList(companyId: number) {
    // return this.httpClient.get<any>(environment.apiBaseUrl + environment.prodgateway +'GetProductMasterListById?companyId='+companyId);
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.prodgateway + 'GetAnchorProductList?CompanyId=' + companyId);
  }
  //    VerifyLeadDocument(payload:any): Observable<any>{
  //     debugger
  //     return this.httpClient.post<any>(environment.apiBaseUrl + environment.leadgateway+ 'VerifyLeadDocument',payload);
  //    }

  GetVerifiedLeadDocumentStatus(payload: any): Observable<any> {
    return this.httpClient.post<any>(environment.apiBaseUrl + environment.leadgateway + 'GetVerifiedLeadDocumentStatus', payload);
  }

//   InitiateLeadOffer(leadId: number): Observable<any> {
//     return this.httpClient.get<any>(this.apiurl + 'LeadAgg/InitiateLeadOffer?LeadId=' + leadId);
//   }
InitiateLeadOffer(payload:any): Observable<any> {
    return this.httpClient.post<any>(this.apiurl + 'LeadAgg/InitiateLeadOffer' , payload);
  }

  GetLeadOffer(leadId: number): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.leadgateway + 'GetLeadOffer?LeadId=' + leadId);
  }

  PostDisbursement(Payload: any): Observable<any> {
    return this.httpClient.post<any>(this.apiurl + 'LeadAgg/PostDisbursement', Payload);
  }

  GetDisbursement(leadId: any): Observable<any> {
    return this.httpClient.get<any>(this.apiurl + 'LeadAgg/GetDisbursement?leadId=' + leadId);
  }

  GetDisbursementProposal(leadId: any): Observable<any> {
    return this.httpClient.get<any>(this.apiurl + 'LeadAgg/GetDisbursementProposal?leadId=' + leadId);
  }

  GetOfferAccepted(leadId: any): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.leadgateway + 'GetOfferAccepted?LeadId=' + leadId);
  }

  InitiateLeadOfferTest(leadId: number): Observable<any> {
    return this.httpClient.get<any>(this.apiurl + 'LeadAgg/InitiateLeadOfferTest?LeadId=' + leadId);
  }

  GetOfferList(leadId: number): Observable<any> {
    return this.httpClient.get<any>(this.apiurl + 'LeadAgg/GetOfferList?LeadId=' + leadId);
  }

  //    UpdateLeadOffer(leadOfferId:number): Observable<any>{
  //     return this.httpClient.get<any>(environment.apiBaseUrl + environment.leadgateway +'UpdateLeadOffer?LeadOfferId='+leadOfferId);
  //    }

  //   UpdateLeadOffer(leadOfferId: number, interestRate: number): Observable<any> {
  //     return this.httpClient.get<any>(this.apiurl + 'LeadAgg/UpdateLeadOffer?LeadOfferId=' + leadOfferId + '&interestRate=' + interestRate);
  //   }
  UpdateLeadOffer(payload: any): Observable<any> {
    return this.httpClient.post<any>(this.apiurl + 'LeadAgg/UpdateLeadOffer', payload);
  }

  GetGenerateOfferStatus(leadId: number): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.leadgateway + 'GetGenerateOfferStatus?LeadId=' + leadId);
  }

  // https://localhost:7000/aggregator/LeadAgg/GetGenerateOfferStatusNew?LeadId=259
  GetGenerateOfferStatusNew(leadId: number, productType: string): Observable<any> {
    let obj = {
      "leadId": leadId,
      "productType": productType
    }
    return this.httpClient.post<any>(this.apiurl + 'LeadAgg/GetGenerateOfferStatusNew', obj);
  }



  GetBureau(): Observable<any> {

    return this.httpClient.get<any>(this.apiurl + 'LeadAgg/GetBureau');
  }



  DisbursementReject(payload: any): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.leadgateway + 'DisbursementReject', payload);
  }

  CustomerBlock(LoanAccountId: number, Comment: any, IsHideLimit: boolean, username: string): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.loanaccountgateway + '/CustomerBlock?LoanAccountId=' + LoanAccountId + '&Comment=' + Comment + '&IsHideLimit=' + IsHideLimit + '&username=' + username);
    // long LoanAccountId, string Comment, bool IsHideLimit, string username
  }

  CustomerActiveInActive(LoanAccountId: number, AccountActiveInActive: boolean): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.loanaccountgateway + '/CustomerActiveInActive?LoanAccountId=' + LoanAccountId + '&AccountActiveInActive=' + AccountActiveInActive);
  }

  GetGenerateAgreementStatus(leadId: number): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.leadgateway + 'GetGenerateAgreementStatus?LeadId=' + leadId);
  }

  AnchorCityProductList(): Observable<any> {
    // services/loanaccount/v1/AnchorCityProductList
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.loanaccountgateway + '/AnchorCityProductList');
  }

  GetAnchorNameList(): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.loanaccountgateway + '/GetAnchorNameList')
  }

  getCityList(): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.locationgateway + 'City/GetAllCities');
  }
  GetAllLeadCities(): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.aggregator + 'LeadAgg/GetAllLeadCities');
  }

  ResetUser(UserId: string): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.kycgateway + 'KYCDoc/RemoveKYCMasterInfo?userid=' + UserId);
  }

  IsOfferGenerated(leadId: number): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.leadgateway + 'IsOfferGenerated?LeadId=' + leadId);
  }

  ThirdPartyCreateLeadRetry(leadId: number, nbfcid: number): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.leadgateway + 'ThirdPartyCreateLeadRetry?LeadId=' + leadId + '&NbfcId=' + nbfcid);
  }

  ThirdPartyAgreementLeadRetry(leadId: number, nbfcid: number): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.leadgateway + 'ThirdPartyAgreementLeadRetry?LeadId=' + leadId + '&NbfcId=' + nbfcid);
  }

  GetAllLeadOfferStatus(leadId: number): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.leadgateway + 'GetAllLeadOfferStatus?LeadId=' + leadId);
  }

  VerifyLeadDocument(payload: any): Observable<any> {
    return this.httpClient.post<any>(this.apiurl + 'LeadAgg/VerifyLeadDocument', payload);
  }

  UpdateLeadInfo(leadId: number, nbfcId: number, companyIdentificationCode: string): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.leadgateway + 'NBFCSchedular/UpdateLeadInfo?leadId=' + leadId + '&NbfcId=' + nbfcId + '&companyIdentificationCode=' + companyIdentificationCode);
  }

  LeadReject(leadId: number, message: string): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.leadgateway + 'LeadReject?LeadId=' + leadId + '&Message=' + message);
  }
  RejectNBFCOffer(obj:any): Observable<any> {
    return this.httpClient.post<any>(environment.apiBaseUrl + environment.leadgateway + 'RejectNBFCOffer',obj);
  }
  GetLeadCommonDetail(leadId: number): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.leadgateway + 'GetLeadCommonDetail?LeadId=' + leadId);
  }

  //commented because earlier this method was used
  //    ResetLeadActivityMasterProgresse(LeadId:number): Observable<any> {
  //     return this.httpClient.get<any>(environment.apiBaseUrl + environment.leadgateway +'ResetLeadActivityMasterProgresse?LeadId='+LeadId);
  //   }
  ResetLeadActivityMasterProgresse(LeadId: number): Observable<any> {
    return this.httpClient.get<any>(this.apiurl + 'LeadAgg/ResetLeadActivityMasterProgresse?LeadId=' + LeadId);
  }

  ResetLead(LeadId: number, ProductCode: any): Observable<any> {
    return this.httpClient.get<any>(this.apiurl + 'LeadAgg/ResetLead?LeadId=' + LeadId + '&ProductCode=' + ProductCode);
  }
  LeadActivityHistory(LeadId: number): Observable<any> {
    return this.httpClient.get<any>(this.apiurl + 'LeadAgg/LeadActivityHistory?LeadId=' + LeadId);
  }

  AddLeadGeneratorConvertor(payload: any): Observable<any> {
    return this.httpClient.post<any>(environment.apiBaseUrl + environment.leadgateway + 'AddLeadGeneratorConvertor', payload);
  }

  GetLoan(LeadMasterId: any): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.leadgateway + 'ArthMate/GetLoan?LeadMasterId=' + LeadMasterId);
  }
  GetLoanDisbursement(LeadMasterId: any): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.leadgateway + 'ArthMate/GetDisbursement?LeadMasterId=' + LeadMasterId);
  }
  ChangeLoanStatus(LeadMasterId: any, Status: any): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.leadgateway + 'ArthMate/ChangeLoanStatus?LeadMasterId=' + LeadMasterId + '&Status=' + Status);
  }
  LoanNach(LeadMasterId: any, UMRN: any): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.leadgateway + 'ArthMate/LoanNach?UMRN=' + UMRN + '&Leadmasterid=' + LeadMasterId);
  }
  NBFCDisbursement(NBFCDisbursementDC:any): Observable<any> {
    return this.httpClient.post<any>(environment.apiBaseUrl + environment.aggregator + 'LeadAgg/NBFCDisbursement',NBFCDisbursementDC);
  }
  LoanRepaymentScheduleDetails(LeadMasterId: any): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.leadgateway + 'ArthMate/LoanRepaymentScheduleDetails?LeadMasterId=' + LeadMasterId);
  }

  GetOfferEmiDetails(LeadMasterId: any): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.leadgateway + 'ArthMate/GetOfferEmiDetails?leadId=' + LeadMasterId);
  }
  SaveAgreementESignDocument(LeadMasterId: any, eSignDocumentURL: any): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.leadgateway + 'ArthMate/SaveAgreementESignDocument?leadmasterid=' + LeadMasterId + '&eSignDocumentURL=' + eSignDocumentURL);
  }

  GetLoanByLoanId(LeadMasterId: any): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.leadgateway + 'ArthMate/GetLoanByLoanId?Leadmasterid=' + LeadMasterId);
  }

  UpdateBeneficiaryBankDetailOfArthmate(payload: any): Observable<any> {
    return this.httpClient.post<any>(environment.apiBaseUrl + environment.leadgateway + 'ArthMate/UpdateBeneficiaryBankDetail', payload);
  }

  postSingleFile(formData: any): Observable<any> {
    return this.httpClient.post<any>(environment.apiBaseUrl + environment.Mediagateway + 'PostSingleFile', formData)
  }

  PostMultipleFile(formDataArr: any): Observable<any> {
    return this.httpClient.post<any>(environment.apiBaseUrl + environment.Mediagateway + 'PostMultipleFile', formDataArr)
  }

  //   UploadLeadDocuments(payload: any): Observable<any> {
  //     // https://localhost:7000/services/lead/v1/UploadLeadDocuments
  //     return this.httpClient.post<any>(environment.apiBaseUrl + environment.leadgateway + 'UploadLeadDocuments', payload)
  //   }
  UploadLeadDocuments(payload: any): Observable<any> {
    // https://localhost:7000/services/lead/v1/UploadLeadDocuments
    return this.httpClient.post<any>(this.apiurl + 'LeadAgg/UploadLeadDocuments', payload)
  }

  UploadMultiLeadDocuments(payload: any): Observable<any> {
    // https://localhost:7000/services/lead/v1/UploadLeadDocuments
    return this.httpClient.post<any>(this.apiurl + 'LeadAgg/UploadMultiLeadDocuments', payload)
  }

  UpdateBuisnessDetail(payload: any): Observable<any> {
    // https://localhost:7000/aggregator/LeadAgg/UpdateBuisnessDetail
    return this.httpClient.post<any>(environment.apiBaseUrl + environment.aggregator + 'LeadAgg/UpdateBuisnessDetail', payload)
  }

  //   GetLeadDocumentsByLeadId(LeadId: any): Observable<any> {
  //     // https://localhost:7000/services/lead/v1/UploadLeadDocuments
  //     return this.httpClient.post<any>(environment.apiBaseUrl + environment.leadgateway + 'GetLeadDocumentsByLeadId?LeadId=' + LeadId, {})
  //   }
  GetLeadDocumentsByLeadId(LeadId: any): Observable<any> {
    // https://localhost:7000/services/lead/v1/UploadLeadDocuments
    return this.httpClient.post<any>(environment.apiBaseUrl + environment.aggregator + 'LeadAgg/GetLeadDocumentsByLeadId?LeadId=' + LeadId, {})
  }

  GetAllState(): Observable<any> {
    https://localhost:7000/services/location/v1/State/GetAllState
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.locationgateway + 'State/GetAllState');
  }

  GetCityByStateId(stateId: any): Observable<any> {
    https://localhost:7000/services/location/v1/City/GetCityByStateId?stateId=1
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.locationgateway + 'City/GetCityByStateId?stateId=' + stateId);
  }
  GetKarzaElectricityStateById(electricitystateId: any): Observable<any> {
    https://localhost:7000/services/kyc/v1/KYCDoc/GetKarzaElectricityStateById?stateId=439
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.kycgateway + 'KYCDoc/GetKarzaElectricityStateById?stateId=' + electricitystateId);
  }

  GetBankList(): Observable<any> {
    // api/eNach/BankList
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.leadgateway + 'api/eNach/BankList');
  }
  GetCustomerDetailUsingGST(GSTNO: any): Observable<any> {
    // LeadAgg/GetCustomerDetailUsingGST?GSTNO=
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.aggregator + 'LeadAgg/GetCustomerDetailUsingGST?GSTNO=' + GSTNO);
  }

  public Details: any = [];
  private Source = new BehaviorSubject(this.Details);
  leadInformation = this.Source.asObservable();

  Infosender(info: any) {
    this.Source.next(info)
  }
  GetSalesAgentListByAnchorId(anchorCompanyId: any): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.prodgateway + 'GetSalesAgentListByAnchorId?anchorCompanyId=' + anchorCompanyId);
  }

  GetCompanyBuyingHistory(CompanyId: any, LeadId: number): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + 'services/lead/v1/GetCompanyBuyingHistory?CompanyId=' + CompanyId + '&LeadId=' + LeadId);
  }
  GetLeadDataById(leadId: any): Observable<any> {
    return this.httpClient.get<any>(this.apiurl + 'LeadAgg/GetLeadDataById?LeadId=' + leadId);
  }
  UpdateCibilDetails(payload: any): Observable<any> {
    return this.httpClient.post<any>(environment.apiBaseUrl + environment.leadgateway + 'UpdateCibilDetails', payload);
  }
  GetNbfcCompaniesByProduct(productId:any): Observable<any> {
    return this.httpClient.get<any>(this.apiurl + 'CompanyAgg/GetNbfcCompaniesByProduct?productId='+productId);
  }
//   GenerateLeadOfferByFinance(leadId: any,creditLimit:number): Observable<any> {
//     return this.httpClient.get<any>(this.apiurl + 'LeadAgg/GenerateLeadOfferByFinance?LeadId=' + leadId + '&CreditLimit=' +creditLimit);
//   }
  GenerateOfferByFinance(payload:any): Observable<any> {
    return this.httpClient.post<any>(this.apiurl + 'LeadAgg/GenerateOfferByFinance',payload);
  }

  GetGenerateOfferByFinance(payload:any): Observable<any> {
    return this.httpClient.post<any>(this.apiurl + 'LeadAgg/GetGenerateOfferByFinance',payload);
  }
  UploadMASFinanceAgreement(payload: any): Observable<any> {
    return this.httpClient.post<any>(environment.apiBaseUrl + environment.aggregator + 'LeadAgg/UploadMASfinanceAgreement', payload);
  }

  GetMASFinanceAgreement(leadId: any): Observable<any> {
    return this.httpClient.get<any>( environment.apiBaseUrl+ environment.leadgateway + 'GetMASFinanceAgreement?LeadId=' + leadId);
  }
  
  UpdateLeadOfferByFinance(payload:any): Observable<any> {
    return this.httpClient.post<any>(environment.apiBaseUrl+ environment.leadgateway + 'UpdateLeadOfferByFinance' , payload);
  }

  GetAcceptedLoanDetail(leadId:any): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl+ environment.leadgateway + 'GetAcceptedLoanDetail?LeadId='+leadId);
  }

  GetLeadOfferInitiatedStatus(leadId:any): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl+ environment.leadgateway + 'GetLeadOfferInitiatedStatus?LeadId='+leadId);
  }

  OfferReject(payload:any): Observable<any> {
    return this.httpClient.post<any>(environment.apiBaseUrl+ environment.leadgateway + 'OfferReject',payload);
  }

  MediaGetFilePath(id: any){
    return this.httpClient.post<any>(this.mediaApiurl + 'GetFilePath?id='+id, null);

  }

  GetUserNameByUserId(id: any){
    return this.httpClient.get<any>(this.apiurl + 'LeadAgg/GetUserNameByUserId?Usersid='+id);
  }

  GetAddress(id: any){
    return this.httpClient.get<any>(this.locationApiurl + 'Address/GetAddress?addressId='+id);
  }

  UpdateBuyinghistory(mobileno:any,ProductType:any): Observable<any> {
    // /api/ScaleUpIntegration/UpdateBuyinghistory?mobileno=8827535006&ProductType=CreditLine
    return this.httpClient.get<any>(environment.saralUrl + 'api/ScaleUpIntegration/UpdateBuyinghistory?mobileno='+mobileno+'&ProductType='+ProductType);
  }

  NbfcOfferAccepted(payload:any): Observable<any> {
    return this.httpClient.post<any>(environment.apiBaseUrl+ environment.leadgateway + 'NbfcOfferAccepted',payload);
  }
  
  GetAllCompanyList(): Observable<any> {
    return this.httpClient.get<any>(this.apiurl + 'CompanyAgg/GetCompanyListForDropDown');
  }
  
  UpdateKYCStatus(payload: any){
    return this.httpClient.post<any>(this.apiurl + 'LeadAgg/UpdateKYCStatus',payload);
  }
  GetAnchorCompaniesByProduct(productType:string): Observable<any> {
    return this.httpClient.get<any>(this.apiurl + 'CompanyAgg/GetAnchorCompaniesByProduct?productType=' + productType);
  }
}
