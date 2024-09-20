import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, skip } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StampUploaderService {
  apiurl: string;
  constructor(private httpClient: HttpClient) { 
    this.apiurl = environment.apiBaseUrl ;
  }

  GetStampUploaderList(isStampUsed:boolean,skip:number,take:number):Observable<any>{
    return this.httpClient.get(environment.apiBaseUrl+environment.leadgateway  +'getSlaLbaStampDetailsData?isStampUsed='+isStampUsed+'&skip='+skip+'&take='+take);
  }

  AddSlaLbaStamp(AddslapPayload:any):Observable<any>{
    return this.httpClient.post(environment.apiBaseUrl+environment.leadgateway  +'ArthMate/AddSlaLbaStamp',AddslapPayload);
  }

  StampPagerDelete(ArthmateSlaId:any):Observable<any>{
    return this.httpClient.get(environment.apiBaseUrl+environment.leadgateway  +'StampPagerDelete?ArthmateSlaId='+ArthmateSlaId);
  }

  StampPaperNumberCheck(stampPaperNo:any):Observable<any>{
    return this.httpClient.get(environment.apiBaseUrl+environment.leadgateway  +'StampPaperNumberCheck?stampPaperNo='+stampPaperNo);
  }
}
