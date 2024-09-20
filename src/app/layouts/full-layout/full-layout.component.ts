import { Component, OnInit, ElementRef, Inject, Renderer2, AfterViewInit, ViewChild } from '@angular/core';
import { ConfigService } from 'app/shared/services/config.service'; 
import { DOCUMENT } from '@angular/common';
import { NavigationStart, Router, RouterStateSnapshot, Event as NavigationEvent, RoutesRecognized } from '@angular/router';
import { LoaderService } from 'app/shared/services/loader.service'; 
import { filter, pairwise } from 'rxjs/operators';


@Component({
  selector: 'app-full-layout',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.scss']
})
export class FullLayoutComponent  implements OnInit, AfterViewInit {
  
  @ViewChild('sidebarBgImage')
  sidebarBgImage!: ElementRef;
  @ViewChild('appSidebar')
  appSidebar!: ElementRef;
  @ViewChild('wrapper')
  wrapper!: ElementRef;

  options = {
    direction: 'ltr',
    bgColor: 'black',
    bgImage: 'assets/img/sidebar-bg/01.jpg'
  };
  hideSidebar: boolean = false;
  iscollapsed = false;
  isSidebar_sm = false;
  isSidebar_lg = false;
  bgColor = 'black';
  bgImage = 'assets/img/sidebar-bg/01.jpg';

  public config: any = {};
  isLoading: boolean = false;
  event: any;
  currentURL: any = '';
  showApplication: boolean = false;
  showSquareOpenNav: boolean = false;
  showSideBarContent: boolean = true;
  showLoanAccountApplication: boolean = false;
  showTransaction: boolean = false;
  showFollowUpStatus: boolean = false;
  showDashboard: boolean = false;
  showApprove: boolean = false;
  constructor(private elementRef: ElementRef, private configService: ConfigService,
    @Inject(DOCUMENT) private document: Document, private router: Router,
    private renderer: Renderer2, private loaderService: LoaderService,) {
    //     console.log('yghjghg',router.url);
    //     this.currentURL = window.location.href; 
    //     this.router.events
    // .pipe(filter((e: any) => e instanceof RoutesRecognized),
    //   pairwise()
    // ).subscribe((e: any) => {
    //   console.log('sgsss',e[0].urlAfterRedirects);
    // });
    // this.event
    // =this.router.events
    //     .subscribe(
    //       (event: NavigationEvent) => {
    //         if(event instanceof NavigationStart) {
    //           console.log('currenturl',event.url);
    //         }
    //       });

  }

  token: any;
  ngOnInit() {
    this.token = localStorage.getItem("clUserToken")
    if(!this.token){
      this.router.navigateByUrl("/login")
      return
    }

    //console.log('routename', this.router.url); //  /routename
    let spliturl = this.router.url.split('/');
    //console.log(spliturl[1], spliturl[2], spliturl[3]);

    // if (this.router.url == '/pages/customer/application' || this.router.url.length > 30) {
    if (this.router.url == '/pages/customer/application' || spliturl[3] == 'customerDetail') {
      this.showApplication = true;
      this.showTransaction = false;
      this.showLoanAccountApplication = false;
    }
    if (this.router.url == '/pages/paymentLayout') {
      this.showApplication = false;
      this.showTransaction = true;
      this.showLoanAccountApplication = false;
    }
    if (this.router.url == '/pages/customer/loan-account' || spliturl[3] == 'customerLoanDetail') {
      this.showApplication = false;
      this.showTransaction = false;
      this.showLoanAccountApplication = true;
    }
    this.loaderService.loader.subscribe(x => {
      this.isLoading = x;
    });
    this.config = this.configService.templateConf;
    this.bgColor = this.config.layout.sidebar.backgroundColor;

    if (!this.config.layout.sidebar.backgroundImage) {
      this.bgImage = '';
    }
    else {
      this.bgImage = this.config.layout.sidebar.backgroundImageURL;
    }

    if (this.config.layout.variant === "Transparent") {
      if (this.config.layout.sidebar.backgroundColor.toString().trim() === '') {
        this.bgColor = 'bg-glass-1';
      }
    }
    else {
      if (this.config.layout.sidebar.backgroundColor.toString().trim() === '') {
        this.bgColor = 'black';
      }
    }

    setTimeout(() => {
      if (this.config.layout.sidebar.size === 'sidebar-lg') {
        this.isSidebar_sm = false;
        this.isSidebar_lg = true;
      }
      else if (this.config.layout.sidebar.size === 'sidebar-sm') {
        this.isSidebar_sm = true;
        this.isSidebar_lg = false;
      }
      else {
        this.isSidebar_sm = false;
        this.isSidebar_lg = false;
      }
      this.iscollapsed = this.config.layout.sidebar.collapsed;
    }, 0);
  }

  showOptionMenu(e:any) {
    this.showSideBarContent = true
  }

  sideBarClose() {
    this.showSideBarContent = false;
    this.showSquareOpenNav = true
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.config.layout.dir) {
        this.options.direction = this.config.layout.dir;
      }


      if (this.config.layout.variant === "Dark") {
        this.renderer.addClass(this.document.body, 'layout-dark');
      }
      else if (this.config.layout.variant === "Transparent") {
        this.renderer.addClass(this.document.body, 'layout-dark');
        this.renderer.addClass(this.document.body, 'layout-transparent');
        if (this.config.layout.sidebar.backgroundColor) {
          this.renderer.addClass(this.document.body, this.config.layout.sidebar.backgroundColor);
        }
        else {
          this.renderer.addClass(this.document.body, 'bg-glass-1');
        }
        this.bgColor = 'black';
        this.options.bgColor = 'black';
        this.bgImage = '';
        this.options.bgImage = '';
        this.bgImage = '';
        this.renderer.setAttribute(this.sidebarBgImage.nativeElement, 'style', 'display: none');

      }


    }, 0);

  }


  toggleHideSidebar(event: any): void {
    setTimeout(() => {
      this.hideSidebar = event;
    }, 0);
  }

  getOptions(event:any): void {
    this.options = event;
  }


  // onClickDashboardBtn() {
  //   this.showApplication = false;
  //   this.showTransaction = false;
  //   this.showLoanAccountApplication = false;
  //   this.showFollowUpStatus = false;
  //   this.showApprove = false;
  //   this.showDashboard = true;
  //   this.router.navigate(['pages/dashboard'])
  //     .then(() => {
  //       window.location.reload();
  //     });
  // }
  onClickFollowUpBtn() {
    this.showApplication = false;
    this.showTransaction = false;
    this.showLoanAccountApplication = false;
    this.showFollowUpStatus = true;
    this.showDashboard = false;
    this.showApprove = false;
    this.router.navigateByUrl('pages/customer/followUpStatusData');
  }



}
