import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyMasterService } from '../services/company-master.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LocalStogareService } from 'app/shared/services/local-storage.service';

@Component({
  selector: 'app-company-master-main-list',
  templateUrl: './company-master-main-list.component.html',
  styleUrls: ['./company-master-main-list.component.scss'],
})
export class CompanyMasterMainListComponent {
  companyList: any[] = [];
  Id: any;
  Loader: boolean = false;
  visible: boolean = false;
  entity: any = 'Companies';
  id: any;
  databaseName: any = 'company';
  Skip: Number = 0;
  Take: Number = 10;
  totalRecords: any;
  CompanyType: string = '';
  keyword: any;
  display: boolean = false;
  first: number = 0;

  constructor(
    private router: Router,
    private companyService: CompanyMasterService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private localstorageService:LocalStogareService
    
  ) {}

  ngOnInit(): void {
    //debugger
    
    // debugger
    const token = localStorage.getItem('CompanyType');
    const companyType =token=='NBFC' ? 'NBFC' : 'Anchor';
    // this.CompanyType = token ? 'NBFC' : 'Anchor';
const keyword = localStorage.getItem('Keyword');
const first = Number(localStorage.getItem('first'));
const skip = Number(localStorage.getItem('Skip'));
const take = Number(localStorage.getItem('Take'));

if (companyType || keyword || first || skip || take) {
  // If CompanyType is present in localStorage, parse and assign it to this.CompanyType
  if (companyType) {
    this.CompanyType = (companyType);
  }
  if (keyword) {
    this.keyword = keyword!="undefined"?keyword:'';
  }
  if (first) {
    this.first =(first);
  }
  if (skip) {
    this.Skip = (skip);
    console.log( 'skip',this.Skip , skip);
    
  }
  if (take) {
    this.Take = (take);
  }

  // Call the getCompanyList method with the parameter isSearch set to false
  localStorage.removeItem('CompanyType')
  localStorage.removeItem('Keyword')
  localStorage.removeItem('first')
  localStorage.removeItem('Skip')

  localStorage.removeItem('Take')
  this.getCompanyList( this.first==1?true:false);

}
  }

  //api start
  load(event: any) {
    debugger
    this.Take = event.rows;
    this.Skip = event.first;
    if(event){
      this.getCompanyList(false);
    }
  }
  getCompanyList(isSearch: boolean) {
    debugger
    let obj = {
      keyword: this.keyword ? this.keyword : null,
      skip: isSearch == false ? this.Skip : 0,
      take: isSearch == false ? this.Take : 10,
      CompanyType: this.CompanyType,
    };
    isSearch == true ? (this.first = 0) : null;

    this.totalRecords = 0;
    this.Loader = true;
    this.companyService.getCompanyList(obj).subscribe(
      (res: any) => {
        // console.log('CompanyList',res);
        this.Loader = false;
        if (res.companylist) {
          this.totalRecords = res.companylist[0].totalRecords;
          console.log(this.totalRecords);

          this.companyList = [];
          res.companylist.forEach((element: any) => {
            // //debugger
            let data = {};
            data = {
              businessName: element.businessName,
              lendingName: element.lendingName,
              gstNumber: element.gstNumber,
              companyId: element.id,
              companyType: element.companyType,
              productId: element.productId,
              IsActive: element.isActive,
              agreementEndDate:
                element.configuration && element.configuration.length > 0
                  ? element.configuration[0].agreementEndDate
                  : '',
              agreementStartDate:
                element.configuration && element.configuration.length > 0
                  ? element.configuration[0].agreementStartDate
                  : '',
              isDefault: element.isDefault,
              companyProductId:
                element.configuration && element.configuration.length > 0
                  ? element.configuration[0].companyProductId
                  : '',

              AddressComplete:
                element.addresses && element.addresses.length > 0
                  ? element.addresses[0].addressComplete
                  : '',
              companyCode: element.companyCode,
              productName:
                element.configuration && element.configuration.length > 0
                  ? element.configuration[0].productName
                  : '',

              agreementUrl:
                element.configuration && element.configuration.length > 0
                  ? element.configuration[0].agreementUrl
                  : '',
            };
            // //debugger
            this.companyList.push(data);
          });
        } else {
          // alert('Data not found');       
          this.companyList=[];   
          this.messageService.add({ severity: 'error', summary: 'Data not found', life: 500 });
          this.keyword=''

        }

        console.log('companylist', this.companyList);
      },
      (error: any) => {
        this.Loader = false;
        // alert(error.error);
        console.log(error);
      }
    );
  }
  onAgreementDownload(e: any) {
    debugger;
    console.log(e);

    window.open(e);
  }
  ActiveInactive(companyId: number, IsActive: boolean, company: any) {
    debugger;
    this.Id = companyId;
    if (IsActive == true) {
      var activeData = 'Active';
    } else {
      activeData = 'InActive';
    }
    this.confirmationService.confirm({
      message:
        'Are you sure want to' + ' ' + activeData + ' ' + 'this '+this.CompanyType+  '?',
      accept: () => {
       // debugger
        this.companyService
          .activeInActiveCompany(this.Id, IsActive)
          .subscribe((x) => {
            if (x.status) {
              if (IsActive == false) {
                // alert('Company InActivated Successfully.'); //  alert(x.Msg);
                // this.messageService.add({ severity: 'Success', summary: 'Company InActivated Successfully.', life: 20000 });
                this.messageService.add({ severity: 'success', summary: 'Company InActivated Successfully.', detail: '' });
              } else {
                // alert('Company Activated Successfully.');
                // this.messageService.add({ severity: 'Success', summary: 'Company Activated Successfully.', life: 20000 });
                this.messageService.add({ severity: 'success', summary: 'Company Activated Successfully.', detail: '' });

                
              }
              localStorage.setItem('CompanyType', this.CompanyType);
              this.ngOnInit();
              // this.ngOnInit();
            } else {
              // alert(x.message);
              // this.messageService.add({ severity: 'Error', summary: x.message, life: 20000 });
              this.messageService.add({ severity: 'error', summary: x.message, detail: '' , life: 1000 });
              localStorage.setItem('CompanyType', this.CompanyType);
              this.ngOnInit();
            }
          });
        },
        
        reject: () => {
          //debugger;
          IsActive = !IsActive;
          company.IsActive = IsActive;
          // Additional handling or message for cancel action
          // alert('Action canceled.');
          this.messageService.add({ severity: 'error', summary:'Action canceled.', life: 1000 });
      },
    });
  }
  //api end

  //miscellaneous

  onHistoryClick(companyId: any) {
    this.id = companyId;
    this.visible = true;
  }
  onClickAddBtn(input: any) {
    debugger;
    if (input == 'nbfc')
      this.router.navigateByUrl('pages/new-company-master/add-nbfc-company');
  }

  onClickAddAnchor() {
    this.router.navigateByUrl('pages/new-company-master/add-anchor-company');
  }

  route(Id: number, input?: any) {
    //debugger;
    // this.router.navigateByUrl('pages/admin/addnewcompany/' + Id);
    localStorage.setItem('CompanyType', this.CompanyType);
    localStorage.setItem('Keyword', this.keyword);
    localStorage.setItem('first', JSON.stringify(this.first));
    localStorage.setItem('Skip', JSON.stringify(this.Skip));
    localStorage.setItem('Take', JSON.stringify(this.Take));

    if (input == 'NBFC') {
      this.router.navigateByUrl(
        'pages/new-company-master/add-nbfc-company/' + Id
      );
    } else {
      this.router.navigateByUrl(
        'pages/new-company-master/add-anchor-company/' + Id
      );
    }


  }

  //end
}
