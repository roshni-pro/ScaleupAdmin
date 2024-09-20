import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { InvoiceGenerationService } from '../services/invoice-generation.service';
import { NbfcTestService } from 'app/pages/nbfc-url/nbfc-test.service';
import { DashboardService } from 'app/pages/admin/services/dashboard.service';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { count } from 'rxjs';
import { environment } from 'environments/environment';
import { CommonValidationService } from 'app/shared/services/common-validation.service';
@Component({
  selector: 'app-invoice-generation',
  templateUrl: './invoice-generation.component.html',
  styleUrls: ['./invoice-generation.component.scss'],
})
export class InvoiceGenerationComponent {
  listNBFC: any;
  AnchorList: any;
  DayList: any = [
    {
      label: 'Today',
      value: 'Today',
    },
    {
      label: 'MTD',
      value: 'MTD',
    },

    {
      label: 'Last Month',
      value: 'Last Month',
    },
    {
      label: 'Custom',
      value: 'Custom',
    },
  ];

  //api responses
  InvoiceList: GetList[] = [];
  statusList: any;
  totalRecords: number = 0;
  first: number = 0;
  Skip: Number = 0;
  Take: Number = 10;

  CompanyInvoiceCharges: CompanyInvoicesChargesResponseDc = {
    processingFee: 0,
    interestCharges: 0,
    overDueInterest: 0,
    penalCharges: 0,
    bounceCharges: 0,
    totalTaxableAmount: 0,
    totalGstAmount: 0,
    totalInvoiceAmount: 0,
  };

  rangedates: any;
  searchFilters: any = {
    day: null,
    AnchorId: 0,
    FromDate: null,
    ToDate: null,
    NBFCId: 0,
    status: null,
  };

  emails: any = [];
  addMail: any;
  isSendMail: boolean = false;
  submit: boolean = false;
  companyEmail: string = '';
  Body: string = '';
  Subject: string = '';
  sendInvoiceUrl: string = '';
  Loader: boolean = false;

  id: number = 1;
  entity: any = 'CompanyInvoice';
  isHistory: boolean = false;
  databaseName: any = 'loanaccount';
  apiURL: String = '';
  paymentDate: any;
  utrNumber: any;
  tdsAmount: any;
  amount: any;
  isSettle: boolean = false;
  dynamicArray: InvoiceSettlementResponseDc[] = [];
  companyInvoiceId: any;
  isSettleinvoice: boolean = false;
  roles: any;
  showSettle: boolean = false;

  constructor(
    private invoiceService: InvoiceGenerationService,
    private nbfcServ: NbfcTestService,
    private dashboardService: DashboardService,
    private messageService: MessageService,
    private commonValidation: CommonValidationService
  ) {
    this.apiURL = environment.apiBaseUrl;
    this.dynamicArray.push({
      amount: '',
      tdsAmount: '',
      utrNumber: '',
      paymentDate: '',
      isSattled: false,
      Id: 0,
    });
  }
  rangedatesa: any;
  async ngOnInit() {
    await this.getNBFCList();
    await this.getStatusList();
    await this.getCompanyList();
    this.roles = localStorage.getItem('roles');
    if (
      this.roles === 'finance executive' ||
      this.roles === 'superadmin' ||
      this.roles === 'finance lead'
    ) {
      this.showSettle = true;
    }
  }

