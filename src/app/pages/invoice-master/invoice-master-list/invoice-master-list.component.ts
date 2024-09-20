import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import { LoanService } from '../';
import { ActivatedRoute, Router } from '@angular/router';
// import { LoanService } from 'app/pages/loan-account/services/loan.service';
import { LoanService } from '../../loan-account/services/loan.service';
// import { environment } from 'environments/environment';
// import { skip } from 'rxjs';
import { ExportService } from '../../../shared/scale-up-shared/services/export.service';
// import { ExportService } from 'app/shared/scale-up-shared/services/export.service';
import * as moment from "moment";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-invoice-master-list',
  templateUrl: './invoice-master-list.component.html',
  styleUrls: ['./invoice-master-list.component.scss']
})

export class InvoiceMasterListComponent {


  @ViewChild('sellerOfferCalendar') sellerOfferCalendar: any;
  @Input() accountInfo: any;


  totalrecord: number = 0;
  searchPayload: searchPayload = {
    LoanAccountId: 0,
    // // customerName: '',
    // status: 'All',
    // // referenceId: '',
    // // mobileNo: '',
    // cityname: '',
    // anchorCompanyId: 0,
    // skip: 0,
    // take: 10,

    SearchKeyward: '',
    status: 'All',
    FromDate: new Date,
    ToDate: new Date,
    TabType: '',
    AnchorCompanyId: 0,
    CityName: '',

    Skip: 0,
    Take: 10
  };



