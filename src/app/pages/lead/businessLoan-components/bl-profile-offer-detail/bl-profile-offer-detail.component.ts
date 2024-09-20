import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LeadService } from '../../services/lead.service';
import { CommonValidationService } from 'app/shared/services/common-validation.service';
import * as moment from 'moment';
@Component({
    selector: 'app-bl-profile-offer-detail',
    templateUrl: './bl-profile-offer-detail.component.html',
    styleUrls: ['./bl-profile-offer-detail.component.scss']
})
export class BlProfileOfferDetailComponent implements OnInit {
    @Input() leadData: any;
    @Input() leadActivitiesList: any;
    @Input() IsleadReject: boolean = false;
    @Input() isShowUMRN: boolean = false;
    isShowReset: boolean = false;
    @Output() stateResetChange = new EventEmitter<any>();

    generateOfferStatusData: any;  //responseData
    requestResponseMessage: any;
    CreditBureauDetails: any;
    typecheck: any;
    Loader: boolean = false;
    showRequest: boolean = false;
    MessageForReject: any;
    IsReject: boolean = false;
    LeadOfferData: any
    showOfferDetails: any
    DisbursalProposalData: any;

    isCibilUpload: boolean = false;
    cibilScore: number = 0

    data: any;
    options: any
    userId: any;
    leadId: any;
    customerData: any;
    generateOfferByFinanceData: GenerateOfferByFinanceData = {
        loanAmount: 0,
        rateOfInterest: 0,
        tenure: 0,
        monthlyPayment: 0,
        loanIntAmt: 0,
        processing_fee: 0,
        processingfeeTax: 0,
        processingFeeRate: 0,
        gst: 0,
        companyIdentificationCode: '',
        pfDiscount: 0,
        pfType: '',
        commission: 0,
        commissionType: '',
        Bounce :0,
        Penal :0,
        ArrangementType :'',
        NBFCBounce :0,
        NBFCPenal :0,
        NBFCInterest :0,
        NBFCProcessingFee :0,
        NBFCProcessingFeeType :''
    };
    roleName: any;
    roleList: any;
    isRolePermission: boolean = false;
    role: any;
    isLoading: boolean = false
    isDisbursed: any;
    id: number = 0;
    isSuperadminrole: boolean = false;
    idList: any;
    isAdminrole: boolean = false;
    userTypeRole:boolean = false;
    // isAYERole: boolean = false;
    // isSuperadminrole: boolean = false;
    // showOfferActivityName:any
    constructor(private commonValidation: CommonValidationService, private _leadService: LeadService, private confirmationService: ConfirmationService, private messageService: MessageService,
        private activateRoute: ActivatedRoute) {

    }
    today:any
    endday:any
    async ngOnInit() {
        // console.log(this.leadData)
        this.today = new Date();
       
        console.log( this.today,"aaj ki tarikh")
        this.userId = this.activateRoute.snapshot.paramMap.get('userId');
        this.leadId = this.activateRoute.snapshot.paramMap.get('leadId');
        console.log(this.leadActivitiesList)
        this.roleName = localStorage.getItem('roles');
        this.roleList = this.roleName.split(',');
        console.log(this.roleList);

        const companyId = localStorage.getItem('companyId');
        this.idList = companyId?.split(',');
        console.log(this.idList, typeof (this.idList));
        if (companyId !== null && this.idList.length > 1) {

        }
        else if (companyId !== null && this.idList.length > 0 && this.idList.length == 1) {
            this.id = JSON.parse(companyId);
            console.log('companyid', this.id);
        }

        for (var i in this.roleList) {
            if (this.roleList[i] == 'MASOperationExecutive' || this.roleList[i] == 'AYEOperationExecutive') {
                this.isRolePermission = true;
                this.role = this.roleList[i].slice(0, 3);
                console.log(this.role, "role")
            }
            if (this.roleList[i].toLowerCase() == 'superadmin'.toLowerCase()) {
                this.isSuperadminrole = true;
            }
            if (this.roleList[i].toLowerCase() == 'AdminUser'.toLowerCase()) {
                this.isAdminrole = true;
            }
        }
        const userType = localStorage.getItem('usertype');
        
        if(userType !== null){
            if (userType.toLowerCase() == 'superadmin'.toLowerCase()) {
                this.userTypeRole = true;
            }
            if (userType.toLowerCase() == 'AdminUser'.toLowerCase()) {
                this.userTypeRole = true;
            }
        }
        await this.GetGenerateOfferByFinance();
        this.showOfferDetails = this.leadActivitiesList.filter(
            (Activities: any) => Activities.activityName === "Arthmate Show Offer");
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.isDisbursed = this.leadActivitiesList.filter(
            (Activities: any) => {
                if (Activities.activityName === "Congratulations" && Activities.isCompleted)
                    return Activities;
            });
        console.log(this.isDisbursed, 'isDisbursed');

        this.data = {
            labels: ['Excellent', 'Poor'],
            datasets: [
                {
                    data: [100, 900], // Replace with your CIBIL score data
                    backgroundColor: [
                        'green',
                        'red'
                        // '#FF6384',
                        // '#FFCE56',
                    ]
                }
            ]
        };
        this.options = {
            cutout: '60%',
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
        };

        console.log(this.showOfferDetails)
        await this.GetOfferAccepted(this.leadId);
        await this.GetGenerateOfferStatus(this.leadId);
        await this.GetLeadOffer(this.leadId);

        await this.GetLoan(this.leadId);
        await this.NbfcOfferAccepted();

        this.repaymentSchedule(this.leadId);
        this.GetLoanByLoanId();
        this.GetLeadCommonDetail();
        debugger
        this.GetGenerateOfferByFinance();
    }


