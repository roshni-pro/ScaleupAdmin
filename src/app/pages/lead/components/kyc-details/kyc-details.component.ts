import { Component, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { LeadService } from '../../services/lead.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderService } from 'app/shared/services/loader.service';
import { elementAt, filter, retry } from 'rxjs/operators';
import { PrimeIcons } from 'primeng/api';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ShowOfferComponent } from '../show-offer/show-offer.component';
import { PrepareAgreementComponent } from '../prepare-agreement/prepare-agreement.component';

@Component({
    selector: 'app-kyc-details',
    templateUrl: './kyc-details.component.html',
    styleUrls: ['./kyc-details.component.scss']
})
export class KycDetailsComponent implements AfterViewInit {
    visible: boolean = false;
    leadActivitiesList: any;
    Activity: any;
    loader: boolean = false;
    isRejected: boolean = false;
    isapproved: any;
    istotalcount: any;
    isjump: boolean = false;
    isRejectDoc: boolean = false;
    isOfferGenerated: boolean = false;
    activeIndex: any;
    currentPageName: any;
    IsOfferGeneratedFlag: boolean = false;
    userId: any;
    leadId: any;
    customerData: any;
    IsShowOfferOpenTab: boolean = false;
    IsPrepareAgreementOpenTab: boolean = false;
    IsleadReject: boolean = false;
    updateNbFcPopup: boolean = false;
    AllLeadOfferStatusData: any;
    customerName: any;
    LeadGeneratorConvertorObj: LeadGeneratorConvertor = {
        LeadId: 0,
        LeadGenerator: '',
        LeadConvertor: ''
    }
    userrole: any;
    roles: any;
    userName:any
    @ViewChild(ShowOfferComponent) showOfferComponent!: ShowOfferComponent;
    @ViewChild(PrepareAgreementComponent) prepareAgreementComponent!: PrepareAgreementComponent;

    constructor(private cdr: ChangeDetectorRef, private _leadService: LeadService,
        private router: Router, private activateRoute: ActivatedRoute, private Loader: LoaderService,
        private confirmationService: ConfirmationService, private messageService: MessageService) {
        this.roles = localStorage.getItem('roles');
        console.log(this.roles, 'this.roles');
        this.userrole = this.roles.split(',');
        console.log(this.userrole, 'userrole');

        this.userName = localStorage.getItem('username');
        console.log(this.userName, 'this.userName');
    }

    ngAfterViewInit() {
        // Access child component after it's initialized
        if (this.showOfferComponent && this.IsShowOfferOpenTab) {
            this.showOfferComponent.GetGenerateOfferStatus(this.leadId);
        }
        if (this.prepareAgreementComponent && this.IsPrepareAgreementOpenTab) {
            this.prepareAgreementComponent.GetGenerateAgreementStatus(this.leadId);
        }
    }

    async ngOnInit() {
        this.userId = this.activateRoute.snapshot.paramMap.get('userId');
        this.leadId = this.activateRoute.snapshot.paramMap.get('leadId');
        console.log('this.userId', this.userId)
        console.log('this.leadId', this.leadId)
        // this.leadActivitiesList = null;
        await this.GetLeadCommonDetail();
        await this.GetleadActivities(this.leadId, 1)
        await this.GetLeadDetails();
        await this.IsOfferGenerated(this.leadId);
        await this.GetOfferAccepted(this.leadId);
        this.CompanyBuyingHistory();
    }
    isLeadGeneratorDisabled:boolean=false;
    isLeadConvertorDisabled:boolean=false;
    async GetLeadCommonDetail() {
        if (this.leadId > 0) {
            this.loader = true;
            var res = await this._leadService.GetLeadCommonDetail(this.leadId).toPromise();
            this.loader = false;
            if (res != null) {
                this.customerData = res;
                console.log(this.customerData);
                console.log(this.customerData?.leadConvertor,'this.customerData?.leadConvertor');
                
                this.isLeadConvertorDisabled = (this.customerData?.leadConvertor) ? true : false;
                this.isLeadGeneratorDisabled = (this.customerData?.leadGenerator) ? true : false;
                console.log(this.isLeadConvertorDisabled,'this.isLeadConvertorDisabled');
                console.log(this.isLeadGeneratorDisabled,'this.isLeadGeneratorDisabled');     
            }
        }
    }

    async GetLeadDetails() {
        if (this.userId != null) {
            // this.loader = true;
            var res = await this._leadService.GetLeadDetailsByUserId(this.userId,this.leadId).toPromise();
            if (res) {
                console.log(res,'LeadDetails');
                
                this.loader = false;
                if (res.panDetail != null && res.panDetail.nameOnCard) {
                    this.customerName = res.panDetail.nameOnCard;
                }
                this.router.navigate(['pages/lead/SC-leads/Kyc-Detail/' +
                    this.userId + '/' + this.leadId], {
                    skipLocationChange: true,
                    queryParams: {
                        PanData: JSON.stringify(res.panDetail),
                        PersonalDetail: JSON.stringify(res.personalDetail),
                        BuisnessDetail: JSON.stringify(res.buisnessDetail),
                        AgreementDetail: JSON.stringify(res.agreementDetail),
                        CreditBureauDetails: JSON.stringify(res.creditBureauDetails),
                        BankStatementCreditLendingDeail: JSON.stringify(res.bankStatementCreditLendingDeail),
                        SelfieDetail: JSON.stringify(res.selfieDetail),
                        AadharDetail: JSON.stringify(res.aadharDetail),
                        BankStatementDetail: JSON.stringify(res.bankStatementDetail),
                        MsmeDetail: JSON.stringify(res.msmeDetail)

                    },
                });
            } else {
                this.loader = false;
                // alert("Error API - GetLeadDetailsByUserId, Press OK to Reload the page");
                this.messageService.add({ severity: 'error', summary: "Error API - GetLeadDetailsByUserId, Press OK to Reload the page" });

                window.location.reload();
            }
            if (res != null) {
                this.visible = true;
            }
        }
    }

    async GetleadActivities(leadId: number, event?: any) {
        // this.leadActivitiesList = null;
        if (this.leadId > 0) {
            try {
                this.loader = true;
                var res = await this._leadService.GetLeadActivityProgressList(leadId).toPromise();

                if (res.status) {
                    // this.loader = false;
                    var data = res.leadActivityProgress.filter((x: any) => {
                        if (x.activityName != "MobileOtp") return x
                    })

                    this.leadActivitiesList = data
                    console.log(this.leadActivitiesList, 'this.leadActivitiesList');

                    this.leadActivitiesList.forEach((x: any) => {
                        x.activity = x.subActivityName ? x.subActivityName : x.activityName
                    })
                    this.isjump = false;
                    this.istotalcount = 0;
                    this.isapproved = 0;
                    let i = 0;
                    this.leadActivitiesList.forEach((x: any) => {
                        x.index = i + 1;
                        i++;
                    })

                    this.leadActivitiesList.forEach((x: any) => {
                        if (x.activityName == "Inprogress") {
                            this.isjump = true
                            if (this.isapproved == this.istotalcount) {
                                this.isOfferGenerated = true
                            }
                        }
                        else {
                            if (this.isjump == false) {
                                this.istotalcount = this.istotalcount + 1;
                                if (x.isApproved == 1) {
                                    this.isapproved = this.isapproved + 1;
                                }
                            }
                        }
                    })

                    this.leadActivitiesList.forEach((element: any) => {
                        if (element.activityName == 'Rejected') {
                            this.IsleadReject = true;
                        }
                    })

                    await this.GetOfferAccepted(this.leadId);
                    if (!event) {
                        this.loader = false
                    }
                }
                else {
                    this.loader = false;
                    // alert("Error API - GetLeadActivityProgressList")
                    this.messageService.add({ severity: 'error', summary: 'Data Not Found' });

                    // this.loader = false;
                }
            }
            catch (error: any) {
                // alert(error)
                this.loader = false;
                this.messageService.add({ severity: 'error', summary: 'Error API - GetLeadActivityProgressList', detail: error });
            }
        }
    }


    activeIndexChange(index: any, event: any) {
        this.currentPageName = event;
    }

    async GetOfferAccepted(leadId: number) {
        if (leadId > 0) {
            try {
                // this.loader = true;
                var res = await this._leadService.GetOfferAccepted(leadId).toPromise();
                // this.loader = false;
                if (res != null) {
                    if (res.isOfferAccepted) {
                        this.isOfferGenerated = false;
                    }
                } else {
                    this.loader = false;
                    // alert("Error API - GetOfferAccepted");
                    this.messageService.add({ severity: 'error', summary: 'Error API - GetOfferAccepted' });

                }
            }
            catch (error: any) {
                this.loader = false;
            }
        }
    }
    onClickOffeGenerated() {
// this.isOfferGenerated == true &&
// && (this.customerData?.leadGenerator?true:false) && (this.customerData?.leadConvertor?true:false)
        if (this.isOfferGenerated == true && this.leadId > 0 && (this.customerData?.leadGenerator?true:false) && (this.customerData?.leadConvertor?true:false)) {
            this.confirmationService.confirm({
                message: 'Are you sure that you want to Generate Offer?',
                accept: () => {
                    try {
                        const payload ={
                            LeadId : this.leadId,
                            CompanyIds : [0]
                        }
                        this.loader = true;
                        // this._leadService.InitiateLeadOffer(this.leadId).subscribe(res => {
                            this._leadService.InitiateLeadOffer(payload).subscribe(res => {
                            this.loader = false;
                            if (res.status) {
                                this.messageService.add({ severity: 'success', summary: res.message, detail: '',life:1000 });
                                this.isOfferGenerated = false;

                                setTimeout(() => {
                                    // window.location.reload();
                                    this.showOfferComponent.GetGenerateOfferStatus(this.leadId);
                                }, 1000);
                            }
                            else {
                                this.messageService.add({ severity: 'error', summary: res.message, detail: '',life:1000 });
                            }
                        })
                    }
                    catch (error) {
                        // alert(error)
                        this.loader = false;
                    }
                }
            });
        }
        else{
            if(!(this.customerData?.leadGenerator?true:false) && !(this.customerData?.leadConvertor?true:false)){
                this.messageService.add({ severity: 'error', summary: 'Please Enter Required Fields', detail: 'Lead Generator And Lead Convertor' });
            }
            else if(!(this.customerData?.leadGenerator?true:false)){
                this.messageService.add({ severity: 'error', summary: 'Please Enter Lead Generator', detail: '' });
            }
            else if(!(this.customerData?.leadConvertor?true:false)){
                this.messageService.add({ severity: 'error', summary: 'Please Enter Lead Convertor', detail: '' });
            }
        }
    }

    onApproved(event: any, headString: string) {

        this.confirmationService.confirm({
            message: 'Are you sure that you want to approve?',
            accept: () => {
                let payload = {
                    "LeadId": event.LeadId,
                    "ActivityMasterId": event.ActivityMasterId ? event.ActivityMasterId : 0,
                    "SubActivityMasterId": event.SubActivityMasterId ? event.SubActivityMasterId : 0,
                    "IsApprove": event.IsApprove,
                    "Comment": event.Comment
                }
                this.loader = true;
                this._leadService.VerifyLeadDocument(payload).subscribe(x => {
                    this.loader = false;
                    if (x.status) {

                        this.messageService.add({ severity: 'success', summary: x.message, detail: headString });
                        this.GetleadActivities(this.leadId)
                        // this.loader=false;
                    } else {
                        this.messageService.add({ severity: 'error', summary: "Error - Not Approved", detail: 'Please Try Again' });
                    }
                })
            }
        });
    }

    onReject(event: any, headString: string) {

        let payload = {
            "LeadId": event.LeadId,
            "ActivityMasterId": event.ActivityMasterId ? event.ActivityMasterId : 0,
            "SubActivityMasterId": event.SubActivityMasterId ? event.SubActivityMasterId : 0,
            "IsApprove": event.IsApprove,
            "Comment": event.Comment
        }

        try {
            this.loader = true;
            this._leadService.VerifyLeadDocument(payload).subscribe(res => {
                this.loader = false;
                if (res.status) {
                    this.messageService.add({ severity: 'success', summary: res.message, detail: headString });
                    this.GetleadActivities(this.leadId)
                }
                else {
                    this.messageService.add({ severity: 'error', summary: "Error - Not Rejected", detail: headString });
                }
            })
        }
        catch (error) {
            // alert(error)
            this.loader = false;
        }
    }

    Reset() {
        if (this.leadId > 0) {
            this.confirmationService.confirm({
                message: 'Are you sure that you want to Reset?',
                accept: () => {
                    this.loader = true;
                    this._leadService.ResetLeadActivityMasterProgresse(this.leadId).subscribe((res: any) => {
                        this.loader = false;
                        if (res) {
                            this.messageService.add({ severity: 'success', summary: 'success', detail: '', life: 1000 });
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        }
                        else {
                            this.messageService.add({ severity: 'error', summary: 'Failed', detail: '' });
                        }
                    })
                }
            });
        }
    }


    async IsOfferGenerated(leadid: any) {
        if (leadid > 0) {
            // this.loader = true
            var res = await this._leadService.IsOfferGenerated(leadid).toPromise();
            if (res && res.result == true) {
                // this.loader = false;
                this.IsOfferGeneratedFlag = res.result;
            }
            else {
                // this.loader = false;
                this.IsOfferGeneratedFlag = res.result;
            }
        }
    }



    UpdateNbfc() {
        if (this.leadId > 0) {
            this.loader = true;
            this._leadService.GetAllLeadOfferStatus(this.leadId).subscribe((res: any) => {
                this.loader = false;
                if (res.isSuccess == true) {
                    this.AllLeadOfferStatusData = res.result;
                    if (this.AllLeadOfferStatusData != null && this.AllLeadOfferStatusData.length > 0) {
                        this.updateNbFcPopup = true;
                    }
                    else {
                        this.messageService.add({ severity: 'error', summary: 'No Data Found', detail: '' });
                    }
                }
            })
        }
    }

