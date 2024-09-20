import { Component } from '@angular/core';
import { CompanyMasterService } from '../services/company-master.service';
import { ToasterMessageService } from 'app/shared/services/toaster-message.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-invoice-fail',
  templateUrl: './invoice-fail.component.html',
  styleUrls: ['./invoice-fail.component.scss'],
})
export class InvoiceFailComponent {
  totalRecords: any;
  invoiceList: any;
  keyword: any;
  isSearch: boolean = false;
  Skip: Number = 0;
  Take: Number = 10;
  first: number = 0;
  display: boolean = false;
  Loader: boolean = false;
  constructor(
    private companyMasterService: CompanyMasterService,
    private toasterService: ToasterMessageService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {}
  load(event: any) {
    this.Take = event.rows;
    this.Skip = event.first;
    this.getInvoiceList(false);
  }
  getInvoiceList(isSearch: boolean) {
    this.Loader = true;
    let obj = {
      Search: this.keyword ? this.keyword : '',
      Skip: isSearch == false ? this.Skip : 0,
      Take: isSearch == false ? this.Take : 10,
    };
    isSearch == true ? (this.first = 1) : null;
    this.totalRecords = 0;
    this.companyMasterService.getInvoiceList(obj).subscribe((x: any) => {
      console.log(x);
      this.Loader = false;
      this.invoiceList = x.invoices;
      this.totalRecords = x.totalRecord;
    });
  }
  invoiceRequestResponse: any;
  getInvoiceRequestResponse(invoiceId: any, loanAccountId: any) {
    this.Loader=true;
    this.companyMasterService
      .getInvoiceRequestResponse(invoiceId, loanAccountId)
      .subscribe((x: any) => {
        this.Loader=false;
        this.invoiceRequestResponse = x;
        console.log(x);
      });
  }
  postNBFCInvoice(invoiceId: any, loanAccountId: any) {
    this.companyMasterService
      .postNBFCInvoice(invoiceId, loanAccountId)
      .subscribe((x: any) => {
        console.log(x);
        if (x.status) {
          this.getInvoiceList(false);
        }
        // alert(x.message);
        this.messageService.add({ severity: 'error', summary: x.message });

      });
  }
  urlSafe: any;
  iframeDisplay: boolean = false;
  onDownload(e: any) {
    if (e != null) {
      window.open(e);
    }
  }

  invoiceId: any;
  loanAccountId: any;
  reqresdisplay: boolean = false;
  // onAction(invoice:any) {
  //   this.display = true;
  //   this.invoiceId=invoice.invoiceId;
  //   this.loanAccountId=invoice.loanAccountId
  // }
  requestResponse(invoiceId: any, loanAccountId: any) {
    this.reqresdisplay = true;
    this.getInvoiceRequestResponse(invoiceId, loanAccountId);
  }
}
