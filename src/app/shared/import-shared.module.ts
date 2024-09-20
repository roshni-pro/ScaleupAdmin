import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {BlockUIModule} from 'primeng/blockui';
import {CalendarModule} from 'primeng/calendar';
import {InputSwitchModule} from 'primeng/inputswitch';
import {CheckboxModule} from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import {InputNumberModule} from 'primeng/inputnumber';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ConfirmDialogModule,
    BlockUIModule,
    CalendarModule,
    InputSwitchModule,
    CheckboxModule,
    TooltipModule,
    InputNumberModule
  ],
  exports:[
    FormsModule,
    BlockUIModule,
    CalendarModule,
    InputSwitchModule,
    DialogModule,
    ConfirmDialogModule,
    CheckboxModule,
    TooltipModule,
    InputNumberModule
  ]
})
export class ImportSharedModule { }
