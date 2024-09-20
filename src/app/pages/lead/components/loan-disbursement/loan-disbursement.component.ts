import { Component, OnInit, Input } from '@angular/core';
import { LeadService } from '../../services/lead.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-loan-disbursement',
  templateUrl: './loan-disbursement.component.html',
  styleUrls: ['./loan-disbursement.component.scss']
})
export class LoanDisbursementComponent implements OnInit{
    @Input() isComplete : any;
    @Input() activityMasterId : any;
    @Input() subActivityMasterId : any;
    @Input() isApproved : any=0;
    @Input() isRejected: boolean=false;
    @Input() isRejectDoc: boolean=false;
    leadData:any;
    Loader:boolean=false;
    isVerified:boolean=false;
    DisbursalProposalData:any;
    Comment:any;
    leadId:any;
    constructor(private activatedroute:ActivatedRoute,private _leadService: LeadService, private confirmationService: ConfirmationService, private messageService: MessageService){

    }
    ngOnInit(): void {
        this.isVerified = this.isApproved == 1 ? true : false;
        this.isRejected = this.isApproved == 2 ? true : false;
        this.leadId = this.activatedroute.snapshot.paramMap.get('leadId');
        if(this.isComplete == true){
            this.GetDisbursementProposal(this.leadId)
        }
    }

    GetDisbursementProposal(leadId:number){
        this.Loader = true;
         this._leadService.GetDisbursementProposal(leadId).subscribe((res:any)=>{     
            this.Loader = false;
            if(res.status){
                this.DisbursalProposalData=res.response;
            }
        },(error:any) => {
            this.Loader = false;
        });
    }

    onClickApproved(){
        this.Loader = true;
        let payload={
            leadId:this.leadId,
            Webhookresposne:''
        }
        this._leadService.PostDisbursement(payload).subscribe((res:any) => {
            this.Loader = false;
            if (res.status) {
                this.messageService.add({ severity: 'success', summary: res.message, detail: '' });
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
            else {
                this.messageService.add({ severity: 'error', summary: res.message, detail: '' });
            }
        },(error:any) => {
            this.Loader = false;
        })
    }

    onClickReject(){
        this.isRejectDoc=true
    }
    onReject(){    
        this.Loader = true;
        let payload={
            LeadId:this.leadId,
            RejectReason:this.Comment
        }
        this._leadService.DisbursementReject(payload).subscribe(res => {
            this.Loader = false;
            if (res.response > 0) {
                this.messageService.add({ severity: 'success', summary: res.message, detail: '' });
            }
            else {
                this.messageService.add({ severity: 'error', summary: res.message, detail: '' });
            }
            this.isRejectDoc=false;
        })
    }
}
