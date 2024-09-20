import { Component, OnDestroy } from '@angular/core';
import { LeadService } from '../../services/lead.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonValidationService } from 'app/shared/services/common-validation.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-bl-lead-details',
    templateUrl: './bl-lead-details.component.html',
    styleUrls: ['./bl-lead-details.component.scss']
})
export class BlLeadDetailsComponent implements OnDestroy {

    StatusList: any[]; // Define the type according to your needs
    StatusFilter: any;

    leadData: any
    loader: boolean = false;
    visible: boolean = false;
    kycDetails: any;
    blockval: boolean = false;
    // IsActive: boolean = false;
    IsBlock: boolean = false;
    leadActivitiesList: any[] = [];
    IsProfile: any = 'Profile';





    activityApprovalStatus = {
        "Pan": "",
        "Aadhar": "",
        "Selfie": "",
        "PersonalInfo": "",
        "BusinessInfo": "",
        "BankDetail": ""
    }

    address: Address = {
        addressLineOne: '',
        addressLineTwo: '',
        addressLineThree: '',
        cityName: '',
        countryName: '',
        stateName: '',
        zipCode: ''
    }

    businessDetail: BusinessDetail = {
        businessName: '',
        BusinessType: '',
        BusinessTurnOver: 0,
        IncorporationDate: '',
        IncomeSlab: 0,
        GstNumber: 0,
        CurrentAddress: this.address,
        buisnessProofUrl: ''
    };

    borrowerDetail: BorrowerDetail = {
        firstName: '',
        lastName: '',
        middleName: '',
        gender: '',
        dob: ''
    }

    panDetail: PanDetail = {
        fatherName: '',
        nameOnCard: '',
        uniqueId: '',
        frontImageUrl: '',
        doi: '',
        dob: ''
    }

    bankDetail: BankDetail = {
        borroBankAccNum: '',
        borroBankIFSC: '',
        borroBankName: '',
        accType: ''
    }

    aadharDetail: AadharDetail = {
        maskedAadhaarNumber: '',
        frontImageUrl: '',
        gender: '',
        dob: '',
        backImageUrl: '',
        country: '',
        name: '',
        pinCode: '',
        fatherName: '',
        locationAddress: this.address
    }

    personalDetail: PersonalDetail = {
        CurrentAddress: this.address,
        PermanentAddress: this.address,
        ElectricityBillImage: '',
        MobileNumber: ''
    }

    selfieDetail: SelfieDetail = {
        frontImageUrl: ''
    }

    loanAccount: LoanAccount = {
        LoanAccountId: 0,
        IsAccountActive: false,
        IsBlock: false,
        IsBlockComment: '',
        IsBlockHideLimit: false
    }

    //imageshow/download
    showImage: boolean = false;
    dialogUrl: any
    showUrl: any
    userrole: any;
    roles: any;
    customerData: any;
    userName: any
    LeadGeneratorConvertorObj: LeadGeneratorConvertor = {
        LeadId: 0,
        LeadGenerator: '',
        LeadConvertor: ''
    }
    userId: any;
    leadId: any;
    roleName: any;
    roleList: any;
    isRolePermission: boolean = false;
    // isAYERole:boolean= false;
    // isSuperadminrole:boolean = false;
    constructor(private activateRoute: ActivatedRoute, private _leadService: LeadService, private confirmationService: ConfirmationService, private commonValidation: CommonValidationService,
        private messageService: MessageService) {
        this.StatusList = [
            { label: 'Profile', value: 'Profile' },
            // { label: 'Activity', value: 'Activity' },
            { label: 'Offer', value: 'Offer' }
        ];




    }

