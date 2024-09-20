// import { Component, Input, OnInit } from '@angular/core';
import { LeadService } from '../../services/lead.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-show-offer',
    templateUrl: './show-offer.component.html',
    styleUrls: ['./show-offer.component.scss']
})
export class ShowOfferComponent implements OnInit {
    @Input() IsEsignApproved: boolean = false;
    @Input() IsleadReject: boolean = false;
    leadData: any
    Loader: boolean = false;
    LeadOfferData: any;
    onApprovedOrReject: boolean = false;
    @Input() isComplete: any;
    @Input() activityMasterId: any;
    @Input() subActivityMasterId: any;
    @Input() isApproved: any = 0;
    @Input() isRejected: boolean = false;
    @Input() isRejectDoc: boolean = false;
    OfferListData: any;
    showRequest: boolean = false;
    requestResponseMessage: any;
    MessageForReject: any;
    leadId: any
    typecheck: any;
    IsReject: boolean = false;
    GenerateOfferData: any
    responseData: any
    constructor(private _leadService: LeadService, private confirmationService: ConfirmationService, private messageService: MessageService,
        private activateRoute: ActivatedRoute,
    ) {
    }
    async ngOnInit() {
        this.leadData = localStorage.getItem('LeadInfo')
        this.leadData = JSON.parse(this.leadData)
        this.leadId = this.activateRoute.snapshot.paramMap.get('leadId');
        await this.GetLeadOffer(this.leadId);
        // await this.GetOfferList(this.leadData.leadId);
        await this.GetGenerateOfferStatus(this.leadId);
        await this.GetOfferAccepted(this.leadId);

    }

    async GetLeadOffer(leadid: any) {
        try {
            this.Loader = true
            var response = await this._leadService.GetLeadOffer(leadid).toPromise();
            this.Loader = false
            if (response != null) {
                this.LeadOfferData = response;
                console.log(this.LeadOfferData, 'this.LeadOfferData');

            }
        } catch (error: any) {
            this.Loader = false;
            // alert(error.message);
        }
    }

    // async GetOfferList(leadid: any) {
    //     try {
    //         this.Loader = true
    //         var result = await this._leadService.GetOfferList(leadid).toPromise();
    //         this.Loader = false

    //         console.log(result, 'result');
    //         if (result != null && result.status && result.response != null) {
    //             this.OfferListData = result.response
    //         }
    //     } catch (error: any) {
    //         // alert(error.message)
    //     }
    // }

    UpdateOffer(leadid: any) {
        // debugger
        this.confirmationService.confirm({
            message: 'Are you sure that you want to update?',
            accept: () => {
                const payload ={
                    LeadOfferId:leadid,
                    interestRate:0,
                    newOfferAmout:0
                }
                this.Loader = true
                // this._leadService.UpdateLeadOffer(leadid,0).subscribe((result: any) => {
                this._leadService.UpdateLeadOffer(payload).subscribe((result: any) => {
                    if (result.status) {
                        this.Loader = false
                        this.messageService.add({ severity: 'success', summary: result.message, detail: '', life: 1000 });
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                    else {
                        this.Loader = false
                        this.messageService.add({ severity: 'error', summary: result.message, detail: '' });
                    }
                },
                    (err: any) => {
                        this.Loader = false
                        // alert(err.message);
                        this.messageService.add({ severity: 'error', summary: err.message });

                        console.log(err)
                    });
            },
            reject: () => {
            },
        });
    }


    async GetGenerateOfferStatus(leadId: any) {
        this.Loader = true
        try {
            var resp = await this._leadService.GetGenerateOfferStatus(leadId).toPromise();
            console.log(resp);

            if (resp && resp.length > 0) {
                this.responseData = resp;
                this.Loader = false
                console.log(this.responseData, 'this.responseData ');

            }
            else {
                this.Loader = false
            }
        }
        catch (error) {
            //   alert(error)
            this.Loader = false;
        }
    }


    show(reqRes: any) {
        this.requestResponseMessage = null
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
        console.log(responseData, 'responseData for retry');
        this.confirmationService.confirm({
            message: 'Are you sure that you want to Retry?',
            accept: () => {
                try {
                    this.Loader = true;
                    this._leadService.ThirdPartyCreateLeadRetry(responseData.leadId, responseData.nbfcCompanyId).subscribe((res: any) => {
                        this.Loader = false;
                        // this.GetGenerateOfferStatus(this.leadId);
                        if (res.status) {
                            this.messageService.add({ severity: 'success', summary: res.message, detail: '', life: 1000 });
                            setTimeout(() => {
                                // window.location.reload();
                                this.GetGenerateOfferStatus(this.leadData.leadId);
                            }, 1000);
                        }
                        else {
                            this.messageService.add({ severity: 'error', summary: res.message, life: 1000 });
                            setTimeout(() => {
                                // window.location.reload();
                                this.GetGenerateOfferStatus(this.leadData.leadId);
                            }, 1000);
                        }
                    }, (err: any) => {
                        this.Loader = false;
                        // alert(error.message);
                        this.messageService.add({ severity: 'error', summary: err.message });
                    })
                } catch (error: any) {
                    
                }
            },
            reject: () => {
            },
        });
    }

    isOfferAccepted: boolean = false
    async GetOfferAccepted(leadId: number) {
        this.Loader = true;
        var res = await this._leadService.GetOfferAccepted(leadId).toPromise();
        if (res != null) {
            this.Loader = false;
            console.log(res, 'GetOfferAccepted');
            if (res.isOfferAccepted) {
                this.isOfferAccepted = true;
            }
        } else {
            this.Loader = false;
            // alert("Error API - GetOfferAccepted");
            this.messageService.add({ severity: 'error', summary: 'Error API - GetOfferAccepted' });

        }
    }

    Reject() {
        // this.MessageForReject=this.MessageForReject.trim()
        if (this.MessageForReject != null && this.MessageForReject != '') {
            this.MessageForReject = this.MessageForReject.trim()
        }
        if (this.MessageForReject != null && this.isFirstLetterNotSpace(this.MessageForReject)) {
            this.confirmationService.confirm({
                message: 'Are you sure that you want to Reject?',
                accept: () => {
                    this.Loader = true;
                    this._leadService.LeadReject(this.leadId, this.MessageForReject).subscribe((res: any) => {
                        console.log(res);
                        this.Loader = false;
                        this.IsReject = false;
                        if (res.isSuccess) {
                            this.messageService.add({ severity: 'success', summary: res.message, detail: '', life: 1000 });
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        }
                        else {
                            this.messageService.add({ severity: 'error', summary: res.message, detail: '', life: 1000 });
                        }
                    },
                        (err: any) => {
                            this.Loader = false;
                            this.IsReject = false;
                            // alert(err.message)
                            this.messageService.add({ severity: 'error', summary: err.message });
                        })

                },
                reject: () => {
                },
            });
        }
        else {
            this.messageService.add({ severity: 'error', summary: 'Please fill Message', detail: '', life: 1000 });
        }
    }
    OnReject() {
        this.IsReject = true;
    }

    isFirstLetterNotSpace(sentence: string) {
        // Check if the first character is not a space
        return /^\S/.test(sentence);
    }
    cancel() {
        this.MessageForReject = null;
    }
}
