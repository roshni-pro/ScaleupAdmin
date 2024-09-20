import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  loader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() { }

  isLoading(loading: boolean) {
    this.loader.next(loading);
  }
}