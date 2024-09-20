import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import {CalendarModule} from 'primeng/calendar';

import { LoanAccountRoutingModule } from './loan-account-routing.module';
import { LoanAccountComponent } from './loan-account/loan-account.component';
import { PaymentLayoutComponent } from './payment-layout/payment-layout.component';
import { ChartModule } from 'primeng/chart';
import { TabViewModule } from 'primeng/tabview';
// import { TransactionDetailComponent } from './Payment-layout-tab/transaction-detail/transaction-detail.component';
// import { OverduePaymentComponent } from './Payment-layout-tab/overdue-payment/overdue-payment.component';
// import { PendingPaymentComponent } from './Payment-layout-tab/pending-payment/pending-payment.component';
// import { DuePaymentComponent } from './Payment-layout-tab/due-payment/due-payment.component';
// import { PaymentRecieptComponent } from './Payment-layout-tab/payment-reciept/payment-reciept.component';
import { BlockUIModule } from 'primeng/blockui';
import { SelectButtonModule } from 'primeng/selectbutton';
import { LoanDetailsComponent } from './loan-details/loan-details.component';
import { ScaleUpSharedModule } from 'app/shared/scale-up-shared/scale-up-shared.module';
// import { InvoiceMasterComponent } from './invoice-master/invoice-master.component';
import { TableModule } from 'primeng/table';
import { BLLoanAccountComponent } from './businessLoan-components/bl-loan-account/bl-loan-account.component';
import { BLPaymentLayoutComponent } from './businessLoan-components/bl-payment-layout/bl-payment-layout.component';
import { BlAccountListComponent } from './businessLoan-components/bl-account-list/bl-account-list.component';
import { AccountListComponent } from './account-list/account-list.component';
import { BlLoanDetailsComponent } from './businessLoan-components/bl-loan-details/bl-loan-details.component';
// import { LoanDetailsComponent } from './loan-details/loan-details.component';

// import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';

@NgModule({
  declarations: [
    LoanAccountComponent,
    PaymentLayoutComponent,
    LoanDetailsComponent,
    BLLoanAccountComponent,
    BLPaymentLayoutComponent,
    BlAccountListComponent,
    AccountListComponent,
    BlLoanDetailsComponent,
    // InvoiceMasterComponent,
    // LoanDetailsComponent,
    // TransactionDetailComponent,
    // OverduePaymentComponent,
    // PendingPaymentComponent,
    // DuePaymentComponent,
    // PaymentRecieptComponent,
    // TransactionDetailComponent
  ],
  imports: [
    CommonModule,
    LoanAccountRoutingModule,
    SharedModule,
    CalendarModule,
    TabViewModule,
    BlockUIModule,
    SelectButtonModule,
    ChartModule,
    ScaleUpSharedModule,
    TableModule,
  ]

})
export class LoanAccountModule { }
