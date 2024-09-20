import { Component, ViewChild, OnInit } from '@angular/core';
import { LoanService } from '../services/loan.service';
// import { LeadService } from 'app/pages/lead/services/lead.service';
import { Router } from '@angular/router';
import * as moment from "moment";
import { MessageService } from 'primeng/api';
import { ExportService } from 'app/shared/scale-up-shared/services/export.service';

@Component({
  selector: 'app-loan-account',
  templateUrl: './loan-account.component.html',
  styleUrls: ['./loan-account.component.scss'],
})
export class LoanAccountComponent implements OnInit {


  ProductDropdown = [
    // {label:"BusinessLoan", value:0},
    // {label:"CreditLine", value:1}
  ];
  selectedProduct: any;
  Loader: boolean = false;
  statusDropdown = [
    { label: "All", value: -1 },
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
    { label: "Blocked", value: 2 }
  ];
  // selectedstatus: any;
  selectedCity: any;


  cityList: any[] = [];

  selectedDates: any[] = [];

  companyList: any;
  // anchorIds: any[] = [];
  // selectedcompany: any[] = [];
  loanaccountList: any[] = [];

  totalrecord: number = 0;

  // keyword: any = '';
  skip: number = 0;
  take: number = 10;
  isSearch: boolean = false;

  // accountDetailsPopup: boolean = false;

  searchFilters: searchFilters = {
    Keyword: '',
    Skip: 0,
    Take: 10,

    AnchorId: 0,
    FromDate: new Date,
    ToDate: new Date,

    Status: -1, //Active=1/Inactive=0/Blocked=2/All= -1
    CityName: '',
    Min: 0,
    Max: 0,
    "ProductType": "CreditLine" // BusinessLoan / CreditLine
  }



  constructor(
    private loanService: LoanService,
    // private leadService: LeadService,
    private exportService: ExportService,
    private router: Router,
    private messageService: MessageService
  ) {
    // this.searchFilters.ToDate = new Date;
  }

  async ngOnInit() {
    debugger
    var data = localStorage.getItem('SearchFilter');
    if (data !== null) {
      this.searchFilters = JSON.parse(data);
      this.first = this.searchFilters.Skip;

      this.getLoanAccountList(false);
      localStorage.removeItem('SearchFilter')

      // Use parsedData as needed
    }
    await this.GetCompanyList()
    // this.AnchorCityProductList();
    // this.getCompanyList();
  }
  async GetCompanyList() {
    var company = await this.loanService.GetAnchorCompaniesByProduct('CreditLine').toPromise();
    console.log(company, 'company');
    if (company != null && company.status && company.response.length > 0 ) {
        // this.companyData = company.returnObject.filter((y: any) => y.companyType == 'Anchor')
        this.companyList = company.response.filter((y: any) => y.companyType == 'Anchor')
        if (this.companyList.length > 0) {
            this.searchFilters.AnchorId = this.companyList[0].id
        }
    }
}
  clearFilter() {
    this.selectedCity = ''
    this.searchFilters = {
      Keyword: '',
      Skip: 0,
      Take: 10,

      AnchorId: 0,
      FromDate: new Date,
      ToDate: new Date,

      Status: 1, //Active-1/Inactive-0/Blocked-2
      CityName: '',
      Min: 0,
      Max: 0,
      "ProductType": "CreditLine" // BusinessLoan / CreditLine
    }
    this.getLoanAccountList(true);
  }



  //  -----------------------------api section start------------------------------------
  // getCompanyList(){
  //   this.leadService.GetCompanyList().subscribe((x: any) => {
  //     this.companyList = x.returnObject.filter(
  //       (y: any) => y.companyType == 'Anchor'
  //     );
  //     console.log(this.companyList, 'this.companyList');
  //   });
  // }


  async load(event: any) {
    // debugger;
    this.take = event.rows;
    this.skip = event.first;
    await this.GetCompanyList();
    this.getLoanAccountList(false);
  }


