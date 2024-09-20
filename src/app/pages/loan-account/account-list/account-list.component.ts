import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LoanService } from '../services/loan.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { skip } from 'rxjs';
// import { ExportService } from 'app/shared/scale-up-shared/services/export.service';
import { ExportService } from 'app/shared/scale-up-shared/services/export.service';
import * as moment from "moment";
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-account-list',
    templateUrl: './account-list.component.html',
    styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent {

    @ViewChild('sellerOfferCalendar') sellerOfferCalendar: any;
    @Input() accountInfo: any;


    totalrecord: number = 0;
    selectedCity: any;
    searchPayload: searchPayload = {
        // LoanAccountId: 0,

        // ProductType: "",
        // // customerName: '',
        // status: 'All',
        // // referenceId: '',
        // // mobileNo: '',
        // cityname: '',
        // anchorCompanyId: 0,
        // skip: 0,
        // take: 10,

        // SearchKeyward: '',
        // status: 'All',
        // FromDate: new Date,
        // ToDate: new Date,
        // TabType: '',
        // AnchorCompanyId: 0,
        // CityName: '',

        // Skip: 0,
        // Take: 10

        "anchorId": 0,
        "cityName": "",
        "keyword": "",
        "fromDate": new Date,
        "toDate": new Date,
        "skip": 1,
        "take": 10,
        "status": "All",
        "cityId": 0

    };

    StatusList: any[] = [];

    // modeOfPaymentList = [
    //   { value: 'NEFT', label: 'NEFT' },
    //   { value: 'UPI', label: 'UPI' },
    //   { value: 'MUPI', label: 'MUPI' },
    //   { value: 'Cash', label: 'Cash' },
    //   { value: 'cheque', label: 'Cheque' },
    // ];
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
    transactionpoupdisplay: boolean = false;
    txnDetailList: any[] = [];
    first: number = 0;

    // manualSettlePayload: manualSettlePayload = {
    //   TransactionNo: '',
    //   ModeOfPaymentSourceType: '',
    //   SettleAmount: 0,
    //   username: '',
    //   PaymentRefNo: '',
    //   PaymentDate: null
    // }

    constructor(
        private loanService: LoanService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private exportService: ExportService,
        private messageService: MessageService, private datePipe: DatePipe
    ) {
        // this.searchPayload.SearchKeyward = localStorage.getItem('Loanaccountmobile') ? localStorage.getItem('Loanaccountmobile') : '';
    }


    ProductType: string = "CreditLine";
    async ngOnInit() {
        // this.searchPayload.customerName = localStorage.getItem('LoanaccountCust') ? localStorage.getItem('LoanaccountCust') : '';
        // this.searchPayload.SearchKeyward = localStorage.getItem('Loanaccountmobile') ? localStorage.getItem('Loanaccountmobile') : '';

        // this.getAnchorNameList();
        await this.GetCompanyList();
        this.getCityNameList();

        this.GetStatusList(this.ProductType);
        // this.AnchorCityProductList();
    }

    // -------------------------------------------------------apis start----------------------------------------------
    anchorList: any[] = [];
    cityList: any = ([] = []);
    // selectedCity: any;
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
                this.anchorList = x.result.anchorNameDcs && x.result.anchorNameDcs.length > 0 ? x.result.anchorNameDcs : [];;
            } else {
                this.anchorList = [];
            }
        });
    }
    async GetCompanyList() {
            var company = await this.loanService.GetAnchorCompaniesByProduct('CreditLine').toPromise();
            console.log(company, 'company');
            if (company != null && company.status && company.response.length > 0 ) {
                // this.companyData = company.returnObject.filter((y: any) => y.companyType == 'Anchor')
                this.anchorList = company.response.filter((y: any) => y.companyType == 'Anchor')
                if (this.anchorList.length > 0) {
                    this.searchPayload.anchorId = this.anchorList[0].id
                }
            }
    }
    getCityNameList() {
        // this.loanService.getCityList().subscribe((x: any) => {
        //     console.log("getCityList", x);
        //     if (x) {
        //         this.cityList = x;
        //     } else {
        //         this.cityList = [];
        //     }
        // });
        this.loanService.GetAllLeadCities().subscribe((res:any) =>{
            console.log('getCityList', res);
            if(res.status && res.response && res.response.length > 0)  {
                this.cityList = res.response;
            }
        })
    }

    navigate(leadData: any) {
        // localStorage.removeItem('LeadInfo')
        // const objectString = JSON.stringify(leadData);
        // localStorage.setItem("LeadInfo", objectString)
        // this.router.navigateByUrl('pages/lead/SC-leads/sc-lead-details');
        this.router.navigate(['pages/lead/SC-leads/sc-lead-details/' +
            leadData.userId + '/' + leadData.leadId]);
    }

    GetStatusList(ProductType: any) {
        this.loanService.GetStatusList(ProductType).subscribe((x: any) => {
            console.log("GetStatusList", x);
            if (x) {
                // let objList: any[] = [];
                // x.forEach((element: any) => {
                //   let x = { label: element, value: element };
                //   objList.push(x);
                // });
                this.StatusList = x;
            } else {
                this.StatusList = []
            }
        });
    }

    async load(event: any) {
        this.searchPayload.take = event.rows;
        this.searchPayload.skip = event.first;
        await this.GetCompanyList();
        this.getAccountTransaction('load');
    }

    getAccountTransaction(loadType: any) {
        var flag = false;
        if (loadType == 'search') {
            this.searchPayload.skip = 0;
            this.searchPayload.take = 10;
            this.first = 1;
        } else {

        }

        if (this.rangeDates && this.rangeDates.length == 2) {
            this.searchPayload.fromDate = moment(this.rangeDates[0]).format('YYYY-MM-DD');
            this.searchPayload.toDate = this.rangeDates[1] ? moment(this.rangeDates[1]).format('YYYY-MM-DD') : this.searchPayload.fromDate;
            // this.searchPayload.ToDate =  moment(this.rangeDates[1]).format('YYYY-MM-DD');
        } else {
            this.searchPayload.fromDate = this.getPreviousMonthDate();
            this.rangeDates[0] = this.searchPayload.fromDate;
            this.searchPayload.toDate = new Date;
            this.rangeDates[1] = this.searchPayload.toDate;
        }

        // if (this.searchPayload.status == "Partially Paid") {
        //   this.searchPayload.TabType = 'Partial'
        // } else {
        //   this.searchPayload.TabType = ''
        // }

        if (this.selectedCity) {
            this.searchPayload.cityName = this.selectedCity.cityName;
            this.searchPayload.cityId = this.selectedCity.id;
        } else {
            this.searchPayload.cityName = '';
            this.searchPayload.cityId = 0;
        }

        if (this.searchPayload.anchorId > 0) {
            flag = true;
        }
        else {
            flag = false;
            this.messageService.add({ severity: 'error', summary: 'Please Select Anchor Name' });
        }

        if (flag) {
            this.Loader = true;
            this.loanService.GetSCAccountList(this.searchPayload).subscribe((x: any) => {
                console.log("transactionList", x);
                this.Loader = false;
                if (x && x.response && x.response.length > 0) {
                    this.transactionList = x.response;
                    this.totalrecord = x.response[0].totalCount;
                } else {
                    this.transactionList = [];
                    this.totalrecord = 0;
                    this.messageService.add({ severity: 'warn', summary: x.message });
                }
                localStorage.removeItem('LoanaccountCust');
                localStorage.removeItem('Loanaccountmobile');
            }, (err: any) => {
                this.Loader = false;
                this.transactionList = [];
                this.totalrecord = 0;
                // alert("Error API - GetAccountTransaction")
                this.messageService.add({ severity: 'error', summary: 'Error API - GetAccountTransaction' });

            });
        }
        else {
            // this.messageService.add({ severity: 'error', summary: 'Please Select Required Fields' });
        }
    }

    GetAccountListExport() {
        var flag = false;
        this.searchPayload.skip = 0;
        this.searchPayload.take = 0;

        if (this.rangeDates && this.rangeDates.length == 2) {
            this.searchPayload.fromDate = moment(this.rangeDates[0]).format('YYYY-MM-DD');
            this.searchPayload.toDate = this.rangeDates[1] ? moment(this.rangeDates[1]).format('YYYY-MM-DD') : this.searchPayload.fromDate;
            // this.searchPayload.ToDate =  moment(this.rangeDates[1]).format('YYYY-MM-DD');
        } else {
            this.searchPayload.fromDate = this.getPreviousMonthDate();
            this.rangeDates[0] = this.searchPayload.fromDate;
            this.searchPayload.toDate = new Date;
            this.rangeDates[1] = this.searchPayload.toDate;
        }
        if (this.selectedCity) {
            this.searchPayload.cityName = this.selectedCity.cityName;
            this.searchPayload.cityId = this.selectedCity.id;
        } else {
            this.searchPayload.cityName = '';
            this.searchPayload.cityId = 0;
        }

        if (this.searchPayload.anchorId > 0) {
            flag = true;
        }
        else {
            flag = false;
            this.messageService.add({ severity: 'error', summary: 'Please Select Anchor Name' });
        }
        if (flag) {
            this.Loader = true;
            this.loanService.GetSCAccountList(this.searchPayload).subscribe((x: any) => {
                console.log("transactionList", x);
                this.Loader = false;
                if (x && x.status && x.response.length > 0) {
                    this.onexport(x.response)
                }
            }, (err: any) => {
                this.Loader = false;
                // alert("Error API - GetAccountTransactionExport")
                this.messageService.add({ severity: 'error', summary: 'Error API - GetAccountTransactionExport' });

            });
        }
        else {

        }
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

    // saveManualTnx() {

    //   if (!this.manualSettlePayload.PaymentDate || !this.manualSettlePayload.PaymentRefNo || !this.manualSettlePayload.SettleAmount || !this.manualSettlePayload.ModeOfPaymentSourceType) {
    //     // alert("All fields are required")
    //     this.messageService.add({ severity: 'error', summary: 'All fields are required' });
    //     return
    //   }

    //   debugger
    //   // if(this.selectedTransaction && this.selectedTransaction.actualOrderAmount && this.selectedTransaction.payableAmount){
    //   let checkingAmt = parseInt((this.selectedTransaction.actualOrderAmount - this.selectedTransaction.payableAmount).toFixed(2));
    //   if (checkingAmt && (this.manualSettlePayload.SettleAmount > checkingAmt)) {
    //     // alert("Please enter a valid amount");
    //     this.messageService.add({ severity: 'error', summary: 'Please enter a valid amount' });
    //     this.manualSettlePayload.SettleAmount = 0;
    //     return;
    //   }

    //   // }else{
    //   //   return
    //   // }

    //   this.Loader = true;
    //   this.loanService.TransactionSettleByManual(this.manualSettlePayload).subscribe(
    //     (res: any) => {
    //       console.log("TransactionSettleByManual", res);
    //       if (res && res.status == true) {
    //         // alert(res.message);
    //         this.Loader = false;
    //         this.messageService.add({ severity: 'success', summary: res.message });

    //         this.gettransactionbyId(this.selectedTransaction.parentID);
    //         this.manualSettlepopup = false;
    //       } else {
    //         // alert(res.message);
    //         this.messageService.add({ severity: 'error', summary: res.message });
    //         this.Loader = false;


    //       }
    //     },
    //     (err: any) => {
    //       console.log(err);
    //       // alert("ERR - TransactionSettleByManual");
    //       this.messageService.add({ severity: 'error', summary: 'ERR - TransactionSettleByManual' });
    //       this.Loader = false;


    //     }
    //   );
    // }



    // -------------------------------------------------------apis end----------------------------------------------










    // ==========================================Utility start=================================================

    selectedTransaction: any;
    openTnxDetailPopup(transaction: any) {
        this.selectedTransaction = transaction;
        this.refernceId = transaction.referenceId;
        this.transactionpoupdisplay = true;
        this.gettransactionbyId(transaction.parentID);
    }

    back() {
        this.router.navigateByUrl('/pages/loan-account/loanList');
    }

    onclear() {
        this.selectedCity = null;
        this.searchPayload.keyword = '';
        //this.searchPayload.status = 'All'
        this.searchPayload.anchorId = 0;
        this.searchPayload.cityName = '';
        this.rangeDates = [];
        this.searchPayload.fromDate = this.getPreviousMonthDate();
        this.rangeDates[0] = this.searchPayload.fromDate;
        this.searchPayload.toDate = new Date;
        this.rangeDates[1] = this.searchPayload.toDate;

        this.getAccountTransaction('load');
    }

    exportData: any;
    onexport(expData: any) {
        expData.forEach((element: any) => {
            element.createdDate = this.datePipe.transform(element.createdDate, 'yyyy-MM-dd');
        });

        this.exportData = expData.map((item: any) => {
            const { totalCount, leadId, userId, cityId, modifiedDate, ...rest } = item;
            return rest;
        }
        );
        this.exportService.exportAsExcelFile(this.exportData, 'Account List');
    }



    // ------------------------------waive off ---------------------------------
    // showWaivePop: boolean = false;
    // selectPanaltyBounceCharge: any;
    // DiscountType: any;
    // WaiveAmount: any;
    // waveOffcharges: waveOffcharges = {

    //   code: '',
    //   gstAmount: 0,
    //   paidAmount: 0,
    //   referenceId: '',
    //   totalAmount: 0,
    //   transactionTypeId: 0,
    //   type: '',
    // };
    // totalAmount: any;
    // paidAmount: any;
    // type: any;
    // gstAmount: any;
    // discountWaiveAmount: number = 0;
    // discountGst: number = 0;

    // onClickWaiveOff() {
    //   this.showWaivePop = true;
    //   this.selectPanaltyBounceCharge = '';
    //   this.discountWaiveAmount = 0;
    //   this.clearDiscountWaiveAmount();
    // }

    // clearDiscountWaiveAmount() {
    //   this.waveOffcharges = {
    //     code: '',
    //     gstAmount: 0,
    //     paidAmount: 0,
    //     referenceId: '',
    //     totalAmount: 0,
    //     transactionTypeId: 0,
    //     type: '',
    //   };
    // }

    // getPenaltyBounceCharges() {
    //   this.clearDiscountWaiveAmount();
    //   this.Loader = true;
    //   this.loanService
    //     .GetPenaltyBounceCharges(this.refernceId, this.selectPanaltyBounceCharge)
    //     .subscribe((x: any) => {
    //       this.Loader = false;
    //       console.log(x.result);
    //       if (x && x.result.length > 0) {
    //         this.waveOffcharges = x.result[0];
    //       }
    //     });
    // }

    // ClearInitiateLimit() {
    //   this.Loader = true;
    //   this.loanService.ClearInitiateLimit(this.selectedTransaction.loanAccountId, this.selectedTransaction.parentID)
    //     .subscribe((x: any) => {
    //       this.Loader = false;
    //       console.log(x.result);
    //       if (x && x.message == "Success") {
    //         this.transactionpoupdisplay = false;
    //         this.getAccountTransaction('search');
    //       } else {
    //         // alert("Error - ClearInitiateLimit");
    //         alert(x.message);
    //       }
    //     });
    // }

    // waiveOffPenaltyBounce() {
    //   if (this.selectPanaltyBounceCharge == null || this.selectPanaltyBounceCharge == '' || this.selectPanaltyBounceCharge == undefined) {
    //     // alert('please select Status')
    //     this.messageService.add({ severity: 'error', summary: 'please select Status' });
    //     return
    //   }
    //   if (this.DiscountType == null || this.DiscountType == '' || this.DiscountType == undefined) {
    //     // alert('please select Discount Type')
    //     this.messageService.add({ severity: 'error', summary: 'please select Discount Type' });
    //     return
    //   }
    //   if (this.discountWaiveAmount > this.waveOffcharges.paidAmount) {
    //     // alert('Waive Amount should be less than paid Amount')
    //     this.messageService.add({ severity: 'error', summary: 'Waive Amount should be less than paid Amount' });
    //     return
    //   }
    //   else {

    //     const payload = {
    //       TransactionId: this.refernceId,
    //       PenaltyType: this.selectPanaltyBounceCharge,
    //       DiscountAmount: this.discountWaiveAmount,
    //       DiscountGst: 0,
    //     };

    //     this.Loader = true;
    //     this.loanService.WaiveOffPenaltyBounce(payload).subscribe((x: any) => {
    //       console.log(x);
    //       if (x.status == true) {
    //         this.Loader = false;

    //         // alert(x.message);

    //         this.messageService.add({ severity: 'success', summary: x.message });

    //         this.closeWaveOff();
    //         this.gettransactionbyId(this.selectedTransaction.parentID);
    //       } else {
    //         this.Loader = false;

    //         // alert(x.message)
    //         this.messageService.add({ severity: 'error', summary: x.message });
    //       }
    //     });
    //   }
    // }


    // closeWaveOff() {
    //   this.showWaivePop = false;
    // }

    // ==========================================Utility end=================================================











    // ======================================validate===========================================
    // validate(e: any) {
    //   var t = e.target.value;
    //   // console.log(t);
    //   e.target.value =
    //     t.indexOf('.') >= 0
    //       ? t.substr(0, t.indexOf('.')) + t.substr(t.indexOf('.'), 2)
    //       : t;
    // }

    // keyPressAmount(event: any) {
    //   // After Decimal Allow only 2 digit
    //   const reg = /^-?\d*(\.\d{0,2})?$/;
    //   let input = event.target.value + String.fromCharCode(event.charCode);
    //   if (!reg.test(input)) {
    //     event.preventDefault();
    //   }
    // }


    // remainingWaiveAmount: number = 0;
    // totalWaiveDiscount: number = 0;
    // remainingWaiveGST: number = 0;
    // totalRemainingWaiveCharges: number = 0;
    // onInputChangeDiscountAmount() {
    //   console.log('this.discountWaiveAmount', this.discountWaiveAmount);

    //   this.discountGst = (this.discountWaiveAmount * 18) / 100;
    //   this.totalWaiveDiscount =
    //     Number(this.discountWaiveAmount) + Number(this.discountGst);
    //   this.remainingWaiveAmount = this.waveOffcharges.paidAmount - this.discountWaiveAmount;
    //   this.remainingWaiveGST = (this.remainingWaiveAmount * 18) / 100;;
    //   this.totalRemainingWaiveCharges = this.remainingWaiveAmount + this.remainingWaiveGST;
    // }

    // manualSettlepopup: boolean = false;
    // onClickManualSettle() {
    //   this.manualSettlePayload = {
    //     TransactionNo: '',
    //     ModeOfPaymentSourceType: '',
    //     SettleAmount: 0,
    //     username: '',
    //     PaymentRefNo: '',
    //     PaymentDate: null
    //   },
    //     this.manualSettlePayload.TransactionNo = this.selectedTransaction.referenceId;
    //   this.manualSettlePayload.username = this.selectedTransaction.customerName;
    //   this.manualSettlePayload.SettleAmount = parseInt((this.selectedTransaction.actualOrderAmount - this.selectedTransaction.payableAmount).toFixed(2));
    //   // this.manualSettlePayload.PaymentDate = new Date;
    //   this.manualSettlepopup = true;
    // }

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



// interface manualSettlePayload {
//   TransactionNo: string,
//   ModeOfPaymentSourceType: string,
//   SettleAmount: number,
//   username: string,
//   PaymentRefNo: string,
//   PaymentDate: Date | null
// }


interface searchPayload {
    // SearchKeyward: any;
    // status: any;
    // TabType: string;
    // // mobileNo: any;
    // // referenceId: any;

    // FromDate: Date | any;
    // ToDate: Date | any;

    // AnchorCompanyId: number;
    // CityName: any;

    // LoanAccountId: number;

    // Skip: number;
    // Take: number;
    // ProductType: string;

    "anchorId": number,
    "cityName": string,
    "keyword": string,
    "fromDate": Date | any,
    "toDate": Date | any,
    "skip": number,
    "take": number,
    "status": string,
    "cityId": number

}

// interface waveOffcharges {
//   code: string;
//   gstAmount: number;
//   paidAmount: number;
//   referenceId: string;
//   totalAmount: number;
//   transactionTypeId: number;
//   type: string;
// }

