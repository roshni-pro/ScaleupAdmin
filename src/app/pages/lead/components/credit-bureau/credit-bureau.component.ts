import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-credit-bureau',
    templateUrl: './credit-bureau.component.html',
    styleUrls: ['./credit-bureau.component.scss']
})
export class CreditBureauComponent implements OnInit {
    @Input() isComplete: any;
    @Input() activityMasterId: any;
    @Input() subActivityMasterId: any;
    @Input() isApproved: any = 0;
    @Input() isRejected: boolean = false;
    @Input() isRejectDoc: boolean = false;
    @Output() onApproveCreditBureauInfo: EventEmitter<any> = new EventEmitter<any>();
    @Output() onRejectCreditBureauInfo: EventEmitter<any> = new EventEmitter<any>();
    CreditBureauDetails: any;
    showtableMoreData: boolean = false;
    dataJsonView: boolean = false;
    moretableMoreData: any;
    isVerified: boolean = false;
    Comment: any;
    cibilObj: any;
    leadId: any;

    constructor(private activatedroute: ActivatedRoute, private messageService: MessageService) {

    }

    ngOnInit(): void {

        this.activatedroute.queryParamMap.subscribe(params => {
            this.CreditBureauDetails = params.get('CreditBureauDetails');
        });
        this.CreditBureauDetails = JSON.parse(this.CreditBureauDetails)

        this.leadId = this.activatedroute.snapshot.paramMap.get('leadId');

        if (this.CreditBureauDetails != null) {
            this.cibilObj = JSON.parse(this.CreditBureauDetails.cibiljson);
        }


        this.isVerified = this.isApproved == 1 ? true : false;
        this.isRejected = this.isApproved == 2 ? true : false;

        // let civilAllDataOne = this.kycAllDetails.filter(x => x.DocumentName == 'Cibil')[0]['cibiljson'];
        // this.civilAllData = JSON.parse(civilAllDataOne)['INProfileResponse'];
        // this.jsonDataGet = JSON.parse(civilAllDataOne);

    }

    viewJsonData() {
        this.dataJsonView = true
    }

    splitValue(val: any) {
        var splitval = val.split('/ _ -"');
        return splitval;
    }

    viewCivilDetailsDoc(listdata: any) {
        this.moretableMoreData = listdata;
        this.showtableMoreData = true;
    }
    closemoreDatePOp() {
        this.showtableMoreData = false;
    }
    onApproved() {
        var IsApprove =false;

        if(this.cibilObj != null){
            IsApprove = true;
        }
        else{
            IsApprove = false;
            this.messageService.add({ severity: 'error', summary: 'Credit Bureau Details Not Available', detail: '' });
        }
        if(IsApprove == true){

            let payload = {
                "LeadId": this.leadId,
                "ActivityMasterId": this.activityMasterId ? this.activityMasterId : 0,
                "SubActivityMasterId": this.subActivityMasterId ? this.subActivityMasterId : 0,
                "IsApprove": 1,
                "Comment": 'Approve'
            }
    
            this.onApproveCreditBureauInfo.emit(payload);
        }
    }
    onRejectDoc() {
        this.isRejectDoc = true;
    }
    onReject() {
        // this.Comment=this.Comment.trim()
        if(this.Comment != null  && this.Comment != ''){
            this.Comment = this.Comment.trim()
        }
        if(this.Comment != null && this.isFirstLetterNotSpace(this.Comment)){

            let payload = {
                "LeadId": this.leadId,
                "ActivityMasterId": this.activityMasterId ? this.activityMasterId : 0,
                "SubActivityMasterId": this.subActivityMasterId ? this.subActivityMasterId : 0,
                "IsApprove": 2,
                "Comment": this.Comment
            }
            this.onRejectCreditBureauInfo.emit(payload)
        }
        else{
            this.messageService.add({ severity: 'error', summary: 'Please fill Message', detail: '' });
        }
    }

    isFirstLetterNotSpace(sentence:string) {
        // Check if the first character is not a space
        return /^\S/.test(sentence);
    }
    cancel(){
        this.Comment=null;
    }
}
