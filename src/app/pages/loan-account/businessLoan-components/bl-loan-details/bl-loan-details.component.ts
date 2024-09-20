import { Component } from '@angular/core';
import { LoanDetailsService } from '../../services/loan-details.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-bl-loan-details',
  templateUrl: './bl-loan-details.component.html',
  styleUrls: ['./bl-loan-details.component.scss']
})
export class BlLoanDetailsComponent {
  LoanAccountDetailResponse: any = {
    isAccountActive: false,
  };

  transactionList: any[] = [];
  topFiveTranx: any[] = [];
  totalrecord: number = 0;
  data: any;
  options: any;
  LeadId: any
  Loader: boolean = false;
  constructor(private loanDetailsService: LoanDetailsService, private route: ActivatedRoute,
  ) {
    this.LeadId = this.route.snapshot.paramMap.get('id');

    this.LoanRepaymentScheduleDetails()
    this.GetBusinessLoanDetails()
  }
  load(event: any) { }

  LoanRepaymentScheduleDetails() {
    // let id=65;
    this.Loader = true;
    this.loanDetailsService.LoanRepaymentScheduleDetails(this.LeadId).subscribe((res: any) => {
      console.log(res);
      this.Loader = false;
      if (res.isSuccess) {
        this.transactionList = res.result;
      }
      console.log('this.transactionList', this.transactionList);
    },
      (error: any) => {
        this.Loader = false;
      })
  }
  GetBusinessLoanDetails() {
    // let id=65;
    this.Loader = true;
    this.loanDetailsService.GetBusinessLoanDetails(this.LeadId).subscribe((res: any) => {
      this.Loader = false;
      if (res.isSuccess) {
        this.LoanAccountDetailResponse = res.result;
      }
      console.log('this.LoanAccountDetailResponse', this.LoanAccountDetailResponse);
    }
      ,
      (error: any) => {
        this.Loader = false;
      })
  }

  /* Api section */
  ActiveInactive(event: Event) { }
  BlockUser() { }
  notifyAnchor(event: any) { }
  openLogs() { }
}



