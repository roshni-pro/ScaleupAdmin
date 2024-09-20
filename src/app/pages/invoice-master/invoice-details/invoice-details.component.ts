import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../services/invoice.service';
import { ActivatedRoute, Params } from '@angular/router';
import { LoanService } from 'app/pages/loan-account/services/loan.service';
import { ConfirmationService, MessageService } from 'primeng/api';
@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss']
})
export class InvoiceDetailsComponent implements OnInit {

  invoiceDetailList: any[] = [];
  totalrecord: number = 0;
  invoiceId: any;
  Loader: boolean = false;

  constructor(private invoiceService: InvoiceService, private activatedRoute: ActivatedRoute,private loanService :LoanService,private messageService :MessageService) { }

  ngOnInit(): void {
    this.invoiceId = this.activatedRoute.snapshot.paramMap.get('invoiceId');
    this.getInvoiceDetails();
    this.setDefaultDetails();
  }

  basicDetails: any;
  setDefaultDetails() {
    let tempInvoiceArr: any = localStorage.getItem('invoiceDetails');
    tempInvoiceArr = tempInvoiceArr ? JSON.parse(tempInvoiceArr) : null;
    if (tempInvoiceArr && tempInvoiceArr.length > 0) {
      this.basicDetails = tempInvoiceArr.filter( (x: any) => x.invoiceId == this.invoiceId)[0];
      console.log(this.basicDetails,"basicDetailsssssssssssss")
    }
  }

  ClearInitiateLimit(transaction:any) {
    debugger
    this.Loader = true;
    this.loanService.ClearInitiateLimitByReferenceId(this.basicDetails.loanAccountId,transaction.referenceId)
      .subscribe((x: any) => {
        this.Loader = false;
        console.log(x.result);
        if (x.status) {
          this.messageService.add({ severity: 'success', summary: x.message, detail: '' });
          window.location.reload();
        } else {
          this.messageService.add({ severity: 'error', summary: x.message, detail: '' });
          // alert("Error - ClearInitiateLimit");
          alert(x.message);
        }
      });
  }

  getInvoiceDetails() {
    this.Loader = true;
    this.invoiceService.InvoiceDetail(this.invoiceId).subscribe((res: any) => {
      this.Loader = false;
      if (res) {
        console.log("InvoiceDetail", res);
        if (res.result && res.result.length > 0) {
          this.totalrecord = res.result.length;
          this.invoiceDetailList = res.result;
        } else {
          this.totalrecord = 0;
          this.invoiceDetailList = [];
        }
      }
    }, (err: any) => {
      this.Loader = false;
      alert("error API - InvoiceDetail");
    })
  }

  detailsPopup: boolean = false;
  invoiceDetails: any[] = [];
  openDetailsPopup(transaction: any) {
    this.detailsPopup = true;
    this.TransactionDetailByInvoiceId(transaction);
  }

  TransactionDetailByInvoiceId(transaction: any) {
    this.Loader = true;
    this.invoiceService.TransactionDetailByInvoiceId(transaction.invoiceId, transaction.transactionType).subscribe((res: any) => {
      this.Loader = false;
      if (res) {
        console.log('TransactionDetailByInvoiceId', res);
        if (res.result && res.result.length > 0) {
          this.invoiceDetails = res.result;
          // this.totalrecord = res.result.length;
          // this.invoiceDetailList = res.result;
        } else {
          this.invoiceDetails = [];
          // this.totalrecord = 0;
          // this.invoiceDetailList = [];
        }
      }
    }, (err: any) => {
      this.Loader = false;
      alert("error API - TransactionDetailByInvoiceId");
    })
  }





}
