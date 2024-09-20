import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  AfterViewInit,
} from '@angular/core';
import { RouteInfo } from './sidebar.metadata';
import { ROUTES } from './sidebar-routes.config';
import { Router, ActivatedRoute } from '@angular/router';
import { customAnimations } from '../animations/custom-animations';
// import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from '../services/config.service';
import { LoaderService } from '../services/loader.service';
import { LocalStogareService } from '../services/local-storage.service';
import { SidebarService } from '../services/sidebar.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: customAnimations,
})
export class SidebarComponent implements OnInit, AfterViewInit {
  @ViewChild('toggleIcon')
  toggleIcon!: ElementRef;
  userName: any = '';
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute,
    // public translate: TranslateService,
    private configService: ConfigService,
    private loaderService: LoaderService,
    private localStorageService: LocalStogareService,
    private SidebarService: SidebarService
  ) {

  }

  fieldsToCheck = ['isAdd', 'isAll', 'isDelete', 'isEdit', 'isView', 'isMaster'];
  public menuItemlist: any[] = [];
  ngOnInit() {
    // debugger
    this.userName = this.localStorageService.getItemString('username');
    this.SidebarService.GetUsersRolesPages(this.userName).subscribe((res: any) => {
      console.log('getAllPagePermission: ', res);
      res.returnObject.sort((a: any, b: any) => a.Sequence - b.Sequence);
      // debugger
      localStorage.setItem('PagePermission', JSON.stringify(res.returnObject))

      if (res.returnObject && res.returnObject.length > 0) {
        res.returnObject.forEach((item: any) => {
          if (item.ParentId == null || item.ParentId == 0) {

            let module: RouteInfo = {
              badge: '',
              badgeClass: '',
              class: '',
              icon: item.className,
              isExternalLink: false,
              path: item.routeName,
              submenu: this.checkSubMenu(item.subPageMaster),
              title: item.pageName,
              permissions: this.assignPermissionsToList(item)
            };
            this.menuItemlist.push(module);
          }
        })
        console.log("list", this.menuItemlist);
      }
    })
  }

  toggleSubMenu(menu: any) {

    this.menuItemlist.forEach((element: any) => {
      if (menu != element) {
        element.showSubMenu = false;
      }
    });

    if (menu.submenu.length != 0) {
      menu.showSubMenu = !menu.showSubMenu;
    }

  }

  checkSubMenu(subMenuItem: any[] | null) {
    let returnList: any[] = [];
    if (subMenuItem) {
      subMenuItem.forEach((element: any) => {
        let module: RouteInfo = {
          badge: '',
          badgeClass: '',
          class: '',
          icon: element.className,
          isExternalLink: false,
          path: element.routeName,
          submenu: [],
          title: element.pageName,
          permissions: this.assignPermissionsToList(element)
        };
        returnList.push(module);
      });
      return returnList;
    } else {
      return []
    }
  }

  setPermissions(item: any) {
    localStorage.removeItem("current-page-permissions");
    let x = item.permissions.toString();
    localStorage.setItem("current-page-permissions", x);
  }

  assignPermissionsToList(item: any) {
    let permissions: string[] = [];

    if (item.isAdd == true) {
      permissions.push('add');
    }
    if (item.isAll == true) {
      permissions.push('all');
    }
    if (item.isDelete == true) {
      permissions.push('delete');
    }
    if (item.isEdit == true) {
      permissions.push('edit');
    }
    if (item.isView == true) {
      permissions.push('view');
    }
    if (item.isMaster == true) {
      permissions.push('master');
    }

    return permissions;
  }

  ngAfterViewInit() {

  }


}

interface submenuList {
  className: string;

  isAdd: boolean;
  isAll: boolean;
  isDelete: boolean;
  isEdit: boolean;

  isMaster: boolean;
  isView: boolean;

  pageMasterId: number;
  pageName: string;
  parentId: number;
  routeName: string;
  sequence: number;
  subPageMaster: any;
}
