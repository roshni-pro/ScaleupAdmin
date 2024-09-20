import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { HomeComponent } from './home/home.component';
import { CountryComponent } from './components/country/country.component';
import { SharedModule } from 'app/shared/shared.module';
import { AddCountryComponent } from './components/add-country/add-country.component';
// import { AddCompanyComponent } from './company-master/add-company/add-company.component';
// import { AddCompanyAddressComponent } from './company-master/add-company-address/add-company-address.component';
// import { AddCompanyProductComponent } from './company-master/add-company-product/add-company-product.component';
import { StateComponent } from './components/state/state.component';
import { AddStateComponent } from './components/add-state/add-state.component';
import { CityComponent } from './components/city/city.component';
import { AddCityComponent } from './components/add-city/add-city.component';
// import { AddNewCompanyProductComponent } from './company-master/add-new-company-product/add-new-company-product.component';
// import { CompanyMasterListComponent } from './company-master/company-master-list/company-master-list.component';
// import { SelfConfigurationComponent } from './company-master/self-configuration/self-configuration.component';
// import { AddNewAnchorComponent } from './company-master/add-new-anchor/add-new-anchor.component';
// import { AnchorBasicDetailsComponent } from './company-master/anchor-basic-details/anchor-basic-details.component';
// import { NbfcBasicDetailsComponent } from './company-master/nbfc-basic-details/nbfc-basic-details.component';
// import { ProfileComponent } from './profile/profile.component';
// import { AnchorBusinessLoanComponent } from './company-master/anchor-business-loan/anchor-business-loan.component';
// import { AnchorCreditlineComponent } from './company-master/anchor-creditline/anchor-creditline.component';
import { ScaleUpSharedModule } from 'app/shared/scale-up-shared/scale-up-shared.module';
import { TemplateMasterComponent } from './components/template-master/template-master.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartModule } from 'primeng/chart';
import { HopDashboardComponent } from './hop-dashboard/hop-dashboard.component';
import { ProgressBarModule } from 'primeng/progressbar';
// import { ModeDirective } from '../../shared/directives/mode.directive';
// import { ModeDirective } from './shared/directives/mode.directive';

// import { HopDashboardComponent } from './components/hop-dashboard/hop-dashboard.component';

@NgModule({
  declarations: [
    HomeComponent,

    CountryComponent,
    AddCountryComponent,

    StateComponent,
    AddStateComponent,

    CityComponent,
    AddCityComponent,
    // ModeDirective,
    // AddCompanyComponent,
    // AddCompanyAddressComponent,
    // AddCompanyProductComponent,
    // AddNewCompanyProductComponent,
    // CompanyMasterListComponent,
    // SelfConfigurationComponent,
    // AddNewAnchorComponent,
    // AnchorBasicDetailsComponent,
    // NbfcBasicDetailsComponent,
    // AnchorBusinessLoanComponent,
    // AnchorCreditlineComponent,
    TemplateMasterComponent,
    DashboardComponent,
    HopDashboardComponent,
    // HopDashboardComponent,

    // ProfileComponent
  ],
  imports: [
    CommonModule,
    ProgressBarModule,
    AdminRoutingModule,
    SharedModule,
    ScaleUpSharedModule,
    ChartModule,

  ],
  exports:[
    // ModeDirective,
  ]
})
export class AdminModule {}
