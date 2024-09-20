import { Component, OnInit, Input } from '@angular/core';
import { LeadService } from '../../services/lead.service';
import { LoaderService } from 'app/shared/services/loader.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-disbursement-completed',
    templateUrl: './disbursement-completed.component.html',
    styleUrls: ['./disbursement-completed.component.scss']
})
export class DisbursementCompletedComponent implements OnInit {
    @Input() isComplete: any;
    @Input() activityMasterId: any;
    @Input() subActivityMasterId: any;
    @Input() isApproved: any = 0;
    @Input() isRejected: boolean = false;
    @Input() isRejectDoc: boolean = false;
    leadData: any;
    Loader: boolean = false;
    DisbursedData: any;
    leadId: any
    constructor(private _leadService: LeadService, private loader: LoaderService,
        private activatedroute: ActivatedRoute) {

    }
    ngOnInit(): void {
        this.leadData = localStorage.getItem('LeadInfo')
        this.leadData = JSON.parse(this.leadData)
        this.leadId = this.activatedroute.snapshot.paramMap.get('leadId');

        this.GetDisbursement(this.leadId);
    }
    GetDisbursement(leadId: number) {
        this.loader.isLoading(true);
        this.Loader = true;
        this._leadService.GetDisbursement(leadId).subscribe((res: any) => {
            this.loader.isLoading(false);
            this.Loader = false;
            console.log(res, 'res');
            if (res != null) {
                this.DisbursedData = res.response;
            }
        }, (error: any) => { this.Loader = false });
    }
}
