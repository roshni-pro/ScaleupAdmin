import { Component, EventEmitter, Output } from '@angular/core';
import { forkJoin } from 'rxjs';
// @ViewChild('dt') dt: Table | undefined;
// import { Table } from 'primeng/table'
import { ActivatedRoute, Router } from '@angular/router';

import { InvoiceGenerationService } from '../services/invoice-generation.service';
import { ExportService } from 'app/shared/scale-up-shared/services/export.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as moment from 'moment';

@Component({
  selector: 'app-invoice-approval',
  templateUrl: './invoice-approval.component.html',
  styleUrls: ['./invoice-approval.component.scss'],
})
export class InvoiceApprovalComponent {
  totalrecord: any;
  first: number = 0;
  dayList: any;
  skip: any;
  take: any;
  showcheckbox: boolean = false;
  invoiceDetailList: any;
  objToStore: any;
  selectedInvoices: any[] = [];
  invoiceno: any;
  Loader: boolean = false;
  searchPayload: any;
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
  constructor(
    private invoiceServie: InvoiceGenerationService,
    private activatedRoute: ActivatedRoute,
     private exportService: ExportService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.dayList = [
      { value: 1, label: 'Today' },
      { value: 2, label: 'This Week' },
      { value: 3, label: 'Mtd' },
      { value: 4, label: 'Year' },
    ];
  }

  ngOnInit() {
    this.invoiceno = localStorage.getItem('Invoiceno');
    var payload = localStorage.getItem('searchfilter');
    if (payload != null) {
      this.searchPayload = JSON.parse(payload);

    }

    this.getCompanyInvoiceDetails();
  }

  navigate() {
    this.router.navigateByUrl('/pages/invoice-master/invoice-generation');
    // window.history.back()

  }
  getCompanyInvoiceDetails() {
    const obj = {
      InvoiceNo: this.invoiceno,
      RoleName: '',
    };
    this.Loader = true;

    this.invoiceServie.GetCompanyInvoiceDetails(obj).subscribe((x: any) => {
      this.Loader = false;

      if (x) {
        this.invoiceDetailList = x.response;
        // this.showcheckbox = x?.response[0].isCheckboxVisible;

        if (x.response != null) {
          this.totalrecord = x.response.length;
          this.showcheckbox = x?.response[0].isCheckboxVisible;
        }
        console.log(x);
        this.GetCompanyInvoiceCharges()
      }
    });
  }





