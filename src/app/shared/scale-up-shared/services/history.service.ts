import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  apiURL: string;
 
  constructor(private http: HttpClient) {
    this.apiURL = environment.apiBaseUrl;
   }
  getHistory(obj:any):  Observable<any> {
    return this.http.post<any>(this.apiURL + environment.aggregator + 'CompanyAgg/GetAuditLogs',obj);
  }
}
