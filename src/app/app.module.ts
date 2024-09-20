import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { authGuard } from './shared/auth/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './shared/auth/auth.interceptor';
import { AuthService } from './shared/auth/auth.service';
import { SharedModule } from "./shared/shared.module";
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from "@angular/common/http";
import {MultiSelectModule} from 'primeng/multiselect';
import {CardModule} from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';
import { FullLayoutComponent } from './layouts/full-layout/full-layout.component';
import { ImportSharedModule } from './shared/import-shared.module';
import { ScrollerModule } from 'primeng/scroller';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
// import { LoaderInterceptor } from './shared/interceptors/loader.interceptor';
import { LoaderComponent } from './shared/loader/loader.component';
import { ScaleUpSharedModule } from './shared/scale-up-shared/scale-up-shared.module';
// import { ModeDirective } from './shared/directives/mode.directive';
// import { TranslateHttpLoader } from "@ngx-translate/http-loader";
@NgModule({
  declarations: [
    AppComponent,
    ContentLayoutComponent,
    FullLayoutComponent,
    LoaderComponent,
    // ModeDirective

  ],
  imports: [
    BrowserAnimationsModule,ScaleUpSharedModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SharedModule,
    ImportSharedModule,
    HttpClientModule, 
    CardModule,
    MultiSelectModule,
    DropdownModule,ReactiveFormsModule,
    CommonModule, DatePipe,RouterModule,
    ScrollerModule,
    ConfirmDialogModule,DialogModule,
    TableModule,
    PaginatorModule,
  ],
  providers: [
    AuthService,
    authGuard,
    MessageService,
    DatePipe,
    ConfirmationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: LoaderInterceptor,
    //   multi: true
    // }
    { provide: Window, useValue: window }
  ],
  bootstrap: [AppComponent]
})
// export function createTranslateLoader(http: HttpClient) {
//   return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
// }

export class AppModule { }
