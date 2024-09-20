import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { LeadService } from '../../services/lead.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-pan-details',
    templateUrl: './pan-details.component.html',
    styleUrls: ['./pan-details.component.scss']
})
export class PanDetailsComponent implements OnInit {
    @Input() IsOfferGeneratedFlag: any;
    @Input() isComplete: any;
    @Input() activityMasterId: any;
    @Input() subActivityMasterId: any;
    @Input() isApproved: any = 0;
    @Input() isRejected: any = this.isApproved == 2 ? true : false;
    @Input() isRejectDoc: boolean = false;
    @Output() onApprovePANInfo: EventEmitter<any> = new EventEmitter<any>();
    @Output() onRejectPANInfo: EventEmitter<any> = new EventEmitter<any>();
    isVerified: boolean = this.isApproved == 1 ? true : false;
    Img: any;
    panDataDc: any
    leadData: any
    fathername: any
    loader: boolean = false;
    Comment: any;
    showUrl: any;
    showImage: boolean = false;
    leadId: any;

    constructor(private _leadservice: LeadService,
        private router: ActivatedRoute, private messageService: MessageService) {
    }
    ngOnInit(): void {
        this.router.queryParamMap.subscribe(params => {
            this.panDataDc = params.get('PanData');
        });
        this.panDataDc = JSON.parse(this.panDataDc)

        this.leadId = this.router.snapshot.paramMap.get('leadId');

        this.isVerified = this.isApproved == 1 ? true : false;
        this.isRejected = this.isApproved == 2 ? true : false;
    }

    onRejectDoc() {
        this.isRejectDoc = true;
    }
    onApproved() {
        var IsApprove = false;
        if (this.panDataDc?.uniqueId != null && this.panDataDc?.nameOnCard != null && this.panDataDc?.fatherName != null && this.panDataDc?.dob != null) {
            IsApprove = true;
        }
        else {
            IsApprove = false;
            this.messageService.add({ severity: 'error', summary: 'Please Fill Required fields', detail: '' });
        }

        if (IsApprove == true) {

            let payload = {
                "LeadId": this.leadId,
                "ActivityMasterId": this.activityMasterId,
                "SubActivityMasterId": this.subActivityMasterId,
                "IsApprove": 1,
                "Comment": 'Approve'
            }

            this.onApprovePANInfo.emit(payload);
        }

    }
    onReject() {
        if(this.Comment != null  && this.Comment != ''){
            this.Comment = this.Comment.trim()
        }
        if (this.Comment != null && this.isFirstLetterNotSpace(this.Comment)) {
            let payload = {
                "LeadId": this.leadId,
                "ActivityMasterId": this.activityMasterId,
                "SubActivityMasterId": this.subActivityMasterId,
                "IsApprove": 2,
                "Comment": this.Comment
            }
            console.log(payload, 'reject payload');

            this.onRejectPANInfo.emit(payload)
        }
        else {
            this.messageService.add({ severity: 'error', summary: 'Please Fill Message', detail: '' });
        }
    }
    show(input: string) {
        this.showImage = true;
        this.showUrl = input;
    }
    download(value: any) {
        window.open(value);
    }

    isFirstLetterNotSpace(sentence: string) {
        // Check if the first character is not a space
        return /^\S/.test(sentence);
    }
    cancel(){
        this.Comment=null;
    }
}