  updateInvoiceStatus(isApproved: boolean) {
    debugger;

    // Show confirmation dialog
    const allInactive = this.invoiceDetailList.every(
      (invoice: any) => !invoice.isActive
    );
    if (allInactive) {
      this.messageService.add({
        severity: 'error',
        summary: 'Please select atleast checkbox to proceed... ',
        life: 3000,
      });
      return;
    }
    this.confirmationService.confirm({
      message: 'Are you sure you want to proceed?',
      accept: () => {
        if (!allInactive) {
          // Proceed with updating the invoice status

          const detailsArray = this.invoiceDetailList.map((invoice: any) => ({
            accountTransactionId: invoice.accountTransactionId,
            active: invoice.isActive,
          }));

          const request = {
            CompanyInvoiceId: this.invoiceDetailList[0].companyInvoiceId,
            IsApproved: isApproved,
            UpdateCompanyInvoiceDetailsRequestDC: detailsArray,
            UserId: '',
            UserType: '',
          };

          const payload = { request };
          console.log(request);

          this.Loader = true;
          this.invoiceServie
            .UpdateCompanyInvoiceDetails(payload)
            .subscribe((response: any) => {
              this.Loader = false;
              console.log(response);
              if (response.status) {
                this.messageService.add({
                  severity: 'success',
                  summary: response.message,
                  life: 3000,
                });
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: response.message,
                  life: 3000,
                });
              }

              this.getCompanyInvoiceDetails();
            });

          setTimeout(() => {
            
            window.close();


          }, 3000);

        }
       
      },
      reject: () => {
      
      },
    });
  }

  exportdata: any;

  export() {
    debugger;
    var i = 0;

    this.exportdata = this.invoiceDetailList.map(function (a: any) {
      i = i + 1;
      return {
        'SR NO': i,
        'Invoice ID': a.companyInvoiceId,
        'Invoice No': a.invoiceNo,
        'Invoice Date': moment(a.invoiceDate).format('DD/MM/yyyy'), 
        'NBFC Name': a.nbfcName,
        'Anchor Name': a.anchorName,
        'ProcessingFeeScaleupShare': a.processingFeeScaleupShare,
        'InterestScaleupShare': a.interestScaleupShare,
        'BounceScaleupShare': a.bounceScaleupShare,
        'PenalScaleupShare': a.penalScaleupShare,
        'OverDueInterestScaleupShare': a.overDueInterestScaleupShare,

        'TotalScaleupShare.': a.scaleupShare,


        'Pf': a.processingFeeTotal,
        'Interest': a.interestTotal,
        'Bounce': a.bounceTotal,
        'Penalty': a.penalTotal,
        'OverDueInterest':a.overDueInterestTotal,
        'Gst': a.gst,
        'Taxable Amount':parseFloat((Number.parseFloat(a.scaleupShare)).toFixed(2)),
        'Invoice Amount': a.invoiceAmount,
        'TopUpNumber': a.topUpNumber,
        'ThirdPartyTxnId':a.thirdPartyTxnId

      };
    });

    this.exportService.exportAsExcelFile(this.exportdata, 'invoiceDetailList List');
  }

  GetCompanyInvoiceCharges() {

    debugger
    // let newKey = 'invoiceno';
    // let newValue = this.invoiceno;
    // this.searchPayload[newKey] = newValue;  
      console.log('payload for GetCompanyInvoiceCharges--', this.searchPayload);
    this.Loader = true;
    this.invoiceServie.GetCompanyInvoiceCharges(this.searchPayload).subscribe(
      (result: any) => {
        this.Loader = false;
        this.CompanyInvoiceCharges = result.response[0];
        console.log('this.CompanyInvoiceCharges', result);
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'error in GetCompanyInvoiceCharges-!',
        });
        this.Loader = false;
      }
    );
    // }
  }

  onCheckboxSelection(e:any,accountTransactionId:any,ischeckbox:boolean){
    console.log(e);
    // var ischeckbox =true;
    
    this.invoiceServie.GetCompanyInvoiceStatusList(accountTransactionId).subscribe((x:any)=>{
      console.log(x);
      var total = 0;
    x.result.forEach((element:any) => {
      
      switch(element.transactionTypeId) {
        case InvoiceTransactionTypeEnum.ProcessingFee:
          if(ischeckbox) this.CompanyInvoiceCharges.processingFee += element.amount
          else this.CompanyInvoiceCharges.processingFee -=element.amount;
                    break;

        case InvoiceTransactionTypeEnum.Interest:
          if(ischeckbox) this.CompanyInvoiceCharges.interestCharges += element.amount
          else this.CompanyInvoiceCharges.interestCharges -=element.amount;
                    break;         

          case InvoiceTransactionTypeEnum.ODInterest:
            if(ischeckbox) this.CompanyInvoiceCharges.overDueInterest += element.amount
            else this.CompanyInvoiceCharges.overDueInterest -=element.amount;
                      break;  

          case InvoiceTransactionTypeEnum.Penal:
            if(ischeckbox) this.CompanyInvoiceCharges.penalCharges += element.amount
            else this.CompanyInvoiceCharges.penalCharges -=element.amount;
                      break;  

          case InvoiceTransactionTypeEnum.Bounce:
            if(ischeckbox) this.CompanyInvoiceCharges.bounceCharges += element.amount
            else this.CompanyInvoiceCharges.bounceCharges -=element.amount;
                      break;  

        default:
          // code block
      }
      total += element.amount

    });
    debugger
    if(ischeckbox) 
      {
        this.CompanyInvoiceCharges.totalTaxableAmount += total;
        this.CompanyInvoiceCharges.totalGstAmount = this.CompanyInvoiceCharges.totalTaxableAmount*0.18;
      }
      else 
      {
        this.CompanyInvoiceCharges.totalTaxableAmount -= total;
        this.CompanyInvoiceCharges.totalGstAmount = this.CompanyInvoiceCharges.totalTaxableAmount*0.18;
      }
      this.CompanyInvoiceCharges.totalInvoiceAmount = this.CompanyInvoiceCharges.totalTaxableAmount + this.CompanyInvoiceCharges.totalGstAmount;
  });

}
}

interface UpdateCompanyInvoiceDetailsRequestDC {
  accountTransactionId: number;
  active: boolean;
}

interface UpdateCompanyInvoiceRequestDC {
  companyInvoiceId: number;
  userType: string;
  isApproved: boolean;
  updateCompanyInvoiceDetailsRequestDC: UpdateCompanyInvoiceDetailsRequestDC[];
  userId: string;
}

interface request {
  UpdateCompanyInvoiceRequestDC: UpdateCompanyInvoiceRequestDC;
}

 interface CompanyInvoicesChargesResponseDc {
  processingFee: any;
  interestCharges: any;
  overDueInterest: any;
  penalCharges: any;
  bounceCharges: any;
  totalTaxableAmount: any;
  totalGstAmount: any;
  totalInvoiceAmount: any;
}

 enum InvoiceTransactionTypeEnum
{
    ProcessingFee = 1,
    Interest =2,
    ODInterest = 3,
    Penal = 4,
    Bounce = 5
}