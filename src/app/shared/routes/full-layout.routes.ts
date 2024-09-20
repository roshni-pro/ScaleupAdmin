import { Routes, RouterModule } from '@angular/router';
import { authGuard } from '../auth/auth.guard';
// import { UnauthorizedComponent } from 'app/layouts/unauthorized/unauthorized.component';

//Route for content layout with sidebar, navbar and footer
export const Full_ROUTES: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import('../../changelog/changelog.module').then(m => m.ChangeLogModule)
  // },


  //   simran
  //   {
  //     path: '',
  //     loadChildren: () => import('../../pages/full-layout-page/full-pages.module').then(m => m.FullPagesModule)
  //   },
  //   simran


  //   {path:'new-transaction', loadChildren: ()=>import('../../pages/new-transaction/new-transaction.module').then(m=>m.NewTransactionModule)},
  //   {
  //     path: 'test',
  //     loadChildren: () => import('../../pages/test/test.module').then(m => m.TestModule)
  //   },



  //   simran
  //   {
  //     path: 'customer',
  //     loadChildren: () => import('../../pages/customer-detail/customer-detail.module').then(m => m.CustomerDetailModule)
  //   },
  //   simran



  //   {
  //     // path: 'paymentLayout/:Id',
  //     path: 'paymentLayout',
  //     loadChildren: () => import('../../pages/transaction-payment-detail/transaction-payment-detail.module').then(m => m.TransactionPaymentDetailModule)
  //   },


  //   simran
  //   {
  //     // path: 'paymentLayout/:Id',
  //     path: 'paymentTransactionLayout',
  //     loadChildren: () => import('../../pages/payment-transaction-history-details/payment-transaction-history-details.module').then(m => m.PaymentTransactionHistoryDetailsModule)
  //   },
  //   {
  //     // path: 'paymentLayout/:Id',
  //     path: 'UPITransaction',
  //     loadChildren: () => import('../../pages/upi-transactions/upi-transactions.module').then(m => m.UPITransactionsModule)
  //   },
  {
    path: 'admin',
    loadChildren: () => import('../../pages/admin/admin.module').then(m => m.AdminModule)
  },

  {
    path: 'permission',
    loadChildren: () => import('../../pages/role-based/role-based.module').then(m => m.RoleBasedModule)
  },

  {
    path: 'lead', loadChildren: () => import('../../pages/lead/lead.module').then(m => m.LeadModule)
  },

  {
    path: 'loan-account', loadChildren: () => import('../../pages/loan-account/loan-account.module').then(m => m.LoanAccountModule)
  },

  {
    path: 'nbfc-url', loadChildren: () => import('../../pages/nbfc-url/nbfc-url.module').then(m => m.NbfcUrlModule)
  },

  {
    path: 'new-company-master', loadChildren: () => import('../../pages/companies-master/companies-master.module').then(m => m.CompaniesMasterModule), canActivate: [authGuard]
  },
  {
    path: 'invoice-master', loadChildren: () => import('../../pages/invoice-master/invoice-master.module').then(m => m.InvoiceMasterModule), canActivate: [authGuard]
  
  },
  {
    path: 'template-master', loadChildren: () => import('../../pages/template-master/template-master.module').then(m => m.TemplateMasterModule), canActivate: [authGuard]
  
  },
  {
    path: 'dsa', loadChildren: () => import('../../pages/dsa/dsa.module').then(m => m.DsaModule), canActivate: [authGuard]
  
  },
  {
    path: 'mis', loadChildren: () => import('../../pages/mis/mis.module').then(m => m.MisModule), canActivate: [authGuard]
  
  },
  //   {
  //     path: 'dashboard',
  //     loadChildren: () => import('../../pages/dashboard/dashboard.module').then(m => m.DashboardModule)
  //   },

  //   {
  //     path: 'UPITransaction',
  //     loadChildren: () => import('../../pages/upi-transactions/upi-transactions.module').then(m => m.UPITransactionsModule)
  //   },
  //   { path: 'profile', loadChildren: () => import('../../pages/profiles/profiles.module').then(m => m.ProfilesModule) },
  //   { path: 'sms', loadChildren: () => import('../../../app/pages/sms-template-master/sms-template-master.module').then(m => m.SmsTemplateMasterModule) },
  //   simran

  { path: '**', redirectTo: 'seller', pathMatch: 'full' }
];
