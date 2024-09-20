import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { LeadService } from '../../services/lead.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-aadhar-card-detail',
    templateUrl: './aadhar-card-detail.component.html',
    styleUrls: ['./aadhar-card-detail.component.scss']
})
export class AadharCardDetailComponent implements OnInit {
    aadharData: any;
    @Input() IsOfferGeneratedFlag: any;
    @Input() isComplete: any;
    @Input() activityMasterId: any;
    @Input() subActivityMasterId: any;
    @Input() isApproved: any = 0;
    @Input() isRejectDoc: boolean = false;
    @Output() onApproveAadharInfo: EventEmitter<any> = new EventEmitter<any>();
    @Output() onRejectAadharInfo: EventEmitter<any> = new EventEmitter<any>();
    Img: any;
    isFrontUpload: boolean = false;
    isBackUpload: boolean = false;
    isVerified: boolean = this.isApproved == 1 ? true : false;
    isRejected: boolean = this.isApproved == 2 ? true : false;
    aadharDataDc: any
    Comment: any
    Loader: boolean = false;
    showUrl: any;
    showImage: boolean = false;
    leadId:any;

    constructor(private _leadService: LeadService,
        private activatedroute:ActivatedRoute, private messageService: MessageService) {
    }
    ngOnInit(): void {
        this.activatedroute.queryParamMap.subscribe(params => {
            this.aadharData=params.get('AadharDetail');
        });
        this.aadharDataDc=JSON.parse(this.aadharData)

        this.leadId = this.activatedroute.snapshot.paramMap.get('leadId');
        this.isVerified = this.isApproved == 1 ? true : false;
        this.isRejected = this.isApproved == 2 ? true : false;

    }
    onReject() {
        // this.Comment=this.Comment.trim()
        if(this.Comment != null ){
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
            this.onRejectAadharInfo.emit(payload)
        }
        else{
            this.messageService.add({ severity: 'error', summary: 'Please fill Message', detail: '' });
        }
    }

 
    onApproved() {
       var IsApprove=false
        if(this.aadharDataDc.name != null && this.aadharDataDc.maskedAadhaarNumber != null && this.aadharDataDc.frontImageUrl != null && this.aadharDataDc.backImageUrl != null){
            IsApprove = true;
        }
        else{
            IsApprove = false;
            this.messageService.add({ severity: 'error', summary: 'Please Fill Required fields', detail: '' });
        }
        if(IsApprove == true){

            let payload = {
                "LeadId": this.leadId,
                "ActivityMasterId": this.activityMasterId ? this.activityMasterId : 0,
                "SubActivityMasterId": this.subActivityMasterId ? this.subActivityMasterId : 0,
                "IsApprove": 1,
                "Comment": 'Approve'
            }
    
            this.onApproveAadharInfo.emit(payload);
        }

    }
    onRejectDoc() {
        this.isRejectDoc = true;
    }
    show(input: string) {
        this.showImage = true;
        this.showUrl = input;
    }
    download(value: any) {
        window.open(value);
    }

    isFirstLetterNotSpace(sentence:string) {
        // Check if the first character is not a space
        return /^\S/.test(sentence);
    }
    cancel(){
        this.Comment=null;
    }
}