  first: number = 0;
  dashStats: any = {
    totalActive: 0,
    totalInActive: 0,
    totalDisbursal: 0
  }


  getLoanAccountList(isSearch: boolean) {

    //debugger;
    // let anchorIds: any[] = [];
    // if (this.selectedcompany) {
    //   this.selectedcompany.forEach((x: any) => {
    //     // debugger;
    //     anchorIds.push(x.id);
    //   });
    // }
    this.loanaccountList = []
    // this.searchFilters.CityName=this.selectedCity?this.selectedCity:''
    this.searchFilters.Skip = isSearch == false ? this.skip : 0;
    this.searchFilters.Take = isSearch == false ? this.take : 10;

    // this.searchFilters.AnchorIds = anchorIds;

    if (this.selectedDates && this.selectedDates.length == 2) {
      this.searchFilters.FromDate = moment(this.selectedDates[0]).format('YYYY-MM-DD');
      this.searchFilters.ToDate = this.selectedDates[1] ? moment(this.selectedDates[1]).format('YYYY-MM-DD') : this.searchFilters.FromDate;

      // this.searchFilters.ToDate = moment(this.selectedDates[1]).format('YYYY-MM-DD') ;
    } else {
      this.searchFilters.FromDate = this.getPreviousMonthDate();
      this.selectedDates[0] = this.searchFilters.FromDate;
      this.searchFilters.ToDate = new Date;
      this.selectedDates[1] = this.searchFilters.ToDate;
    }

    if (this.searchFilters.Max > 0 && this.searchFilters.Min >= 0) {
      if (this.searchFilters.Min >= this.searchFilters.Max) {
        // alert("Min Avail. Credit Limit cannot be greater than Max Avail. Credit Limit");
        this.messageService.add({ severity: 'error', summary: 'Min Avail. Credit Limit cannot be greater than Max Avail. Credit Limit' });

        this.searchFilters.Min = 0;
        this.searchFilters.Max = 0;
      }
    }
    this.searchFilters.Min = this.searchFilters.Min == null ? 0 : this.searchFilters.Min;
    this.searchFilters.Max = this.searchFilters.Max == null ? 0 : this.searchFilters.Max;

    isSearch == true ? (this.first = 1) : null;
    this.totalrecord = 0;
    // this.searchFilters.ProductType = 2; // beacause its a Supply Chain page only
    if (this.searchFilters.AnchorId != 0) {
      this.Loader = true;
      this.loanService.GetLoanAccountList(this.searchFilters).subscribe((x: any) => {
        // debugger;
        console.log(x, 'loanaccountList');
        if (x && x.result.length > 0) {
          this.loanaccountList = x.result;
          this.totalrecord = x.result[0].totalCount;
          this.dashStats.totalActive = x.result[0].totalActive ? x.result[0].totalActive : 0;
          this.dashStats.totalInActive = x.result[0].totalInActive ? x.result[0].totalInActive : 0;
          this.dashStats.totalDisbursal = x.result[0].totalDisbursal ? x.result[0].totalDisbursal : 0;
        } else {
          this.loanaccountList = [];
          this.totalrecord = 0;
          this.dashStats.totalActive = 0;
          this.dashStats.totalInActive = 0;
          this.dashStats.totalDisbursal = 0;
        }
        this.Loader = false;
      },(err: any)=>{
        console.log(err);
        this.Loader = false;
      });
    }

  }

  getLoanAccountListExport() {
    this.loanService.GetLoanAccountListExport(this.searchFilters).subscribe((x: any) => {
      if (x && x.result.length > 0) {
        this.onexport(x.result)
      }
    });
  }

