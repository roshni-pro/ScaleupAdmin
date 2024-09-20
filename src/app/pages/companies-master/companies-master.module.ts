import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompaniesMasterRoutingModule } from './companies-master-routing.module';
import { CompanyMasterMainListComponent } from './company-master-main-list/company-master-main-list.component';
import { MainAnchorCompanyComponent } from './add-edit-company/main-anchor-company/main-anchor-company.component';
import { MainNbfcCompanyComponent } from './add-edit-company/main-nbfc-company/main-nbfc-company.component';
import { AnchorCreditlineComponent } from './add-product-type/anchor-products/anchor-creditline/anchor-creditline.component';
import { AnchorBusinessloanComponent } from './add-product-type/anchor-products/anchor-businessloan/anchor-businessloan.component';
import { NbfcProductComponent } from './add-product-type/nbfc-products/nbfc-product/nbfc-product.component';
import { SharedModule } from 'app/shared/shared.module';
import { ScaleUpSharedModule } from 'app/shared/scale-up-shared/scale-up-shared.module';
import { InvoiceFailComponent } from './invoice-fail/invoice-fail.component';
import { StampUploaderComponent } from './stamp-uploader/stamp-uploader.component';
// import { ModeDirective } from '../../shared/directives/mode.directive';
@NgModule({
  declarations: [
    CompanyMasterMainListComponent,
    MainAnchorCompanyComponent,
    MainNbfcCompanyComponent,
    AnchorCreditlineComponent,
    AnchorBusinessloanComponent,
    NbfcProductComponent,
    InvoiceFailComponent,
    StampUploaderComponent,
   
  ],
  imports: [
    CommonModule,
    SharedModule,
    CompaniesMasterRoutingModule,
    ScaleUpSharedModule,
    
  ],
  exports:[
    
  ]
})
export class CompaniesMasterModule { }
