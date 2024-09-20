import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
@Component({
    selector: 'app-bank-details',
    templateUrl: './bank-details.component.html',
    styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent implements OnInit {
    bankStatementCreditLendingDeail: any;
    @Input() isComplete: any;
    @Input() activityMasterId: any;
    @Input() subActivityMasterId: any;
    @Input() isApproved: any = 0;
    @Input() isRejected: boolean = false;
    @Input() isRejectDoc: boolean = false;
    @Output() onApproveBankInfo: EventEmitter<any> = new EventEmitter<any>();
    @Output() onRejectBankInfo: EventEmitter<any> = new EventEmitter<any>();
    isVerified: boolean = this.isApproved == true ? true : false;
    Comment: any;
    isUpload: boolean = false;
    baseURL: any;
    bankDataDc: any;
    bankData: any;
    bankStatementCreditLendingDetailDc: any
    bankStatementDetails: any;
    leadId: any
    constructor(private activatedroute: ActivatedRoute, private messageService: MessageService) {
    }
    ngOnInit(): void {
        this.activatedroute.queryParamMap.subscribe(params => {
            this.bankStatementCreditLendingDeail = params.get('BankStatementCreditLendingDeail');
            this.bankStatementDetails = params.get('BankStatementDetail');
        });
        this.bankStatementCreditLendingDetailDc = JSON.parse(this.bankStatementCreditLendingDeail)
        this.bankStatementDetails = JSON.parse(this.bankStatementDetails)

        // this.bankStatementDetails = something;

        console.log(this.bankStatementCreditLendingDetailDc,'this.bankStatementCreditLendingDetailDc');
        
        this.leadId = this.activatedroute.snapshot.paramMap.get('leadId');
        this.isVerified = this.isApproved == 1 ? true : false;
        this.isRejected = this.isApproved == 2 ? true : false;
    }

    onReject() {
        // this.Comment=this.Comment.trim()
        if(this.Comment != null  && this.Comment != ''){
            this.Comment = this.Comment.trim()
        }
        if(this.Comment != null && this.isFirstLetterNotSpace(this.Comment)){

            let payload = {
                "LeadId": this.leadId,
                "ActivityMasterId": this.activityMasterId,
                "SubActivityMasterId": this.subActivityMasterId,
                "IsApprove": 2,
                "Comment": this.Comment
            }
            this.onRejectBankInfo.emit(payload)
        }
        else{
            this.messageService.add({ severity: 'error', summary: 'Please Fill Message', detail: '' });
        }
    }
    IsApprove:boolean= false;
    onApproved() {
        debugger
        // var IsApprove = false;
        if(this.bankStatementDetails.length > 0 && this.bankStatementDetails != null){
            this.bankStatementDetails.forEach((x:any)=>{
                if(x?.borroBankName != null && x?.borroBankAccNum != null && x?.borroBankIFSC != null && x?.accountHolderName != null && x?.accType != null ){
                    if(x.isEnach == true)
                    this.IsApprove = true;
                }
            })
            if(!this.IsApprove){
                this.messageService.add({ severity: 'error', summary: 'E-Nach Bank Details is Missing', detail: '' });
            }
        }   
        else{
            // this.IsApprove = false;
            // this.messageService.add({ severity: 'error', summary: 'Please Fill Required fields', detail: '' });
        }

        // return false;
        if(this.IsApprove == true){

            let payload = {
                "LeadId": this.leadId,
                "ActivityMasterId": this.activityMasterId,
                "SubActivityMasterId": this.subActivityMasterId,
                "IsApprove": 1,
                "Comment": 'Approve'
            }
            this.onApproveBankInfo.emit(payload);
        }
        else{
            this.messageService.add({ severity: 'error', summary: 'Please Fill Required fields', detail: '' });
        }
    }

    onRejectDoc() {

        this.isRejectDoc = true;
    }

    OpenPdf(item: any) {
        window.open(item.imageUrl);
    }
    isFirstLetterNotSpace(sentence:string) {
        // Check if the first character is not a space
        return /^\S/.test(sentence);
    }
    cancel(){
        this.Comment=null;
    }

    checkURL(url:any) {
        debugger;
        return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    }
    showUrl: any;
    showImage: boolean = false;
    show(input: string) {
        this.showImage = true;
        this.showUrl = input;
    }
    download(value: any) {
        window.open(value);
    }
}
