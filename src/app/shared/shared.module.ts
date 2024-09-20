import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { SharedRoutingModule } from './shared-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { NotificationSidebarComponent } from './notification-sidebar/notification-sidebar.component';
import { CheckboxModule } from 'primeng/checkbox';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import { AccordionModule } from 'primeng/accordion';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
// import {ConfirmationService} from 'primeng/api';
import {BlockUIModule} from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from "primeng/paginator"; 
import { TabViewModule } from 'primeng/tabview';
import { MultiSelectModule } from 'primeng/multiselect';
import { MegaMenuModule } from 'primeng/megamenu';
import { CalendarModule } from 'primeng/calendar';
import { SpeedDialModule } from 'primeng/speeddial';
import { SliderModule } from 'primeng/slider';
import { DatePipe } from '@angular/common';
import { ModeDirective } from './directives/mode.directive';
@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
    NotificationSidebarComponent,
    ModeDirective
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    ConfirmDialogModule,
    ToastModule,
    CardModule,
    PaginatorModule,
    MultiSelectModule,
    MegaMenuModule,
    ProgressSpinnerModule,
    CalendarModule,
    SpeedDialModule,
    SliderModule
  ],
  exports:[
    InputSwitchModule,
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
    NotificationSidebarComponent,
    ButtonModule,
    TableModule,
    DropdownModule,
    AccordionModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    ConfirmDialogModule,
    CardModule,
    CheckboxModule,
    DialogModule,
    PaginatorModule,
    TabViewModule,
    MultiSelectModule,
    MegaMenuModule,
    ProgressSpinnerModule,
    CalendarModule,
    SpeedDialModule,
    SliderModule,
    DatePipe,
    ModeDirective
  ]
})
export class SharedModule { }
