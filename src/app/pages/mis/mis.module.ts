import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MisRoutingModule } from './mis-routing.module';
import { MisGenerationComponent } from './components/mis-generation/mis-generation.component';
import { SharedModule } from 'app/shared/shared.module';
import { ScaleUpSharedModule } from 'app/shared/scale-up-shared/scale-up-shared.module';


@NgModule({
  declarations: [
    MisGenerationComponent
  ],
  imports: [
    CommonModule,
    MisRoutingModule,
    SharedModule,
    ScaleUpSharedModule
  ]
})
export class MisModule { }
