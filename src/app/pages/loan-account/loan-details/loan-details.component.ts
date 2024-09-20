import { Component, OnInit } from '@angular/core';
import { LoanService } from '../services/loan.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LeadService } from '../../lead/services/lead.service';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.scss'],
})
export class LoanDetailsComponent implements OnInit {
  data: any;
  options: any;
  Loader: boolean = false;
  virtualBankDetailPopup: boolean = false;
  transactionList: any[] = [];
  first: number = 0;
  totalrecord: number = 0;
  CommentBlock: boolean = false;

  searchPayload: searchPayload = {
    LoanAccountId: 0,
    SearchKeyward: '',
    status: 'All',
    FromDate: new Date(),
    ToDate: new Date(),
    TabType: '',
    AnchorCompanyId: 0,
    CityName: '',

    Skip: 0,
    Take: 5,
  };

  // loanAccountId: any;

  LoanAccountDetailResponse: LoanAccountDetailResponse = {
    status: '',
    message: '',
    thirdPartyLoanCode: '',
    nbfcIdentificationCode: '',
    loanAccountNumber: '',
    shopName: '',
    userName: '',
    phoneNumber: '',

    userId: '',
    mobileNumber: '',

    cityName: '',
    productType: '',
    loanImage: '',
    isAccountActive: '',
    isBlock: '',
    isBlockComment: '',

    creditLineInfo: {
      totalSanctionedAmount: '',
      totalCreditLimit: '',
      utilizedAmount: '',
      ltdUtilizedAmount: '',
      availableLimit: '',
      availableLimitPercentage: '',
      penalAmount: '',
      processingFee: ''

    },
    repayments: {
      totalPaidAmount: '',
      principalAmount: '',
      interestAmount: '',
      penalInterestAmount: '',
      overdueInterestAmount: '',
      extraPaymentAmount: '',
      bounceRePaymentAmount: '',
    },
    outstanding: {
      totalOutstandingAmount: '',
      principalAmount: '',
      interestAmount: '',
      penalInterestAmount: '',
      overdueInterestAmount: '',
    },
    creditLine: {
      percentage: '',
      utilizedAmount: '',
      totalCreditLimit: '',
    },
    // Transactions: Transaction
  };
  selectedBank: any;

  constructor(
    private apiService: LoanService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService, private router: Router,
    private messageService: MessageService,
    private leadService: LeadService

  ) { }


  ngOnInit() {
    this.searchPayload.LoanAccountId = this.route.snapshot.paramMap.get('id');
    this.virtualDetailPayload.userId = localStorage.getItem("userId");
    this.virtualDetailPayload.leadAccountId = this.searchPayload.LoanAccountId;
    // this.setChartAttributres();
    this.GetLoanAccountDetails();
    // this.getAccountTransaction();
    // await  this.getBankList();
    this.getBankList();

  }

  // selectedBankName: any;
  // async getBankList() {
  //   debugger
  //   let res: any = await this.leadService.GetBankList().toPromise()
  //   if(res && res.liveBankList && res.liveBankList.length>0){
  //       console.log(res, 'banklist');
  //       // this.liveBankList = res.liveBankList
  //       console.log(this.liveBankList, 'this.liveBankList');
  //     }
  // }

  liveBankList: any[] = [];
  getBankList() {
    this.leadService.GetBankList().subscribe((res: any) => {
      console.log(res, 'banklist');
      if (res) {
        this.liveBankList = res.liveBankList
        console.log(this.liveBankList, 'this.liveBankList');
      }
    })
  }

