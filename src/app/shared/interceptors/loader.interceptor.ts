import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';
import { LoaderNewService } from '../services/loader-new.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  
  constructor(private LoaderNewService: LoaderNewService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.LoaderNewService.showLoader();
    return next.handle(req.clone()).pipe(
      finalize(() => this.LoaderNewService.hideLoader())
    );
  }
}