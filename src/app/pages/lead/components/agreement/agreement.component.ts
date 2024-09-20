import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-agreement',
    templateUrl: './agreement.component.html',
    styleUrls: ['./agreement.component.scss']
})
export class AgreementComponent implements OnInit {
    @Input() isComplete: any;
    @Input() activityMasterId: any;
    @Input() subActivityMasterId: any;
    @Input() isApproved: any = 0;
    @Input() isRejected: boolean = false;
    @Input() isRejectDoc: boolean = false;
    AgreementData: any;
    leadData: any;
    isVerified: boolean = false;
    leadId:any;
    constructor(
        private activatedroute:ActivatedRoute
    ) {

    }
    ngOnInit(): void {
        this.activatedroute.queryParamMap.subscribe(params => {
            this.AgreementData=params.get('AgreementDetail');
            this.leadData=params.get('LeadInfo');
        });
        this.AgreementData=JSON.parse(this.AgreementData)
        this.leadData=JSON.parse(this.leadData)
        console.log('this.AgreementDetail',this.AgreementData)

        this.leadId = this.activatedroute.snapshot.paramMap.get('leadId');

        // this.AgreementData = localStorage.getItem('AgreementDetail')
        // if (this.AgreementData != null) {
        //     this.AgreementData = JSON.parse(this.AgreementData)
        // }
        // this.leadData = localStorage.getItem('LeadInfo')
        // this.leadData = JSON.parse(this.leadData)
        this.isVerified = this.isApproved == 1 ? true : false;
        this.isRejected = this.isApproved == 2 ? true : false;
    }
    OpenPdf(item: any) {
        window.open(item);
    }
}