    async GetLeadOffer(leadid: any) {
        try {
            this.Loader = true
            var response = await this._leadService.GetLeadOffer(leadid).toPromise();
            this.Loader = false
            if (response != null) {
                this.LeadOfferData = response;
                console.log('LeadOfferData', this.LeadOfferData)
            }
        } catch (error: any) {
            this.Loader = false;
            // alert(error.message);
        }
    }

    nbfcCompanyId: any;
    UMRNforNBFCDisbursement: any = null;
    CompanyName: any
    AccenptOfferDetailsCompanyName: any;
    nbfcCompanyNameList: any;
    isArthmateCompany: boolean = false;
    async GetGenerateOfferStatus(leadId: any) {
        this.Loader = true
        try {
            var resp = await this._leadService.GetGenerateOfferStatusNew(leadId, "BusinessLoan").toPromise();
            console.log(resp);

            if (resp && resp.length > 0) {
                this.nbfcCompanyNameList = []
                this.isShowReset = true
                if (this.isShowReset == true) {
                    this.emitResetShow();
                }
                resp.forEach((element: any) => {
                    // element.pfAfterDiscount = element.pfDiscount ? element.processingfee - element.pfDiscount : element.processingfee;
                    element.pfDiscount = element.pfDiscount ? element.pfDiscount : 0;
                    element.pfDiscountSaved = element.pfDiscount ? element.pfDiscount : 0;
                    // element.pfAfterDiscount = element.pfDiscountSaved ? ((element.processingfee - element.pfDiscountSaved) + ((element.processingfee - element.pfDiscountSaved) * element.gstRate) / 100) : element.processingfee;
                    // element.pfAfterDiscount = element.pfDiscountSaved ? ((element.processingfee) + ((element.processingfee) * element.gstRate) / 100) : element.processingfee;

                    this.nbfcCompanyNameList.push(element.comapanyName);
                    // if (element.leadOfferStatus == 'OfferGenerated' && element.offerApprove == true) {
                    //     if (element.comapanyName == "ArthMate") {
                    //         this.UMRNforNBFCDisbursement = false;
                    //         this.CompanyName = element.comapanyName;
                    //     }
                    //     else{
                    //             this.UMRNforNBFCDisbursement = true;
                    //             this.CompanyName = element.comapanyName;
                    //     }
                        // else if (element.comapanyName == "AYEFIN" || element.comapanyName == "MASFIN") {
                        //     if (this.role == 'MAS' && element.comapanyName == "MASFIN") {
                        //         this.UMRNforNBFCDisbursement = true;
                        //         this.CompanyName = element.comapanyName;
                        //     } else if (this.role == 'AYE' && element.comapanyName == "AYEFIN") {
                        //         this.UMRNforNBFCDisbursement = true;
                        //         this.CompanyName = element.comapanyName;
                        //     }
                        //     else {
                        //         this.UMRNforNBFCDisbursement = true;
                        //         this.CompanyName = element.comapanyName;
                        //     }
                        // }
                    //}
                    if(true) {
                        debugger
                        if(element.comapanyName=="ArthMate" && element.leadOfferStatus=='OfferGenerated'  && element.offerApprove==true){
                            this.UMRNforNBFCDisbursement = false;
                            this.CompanyName = element.comapanyName;
                        }
                        else if(this.userTypeRole && element.leadOfferStatus=='OfferGenerated'  && element.offerApprove==true){
                            this.UMRNforNBFCDisbursement = true;
                            this.CompanyName = element.comapanyName;
                            var d = new Date(element.offerInitiateDate)
                            this.endday = d;
                        }                    
                    }
                    if (element.subactivityList != null) {
                        element.subactivityList.forEach((element1: any) => {
                            if (element1.apiList != null) {
                                element1.apiList.forEach((element2: any) => {
                                    element2.expanded = false;
                                });
                            }
                        });
                    }
                    if (element.offerApprove) {
                        this.AccenptOfferDetailsCompanyName = element.comapanyName
                    }
                });
                this.generateOfferStatusData = resp;
                console.log('generateOfferStatusData', this.generateOfferStatusData)
                this.Loader = false

                if (this.generateOfferStatusData && this.generateOfferStatusData.length > 0) {
                    this.generateOfferStatusData.forEach((x: any) => {
                        if (x.comapanyName == 'MASFIN' && this.role == 'MAS') {
                            this.leadOfferId = x.leadOfferId;
                            this.nbfcCompanyId = x.nbfcCompanyId
                        }
                        else if (x.comapanyName == 'AYEFIN' && this.role == 'AYE') {
                            this.leadOfferId = x.leadOfferId;
                            this.nbfcCompanyId = x.nbfcCompanyId
                        }
                        console.log(this.leadOfferId);
                    })
                }
                console.log(this.nbfcCompanyNameList, 'nbfcCompanyNameList');
                if (this.nbfcCompanyNameList != null) {
                    this.isArthmateCompany = this.nbfcCompanyNameList.includes('ArthMate');
                }
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
    show(reqRes: any) {
        this.requestResponseMessage = null
        console.log(reqRes);
        if (reqRes != null && reqRes != '') {
            this.showRequest = true
            var res = this.isStringContainingArray(reqRes)
            this.requestResponseMessage = res ? JSON.parse(reqRes) : reqRes;
            this.typecheck = typeof this.requestResponseMessage;
        }
    }

    Retry(responseData: any, row: any) {
        console.log(responseData, row, 'responseData for retry');
        this.confirmationService.confirm({
            message: 'Are you sure that you want to Retry?',
            accept: () => {
                try {
                    this.Loader = true;
                    this._leadService.ThirdPartyCreateLeadRetry(row.leadId, row.nbfcCompanyId).subscribe((res: any) => {
                        this.Loader = false;
                        if (res.status) {
                            this.messageService.add({ severity: 'success', summary: res.message, detail: '', life: 1000 });
                            setTimeout(() => {
                                // window.location.reload();
                                this.GetGenerateOfferStatus(this.leadId);
                            }, 1000);
                        }
                        else {
                            this.messageService.add({ severity: 'error', summary: res.message, life: 1000 });
                            setTimeout(() => {
                                // window.location.reload();
                                this.GetGenerateOfferStatus(this.leadId);
                            }, 1000);
                        }
                        // this.GetGenerateOfferStatus(this.leadId);
                    })
                } catch (error: any) {
                    this.Loader = false;
                    // alert(error.message);
                    this.messageService.add({ severity: 'error', summary: error.message });

                }
            },
            reject: () => {
            },
        });
    }

    isStringContainingArray(str: any) {
        var res = str.startsWith('[') && str.endsWith(']');
        var res2 = str.startsWith('{') && str.endsWith('}');
        return res || res2 ? true : false
    }

    GetBureau() {
        try {
            this.Loader = true
            var response = this._leadService.GetBureau().toPromise();
            this.Loader = false
            if (response != null) {
                this.CreditBureauDetails = response;
                console.log('CreditBureauDetails', this.LeadOfferData)
            }
        } catch (error: any) {
            this.Loader = false;
            // alert(error.message);
        }
    }

    OnReject(row: any) {
        this.rejectedRow = []
        this.IsReject = true;
        this.rejectedRow = row;
        console.log(this.rejectedRow, 'rejectedRow');

    }
    rejectedRow: any;
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
                    if (!this.userTypeRole) {
                        var payload = {
                            "LeadId": this.leadId,
                            // "Role": this.role + 'FIN',
                            "RejectMessage": this.MessageForReject,
                            "nbfcCompanyId": this.id
                        }
                        this._leadService.RejectNBFCOffer(payload).subscribe((res: any) => {
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
                    } else {
                        // this._leadService.LeadReject(this.leadId, this.MessageForReject).subscribe((res: any) => {
                        //     console.log(res);
                        //     this.Loader = false;
                        //     this.IsReject = false;
                        //     if (res.isSuccess) {
                        //         this.messageService.add({ severity: 'success', summary: res.message, detail: '', life: 1000 });
                        //         setTimeout(() => {
                        //             window.location.reload();
                        //         }, 1000);
                        //     }
                        //     else {
                        //         this.messageService.add({ severity: 'error', summary: res.message, detail: '', life: 1000 });
                        //     }
                        // },
                        //     (err: any) => {
                        //         this.Loader = false;
                        //         this.IsReject = false;
                        //         // alert(err.message)
                        //         this.messageService.add({ severity: 'error', summary: err.message });
                        //     })


                        const payload = {
                            LeadId: this.leadId,
                            NBFCCompanyId: this.rejectedRow.nbfcCompanyId,
                            CompanyIdentificationCode: this.rejectedRow.comapanyName,
                            Message: this.MessageForReject
                        }
                        console.log(payload, 'payload');

                        this._leadService.OfferReject(payload).subscribe((res: any) => {
                            console.log(res);
                            this.Loader = false;
                            this.IsReject = false;
                            if (res && res.isSuccess && res.result != null) {
                                this.messageService.add({ severity: 'success', summary: res.message });
                                setTimeout(() => {
                                    window.location.reload();
                                }, 1000);
                            } else {
                                this.messageService.add({ severity: 'error', summary: res.message });
                            }
                        }, (error: any) => { this.Loader = false; this.IsReject = false; })
                    }

                },
                reject: () => {
                },
            });
        }
        else {
            this.messageService.add({ severity: 'error', summary: 'Please fill Message', detail: '', life: 1000 });
        }
    }
    isFirstLetterNotSpace(sentence: string) {
        // Check if the first character is not a space
        return /^\S/.test(sentence);
    }
    cancel() {
        this.cibilScore = 0
        this.MessageForReject = null;
        this.onUploadFileUrl = '';
        this.myInputVariable2.nativeElement.value = null;
    }
    isConfirmUpdateOffer: boolean = false;
    interestRate: number = 0;
    minInterestRate: number = 0;
    maxInterestRate: number = 0;
    currentleadOfferid: number = 0;
    newOfferAmount: number = 0;
    maxOfferAmount: number = 0;
    isOfferDisabled: boolean = false;
    NbfcCompanyName: any;
    openApproveOfferBox(leadOfferid: any, minInterestrate: number, maxInterestrate: number, sanctonAmount: number, companyName: any, interestRate: number) {
        this.NbfcCompanyName = '';
        if(companyName == 'ArthMate') {
            this.currentleadOfferid = leadOfferid;
            this.isConfirmUpdateOffer = true;
            this.minInterestRate = minInterestrate;
            this.maxInterestRate = maxInterestrate;
            this.interestRate = this.minInterestRate;
            this.newOfferAmount = sanctonAmount;
            this.maxOfferAmount = this.newOfferAmount;
            this.NbfcCompanyName = companyName;
        }
        else {
            this.interestRate = interestRate;
            this.newOfferAmount = sanctonAmount;
            // this.isInterestRateApproved = true;
            this.currentleadOfferid = leadOfferid;
            this.minInterestRate = minInterestrate;
            this.maxInterestRate = maxInterestrate;
            this.maxOfferAmount = this.newOfferAmount;
            this.isConfirmUpdateOffer = true;
            this.isOfferDisabled = true;
            this.NbfcCompanyName = companyName;
            // this.UpdateOffer(leadOfferid)
        } 
    }