    ngOnDestroy(): void {
        localStorage.removeItem("currPage")
    }
    userTypeRole:boolean=false
    async ngOnInit() {
        this.roles = localStorage.getItem('roles');
        console.log(this.roles, 'this.roles');
        this.userrole = this.roles.split(',');
        console.log(this.userrole, 'userrole');
        this.StatusFilter = this.StatusList[0].value;
        this.userName = localStorage.getItem('username');
        console.log(this.userName, 'this.userName');
        this.StatusFilter = this.StatusList[0].value;

        console.log(this.userrole);
        for (var i in this.userrole) {
            if (this.userrole[i] == 'MASOperationExecutive' || this.userrole[i] == 'AYEOperationExecutive') {
                this.isRolePermission = true;
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
        let currPage = localStorage.getItem('currPage')

        //   this.leadData = localStorage.getItem('LeadInfo');
        //   this.leadData = JSON.parse(this.leadData);
        //   console.log("this.leadData", this.leadData);
        this.userId = this.activateRoute.snapshot.paramMap.get('userId');
        this.leadId = this.activateRoute.snapshot.paramMap.get('leadId');
        await this.GetLeadDetails();
        await this.IsOfferGenerated(this.leadId);
        await this.GetOfferAccepted(this.leadId);
        await this.GetleadActivities(this.leadId, 1)
        this.GetLeadCommonDetail();
        this.GetLeadDataById();

        if (currPage) {
            this.IsProfile = currPage;
        } else {
            this.IsProfile = 'Profile'
            localStorage.setItem("currPage", this.IsProfile)
        }

    }

    setProfile() {
        localStorage.setItem('currPage', this.IsProfile)
    }

    dsaLeadData: any;
    isLeadConvertorDisabled: boolean = false;
    isLeadGeneratorDisabled: boolean = false;
    async GetLeadCommonDetail() {
        if (this.leadId > 0) {
            this.loader = true;
            var res = await this._leadService.GetLeadCommonDetail(this.leadId).toPromise();
            this.loader = false;
            if (res != null) {
                this.customerData = res;
                console.log(this.customerData);
                console.log(this.customerData?.leadConvertor, 'this.customerData?.leadConvertor');

                this.isLeadConvertorDisabled = (this.customerData?.leadConvertor) ? true : false;
                this.isLeadGeneratorDisabled = (this.customerData?.leadGenerator) ? true : false;
                console.log(this.isLeadConvertorDisabled, 'this.isLeadConvertorDisabled');
                console.log(this.isLeadGeneratorDisabled, 'this.isLeadGeneratorDisabled');
            }
        }
    }

    isLeadGeneratorPopup: boolean = false;
    addLeadPopup() {
        this.isLeadGeneratorPopup = true;
        this.LeadGeneratorConvertorObj.LeadConvertor = this.customerData?.leadConvertor;
        this.LeadGeneratorConvertorObj.LeadGenerator = this.customerData?.leadGenerator;
    }
    isValidate: boolean = false;
    addLeadGeneratorConvertor() {
        if (this.LeadGeneratorConvertorObj.LeadGenerator != null) {
            this.LeadGeneratorConvertorObj.LeadGenerator = this.LeadGeneratorConvertorObj.LeadGenerator.trim()
        }
        if (this.LeadGeneratorConvertorObj.LeadConvertor != null) {
            this.LeadGeneratorConvertorObj.LeadConvertor = this.LeadGeneratorConvertorObj.LeadConvertor.trim()
        }

        // this.LeadGeneratorConvertorObj.LeadGenerator = this.customerData?.leadGenerator ? this.customerData?.leadGenerator : this.LeadGeneratorConvertorObj.LeadGenerator
        // this.LeadGeneratorConvertorObj.LeadConvertor = this.customerData?.leadConvertor ? this.customerData?.leadConvertor : this.LeadGeneratorConvertorObj.LeadConvertor;
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
                'UserName': this.userName ? this.userName : ''
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
    async GetLeadDetails() {
        // this.Loader.isLoading(true);
        this.loader = true;
        var res = await this._leadService.GetLeadDetailsByUserId(this.userId, this.leadId).toPromise();

        // this.Loader.isLoading(false);
        this.loader = false;
        console.log(res, 'data');
        if (res) {
            if (res.buisnessDetail) {
                this.businessDetail.businessName = res.buisnessDetail.businessName;
                this.businessDetail.BusinessType = res.buisnessDetail.busEntityType;
                this.businessDetail.GstNumber = res.buisnessDetail.busGSTNO;
                this.businessDetail.IncorporationDate = res.buisnessDetail.doi;
                this.businessDetail.IncomeSlab = res.buisnessDetail.incomeSlab;
                this.businessDetail.CurrentAddress = res.buisnessDetail.currentAddress;
                this.businessDetail.buisnessProofUrl = res.buisnessDetail.buisnessProofUrl;

            }
            if (res.personalDetail) {
                this.borrowerDetail.firstName = res.personalDetail.firstName;
                this.borrowerDetail.lastName = res.personalDetail.lastName;
                this.borrowerDetail.middleName = res.personalDetail.middleName;
                this.borrowerDetail.gender = res.personalDetail.gender;
                this.personalDetail.CurrentAddress = res.personalDetail.currentAddress;
                this.personalDetail.PermanentAddress = res.personalDetail.permanentAddress;
                this.personalDetail.ElectricityBillImage = res.personalDetail.manualElectricityBillImage;
                this.personalDetail.MobileNumber = res.personalDetail.mobileNo;

            }
            if (res.panDetail) {
                this.borrowerDetail.dob = res.panDetail.dob;
                this.panDetail.dob = res.panDetail.dob;
                this.panDetail.fatherName = res.panDetail.fatherName;
                this.panDetail.uniqueId = res.panDetail.uniqueId;
                this.panDetail.nameOnCard = res.panDetail.nameOnCard;
                this.panDetail.frontImageUrl = res.panDetail.frontImageUrl;
            }
            if (res.bankStatementDetail) {
                this.bankDetail.borroBankAccNum = res.bankStatementDetail.borroBankAccNum;
                this.bankDetail.borroBankIFSC = res.bankStatementDetail.borroBankIFSC;
                this.bankDetail.borroBankName = res.bankStatementDetail.borroBankName;
                this.bankDetail.accType = res.bankStatementDetail.accType;
            }
            if (res.aadharDetail) {
                this.aadharDetail.maskedAadhaarNumber = res.aadharDetail.maskedAadhaarNumber;
                this.aadharDetail.frontImageUrl = res.aadharDetail.frontImageUrl;
                this.aadharDetail.backImageUrl = res.aadharDetail.backImageUrl;
                this.aadharDetail.gender = res.aadharDetail.gender;
                this.aadharDetail.dob = res.aadharDetail.dob;
                this.aadharDetail.country = res.aadharDetail.country;
                this.aadharDetail.locationAddress = res.aadharDetail.locationAddress;
                this.aadharDetail.fatherName = res.aadharDetail.fatherName;
                this.aadharDetail.pinCode = res.aadharDetail.pincode;
                this.aadharDetail.name = res.aadharDetail.name;
            }
            if (res.selfieDetail) {
                this.selfieDetail.frontImageUrl = res.selfieDetail.frontImageUrl;
            }
            if (res.loanAccount) {
                this.loanAccount.LoanAccountId = res.loanAccount.loanAccountId;
                this.loanAccount.IsAccountActive = res.loanAccount.isAccountActive;
                this.loanAccount.IsBlock = res.loanAccount.isBlock;
                this.loanAccount.IsBlockComment = res.loanAccount.isBlockComment;
                this.loanAccount.IsBlockHideLimit = res.loanAccount.isBlockHideLimit;
            }
        } else {
            // alert("ERROR - GetLeadDetailsByUserId")
        }
    }
    isOfferGenerated: boolean = false;
    isjump: boolean = false;
    istotalcount: any;
    isapproved: any;
    IsleadReject: boolean = false;
    IsOfferGeneratedFlag: boolean = false;

    onClickOffeGenerated() {
        var company: any = []
        if (this.selectedCompany && this.selectedCompany != null) {
            this.selectedCompany.forEach((x: any) => {
                company.push(x.nbfcId);
            })
            console.log(company);
        }
        if (this.isOfferGenerated == true && this.leadId > 0 && (this.customerData?.leadGenerator ? true : false) && (this.customerData?.leadConvertor ? true : false) && company.length > 0) {
            this.confirmationService.confirm({
                message: 'Are you sure that you want to Generate Offer?',
                accept: () => {
                    try {
 
                        const payload = {
                            LeadId: this.leadId,
                            CompanyIds: company ? company : [0]
                        }
                        this.loader = true;
                        this.isSelectedSendToLOSPopup = false;
                        // this._leadService.InitiateLeadOffer(this.leadId).subscribe(res => {
                        this._leadService.InitiateLeadOffer(payload).subscribe(res => {
                            if (res.status) {
                                this.loader = false;
                                
                                this.messageService.add({ severity: 'success', summary: res.message, detail: '' });
                                this.isOfferGenerated = false;
                                setTimeout(() => {
                                    window.location.reload();
                                }, 1000);
                            }
                            else {
                                this.isSelectedSendToLOSPopup = true;
                                this.loader = false;
                                this.messageService.add({ severity: 'error', summary: res.message, detail: '' });
                            }
                        }, (error: any) => {this.loader = false;this.isSelectedSendToLOSPopup = true;})
                    }
                    catch (error) {
                        // alert(error)
                        this.loader = false;
                    }
                }
            });
        }
        else {
            if (!(this.customerData?.leadGenerator ? true : false) && !(this.customerData?.leadConvertor ? true : false)) {
                this.messageService.add({ severity: 'error', summary: 'Please Enter Required Fields', detail: 'Lead Generator And Lead Convertor' });
            }
            else if (!(this.customerData?.leadGenerator ? true : false)) {
                this.messageService.add({ severity: 'error', summary: 'Please Enter Lead Generator', detail: '' });
            }
            else if (!(this.customerData?.leadConvertor ? true : false)) {
                this.messageService.add({ severity: 'error', summary: 'Please Enter Lead Convertor', detail: '' });
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
    isOfferAccepted: boolean = false
    async GetOfferAccepted(leadId: number) {
        if (leadId > 0) {
            try { 
                // this.loader = true;
                var res = await this._leadService.GetOfferAccepted(leadId).toPromise();
                // this.loader = false;
                if (res != null) {
                    if (res.isOfferAccepted) {
                        this.isOfferGenerated = false;
                        this.isOfferAccepted = true;
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
    refresh() {
        window.location.reload();
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
    reset() {
        if (this.leadId > 0) {
            this.confirmationService.confirm({
                message: 'Are you sure that you want to Reset?',
                accept: () => {
                    this.loader = true;
                    this._leadService.ResetLead(this.leadId, 'BusinessLoan').subscribe((res: any) => {
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
    MessageForLeadReject: any
    Reject() {
        // this.MessageForReject=this.MessageForReject.trim()
        if (this.MessageForLeadReject != null && this.MessageForLeadReject != '') {
            this.MessageForLeadReject = this.MessageForLeadReject.trim()
        }
        if (this.MessageForLeadReject != null && this.isFirstLetterNotSpace(this.MessageForLeadReject)) {
            this.confirmationService.confirm({
                message: 'Are you sure that you want to Reject?',
                accept: () => {
                    this.loader = true;
                    this._leadService.LeadReject(this.leadId, this.MessageForLeadReject).subscribe((res: any) => {
                        console.log(res);
                        this.loader = false;
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
                            this.loader = false;
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
    IsReject: boolean = false;
    OnReject() {
        this.IsReject = true;
    }
    GetLeadDataById() {
        this._leadService.GetLeadDataById(this.leadId).subscribe((res: any) => {
            console.log(res, 'GetDSALeadDataById');
            if (res.status) {
                this.dsaLeadData = res.response
            }
        })
    }
    cancel() {

    }
    isSelectedSendToLOSPopup: boolean = false;
    selectedCompany: any;
    companyData: any;
    async onClickSendToLOS() {
        await this.getNbfcCompanyList();
        await this.GetLeadOfferInitiatedStatus();

        console.log(this.companyData,'companyData');
        console.log(this.LeadOfferInitiatedStatus,'LeadOfferInitiatedStatus');  
        if (this.companyData != null && this.companyData.length > 0 ) {
            
            const filteredCompanyData = this.companyData.filter((company:any) => {
                var matchingStatuses:any[]=[]; 
                // Check if there are any entries in LeadOfferInitiatedStatus for the current company
                if(this.LeadOfferInitiatedStatus && this.LeadOfferInitiatedStatus.length > 0){
                     matchingStatuses = this.LeadOfferInitiatedStatus.filter((status:any) => status.nbfcCompanyId === company.nbfcId);
                }
        
                // Include the company if:
                // 1. There are no matching entries in LeadOfferInitiatedStatus
                // 2. None of the matching entries have the status 'Initiated'
                return matchingStatuses.length === 0 || !matchingStatuses.some((status:any) => status.status === 'Initiated' || status.status === 'OfferGenerated' || status.status == 'OfferRejected');
            });
        
            // Use the filteredCompanyData as needed
            console.log(filteredCompanyData);
            if(filteredCompanyData.length > 0){             
                this.companyData = filteredCompanyData;
            }
            else{
                this.companyData = []
                this.messageService.add({ severity: 'error', summary: 'NO Companies Found', detail: '', life: 1000 });
            }
            console.log(this.companyData, 'companyData');
            if(this.companyData.length > 0){
                this.isSelectedSendToLOSPopup = true;
            }
            else{
                this.isSelectedSendToLOSPopup = false;
            }
        }
    }
    async getNbfcCompanyList() {
        var res = await this._leadService.GetNbfcCompaniesByProduct(this.customerData.productId).toPromise();
        // .subscribe(res => {
        console.log(res, 'res');
        if (res && res.length > 0) {
            this.companyData = res;
        }
        // })
    }
    onChangeCompany(event: any) {
    }
    LeadOfferInitiatedStatus: any;
    async GetLeadOfferInitiatedStatus() {
        var res = await this._leadService.GetLeadOfferInitiatedStatus(this.leadId).toPromise();
        // .subscribe((res: any) => {
        console.log(res);
        if (res.isSuccess && res.result.length > 0) {
            this.LeadOfferInitiatedStatus = res.result
        }
        // },(error:any)=> this.loader = false)
    }
    isReset:boolean = false;
    onResetChange(change:any){   
        this.isReset = change == true ? true : false;
    }
    checkroleExistence(searchString: string): boolean {
        return this.userrole.includes(searchString);
    }
    isFirstLetterNotSpace(sentence: string) {
        // Check if the first character is not a space
        var res = this.commonValidation.isFirstLetterNotSpace(sentence);
        return /^\S/.test(sentence);
    }
    onkeypress(event: KeyboardEvent) {
        var res = this.commonValidation.onkeypress(event);
    }

    username: any = null;
    CommentBlock: boolean = false;
    isHideShow: any;
    isHideLimit: boolean = false;

}

interface BusinessDetail {
    businessName: string;
    BusinessType: string;
    BusinessTurnOver: number;
    IncorporationDate: string;
    IncomeSlab: number;
    GstNumber: number;
    CurrentAddress: Address;
    buisnessProofUrl: string;
}

interface BorrowerDetail {
    firstName: string;
    lastName: string;
    middleName: string;
    gender: string;
    dob: string;
}

interface PanDetail {
    fatherName: string;
    nameOnCard: string;
    uniqueId: string;
    frontImageUrl: string;
    doi: string;
    dob: string;
}

interface BankDetail {
    borroBankAccNum: string;
    borroBankIFSC: string;
    borroBankName: string;
    accType: string;
}
interface AadharDetail {
    maskedAadhaarNumber: string;
    frontImageUrl: string;
    gender: string;
    dob: string;
    backImageUrl: string;
    country: string;
    name: string;
    pinCode: string;
    fatherName: string;
    locationAddress: Address;
}

interface Address {
    addressLineOne: string;
    addressLineTwo: string;
    addressLineThree: string;
    cityName: string;
    countryName: string;
    stateName: string;
    zipCode: string;
}

interface PersonalDetail {
    CurrentAddress: Address;
    PermanentAddress: Address;
    ElectricityBillImage: string;
    MobileNumber: string;
}

interface SelfieDetail {
    frontImageUrl: string;
}

interface LoanAccount {
    LoanAccountId: number;
    IsAccountActive: boolean;
    IsBlock: boolean;
    IsBlockComment: string;
    IsBlockHideLimit: boolean;
}
interface LeadGeneratorConvertor {
    LeadId: number;
    LeadGenerator: string;
    LeadConvertor: string;
}
