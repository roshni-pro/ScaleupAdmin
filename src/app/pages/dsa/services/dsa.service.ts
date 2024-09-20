import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DsaService {
  private apiurl: string = '';

  constructor(private httpClient: HttpClient) { 
    this.apiurl = environment.apiBaseUrl + environment.aggregator

  }

  getCityList(): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl + environment.locationgateway + 'City/GetAllCities');
  }

  GetDSACityList(ProfileType:any): Observable<any> {
    return this.httpClient.get<any>(this.apiurl +'DSAAgg/GetDSACityList?ProfileType='+ProfileType);
  }

  GetDsaLeadData(obj: any): Observable<any> {
    return this.httpClient.post<any>(this.apiurl +  'DSAAgg/GetDSALeadForListPage', obj);
  }

  ApproveDSALead(obj: any): Observable<any> {
    return this.httpClient.post<any>(this.apiurl +  'DSAAgg/ApproveDSALead', obj);
  }

  SaveDSAPayouts(obj: any): Observable<any> {
    return this.httpClient.post<any>(environment.apiBaseUrl+environment.leadgateway +  'DSA/SaveDSAPayouts', obj);
  }

  GetProductMasterList(): Observable<any> {
    //debugger;
    return this.httpClient.get<any>(environment.apiBaseUrl +environment.prodgateway+ 'GetProductList');
  }

  DSADeactivate(leadId:any,isActive:Boolean,isReject : boolean): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl+environment.aggregator + 'DSAAgg/DSADeactivate?leadId='+leadId+'&isActive='+isActive + '&isReject=' + isReject);
  }
  GetDSAUsersList(UserId:any,Skip:number,Take:number): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl+environment.prodgateway + 'GetDSAUsersList?UserId='+UserId+'&Skip='+Skip+'&Take='+Take);
  }
  
  DSAUserStatusChange(payload : any): Observable<any> {
    return this.httpClient.post<any>(environment.apiBaseUrl+environment.prodgateway +  'DSAUserStatusChange', payload );
  }

  SaveDSAPayoutPercentage(obj: any): Observable<any> {
    return this.httpClient.post<any>(environment.apiBaseUrl+environment.prodgateway +  'SaveDSAPayoutPercentage', obj);
  }

  LeadReject(leadId:any,Message:string): Observable<any> {
    return this.httpClient.get<any>(environment.apiBaseUrl+environment.leadgateway + 'LeadReject?LeadId='+leadId+'&Message='+Message);
  }

  PrepareAgreement(leadId:any,UserId:any,ProfileType:any): Observable<any> {
    return this.httpClient.get<any>(this.apiurl +'DSAAgg/PrepareAgreement?UserId='+UserId+'&LeadId='+leadId);
  }

  GetDSALeadDataById(leadId:any,Status:any): Observable<any> {
    return this.httpClient.get<any>(this.apiurl +'DSAAgg/GetDSALeadDataById?LeadId='+leadId +'&Status='+Status);
  }
  GetDSAAgreement(leadId:any): Observable<any> {
    return this.httpClient.get<any>(this.apiurl +'DSAAgg/GetDSAAgreement?leadId='+leadId);
  }

//dsa master page status
  GetStatusList(ProductType:any): Observable<any> {
    return this.httpClient.get<any>(this.apiurl +'LeadAgg/GetStatusList?ProductType='+ProductType);
  }
  // aggregator/LeadAgg/GetStatusList



}
