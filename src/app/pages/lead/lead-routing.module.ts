import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeadPageComponent } from './components/lead-page/lead-page.component';
import { KycDetailsComponent } from './components/kyc-details/kyc-details.component';
import { ActivityHistoryComponent } from './components/activity-history/activity-history.component';
import { LeadProfileComponent } from './components/lead-profile/lead-profile.component';
import { LeadDetailsComponent } from './components/lead-details/lead-details.component';
import { BLLeadPageComponent } from './businessLoan-components/bl-lead-page/bl-lead-page.component';
import { BlLeadProfileComponent } from './businessLoan-components/bl-lead-profile/bl-lead-profile.component';
import { BlLeadDetailsComponent } from './businessLoan-components/bl-lead-details/bl-lead-details.component';
import { BlKycDetailsComponent } from './businessLoan-components/bl-kyc-details/bl-kyc-details.component';

const routes: Routes = [
  // { path: '', component: LeadPageComponent },
  { path: 'SC-leads', component: LeadPageComponent },
  { path: 'BL-leads', component: BLLeadPageComponent },
  
  { path: 'Kyc-Detail', component: KycDetailsComponent },
  { path: 'SC-leads/Kyc-Detail/:userId/:leadId', component: KycDetailsComponent },
  
  // { path: 'lead-profile', component: LeadProfileComponent },
  
  // { path: 'history', component: ActivityHistoryComponent },
  
  { path: 'SC-leads/sc-lead-details/:userId/:leadId', component: LeadDetailsComponent },
  
  // { path: 'BL-leads/bl-lead-profile', component: BlLeadProfileComponent},
  { path: 'BL-leads/bl-lead-details/:userId/:leadId', component: BlLeadDetailsComponent},
  { path: 'BL-leads/Bl-Kyc-Detail/:userId/:leadId', component: BlKycDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadRoutingModule { }
