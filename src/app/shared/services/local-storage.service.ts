import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LocalStogareService {
  tokenKey: string = 'clUserToken';
  redirectUrlKey : string = 'redirectUrl';
  
  
  constructor(@Inject(PLATFORM_ID) private platformId: any) { }

  getItemObject(key: string): any {
    if (isPlatformBrowser(this.platformId)) {
      let item = localStorage.getItem(key);

      if (item && typeof item == 'string' &&  item.length > 0) {
        return JSON.parse(item);
      }else  if (item && typeof item == 'object' ) {
        return JSON.parse(item);
      }else{
        return null;
      }
    }
  }

  getItemString(key: string): any {
    if (isPlatformBrowser(this.platformId)) {
      let item = localStorage.getItem(key)
      return item;
    }
  }

  set(key: string, item: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, item);
    }
  }

  removeItem(key: string){
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }  
}
