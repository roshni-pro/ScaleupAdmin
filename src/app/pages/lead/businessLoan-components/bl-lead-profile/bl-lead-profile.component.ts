import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { LeadService } from '../../services/lead.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonValidationService } from 'app/shared/services/common-validation.service';
import { AnchorCompanyService } from 'app/pages/companies-master/services/anchor-company.service';
import { ToasterMessageService } from 'app/shared/services/toaster-message.service';
import { ActivatedRoute } from '@angular/router';
import { AddAnchorProductService } from 'app/pages/companies-master/services/add-anchor-product.service';

@Component({
    selector: 'app-bl-lead-profile',
    templateUrl: './bl-lead-profile.component.html',
    styleUrls: ['./bl-lead-profile.component.scss']
})
export class BlLeadProfileComponent implements OnInit {

    leadData: any
    loader: boolean = false;
    visible: boolean = false;
    kycDetails: any;
    blockval: boolean = false;
    // IsActive: boolean = false;
    IsBlock: boolean = false;
    leadActivitiesList: any[] = [];
    @ViewChild('fileRef', { static: false }) fileUploader?: ElementRef<HTMLInputElement>;
    @Input() isOfferAccepted: boolean = false;
    // approvalStatus = [
    //     { activity: "Pan", isApproved: false },
    //     { activity: "Aadhar", isApproved: false },
    //     { activity: "Selfie", isApproved: false },
    //     { activity: "PersonalInfo", isApproved: false },
    //     { activity: "BusinessInfo", isApproved: false },
    //     { activity: "Bank Detail", isApproved: false }
    // ]


    activityApprovalStatus = {
        "Pan": "",
        "Aadhar": "",
        "Selfie": "",
        "PersonalInfo": "",
        "BusinessInfo": "",
        "BankDetail": "",
        "MSME": ""
    }

    activityCompletionStatus = {
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
        stateId: 0,
        cityId: 0,
        zipCode: '',
        id: 0
    }

    businessDetail: BusinessDetail = {
        businessName: '',
        BusinessType: '',
        BusinessTurnOver: 0,
        IncorporationDate: '',
        IncomeSlab: '',
        GstNumber: '',
        CurrentAddress: this.address,
        buisnessProofUrl: '',
        InquiryAmount: 0,
        SurrogateType: '',
        buisenessMonthlySalary: 0,
        anchorCompanyName: '',
        vintageDays: '',
        businessVintageDays: ''
    };

    editBusinessDetail: BusinessDetail = {
        businessName: '',
        BusinessType: '',
        BusinessTurnOver: 0,
        IncorporationDate: '',
        IncomeSlab: 0,
        GstNumber: '',
        CurrentAddress: this.address,
        buisnessProofUrl: '',
        InquiryAmount: 0,
        SurrogateType: '',
        buisenessMonthlySalary: 0,
        anchorCompanyName: '',
        vintageDays: '',
        businessVintageDays: ''
    };

    borrowerDetail: BorrowerDetail = {
        firstName: '',
        lastName: '',
        middleName: '',
        gender: '',
        dob: '',
        ownershipType: '',
        alternatePhoneNo: ''
    }

    panDetail: PanDetail = {
        fatherName: '',
        nameOnCard: '',
        uniqueId: '',
        frontImageUrl: '',
        doi: '',
        dob: ''
    }

    // bankDetail: BankDetail[] = [{
    //     borroBankAccNum: '',
    //     borroBankIFSC: '',
    //     borroBankName: '',
    //     borroBankAccountholdername: '',
    //     accType: '',
    //     pdfPassword: '',
    //     isEnach: false,
    //     BankDetailId:0,
    //     Type:''
    // }]

    bankDetail: BankDetail[] = [{
        AccountNumber: '',
        IFSCCode: '',
        Bankname: '',
        Accountholdername: '',
        AccountType: '',
        pdfPassword: '',
        BankDetailId: 0,
        Type: ''
    }]