  setChartAttributres() {
    // this.Loader=true;
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      labels: ['Utilized %', 'Available %'],
      datasets: [
        {
          data: [
            this.LoanAccountDetailResponse.creditLine.percentage,
            100 - this.LoanAccountDetailResponse.creditLine.percentage,
          ],
          backgroundColor: [
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--gray-500'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--blue-400'),
            documentStyle.getPropertyValue('--gray-400'),
          ],
        },
      ],
    };

    this.options = {
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
    };
    this.Loader = false;
  }

  virtualDetailPayload: any = {
    "virtualAccountNumber": "",
    "virtualBankName": "",
    "virtualIFSCCode": "",
    "virtualUPIId": "",
    "leadAccountId": 0,
    "userId": ""
  }

  addVirtualDetail() {
    this.GetRepaymentAccountDetailsForAdmin();
    this.virtualBankDetailPopup = true;
  }

  disableVirtualFields: boolean = false;
  GetRepaymentAccountDetailsForAdmin() {
    this.Loader = true;
    this.apiService.GetRepaymentAccountDetailsForAdmin(this.searchPayload.LoanAccountId).subscribe((res: any) => {
      console.log("GetRepaymentAccountDetails", res);
      if (res && res.result) {

        this.virtualDetailPayload.virtualAccountNumber = res.result.virtualAccountNumber;

        this.selectedBank = this.liveBankList.filter(x => x.bankName == res.result.virtualBankName)[0];
        this.virtualDetailPayload.virtualBankName = res.result.virtualBankName;

        this.virtualDetailPayload.virtualIFSCCode = res.result.virtualIFSCCode;

        this.virtualDetailPayload.virtualUPIId = res.result.virtualUPIId;
        if(res.statue == false){
          this.disableVirtualFields = false;
        }else if(res.statue == true){
          this.disableVirtualFields = true;
        }

      } else {
        this.disableVirtualFields = false;
      }
      this.Loader = false;
    }, (err: any) => {
      this.Loader = false;
    })
  }

  toUpperCase() {
    this.virtualDetailPayload.virtualIFSCCode = this.virtualDetailPayload.virtualIFSCCode.toUpperCase();
  }


  addRepaymentAccountDetails() {
    if (this.selectedBank != null) {
      this.virtualDetailPayload.virtualBankName = this.selectedBank.bankName;
    }
    this.apiService.AddRepaymentAccountDetails(this.virtualDetailPayload).subscribe((res: any) => {
      console.log(this.virtualDetailPayload);
      this.messageService.add({ severity: 'success', summary: res.message });
      this.virtualBankDetailPopup = false;
      this.selectedBank = undefined;
      // this.selectedBankName = '';

      this.virtualDetailPayload = {
        "virtualAccountNumber": "",
        "virtualBankName": "",
        "virtualIFSCCode": "",
        "virtualUPIId": "",
      }
      console.log(res);
    }, (err: any) => {
      this.messageService.add({ severity: 'error', summary: "Error API - AddRepaymentAccountDetails" });
    })
  }


  // getAccountTransaction(loadType: any) {
  //   if (loadType == 'search') {
  //     this.searchPayload.Skip = 0;
  //     this.searchPayload.Take = 10;
  //     this.first = 1;
  //   } else {

  //   }


  //     this.searchPayload.FromDate = this.getPreviousMonthDate();
  //     // this.rangeDates[0] = this.searchPayload.FromDate;
  //     this.searchPayload.ToDate = new Date;
  //     // this.rangeDates[1] = this.searchPayload.ToDate;

  //   if (this.searchPayload.status == "Partially Paid") {
  //     this.searchPayload.TabType = 'Partial'
  //   } else {
  //     this.searchPayload.TabType = ''
  //   }

  //   this.Loader = true;
  //   this.loanService.GetInvoiceDetail(this.searchPayload).subscribe((x: any) => {
  //     console.log("transactionList", x);
  //     this.Loader = false;
  //     if (x && x.result.length > 0) {
  //       this.transactionList = x.result;
  //       this.totalrecord = x.result[0].totalCount;
  //     } else {
  //       this.transactionList = [];
  //       this.totalrecord = 0;
  //     }
  //     // localStorage.removeItem('LoanaccountCust');
  //     // localStorage.removeItem('Loanaccountmobile');
  //   }, (err: any) => {
  //     this.Loader = false;
  //     this.transactionList = [];
  //     this.totalrecord = 0;
  //     // alert("Error API - GetAccountTransaction")
  //     this.messageService.add({ severity: 'error', summary: 'Error API - GetInvoiceDetail' });

  //   });
  // }

  GetLoanAccountDetails() {
    this.Loader = true;
    this.apiService
      .GetLoanAccountDetails(this.searchPayload.LoanAccountId)
      .subscribe(
        (res: any) => {
          console.log('GetLoanAccountDetails', res);
          if (res && res.message == 'Data Not Found') {
            this.Loader = false;
            alert(res.message)
          }
          else {
            this.Loader = false;
            this.LoanAccountDetailResponse = res;
            this.setChartAttributres();
          }
        },
        (error: any) => {
          this.Loader = false;
        }
      );
  }

  load(event: any) {
    this.searchPayload.Take = event.rows;
    this.searchPayload.Skip = event.first;
    this.getAccountTransaction();
  }

  topFiveTranx: any[] = [];

  openInvoiceDetail(transaction: any) {
    console.log(transaction);


    let invoiceDetails: any[] = [];
    let tempInvoiceArr: any = localStorage.getItem('invoiceDetails');
    tempInvoiceArr = tempInvoiceArr ? JSON.parse(tempInvoiceArr) : null;
    if (tempInvoiceArr && tempInvoiceArr.length > 0) {
      let isAvailable = tempInvoiceArr.filter((x: any) => x.invoiceId == transaction.invoiceId)[0];
      if (!isAvailable) {
        let invoiceDetail: any = tempInvoiceArr;
        if (invoiceDetail.length > 0) {
          invoiceDetail.push(transaction);
          invoiceDetails = invoiceDetail;
        }
      } else {
        invoiceDetails = tempInvoiceArr;
      }
    } else {
      invoiceDetails = [transaction];
    }


    localStorage.setItem('invoiceDetails', JSON.stringify(invoiceDetails))
    const protocol = window.location.protocol;
    const host = window.location.hostname;
    const port = window.location.port;
    const baseUrl = `${protocol}//${host}`;

    if (port) {
      // `${baseUrl}:${port}`;
      // console.log('baseUrl',baseUrl);

      window.open(`${baseUrl}:${port}` + '/#/pages/invoice-master/invoice-list/invoice-details/' + transaction.invoiceId, '_blank');
    } else {
      window.open(`${baseUrl}` + '/#/pages/invoice-master/invoice-list/invoice-details/' + transaction.invoiceId, '_blank');
    }
  }

  navigateTo(rowData: any) {
    this.router.navigate(["pages/loan-account/loanList/loan-details/" + rowData.loanAccountId]);

    // localStorage.setItem('SearchFilter', JSON.stringify(this.searchFilters));
  }

  getAccountTransaction() {
    // if (loadType == 'search') {
    // this.searchPayload.Skip = 0;
    // this.searchPayload.Take = 100;
    // } else {
    // }

    this.searchPayload.FromDate = this.getPreviousMonthDate();
    this.searchPayload.ToDate = new Date();

    if (this.searchPayload.status == 'Partially Paid') {
      this.searchPayload.TabType = 'Partial';
    } else {
      this.searchPayload.TabType = '';
    }

    // this.Loader = true;
    this.apiService.GetInvoiceDetail(this.searchPayload).subscribe(
      (x: any) => {
        console.log('transactionList', x);
        // this.Loader = false;
        if (x && x.result.length > 0) {
          // if (this.topFiveTranx.length == 0) {
          //   this.topFiveTranx = x.result;
          // }

          this.topFiveTranx = x.result;
          this.transactionList = x.result;
          this.totalrecord = x.result[0].totalCount;
        } else {
          this.transactionList = [];
          this.totalrecord = 0;
        }
      },
      (err: any) => {
        this.Loader = false;
        this.transactionList = [];
        this.totalrecord = 0;
        // alert('Error API - GetAccountTransaction');
        this.messageService.add({ severity: 'error', summary: 'Error API - GetAccountTransaction' });

      }
    );
  }



  getPreviousMonthDate() {
    var now = new Date();
    if (now.getMonth() == 1) {
      var current = new Date(now.getFullYear() - 1, 12, 1);
    } else {
      var current = new Date(now.getFullYear(), 1, 1);
    }
    return current;
  }

  ActiveInactive(event: Event) {
    // debugger
    var message: string;
    if (this.LoanAccountDetailResponse.isAccountActive) {
      message = 'Active';
    } else {
      message = 'InActive';
    }

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      // message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      message: 'Are you sure want to' + ' ' + message + ' ' + 'User' + ' ',
      accept: () => {
        let payload = {
          loanAccountId: this.searchPayload.LoanAccountId,
          IsAccountActive: this.LoanAccountDetailResponse.isAccountActive,
        };
        this.Loader = true;
        this.apiService.ActiveInActiveAccount(payload).subscribe((res: any) => {
          this.Loader = false;
          console.log('ActiveInActiveAccount', res);
          if (res && res.status == true) {
            // alert(res.message);
            this.messageService.add({ severity: 'success', summary: res.message });

            // this.loanAccount.IsAccountActive = this.loanAccount.IsAccountActive;
          } else if (res && res.status == false) {
            // alert(res.message);
            this.messageService.add({ severity: 'error', summary: res.message });

            this.LoanAccountDetailResponse.isAccountActive =
              !this.LoanAccountDetailResponse.isAccountActive;
          } else {
          }
        });
      },
      reject: () => {
        // this.Loader = false;
        this.LoanAccountDetailResponse.isAccountActive =
          !this.LoanAccountDetailResponse.isAccountActive;
      },
    });
  }

  BlockUser() {
    this.LoanAccountDetailResponse.isBlockComment = '';

    if (this.LoanAccountDetailResponse.isBlock == false) {
      this.confirmationService.confirm({
        // target: event.target as EventTarget,
        // message: 'Are you sure that you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: 'none',
        rejectIcon: 'none',
        rejectButtonStyleClass: 'p-button-text',
        message: 'Are you sure want to' + ' ' + 'Unblock' + ' ' + 'User' + ' ',
        accept: () => {
          this.OnBlock('Submit');
        },
        reject: () => {
          this.LoanAccountDetailResponse.isBlock =
            !this.LoanAccountDetailResponse.isBlock;
          // this.loader = false;
          // this.LoanAccountDetailResponse.isAccountActive = !this.LoanAccountDetailResponse.isAccountActive;
        },
      });
    } else {
      this.CommentBlock = true;
    }
    // this._leadService.CustomerBlock(this.loanAccount.LoanAccountId,this.Comment,this.loanAccount.IsBlockHideLimit,this.username).subscribe((res)=>{
    //     console.log(res);
    // })
  }

  OnBlock(status: string) {
    //debugger
    let payload = {
      loanAccountId: this.searchPayload.LoanAccountId,
      comment:
        this.LoanAccountDetailResponse.isBlockComment == '' &&
          !this.CommentBlock
          ? 'blocked'
          : this.LoanAccountDetailResponse.isBlockComment,
      isBlock: this.LoanAccountDetailResponse.isBlock,
    };
    if (
      this.LoanAccountDetailResponse.isBlock &&
      this.CommentBlock &&
      this.LoanAccountDetailResponse.isBlockComment == '' &&
      status != 'Cancel'
    ) {
      // alert('Please add comment!');
      this.messageService.add({ severity: 'error', summary: 'Please add comment!' });
      return;
    }

    if (status == 'Submit') {
      this.Loader = true;
      this.apiService.BlockUnblockAccount(payload).subscribe((res: any) => {

        console.log('block and unblock res', res);
        if (res) {
          this.Loader = false;
          if (res.status) {
            // alert(res.message);
            this.messageService.add({ severity: 'success', summary: res.message });
            this.CommentBlock = false;
          } else {
            // alert(res.message);
            this.messageService.add({ severity: 'error', summary: res.message });
            this.LoanAccountDetailResponse.isBlock =
              !this.LoanAccountDetailResponse.isBlock;
          }
        } else {
          this.Loader = false;
          // alert('Try Again');
          this.messageService.add({ severity: 'error', summary: 'Try Again' });
          this.LoanAccountDetailResponse.isBlock =
            !this.LoanAccountDetailResponse.isBlock;
        }
      });
    } else {
      this.LoanAccountDetailResponse.isBlock =
        !this.LoanAccountDetailResponse.isBlock;
      this.CommentBlock = false;
    }
  }

  notifyAnchor(event: any) {

    this.apiService
      .PostLoanAccountToAnchor(this.searchPayload.LoanAccountId)
      .subscribe((res: any) => {
        console.log('Notify Anchor res - ', res);
        this.Loader = true;
        if (res) {
          this.Loader = false;
          alert(res.message);
          // this.messageService.add({ severity: 'success', summary: res.message });
          // event.preventDefault(); // Prevent the default behavior of the event


        } else {
          this.Loader = false;
          alert('Try Again');
          // this.messageService.add({ severity: 'error', summary: 'Try Again' });
          // event.preventDefault(); // Prevent the default behavior of the event


        }
      });
  }

  isLog: boolean = false;
  LogPayload: any = {
    databaseName: 'loanaccount',
    entityName: 'LoanAccount',
    entityId: 0,
    // skip: 0,
    // take: 10
  };

  openLogs() {
    // this.logList = [];
    this.LogPayload.entityId = this.searchPayload.LoanAccountId;
    this.isLog = true;
  }

  back() {
    this.router.navigateByUrl('pages/loan-account/loanList')
  }
}

