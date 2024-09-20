import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutsRoutingModule } from './layouts-routing.module';
import { RouterModule } from '@angular/router';
// import { FooterComponent } from 'app/shared/footer/footer.component';
import { SharedModule } from 'app/shared/shared.module';
import { SidebarComponent } from 'app/shared/sidebar/sidebar.component';
import { NavbarComponent } from 'app/shared/navbar/navbar.component';
import { FooterComponent } from 'app/shared/footer/footer.component';
import { NotificationSidebarComponent } from 'app/shared/notification-sidebar/notification-sidebar.component';
// import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

@NgModule({
  declarations: [
    // FooterComponent,
    // SidebarComponent,
    // NavbarComponent,
    // FooterComponent,
    // NotificationSidebarComponent,
    
  
    // UnauthorizedComponent
  ],
  imports: [CommonModule, LayoutsRoutingModule, RouterModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // exports:[
  //   SharedModule
  // ]
})
export class LayoutsModule {}
