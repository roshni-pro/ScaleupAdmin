import { Component, OnInit, ElementRef, Renderer2, ViewChild, OnDestroy } from '@angular/core';
import { LayoutService } from '../services/layout.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LocalStogareService } from '../services/local-storage.service';

@Component({
  selector: 'app-notification-sidebar',
  templateUrl: './notification-sidebar.component.html',
  styleUrls: ['./notification-sidebar.component.scss']
})
export class NotificationSidebarComponent implements OnInit, OnDestroy {

  layoutSub: Subscription;
  isOpen = false;
  SuperAdmin : any;

  @ViewChild('sidebar')
  sidebar!: ElementRef;

  ngOnInit() {
    // Role
  }

  constructor(private elRef: ElementRef,
    private renderer: Renderer2,
    private layoutService: LayoutService, private router: Router,
    private localStorageService: LocalStogareService) {
      this.SuperAdmin = this.localStorageService.getItemString('Role');
      // debugger
    this.layoutSub = layoutService.changeEmitted$.subscribe(
      value => {
        if (this.isOpen) {
          this.renderer.removeClass(this.sidebar.nativeElement, 'open');
          this.isOpen = false;
        }
        else {
          this.renderer.addClass(this.sidebar.nativeElement, 'open');
          this.isOpen = true;
        }
      });
  }

  ngOnDestroy() {
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
  }

  onClickCountry() {
    this.router.navigateByUrl('pages/admin/country');
  }
  onClickState() {
    this.router.navigateByUrl('pages/admin/state');
  }
  onClickCity() {
    this.router.navigateByUrl('pages/admin/city');
  }

  onClickActivityMaster() {
    this.router.navigateByUrl('pages/admin/activity-master');
  }

  onClickMaster(type:any) {
    switch (type) {
      case 'Api': {
        this.router.navigateByUrl('pages/admin/api');
        break;
      }
      case 'Document': {
        this.router.navigateByUrl('pages/admin/document');
        break;
      }
      case 'Company': {
        this.router.navigateByUrl('pages/admin/company');
        break;
      }
    }
  }

  onClose() {
    this.renderer.removeClass(this.sidebar.nativeElement, 'open');
    this.isOpen = false;
  }

}
