import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainAnchorCompanyComponent } from './add-edit-company/main-anchor-company/main-anchor-company.component';
import { MainNbfcCompanyComponent } from './add-edit-company/main-nbfc-company/main-nbfc-company.component';
import { CompanyMasterMainListComponent } from './company-master-main-list/company-master-main-list.component';
import { InvoiceFailComponent } from './invoice-fail/invoice-fail.component';
import { StampUploaderComponent } from './stamp-uploader/stamp-uploader.component';
// import { AnchorBusinessloanComponent } from './add-product-type/anchor-products/anchor-businessloan/anchor-businessloan.component';
// import { AnchorCreditlineComponent } from '../admin/company-master/anchor-creditline/anchor-creditline.component';

const routes: Routes = [
  {
    path:"",
    component: CompanyMasterMainListComponent
  },
  {
    path:"add-anchor-company",
    component: MainAnchorCompanyComponent
  },
  {
    path:"add-nbfc-company",
    component: MainNbfcCompanyComponent
  },
  {
    path:"add-nbfc-company/:Id",
    component: MainNbfcCompanyComponent
  },
  // {
  //   path:"business-loan",
  //   component: AnchorBusinessloanComponent
  // },
  // {
  //   path:"credit-line",
  //   component: AnchorCreditlineComponent
  // },
  {
    path:"add-anchor-company/:Id",
    component: MainAnchorCompanyComponent
  },
  {
    path:"invoices",
    component: InvoiceFailComponent
  },
  {
    path:"StampUploader",
    component: StampUploaderComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompaniesMasterRoutingModule { }
