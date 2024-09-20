import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateMasterRoutingModule } from './template-master-routing.module';
import { ConnectorAgreementComponent } from './components/connector-agreement/connector-agreement.component';
import { DSAFinalAgreementProperitorshipComponent } from './components/dsa-final-agreement-properitorship/dsa-final-agreement-properitorship.component';


@NgModule({
  declarations: [

  
    ConnectorAgreementComponent,
        DSAFinalAgreementProperitorshipComponent
  ],
  imports: [
    CommonModule,
    TemplateMasterRoutingModule
  ]
})
export class TemplateMasterModule { }
