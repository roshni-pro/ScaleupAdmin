import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { LeadService } from '../../services/lead.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-business-info',
    templateUrl: './business-info.component.html',
    styleUrls: ['./business-info.component.scss']
})
export class BusinessInfoComponent implements OnInit {
    businessData: any;
    @Input() isComplete: any;
    @Input() activityMasterId: any;
    @Input() subActivityMasterId: any;
    @Input() isApproved: any = 0;
    @Input() isRejected: boolean = false;
    @Input() isRejectDoc: boolean = false;
    @Output() onApproveBusinessInfo: EventEmitter<any> = new EventEmitter<any>();
    @Output() onRejectBusinessInfo: EventEmitter<any> = new EventEmitter<any>();
    businessDataDc: any;
    isVerified: boolean = this.isApproved == true ? true : false;
    Comment: any;
    leadId: any;
    constructor(private _leadservice: LeadService,
        private activatedroute: ActivatedRoute, private messageService: MessageService) {

    }
    ngOnInit(): void {
        this.activatedroute.queryParamMap.subscribe(params => {
            this.businessData = params.get('BuisnessDetail');
        });
        this.businessDataDc = JSON.parse(this.businessData)

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
                this.onRejectBusinessInfo.emit(payload)
        }
        else{
            this.messageService.add({ severity: 'error', summary: 'Please Fill Message', detail: '' });
        }
    }

    isFirstLetterNotSpace(sentence:string) {
        // Check if the first character is not a space
        return /^\S/.test(sentence);
    }
    
    onApproved() {
        var IsApprove = false;

        if(this.businessDataDc?.businessName != null && this.businessDataDc?.busEntityType != null && (this.businessDataDc?.busGSTNO != null || this.businessDataDc?.buisnessDocumentNo != null) && this.businessDataDc?.doi != null && this.businessDataDc?.incomeSlab != null && this.businessDataDc?.buisnessProof != null && this.businessDataDc?.buisnessProofUrl != null && this.businessDataDc?.currentAddress?.addressLineOne != null && this.businessDataDc?.currentAddress?.zipCode != null && this.businessDataDc?.currentAddress?.cityName != null && this.businessDataDc?.currentAddress?.stateName != null && this.businessDataDc?.currentAddress?.countryName != null){
            IsApprove = true;
        }
        else{
            IsApprove = false;
            this.messageService.add({ severity: 'error', summary: 'Please Fill Required fields', detail: '' });
        }
        if(IsApprove == true){

            let payload = {
                "LeadId": this.leadId,
                "ActivityMasterId": this.activityMasterId,
                "SubActivityMasterId": this.subActivityMasterId,
                "IsApprove": 1,
                "Comment": 'Approve'
            }
    
            this.onApproveBusinessInfo.emit(payload);
        }
    }
    onRejectDoc() {
        this.isRejectDoc = true;
    }
    // showImage:boolean=false;
    // showUrl:any
    // show(input:string){
    //     this.showImage=true;
    //     this.showUrl=input;
    //   }
    //   download(value:any){
    //     window.open(value);
    //   }

    OpenPdf(pdfurl: any) {
        window.open(pdfurl);
    }
    
    //  onKeydown(event:any) {
    //     if (event.keyCode === 32 ) {
    //       return false;
    //     }
    //     else{
    //         return ;
    //     }
    // }
    cancel(){
        this.Comment=null;
    }
}
