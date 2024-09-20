import { Component, OnInit, Input } from '@angular/core';
import { LeadService } from '../../services/lead.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-prepare-agreement',
    templateUrl: './prepare-agreement.component.html',
    styleUrls: ['./prepare-agreement.component.scss']
})
export class PrepareAgreementComponent implements OnInit {
    @Input() isComplete: any;
    @Input() activityMasterId: any;
    @Input() subActivityMasterId: any;
    @Input() isApproved: any = 0;
    @Input() isRejected: boolean = false;
    @Input() isRejectDoc: boolean = false;
    Loader: boolean = false;
    responseData: any;
    leadId:any;
    showRequest: boolean = false;
    requestResponseMessage: any;
    typecheck: any;
    constructor(private _leadService: LeadService, private confirmationService: ConfirmationService, private messageService: MessageService,
        private activatedroute:ActivatedRoute) {

    }
    async ngOnInit() {
        this.leadId = this.activatedroute.snapshot.paramMap.get('leadId');
        await this.GetGenerateAgreementStatus(this.leadId)
    }

    async GetGenerateAgreementStatus(leadId: any) {
        try{
        this.Loader = true
        var resp = await this._leadService.GetGenerateAgreementStatus(leadId).toPromise();
        if (resp && resp.length > 0) {
            this.responseData = resp;
            this.Loader = false            
        }
        else {
            this.Loader = false
            alert('Error GetGenerateAgreementStatus')
        }
    }catch(error:any){
        this.Loader = false
        // alert(error.message);
    }
    }

    show(reqRes: any) {
        this.requestResponseMessage = null;
        if (reqRes != null && reqRes != '') {
            this.showRequest = true
            var res = this.isStringContainingArray(reqRes)
            this.requestResponseMessage = res ? JSON.parse(reqRes) : reqRes;
            this.typecheck = typeof this.requestResponseMessage;
        }

    }
    isStringContainingArray(str: any) {
        var res = str.startsWith('[') && str.endsWith(']');
        var res2 = str.startsWith('{') && str.endsWith('}');
        return res || res2 ? true : false
    }

    Retry(responseData: any) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to Retry?',
            accept: () => {
                try {
                    this.Loader = true
                    this._leadService.ThirdPartyAgreementLeadRetry(responseData.leadId, responseData.nbfcCompanyId).subscribe((res: any) => {
                        this.Loader = false;
                        this.GetGenerateAgreementStatus(this.leadId);
                    })
                } catch (error: any) {
                    this.Loader = false
                    // alert(error.message);
                }
            },
            reject: () => {
            },
        });
    }
}


