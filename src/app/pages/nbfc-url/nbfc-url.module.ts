import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NbfcUrlRoutingModule } from './nbfc-url-routing.module';
import { NbfcUrlTestComponent } from './nbfc-url-test/nbfc-url-test.component';
// import { SharedModule } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [
    NbfcUrlTestComponent
  ],
  imports: [
    CommonModule,
    NbfcUrlRoutingModule,
    SharedModule,
    TableModule,
    DropdownModule,
    FormsModule,
    DialogModule
  ]
})
export class NbfcUrlModule { }
