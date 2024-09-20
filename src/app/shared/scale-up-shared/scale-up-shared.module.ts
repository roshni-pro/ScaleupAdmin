import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryComponent } from './components/history/history.component';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
  declarations: [
    HistoryComponent
  ],
  imports: [
    CommonModule,SharedModule
    
  ],
  exports: [
    HistoryComponent
  ]
})
export class ScaleUpSharedModule { }
