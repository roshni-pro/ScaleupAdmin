import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStogareService } from 'app/shared/services/local-storage.service'; 
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private apiURL: string;
  constructor(private httpClient: HttpClient, private localStorageService: LocalStogareService) {
    this.apiURL=environment.apiBaseUrl + environment.locationgateway
   }
   saveCountry(obj:any): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + 'Country/AddCountry', obj);
  }
  updateCountry(obj :any): Observable<any> {
    return this.httpClient.post<any>(this.apiURL + 'Country/UpdateCountry', obj);
  }
  getCountryList(): Observable<any> {
    console.log(this.apiURL);
    return this.httpClient.get<any>(this.apiURL + 'Country/GetAllCountry');
  }
  getCountrybyId(countryId:number): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + 'Country/GetCountryById?countryId='+countryId);
  }

  
  DeleteCountry(countryId:number): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + 'Country/DeleteCountry?countryId='+countryId);
  }
  

}