interface LoanAccountDetailResponse {
  status: any;
  message: any;
  nbfcIdentificationCode: any,
  thirdPartyLoanCode: any
  loanAccountNumber: any;
  shopName: any;
  userName: any;
  phoneNumber: any;

  userId: any;
  mobileNumber: any;

  cityName: any;
  productType: any;
  loanImage: any;
  isAccountActive: any;
  isBlock: any;
  isBlockComment: any;
  creditLineInfo: creditLineInfo;
  repayments: repayments;
  outstanding: outstanding;
  creditLine: creditLine;
  // Transactions: Transaction[]
}

interface creditLineInfo {
  totalSanctionedAmount: any;
  totalCreditLimit: any;
  utilizedAmount: any;
  ltdUtilizedAmount: any
  availableLimit: any;
  availableLimitPercentage: any;
  penalAmount: any;
  processingFee: any
}

interface repayments {
  totalPaidAmount: any;
  principalAmount: any;
  interestAmount: any;
  penalInterestAmount: any;
  overdueInterestAmount: any;
  extraPaymentAmount: any;
  bounceRePaymentAmount: any;
}

interface outstanding {
  totalOutstandingAmount: any;
  principalAmount: any;
  interestAmount: any;
  penalInterestAmount: any;
  overdueInterestAmount: any;
}

interface creditLine {
  percentage: any;
  utilizedAmount: any;
  totalCreditLimit: any;
}

// class Transaction {
//   TransactionNumber: any;
//   TransactionDate: any;
//   Status: any;
// }

interface searchPayload {
  SearchKeyward: any;
  status: any;
  TabType: string;
  // mobileNo: any;
  // referenceId: any;

  FromDate: Date | any;
  ToDate: Date | any;

  AnchorCompanyId: number;
  CityName: any;

  LoanAccountId: any;

  Skip: number;
  Take: number;
}
