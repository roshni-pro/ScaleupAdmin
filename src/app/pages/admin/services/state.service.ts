
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStogareService } from 'app/shared/services/local-storage.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private apiURL: string;
  constructor(private httpClient: HttpClient, private localStorageService: LocalStogareService) {
    this.apiURL=environment.apiBaseUrl + environment.locationgateway

  }

  getStateByCountryId(CountryId:any): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + 'State/GetStateByCountryId?countryId=' + CountryId);
  }
  saveState(obj:any): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + 'State/AddState',obj);
  }
  updateState(obj:any): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + 'State/UpdateState', obj);
  }
  getStateList(): Observable<any> {
    return this.httpClient.get<any>( this.apiURL + 'State/GetAllState');
  }
  getStateById(id:any): Observable<any> {
    return this.httpClient.get<any>( this.apiURL + 'State/GetStateByStateId?stateId=' + id);
  }

  activeInactiveStatus(stateId:any,Status:any): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + 'State/UpdateStateStatus?stateId=' + stateId + '&IsActive=' + Status);
  }
}



