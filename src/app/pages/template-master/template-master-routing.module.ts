import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceDocComponent } from './components/invoice-doc/invoice-doc.component';
import { ConnectorAgreementComponent } from './components/connector-agreement/connector-agreement.component';
import { DSAFinalAgreementProperitorshipComponent } from './components/dsa-final-agreement-properitorship/dsa-final-agreement-properitorship.component';

const routes: Routes = [
  {path:'invoice-doc',component:InvoiceDocComponent},
  {path:'Connector-Agreement',component:ConnectorAgreementComponent},
  {path:'DSA-Agreement-Properitorship',component:DSAFinalAgreementProperitorshipComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplateMasterRoutingModule { }
