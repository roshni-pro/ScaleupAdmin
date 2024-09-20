import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CountryComponent } from './components/country/country.component';
import { AddCountryComponent } from './components/add-country/add-country.component';
// import { AddCompanyComponent } from './company-master/add-company/add-company.component';
// import { AddCompanyAddressComponent } from './company-master/add-company-address/add-company-address.component';
// import { AddCompanyProductComponent } from './company-master/add-company-product/add-company-product.component';
import { StateComponent } from './components/state/state.component';
import { AddStateComponent } from './components/add-state/add-state.component';
import { AddCityComponent } from './components/add-city/add-city.component';
import { CityComponent } from './components/city/city.component';
// import { AddNewCompanyProductComponent } from './company-master/add-new-company-product/add-new-company-product.component';
// import { CompanyMasterListComponent } from './company-master/company-master-list/company-master-list.component';
// import { SelfConfigurationComponent } from './company-master/self-configuration/self-configuration.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
// import { AddNewAnchorComponent } from './company-master/add-new-anchor/add-new-anchor.component';
// import { AnchorBasicDetailsComponent } from './company-master/anchor-basic-details/anchor-basic-details.component';
// import { NbfcBasicDetailsComponent } from './company-master/nbfc-basic-details/nbfc-basic-details.component';
// import { AnchorBusinessLoanComponent } from './company-master/anchor-business-loan/anchor-business-loan.component';
// import { AnchorCreditlineComponent } from './company-master/anchor-creditline/anchor-creditline.component';
import { authGuard } from 'app/shared/auth/auth.guard';

import { TemplateMasterComponent } from './components/template-master/template-master.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HopDashboardComponent } from './hop-dashboard/hop-dashboard.component';
const routes: Routes = [

  // ----------welcome routing start------------------------------
  { path: 'welcome', component: HomeComponent},
  { path: 'welcome/dashboard', component: DashboardComponent},
  { path: 'hop-dashboard', component: HopDashboardComponent},
  // ----------welcome routing end------------------------------



  // ----------location routing start------------------------------
  { path: 'country', component: CountryComponent, canActivate: [authGuard]},
  { path: 'country/addcountry', component: AddCountryComponent, canActivate: [authGuard]},
  { path: 'country/addcountry/:Id', component: AddCountryComponent,canActivate: [authGuard] },
  
  { path: 'state', component: StateComponent,canActivate: [authGuard] },
  { path: 'state/addstate', component: AddStateComponent,canActivate: [authGuard] },
  { path: 'state/addstate/:Id', component: AddStateComponent,canActivate: [authGuard] },

  { path: 'city', component: CityComponent,canActivate: [authGuard] },
  { path: 'city/addcity', component: AddCityComponent,canActivate: [authGuard] },
  { path: 'city/addcity/:Id', component: AddCityComponent,canActivate: [authGuard] },
  // ----------location routing end------------------------------



  // ----------company routing start------------------------------
  // { path: 'addnewcompany', component: AddCompanyComponent }, //
  // { path: 'addnewcompany/:Id', component: AddCompanyComponent },  //edit
  // { path: 'add-company-address', component: AddCompanyAddressComponent },
  // { path: 'add-company-product', component: AddCompanyProductComponent },
  // { path: 'anchorBasicDetails', component: AnchorBasicDetailsComponent },
  // { path: 'anchorBasicDetails/:Id', component: AnchorBasicDetailsComponent },
  // { path: 'add-company-address/:Id/:IsAnchor', component:AddCompanyAddressComponent}, //add /edit
  // { path: 'add-company-product/:Id/:IsAnchor',component:AddCompanyProductComponent}, //get page
  // {path: 'add-new-product/:Id/:IsAnchor',component:AddNewCompanyProductComponent},//add
  // {path: 'add-new-product/:Id/:Id2/:IsAnchor',component:AddNewCompanyProductComponent}, //edit
  // { path: 'company-master', component: CompanyMasterListComponent },
  // { path: 'self-config', component: SelfConfigurationComponent },
  // { path: 'anchor-creditLine', component: AnchorCreditlineComponent },
  // { path: 'anchor-businessloan', component: AnchorBusinessLoanComponent },
  // { path: 'self-config', data: { title: 'company self config' }, component: SelfConfigurationComponent },
  // { path: 'add-company-address', data: { title: 'company address' }, component: AddCompanyAddressComponent },
  // { path: 'add-company-product', data: { title: 'company product' }, component: AddCompanyProductComponent }, //get page
  // { path: 'add-new-product', data: { title: 'company new product' }, component: AddNewCompanyProductComponent },//NBFC
  // { path: 'add-new-Anchor', data: { title: 'company new Anchor' }, component: AddNewAnchorComponent },//anchor
  // { path: 'add-nbfc-basic', component: NbfcBasicDetailsComponent },//anchor
  // { path: 'add-nbfc-basic/:Id', component: NbfcBasicDetailsComponent },//anchor
  // ----------company routing end------------------------------



  { path: 'reset-password', component: ResetPasswordComponent },
  {path: 'TemplateMaster', component: TemplateMasterComponent},
  // company-master role-pagepermission
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
  
 }
