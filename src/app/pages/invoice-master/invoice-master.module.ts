import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceMasterRoutingModule } from './invoice-master-routing.module';
import { InvoiceMasterListComponent } from './invoice-master-list/invoice-master-list.component';
// import { SharedModule } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { TabViewModule } from 'primeng/tabview';
import { BlockUIModule } from 'primeng/blockui';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ChartModule } from 'primeng/chart';
import { ScaleUpSharedModule } from 'app/shared/scale-up-shared/scale-up-shared.module';
// import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'app/shared/shared.module';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
// import { InvoiceRequestComponent } from './invoice-request/invoice-request.component';
import { InvoiceApprovalComponent } from './invoice-approval/invoice-approval.component';
import { InvoiceGenerationComponent } from './invoice-generation/invoice-generation.component';

@NgModule({
  declarations: [
    InvoiceMasterListComponent,
    InvoiceDetailsComponent,
    // InvoiceRequestComponent,
    InvoiceApprovalComponent,
    InvoiceGenerationComponent
  ],
  imports: [
    CommonModule,
    InvoiceMasterRoutingModule,
    // SharedModule,
    SharedModule,
    CalendarModule,
    TabViewModule,
    BlockUIModule,
    SelectButtonModule,
    ChartModule,
    ScaleUpSharedModule,
    TableModule
  ],
  // schemas: [
  //   CUSTOM_ELEMENTS_SCHEMA
  // ],
})
export class InvoiceMasterModule { }
