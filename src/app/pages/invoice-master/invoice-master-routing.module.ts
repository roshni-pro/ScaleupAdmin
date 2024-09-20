import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceMasterListComponent } from './invoice-master-list/invoice-master-list.component';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
// import { InvoiceRequestComponent } from './invoice-request/invoice-request.component';
import { InvoiceApprovalComponent } from './invoice-approval/invoice-approval.component';
import { InvoiceGenerationComponent } from './invoice-generation/invoice-generation.component';
// import { InvoiceGenerationDetailsComponent } from './invoice-generation-details/invoice-generation-details.component';
// import { InvoiceDocComponent } from './invoice-doc/invoice-doc.component';

const routes: Routes = [
  {
    path: 'invoice-list',
    component: InvoiceMasterListComponent,
  },
  {
    path: 'invoice-list/invoice-details/:invoiceId',
    component: InvoiceDetailsComponent,
  },
  //   {
  //   path:"invoice-request", component: InvoiceRequestComponent
  // } ,
  {
    path: 'invoice-approval',
    component: InvoiceApprovalComponent,
  },
  {
    path:"invoice-generation", component:InvoiceGenerationComponent
  },
  {
    path:"invoice-generation-details", component:InvoiceApprovalComponent
  },
  //{
   // path:"invoice-generation-doc", component:InvoiceDocComponent
  //},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceMasterRoutingModule {}
