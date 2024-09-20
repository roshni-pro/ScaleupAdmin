import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'app/shared/services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserMasterService } from '../../services/user-master.service';
import { ConfirmationService } from 'primeng/api';
import { NbfcTestService } from 'app/pages/nbfc-url/nbfc-test.service';
import { CompanyMasterService } from 'app/pages/companies-master/services/company-master.service';
import { LeadService } from 'app/pages/lead/services/lead.service';
import { ToasterMessageService } from 'app/shared/services/toaster-message.service';

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.scss'],
})
export class UserMasterComponent {
  userList: any[] = [];
  UserMasterDC: any;

  companyIds: any[] = [];
  selectedCompany: any;
  CityList: any;
  Keyword: any = null;
  Loader: boolean = true;

  constructor(
    private router: Router,
    private service: UserMasterService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private nbfcServ: NbfcTestService,
    private leadService: LeadService,
    private toasterService: ToasterMessageService
  ) {
    // this.Loader = true;
    this.UserMasterDC = {
      companyIds: [],
      keyword: null,
      Skip: 0,
      Take: 10,
    };
  }

  Id: any;
  ngOnInit(): void {
    this.Id = this.activatedRoute.snapshot.paramMap.get('Id');
    // this.getUserDetails([]);
    this.getAnchorList();
  }

  navigate() {
    this.router.navigateByUrl('pages/permission/user-master/add-user/' + 0);
  }

  getcompany() {
    //this.selectedCompany
  }

  totalRecords: any;
  load(event: any) {
    this.UserMasterDC.Take = event.rows;
    this.UserMasterDC.Skip = event.first;
    this.search(false);
  }

  search(isSearch: boolean) {
    if (this.selectedCompany != undefined) {
      this.companyIds = [];
      this.selectedCompany.forEach((element: any) => {
        this.companyIds.push(element.id);
      });
    }

    if (isSearch) {
      this.UserMasterDC.Skip = 0;
      this.UserMasterDC.Take = 10;
    }

    this.getUserDetails(this.companyIds);
  }

  getUserDetails(ids: any) {
    this.UserMasterDC.companyIds = ids;
    if (this.Keyword != null) this.UserMasterDC.keyword = this.Keyword;
    else this.UserMasterDC.keyword = null;
    this.userList = [];
    this.Loader = true;
    // this.loader.isLoading(true);
    this.service.GetUserMasterList(this.UserMasterDC).subscribe((res: any) => {
      this.Loader = false;
      // this.loader.isLoading(false);
      if (res.status) {
        this.userList = res.users;
        //this.userlistlength=this.userList.length;
        this.totalRecords = res.users[0].totalRecords;
      } else {
        this.totalRecords = 0;
        // alert("Data Not Found")
        this.toasterService.showError('Data Not Found');
      }
      console.log(this.userList);
    });
  }

  getcompanyDropdown() {
    // this.Loader = true;
    this.service.getCompanyDropdown().subscribe((res: any) => {
      if (res.status) {
        this.CityList = res.returnObject;
        // this.Loader = false;
        console.log('city', res);
      }
    });
  }

  getAnchorList() {
    this.leadService.GetCompanyList().subscribe((res: any) => {
      console.log('nbfc dropdown list', res);
      if (res && res.returnObject) {
        this.CityList = res.returnObject;
        console.log('city', res);
      }
    });
  }

  Edit(company: any) {
    this.router.navigateByUrl(
      'pages/permission/user-master/add-user/' + company.userId
    );
  }

  userId: any;
  IsActive: boolean = false;

  async ActiveInactive(userId: any, IsActive: any, user: any) {
    this.userId = userId;
    if (IsActive == true) {
      var activeData = 'Active';
    } else {
      activeData = 'InActive';
    }
    this.confirmationService.confirm({
      message:
        'Are you sure want to' + ' ' + activeData + ' ' + 'this User?',
      accept: async () => {
        const obj = {
          CompanyId: user.companyId,
          UserId: user.userId,
        };
        let isValid = true;
        if (IsActive) {
          let userrole: any;
          user.userRoles.forEach((element: any) => {
            debugger;
            if (element == 'CompanyAdmin') userrole = true;
          });
          console.log(userrole);
          if (userrole) {
            var res = await this.service
              .CheckCompanyAdminExist(obj)
              .toPromise();
            if (res.status) {
              isValid = false;
            }
          }
        }

        if (isValid) {
          await this.service
            .UserStatus(this.userId, IsActive)
            .subscribe((x) => {
              if (x.status) {
                if (IsActive == false) {
                  this.toasterService.showError(
                    'User InActivated Successfully.'
                  );
                } else {
                  this.toasterService.showSuccess(
                    'User Activated Successfully.'
                  );
                }
                // this.ngOnInit();
                this.ngOnInit();
              } else {
                // alert(x.Msg);
                this.toasterService.showError(x.Msg);
                // this.ngOnInit();
              }
            });
        }
        else{
          this.IsActive = !IsActive;
          user.isActive = this.IsActive;
          this.toasterService.showError(res.message);

        }
      },
      reject: () => {
        this.IsActive = !IsActive;
        user.isActive = this.IsActive;
      },
    });
  }
  loader: boolean = false;
  Forgot(userId: any) {
    //let userId:any
    this.loader = true;
    this.confirmationService.confirm({
      message: 'Are you sure want to reset password',
      accept: () => {
        // this.Loader = true;
        this.service.sendMailForUserPassword(userId).subscribe((res: any) => {
          // this.Loader = false;
          this.loader = false;

          if (res) {
            // alert('Password Send Successfully')
            debugger;
            this.toasterService.showSuccess('Password Send Successfully');
          } else {
            // alert(' Failed to Reset Password');
            this.toasterService.showError(' Failed to Reset Password');
          }
        });
      },
      reject: () => {
        // alert
        this.toasterService.showError('Action cancelled');
      },
    });
  }
}
