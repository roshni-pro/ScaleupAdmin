import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanAccountComponent } from './loan-account/loan-account.component';
import { PaymentLayoutComponent } from './payment-layout/payment-layout.component';
import { authGuard } from 'app/shared/auth/auth.guard';
import { LoanDetailsComponent } from './loan-details/loan-details.component';
import { BLLoanAccountComponent } from './businessLoan-components/bl-loan-account/bl-loan-account.component';
import { BLPaymentLayoutComponent } from './businessLoan-components/bl-payment-layout/bl-payment-layout.component';
import { BlAccountListComponent } from './businessLoan-components/bl-account-list/bl-account-list.component';
import { AccountListComponent } from './account-list/account-list.component';
import { BlLoanDetailsComponent } from './businessLoan-components/bl-loan-details/bl-loan-details.component';
// import { BlLeadDetailsComponent } from '../lead/businessLoan-components/bl-lead-details/bl-lead-details.component';
// import { InvoiceMasterComponent } from './invoice-master/invoice-master.component';


const routes: Routes = [
  // {path:'Invoices', component: InvoiceMasterComponent},
  { path: 'loanList', component: LoanAccountComponent, canActivate: [authGuard] },
  { path: 'BL-loanList', component: BLLoanAccountComponent },

  // { path: 'BL-loanList/loan-details/:id', component: LoanDetailsComponent },
  { path: 'AccountList', component: AccountListComponent, canActivate: [authGuard] },
  { path: 'BL-AccountList', component: BlAccountListComponent, canActivate: [authGuard] },
  // { path: 'lead/BL-leads/bl-lead-details', component: BlLeadDetailsComponent, canActivate: [authGuard] },


  { path: 'transaction', component: PaymentLayoutComponent, canActivate: [authGuard] },
  { path: 'transaction', data: { title: 'accountInfo' }, component: PaymentLayoutComponent, canActivate: [authGuard] },
  // { path: 'BL-transaction', component: BLPaymentLayoutComponent,  canActivate: [authGuard]  },
  // { path: 'BL-transaction', data: { title: 'accountInfo' }, component: BLPaymentLayoutComponent, canActivate: [authGuard] },


  // common components
  { path: 'loanList/loan-details/:id', component: LoanDetailsComponent, canActivate: [authGuard] },
  { path: 'loanList/bl-loan-details/:id', component: BlLoanDetailsComponent, canActivate: [authGuard] },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanAccountRoutingModule { }
