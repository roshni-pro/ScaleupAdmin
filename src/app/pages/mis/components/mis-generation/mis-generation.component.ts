 import { Component } from '@angular/core';
import { MisService } from '../../services/mis.service';
import * as moment from 'moment';
import { ExportService } from 'app/shared/scale-up-shared/services/export.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-mis-generation',
  templateUrl: './mis-generation.component.html',
  styleUrls: ['./mis-generation.component.scss']
})
export class MisGenerationComponent {
  AnchorList: any = []
  nbfcList: any = []
  dsaList: any = []
  selectedNbfc: any
  selectedAnchor: any
  selectedDsa: any
  Loader: boolean = false;
  rangeDatesAnchorFrom: any
  rangeDatesAnchorTo: any
  rangeDatesNbfcFrom: any
  rangeDatesNbfcTo: any
  rangeDatesDsaFrom: any
  rangeDatesDsaTo: any
  rangeDatesInvoiceFrom: any
  rangeDatesInvoiceTo: any
  constructor(
    private _misService: MisService,
    private _export: ExportService,
    private messageService: MessageService,

  ) {
    // this.AnchorCityProductList();
    this.getcompanyDropdown();
    this.GetAllCompanyList();

  }
  GetProductMasterList(){

  }
  GetAllCompanyList() {
    this._misService.GetAllCompanyList().subscribe((res: any) => {
      console.log(res.response);
      res.response.forEach((ex: any) => {
        const companyType = ex.companyType.toLowerCase();
        const isDsa = ex.isDSA
        if (companyType.includes("anchor") && !isDsa) {
          this.AnchorList.push(ex);
        }
        if (companyType.includes("nbfc") && !isDsa) {
          this.nbfcList.push(ex);
        }
        if (isDsa) {
          this.dsaList.push(ex);
        }
      });
    })
    console.log('this.AnchorList', this.AnchorList);
    console.log('this.nbfc', this.nbfcList);
    console.log('this.dsa', this.dsaList);
  }


  AnchorCityProductList() {

    let payload = {
      "keyword": null,
      "skip": 0,
      "take": 10,
      "CompanyType": "Anchor"
    }
    this.Loader = true;
    this._misService.getDashboardCompanyList(payload).subscribe((x: any) => {
      console.log(x);
      this.Loader = false;
      this.AnchorList = x.returnObject;
    })

  }

  // getcompanyDropdown() {
  //   // this.Loader = true;
  //   this._misService.getnbfcDropdown().subscribe((res: any) => {
  //     if (res.status) {
  //       this.nbfcList = res.returnObject;
  //       // this.Loader = false;
  //       console.log('nbfcList', res);
  //     }
  //   });
  // }

    getcompanyDropdown() {
    // this.Loader = true;
    this._misService.GetProductMasterList().subscribe((res: any) => {
      if (res.status) {
        this.nbfcList = res.returnObject;
        // this.Loader = false;
        console.log('nbfcList', res);
      }
    });
  }