    ArthmateBankDetails: BankDetail = {
        AccountNumber: '',
        IFSCCode: '',
        Bankname: '',
        Accountholdername: '',
        AccountType: undefined,
        pdfPassword: '',
        BankDetailId: 0,
        Type: ''
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
        MobileNumber: '',
        OwnershipTypeAddress: '',
        OwnershipTypeName: '',
        ElectricityServiceProvider: '',
        ElectricityState: '',
        IvrsNumber: '',
        ownershipTypeResponseId: 0,
        EmailId: '',
        OwnershipType: '',
        AlternatePhoneNo: ''
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
    agreementDocument: AgreementDocument = {
        AgreementURL: '',
        AgreementDocId: 0
    }

    msmeDetail: MSME = {
        BusinessName: '',
        BusinessType: '',
        MsmeCertificateUrl: '',
        MsmeRegNum: '',
        Vintage: 0
    }


    constDocumentList = [
        {
            value: 'business_signboard',
            label: 'Business Signboard',
            docList: [],
            fileUrl: '',
            // DocumentNumber: '',
            documentName: 'business_signboard',
            LeadId: 0,
            FileUrl: '',
            PdfPassword: '',
        },
        {
            value: 'other_doc',
            label: 'Other Document',
            docList: [],
            fileUrl: '',
            // DocumentNumber: '',
            documentName: 'other_doc',
            LeadId: 0,
            FileUrl: '',
            PdfPassword: '',
        },
    ];

    // uploadDocument: UploadDocument = {
    //     documentNumber: '',
    //     documentName: '',
    //     leadId: 0,
    //     fileUrl: '',
    //     pdfPassword: '',
    // }

    uploadDocument = {
        DocumentNumber: '',
        DocumentName: '',
        LeadId: 0,
        FileUrl: '',
        PdfPassword: '',
    }

    editBusinessDetailObj: editBusinessDetails = {
        "businessName": '',
        "doi": undefined,
        "busGSTNO": '',
        "busEntityType": '',
        "busPan": '',
        "addressLineOne": '',
        "addressLineTwo": '',
        "addressLineThree": '',
        "zipCode": 0,
        "cityId": 0,
        "stateId": 0,
        "buisnessMonthlySalary": undefined,
        "incomeSlab": undefined,
        "buisnessProof": undefined,
        "buisnessProofUrl": '',
        "buisnessProofDocId": 0,
        "buisnessDocumentNo": undefined,
        "inquiryAmount": 0,
        "surrogateType": '',
        "status": false,
        "message": ''
    }
    uploadDocumentList = [
        { value: 'gst_certificate', label: 'GST Certificate', },
        { value: 'udyog_aadhaar', label: 'UdyogAadhaar' },
        { value: 'bank_statement', label: 'Statement' },
        { value: 'other', label: 'Other' }
        // { value: 'AadhaarFrontImage', label: 'AadhaarFrontImage' },
        // { value: 'AadhaarBackImage', label: 'AadhaarBackImage' },
        // { value: 'PANImage', label: 'PANImage' }
    ];

    buisnesTypeList = [
        // {value : '', label : 'Select Business Entity Type'},
        { value: 'Proprietorship', label: 'Proprietorship' },
        { value: 'Partnership', label: 'Partnership' },
        { value: 'Pvt Ltd', label: 'Pvt Ltd' },
        { value: 'HUF', label: 'HUF' },
        { value: 'LLP', label: 'LLP' },
        // {value : 'Trading', label : 'Trading'},
        // {value : 'Manufacturing', label : 'Manufacturing'},
        // {value : 'Others', label : 'Others'},
    ]
    incomeSlabList = [
        // {value : '0 k - 50 K', label : '0 k - 50 K'},
        // {value : '50 K- 5 lac', label : '50 K- 5 lac'},
        { value: 'Upto 3 Lacs', label: 'Upto 3 Lacs' },
        { value: '3 Lacs - 10 Lacs', label: '3 Lacs - 10 Lacs' },
        { value: '10 Lacs - 25 Lacs', label: '10 Lacs - 25 Lacs' },
        { value: 'Above 25 Lacs', label: 'Above 25 Lacs' },
        // {value : '25 lac- 50 lac', label : '25 lac- 50 lac'},
        // {value : '50 lac- 1 cr', label : '50 lac- 1 cr'},
    ]
    pattern: RegExp =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    //imageshow/download
    showImage: boolean = false;
    dialogUrl: any
    showUrl: any
    @ViewChild('myInput1')
    myInputVariable1!: ElementRef;
    @ViewChild('myInput2')
    myInputVariable2!: ElementRef;
    AccountTypeList: any[] = [];
    masterStatusCheck: any = {

        panApproveStatus: false,
        panRejectStatus: false,

        aadhaarApproveStatus: false,
        aadhaarRejectStatus: false,

        selfieApproveStatus: false,
        selfieRejectStatus: false,

        personalApproveStatus: false,
        personalRejectStatus: false,

        businessApproveStatus: false,
        businessRejectStatus: false,

        bankApproveStatus: false,
        bankRejectStatus: false,

        msmeApproveStatus: false,
        msmeRejectStatus: false,
    }
    userId: any;
    leadId: any;
    constructor(private activateRoute: ActivatedRoute, private companyService: AnchorCompanyService, private commonValidation: CommonValidationService, private _leadService: LeadService, private confirmationService: ConfirmationService, private toasterService: ToasterMessageService,
        private messageService: MessageService, private productService: AddAnchorProductService) {
        this.AccountTypeList = [
            { name: 'savings' }, { name: 'current' }
        ]
    }

    data: any;
    roleName: any;
    roleList: any;
    isRolePermission: boolean = false;
    role: any
    id: number = 0;
    isSuperadminrole: boolean = false;
    isAdminrole: boolean = false;
    idList: any;
    // isAYERole:boolean= false;
    // isSuperadminrole:boolean = false;
    userTypeRole:boolean=false
    async ngOnInit() {
        this.roleName = localStorage.getItem('roles');
        this.roleList = this.roleName.split(',');
        console.log(this.roleList);
        for (var i in this.roleList) {
            if (this.roleList[i] == 'MASOperationExecutive' || this.roleList[i] == 'AYEOperationExecutive') {
                this.role = this.roleList[i].slice(0, 3);
                this.isRolePermission = true;
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
        const companyId = localStorage.getItem('companyId');
        this.idList = companyId?.split(',');
        console.log(this.idList, typeof (this.idList));
        if (companyId !== null && this.idList.length > 1) {

        }
        else if (companyId !== null && this.idList.length > 0 && this.idList.length == 1) {
            this.id = JSON.parse(companyId);
            console.log('companyid', this.id);
        }
        this._leadService.currentdata.subscribe(message => this.data = message);
        console.log(this.data);



        this.userId = this.activateRoute.snapshot.paramMap.get('userId');
        this.leadId = this.activateRoute.snapshot.paramMap.get('leadId');
        await this.IsOfferGenerated(this.leadId);
        await this.GetleadActivities();
        await this.GetLeadDetails();
        this.GetAllState();
        this.CompanyBuyingHistory();
        this.GetLoan(this.leadId);
        this.GetLeadDocumentsByLeadId();
        this.GetMASFinanceAgreement();
    }

    IsOfferGeneratedFlag: boolean = false;
    async IsOfferGenerated(leadid: any) {
        if (leadid > 0) {
            // this.loader = true
            var res = await this._leadService.IsOfferGenerated(leadid).toPromise();
            console.log("IsOfferGeneratedFlag", res.result);
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

    async GetLeadDetails() {
        // this.Loader.isLoading(true);
        this.loader = true;
        var res = await this._leadService.GetLeadDetailsByUserId(this.userId, this.leadId).toPromise();

        // this.Loader.isLoading(false);
        this.loader = false;
        console.log(res, 'lead details');
        if (res) {
            if (res.buisnessDetail) {
                this.businessDetail.businessName = res.buisnessDetail.businessName;
                this.businessDetail.BusinessType = res.buisnessDetail.busEntityType;
                this.businessDetail.GstNumber = res.buisnessDetail.busGSTNO;
                this.businessDetail.IncorporationDate = res.buisnessDetail.doi;
                this.businessDetail.IncomeSlab = res.buisnessDetail.incomeSlab;
                this.businessDetail.CurrentAddress = res.buisnessDetail.currentAddress;
                this.businessDetail.buisnessProofUrl = res.buisnessDetail.buisnessProofUrl;
                this.businessDetail.InquiryAmount = res.buisnessDetail.inquiryAmount;
                this.businessDetail.SurrogateType = res.buisnessDetail.surrogateType;
                this.businessDetail.anchorCompanyName = res.buisnessDetail.anchorCompanyName;
                // this.businessDetail.vintageDays = res.buisnessDetail.vintageDays;
                this.businessDetail.vintageDays = this.convertDaysToMonthsAndDays(res.buisnessDetail.vintageDays);
                this.businessDetail.businessVintageDays = this.convertDaysToMonthsAndDays(res.buisnessDetail.businessVintageDays);
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
                this.personalDetail.IvrsNumber = res.personalDetail.ivrsNumber;
                this.personalDetail.ElectricityState = res.personalDetail.electricityState;
                this.personalDetail.ElectricityServiceProvider = res.personalDetail.electricityServiceProvider;
                this.personalDetail.OwnershipTypeAddress = res.personalDetail.ownershipTypeAddress;
                this.personalDetail.ownershipTypeResponseId = res.personalDetail.ownershipTypeResponseId;
                this.personalDetail.OwnershipTypeName = res.personalDetail.ownershipTypeName;
                this.personalDetail.OwnershipType = res.personalDetail.ownershipType;
                this.personalDetail.AlternatePhoneNo = res.personalDetail.alternatePhoneNo;
                this.borrowerDetail.ownershipType = res.personalDetail.ownershipType;
                this.borrowerDetail.alternatePhoneNo = res.personalDetail.alternatePhoneNo;
                this.personalDetail.EmailId = res.personalDetail.emailId;
                if (this.personalDetail.ElectricityState && parseInt(this.personalDetail.ElectricityState, 10) > 0) {
                    this.GetKarzaElectricityStateById(parseInt(this.personalDetail.ElectricityState, 10));
                }
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
                if (res.bankStatementDetail.length > 0) {
                    // this.bankDetail = res.bankStatementDetail;
                    res.bankStatementDetail.forEach((bank: any) => {
                        let bankobj: BankDetail = {
                            AccountNumber: bank.accountNumber,
                            IFSCCode: bank.ifscCode,
                            Bankname: bank.bankname,
                            Accountholdername: bank.accountholdername,
                            AccountType: bank.accountType,
                            BankDetailId: bank.bankDetailId,
                            Type: bank.type,
                            pdfPassword: bank.pdfPassword
                        }
                        this.bankDetail.push(bankobj);
                    })
                } else {
                    this.bankDetail = [];
                }
                console.log(this.bankDetail, 'this.bankDetail');
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
            if (res.msmeDetail) {
                this.msmeDetail.BusinessName = res.msmeDetail.businessName;
                this.msmeDetail.BusinessType = res.msmeDetail.businessType;
                this.msmeDetail.MsmeCertificateUrl = res.msmeDetail.msmeCertificateUrl;
                this.msmeDetail.MsmeRegNum = res.msmeDetail.msmeRegNum;
                this.msmeDetail.Vintage = res.msmeDetail.vintage;
            }
        } else {
            // alert("ERROR - GetLeadDetailsByUserId")
        }
    }

    OpenPdf(item: any) {
        window.open(item);
    }


    username: any = null;
    CommentBlock: boolean = false;
    isHideShow: any;
    isHideLimit: boolean = false;

    // ActiveInactive() {
    //     // debugger
    //     var message: string
    //     if (this.loanAccount.IsAccountActive) {
    //         message = 'Active';
    //     } else {
    //         message = 'InActive';
    //     }

    //     this.loader = true;

    //     this.confirmationService.confirm({
    //         message: 'Are you sure want to' + ' ' + message + ' ' + 'User' + ' ',
    //         accept: () => {
    //             this._leadService.CustomerActiveInActive(this.loanAccount.LoanAccountId, this.loanAccount.IsAccountActive).subscribe((res: any) => {
    //                 this.loader = false;
    //                 if (res && res.status == true) {
    //                     // alert(res.message);
    //                     this.messageService.add({ severity: 'success', summary: res.message });

    //                     // this.loanAccount.IsAccountActive = this.loanAccount.IsAccountActive;
    //                 } else if (res && res.status == false) {
    //                     // alert(res.message);
    //                     this.messageService.add({ severity: 'error', summary: res.message });
    //                     this.loanAccount.IsAccountActive = !this.loanAccount.IsAccountActive;
    //                 } else {

    //                 }
    //             })
    //         },
    //         reject: () => {
    //             this.loader = false;
    //             this.loanAccount.IsAccountActive = !this.loanAccount.IsAccountActive;
    //         }
    //     })

    // }

    // BlockUser() {
    //     debugger
    //     this.isHideLimit = this.loanAccount.IsBlockHideLimit;
    //     if (this.isHideLimit == true) {
    //         this.isHideShow = 'HideLimit'
    //     }
    //     else {
    //         this.isHideShow = 'ShowLimit'
    //     }
    //     // if () {
    //     //     alert('user is active can not be block');
    //     //     // return false;
    //     // }
    //     this.Comment = '';
    //     this.CommentBlock = true
    //     debugger
    //     // this._leadService.CustomerBlock(this.loanAccount.LoanAccountId,this.Comment,this.loanAccount.IsBlockHideLimit,this.username).subscribe((res)=>{
    //     //     console.log(res);  
    //     // })
    // }

    // OnBlock() {
    //     debugger
    //     if (this.isHideShow == 'HideLimit') {
    //         this.isHideLimit = true
    //     }
    //     else {
    //         this.isHideLimit = false;
    //     }

    //     this.confirmationService.confirm({
    //         message: 'Are you sure want to' + ' ' + 'Block User' + ' ' + 'this confirmation?',
    //         accept: () => {
    //             if (this.Comment != '' && this.Comment != null) {

    //                 this.loader = true;
    //                 this._leadService.CustomerBlock(this.loanAccount.LoanAccountId, this.Comment, this.isHideLimit, this.username).subscribe(res => {
    //                     this.loader = false;

    //                     if (res.Msg == 'User Blocked') {
    //                         if (!this.blockval) {
    //                             this.blockval = true;
    //                         }
    //                         this.IsBlock = true
    //                         // alert(res.Msg);
    //                         this.messageService.add({ severity: 'info', summary: res.Msg });
    //                         this.CommentBlock = false;
    //                     }
    //                     else {
    //                         // alert(res.Msg);
    //                         this.messageService.add({ severity: 'info', summary: res.Msg });
    //                         this.IsBlock = false;
    //                         this.CommentBlock = false;
    //                     }
    //                 });
    //             }
    //             else {
    //                 // alert("enter comment!");
    //                 this.messageService.add({ severity: 'error', summary: 'enter comment' });

    //                 this.IsBlock = false
    //                 this.CommentBlock = false;
    //             }
    //         },
    //         reject: () => {
    //             this.IsBlock = false
    //             this.CommentBlock = false;

    //         }
    //     })
    // }

    CancelButton() {
        // this.CommentBlock = false;
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

    showMultiImage: boolean = false
    showMultiImgList: any[] = [];
    showMultiImages(input: any) {
        debugger
        this.showMultiImgList = [];
        this.dialogUrl = '../../../../../assets/img/pdflogo.png';
        console.log('input', input)
        this.showMultiImage = true;
        let imgList: any[] = input;
        if (imgList.length > 0) {
            imgList.forEach((element: any) => {
                console.log(element);
                let obj = {
                    url: '',
                    logo: ''
                }
                if (element.toLowerCase().includes('jpeg') || element.toLowerCase().includes('png') || element.toLowerCase().includes('jpg')) {
                    obj.url = element;
                    obj.logo = element
                    this.showMultiImgList.push(obj);
                }
                else {
                    obj.url = element;
                    obj.logo = this.dialogUrl;
                    this.showMultiImgList.push(obj);
                }
            });
        }
        console.log(this.showMultiImgList);

    }

    downloadImage(value: any) {
        window.open(value);
    }

    async GetleadActivities() {
        this.leadActivitiesList = [];
        if (this.leadId > 0) {
            try {
                this.loader = true;
                var res = await this._leadService.GetLeadActivityProgressList(this.leadId).toPromise();
                if (res.status) {
                    this.loader = false;
                    // var data = res.leadActivityProgress.filter((x: any) => {
                    //     if (x.activityName != "MobileOtp") return x
                    // })
                    // console.log("this.leadActivitiesList", this.leadActivitiesList);
                    this.leadActivitiesList = res.leadActivityProgress;
                    this.leadActivitiesList.forEach((x: any) => {
                        x.activity = x.subActivityName ? x.subActivityName : x.activityName

                        // this.approvalStatus.forEach((status: any) => {
                        //     if(status.activity == x.activity){
                        //         status.isApproved = x.isApproved;
                        //     }
                        // });

                        let status = "";
                        let compStatus = "";

                        if (x.isApproved == 1) {
                            status = "Accepted"
                        } else if (x.isApproved == 2) {
                            status = "Rejected"
                        } else {
                            status = ''
                        }

                        // if (x.isApproved == 1) {
                        //     status = "Accepted"
                        // } else if (x.isApproved == 2) {
                        //     status = "Rejected"
                        // } else {
                        //     status = ''
                        // }

                        switch (x.activity) {
                            case "Pan":
                                this.activityApprovalStatus.Pan = status;
                                if (x.isApproved == 0 && x.isCompleted) {
                                    this.masterStatusCheck.panApproveStatus = true;
                                    this.masterStatusCheck.panRejectStatus = true;
                                } else if (x.isApproved == 1 && x.isCompleted) {
                                    this.masterStatusCheck.panApproveStatus = false;
                                    this.masterStatusCheck.panRejectStatus = true;
                                } else if (x.isApproved == 2 && x.isCompleted) {
                                    this.masterStatusCheck.panApproveStatus = false;
                                    this.masterStatusCheck.panRejectStatus = false;
                                } else {
                                    this.masterStatusCheck.panApproveStatus = false;
                                    this.masterStatusCheck.panRejectStatus = false;
                                }
                                break;
                            case "Aadhar":
                                this.activityApprovalStatus.Aadhar = status;
                                if (x.isApproved == 0 && x.isCompleted) {
                                    this.masterStatusCheck.aadhaarApproveStatus = true;
                                    this.masterStatusCheck.aadhaarRejectStatus = true;
                                } else if (x.isApproved == 1 && x.isCompleted) {
                                    this.masterStatusCheck.aadhaarApproveStatus = false;
                                    this.masterStatusCheck.aadhaarRejectStatus = true;
                                } else if (x.isApproved == 2 && x.isCompleted) {
                                    this.masterStatusCheck.aadhaarApproveStatus = false;
                                    this.masterStatusCheck.aadhaarRejectStatus = false;
                                } else {
                                    this.masterStatusCheck.aadhaarApproveStatus = false;
                                    this.masterStatusCheck.aadhaarRejectStatus = false;
                                }
                                break;
                            case "Bank Detail":
                                this.activityApprovalStatus.BankDetail = status;
                                if (x.isApproved == 0 && x.isCompleted) {
                                    this.masterStatusCheck.bankApproveStatus = true;
                                    this.masterStatusCheck.bankRejectStatus = true;
                                } else if (x.isApproved == 1 && x.isCompleted) {
                                    this.masterStatusCheck.bankApproveStatus = false;
                                    this.masterStatusCheck.bankRejectStatus = true;
                                } else if (x.isApproved == 2 && x.isCompleted) {
                                    this.masterStatusCheck.bankApproveStatus = false;
                                    this.masterStatusCheck.bankRejectStatus = false;
                                } else {
                                    this.masterStatusCheck.bankApproveStatus = false;
                                    this.masterStatusCheck.bankRejectStatus = false;
                                }
                                break;
                            case "BusinessInfo":
                                this.activityApprovalStatus.BusinessInfo = status;
                                if (x.isApproved == 0 && x.isCompleted) {
                                    this.masterStatusCheck.businessApproveStatus = true;
                                    this.masterStatusCheck.businessRejectStatus = true;
                                } else if (x.isApproved == 1 && x.isCompleted) {
                                    this.masterStatusCheck.businessApproveStatus = false;
                                    this.masterStatusCheck.businessRejectStatus = true;
                                } else if (x.isApproved == 2 && x.isCompleted) {
                                    this.masterStatusCheck.businessApproveStatus = false;
                                    this.masterStatusCheck.businessRejectStatus = false;
                                } else {
                                    this.masterStatusCheck.businessApproveStatus = false;
                                    this.masterStatusCheck.businessRejectStatus = false;
                                }
                                break;
                            case "PersonalInfo":
                                this.activityApprovalStatus.PersonalInfo = status;
                                if (x.isApproved == 0 && x.isCompleted) {
                                    this.masterStatusCheck.personalApproveStatus = true;
                                    this.masterStatusCheck.personalRejectStatus = true;
                                } else if (x.isApproved == 1 && x.isCompleted) {
                                    this.masterStatusCheck.personalApproveStatus = false;
                                    this.masterStatusCheck.personalRejectStatus = true;
                                } else if (x.isApproved == 2 && x.isCompleted) {
                                    this.masterStatusCheck.personalApproveStatus = false;
                                    this.masterStatusCheck.personalRejectStatus = false;
                                } else {
                                    this.masterStatusCheck.personalApproveStatus = false;
                                    this.masterStatusCheck.personalRejectStatus = false;
                                }
                                break;
                            case "Selfie":
                                this.activityApprovalStatus.Selfie = status;
                                if (x.isApproved == 0 && x.isCompleted) {
                                    this.masterStatusCheck.selfieApproveStatus = true;
                                    this.masterStatusCheck.selfieRejectStatus = true;
                                } else if (x.isApproved == 1 && x.isCompleted) {
                                    this.masterStatusCheck.selfieApproveStatus = false;
                                    this.masterStatusCheck.selfieRejectStatus = true;
                                } else if (x.isApproved == 2 && x.isCompleted) {
                                    this.masterStatusCheck.selfieApproveStatus = false;
                                    this.masterStatusCheck.selfieRejectStatus = false;
                                } else {
                                    this.masterStatusCheck.selfieApproveStatus = false;
                                    this.masterStatusCheck.selfieRejectStatus = false;
                                }
                                break;
                            case "MSME":
                                this.activityApprovalStatus.MSME = status;
                                if (x.isApproved == 0 && x.isCompleted) {
                                    this.masterStatusCheck.msmeApproveStatus = true;
                                    this.masterStatusCheck.msmeRejectStatus = true;
                                } else if (x.isApproved == 1 && x.isCompleted) {
                                    this.masterStatusCheck.msmeApproveStatus = false;
                                    this.masterStatusCheck.msmeRejectStatus = true;
                                } else if (x.isApproved == 2 && x.isCompleted) {
                                    this.masterStatusCheck.msmeApproveStatus = false;
                                    this.masterStatusCheck.msmeRejectStatus = false;
                                } else {
                                    this.masterStatusCheck.msmeApproveStatus = false;
                                    this.masterStatusCheck.msmeRejectStatus = false;
                                }
                                break;
                            default:
                                break;
                        }
                    })

                    console.log("this.leadActivitiesList", this.leadActivitiesList, this.activityApprovalStatus);

                }
                else {
                    this.loader = false;
                    this.messageService.add({ severity: 'error', summary: 'Data Not Found' });
                }
            }
            catch (error: any) {
                this.loader = false;
                this.messageService.add({ severity: 'error', summary: 'Error API - GetLeadActivityProgressList', detail: error });
            }
        }

    }

    // onApproved() {
    //     this.confirmationService.confirm({
    //         message: 'Are you sure that you want to approve?',
    //         accept: () => {

    //             let payload = {
    //                 "LeadId": this.selectedActionStatus.LeadId,
    //                 "ActivityMasterId": this.selectedActionStatus.ActivityMasterId ? this.selectedActionStatus.ActivityMasterId : 0,
    //                 "SubActivityMasterId": this.selectedActionStatus.SubActivityMasterId ? this.selectedActionStatus.SubActivityMasterId : 0,
    //                 "IsApprove": 1,
    //                 "Comment": this.Comment
    //             }

    //             this.loader = true;
    //             this._leadService.VerifyLeadDocument(payload).subscribe(x => {
    //                 this.loader = false;
    //                 if (x.status) {
    //                     this.messageService.add({ severity: 'success', summary: x.message, detail: "" });
    //                     this.GetleadActivities();
    //                     // this.loader=false;
    //                 } else {
    //                     this.messageService.add({ severity: 'error', summary: "Error - Not Approved", detail: 'Please Try Again' });
    //                 }
    //             })
    //         }
    //     });
    // }


    Comment: any = '';
    changeActivity(status: any, activityName: any) {
        var activityMasterId = this.leadActivitiesList.filter((x: any) => x.activity == activityName)[0].activityMasterId
        var subActivityMasterId = this.leadActivitiesList.filter((x: any) => x.activity == activityName)[0].subActivityMasterId
        // let payload = {
        //     "LeadId": this.leadId,
        //     "ActivityMasterId": this.selectedActionStatus.activityMasterId ? this.selectedActionStatus.activityMasterId : 0,
        //     "SubActivityMasterId": this.selectedActionStatus.subActivityMasterId ? this.selectedActionStatus.subActivityMasterId : 0,
        //     "IsApprove": status,
        //     "Comment": 'status change'
        // }
        let payload = {
            "LeadId": this.leadId,
            "ActivityMasterId": activityMasterId ? activityMasterId : 0,
            "SubActivityMasterId": subActivityMasterId ? subActivityMasterId : 0,
            "IsApprove": status,
            "Comment": 'status change'
        }
        try {
            // if (this.Comment.trim() == '') {
            //     this.messageService.add({ severity: 'warn', summary: "Alert!", detail: "Leave a comment for your action" });
            // } else {
            this.loader = true;
            this._leadService.VerifyLeadDocument(payload).subscribe(res => {
                this.loader = false;
                if (res.status) {
                    this.isRejectDoc = false;
                    this.messageService.add({ severity: 'success', summary: res.message, detail: "" });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                    // this.GetleadActivities();
                }
                else {
                    this.messageService.add({ severity: 'error', summary: "Error - Not Rejected", detail: "" });
                }
            })
            // }
        }
        catch (error) {
            // alert(error)
            this.loader = false;
        }
    }


    isRejectDoc: boolean = false;
    selectedActionStatus: any;
    isBankDetailApprove: boolean = false;
    changeStatus(action: any, status: any) {

        this.Comment = '';
        this.selectedActionStatus = null;
        this.selectedActionStatus = this.leadActivitiesList.filter((x: any) =>
            x.activity == action
        )[0];

        // region start for stop approval of without complete beneficiary bank detail
        if (action == 'Bank Detail') {
            // if (this.bankDetail.borroBankAccNum != null && this.bankDetail.borroBankName != null && this.bankDetail.borroBankIFSC != null && this.bankDetail.borroBankAccountholdername != null && this.bankDetail.accType != null && this.bankDetail.beneficiary_Typeofaccount != null && this.bankDetail.beneficiary_AccountNumber != null && this.bankDetail.beneficiary_Accountholdername != null && this.bankDetail.beneficiary_Bankname != null && this.bankDetail.beneficiary_IFSCCode != null) {
            //     this.isBankDetailApprove = true;
            // }
        }
        // region end

        this.isRejectDoc = true;
        // console.log(action, status);
        console.log("this.selectedActionStatus", this.selectedActionStatus);
    }

    companyBuyingHistories: any
    totalrecord: number = 0
    CompanyBuyingHistory() {
        this.companyBuyingHistories = [];
        // this.iscompanyBuyingHistories=true;
        const companyId = Number(localStorage.getItem('selectedcompany'));
        this.loader = true;
        this._leadService.GetCompanyBuyingHistory(companyId, this.leadId).subscribe((res: any) => {
            console.log("GetCompanyBuyingHistory", res);
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

    selectedLoanStatus: any;
    LoanStatus = [
        { value: '1', label: 'kyc_data_approved' },
    ];
    LoanStatusUpdate(loanstatus: any) {
        if (this.selectedLoanStatus != null) {
            this.loader = true
            this._leadService.ChangeLoanStatus(this.leadId, this.selectedLoanStatus.label).subscribe((res: any) => {
                console.log("ChangeLoanStatus", res);
                this.loader = false;
                if (res.status) {
                    this.messageService.add({ severity: 'success', summary: res.msg, detail: '' });
                }
                else {
                    this.messageService.add({ severity: 'success', summary: res.status, detail: '' });
                }
            }, (error: any) => {
                this.loader = false;
                console.log(error);
                this.messageService.add({ severity: 'error', summary: error.message, detail: '' });
            })
        }
        else {
            this.messageService.add({ severity: 'error', summary: 'please select Loan Status', detail: '' });
        }
    }


    file: any;
    imagePath: any;
    upload(file: any, imgUploadType: string, event?: any) {
        if (
            file.target.files[0].name.toLowerCase().includes('jpeg') ||
            file.target.files[0].name.toLowerCase().includes('png') ||
            file.target.files[0].name.toLowerCase().includes('jpg') ||
            (file.target.files[0].name.toLowerCase().includes('pdf') &&
                imgUploadType != 'LogoURL')
        ) {
            if (file.target.files[0].size < 6000000) {
                this.file = file.target.files;
                var reader = new FileReader();
                this.imagePath = file;
                this.uploadFile(imgUploadType);
                (success: any) => {
                    // alert('image uploaded successfully');
                    this.messageService.add({ severity: 'success', summary: 'image uploaded successfully', detail: '' });
                    this.uploadFile(imgUploadType);
                };
            } else {
                // alert('Select Image size less than 6MB!!!');
                this.messageService.add({ severity: 'error', summary: 'Select Image size less than 6MB!!!', detail: '' });

                event.nativeElement.value = '';
            }
        } else {
            // alert('Choose different file format!');
            this.messageService.add({ severity: 'error', summary: 'Choose different file format!', detail: '' });

            event.nativeElement.value = '';
            file.preventDefault();
        }
    }

    AgreementDocument: any
    uploadFile(imgUploadType: any) {
        const formData = new FormData();
        formData.append('FileDetails', this.file[0]);
        formData.append('IsValidForLifeTime', 'true');
        formData.append('ValidityInDays', '');
        formData.append('SubFolderName', '');
        this.loader = true;
        this._leadService.postSingleFile(formData).subscribe((res: any) => {
            console.log('Uploaded File-', res);
            this.loader = false;
            if (res.status) {
                this.messageService.add({ severity: 'success', summary: 'Click on Upload Button', detail: '' });
                // this.messageService.add({ severity: 'success', summary: res.message, detail: '' });
                this.agreementDocument.AgreementURL = res.filePath;
                this.agreementDocument.AgreementDocId = res.docId;
                // console.log(this.agreementDocument, 'agreementDocument');

                // }
            }
            else {
                this.messageService.add({ severity: 'error', summary: res.message, detail: '' });
            }
        }, (error: any) => {
            this.loader = false;
            this.messageService.add({ severity: 'error', summary: error.message, detail: '' });
        });
    }

    onUpload() {
        if (this.agreementDocument.AgreementURL) {
            this.loader = true;
            this._leadService.SaveAgreementESignDocument(this.leadId, this.agreementDocument.AgreementURL).subscribe((res: any) => {
                console.log("SaveAgreementESignDocument", res);
                this.loader = false;
                if (res.status) {
                    this.messageService.add({ severity: 'success', summary: res.msg, detail: '' });
                }
                else {
                    this.messageService.add({ severity: 'error', summary: res.msg, detail: '' });
                }
            }, (error: any) => {
                this.loader = false;
                this.messageService.add({ severity: 'error', summary: error.message, detail: '' });
            })
        }
        else {
            this.messageService.add({ severity: 'error', summary: 'Please select file for upload', detail: '' });
        }
        this.myInputVariable1.nativeElement.value = null;
    }

    ArthmateLoanOffer: any
    async GetLoan(leadid: any) {
        this._leadService.GetLoan(leadid).subscribe((res: any) => {
            console.log("GetLoan", res);
            this.ArthmateLoanOffer = res[0];
            //   this.ArthmateLoanOffer.urlSlaDocument
            // this.ArthmateLoanOffer.loanStatus
        });
    }

    GetLoanByLoanId() {
        this._leadService.GetLoanByLoanId(this.leadId).subscribe((res: any) => {
            console.log("GetLoanByLoanId", res);
        })
    }
    isViewLoanStatus: boolean = false;
    viewLoanStatus() {
        this.isViewLoanStatus = true;
        this.GetLoanByLoanId();
    }


    UpdateBeneficiaryBankDetailOfArthmate() {
        const payload = {
            LeadMasterId: this.leadId,
            Beneficiary_AccountNumber: this.ArthmateBankDetails.AccountNumber,
            Beneficiary_Accountholdername: this.ArthmateBankDetails.Accountholdername,
            // Beneficiary_Typeofaccount: this.ArthmateBankDetails.AccountType,
            Beneficiary_Typeofaccount: this.ArthmateBankDetails.AccountType.name,
            Beneficiary_Bankname: this.selectBankName.bankName,
            Beneficiary_IFSCCode: this.ArthmateBankDetails.IFSCCode,
            BankDetailId: this.ArthmateBankDetails.BankDetailId,
            Type: this.ArthmateBankDetails.Type
        }
        // { name: this.tempNachBankDetail.AccountType };
        console.log("UpdateBeneficiaryBankDetailOfArthmate payload", payload);

        // return false;
        this.loader = true;
        this._leadService.UpdateBeneficiaryBankDetailOfArthmate(payload).subscribe((res: any) => {
            this.loader = false;
            if (res.status) {
                this.messageService.add({ severity: 'success', summary: res.msg, detail: '', life: 1000 });
                this.isBenificiaryBankDetailPopup = false;
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }

        }, (error: any) => {
            this.loader = false;
            this.messageService.add({ severity: 'error', summary: error.message, detail: '' });
        })
    }
    isBenificiaryBankDetailPopup: boolean = false;
    tempNachBankDetail: any;
    updateBenificiaryBankDetail(bankDetails: any) {
        this.tempNachBankDetail = []
        this.isBenificiaryBankDetailPopup = true;
        this.tempNachBankDetail = bankDetails;
        this.GetBankList();
    }

    checked: boolean = false;
    selectedAccountType: any
    sameAsbankDetails() {
        if (this.checked) {
            this.ArthmateBankDetails.Accountholdername = this.tempNachBankDetail.Accountholdername;
            this.ArthmateBankDetails.AccountNumber = this.tempNachBankDetail.AccountNumber;
            this.ArthmateBankDetails.Bankname = this.tempNachBankDetail.Bankname;
            this.ArthmateBankDetails.IFSCCode = this.tempNachBankDetail.IFSCCode;
            this.ArthmateBankDetails.BankDetailId = this.tempNachBankDetail.BankDetailId;
            this.ArthmateBankDetails.Type = this.tempNachBankDetail.Type;
            // this.benificiaryArthmateDetails.Beneficiary_Typeofaccount = this.bankDetail.accType
            console.log(this.AccountTypeList, "benificiaryArthmateDetails")
            this.ArthmateBankDetails.AccountType = { name: this.tempNachBankDetail.AccountType };
            if (this.liveBankList != null && this.liveBankList.length > 0) {
                this.liveBankList.forEach((x: any) => {
                    if (x.bankName == this.ArthmateBankDetails.Bankname) {
                        this.selectBankName = x;
                    }
                });
            }


        } else {
            this.ArthmateBankDetails.Accountholdername = ''
            this.ArthmateBankDetails.Bankname = ''
            this.ArthmateBankDetails.AccountNumber = ''
            this.ArthmateBankDetails.IFSCCode = ''
            this.ArthmateBankDetails.AccountType = ''
        }
    }
    selectBankName: any = {};
    SaveNachDetails() {
        if (this.ArthmateBankDetails.Accountholdername == undefined || this.ArthmateBankDetails.Accountholdername == '' || this.ArthmateBankDetails.Bankname == undefined || this.ArthmateBankDetails.Bankname == '' || this.ArthmateBankDetails.AccountNumber == undefined
            || this.ArthmateBankDetails.AccountNumber == '' || this.ArthmateBankDetails.IFSCCode == undefined || this.ArthmateBankDetails.IFSCCode == '' || this.ArthmateBankDetails.AccountType == undefined) {
            alert("Please Fill All Bank Account NACH Details")
        }
        else {
            this.UpdateBeneficiaryBankDetailOfArthmate();
        }
    }
    validateAlphaNumeric(event: any) {
        const inputValue = event.target.value;
        var key = event.keyCode;
        if (key === 32) {
            event.preventDefault();
        }
        // Prevent the user from entering a full stop at the first letter
        if (inputValue[0] === '.') {
            event.target.value.preventDefault();
        }
        var k;
        k = event.charCode;  //         k = event.keyCode;  (Both can be used)
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
    }
    decimalFilter(event: any) {
        const reg = /^-?\d*(\.\d{0,2})?$/;
        let input = event.target.value + String.fromCharCode(event.charCode);
        if (!reg.test(input)) {
            event.preventDefault();
        }
        if (event.which == 45 || event.which == 189) {
            event.preventDefault();
        }
    }

    onKeydown(event: any) {
        var charCode = (event.which) ? event.which : event.keyCode;
        // Only Numbers 0-9
        // console.log(charCode, ': charCode');

        if (((charCode != 8 && charCode != 17 && charCode != 18 && charCode != 46 && charCode != 37 && charCode < 48) || (charCode > 57 && charCode != 65 && charCode != 174))) {
            // this.toastr.error('You Can Enter Or Paste Numbers Only!!');
            event.preventDefault();
            return false;
        } else {
            return true;
        }
    }

    // documentUpload(file: any, imgUploadType: string, event?: any) {
    //     if (file && file.target.files.length > 0) {
    //         if (
    //             file.target.files[0].name.toLowerCase().includes('jpeg') ||
    //             file.target.files[0].name.toLowerCase().includes('png') ||
    //             file.target.files[0].name.toLowerCase().includes('jpg') ||
    //             (file.target.files[0].name.toLowerCase().includes('pdf') &&
    //                 imgUploadType != 'LogoURL')
    //         ) {
    //             if (file.target.files[0].size < 6000000) {
    //                 this.file = file.target.files;
    //                 var reader = new FileReader();
    //                 this.imagePath = file;
    //                 if (this.uploadDocument.documentName == null || this.uploadDocument.documentName == '') {
    //                     this.messageService.add({ severity: 'error', summary: 'please Select Document', detail: '' });
    //                 }
    //                 else {
    //                     this.uploadDocumentFile(imgUploadType);
    //                 }
    //                 (success: any) => {
    //                     // alert('image uploaded successfully');
    //                     this.messageService.add({ severity: 'success', summary: 'image uploaded successfully', detail: '' });

    //                     if (this.uploadDocument.documentName == null || this.uploadDocument.documentName == '') {
    //                         this.messageService.add({ severity: 'error', summary: 'please Select Document', detail: '' });
    //                     }
    //                     else {

    //                         this.uploadDocumentFile(imgUploadType);
    //                     }
    //                 };
    //             } else {
    //                 // alert('Select Image size less than 6MB!!!');
    //                 this.messageService.add({ severity: 'error', summary: 'Select Image size less than 6MB!!!', detail: '' });

    //                 event.nativeElement.value = '';
    //             }
    //         } else {
    //             // alert('Choose different file format!');
    //             this.messageService.add({ severity: 'error', summary: 'Choose different file format!', detail: '' });

    //             event.nativeElement.value = '';
    //             file.preventDefault();
    //         }
    //     } else {
    //         this.uploadDocument.fileUrl = '';
    //         this.onUploadDocId = 0;
    //     }
    // }

    documentUpload(file: any, item: any, constDocs: boolean) {
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
                    if (item.documentName == 'bank_statement' && !element.name.toLowerCase().includes('pdf')) {
                        checkFlag = 2;
                        this.messageService.add({ severity: 'error', summary: 'Only PDF format is allowed', detail: '' });
                    }

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
                item.FileTarget = file.target.files;
                this.uploadDocumentFile(item, constDocs);
            } else if (checkFlag == 0) {
                // alert('Select Image size less than 6MB!!!');
                this.messageService.add({ severity: 'error', summary: 'Select Image size less than 6MB!!!', detail: '' });
                // event.nativeElement.value = '';
            }

        } else {
            this.uploadDocument.FileUrl = '';
            this.onUploadDocId = 0;
        }
    }

    isUploadable(item: any) {
        if (this.IsOfferGeneratedFlag == true) {
            if (item.documentName == 'other' || item.documentName == 'BusinessPhotos') {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    // uploadDocumentFile(imgUploadType: any) {
    //     const formData = new FormData();
    //     formData.append('FileDetails', this.file[0]);
    //     formData.append('IsValidForLifeTime', 'true');
    //     formData.append('ValidityInDays', '');
    //     formData.append('SubFolderName', '');
    //     this.loader = true;
    //     this._leadService.postSingleFile(formData).subscribe((res: any) => {
    //         console.log('Uploaded File-', res);
    //         this.loader = false;
    //         if (res.status) {
    //             this.messageService.add({ severity: 'success', summary: 'Click on Save Document Button', detail: '' });
    //             this.uploadDocument.fileUrl = res.filePath;
    //             this.onUploadDocId = res.docId;
    //         }
    //         else {
    //             this.messageService.add({ severity: 'error', summary: res.message, detail: '' });
    //         }
    //     }, (error: any) => {
    //         this.loader = false;
    //         this.messageService.add({ severity: 'error', summary: error.message, detail: '' });
    //     });
    // }

    onUploadDocId: any;
    uploadDocumentFile(item: any, constDocs: boolean) {

        debugger;
        let tempFiles: File[] = item.FileTarget;  // Assuming item.File is an array zof File objects

        // let Files: FormData[] = [];
        // if(tempFiles && tempFiles.length > 0){
        // const element = array[index];

        let formData = new FormData();

        for (let index = 0; index < tempFiles.length; index++) {
            formData.append('FileDetails', item.FileTarget[index]);  // Assuming 'FileDetails' is the correct field name for the file
        }

        formData.append('IsValidForLifeTime', 'true');
        formData.append('ValidityInDays', '');
        formData.append('SubFolderName', '');
        console.log("formData", formData);
        // Files.push(formData);

        // }

        // Files.forEach((formData, index) => { 
        //     console.log(`FormData ${index} details:`);
        //     console.log('FileDetails:', formData.get('FileDetails'));
        //     console.log('IsValidForLifeTime:', formData.get('IsValidForLifeTime'));
        //     console.log('ValidityInDays:', formData.get('ValidityInDays'));
        //     console.log('SubFolderName:', formData.get('SubFolderName'));
        // });

        console.log("formData", formData);
        this.loader = true;
        this._leadService.PostMultipleFile(formData).subscribe((res: any) => {
            console.log('Uploaded File-', res);
            this.loader = false;
            debugger
            if (res.status) {
                this.messageService.add({ severity: 'success', summary: 'Click on Save Document Button', detail: '' });
                // this.uploadDocument.FileUrl = res.filePath;
                // item.newFilePath = res.filePath;

                if (constDocs == true) {
                    this.constDocumentList.forEach((x: any) => {
                        if (x.la == item.documentName) {
                            x.docList = res.docList;
                        }
                    })
                } else {
                    this.allDocs.forEach((x: any) => {
                        if (x.documentName == item.documentName) {
                            x.docList = res.docList;
                        }
                    })
                }



                // this.onUploadDocId = res.docId;
                // item.newDocId = res.docId;
            }
            else {
                this.messageService.add({ severity: 'error', summary: res.message, detail: '' });
            }
        }, (error: any) => {
            this.loader = false;
            this.messageService.add({ severity: 'error', summary: error.message, detail: '' });
        });
    }

    // onUploadDocId: any;
    // onUploadDocument() {
    //     // this.uploadDocument.LeadId = this.leadId;
    //     var isFlag = false;

    //     // this.uploadDocument.documentNumber && 
    //     if (this.uploadDocument.documentName && this.uploadDocument.fileUrl) {
    //         isFlag = true;
    //         // && this.uploadDocument.pdfPassword
    //         if (this.uploadDocument.documentName == 'Statement') {
    //             isFlag = true;
    //         } else if (this.uploadDocument.documentName != 'Statement') {
    //             isFlag = true;
    //         } else {
    //             isFlag = false;
    //         }
    //     } else {
    //         isFlag = false;
    //         // if (!this.uploadDocument.documentNumber) {
    //         //     this.messageService.add({ severity: 'error', summary: 'Please Enter Document Number', detail: '' });
    //         // }
    //         // else 
    //         if (!this.uploadDocument.documentName) {
    //             this.messageService.add({ severity: 'error', summary: 'Please Enter Document Name', detail: '' });
    //         }
    //         else if (!this.uploadDocument.fileUrl) {
    //             this.messageService.add({ severity: 'error', summary: 'Upload File', detail: '' });
    //         }
    //     }

    //     if (isFlag) {

    //         const payload = {
    //             LeadId: this.leadId,
    //             // DocumentNumber: this.uploadDocument.documentNumber,
    //             DocumentName: this.uploadDocument.documentName,
    //             FileUrl: this.uploadDocument.fileUrl,
    //             PdfPassword: this.uploadDocument.pdfPassword ? this.uploadDocument.pdfPassword : '',
    //             leadDocDetailId: 0,
    //             sequence: 0,
    //             userId: this.userId,
    //             productCode: "BusinessLoan",
    //             docId: this.onUploadDocId.toString()
    //         }
    //         if (payload != null) {
    //             this.loader = true
    //             this._leadService.UploadLeadDocuments(payload).subscribe((res: any) => {
    //                 this.loader = false;
    //                 console.log(res, 'UploadLeadDocuments');
    //                 if (res.status) {
    //                     this.messageService.add({ severity: 'success', summary: res.message, detail: '', life: 1000 });
    //                     setTimeout(() => {
    //                         window.location.reload();
    //                     }, 1000);
    //                 }
    //                 else {
    //                     this.messageService.add({ severity: 'error', summary: res.message, detail: '' });
    //                     // this.uploadDocument.documentNumber = ''
    //                     // this.uploadDocument.documentName = ''
    //                     // this.uploadDocument.fileUrl = ''
    //                     // this.uploadDocument.pdfPassword = ''
    //                     this.uploadDocument = {
    //                         documentNumber: '',
    //                         documentName: '',
    //                         leadId: 0,
    //                         fileUrl: '',
    //                         pdfPassword: '',
    //                     }
    //                     this.selectedDocumentName = undefined;
    //                 }
    //             }, (error: any) => {
    //                 this.loader = false;
    //             })
    //             this.myInputVariable2.nativeElement.value = null;
    //             this.onUploadDocId = 0;

    //         }
    //     }
    // }
    onUploadDocument(item?: any) {
        debugger;
        console.log(this.allDocs, item);

        // this.uploadDocument.LeadId = this.leadId;
        var isFlag = false;
        // this.uploadDocument.DocumentNumber &&
        if (item.docList && item.docList.length > 0) {
            isFlag = true;
        } else {
            isFlag = false;
            this.messageService.add({ severity: 'error', summary: 'Please Attach Documents', detail: '' });
        }
        if (isFlag) {
            const payload = {
                LeadId: this.leadId,
                // DocumentNumber: this.uploadDocument.DocumentNumber,
                DocumentName: item.documentName,
                // FileUrl: item.newFilePath,
                PdfPassword: item.PdfPassword ? item.PdfPassword : '',
                leadDocDetailId: 0,
                sequence: 0,
                userId: this.userId,
                productCode: "BusinessLoan",
                docList: item.docList
                // docId: item.newDocId.toString()
            }
            if (payload != null) {
                this.loader = true
                this._leadService.UploadMultiLeadDocuments(payload).subscribe((res: any) => {
                    this.loader = false;
                    console.log(res, 'res');
                    debugger
                    if (res.status) {
                        this.messageService.add({ severity: 'success', summary: res.message, detail: '', life: 1000 });
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                    else {
                        this.messageService.add({ severity: 'error', summary: res.message, detail: '' });
                        // this.uploadDocument.DocumentNumber = ''
                        // this.uploadDocument.DocumentName = ''
                        // this.uploadDocument.FileUrl = ''
                        // this.uploadDocument.PdfPassword = ''

                        this.uploadDocument = {
                            DocumentNumber: '',
                            DocumentName: '',
                            LeadId: 0,
                            FileUrl: '',
                            PdfPassword: '',
                        }

                        item.docList = [];

                        this.selectedDocumentName = undefined;
                    }
                }, (error: any) => {
                    this.loader = false;
                })

                this.myInputVariable2.nativeElement.value = null;
            }
        }
    }

    // selectedDocumentName: any
    // onDocumentChange(event: any) {
    //     console.log("onDocumentChange", event);
    //     this.uploadDocument.documentName = this.selectedDocumentName.value;
    //     this.myInputVariable2.nativeElement.value = null;
    // }

    selectedDocumentName: any;
    onDocumentChange(event: any) {
        console.log(event);
        this.uploadDocument.DocumentName = event.value.label;
        this.uploadDocument.DocumentName = this.selectedDocumentName.value;
        this.myInputVariable2.nativeElement.value = null;
    }

    allDocs: UploadDocument[] = [];
    GetLeadDocumentsByLeadId() {
        this._leadService.GetLeadDocumentsByLeadId(this.leadId).subscribe((res: any) => {
            console.log("GetLeadDocumentsByLeadId", res);
            if (res && res.status && res.response.length > 0) {
                // this.allDocs = res.result;
                // this.allDocs = res.result.filter((x: any) => x.documentName == "udyog_aadhaar" || x.documentName == "bank_statement" || x.documentName == "gst_certificate" || x.documentName == "surrogate_gst" || x.documentName == "surrogate_itr" || x.documentName == "Other");
                this.allDocs = res.response.filter((x: any) => x.documentName != "AadhaarBackImage" && x.documentName != "AadhaarFrontImage" && x.documentName != "PANImage");
                console.log(this.allDocs, 'allDocs');

            } else {
                this.allDocs = [];
            }
        })
    }

    isAddressEditPopup: boolean = false;
    GetKarzaElectricityStateById(electricityStateId: number) {
        this._leadService.GetKarzaElectricityStateById(electricityStateId).subscribe((res: any) => {
            console.log(res, 'GetKarzaElectricityStateById Data');
            if (res != null && res.length > 0) {
                this.personalDetail.ElectricityState = res[0].state;
            }
        }, (error: any) => {
            console.log(error);

        })
    }
    // isAddressEditPopup:boolean = false;
    updatedAddress: any = {
        addressLineOne: '',
        addressLineTwo: '',
        addressLineThree: '',
        cityName: '',
        countryName: '',
        stateName: '',
        stateId: '',
        zipCode: '',
        cityId: 0,
        currentAddressId: 0,
        addressType: '',
    }
    surrogateTypeList = [
        { value: 'Banking', label: 'Banking' },
        { value: 'GST', label: 'GST' },
        { value: 'ITR', label: 'ITR' },
    ]

    updateAddressDetailsPopup(adressType: string) {
        this.isAddressEditPopup = true;
        this.updatedAddress.addressType = adressType;
        if (adressType == "BuisnessDetail") {
            this.updatedAddress.addressLineOne = this.businessDetail.CurrentAddress.addressLineOne
            this.updatedAddress.addressLineTwo = this.businessDetail.CurrentAddress.addressLineTwo
            this.updatedAddress.addressLineThree = this.businessDetail.CurrentAddress.addressLineThree
            this.updatedAddress.cityName = this.businessDetail.CurrentAddress.cityName
            this.updatedAddress.cityId = this.businessDetail.CurrentAddress.cityId
            this.updatedAddress.zipCode = this.businessDetail.CurrentAddress.zipCode
            this.updatedAddress.stateName = this.businessDetail.CurrentAddress.stateName
            this.updatedAddress.stateId = this.businessDetail.CurrentAddress.stateId;
            this.updatedAddress.countryName = this.businessDetail.CurrentAddress.countryName
            this.updatedAddress.currentAddressId = this.businessDetail.CurrentAddress.id;
        } else {
            this.updatedAddress.addressLineOne = this.personalDetail.CurrentAddress.addressLineOne
            this.updatedAddress.addressLineTwo = this.personalDetail.CurrentAddress.addressLineTwo
            this.updatedAddress.addressLineThree = this.personalDetail.CurrentAddress.addressLineThree
            this.updatedAddress.cityName = this.personalDetail.CurrentAddress.cityName
            this.updatedAddress.cityId = this.personalDetail.CurrentAddress.cityId
            this.updatedAddress.zipCode = this.personalDetail.CurrentAddress.zipCode
            this.updatedAddress.stateName = this.personalDetail.CurrentAddress.stateName
            this.updatedAddress.stateId = this.personalDetail.CurrentAddress.stateId;
            this.updatedAddress.countryName = this.personalDetail.CurrentAddress.countryName
            this.updatedAddress.currentAddressId = this.personalDetail.CurrentAddress.id;
        }
        console.log("this.updatedAddress", this.updatedAddress);
        let stateObj = this.stateList.filter((x: any) => x.stateCode == this.updatedAddress.stateId.toString())[0];
        this.GetCityByStateId(this.updatedAddress.stateId);
    }

    updateAddress() {
        if (this.updatedAddress.addressLineOne != null && this.updatedAddress.addressLineOne != '') {
            this.updatedAddress.addressLineOne = this.updatedAddress.addressLineOne.trim()
        }
        if (this.updatedAddress.addressLineTwo != null && this.updatedAddress.addressLineTwo != '') {
            this.updatedAddress.addressLineTwo = this.updatedAddress.addressLineTwo.trim()
        }
        if (this.updatedAddress.addressLineThree != null && this.updatedAddress.addressLineThree != '') {
            this.updatedAddress.addressLineThree = this.updatedAddress.addressLineThree.trim()
        }

        var flag = false;
        if (this.updatedAddress.addressLineOne && this.isFirstLetterNotSpace(this.updatedAddress.addressLineOne) && this.updatedAddress.addressLineTwo && this.isFirstLetterNotSpace(this.updatedAddress.addressLineTwo) && this.updatedAddress.zipCode && this.updatedAddress.cityId) {
            this.updatedAddress.zipCode = this.updatedAddress.zipCode.toString();
            if (this.updatedAddress.zipCode.length == 6) {
                flag = true
            }
        }

        // return false;
        if (flag) {
            let payload = {
                "leadId": this.leadId,
                "addCorrLine1": this.updatedAddress.addressLineOne,
                "addCorrLine2": this.updatedAddress.addressLineTwo,
                "addCorrLine3": this.updatedAddress.addressLineThree,
                "addCorrPincode": this.updatedAddress.zipCode.toString(),
                "addCorrCity": this.updatedAddress.cityId.toString(),
                "userId": this.userId,
                "addressId": this.updatedAddress.currentAddressId,
                "addressType": this.updatedAddress.addressType,
                "currentAddressId": 0,
                "AddCorrCityName": this.updatedAddress.cityName,
                "AddCorrStateName": this.updatedAddress.stateName
            };

            console.log("updateAddress payload", payload);
            this._leadService.UpdateAddress(payload).subscribe((res: any) => {
                console.log("UpdateAddress", res);
                if (res && res.status == true) {
                    // alert(res.message)
                    this.messageService.add({ severity: 'success', summary: res.message, detail: '', life: 1000 });
                    // window.location.reload();
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    // alert("Failed to update the address, Please try again")
                    this.messageService.add({ severity: 'error', summary: 'Failed to update the address, Please try again', detail: '', life: 1000 });
                }
            })
        }
        else {
            if (!this.updatedAddress.addressLineOne) {
                this.messageService.add({ severity: 'error', summary: 'Enter Address Line One', detail: '', life: 1000 });
            }
            else if (!this.updatedAddress.addressLineTwo) {
                this.messageService.add({ severity: 'error', summary: 'Enter Address Line Two', detail: '', life: 1000 });
            }
            else if (!this.updatedAddress.zipCode) {
                this.messageService.add({ severity: 'error', summary: 'Enter Address Zipcode', detail: '', life: 1000 });
            }
            else if (this.updatedAddress.cityId < 0) {
                this.messageService.add({ severity: 'error', summary: 'Enter City Name', detail: '', life: 1000 });
            } else {
                this.messageService.add({ severity: 'error', summary: 'Validation Failed', detail: '', life: 1000 });
            }
        }
    }


    stateList: any;
    GetAllState() {
        this._leadService.GetAllState().subscribe((res: any) => {
            console.log(res, 'states');
            if (res.status) {
                this.stateList = res.returnObject;
            }
            else {

            }
        })
    }

    cityList: any;
    GetCityByStateId(stateId: any) {
        this.cityList = [];
        this._leadService.GetCityByStateId(stateId).subscribe((res: any) => {
            console.log(res, 'CityByState');
            if (res != null && res.length > 0) {
                this.cityList = res;
                let cityObj = this.cityList.filter((x: any) => x.id == this.updatedAddress.cityId)[0];
                this.updatedAddress.cityId = cityObj.id;
            }
        })
    }
    liveBankList: any;
    selectedBankName: any;
    GetBankList() {
        this._leadService.GetBankList().subscribe((res: any) => {
            console.log(res, 'banklist');
            this.liveBankList = res.liveBankList
            console.log(this.liveBankList, 'this.liveBankList');
        })
    }
    onchangeState(event: any) {
        console.log(event, 'onchangestateevent');
        this.updatedAddress.stateName = this.stateList.filter((x: any) => x.id == event.value)[0].name;
        this.GetCityByStateId(event.value);
    }

    onchangeCity(event: any) {
        console.log(event, 'onchangecityevent');
        this.updatedAddress.cityId = event.value;
        this.updatedAddress.cityName = this.cityList.filter((x: any) => x.id == event.value)[0].name;
    }



    // selectedBusinessType: any;
    // selectedIncomeSlab: any;
    isBusinessDetailEditPopup: boolean = false;


    editBusinessDetails(address: any) {

        this.isBusinessDetailEditPopup = true;

        this.editBusinessDetail.businessName = this.businessDetail.businessName;
        this.editBusinessDetail.IncorporationDate = this.formatDate(this.businessDetail.IncorporationDate);
        this.editBusinessDetail.GstNumber = this.businessDetail.GstNumber;
        this.editBusinessDetail.InquiryAmount = this.businessDetail.InquiryAmount;
        // this.checkGstPattern(this.editBusinessDetail.GstNumber);

        if (this.buisnesTypeList) {
            this.editBusinessDetail.BusinessType = this.buisnesTypeList.filter((x: any) => x.value == this.businessDetail.BusinessType)[0].value;
            // console.log(this.selectedBusinessType, 'this.selectedBusinessType');
        }

        if (this.incomeSlabList) {
            this.businessDetail.IncomeSlab = this.businessDetail.IncomeSlab == '3 Lacs- 10 Lacs' ? '3 Lacs - 10 Lacs' : this.businessDetail.IncomeSlab;
            this.businessDetail.IncomeSlab = this.businessDetail.IncomeSlab == '10 Lacs- 25 Lacs' ? '10 Lacs - 25 Lacs' : this.businessDetail.IncomeSlab;

            this.editBusinessDetail.IncomeSlab = this.incomeSlabList.filter((x: any) => x.value == this.businessDetail.IncomeSlab)[0].value;
            // console.log(this.selectedIncomeSlab, 'this.selectedIncomeSlab');
        }

        if (this.surrogateTypeList) {

            this.editBusinessDetail.SurrogateType = this.surrogateTypeList.filter((x: any) => x.value == this.businessDetail.SurrogateType)[0].value;
        }


    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }



    updateBusinessDetailFun() {
        var isFlag = false;
        if (!this.editBusinessDetail.businessName) {
            this.messageService.add({ severity: 'error', summary: 'Enter Business Name', detail: '', life: 1000 });
        }
        else if (!this.editBusinessDetail.IncorporationDate) {
            this.messageService.add({ severity: 'error', summary: 'Enter Incorporation Date', detail: '', life: 1000 });
        }
        else if (!this.editBusinessDetail.BusinessType) {
            this.messageService.add({ severity: 'error', summary: 'Select BusinessType', detail: '', life: 1000 });
        }
        else if (!this.editBusinessDetail.IncomeSlab) {
            this.messageService.add({ severity: 'error', summary: 'Select IncomeSlab', detail: '', life: 1000 });
        }
        else if (!this.editBusinessDetail.InquiryAmount) {
            this.messageService.add({ severity: 'error', summary: 'Enter InquiryAmount', detail: '', life: 1000 });
        }
        else if (!this.editBusinessDetail.SurrogateType) {
            this.messageService.add({ severity: 'error', summary: 'Select Surrogate Type', detail: '', life: 1000 });
        }
        else {
            isFlag = true;
        }

        if (isFlag == true) {

            if (this.editBusinessDetail.GstNumber && this.isGstVerified) {
            } else {

            }


            let gstVerified: boolean = false;
            let stateName: string = '';
            if (this.editBusinessDetailObj.busGSTNO && this.isGstVerified) {
                gstVerified = true;
                stateName = this.stateList.filter((x: any) => x.id == this.editBusinessDetailObj.stateId)[0].name;
            } else {
                gstVerified = false;
            }

            debugger
            const payload = {
                "leadMasterId": this.leadId,
                "busName": gstVerified ? this.editBusinessDetailObj.businessName : this.editBusinessDetail.businessName,
                "doi": gstVerified ? this.editBusinessDetailObj.doi : this.editBusinessDetail.IncorporationDate,
                "busGSTNO": gstVerified ? this.editBusinessDetailObj.busGSTNO : this.editBusinessDetail.GstNumber,
                "busEntityType": this.editBusinessDetail.BusinessType,
                "buisnessMonthlySalary": gstVerified ? this.editBusinessDetailObj.buisnessMonthlySalary : this.businessDetail.buisenessMonthlySalary,
                "incomeSlab": this.editBusinessDetail.IncomeSlab,
                "buisnessDocumentNo": gstVerified ? this.editBusinessDetailObj.busGSTNO : this.businessDetail.GstNumber,
                "inquiryAmount": this.editBusinessDetail.InquiryAmount,
                "surrogateType": this.editBusinessDetail.SurrogateType,
                "userId": this.userId,
                "productCode": "CreditLine",
                "busAddCorrLine1": gstVerified ? this.editBusinessDetailObj.addressLineOne : this.businessDetail.CurrentAddress.addressLineOne,
                "busAddCorrLine2": gstVerified ? this.editBusinessDetailObj.addressLineTwo : this.businessDetail.CurrentAddress.addressLineTwo,
                "busAddCorrPincode": gstVerified ? this.editBusinessDetailObj.zipCode.toString() : this.businessDetail.CurrentAddress.zipCode.toString(),
                "busAddCorrCity": gstVerified ? this.editBusinessDetailObj.cityId.toString() : this.businessDetail.CurrentAddress.cityId.toString(),
                "busAddCorrState": gstVerified ? stateName : this.businessDetail.CurrentAddress.stateName,
                "addressId": this.businessDetail.CurrentAddress.id,
                "currentAddressId": 0
            }

            this._leadService.UpdateBuisnessDetail(payload).subscribe((res: any) => {
                console.log("UpdateBuisnessDetail", res);
                if (res && res.status == true) {
                    this.messageService.add({ severity: 'success', summary: res.message, detail: '', life: 1000 });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    this.messageService.add({ severity: 'warn', summary: "Failed to Update", detail: '', life: 1000 });
                }
            },
                (err: any) => {
                    this.messageService.add({ severity: 'error', summary: "API - UpdateBuisnessDetail", detail: '', life: 1000 });
                }
            )
        }
    }
    CustomerDetailUsingGST: any;
    GetCustomerDetailUsingGST(GstNo: any) {
        this.loader = true;
        this._leadService.GetCustomerDetailUsingGST(GstNo).subscribe((res: any) => {
            this.loader = false;
            console.log(res, 'GetCustomerDetailUsingGST');
        }, (error: any) => { this.loader = false; })
    }

    checkButtonApprove(): boolean {
        console.log(this.selectedActionStatus);
        if (this.selectedActionStatus) {
            if (this.selectedActionStatus.activity == "Bank Detail") {
                if (this.selectedActionStatus.isCompleted == true && this.selectedActionStatus.isApproved != 1) {
                    return true;
                } else {
                    return false;
                }
            } else {
                if (this.selectedActionStatus.isCompleted == true && this.selectedActionStatus.isApproved != 1) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
        // return true
    }

    checkButtonReject(): boolean {
        console.log(this.selectedActionStatus);

        if (this.selectedActionStatus) {
            if (this.selectedActionStatus.activity == 'Pan' || this.selectedActionStatus.activity == 'Aadhar' || this.selectedActionStatus.activity == 'Selfie') {
                if (this.selectedActionStatus.isCompleted == true) {
                    return true;
                } else {
                    return false;
                }
            } else {
                if (this.selectedActionStatus.isCompleted == true && this.selectedActionStatus.isApproved == 0) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    }
    convertDaysToMonthsAndDays(totalDays: number): { months: number, days: number } {
        const averageDaysInMonth = 30.44;

        const months = Math.floor(totalDays / averageDaysInMonth);
        const days = Math.round(totalDays % averageDaysInMonth);

        return { months, days };
    }

    isgstExist: boolean = false;
    isGstVerified: boolean = false;
    getdatabyGstNo(GSTNo: string) {
        this.isGstVerified = false;
        if (GSTNo.length == 15) {
            this.loader = true;
            this.companyService.checkCompanyGSTExist(GSTNo).subscribe((x: any) => {
                this.isgstExist = x.status;
                if (!this.isgstExist) {
                    this._leadService.GetCustomerDetailUsingGST(GSTNo).subscribe((res: any) => {
                        console.log(res);
                        this.loader = false;
                        if (res.status == true) {
                            this.isGstVerified = true;
                            // alert(res.message);
                            this.toasterService.showSuccess(res.message);
                            this.editBusinessDetailObj = res;
                            this.setBusinessData();
                        } else {
                            this.isGstVerified = false;
                            this.loader = false;
                            // this.editBusinessDetail.GstNumber = '';
                            this.toasterService.showWarn(res.message);
                        }
                    });
                } else {
                    this.loader = false;
                    this.isGstVerified = false;
                    // alert('GST exist');
                    // this.saveCompany.GSTNo='';
                    this.messageService.add({
                        severity: 'error',
                        summary: 'GST exist',
                        detail: '',
                    });
                }
            });
        }
    }

    setBusinessData() {
        this.editBusinessDetail.businessName = this.editBusinessDetailObj.businessName;
        this.editBusinessDetail.IncorporationDate = this.formatDate(this.editBusinessDetailObj.doi);
        this.editBusinessDetail.GstNumber = this.editBusinessDetailObj.busGSTNO;
    }

    isValidNumber(inputString: any) {
        const regex = /^[^0-9]*$/;
        return regex.test(inputString.key);
    }

    isFirstLetterNotSpace(sentence: string) {
        // Check if the first character is not a space
        return /^\S/.test(sentence);
    }
    AlphabetNumberOnly(event: any) {
        var res = this.commonValidation.AlphabetNumberOnly(event);
        return res;
    }
    allowSpecialSymbolsAndAlphabets(event: any) {
        var res = this.commonValidation.allowSpecialSymbolsAndAlphabets(event);
        return res;
    }
    checkGstPattern(GSTNo: any) {
        console.log(this.editBusinessDetail);
        this.editBusinessDetail.GstNumber = this.editBusinessDetail.GstNumber.toUpperCase();
        this.pattern =
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[A-Z]{1}[0-9A-Z]{1}$/;
        this.getdatabyGstNo(GSTNo);
    }

    alphaNumberOnly(e: any) {
        // Accept only alpha numerics, not special characters
        var res = this.commonValidation.AlphabetNumberOnly(e);
    }

    space(e: any) {
        var res = this.commonValidation.space(e);
    }

    openLargeImage(img: any) {
        var newWindow = window.open('', '_blank');
        if (newWindow != null) {
            newWindow.document.write('<img id="fullscreenImage" src="' + img + '" style="width: 100%; height: 100%; object-fit: contain; position: absolute; top: 0; left: 0;" />');
            var imageElement = newWindow.document.getElementById('fullscreenImage');
            if (imageElement != null && imageElement.requestFullscreen) {
                imageElement.requestFullscreen();
            }
        }
    }

    uploadedImageFilename: any
    uploadedImage: any
    uploadedDocId: any
    fileExtension: any
    Upload(event: any) {
        debugger
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            this.uploadedImageFilename = event.target.files[0];
            const fileName = this.uploadedImageFilename.name;
            this.fileExtension = fileName.split('.').pop();
            reader.onload = (e: any) => {
                this.uploadedImage = e.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
        this.loader = true;
        const formData = new FormData();
        formData.append('FileDetails', event.target.files[0]);
        formData.append('IsValidForLifeTime', 'true');
        formData.append('ValidityInDays', '');
        formData.append('SubFolderName', '');
        this.productService.PostSingleFile(formData).subscribe((res: any) => {
            console.log(res);
            if (res.status) {
                //this.messageService.add({ severity: 'success', summary: res.message});
                this.uploadedDocId = res.docId;
                this.uploadedImage = res.filePath;
                this.loader = false;
            }
            else {
                this.loader = false;
                this.messageService.add({ severity: 'success', summary: "file couldn't upload" });
            }
        });
    }

    OnClear() {
        this.uploadedImage = '';
        this.fileUploader!.nativeElement.value = '';
        this.uploadedImageFilename = '';
    }

    financeAgreementdetails: any
    GetMASFinanceAgreement() {
        this._leadService.GetMASFinanceAgreement(this.leadId).subscribe((res: any) => {
            if (res.isSuccess) {
                this.financeAgreementdetails = res.result;
                console.log(res, "financeAgreementdetails");
            }
        });
    }
    OnSave() {
        debugger
        if (this.uploadedImageFilename == undefined || this.uploadedImageFilename == null || this.uploadedImageFilename == '') {
            this.messageService.add({ severity: 'error', summary: 'Upload File' });
        }
        else {
            var financeAgreementDc = {
                LeadId: parseInt(this.leadId),
                DocId: this.uploadedDocId.toString(),
                DocUrl: this.uploadedImage,
                NbfcCompanyId: this.isSuperadminrole || this.isAdminrole ? 0 : this.id
            }
            debugger
            this.loader = true;
            this._leadService.UploadMASFinanceAgreement(financeAgreementDc).subscribe((res: any) => {
                debugger
                if (res.status) {
                    this.loader = false;
                    this.messageService.add({ severity: 'success', summary: res.message });
                    this.OnClear();
                    this.GetMASFinanceAgreement();
                }
                else {
                    this.loader = false;
                    this.messageService.add({ severity: 'error', summary: res.message });
                }
            });
        }
    }

}


interface BusinessDetail {
    businessName: string;
    BusinessType: string;
    BusinessTurnOver: number;
    IncorporationDate: string;
    IncomeSlab: any;
    GstNumber: any;
    CurrentAddress: Address;
    buisnessProofUrl: string;
    InquiryAmount: number;
    SurrogateType: string;
    buisenessMonthlySalary: number;
    anchorCompanyName: any;
    vintageDays: any;
    businessVintageDays: any;
}

interface BorrowerDetail {
    firstName: string;
    lastName: string;
    middleName: string;
    gender: string;
    dob: string;
    ownershipType: string;
    alternatePhoneNo: string;
}

interface PanDetail {
    fatherName: string;
    nameOnCard: string;
    uniqueId: string;
    frontImageUrl: string;
    doi: string;
    dob: string;
}

// interface BankDetail {
//     borroBankAccNum: string;
//     borroBankIFSC: string;
//     borroBankName: string;
//     borroBankAccountholdername: string;
//     accType: string;
//     pdfPassword: string;
//     isEnach: boolean;
//     BankDetailId:number;
//     Type:string;
// }
interface BankDetail {
    AccountNumber: string;
    IFSCCode: string;
    Bankname: string;
    Accountholdername: string;
    AccountType: any;
    pdfPassword: string;
    BankDetailId: number;
    Type: string;
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
    cityId: number;
    countryName: string;
    stateName: string;
    stateId: Number;
    zipCode: string;
    id: number;
}

interface PersonalDetail {
    CurrentAddress: Address;
    PermanentAddress: Address;
    ElectricityBillImage: string;
    MobileNumber: string;
    OwnershipTypeAddress: string;
    OwnershipTypeName: string;
    ElectricityServiceProvider: string;
    ElectricityState: string;
    IvrsNumber: string;
    ownershipTypeResponseId: number;
    EmailId: string;
    OwnershipType: string;
    AlternatePhoneNo: string;
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
interface AgreementDocument {
    AgreementURL: any;
    AgreementDocId: number;
}
// interface BenificiaryDetails {
//     Beneficiary_AccountNumber: any;
//     Beneficiary_Accountholdername: string;
//     Beneficiary_Typeofaccount: any,
//     Beneficiary_Bankname: string,
//     Beneficiary_IFSCCode: string,
//     BankDetailId:number;
// }
interface MSME {
    BusinessName: string;
    BusinessType: string;
    MsmeCertificateUrl: string;
    MsmeRegNum: string;
    Vintage: number;
}

interface UploadDocument {
    // leadId: number;
    // documentNumber: string;
    // documentName: string;
    // fileUrl: string;
    // pdfPassword: string;
    leadId: number;
    documentNumber: string;
    documentName: string;
    fileUrl: string;
    pdfPassword: string;
    label: string

    File: any;
    newDocId: any;
    newFilePath: any;

    docList: any[]
}
interface editBusinessDetails {
    "businessName": string,
    "doi": any,
    "busGSTNO": string,
    "busEntityType": string,
    "busPan": string,
    "addressLineOne": string,
    "addressLineTwo": string,
    "addressLineThree": string,
    "zipCode": number,
    "cityId": number,
    "stateId": number,
    "buisnessMonthlySalary": any,
    "incomeSlab": any,
    "buisnessProof": any,
    "buisnessProofUrl": string,
    "buisnessProofDocId": number,
    "buisnessDocumentNo": any,
    "inquiryAmount": number,
    "surrogateType": string,
    "status": boolean,
    "message": string
}