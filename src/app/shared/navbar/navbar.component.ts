import { Component, Output, EventEmitter, OnInit, AfterViewInit, Input } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';

import { LayoutService } from '../services/layout.service';
import { ConfigService } from '../services/config.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStogareService } from '../services/local-storage.service';
import { MegaMenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  currentLang = "en";
  isCss: boolean = false;
  toggleClass = "ft-maximize";
  placement = "bottom-right";
  public isCollapsed = true;
  companyId: any;

  items: any;

  @Input() OpenShowNav: any;
  @Output()
  showNavOption = new EventEmitter<Object>();
  @Output()
  toggleHideSidebar = new EventEmitter<Object>();


  public config: any = {};
  userName: any;
  role: any;

  constructor(private layoutService: LayoutService, private configService: ConfigService
    , private router: Router, private localStorageService: LocalStogareService, private r: ActivatedRoute) {
    // const browserLang: string = translate.getBrowserLang();
    // translate.use(browserLang.match(/en|es|pt|de/) ? browserLang : "en");

  }

  ngOnInit() {
    this.items = [
      {
        icon: 'pi pi-power-off',
        command: () => {
          this.func('Logout');
          // this.messageService.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
        }
      },
      {
        icon: 'pi pi-pencil',
        command: () => {
          this.func('Change Password');

          // this.messageService.add({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
        }
      },
      {
        icon: 'pi pi-user',
        label: 'something',
        command: () => {
          this.func('Profile');
          // this.messageService.add({ severity: 'info', summary: 'Add', detail: 'Data Added' });
        }
      },
      
      
      // {
      //   icon: 'pi pi-upload',
      //   routerLink: ['/fileupload']
      // },
      // {
      //   icon: 'pi pi-external-link',
      //   target: '_blank',
      //   url: 'http://angular.io'
      // }
    ];



    this.config = this.configService.templateConf;
    this.userName = this.localStorageService.getItemString('username');
    // this.role = this.localStorageService.getItemString('Role');
    // this.companyId = this.localStorageService.getItemString('companyId');

    // console.log(this.role);

  }

  ngAfterViewInit() {
    if (this.config.layout.dir) {
      const dir = this.config.layout.dir;
      if (dir === "rtl") {
        this.placement = "bottom-left";
      } else if (dir === "ltr") {
        this.placement = "bottom-right";
      }
    }
  }

  sideBarOpen() {
    this.showNavOption.emit(true);
  }


  // ChangeLanguage(language: string) {
  //   this.translate.use(language);
  // }

  ToggleClass() {
    if (this.toggleClass === "ft-maximize") {
      this.toggleClass = "ft-minimize";
    } else {
      this.toggleClass = "ft-maximize";
    }
  }

  toggleNotificationSidebar() {
    this.layoutService.emitChange(true);
  }

  toggleSidebar() {
    debugger
    const appSidebar = document.getElementsByClassName("app-sidebar")[0];
    if (appSidebar.classList.contains("hide-sidebar")) {
      this.toggleHideSidebar.emit(false);
    } else {
      this.toggleHideSidebar.emit(true);
    }
    this.toggleMenu()
  }
  logout() {
    localStorage.removeItem('clUserToken');
    this.router.navigateByUrl('/login');
  }


  profile(str: string) {
    // debugger
    // this.isCss=!this.isCss
    // let subMenu= document.getElementById("subMenu");
    debugger
    this.isCss = true;
    if (str == 'User') {
      // this.isCss=!this.isCss
      this.isCss = false;
      this.router.navigateByUrl('pages/permission/user-profile')
    }
    if (str == 'Admin') {
      // this.isCss=!this.isCss
      this.isCss = false;
      this.router.navigateByUrl('pages/permission/user-profile')

    }
    if (str == 'SuperAdmin') {
      // this.isCss=!this.isCss
      this.isCss = false;
      this.router.navigateByUrl('pages/profile/HQ-admin-profile')

    }
    if (str == 'ChangePassword') {
      // this.isCss=!this.isCss
      // this.isCss = false;
      this.isCss = false;
      this.router.navigateByUrl('pages/profile/change-password')

    }
    if (str == 'Permissions') {
      // this.isCss=!this.isCss
      this.isCss = false;
      this.router.navigateByUrl('pages/permission/user-permissions')
    }
    if (str == 'Organization') {
      // this.isCss=!this.isCss
      this.isCss = false;
      this.router.navigateByUrl('pages/profile/org-profile')
    }
    if (str == 'Agreement') {
      this.isCss = false;
      this.router.navigateByUrl('pages/profile/view-agreement/' + this.companyId)
    }


  }


  toggleMenu() {
    // debugger
    this.isCss = true;
    // if(this.isCss){
    let subMenu: HTMLElement | null
    subMenu = document.getElementById("subMenu");
    // console.log(subMenu);
    if (subMenu) {
      subMenu.classList.toggle("open-menu");
    }
    // subMenu.classList.add("open-menu");
    // }

  }


  // toggleMenu(){

  //  this.isCss=!this.isCss;
  // }

  isMenu: boolean = false;
  showMenue() {
    this.isMenu = this.isMenu == false ? true : false;
  }

  func(eventStr: string) {
    // console.log(event.target.innerText);
    if (eventStr == 'Logout') {
      this.logout();
    }
    if (eventStr == 'Profile') {
      // this.logout();
      this.router.navigateByUrl('pages/permission/user-profile');
    }
    if (eventStr == 'Change Password') {
      // this.logout();
      this.router.navigateByUrl('pages/admin/reset-password');
    }
    // /login/reset-password
  }

}