  GetAnchorMISList() {
    console.log(this.selectedAnchor)
    if (this.selectedAnchor && this.rangeDatesAnchorFrom && this.rangeDatesAnchorTo) {
      let payload = {
        "AnchorId": this.selectedAnchor ? this.selectedAnchor : 0,
        "Status": "ALL",
        "FromDate": moment(this.rangeDatesAnchorFrom).format('YYYY-MM-DD'),
        "ToDate": moment(this.rangeDatesAnchorTo).format('YYYY-MM-DD'),
      }
      this._misService.GetAnchorMISList(payload).subscribe((res: any) => {
        console.log(res);

        if (res && res.response && res.response.length > 0) {
          this._export.exportAsExcelFile(res.response, 'AnchorMISList')
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'No Data Found ', detail: '' });

        }

      })
    }
    else {
      if (!this.selectedAnchor || this.selectedAnchor == 0) {
        this.messageService.add({ severity: 'error', summary: 'Select Anchor! ', detail: '' });
      }
      else if (!this.rangeDatesAnchorFrom) {
        this.messageService.add({ severity: 'error', summary: 'Select From Date For Anchor! ', detail: '' });
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Select To Date For Anchor! ', detail: '' });
      }
    }
  }
  GetNbfcMISList() {
    if (this.selectedNbfc && this.rangeDatesNbfcFrom && this.rangeDatesNbfcTo) {

      let payload = {
        "NbfcCompanyId": this.selectedNbfc ? this.selectedNbfc : 0,
        "FromDate": moment(this.rangeDatesNbfcFrom).format('YYYY-MM-DD'),
        "ToDate": moment(this.rangeDatesNbfcTo).format('YYYY-MM-DD'),
      }
      this._misService.GetNbfcMISList(payload).subscribe((res: any) => {
        console.log(res)

        if (res && res.response && res.response.length > 0) {
          this._export.exportAsExcelFile(res.response, 'NbfcMISList')
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'No Data Found ', detail: '' });

        }
      })
    }
    else {
      if (!this.selectedNbfc || this.selectedNbfc == 0) {
        this.messageService.add({ severity: 'error', summary: 'Select NBFC! ', detail: '' });
      }
      else if (!this.rangeDatesNbfcFrom) {
        this.messageService.add({ severity: 'error', summary: 'Select From Date For NBFC! ', detail: '' });
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Select To Date For NBFC! ', detail: '' });
      }
    }

  }

  GetDsaMISList() {
    if ( this.rangeDatesDsaFrom && this.rangeDatesDsaTo) {

      let payload = {
        "DSACompanyId": this.selectedDsa ? this.selectedDsa : 0,
        "FromDate": moment(this.rangeDatesDsaFrom).format('YYYY-MM-DD'),
        "ToDate": moment(this.rangeDatesDsaTo).format('YYYY-MM-DD'),
      }
      //api

      this._misService.GetDsaMISList(payload).subscribe((res: any) => {
        console.log(res)

        if (res && res.response && res.response.length > 0) {
          let data:any=[]
          res.response.forEach((ex:any,index:number)=>{
            let obj={
              'SR NO.':index+1 ,
              'STATE':ex.state ,
              'LOCATION':ex.location ,
              'TYPE (Agent/Connector)':ex.userType ,
              'SA/SC NAME':ex.salesAgentName ,
              'SA/SC PAN':ex.salesAgentPanNo ,
              'SA/SC CODE':ex.salesAgentCode ,
              'SCALEUP CODE':ex.scaleUpCode ,
              'CUSTOMER NAME':ex.customerName ,
              'LOGIN DATE':ex.loginDate ,
              'LAN':ex.lan ,
              'LENDER':ex.lender ,
              'DISBURSED DATE':ex.disbursedDate ,
              'SANCTION AMOUNT ':ex.sanctionAmount ,
              'DISBURSED AMOUNT':ex.disbursedAmount ,
              'PAYOUT %':ex.payoutPecentage ,
              'AMOUNT':ex.amount ,
              'GST':ex.gstAmount ,
              'TOTAL AMOUNT':ex.totalAmount ,
              'TDS (5%)':ex.tdsAmount ,
              'NET PAYOUT': ex.netPayoutAmount
            } 

            data.push(obj)
          })
          this._export.exportAsExcelFile(data, 'DSAMisList')
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'No Data Found ', detail: '' });

        }
      })
    }
    else {
      // if (!this.selectedDsa || this.selectedDsa == 0) {
      //   this.messageService.add({ severity: 'error', summary: 'Select Dsa ! ', detail: '' });
      // }
      // else
       if (!this.rangeDatesDsaFrom) {
        this.messageService.add({ severity: 'error', summary: 'Select From Date For Dsa ! ', detail: '' });
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Select To Date For Dsa ! ', detail: '' });
      }
    }
  }

  GetInvoiceRegisterData() {

    if (this.rangeDatesInvoiceFrom && this.rangeDatesInvoiceTo) {
      let payload = {
        "StartDate": moment(this.rangeDatesInvoiceFrom).format('YYYY-MM-DD'),
        "EndDate": moment(this.rangeDatesInvoiceTo).format('YYYY-MM-DD'),
      }
      this.Loader = true;
      this._misService.GetInvoiceRegisterData(payload).subscribe((res: any) => {

        console.log(res)
        if (res && res.response && res.response.length > 0) {
          this.Loader = false;
          var i = 0;
          let exportdata: any[] = res.response.map(function (a: any) {
            i = i + 1;
            return {
              'SR NO': i,
              "Invoice Date": a.invoiceDate,
              "Invoice Number": a.invoiceNumber,
              "Month": a.month,
              "customer Name": a.customerName,
              "Customer City (State)": a.customerCityState,
              "Customer GSTIN": a.customerGSTIN,
              "Description": a.description,
              "SAC": a.sac,
              "Taxable Amount": a.taxableAmount,
              "CGST %": a.cgstPercentage,
              "SGST %": a.sgstPercentage,
              "IGST %": a.igstPercentage,
              "CGST Amount": a.cgstAmount,
              "SGST Amount": a.sgstAmount,
              "IGST Amount": a.igstAmount,
              "Invoice Amount": a.invoiceAmount,
              "TDS Amount": a.tdsAmount,
              "Net Receivable": a.netReceivable,
              "Status": a.status,
            };
          });
          console.log(exportdata, 'InvoiceRegister');
          this._export.exportAsExcelFile(exportdata, 'InvoiceRegister Export Data')
        }
        else {
          this.Loader = false;
          this.messageService.add({ severity: 'error', summary: 'No Data Found ', detail: '' });
        }
      }, (error: any) => {
        this.Loader = false;
        console.log(error);

      })
    }
    else {
      if (!this.rangeDatesInvoiceFrom) {
        this.messageService.add({ severity: 'error', summary: 'Select From Date For Invoice! ', detail: '' });
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Select To Date For Invoice! ', detail: '' });
      }
    }
  }
}