    UpdateOffer(leadOfferid: any) {
        this.currentleadOfferid = leadOfferid;
        console.log(this.interestRate);
        if (this.isInterestRateApproved) {
            this.confirmationService.confirm({
                message: 'Are you sure that you want to update?',
                accept: () => {
                    const payload = {
                        LeadOfferId: leadOfferid,
                        interestRate: this.interestRate,
                        newOfferAmout: this.newOfferAmount
                    }
                    this.Loader = true
                    // this._leadService.UpdateLeadOffer(leadOfferid, this.interestRate)
                    this._leadService.UpdateLeadOffer(payload).subscribe((result: any) => {
                        if (result.status) {
                            this.Loader = false
                            this.messageService.add({ severity: 'success', summary: 'offer updated', detail: '', life: 1000 });
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        }
                        else {
                            this.Loader = false
                            this.messageService.add({ severity: 'error', summary: 'something went wrong', detail: '' });
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
    }

    onClickApproved() {
        this.Loader = true;
        let payload = {
            leadId: this.leadId,
            Webhookresposne: ''
        }
        this._leadService.PostDisbursement(payload).subscribe((res: any) => {
            this.Loader = false;
            if (res.status) {
                this.messageService.add({ severity: 'success', summary: res.message, detail: '', life: 1000 });
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
            else {
                this.messageService.add({ severity: 'error', summary: res.message, detail: '' });
            }
        }, (error: any) => {
            this.Loader = false;
        })
    }

    ArthmateLoanOffer: any
    async GetLoan(leadid: any) {
        // console.log(this.AccenptOfferDetailsCompanyName, "AccenptOfferDetailsCompanyName")
        // if (this.isRolePermission && (this.AccenptOfferDetailsCompanyName == 'MASFIN' || this.AccenptOfferDetailsCompanyName == 'AYEFIN')) {
        //     this._leadService.GetAcceptedLoanDetail(leadid).subscribe((res: any) => {
        //         console.log(res);
        //         if (res.isSuccess) {
        //             this.ArthmateLoanOffer = res.result;
        //             console.log(this.ArthmateLoanOffer, 'ArthmateLoanOffer');
        //         }
        //     });
        // }
        // else {
        //     if (this.showOfferDetails && this.showOfferDetails.length > 0 && this.showOfferDetails[0].isCompleted == true) {
        //   await this.GetDisbursementProposal(this.leadId)
        this._leadService.GetLoan(leadid).subscribe((res: any) => {
            console.log(res);
            this.ArthmateLoanOffer = res[0];
            console.log(this.ArthmateLoanOffer, 'ArthmateLoanOffer');
            console.log(this.showOfferDetails[0].isCompleted, 'showOfferDetails[0].isCompleted');

            //   this.showOfferDetails.forEach((x:any)=>{
            //     if(x.activityName === 'Arthmate Show Offer'){
            //         this.showOfferActivityName = x.activityName;
            //     }
            // })
            // console.log(this.showOfferActivityName,'showOfferActivityName');
        });
        //     }
        // }
    }

    repaymentScheduleData: any
    repaymentSchedule(leadid: any) {
        // if (this.isRolePermission) {
        this._leadService.GetOfferEmiDetails(leadid).subscribe((res: any) => {
            console.log(res);
            if (res.isSuccess && res.result != null && res.result.length > 0) {
                this.repaymentScheduleData = res.result;
            }
        });
        // }
        // else {
        //     this._leadService.LoanRepaymentScheduleDetails(leadid).subscribe((res: any) => {
        //         console.log(res);
        //         if (res.status && res.data != null && res.data.length > 0) {
        //             this.repaymentScheduleData = res.data;
        //         }
        //     });
        // }
    }
    date1: any = null
    UMRN: any;
    insuranceAmount:any
    otherCharges:any
    FirstEMIdate:any=null
    OnsaveEmandate() {
        // return false;
        debugger;
        if (this.UMRNforNBFCDisbursement || (this.ArthmateLoanOffer.nbfcCompanyId == this.id && !(this.isDisbursed.length > 0) && this.isNbfcOfferAccepted)) {
            if (this.UMRN != null) {
                if (this.date1 == null) {
                    this.messageService.add({ severity: 'error', summary: 'Please Enter Disbursement Date First', detail: '' });
                }
                else{
                    if(this.FirstEMIdate == null) {
                        this.messageService.add({ severity: 'error', summary: 'Please Enter First EMI Date', detail: '' });
                    }
                    else{
                        this.Loader = true
                        var NBFCDisbursementDC = {
                            "LeadId": this.leadId,
                            "DisbursementDate":  moment(this.date1).format('YYYY-MM-DD'),
                            "FirstEMIDate":  moment(this.FirstEMIdate).format('YYYY-MM-DD'),
                            "UTR": this.UMRN,
                            // "IdentificationCode":this.role==undefined?this.CompanyName:this.role+'FIN'
                            "NbfcCompanyId": this.ArthmateLoanOffer?.nbfcCompanyId ? this.ArthmateLoanOffer?.nbfcCompanyId : 0,
                            "InsuranceAmount":this.insuranceAmount,
                            "OtherCharges":this.otherCharges,
                        }
                        console.log(NBFCDisbursementDC,"OtherCharges")
                        this._leadService.NBFCDisbursement(NBFCDisbursementDC).subscribe((res: any) => {
                            debugger
                            console.log(res);
                            this.Loader = false;
                            if (res.status) {
                                this.messageService.add({ severity: 'success', summary: 'Data Updated', detail: '', life: 1000 });
                                setTimeout(() => {
                                    window.location.reload();
                                }, 1000);
                            }
                        }, (error: any) => {
                            this.Loader = false;
                            this.messageService.add({ severity: 'error', summary: error.message, detail: '' });
                        })
                    }
                }
            }
            else {
                this.messageService.add({ severity: 'error', summary: 'Please Enter UMRN', detail: '' });
            }
        }
        else {
            if (this.UMRN != null) {
                this.Loader = true
                this._leadService.LoanNach(this.leadId, this.UMRN).subscribe((res: any) => {
                    console.log(res);
                    this.Loader = false;
                    if (res.status) {
                        this.messageService.add({ severity: 'success', summary: 'Data Updated', detail: '', life: 1000 });
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                }, (error: any) => {
                    this.Loader = false;
                    this.messageService.add({ severity: 'error', summary: error.message, detail: '' });
                })
            }
            else {
                this.messageService.add({ severity: 'error', summary: 'Please Enter UMRN', detail: '' });
            }
        }
    }
    falseUMRN: boolean = false
    UMRNLength(event: any) {
        if (this.UMRN && this.UMRN.length > 10) {
            this.falseUMRN = false
        }
        else {
            this.falseUMRN = true
        }
    }

    GetLoanByLoanId() {
        this._leadService.GetLoanByLoanId(this.leadId).subscribe((res: any) => {
        })
    }

    selectedLoanStatus: any;
    LoanStatus = [
        { value: 'kyc_data_approved', label: 'KYC Approved' },
    ];
    LoanStatusUpdate(loanstatus: any) {
        if (this.selectedLoanStatus != null) {
            this.Loader = true
            this._leadService.ChangeLoanStatus(this.leadId, this.selectedLoanStatus).subscribe((res: any) => {
                console.log(res);
                this.Loader = false;
                if (res.status) {
                    this.messageService.add({ severity: 'success', summary: res.msg, detail: '' });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
                else {
                    this.messageService.add({ severity: 'error', summary: res.msg, detail: '' });
                }
            }, (error: any) => {
                this.Loader = false;
                console.log(error);
                this.messageService.add({ severity: 'error', summary: error.message, detail: '' });
            })
        }
        else {
            this.messageService.add({ severity: 'error', summary: 'please select Loan Status', detail: '' });
        }
    }
    isInterestRateApproved: boolean = false;
    InterestRateApprove() {
        
        if (this.minInterestRate <= this.interestRate && this.maxInterestRate >= this.interestRate) {
            if (this.newOfferAmount > 60000 && this.newOfferAmount <= this.maxOfferAmount && !this.isOfferDisabled) {
                this.isInterestRateApproved = true;
                this.UpdateOffer(this.currentleadOfferid);
            }
            else if (this.isOfferDisabled) {
                this.isInterestRateApproved = true;
                this.UpdateOffer(this.currentleadOfferid);
            }
            else {
                this.messageService.add({ severity: 'error', summary: 'Offer Amount must be between 60000 to ' + this.maxOfferAmount, detail: '' });
            }
        }
        else if ( !(this.NbfcCompanyName == 'ArthMate')  && (this.minInterestRate <= this.interestRate && 50 >= this.interestRate)) {
            if (this.isOfferDisabled) {
                this.isInterestRateApproved = true;
                this.UpdateOffer(this.currentleadOfferid);
            }
        }
        else {
            if (!(this.NbfcCompanyName == 'ArthMate')) {
                this.messageService.add({ severity: 'error', summary: 'interest rate must between ' + this.minInterestRate + ' and ' + 50, detail: '' });
            }
            else {
                this.messageService.add({ severity: 'error', summary: 'interest rate must between ' + this.minInterestRate + ' and ' + this.maxInterestRate, detail: '' });
            }
        }
    }
    async GetLeadCommonDetail() {
        if (this.leadId > 0) {
            this.Loader = true;
            var res = await this._leadService.GetLeadCommonDetail(this.leadId).toPromise();
            this.Loader = false;
            if (res != null) {
                this.customerData = res;
                console.log(this.customerData, 'customerData');
                this.cibilScore = this.customerData.creditScore;
            }
        }
    }
    onOpenCibilPopup() {
        this.isCibilUpload = true;
        this.cibilScore = this.customerData.creditScore;
    }
    showImages(input: string) {
        this.showImage = true;
        this.dialogUrl = '';
        if (input.toLowerCase().includes('jpeg') || input.toLowerCase().includes('png') || input.toLowerCase().includes('jpg')) {
            this.showUrl = input;
        }
        else {
            this.dialogUrl = '../../../../../assets/img/pdflogo.png'
            this.showUrl = input
        }
    }
    showImage: boolean = false;
    showUrl: any
    dialogUrl: any
    downloadImage(value: any) {
        window.open(value);
    }
    cibilUpdate() {
        var flag = true;
        if (this.cibilScore > 900) {
            flag = false;
            this.messageService.add({ severity: 'error', summary: 'Cibil Score Would Be less than Or Equal 900', detail: '' });
        }
        else if (!(this.cibilScore > 0)) {
            flag = false;
            this.messageService.add({ severity: 'error', summary: 'Please Enter Cibil Score', detail: '' });
        } else if (!this.onUploadFileUrl) {
            flag = false;
            this.messageService.add({ severity: 'error', summary: 'Please Upload Cibil Document', detail: '' });
        }

        if (flag) {
            const payload = {
                LeadId: this.leadId,
                ProductCode: "BusinessLoan",
                CibilScore: this.cibilScore,
                CibilReport: this.onUploadFileUrl
            }
            this.Loader = true;
            this._leadService.UpdateCibilDetails(payload).subscribe((res: any) => {
                this.Loader = false;
                console.log(res);
                if (res.isSuccess) {
                    this.messageService.add({ severity: 'success', summary: res.message, detail: '' });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
                else {
                    this.messageService.add({ severity: 'error', summary: res.message, detail: '' });
                }
            })
        } else {

        }
    }
    @ViewChild('myInput2')
    myInputVariable2!: ElementRef;
    documentUpload(file: any, imgUploadType: string, event?: any) {
        if (file && file.target.files.length > 0) {
            let checkFlag = 1;
            let tempFiles: File[] = file.target.files;
            // debugger
            for (var element of tempFiles) {
                if (
                    element.name.toLowerCase().includes('jpeg') ||
                    element.name.toLowerCase().includes('png') ||
                    element.name.toLowerCase().includes('jpg') ||
                    element.name.toLowerCase().includes('pdf')
                ) {
                    if (element.size < 6000000) {
                    } else {
                        checkFlag = 0;
                        this.messageService.add({ severity: 'error', summary: 'Image Size is more than 6MB', detail: '' });
                    }
                } else {
                    // alert('Choose different file format!');
                    checkFlag = 0;
                    this.messageService.add({ severity: 'error', summary: 'Choose different file format!', detail: '' });
                    // event.nativeElement.value = '';
                    file.preventDefault();
                }
            };

            if (checkFlag == 1) {
                this.file = file.target.files;
                var reader = new FileReader();
                this.uploadDocumentFile(imgUploadType);
            } else if (checkFlag == 0) {
                // alert('Select Image size less than 6MB!!!');
                this.messageService.add({ severity: 'error', summary: 'Select Image size less than 6MB!!!', detail: '' });
                event.nativeElement.value = '';
            }
        } else {
            this.onUploadFileUrl = '';
            this.onUploadDocId = 0;
        }
    }
    file: any;
    onUploadDocId: any;
    onUploadFileUrl: any;
    uploadDocumentFile(imgUploadType: any) {
        const formData = new FormData();
        formData.append('FileDetails', this.file[0]);
        formData.append('IsValidForLifeTime', 'true');
        formData.append('ValidityInDays', '');
        formData.append('SubFolderName', '');
        this.onUploadFileUrl = '';
        this.Loader = true;
        this._leadService.postSingleFile(formData).subscribe((res: any) => {
            console.log('Uploaded File-', res);
            this.Loader = false;
            if (res.status) {
                this.messageService.add({ severity: 'success', summary: ' Please Click On Update Button', detail: '' });
                this.onUploadFileUrl = res.filePath;
                this.onUploadDocId = res.docId;
            }
            else {
                this.messageService.add({ severity: 'error', summary: res.message, detail: '' });
            }
        }, (error: any) => {
            this.Loader = false;
            this.messageService.add({ severity: 'error', summary: error.message, detail: '' });
        });
    }
    creditLimit: number = 0;
    isSave: boolean = false;
    LoanId: string = '';
    leadOfferId: any;
    commission: any;
    onSaveNbfcConfiguration(object: any) {
        if (this.creditLimit > 0 && this.generateOfferByFinanceData.tenure > 0 && this.generateOfferByFinanceData.monthlyPayment > 0) {
            if(this.LoanId ==''){
                this.messageService.add({ severity: 'error', summary: 'Please enter Loan Id first', detail: '' });
            }
            else{
                const payload = {
                    leadOfferId: this.leadOfferId ? this.leadOfferId : 0,
                    creditLimit: this.creditLimit,
                    tenure: this.generateOfferByFinanceData.tenure,
                    loanId: this.LoanId ? this.LoanId : '',
                    leadId: this.leadId,
                    interestRate: this.generateOfferByFinanceData.rateOfInterest,
                    loanInterestAmount: this.generateOfferByFinanceData.loanIntAmt,
                    monthlyEMI: this.generateOfferByFinanceData.monthlyPayment,
                    processingFeeAmount: this.generateOfferByFinanceData.processing_fee,
                    processingFeeRate: this.generateOfferByFinanceData.processingFeeRate,
                    pfDiscount: 0,
                    processingfeeTax: this.generateOfferByFinanceData.processingfeeTax,
                    pfType: this.generateOfferByFinanceData.pfType,
                    gst: this.generateOfferByFinanceData.gst,
                    commission: this.generateOfferByFinanceData.commission,
                    commissionType: this.generateOfferByFinanceData.commissionType,
                    NbfcCompanyId: this.userTypeRole ? 0 : this.id,
                    Bounce :this.generateOfferByFinanceData.Bounce,
                    Penal :this.generateOfferByFinanceData.Penal,
                    ArrangementType :this.generateOfferByFinanceData.ArrangementType,
                    NBFCBounce :this.generateOfferByFinanceData.NBFCBounce,
                    NBFCPenal :this.generateOfferByFinanceData.NBFCPenal,
                    NBFCInterest :this.generateOfferByFinanceData.NBFCInterest,
                    NBFCProcessingFee :this.generateOfferByFinanceData.NBFCProcessingFee,
                    NBFCProcessingFeeType :this.generateOfferByFinanceData.NBFCProcessingFeeType
                }
                this.Loader = true;
                this._leadService.UpdateLeadOfferByFinance(payload).subscribe(res => {
                    this.Loader = false
                    if (res.isSuccess && res.result) {
                        this.messageService.add({ severity: 'success', summary: res.message, detail: '' });
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                    else{
                        this.messageService.add({ severity: 'error', summary: res.message, detail: '' });
                    }
                    console.log(res);
                }, (error: any) => this.Loader = false)
            }
        }
        else if (this.isPfDiscountOnSave && object.pfDiscount > 0 && object.pfDiscount <= (object.processingfee + object.processingfeeTax)) {
            const payload = {
                leadOfferId: object.leadOfferId,
                creditLimit: object.creditLimit,
                tenure: object.tenure,
                loanId: '',
                leadId: this.leadId,
                interestRate: object.interestRate,
                loanInterestAmount: object.loanInterestAmount,
                monthlyEMI: object.monthlyEMI,
                processingFeeAmount: object.processingfee,
                processingFeeRate: object.processingfeeRate,
                pfDiscount: object.pfDiscount,
                processingfeeTax: object.processingfeeTax,
                pfType: object.pfType,
                gst: object.gstRate,
                NbfcCompanyId: object.nbfcCompanyId,
                Bounce :object.Bounce,
                Penal :object.Penal,
                ArrangementType :object.ArrangementType,
                NBFCBounce :object.NBFCBounce,
                NBFCPenal :object.NBFCPenal,
                NBFCInterest :object.NBFCInterest,
                NBFCProcessingFee :object.NBFCProcessingFee,
                NBFCProcessingFeeType :object.NBFCProcessingFeeType
            }
            this.Loader = true;
            this._leadService.UpdateLeadOfferByFinance(payload).subscribe(res => {
                this.Loader = false
                if (res.isSuccess && res.result) {
                    this.messageService.add({ severity: 'success', summary: res.message, detail: '' });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
                else{
                    this.messageService.add({ severity: 'error', summary: res.message, detail: '' });
                }
                console.log(res);
            }, (error: any) => this.Loader = false)
        }
        else {
            this.messageService.add({ severity: 'error', summary: 'Invalid Configuration', detail: '' });
        }
    }
    GenerateOfferByFinance(leadid: any, creditlimit: any) {
        if (this.creditLimit > 0) {
            const payload = {
                LeadId: leadid,
                OfferAmount: creditlimit,
                NbfcCompanyId: this.id
            }

            this.Loader = true;
            this._leadService.GenerateOfferByFinance(payload).subscribe(res => {
                console.log(res);
                if (res.status && res.response && res.response != null) {
                    this.Loader = false;
                    // this.anchorConfigurationData = res.response;
                    this.generateOfferByFinanceData.loanAmount = res.response.loanAmount
                    this.generateOfferByFinanceData.rateOfInterest = res.response.rateOfInterest
                    this.generateOfferByFinanceData.tenure = res.response.tenure
                    this.generateOfferByFinanceData.monthlyPayment = res.response.monthlyPayment
                    this.generateOfferByFinanceData.processing_fee = res.response.processing_fee
                    this.generateOfferByFinanceData.processingfeeTax = res.response.processingfeeTax
                    this.generateOfferByFinanceData.loanIntAmt = res.response.loanIntAmt
                    this.generateOfferByFinanceData.processingFeeRate = res.response.processingFeeRate
                    this.generateOfferByFinanceData.gst = res.response.gst
                    this.generateOfferByFinanceData.companyIdentificationCode = res.response.companyIdentificationCode
                    this.generateOfferByFinanceData.pfType = res.response.pfType
                    this.generateOfferByFinanceData.commission = res.response.commission
                    this.generateOfferByFinanceData.commissionType = res.response.commissionType
                    this.generateOfferByFinanceData.Bounce =res.response.bounce,
                    this.generateOfferByFinanceData.Penal = res.response.penal,
                    this.generateOfferByFinanceData.ArrangementType =res.response.arrangementType,
                    this.generateOfferByFinanceData.NBFCBounce =res.response.nbfcBounce,
                    this.generateOfferByFinanceData.NBFCPenal =res.response.nbfcPenal,
                    this.generateOfferByFinanceData.NBFCInterest =res.response.nbfcInterest,
                    this.generateOfferByFinanceData.NBFCProcessingFee =res.response.nbfcProcessingFee,
                    this.generateOfferByFinanceData.NBFCProcessingFeeType =res.response.nbfcProcessingFeeType
                    this.isSave = true;
                    // this.messageService.add({ severity: 'warn', summary: ' Please click on Save', detail: '' });
                    console.log(this.generateOfferByFinanceData, 'generateOfferByFinanceData');
                } else {
                    this.Loader = false;
                    this.messageService.add({ severity: 'warn', summary: res.message, detail: '' });
                }
            }, (error: any) => this.Loader = false)
        }
    }
    handleChange(event: any) {
        // const inputValue = event.target.value;
        // this.GenerateOfferByFinance(this.leadId, inputValue);
    }
    calculateConfiguration() {
        this.GenerateOfferByFinance(this.leadId, this.creditLimit);
        this.inputDisabled = true;
    }
    inputDisabled: boolean = false;
    isPfDiscountOnSave: boolean = false;
    clear() {
        this.isOfferDisabled = false;
        this.creditLimit = 0;
        this.generateOfferByFinanceData = {
            loanAmount: 0,
            rateOfInterest: 0,
            tenure: 0,
            monthlyPayment: 0,
            loanIntAmt: 0,
            processing_fee: 0,
            processingfeeTax: 0,
            processingFeeRate: 0,
            gst: 0,
            companyIdentificationCode: '',
            pfDiscount: 0,
            pfType: '',
            commission: 0,
            commissionType: '',
            Bounce :0,
            Penal :0,
            ArrangementType :'',
            NBFCBounce :0,
            NBFCPenal :0,
            NBFCInterest :0,
            NBFCProcessingFee :0,
            NBFCProcessingFeeType :''
        };
        this.isSave = false;
        this.inputDisabled = false;
    }
    onpfChange(event: any, companyName: string) {
        //     this.generateOfferStatusData.forEach((x:any) =>{
        //     if(x.comapanyName == companyName){
        //         debugger
        //         x.pfAfterDiscount =x.processingfee + x.processingfeeTax - x.pfDiscount
        //         if(x.pfDiscount > 0)
        //         this.isPfDiscountOnSave = true;
        //         else
        //         this.isPfDiscountOnSave = false;
        //     }
        // })
    }
    calculatePfDiscount(companyName: string) {
        this.generateOfferStatusData.forEach((x: any) => {
            if (x.comapanyName == companyName) {
                x.processingfeeAmount = x.pfType == 'Percentage' ? ((x.sanctonAmount * x.processingfeeRate) / 100) : x.processingfeeRate
                x.pfAfterDiscountCal = x.processingfeeAmount - x.pfDiscount;
                // x.processingfeeTaxAfterDiscount = (x.processingfeeAmount * x.gstRate) / 100;
                if (x.pfDiscount > 0) {
                    this.isPfDiscountOnSave = true;
                    this.inputDisabled = true;
                } else {
                    this.isPfDiscountOnSave = false;
                    this.inputDisabled = true;
                }
            }
        })
    }
    clearPfDiscount(companyName: string) {
        this.generateOfferStatusData.forEach((x: any) => {
            if (x.comapanyName == companyName) {
                x.pfAfterDiscountCal = x.processingfee;
                x.pfDiscount = 0;
                // if(x.pfDiscount > 0)
                // this.isPfDiscountOnSave = true;
                // else
                // this.isPfDiscountOnSave = false;
            }
        })
        this.inputDisabled = false
    }
    GetGenerateOfferByFinanceData: any;
    async GetGenerateOfferByFinance() {
        debugger
        this.isLoading = true
        try {
            const payload = {
                LeadId: this.leadId,
                NbfcCompanyId: this.userTypeRole ? 0 : this.id,
                // NbfcCompanyId: this.nbfcCompanyId,
                // Role: this.role + 'FIN'
            }
            var response = await this._leadService.GetGenerateOfferByFinance(payload).toPromise();
            if (response.status && response.response && response.response != null) {
                this.Loader = false;
                this.GetGenerateOfferByFinanceData = response.response;
                this.isLoading = !(this.GetGenerateOfferByFinanceData?.loanAmount > 0) ? false : true
                console.log(response, 'GetGenerateOfferByFinanceData');
                if(!this.userTypeRole){
                    var d = new Date(this.GetGenerateOfferByFinanceData.offerInitiateDate)
                    this.endday = d;
                }
            }
            else {
                this.Loader = false;
                this.isLoading = false;
            }
        }
        catch (error: any) {
            this.Loader = false;
            // alert(error.message);
        }
    }
    isNbfcOfferAccepted: boolean = false;
    async NbfcOfferAccepted() {
        if(!this.userTypeRole && this.id > 0){
            const payload = {
                LeadId: this.leadId,
                CompanyIdentificationCode: this.CompanyName ? this.CompanyName : '',
                NbfcCompanyId: this.userTypeRole ? 0 : this.id
            }
            var res = await this._leadService.NbfcOfferAccepted(payload).toPromise();
            if (res.result && res.isSuccess) {
                this.isNbfcOfferAccepted = res.result;
            } else {
            }
        }
    }
    emitResetShow() {
        debugger
        this.stateResetChange.emit(this.isShowReset)
    }
    onOfferPopupClose() {
        this.isInterestRateApproved = false;
        this.newOfferAmount = 0
        this.interestRate = 0
        this.currentleadOfferid = 0
    }
    onKeyDown(event: KeyboardEvent) {
        const charCode = event.keyCode || event.which;
        const charStr = String.fromCharCode(charCode);

        // Check if the character is a letter or a digit
        if (!charStr.match(/^[a-zA-Z0-9]*$/) && charCode !== 8 && charCode !== 9 && charCode !== 37 && charCode !== 39) {
            event.preventDefault();
        }
    }
}

interface GenerateOfferByFinanceData {
    "loanAmount": number;
    "rateOfInterest": number;
    "tenure": number;
    "monthlyPayment": number;
    "loanIntAmt": number;
    "processing_fee": number;
    "processingfeeTax": number;
    "processingFeeRate": number;
    "gst": number;
    "companyIdentificationCode": any;
    "pfDiscount": number;
    "pfType": string;
    "commission": number;
    "commissionType": string;
    "Bounce" :0;
    "Penal" :0;
    "ArrangementType" :'';
    "NBFCBounce" :0;
    "NBFCPenal" :0;
    "NBFCInterest" :0;
    "NBFCProcessingFee" :0;
    "NBFCProcessingFeeType" :'';
}