    UpdateNbFcOffer(nbfc: any) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to Update?',
            accept: () => {
                this.loader = true
                this._leadService.UpdateLeadInfo(nbfc.leadId, nbfc.nbfcId, nbfc.companyIdentificationCode).subscribe((res: any) => {
                    this.loader = false;
                    this.updateNbFcPopup = false;
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                    // this.messageService.add({ severity: 'success', summary: 'success', detail: '' });
                })
            }
        });
    }


    onAccordionTabOpen() {
        if (this.currentPageName == 'Show Offer') {
            this.IsShowOfferOpenTab = true;
        }
        if (this.currentPageName == 'PrepareAgreement') {
            this.IsPrepareAgreementOpenTab = true;
        }
        this.ngAfterViewInit();
        this.cdr.detectChanges(); // Trigger change detection when an accordion tab is opened
    }

    isLeadActivityHistory: boolean = false;
    LeadActivityHistoryData: any
    LeadActivityHistory() {
        this.loader = true;
        this._leadService.LeadActivityHistory(this.leadId).subscribe((res: any) => {
            // console.log(res, 'historyData');
            this.loader = false;
            if (res != null && res.length > 0) {
                this.isLeadActivityHistory = true;
                res.forEach((x: any) => {
                    x.changes = x.changes.replace(/\\n/g, '<br/>');
                })
                this.LeadActivityHistoryData = res;
            }
        }, (err: any) => {
            this.loader = false;
            this.messageService.add({ severity: 'error', summary: 'ErrorAPI LeadActivityHistory', detail: '' });
        })
    }

    OnBack() {
        this.router.navigateByUrl('pages/lead/SC-leads');
    }

    iscompanyBuyingHistories: boolean = false;
    companyBuyingHistories: any
    totalrecord: number = 0
    CompanyBuyingHistory() {
        this.companyBuyingHistories = [];
        this.iscompanyBuyingHistories = true;
        const companyId = Number(localStorage.getItem('selectedcompany'));
        this.loader = true;
        this._leadService.GetCompanyBuyingHistory(companyId, this.leadId).subscribe((res: any) => {
            console.log(res);
            this.loader = false;
            if (res.isSuccess) {
                this.companyBuyingHistories = res.result;
                this.totalrecord = res.result.length;
            }
            else {
                this.companyBuyingHistories = [];
                this.totalrecord = 0;
            }
        })
    }
    isLeadGeneratorPopup: boolean = false;
    addLeadPopup() {
        this.isLeadGeneratorPopup = true;
    }
    isValidate: boolean = false;
    addLeadGeneratorConvertor() {
        debugger

        if(this.LeadGeneratorConvertorObj.LeadGenerator != null ){
            this.LeadGeneratorConvertorObj.LeadGenerator = this.LeadGeneratorConvertorObj.LeadGenerator.trim()
        }
        if(this.LeadGeneratorConvertorObj.LeadConvertor != null ){
            this.LeadGeneratorConvertorObj.LeadConvertor = this.LeadGeneratorConvertorObj.LeadConvertor.trim()
        }

        this.LeadGeneratorConvertorObj.LeadGenerator = this.customerData?.leadGenerator ? this.customerData?.leadGenerator : this.LeadGeneratorConvertorObj.LeadGenerator
        this.LeadGeneratorConvertorObj.LeadConvertor = this.customerData?.leadConvertor ? this.customerData?.leadConvertor : this.LeadGeneratorConvertorObj.LeadConvertor;
        if (this.leadId > 0) {
            if ((this.LeadGeneratorConvertorObj.LeadGenerator != null && !this.isFirstLetterNotSpace(this.LeadGeneratorConvertorObj.LeadGenerator))) {             
                    this.messageService.add({ severity: 'error', summary: 'Please Enter Lead Generator', detail: '' });
                    this.isValidate = false;
            }
            else if ((this.LeadGeneratorConvertorObj.LeadConvertor != null && !this.isFirstLetterNotSpace(this.LeadGeneratorConvertorObj.LeadConvertor))) {
                    this.messageService.add({ severity: 'error', summary: 'Please Enter Lead Convertor', detail: '' });
                    this.isValidate = false;
            }
            else {
                this.isValidate = true;
            }
        } else {
            this.messageService.add({ severity: 'error', summary: 'Lead id is null', detail: '' });
            this.isValidate = false;
        }

        if (this.isValidate) {
            const payload = {
                'LeadId': this.leadId,
                'LeadGenerator': this.LeadGeneratorConvertorObj.LeadGenerator,
                'LeadConvertor': this.LeadGeneratorConvertorObj.LeadConvertor,
                'UserName':this.userName?this.userName:''
            }      
            this.loader = true;
            this._leadService.AddLeadGeneratorConvertor(payload).subscribe(res => {
                console.log(res);
                if (res) {
                    this.loader = false;
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: '' });
                    this.isLeadGeneratorPopup = false;
                    this.GetLeadCommonDetail();
                }
            }, (error: any) => {
                console.log(error);
                this.loader = false;
            })
        }

    }
    cancelleadGeneratorpopup() {
        this.LeadGeneratorConvertorObj.LeadGenerator = '';
        this.LeadGeneratorConvertorObj.LeadConvertor = '';
    }

    checkroleExistence(searchString: string): boolean {
        // debugger
        return this.userrole.includes(searchString);
    }

    onkeypress(event: KeyboardEvent) {
        const charCode = event.which || event.keyCode;
        const charStr = String.fromCharCode(charCode);
        const pattern = /[a-zA-Z\s\-_\.]/; // Regular expression to match alphabets, spaces, hyphens, underscores, and periods
      
        if (!pattern.test(charStr)) {
          event.preventDefault(); // Prevent the default action if the character is not allowed
        }
      }

      isFirstLetterNotSpace(sentence:string) {
        debugger
        // Check if the first character is not a space
        return /^\S/.test(sentence);
    }
}


interface LeadGeneratorConvertor {
    LeadId: number;
    LeadGenerator: string;
    LeadConvertor: string;
}