  paymentStatusList = [
    { value: 'All', label: 'All' },
    { value: 'Initiate', label: 'Initiate' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Created', label: 'Created' },
    { value: 'Disbursed', label: 'Disbursed' },
    { value: 'Due', label: 'Due' },
    { value: 'Overdue', label: 'Overdue' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Partial', label: 'Partial Paid' },
    { value: 'Delinquent', label: 'Delinquent' },
  ];

  modeOfPaymentList = [
    { value: 'NEFT', label: 'NEFT' },
    { value: 'UPI', label: 'UPI' },
    { value: 'MUPI', label: 'MUPI' },
    { value: 'Cash', label: 'Cash' },
    { value: 'cheque', label: 'Cheque' },
  ];
  // selectedModeOfPaymentList: any;

  Loader: boolean = false;
  rangeDates: Date[] = [];
  public dateFormat: string = 'dd/mm/yy';
  transactionList: any[] = [];
  filteredTransactionList: any[] = [];
  selectedTabIndex: any;
  pendingDetailList = [];
  accInfo: any;
  mobileNo: any;
  customerName: any;
  transactionpoupdisplay: any;
  txnDetailList: any[] = [];
  first: any;

  manualSettlePayload: manualSettlePayload = {
    TransactionNo: '',
    ModeOfPaymentSourceType: '',
    SettleAmount: 0,
    username: '',
    PaymentRefNo: '',
    PaymentDate: null
  }

  constructor(
    private loanService: LoanService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private exportService: ExportService,
    private messageService: MessageService
  ) {

    this.searchPayload.SearchKeyward = localStorage.getItem('Loanaccountmobile') ? localStorage.getItem('Loanaccountmobile') : '';
  }

  ngOnInit() {
    // this.searchPayload.customerName = localStorage.getItem('LoanaccountCust') ? localStorage.getItem('LoanaccountCust') : '';
    // this.searchPayload.SearchKeyward = localStorage.getItem('Loanaccountmobile') ? localStorage.getItem('Loanaccountmobile') : '';
    this.first = 0;
    this.manualSettlepopup = false;
    this.showWaivePop = false;
    this.transactionpoupdisplay = false;
    // this.getAnchorNameList();
    // this.getCityNameList();
    this.AnchorCityProductList()
  }

  // -------------------------------------------------------apis start----------------------------------------------
  anchorList: any[] = [];
  cityList: any = ([] = []);
  selectedCity: any;
  selectedAnchor: any;
  getAnchorNameList() {
    this.loanService.GetAnchorNameList().subscribe((x: any) => {
      this.anchorList = x.result;
    });
  }

  AnchorCityProductList() {
    this.loanService.AnchorCityProductList().subscribe((x: any) => {
      console.log("city list", x);
      if (x && x.result) {
        this.cityList = x.result.cityNameDcs && x.result.cityNameDcs.length > 0 ? x.result.cityNameDcs : [];
        // this.ProductDropdown = x.result.productDcs && x.result.productDcs.length>0 ? x.result.productDcs : [];;
        this.anchorList = x.result.anchorNameDcs && x.result.anchorNameDcs.length > 0 ? x.result.anchorNameDcs : [];;
      } else {
        this.cityList = [];
        // this.ProductDropdown = [];
        this.anchorList = [];
      }
    });
  }

  getCityNameList() {
    this.loanService.GetCityNameList().subscribe((x: any) => {
      this.cityList = x.result;
    });
  }

  load(event: any) {
    this.searchPayload.Take = event.rows;
    this.searchPayload.Skip = event.first;
    this.getAccountTransaction('load');
  }

  getAccountTransaction(loadType: any) {
    if (loadType == 'search') {
      this.searchPayload.Skip = 0;
      this.searchPayload.Take = 10;
      this.first = 1;
    } else {

    }

    if (this.rangeDates && this.rangeDates.length == 2) {
      this.searchPayload.FromDate = moment(this.rangeDates[0]).format('YYYY-MM-DD');
      this.searchPayload.ToDate = this.rangeDates[1] ? moment(this.rangeDates[1]).format('YYYY-MM-DD') : this.searchPayload.FromDate;
      // this.searchPayload.ToDate =  moment(this.rangeDates[1]).format('YYYY-MM-DD');
    } else {
      this.searchPayload.FromDate = this.getPreviousMonthDate();
      // this.rangeDates[0] = this.searchPayload.FromDate;
      this.searchPayload.ToDate = new Date;
      // this.rangeDates[1] = this.searchPayload.ToDate;
    }

    if (this.searchPayload.status == "Partially Paid") {
      this.searchPayload.TabType = 'Partial'
    } else {
      this.searchPayload.TabType = ''
    }

    this.Loader = true;
    this.loanService.GetInvoiceDetail(this.searchPayload).subscribe((x: any) => {
      console.log("transactionList", x);
      this.Loader = false;
      if (x && x.result.length > 0) {
        this.transactionList = x.result;
        this.totalrecord = x.result[0].totalCount;
      } else {
        this.transactionList = [];
        this.totalrecord = 0;
      }
      // localStorage.removeItem('LoanaccountCust');
      // localStorage.removeItem('Loanaccountmobile');
    }, (err: any) => {
      this.Loader = false;
      this.transactionList = [];
      this.totalrecord = 0;
      // alert("Error API - GetAccountTransaction")
      this.messageService.add({ severity: 'error', summary: 'Error API - GetInvoiceDetail' });

    });
  }

  GetInvoiceDetailExport() {

    if (this.rangeDates && this.rangeDates.length == 2) {
      this.searchPayload.FromDate = moment(this.rangeDates[0]).format('YYYY-MM-DD');
      this.searchPayload.ToDate = this.rangeDates[1] ? moment(this.rangeDates[1]).format('YYYY-MM-DD') : this.searchPayload.FromDate;
      // this.searchPayload.ToDate =  moment(this.rangeDates[1]).format('YYYY-MM-DD');
    } else {
      this.searchPayload.FromDate = this.getPreviousMonthDate();
      // this.rangeDates[0] = this.searchPayload.FromDate;
      this.searchPayload.ToDate = new Date;
      // this.rangeDates[1] = this.searchPayload.ToDate;
    }

    // if (this.rangeDates && this.rangeDates.length == 2) {
    //   this.searchPayload.FromDate = this.rangeDates[0];
    //   this.searchPayload.ToDate = this.rangeDates[1];
    // } else {
    //   this.searchPayload.FromDate = this.getPreviousMonthDate();
    //   this.rangeDates[0] = this.searchPayload.FromDate;
    //   this.searchPayload.ToDate = new Date;
    //   this.rangeDates[1] = this.searchPayload.ToDate;
    // }

    if (this.searchPayload.status == "Partially Paid") {
      this.searchPayload.TabType = 'Partial'
    } else {
      this.searchPayload.TabType = ''
    }

    this.Loader = true;

    this.loanService.GetInvoiceDetailExport(this.searchPayload).subscribe((x: any) => {
      console.log("transactionList", x);
      this.Loader = false;
      if (x && x.result.length > 0) {
        this.onexport(x.result)
      }
    }, (err: any) => {
      this.Loader = false;
      // alert("Error API - GetAccountTransactionExport")
      this.messageService.add({ severity: 'error', summary: 'Error API - GetInvoiceDetailExport' });

    });
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

  refernceId: any;
  TotalOutstandingAmt: number = 0;
  gettransactionbyId(referenceId: any) {
    // this.refernceId = transaction.referenceId;
    // this.transactionpoupdisplay = true;
    this.TotalOutstandingAmt = 0;
    this.Loader = true;
    this.loanService.GetTransactionDetailById(referenceId).subscribe(
      (x: any) => {

        console.log("txnDetailList", x);
        if (x && x.result) {
          this.Loader = false;
          this.txnDetailList = x.result;
          if (this.txnDetailList.length > 0) {
            this.TotalOutstandingAmt = this.txnDetailList[0].totalAmount;
          }
        } else {
          this.Loader = false;
          this.txnDetailList = [];

        }
      },
      (err: any) => {
        console.log(err);

        this.Loader = false;
        this.txnDetailList = [];
      }
    );
  }

  saveManualTnx() {

    if (!this.manualSettlePayload.PaymentDate || !this.manualSettlePayload.PaymentRefNo || !this.manualSettlePayload.SettleAmount || !this.manualSettlePayload.ModeOfPaymentSourceType) {
      // alert("All fields are required")
      this.messageService.add({ severity: 'error', summary: 'All fields are required' });
      return
    }

    debugger
    // if(this.selectedTransaction && this.selectedTransaction.actualOrderAmount && this.selectedTransaction.payableAmount){
    let checkingAmt = parseInt((this.selectedTransaction.actualOrderAmount - this.selectedTransaction.payableAmount).toFixed(2));
    if (checkingAmt && (this.manualSettlePayload.SettleAmount > checkingAmt)) {
      // alert("Please enter a valid amount");
      this.messageService.add({ severity: 'error', summary: 'Please enter a valid amount' });
      this.manualSettlePayload.SettleAmount = 0;
      return;
    }

    // }else{
    //   return
    // }

    this.Loader = true;
    this.loanService.TransactionSettleByManual(this.manualSettlePayload).subscribe(
      (res: any) => {
        console.log("TransactionSettleByManual", res);
        if (res && res.status == true) {
          // alert(res.message);
          this.Loader = false;
          this.messageService.add({ severity: 'success', summary: res.message });

          this.gettransactionbyId(this.selectedTransaction.parentID);
          this.manualSettlepopup = false;
        } else {
          // alert(res.message);
          this.messageService.add({ severity: 'error', summary: res.message });
          this.Loader = false;


        }
      },
      (err: any) => {
        console.log(err);
        // alert("ERR - TransactionSettleByManual");
        this.messageService.add({ severity: 'error', summary: 'ERR - TransactionSettleByManual' });
        this.Loader = false;


      }
    );
  }



  // -------------------------------------------------------apis end----------------------------------------------










  // ==========================================Utility start=================================================

  selectedTransaction: any;
  openTnxDetailPopup(transaction: any) {
    this.selectedTransaction = transaction;
    this.refernceId = transaction.referenceId;
    this.transactionpoupdisplay = true;
    this.gettransactionbyId(transaction.parentID);
  }

  openInvoiceDetail(transaction: any) {
    console.log(transaction);

    // const url = this.router.serializeUrl(
    //   this.router.createUrlTree([`/pages/invoice-master/invoice-list/invoice-details/${transaction.invoiceId}`])
    //   // this.router.createUrlTree([`/custompage/${city.id}`])
    // );

    // window.open(`/pages/invoice-master/invoice-list/invoice-details/${transaction.invoiceId}`, '_blank');
    // this.router.navigate([]).then(result => {  window.open(`/pages/invoice-master/invoice-list/invoice-details/${transaction.invoiceId}`, ''); });

    // this.router.navigateByUrl(`/pages/invoice-master/invoice-list/invoice-details/${transaction.invoiceId}`);
    debugger

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

    // else {
    //   return baseUrl;
    // }



  }


  test(event: any) {
    if (event.code == "Enter") {
      alert("enter");
    }
  }

  back() {
    this.router.navigateByUrl('/pages/loan-account/loanList');
  }

  onclear() {
    this.searchPayload.SearchKeyward = '';
    //this.searchPayload.status = 'All'
    this.searchPayload.AnchorCompanyId = 0;
    this.searchPayload.CityName = '';

    this.rangeDates = [];
    this.searchPayload.FromDate = this.getPreviousMonthDate();
    this.rangeDates[0] = this.searchPayload.FromDate;
    this.searchPayload.ToDate = new Date;
    this.rangeDates[1] = this.searchPayload.ToDate;

    this.getAccountTransaction('load');
  }


  // onexport(expData: any) {

  //   expData.forEach((element: any) => {
  //     element.invoiceDate = element.invoiceDate == "1900-01-01T00:00:00" ? '-' : element.invoiceDate;
  //     element.disbursementDate = element.disbursementDate == "1900-01-01T00:00:00" ? '-' : element.disbursementDate;
  //     element.dueDate = element.dueDate == "1900-01-01T00:00:00" ? '-' : element.dueDate;
  //     element.settlementDate = element.settlementDate == "1900-01-01T00:00:00" ? '-' : element.settlementDate;
  //   });

  //   this.exportService.exportAsExcelFile(expData, 'Tranx List');
  // }

  onexport(expData: any) {

    expData.forEach((element: any) => {
      element.invoiceDate = element.invoiceDate == "1900-01-01T00:00:00" ? '-' : moment(element.invoiceDate).format('MM/DD/YYYY');;
      element.disbursementDate = element.disbursementDate == "1900-01-01T00:00:00" ? '-' : moment(element.disbursementDate).format('MM/DD/YYYY');;
      element.dueDate = element.dueDate == "1900-01-01T00:00:00" ? '-' : moment(element.dueDate).format('MM/DD/YYYY');;
      element.settlementDate = element.settlementDate == "1900-01-01T00:00:00" ? '-' : moment(element.settlementDate).format('MM/DD/YYYY');;
      element.paymentDate = element.paymentDate == "1900-01-01T00:00:00" ? '-' : moment(element.paymentDate).format('MM/DD/YYYY');;
    });

    this.exportService.exportAsExcelFile(expData, 'Tranx List');
  }


  // ------------------------------waive off ---------------------------------
  showWaivePop: any;
  selectPanaltyBounceCharge: any;
  DiscountType: any;
  WaiveAmount: any;
  waveOffcharges: waveOffcharges = {

    code: '',
    gstAmount: 0,
    paidAmount: 0,
    referenceId: '',
    totalAmount: 0,
    transactionTypeId: 0,
    type: '',
  };
  totalAmount: any;
  paidAmount: any;
  type: any;
  gstAmount: any;
  discountWaiveAmount: number = 0;
  discountGst: number = 0;

  onClickWaiveOff() {
    this.showWaivePop = true;
    this.selectPanaltyBounceCharge = '';
    this.discountWaiveAmount = 0;
    this.clearDiscountWaiveAmount();
  }

  clearDiscountWaiveAmount() {
    this.waveOffcharges = {
      code: '',
      gstAmount: 0,
      paidAmount: 0,
      referenceId: '',
      totalAmount: 0,
      transactionTypeId: 0,
      type: '',
    };
  }

  getPenaltyBounceCharges() {
    this.clearDiscountWaiveAmount();
    this.Loader = true;
    this.loanService
      .GetPenaltyBounceCharges(this.refernceId, this.selectPanaltyBounceCharge)
      .subscribe((x: any) => {
        this.Loader = false;
        console.log(x.result);
        if (x && x.result.length > 0) {
          this.waveOffcharges = x.result[0];
        }
      });
  }

  ClearInitiateLimit() {
    this.Loader = true;
    this.loanService.ClearInitiateLimit(this.selectedTransaction.loanAccountId, this.selectedTransaction.parentID)
      .subscribe((x: any) => {
        this.Loader = false;
        console.log(x.result);
        if (x && x.message == "Success") {
          this.transactionpoupdisplay = false;
          this.getAccountTransaction('search');
        } else {
          // alert("Error - ClearInitiateLimit");
          alert(x.message);
        }
      });
  }

  waiveOffPenaltyBounce() {
    if (this.selectPanaltyBounceCharge == null || this.selectPanaltyBounceCharge == '' || this.selectPanaltyBounceCharge == undefined) {
      // alert('please select Status')
      this.messageService.add({ severity: 'error', summary: 'please select Status' });
      return
    }
    if (this.DiscountType == null || this.DiscountType == '' || this.DiscountType == undefined) {
      // alert('please select Discount Type')
      this.messageService.add({ severity: 'error', summary: 'please select Discount Type' });
      return
    }
    if (this.discountWaiveAmount > this.waveOffcharges.paidAmount) {
      // alert('Waive Amount should be less than paid Amount')
      this.messageService.add({ severity: 'error', summary: 'Waive Amount should be less than paid Amount' });
      return
    }
    else {

      const payload = {
        TransactionId: this.refernceId,
        PenaltyType: this.selectPanaltyBounceCharge,
        DiscountAmount: this.discountWaiveAmount,
        DiscountGst: 0,
      };

      this.Loader = true;
      this.loanService.WaiveOffPenaltyBounce(payload).subscribe((x: any) => {
        console.log(x);
        if (x.status == true) {
          this.Loader = false;

          // alert(x.message);

          this.messageService.add({ severity: 'success', summary: x.message });

          this.closeWaveOff();
          this.gettransactionbyId(this.selectedTransaction.parentID);
        } else {
          this.Loader = false;

          // alert(x.message)
          this.messageService.add({ severity: 'error', summary: x.message });
        }
      });
    }
  }


  closeWaveOff() {
    this.showWaivePop = false;
  }

  // ==========================================Utility end=================================================











  // ======================================validate===========================================
  validate(e: any) {
    var t = e.target.value;
    // console.log(t);
    e.target.value =
      t.indexOf('.') >= 0
        ? t.substr(0, t.indexOf('.')) + t.substr(t.indexOf('.'), 2)
        : t;
  }

  keyPressAmount(event: any) {
    // After Decimal Allow only 2 digit
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);
    if (!reg.test(input)) {
      event.preventDefault();
    }
  }


  remainingWaiveAmount: number = 0;
  totalWaiveDiscount: number = 0;
  remainingWaiveGST: number = 0;
  totalRemainingWaiveCharges: number = 0;
  onInputChangeDiscountAmount() {
    console.log('this.discountWaiveAmount', this.discountWaiveAmount);

    this.discountGst = (this.discountWaiveAmount * 18) / 100;
    this.totalWaiveDiscount =
      Number(this.discountWaiveAmount) + Number(this.discountGst);
    this.remainingWaiveAmount = this.waveOffcharges.paidAmount - this.discountWaiveAmount;
    this.remainingWaiveGST = (this.remainingWaiveAmount * 18) / 100;;
    this.totalRemainingWaiveCharges = this.remainingWaiveAmount + this.remainingWaiveGST;
  }

  manualSettlepopup: any;
  onClickManualSettle() {
    this.manualSettlePayload = {
      TransactionNo: '',
      ModeOfPaymentSourceType: '',
      SettleAmount: 0,
      username: '',
      PaymentRefNo: '',
      PaymentDate: null
    },
      this.manualSettlePayload.TransactionNo = this.selectedTransaction.referenceId;
    this.manualSettlePayload.username = this.selectedTransaction.customerName;
    this.manualSettlePayload.SettleAmount = parseInt((this.selectedTransaction.actualOrderAmount - this.selectedTransaction.payableAmount).toFixed(2));
    // this.manualSettlePayload.PaymentDate = new Date;
    this.manualSettlepopup = true;
  }

  navigateTo(rowData: any) {
    // this.router.navigate(["pages/loan-account/loanList/loan-details/" + rowData.loanAccountId]);


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





    // localStorage.setItem('SearchFilter', JSON.stringify(this.searchFilters));
  }



}


interface manualSettlePayload {
  TransactionNo: string,
  ModeOfPaymentSourceType: string,
  SettleAmount: number,
  username: string,
  PaymentRefNo: string,
  PaymentDate: Date | null
}


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

  LoanAccountId: number;

  Skip: any;
  Take: any;
}

interface waveOffcharges {
  code: string;
  gstAmount: number;
  paidAmount: number;
  referenceId: string;
  totalAmount: number;
  transactionTypeId: number;
  type: string;
}

