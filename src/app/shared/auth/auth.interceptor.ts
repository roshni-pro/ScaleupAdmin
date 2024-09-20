
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse
} from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { tap, mapTo, map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { LocalStogareService } from '../services/local-storage.service';
import { Observable } from 'rxjs';
// declare var AES256: { decrypt: (arg0: any, arg1: string) => string; };
declare var AES256: any;
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: any, public localStorageService: LocalStogareService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.headers.get('No-Auth') == "True")
            return next.handle(req.clone()).pipe(
                tap(event => {
                    //this.loaderService.isLoading.next(true);
                }, error => {
                    //this.loaderService.isLoading.next(false);
                })
                , map(event => {
                    //this.loaderService.isLoading.next(false);
                    if (event instanceof HttpResponse && event.status !== 201) {
                        if (event.url != null && event.url.indexOf("/api") > -1) {

                            // debugger
                            var today = new Date();
                            var n = (today.getMonth() + 1).toString();
                            var width = 2;
                            var z = '0';


                            var month = n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;

                            var day = today.getDate().toString();

                            if (day.length == 1) {
                                day = '0' + day;
                            }
                            var passphras = "201907221201";
                            passphras = today.getFullYear() + "" + month + "" + day + "1201";
                            // debugger;

                            if (event.url && !event.url.includes('https://localhost:7000/')) {
                                var data = JSON.parse(AES256.decrypt(event.body.Data, passphras));
                                event.body.Data = data;
                            }
                            event = event.clone({ body: event.body.Data });
                            // this.loaderService.isLoading.next(false);
                        }

                    }
                    return event;
                }, (error: { status: any; }) => {
                    console.log('error: ', error);
                    if (error.status == 401) {
                        this.localStorageService.removeItem(this.localStorageService.tokenKey);
                        this.router.navigateByUrl('/login');
                        // localStorage.removeItem('userToken');
                        // this.router.navigateByUrl('/login');
                    }
                    // if (error.status == 404) {
                    //     alert(error);
                    // }
                })
            );

        if (isPlatformBrowser(this.platformId) && localStorage.getItem('clUserToken') != null) {
            // debugger
            let clonedreq = null;
            clonedreq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${localStorage.getItem('clUserToken')}`
                }
            });
            return next.handle(clonedreq).pipe(
                tap(event => {
                    //this.loaderService.isLoading.next(true);
                }, error => {
                    //this.loaderService.isLoading.next(false);
                    console.log('error: ', error);
                    // http response status code
                    if (error.status == 401) {
                        this.localStorageService.removeItem(this.localStorageService.tokenKey);
                        this.router.navigateByUrl('/login');
                        // localStorage.removeItem('userToken');
                        // this.router.navigateByUrl('/login');
                    }


                })
                , map(event => {
                    //this.loaderService.isLoading.next(false);
                    if (event instanceof HttpResponse && event.status !== 201) {
                        if (event.url != null && event.url.indexOf("/api") > -1) {
                            // debugger;
                            var today = new Date();
                            var n = (today.getMonth() + 1).toString();
                            var width = 2;
                            var z = '0';


                            var month = n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;

                            var day = today.getDate().toString();

                            if (day.length == 1) {
                                day = '0' + day;
                            }
                            var passphras = "201907221201";
                            passphras = today.getFullYear() + "" + month + "" + day + "1201";

                            if ("UploadPayment" == event.url.split('/').pop()) {
                                event = event.clone({ body: event.body.Data });
                            } else {
                                if (event.url && !event.url.includes('https://localhost:7000/')) {
                                    if (event.body.Data != undefined) {
                                        var data = JSON.parse(AES256.decrypt(event.body.Data, passphras));
                                        event.body.Data = data;
                                        event = event.clone({ body: event.body.Data });
                                    } 
                                    else {
                                        // if(event.body == true)
                                        // {
                                        //     return;
                                        // }
                                        event.body.Data = event.body;
                                        event = event.clone({ body: event.body.Data });
                                    }
                                    // var data = JSON.parse(AES256.decrypt(event.body.Data, passphras));
                                    // debugger;
                                    // event.body.Data = data;
                                    // event = event.clone({ body: event.body.Data });
                                }

                            }
                            //this.loaderService.isLoading.next(false);
                        }

                    }
                    return event;
                }, (error: { status: number; }) => {
                    //this.loaderService.isLoading.next(false);
                    console.log('error: ', error);
                    // http response status code
                    if (error.status == 401) {
                        this.localStorageService.removeItem(this.localStorageService.tokenKey);
                        this.router.navigateByUrl('/login');
                        // localStorage.removeItem('userToken');
                        // this.router.navigateByUrl('/login');

                    }
                    //  else if (error.status == 404) {
                    //     alert("Error In API - 500")
                    // }


                })
            );
        }
        else {
            //this.loaderService.isLoading.next(false);
            // this.router.navigateByUrl('/login');

            return next.handle(req).pipe(
                tap(event => {
                    //this.loaderService.isLoading.next(true);
                }, error => {
                    //this.loaderService.isLoading.next(false);
                    console.log('error: ', error);
                    // http response status code
                    if (error.status == 401) {
                        this.localStorageService.removeItem(this.localStorageService.tokenKey);
                        this.router.navigateByUrl('/login');
                        // localStorage.removeItem('userToken');
                        // this.router.navigateByUrl('/login');
                    } else if (error.status == 400) {
                        // alert("error 400")

                        //error handeling
                    }


                })
                , map(event => {
                    //this.loaderService.isLoading.next(false);
                    if (event instanceof HttpResponse && event.status !== 201) {
                        if (event.url != null && event.url.indexOf("/api") > -1) {

                            var today = new Date();
                            var n = (today.getMonth() + 1).toString();
                            var width = 2;
                            var z = '0';


                            var month = n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;

                            var day = today.getDate().toString();

                            if (day.length == 1) {
                                day = '0' + day;
                            }
                            var passphras = "201907221201";
                            passphras = today.getFullYear() + "" + month + "" + day + "1201";
                            // debugger;
                            if (event.url && !event.url.includes('https://localhost:7000/')) {
                                if (event.body.Data != undefined) {
                                    var data = JSON.parse(AES256.decrypt(event.body.Data, passphras));
                                    event.body.Data = data;
                                    event = event.clone({ body: event.body.Data });
                                } 
                                else {
                                    // if(event.body == true)
                                    // {
                                    //     return;
                                    // }
                                    event.body.Data = event.body;
                                    event = event.clone({ body: event.body.Data });
                                }
                                // var data = JSON.parse(AES256.decrypt(event.body.Data, passphras));
                                // event.body.Data = data;
                                // event = event.clone({ body: event.body.Data });
                                // this.loaderService.isLoading.next(false);
                            }
                        }

                    }
                    return event;
                }, (error: { status: number; }) => {
                    //this.loaderService.isLoading.next(false);
                    console.log('error: ', error);
                    // http response status code
                    if (error.status == 401) {
                        this.localStorageService.removeItem(this.localStorageService.tokenKey);
                        this.router.navigateByUrl('/login');
                        // localStorage.removeItem('userToken');
                        // this.router.navigateByUrl('/login');

                    }


                })
            );
        }
    }



}