  keyPressAmount(event: any) {
    // After Decimal Allow only 2 digit

    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);
    if (!reg.test(input)) {
      event.preventDefault();
    }
  }
  preventSpace(event: KeyboardEvent) {
    if (event.code === 'Space' || event.key === ' ') {
      event.preventDefault();
    }
  }
  omit_special_char(event: any) {
    //// debugger
    var k;
    k = event.charCode; //         k = event.keyCode;  (Both can be used)
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 32 ||
      k == 46 ||
      (k >= 48 && k <= 57)
    );
  }

  deleteRow(x: any) {
    // var delBtn = confirm(' Do you want to delete ?');
    // if (delBtn == true) {
    if (this.dynamicArray.length > 1) {
      this.dynamicArray.splice(x, 1);
    }
    // }
  }

  getTotalAmount(): number {
    return this.dynamicArray.reduce((sum, row) => {
      const amount = parseFloat(row.amount) || 0; // Convert amount to number
      const tdsAmount = parseFloat(row.tdsAmount) || 0; // Convert tdsAmount to number
      return sum + amount + tdsAmount; // Add both amounts
    }, 0);
  }

  addSettleInvoices() {
    debugger;

    // Check if all fields in the current row are filled
    const lastRow = this.dynamicArray[this.dynamicArray.length - 1];
    console.log(lastRow);
    const totalAmount = this.getTotalAmount();
    console.log('Total Amount:', totalAmount);
    if (totalAmount < this.InvoiceList[0].amount) {
      if (
        lastRow.amount != null &&
        lastRow.amount !== '' &&
        lastRow.tdsAmount != null &&
        lastRow.tdsAmount !== '' &&
        lastRow.utrNumber != null &&
        lastRow.utrNumber !== '' &&
        lastRow.paymentDate != null &&
        lastRow.paymentDate !== ''
      ) {
        // Add new row
        this.dynamicArray.push({
          amount: this.amount || '',
          tdsAmount: this.tdsAmount || '',
          utrNumber: this.utrNumber || '',
          paymentDate: this.paymentDate || '',
          isSattled: this.isSettle || false,
          Id: 0,
        });
        console.log(this.dynamicArray);

        localStorage.setItem('DynamicArray', JSON.stringify(this.dynamicArray));
        // Clear the input fields after adding

        this.amount = null;
        this.tdsAmount = null;
        this.utrNumber = '';
        this.paymentDate = '';
      } else {
        alert('Please complete all fields before adding a new row.');
      }
    } else {
      alert('Settle Amount Cannot be greater than generated amount');
    }
  }

  onInvoiceUpdated(success: boolean) {
    debugger;
    console.log('Invoice update status:', success);

    if (success) {
      this.ngOnInit();
    } else {
      console.error('Failed to update invoice');
    }
  }
  navigateTo(rowData: any, event: MouseEvent) {
    debugger;
    this.emails = [];
    this.sendInvoiceUrl = '';
    this.Body = '';
    this.Subject = '';
    this.sendInvoiceUrl = rowData.invoiceUrl;

    const protocol = window.location.protocol;
    const host = window.location.hostname;
    const port = window.location.port;
    const baseUrl = `${protocol}//${host}`;
    const targetElement = event.target as HTMLElement;
    this.GetCompanyInvoiceCharges(rowData);

    if (targetElement && targetElement.innerHTML === 'Send') {
      if (!(rowData.invoiceUrl != '' || rowData.invoiceUrl)) {
        this.messageService.add({
          severity: 'error',
          summary: 'Invoice is pending for make approval.',
        });
      } else {
        this.isSendMail = true;
        this.companyEmail = rowData.companyEmail;
      }
    } else if (targetElement && targetElement.innerHTML === 'View') {
      if (rowData.invoiceUrl != '' || rowData.invoiceUrl) {
        this.download(rowData.invoiceUrl);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Invoice is pending for make approval.',
        });
      }
    } else if (targetElement && targetElement.innerHTML === 'History') {
      this.id = 0;
      this.id = rowData.companyInvoiceId; //?rowData.companyInvoiceId:1
      this.isHistory = true;
    } else if (targetElement && targetElement.innerHTML === 'Settle') {
      // this.id=0
      // this.id=rowData.companyInvoiceId; //?rowData.companyInvoiceId:1
      this.isSettleinvoice = true;
         this.getInvoiceSettleData(rowData.companyInvoiceId);
    } else {
      localStorage.setItem('Invoiceno', rowData.invoiceNo);
      const searchFilterPayload = JSON.stringify(this.searchFilterPayload);
      localStorage.setItem('searchfilter', searchFilterPayload);

      if (port) {
        window.open(
          `${baseUrl}:${port}` +
            '/#/pages/invoice-master/invoice-generation-details',
          '_blank'
        ); //+ rowData.InvoiceNo
      } else {
        window.open(
          `${baseUrl}` + '/#/pages/invoice-master/invoice-generation-details',
          '_blank'
        );
      }
    }
  }

  getDate() {
    this.searchFilters.FromDate = '';
    this.searchFilters.ToDate = '';
    if (this.searchFilters.day == 'Today') {
      this.searchFilters.FromDate = new Date();
      this.searchFilters.ToDate = new Date();
      return;
    }
    if (this.searchFilters.day == 'MTD') {
      var date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
      this.searchFilters.FromDate = new Date(y, m, 1);
      this.searchFilters.ToDate = new Date();
      return;
    }
    if (this.searchFilters.day == 'Last Month') {
      var now = new Date();
      this.searchFilters.FromDate = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );

      const firstDayOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );
      this.searchFilters.ToDate = new Date(
        firstDayOfMonth.getFullYear(),
        firstDayOfMonth.getMonth() + 1,
        0
      );
      return;
    } else {
      this.searchFilters.FromDate = '';
      this.searchFilters.ToDate = '';
    }
  }
  validateYearDifference() {
    //
    if (this.searchFilters.ToDate) {
      const oneYearDifference = moment(this.searchFilters.FromDate).diff(
        moment(this.searchFilters.ToDate),
        'years'
      );
      if (Math.abs(oneYearDifference) === 1) {
        this.searchFilters.ToDate = '';
      }
    }
  }
  validateSearchFilters(): boolean {
    //  debugger
    if (this.searchFilters) {
      if (!this.searchFilters.NBFCId) {
        this.messageService.add({
          severity: 'error',
          summary: 'Select NBFCs!',
        });
        return false;
      } else if (!this.searchFilters.AnchorId) {
        this.messageService.add({
          severity: 'error',
          summary: 'Select anchors!',
        });
        return false;
      } else if (!this.rangedates) {
        this.messageService.add({
          severity: 'error',
          summary: 'Select Month/year!',
        });
        return false;
      } else if (!this.searchFilters.status && this.searchFilters.status != 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Select Status!',
        });
        return false;
      }
    }
    return true;
  }
  download(value: any) {
    window.open(value);
  }
  addEmail() {
    this.submit = false;
    const isEmailValid =
      !!this.addMail &&
      this.addMail.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
    if (isEmailValid) {
      this.emails.push(this.addMail);
      this.addMail = '';
    } else {
      this.submit = true;
    }
  }
  removeEmail(email: any) {
    this.emails = this.emails.filter(
      (ele: any, ind: number) => ele != email && this.emails[0] != email
    );
  }
  restrictLeadingZero(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const inputValue = input.value;

    // Prevent multiple leading zeros as the first characters
    if (inputValue.length === 0 && event.key === '0') {
      event.preventDefault();
    }

    // // Allow backspace and ensure input remains numeric
    // if (event.key !== 'Backspace' && isNaN(Number(event.key))) {
    //   event.preventDefault();
    // }
  }
  //  ---------------------------------------API'S----------------------------------------------

  load(event: any) {
    this.Take = event.rows;
    this.Skip = event.first;
    if (!event) {
      this.onSearch(false);
    }
  }

  async getNBFCList() {
    try {
      this.nbfcServ.GetCompanyListByCompanyTypeNBFC().subscribe(
        (res: any) => {
          console.log('nbfc dropdown list', res);
          if (res && res.returnObject) {
            this.listNBFC = res.returnObject;
          } else {
            this.listNBFC = [];
          }
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'error in GetCompanyListByCompanyTypeNBFC-!',
          });
        }
      );
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'error in GetCompanyListByCompanyTypeNBFC-!',
      });
      this.Loader = false;
      throw error; // Rethrow the error for handling in the calling code
    }
  }

  async getCompanyList() {
    try {
      let payload = {
        keyword: null,
        skip: 0,
        take: 10,
        CompanyType: 'Anchor',
      };
      this.Loader = true;
      const res: any = await this.dashboardService
        .getDashboardCompanyList(payload)
        .toPromise();
      console.log(res);
      this.Loader = false;
      this.AnchorList = res.returnObject;
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'error in getAnchorCompanyList-!',
      });
      this.Loader = false;
      throw error; // Rethrow the error for handling in the calling code
    }
  }

  invoicepaymentDate:any;
  async getStatusList() {
    debugger;
    try {
      this.Loader = true;
      this.invoiceService.getStatusList().subscribe(
        (res: any) => {
          this.statusList = res.result;
          this.searchFilters.status = this.statusList[0].value;
          console.log(res);
          this.Loader = false;
        },
        (error: any) => {
          this.Loader = false;
          this.messageService.add({
            severity: 'error',
            summary: 'error in getStatusList-!',
          });
        }
      );
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'error in getStatusList-!',
      });
      this.Loader = false;
      throw error; // Rethrow the error for handling in the calling code
    }
  }
  invoiceAmt: any;
  invoiceUrl: any;
  // minDate: Date=new Date;
  maxDateValue: Date=new Date;
  invoiceStatus:any;

  onSearch(e?: boolean) {
    debugger;
    this.InvoiceList = [];
    this.totalRecords = 0;
    let pay = this.validateSearchFilters();
    // this.rangedatesa=this.rangedates.toString()
    if (pay) {
      let payload = {
        nbfcId: this.searchFilters.NBFCId,
        anchorId: this.searchFilters.AnchorId,
        fromDate: this.rangedates
          ? moment(this.rangedates).format('YYYY-MM-DD')
          : null,
        toDate: this.rangedates
          ? moment(
              new Date(
                this.rangedates.getFullYear(),
                this.rangedates.getMonth() + 1,
                0
              )
            ).format('YYYY-MM-DD')
          : null,
        status: this.searchFilters.status,
        skip: this.Skip ? this.Skip : 0,
        take: this.Take ? this.Take : 10,
      };
      console.log('payload for GetCompanyInvoiceList--', payload);
      console.log('payload for this.searchFilters--', this.rangedates);
      this.Loader = true;
      this.invoiceService.GetCompanyInvoiceList(payload).subscribe(
        (result: any) => {
          if (result.status) {
            this.InvoiceList = result.response;
            this.invoiceUrl = this.InvoiceList[0].invoiceUrl;
            this.invoiceAmt = this.InvoiceList[0].amount;
            this.invoiceStatus = this.InvoiceList[0].statusName;
console.log(this.invoiceStatus);


            this.invoicepaymentDate = new Date(this.InvoiceList[0].paymentDate);
            // this.minDate = new Date();



            this.totalRecords = result.response[0].totalCount;

            // this.GetCompanyInvoiceCharges();
            console.log('this.InvoiceList', result);
            this.Loader = false;
          } else {
            this.Loader = false;
            this.messageService.add({
              severity: 'error',
              summary: result.message,
            });
          }
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'error in GetCompanyInvoiceList-!',
          });
          this.Loader = false;
        }
      );
    }
  }

  sendEmails() {
    if (this.addMail) {
      // alert('');
      this.messageService.add({
        severity: 'error',
        summary: 'Please Add email first!',
      });
      return;
    }
    if (this.Subject && this.Body && this.emails) {
      // mailto:this.companyemail='simran.gandhi@shopkirana.com'
      // this.emails.push();
      let payload = {
        to: this.emails, //multiselect  comp
        invoiceUrl: this.sendInvoiceUrl, //comp
        subject: this.Subject,
        body: this.Body,
      };
      payload.to.push(this.companyEmail);
      console.log(payload);
      this.Loader = true;
      this.invoiceService.SendInvoiceEmail(payload).subscribe(
        (res: any) => {
          console.log('Mail', res);
          this.Loader = false;
          if (res.status) {
            this.messageService.add({
              severity: 'success',
              summary: res.message,
            });
            this.isSendMail = false;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: res.message,
            });
          }
        },
        (error: any) => {
          this.Loader = false;
          this.messageService.add({
            severity: 'error',
            summary: 'error in SendInvoiceEmail-!',
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: !this.Subject
          ? 'add Subject!'
          : !this.emails || this.emails.length == 0
          ? ' add emails !'
          : 'add body !',
      });
    }
  }

  searchFilterPayload: any;
  GetCompanyInvoiceCharges(rowData: any) {
    debugger;
    // let pay=this.validateSearchFilters();
    // if(pay){
    let payload = {
      anchorId: this.searchFilters.AnchorId, //multiselect  comp
      nbfcId: this.searchFilters.NBFCId, //comp
      fromDate: this.rangedates
        ? moment(this.rangedates).format('YYYY-MM-DD')
        : null,
      toDate: this.rangedates
        ? moment(
            new Date(
              this.rangedates.getFullYear(),
              this.rangedates.getMonth() + 1,
              0
            )
          ).format('YYYY-MM-DD')
        : null,
      invoiceno: rowData.invoiceNo,
    };

    console.log('payload for GetCompanyInvoiceCharges--', payload);
    this.searchFilterPayload = payload;
  }

  getInvoiceSettleData(companyInvoiceId: any) {
    debugger;
    this.companyInvoiceId = companyInvoiceId;
    if (this.InvoiceList.length > 0) {
      this.invoiceService
        .GetInvoiceSettlement(companyInvoiceId)
        .subscribe((x: any) => {
          console.log(x.response);

          if (x.response.length > 0) {
            debugger;
            this.dynamicArray = x.response.map((item: any) => {
              return {
                amount: item.amount,
                tdsAmount: item.tdsAmount,
                utrNumber: item.utrNumber,
                paymentDate: item.paymentDate ? new Date(item.paymentDate) : '', // Convert to ISO string
                isSattled: item.isSattled,
                Id: item.id,
              } as InvoiceSettlementResponseDc;
            });
          } else {
            debugger;
            this.dynamicArray = [];
            this.dynamicArray.push({
              amount: '',
              tdsAmount: '',
              utrNumber: '',
              paymentDate: '',
              isSattled: false,
              Id: 0,
            });
          }
          console.log(this.dynamicArray);
        });
        const dynamicArrayString = localStorage.getItem('DynamicArray');
        if (dynamicArrayString) {
          this.dynamicArray = JSON.parse(dynamicArrayString) as InvoiceSettlementResponseDc[];
          console.log(this.dynamicArray);
          
        }  
    }
  }

  onsaveInvoiceSttlement() {
    debugger;
    // Validate that all dynamicArray entries are filled
    var confirmbtn = confirm('Do you want to Save Record?');
    if (confirmbtn == true) {
      const allEntriesFilled = this.dynamicArray.every((entry: any) => {
        return (
          entry.amount &&
          entry.tdsAmount &&
          entry.utrNumber &&
          entry.paymentDate
        );
      });
  
      if (!allEntriesFilled || this.dynamicArray.length == 0) {
        debugger;
        alert('Please ensure all fields are filled in each invoice entry.');
        return;
      }
  
      // Check for duplicate UTR numbers
      const utrNumbers = this.dynamicArray.map((entry: any) => entry.utrNumber);
      const uniqueUtrNumbers = new Set(utrNumbers);
      if (utrNumbers.length !== uniqueUtrNumbers.size) {
        alert('UTR numbers must be unique in each invoice entry.');
        return;
      }
  
      if (this.getTotalAmount() <= this.InvoiceList[0].amount) {
        this.dynamicArray = this.dynamicArray.map((entry: any) => {
          const paymentDate = new Date(entry.paymentDate);
          paymentDate.setDate(paymentDate.getDate() + 1);
          const updatedPaymentDate = paymentDate.toISOString().split('T')[0];
  
          return {
            ...entry,
            paymentDate: updatedPaymentDate, // Update the paymentDate
          };
        });
  
        const payload = {
          InvoiceSettlementDatas: this.dynamicArray,
          CompanyInvoiceId: this.companyInvoiceId,
        };
  
        console.log(payload);
        this.Loader = true;
        this.invoiceService
          .SettleCompanyInvoiceTransactions(payload)
          .subscribe((x: any) => {
            this.Loader = false;
            console.log(x);
            alert(x.message);
            this.isSettleinvoice = false;
          });
      } else {
        alert(
          'Settle (Amount + TDS Amount) should be less than the Invoice Amount'
        );
      }
    }
  }
  
}

export interface GetList {
  amount: any;
  statusName: any;
  paymentDate: any;
  paymentRefNo: any;
  invoiceDate: any;
  invoiceNo: any;
  nbfcName: any;
  invoiceUrl: any;
  referenceNo: any;
}

export interface CompanyInvoicesChargesResponseDc {
  processingFee: any;
  interestCharges: any;
  overDueInterest: any;
  penalCharges: any;
  bounceCharges: any;
  totalTaxableAmount: any;
  totalGstAmount: any;
  totalInvoiceAmount: any;
}
interface InvoiceSettlementResponseDc {
  amount: string;
  tdsAmount: string;
  utrNumber: string;
  paymentDate: string;
  isSattled: boolean;
  Id: any;
}
