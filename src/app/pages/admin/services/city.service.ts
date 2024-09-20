import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStogareService } from 'app/shared/services/local-storage.service'; 
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  private apiURL: string;
  constructor(private httpClient: HttpClient, private localStorageService: LocalStogareService) {
    this.apiURL=environment.apiBaseUrl + environment.locationgateway
  }


  getCityByStateId(StateId:number): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + 'City/GetCityByStateId?stateId=' + StateId);
  }

  saveCity(obj:any): Observable<any> {
    return this.httpClient.post<any>(this.apiURL+'City/AddCity', obj);
  }

  updateCityMaster(obj:any): Observable<any> {
    return this.httpClient.post<any>(this.apiURL+'City/UpdateCity', obj);
  }

  getCityList(): Observable<any> {
    return this.httpClient.get<any>(this.apiURL+'City/GetAllCities');
  }

  getByCityId(id:number): Observable<any> {
    return this.httpClient.get<any>(this.apiURL+'City/GetCityByCityId?cityId=' + id);
  }

  activeInactiveStatus(cityId:number,Status:boolean): Observable<any> {
    return this.httpClient.get<any>(this.apiURL+'City/UpdateCityStatus?cityId=' + cityId + '&IsActive=' + Status);
  }
  
}

