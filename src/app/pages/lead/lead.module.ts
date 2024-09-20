import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadRoutingModule } from './lead-routing.module';
import { AadharCardDetailComponent } from './components/aadhar-card-detail/aadhar-card-detail.component';
import { BankDetailsComponent } from './components/bank-details/bank-details.component';
import { BusinessInfoComponent } from './components/business-info/business-info.component';
import { PanDetailsComponent } from './components/pan-details/pan-details.component';
import { PersonalInfoComponent } from './components/personal-info/personal-info.component';
import { MsmeCertificationComponent } from './components/msme-certification/msme-certification.component';
import { KycDetailsComponent } from './components/kyc-details/kyc-details.component';
import { LeadPageComponent } from './components/lead-page/lead-page.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from "@angular/router";
import { ActivityHistoryComponent } from './components/activity-history/activity-history.component';
import { TreeModule } from 'primeng/tree';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { SelfieComponent } from './components/selfie/selfie.component';
import { CalendarModule } from 'primeng/calendar';
import { EmandateComponent } from './components/emandate/emandate.component';
import { CreditBureauComponent } from './components/credit-bureau/credit-bureau.component';
import { ShowOfferComponent } from './components/show-offer/show-offer.component';
import { ViewJsonDataComponent } from './components/view-json-data/view-json-data.component';
import { ViewCibilTableMoreDataComponent } from './components/view-cibil-table-more-data/view-cibil-table-more-data.component';
import { LoanDisbursementComponent } from './components/loan-disbursement/loan-disbursement.component';
import { AgreementComponent } from './components/agreement/agreement.component';
import { DisbursementCompletedComponent } from './components/disbursement-completed/disbursement-completed.component';
import { LeadProfileComponent } from './components/lead-profile/lead-profile.component';
import { PrepareAgreementComponent } from './components/prepare-agreement/prepare-agreement.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { LeadDetailsComponent } from './components/lead-details/lead-details.component';
import { ProfileActivityComponent } from './components/profile-activity/profile-activity.component';
import { ProfileOfferDetailComponent } from './components/profile-offer-detail/profile-offer-detail.component';
import { ScaleUpSharedModule } from 'app/shared/scale-up-shared/scale-up-shared.module';
import { ChartModule } from 'primeng/chart';
import { BLLeadPageComponent } from './businessLoan-components/bl-lead-page/bl-lead-page.component';
import { BlLeadDetailsComponent } from './businessLoan-components/bl-lead-details/bl-lead-details.component';
import { BlLeadProfileComponent } from './businessLoan-components/bl-lead-profile/bl-lead-profile.component';
import { BlProfileOfferDetailComponent } from './businessLoan-components/bl-profile-offer-detail/bl-profile-offer-detail.component';
import { BlKycDetailsComponent } from './businessLoan-components/bl-kyc-details/bl-kyc-details.component';
import { SafeCSSPipe, SafeHTMLPipe, SafeRecourceURLPipe, SafeScriptPipe } from './services/safe-html.pipe';

@NgModule({
  declarations: [
    AadharCardDetailComponent,
    BankDetailsComponent,
    BusinessInfoComponent,
    PanDetailsComponent,
    PersonalInfoComponent,
    MsmeCertificationComponent,
    KycDetailsComponent,
    LeadPageComponent,
    ActivityHistoryComponent,
    SelfieComponent,
    EmandateComponent,
    CreditBureauComponent,
    ShowOfferComponent,
    ViewJsonDataComponent,
    ViewCibilTableMoreDataComponent,
    LoanDisbursementComponent,
    AgreementComponent,
    DisbursementCompletedComponent,
    LeadProfileComponent,
    PrepareAgreementComponent,
    LeadDetailsComponent,
    ProfileActivityComponent,
    ProfileOfferDetailComponent,
    BLLeadPageComponent,
    BlLeadDetailsComponent,
    BlLeadProfileComponent,
    BlProfileOfferDetailComponent,
    BlKycDetailsComponent,
    SafeHTMLPipe,
    SafeCSSPipe,
    SafeScriptPipe,
    SafeRecourceURLPipe
    
  ],
  
  imports: [
    CommonModule,
    LeadRoutingModule,
    SharedModule,
    RouterModule,TreeModule,AccordionModule,BadgeModule,CalendarModule,SelectButtonModule,ScaleUpSharedModule,ChartModule
  ]
})
export class LeadModule { }