  onexport(expData: any) {
    expData.forEach((element: any) => {
      element.agreementRenewalDate = element.agreementRenewalDate == "1900-01-01T00:00:00" ? '-' : element.agreementRenewalDate;
      element.applicationDate = element.applicationDate == "1900-01-01T00:00:00" ? '-' : element.applicationDate;
      element.disbursalDate = element.disbursalDate == "1900-01-01T00:00:00" ? '-' : element.disbursalDate;
    });

    const filterList = expData.map((item: any) => {
      const { leadId, productId, userId, leadCode, nbfcCompanyId, anchorCompanyId, applicationDate, totalCount, totalDisbursal, totalInActive, totalActive, isBlock, accountStatus, nbfcIdentificationCode, ...rest } = item;
      return rest;
    }
    );
    this.exportService.exportAsExcelFile(filterList, "Loan List");
  }

  getPreviousMonthDate() {
    var now = new Date();
    if (now.getMonth() == 1) {
      var current = new Date(now.getFullYear() - 1, 12, 1);
    } else {
      var current = new Date(now.getFullYear(), 1, 1);
    };
    return current
  }

  // getCityNameList() {
  //   this.loanService.GetCityNameList().subscribe((x: any) => {
  //     console.log("city list", x);
  //     if(x && x.result.length>0){
  //       this.cityList = x.result;
  //     }else{
  //       this.cityList = [];
  //     }
  //   });
  // }

  AnchorCityProductList() {
    this.loanService.AnchorCityProductList().subscribe((x: any) => {
      console.log("city list", x);
      if (x && x.result) {
        this.cityList = x.result.cityNameDcs && x.result.cityNameDcs.length > 0 ? x.result.cityNameDcs : [];
        this.ProductDropdown = x.result.productDcs && x.result.productDcs.length > 0 ? x.result.productDcs : [];;
        this.companyList = x.result.anchorNameDcs && x.result.anchorNameDcs.length > 0 ? x.result.anchorNameDcs : [];;
      } else {
        this.cityList = [];
        this.ProductDropdown = [];
        this.companyList = [];
      }
    });
  }
  //  -----------------------------api section end------------------------------------


  // --------------------misc fn start ---------------------------------
  gotoTransactionPage(rowdata: any) {
    localStorage.setItem('Loanaccountmobile', rowdata.mobileNo)
    localStorage.setItem('LoanaccountCust', rowdata.customerName)
    this.router.navigate(['pages/loan-account/transaction'], {
    }).then(result => { window.location.href });;
  }

  // --------------------misc fn end ---------------------------------
  calcMinMax() {

  }

  navigateTo(rowData: any) {



    // this.router.navigate(["pages/loan-account/loanList/loan-details/" + rowData.loanAccountId]);
    // localStorage.setItem('SearchFilter', JSON.stringify(this.searchFilters));
    const protocol = window.location.protocol;
    const host = window.location.hostname;
    const port = window.location.port;
    const baseUrl = `${protocol}//${host}`;

    if (port) {
      // `${baseUrl}:${port}`;
      // console.log('baseUrl',baseUrl);
      // window.open(`${baseUrl}:${port}` + '/#/pages/invoice-master/invoice-list/invoice-details/' + transaction.invoiceId, '_blank');
      window.open(`${baseUrl}:${port}` + '/#/pages/loan-account/loanList/loan-details/' + rowData.loanAccountId, '_blank');
    } else {
      // window.open(`${baseUrl}` + '/#/pages/invoice-master/invoice-list/invoice-details/' + transaction.invoiceId, '_blank');
      window.open(`${baseUrl}` + '/#/pages/loan-account/loanList/loan-details/' + rowData.loanAccountId, '_blank');
    }
  }

}


interface searchFilters {
  AnchorId: any,
  Keyword: string,
  ProductType: string // BusinessLoan / CreditLine
  FromDate: Date | null | any//
  ToDate: Date | null | any// 
  Status: number //Active/Inactive/Blocked
  CityName: string //
  Min: number
  Max: number
  Skip: number,
  Take: number,
}
