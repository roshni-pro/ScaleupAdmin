import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AnchorCompanyService } from 'app/pages/companies-master/services/anchor-company.service';
import { LeadService } from 'app/pages/lead/services/lead.service';
import { CommonValidationService } from 'app/shared/services/common-validation.service';
import { ToasterMessageService } from 'app/shared/services/toaster-message.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DsaService } from '../../services/dsa.service';
@Component({
    selector: 'app-dsa-profile',
    templateUrl: './dsa-profile.component.html',
    styleUrls: ['./dsa-profile.component.scss']
})
export class DsaProfileComponent {

    leadData: any
    kycDetails: any;
    leadActivitiesList: any[] = [];
    dsaProfileInfocheck: any[] = [];
    productList: any;


    Loader: boolean = false;
    visible: boolean = false;
    blockval: boolean = false;
    IsBlock: boolean = false;
    isBusinessDetailEditPopup: boolean = false;
    //new 
    payoutRows: any = [{
        MinAmount: null,
        MaxAmount: null,
        payoutPerc: null
    }]
    payloadPayoutSlab: any
    activityApprovalStatus = {
        "Pan": "",
        "Aadhar": "",
        "Selfie": "",
        "PersonalInfo": "",
        "BusinessInfo": "",
        "BankDetail": "",
        "DSAPersonalInfo": "",
        "DSATypeSelection": ""
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
        zipCode: '',
        id: 0,
        stateId: '',
        cityId: 0,

    }
    businessDetail: BusinessDetail = {
        businessName: '',
        BusinessType: '',
        BusinessTurnOver: 0,
        IncorporationDate: '',
        IncomeSlab: 0,
        GstNumber: undefined,
        CurrentAddress: this.address,
        buisnessProofUrl: '',
        buisnessMonthlySalary: 0,
        buisnessProof: '',
        buisnessProofDocId: 0,
        inquiryAmount: 0,
        surrogateType: ''
    };

    dsaBusinessDetail: DsaBusinessDetail = {
        address: '',
        age: '',
        alternatePhoneNo: '',
        buisnessDocument: '',
        city: '',
        companyName: '',
        dob: '',
        documentId: '',
        emailId: '',
        fatherOrHusbandName: '',
        firmType: '',
        fullName: '',
        gstNumber: '',
        gstStatus: '',
        languagesKnown: '',
        mobileNo: '',
        noOfYearsInCurrentEmployment: '',
        pinCode: '',
        presentOccupation: '',
        qualification: '',
        referneceContact: '',
        referneceLocation: '',
        referneceName: '',
        state: '',
        workingWithOther: '',
        workingLocation: '',


        alternateContactNo: '',
        fatherName: '',
        presentEmployment: '',
        referenceName: '',
    }

    editBusinessDetail: BusinessDetail = {
        businessName: '',
        BusinessType: '',
        BusinessTurnOver: 0,
        IncorporationDate: '',
        IncomeSlab: 0,
        GstNumber: undefined,
        CurrentAddress: this.address,
        buisnessProofUrl: '',
        buisnessMonthlySalary: 0,
        buisnessProof: '',
        buisnessProofDocId: 0,
        inquiryAmount: 0,
        surrogateType: ''
    };

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
        locationAddress: this.address,
        combinedAddress: '',
        state: '',
        cityName: ''

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
        ownershipTypeResponseId: 0
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

    benificiaryArthmateDetails: BenificiaryDetails = {
        Beneficiary_AccountNumber: 0,
        Beneficiary_Accountholdername: '',
        Beneficiary_Typeofaccount: '',
        Beneficiary_Bankname: '',
        Beneficiary_IFSCCode: ''
    }


    uploadDocument = {
        DocumentNumber: '',
        DocumentName: '',
        LeadId: 0,
        FileUrl: '',
        PdfPassword: '',
    }
    uploadDocumentList = [
        { value: 'gst_certificate', label: 'GST Certificate' },
        { value: 'udyog_aadhaar', label: 'UdyogAadhaar' },
        { value: 'bank_statement', label: 'Statement' },
        { value: 'other', label: 'Other' }
    ];

    buisnesTypeList = [
        { value: 'Proprietorship', label: 'Proprietorship' },
        { value: 'Partnership', label: 'Partnership' },
        { value: 'Pvt Ltd', label: 'Pvt Ltd' },
        { value: 'HUF', label: 'HUF' },
        { value: 'LLP', label: 'LLP' },
    ]
    incomeSlabList = [
        { value: 'Upto 3 Lacs', label: 'Upto 3 Lacs' },
        { value: '3 Lacs - 10 Lacs', label: '3 Lacs - 10 Lacs' },
        { value: '10 Lacs - 25 Lacs', label: '10 Lacs - 25 Lacs' },
        { value: 'Above 25 Lacs', label: 'Above 25 Lacs' },
    ]

    //imageshow/download
    showImage: boolean = false;
    dialogUrl: any
    showUrl: any
    @ViewChild('myInput1')
    myInputVariable1!: ElementRef;
    @ViewChild('myInput2')
    myInputVariable2!: ElementRef;
    AccountTypeList: any[] = [];
    @Input() status: any;


    // {value : '', label : 'Select Business Entity Type'},
    // {value : 'Trading', label : 'Trading'},
    // {value : 'Manufacturing', label : 'Manufacturing'},
    // {value : 'Others', label : 'Others'},
    // {value : '0 k - 50 K', label : '0 k - 50 K'},
    // {value : '50 K- 5 lac', label : '50 K- 5 lac'},
    // {value : '25 lac- 50 lac', label : '25 lac- 50 lac'},
    // {value : '50 lac- 1 cr', label : '50 lac- 1 cr'},
    // { value: 'AadhaarFrontImage', label: 'AadhaarFrontImage' },
    // { value: 'AadhaarBackImage', label: 'AadhaarBackImage' },
    // { value: 'PANImage', label: 'PANImage' }
    // IsActive: boolean = false;
    // approvalStatus = [
    //     { activity: "Pan", isApproved: false },
    //     { activity: "Aadhar", isApproved: false },
    //     { activity: "Selfie", isApproved: false },
    //     { activity: "PersonalInfo", isApproved: false },
    //     { activity: "BusinessInfo", isApproved: false },
    //     { activity: "Bank Detail", isApproved: false }
    // ]
    // updatePersonalAddress: Address = {
    //     addressLineOne: '',
    //     addressLineTwo: '',
    //     addressLineThree: '',
    //     cityName: '',
    //     countryName: '',
    //     stateName: '',
    //     zipCode: ''
    // }
    // updateBusinessAddress: Address = {
    //     addressLineOne: '',
    //     addressLineTwo: '',
    //     addressLineThree: '',
    //     cityName: '',
    //     countryName: '',
    //     stateName: '',
    //     zipCode: ''
    // }
    // bankDetail: BankDetail[] = [{
    //     borroBankAccNum: '',
    //     borroBankIFSC: '',
    //     borroBankName: '',
    //     borroBankAccountholdername: '',
    //     accType: '',
    //     beneficiary_AccountNumber: '',
    //     beneficiary_Accountholdername: '',
    //     beneficiary_Bankname: '',
    //     beneficiary_IFSCCode: '',
    //     beneficiary_Typeofaccount: '',
    //     isEnach: false
    // }]
    // updateAddressDetails: UpdateAddressDetails = {
    //     updateAddress: this.address
    // }

    // updatePersonalAddressDetails: UpdateAddressDetails = {
    //     updateAddress: this.address
    // }
    //   this.dsaProfileInfocheck=this.dsaProfileInfo



    constructor(
        private companyService: AnchorCompanyService,
        private commonValidation: CommonValidationService,
        private _leadService: LeadService,
        private confirmationService: ConfirmationService,
        private toasterService: ToasterMessageService,
        private messageService: MessageService,
        private _dsaService: DsaService
    ) {
        this.AccountTypeList = [{ name: 'Savings' }, { name: 'Current' }]
    }

    userTypeRole: boolean = false
    masterStatusCheck: any = {
        selfieApproveStatus: false,
        selfieRejectStatus: false,
    }
    async ngOnInit() {
        this.leadData = localStorage.getItem('DsaleadData');
        this.leadData = JSON.parse(this.leadData);
        this.leadData.status = this.status
        const userType = localStorage.getItem('usertype');

        if (userType !== null) {
            if (userType.toLowerCase() == 'superadmin'.toLowerCase()) {
                this.userTypeRole = true;
            }
            if (userType.toLowerCase() == 'AdminUser'.toLowerCase()) {
                this.userTypeRole = true;
            }
        }
        console.log("this.leadData", this.leadData);
        await this.GetDSAAgreement()
        await this.GetleadActivities();
        await this.GetLeadDetails();
        await this.getProductMasterList();
        // await this.IsOfferGenerated(this.leadData.leadId);
        this.CompanyBuyingHistory();
        this.GetLeadDocumentsByLeadId();
        this.GetAllState();

    }

    ngOnChanges() {
        if (this.status) {
            this.leadData ? this.leadData.status = this.status : null
            // this.ngOnInit()
        }
    }

    async getProductMasterList() {
        try {
            this.Loader = true;
            const res: any = await this._leadService
                .getallProductList()
                .toPromise();
            console.log('getallProductList', res);
            this.Loader = false;
            this.productList = res.returnObject;
            this.copiedProductList = res.returnObject
        } catch (error) {
            console.error(error);
            this.Loader = false;
            throw error; // Rethrow the error for handling in the calling code
        }
    }




    IsOfferGeneratedFlag: boolean = false;
    async IsOfferGenerated(leadid: any) {
        if (leadid > 0) {
            // this.Loader = true
            var res = await this._leadService.IsOfferGenerated(leadid).toPromise();
            console.log("IsOfferGeneratedFlag", res.result);
            if (res && res.result == true) {
                debugger
                // this.Loader = false;
                this.IsOfferGeneratedFlag = res.result;
                console.log(this.IsOfferGeneratedFlag);

            }
            else {
                // this.Loader = false;
                this.IsOfferGeneratedFlag = res.result;
            }
        }
    }


    @Output() refreshParentPage = new EventEmitter();

    PrepareAggr() {
        debugger
        this.Loader = true;
        this._dsaService.PrepareAgreement(this.leadData.leadId, this.leadData.userId, this.leadData.profileType).subscribe((res: any) => {
            console.log('PrepareAgg.', res)
            this.Loader = false;
            if (res.status) {
                this.messageService.add({ severity: 'success', summary: res.message });
                this.refreshParentPage.emit(null)
            }
            else {
                this.messageService.add({ severity: 'error', summary: res.message });
                // this.refreshParentPage.emit(null)

            }
        })
    }

    isDsaAgreement: boolean = false;
    isPrepAggBtn: boolean = true;
    preparedAgg: any
    async GetDSAAgreement() {
        try {
            this.Loader = true;
            var res = await this._dsaService.GetDSAAgreement(this.leadData.leadId).toPromise();
            console.log('GetDSAAgreement', res)
            if (res.status) {
                this.isDsaAgreement = true;
                this.isPrepAggBtn = res.isActivation;
                this.Loader = false;
                console.log('LeadAggrementDetailReponse', res.LeadAggrementDetailReponse)
                this.preparedAgg = res.response

            }
            else {
                this.isPrepAggBtn = true;
                this.isDsaAgreement = false
                this.Loader = false;

            }
        }
        catch (error: any) {
            this.Loader = false;
            this.messageService.add({ severity: 'error', summary: 'Error API - GetDSAAgreement', detail: error });
        }
    }

    dsaProfileInfo: string = '';
    async GetLeadDetails() {
        try {
            this.Loader = true;
            var res = await this._leadService.GetLeadDetailsByUserId(this.leadData.userId, this.leadData.leadId).toPromise();
            this.Loader = false;
            this.bankDetail = [];
            console.log(res, 'data');
            if (res) {
                debugger
                if (res.dsaProfileInfo && res.dsaProfileInfo.dsaType) {
                    this.dsaProfileInfo = res.dsaProfileInfo.dsaType;
                    this.dsaProfileInfocheck = [res.dsaProfileInfo.dsaType];
                }
                // this.PayoutPercentage = res.payoutPercentage
                this.payoutRows = []
                this.dsaMultiplePayout = []
                let obj: any = {
                    productId: null,
                    slabs: []
                }
                // res.salesAgentCommissions[0].productId=8
                // res.salesAgentCommissions[1].productId=8
                // res.salesAgentCommissions[2].productId=5

                if(res.salesAgentCommissions && res.salesAgentCommissions.length > 0){
                   
                    res.salesAgentCommissions.forEach((e: any) => {
                        let existingProduct = this.dsaMultiplePayout.find((p: any) => p.productId === e.productId);
                    
                        if (existingProduct) {
                            existingProduct.slabs.push({
                                payoutPerc: e.payoutPercentage,
                                MinAmount: e.minAmount,
                                MaxAmount: e.maxAmount
                            });
                        } else {
                            let obj = {
                                productId: e.productId,
                                slabs: [{
                                    payoutPerc: e.payoutPercentage,
                                    MinAmount: e.minAmount,
                                    MaxAmount: e.maxAmount
                                }]
                            };
                            this.dsaMultiplePayout.push(obj);
                        }
                    });
                      


                } 
                
                // obj.slabs = this.payoutRows
                // let payload = {
                    
                    // }
                    
                    // this.payoutRows.push(payload)
                    console.log(this.dsaMultiplePayout);
                // if (this.payoutRows && this.payoutRows.length == 0) {
                //     let payload = {
                //         "payoutPerc": null,
                //         "MinAmount": null,
                //         "MaxAmount": null
                //     }

                //     this.payoutRows.push(payload)
                // }
                if (res.dsaProfileInfo && res.dsaProfileInfo.dsaType == 'DSA' && res.dsaPersonalDetail) {
                    this.dsaBusinessDetail.alternatePhoneNo = res.dsaPersonalDetail.alternatePhoneNo
                    this.dsaBusinessDetail.buisnessDocument = res.dsaPersonalDetail.buisnessDocument
                    this.dsaBusinessDetail.city = res.dsaPersonalDetail.currentAddress ? res.dsaPersonalDetail.currentAddress.cityName : '-'
                    this.dsaBusinessDetail.companyName = res.dsaPersonalDetail.companyName
                    this.dsaBusinessDetail.documentId = res.dsaPersonalDetail.documentId
                    this.dsaBusinessDetail.fatherOrHusbandName = res.dsaPersonalDetail.fatherOrHusbandName
                    this.dsaBusinessDetail.firmType = res.dsaPersonalDetail.firmType
                    this.dsaBusinessDetail.gstNumber = res.dsaPersonalDetail.gstNumber
                    this.dsaBusinessDetail.gstStatus = res.dsaPersonalDetail.gstStatus
                    this.dsaBusinessDetail.noOfYearsInCurrentEmployment = res.dsaPersonalDetail.noOfYearsInCurrentEmployment
                    this.dsaBusinessDetail.pinCode = res.dsaPersonalDetail.currentAddress ? res.dsaPersonalDetail.currentAddress.zipCode : '-'
                    this.dsaBusinessDetail.presentOccupation = res.dsaPersonalDetail.presentOccupation
                    this.dsaBusinessDetail.qualification = res.dsaPersonalDetail.qualification
                    this.dsaBusinessDetail.state = res.dsaPersonalDetail.currentAddress ? res.dsaPersonalDetail.currentAddress.stateName : '-'
                    this.dsaBusinessDetail.languagesKnown = res.dsaPersonalDetail.languagesKnown
                    this.dsaBusinessDetail.workingWithOther = res.dsaPersonalDetail.workingWithOther
                    this.dsaBusinessDetail.referneceLocation = res.dsaPersonalDetail.referneceLocation
                    this.dsaBusinessDetail.referneceContact = res.dsaPersonalDetail.referneceContact
                    this.dsaBusinessDetail.referenceName = res.dsaPersonalDetail.referneceName
                    this.dsaBusinessDetail.mobileNo = res.dsaPersonalDetail.mobileNo
                    this.dsaBusinessDetail.emailId = res.dsaPersonalDetail.emailId
                    this.aadharDetail.combinedAddress = res.aadharDetail.combinedAddress ? res.aadharDetail.combinedAddress : '-'
                    this.dsaBusinessDetail.address = res.dsaPersonalDetail.currentAddress ? res.dsaPersonalDetail.currentAddress.addressLineOne : '-'
                    this.dsaBusinessDetail.age = res.dsaPersonalDetail.age
                    this.dsaBusinessDetail.workingLocation = res.dsaPersonalDetail.workingLocation
                }
                else if (res.dsaProfileInfo && res.dsaProfileInfo.dsaType == 'Connector' && res.connectorPersonalDetail) {
                    this.dsaBusinessDetail.alternateContactNo = res.connectorPersonalDetail.alternateContactNo
                    this.dsaBusinessDetail.fatherName = res.connectorPersonalDetail.fatherName
                    this.dsaBusinessDetail.presentEmployment = res.connectorPersonalDetail.presentEmployment
                    this.dsaBusinessDetail.languagesKnown = res.connectorPersonalDetail.languagesKnown
                    this.dsaBusinessDetail.workingWithOther = res.connectorPersonalDetail.workingWithOther
                    this.dsaBusinessDetail.referneceLocation = res.connectorPersonalDetail.referneceLocation
                    this.dsaBusinessDetail.referneceContact = res.connectorPersonalDetail.referneceContact
                    this.dsaBusinessDetail.referenceName = res.connectorPersonalDetail.referenceName
                    this.dsaBusinessDetail.mobileNo = res.connectorPersonalDetail.mobileNo
                    this.dsaBusinessDetail.emailId = res.connectorPersonalDetail.emailId
                    this.dsaBusinessDetail.address = res.connectorPersonalDetail.currentAddress ? res.connectorPersonalDetail.currentAddress.addressLineOne : '-'
                    this.dsaBusinessDetail.age = res.connectorPersonalDetail.age
                    this.dsaBusinessDetail.state = res.aadharDetail.locationAddress.stateName
                    this.dsaBusinessDetail.city = res.aadharDetail.locationAddress.cityName
                    this.dsaBusinessDetail.pinCode = res.aadharDetail.locationAddress.zipCode
                    this.dsaBusinessDetail.workingLocation = res.connectorPersonalDetail.workingLocation
                    this.aadharDetail.combinedAddress = res.aadharDetail.combinedAddress ? res.aadharDetail.combinedAddress : '-'

                }



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
                    this.personalDetail.IvrsNumber = res.personalDetail.ivrsNumber;
                    this.personalDetail.ElectricityState = res.personalDetail.electricityState;
                    this.personalDetail.ElectricityServiceProvider = res.personalDetail.electricityServiceProvider;
                    this.personalDetail.OwnershipTypeAddress = res.personalDetail.ownershipTypeAddress;
                    this.personalDetail.ownershipTypeResponseId = res.personalDetail.ownershipTypeResponseId;
                    this.personalDetail.OwnershipTypeName = res.personalDetail.ownershipTypeName;
                    if (this.personalDetail.ElectricityState && parseInt(this.personalDetail.ElectricityState, 10) > 0) {

                        this.GetKarzaElectricityStateById(parseInt(this.personalDetail.ElectricityState, 10));
                    }
                    console.log(this.personalDetail, 'this.personalDetail');

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
                    this.aadharDetail.state = res.aadharDetail.state;
                    this.aadharDetail.cityName = res.aadharDetail.locationAddress.cityName;
                    this.dsaBusinessDetail.fullName = res.aadharDetail.name
                    this.dsaBusinessDetail.gender = res.aadharDetail.gender
                    this.dsaBusinessDetail.dob = res.aadharDetail.dob


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
                if ((!res.dsaProfileInfo || (res.dsaProfileInfo && res.dsaProfileInfo.dsaType == 'Connector')) && !res.connectorPersonalDetail) {
                    //  this.messageService.add({ severity: 'error', summary: 'Data not found - connectorPersonalDetail' });

                }
                if (!res.dsaProfileInfo || (res.dsaProfileInfo && res.dsaProfileInfo.dsaType == 'DSA') && !res.dsaPersonalDetail) {
                    // this.messageService.add({ severity: 'error', summary: 'Data not found - dsaPersonalDetail' });
                }
            } else {
                this.messageService.add({ severity: 'error', summary: 'Error API - GetLeadDetailsByUserId' });

            }
        }
        catch (error: any) {
            this.Loader = false;
            this.messageService.add({ severity: 'error', summary: 'Error API - GetLeadDetailsByUserId', detail: error.message });
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

    //     this.Loader = true;

    //     this.confirmationService.confirm({
    //         message: 'Are you sure want to' + ' ' + message + ' ' + 'User' + ' ',
    //         accept: () => {
    //             this._leadService.CustomerActiveInActive(this.loanAccount.LoanAccountId, this.loanAccount.IsAccountActive).subscribe((res: any) => {
    //                 this.Loader = false;
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
    //             this.Loader = false;
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

    //                 this.Loader = true;
    //                 this._leadService.CustomerBlock(this.loanAccount.LoanAccountId, this.Comment, this.isHideLimit, this.username).subscribe(res => {
    //                     this.Loader = false;

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
        // debugger
        this.dialogUrl = '';
        // console.log('input',input)
        this.showImage = true;

        if (input.toLowerCase().includes('jpeg') || input.toLowerCase().includes('png') || input.toLowerCase().includes('jpg')) {
            this.showUrl = input;
            // console.log('jpg',this.showUrl)
        }
        else {
            this.dialogUrl = '../../../../../assets/img/pdflogo.png'
            this.showUrl = input
            // console.log('gfhed',this.showUrl)
        }
    }

    downloadImage(value: any) {
        window.open(value);
    }

    async GetleadActivities() {
        this.leadActivitiesList = [];
        if (this.leadData.leadId > 0) {
            try {
                this.Loader = true;
                var res = await this._leadService.GetLeadActivityProgressList(this.leadData.leadId).toPromise();
                console.log(res)
                if (res.status) {
                    this.Loader = false;
                    // var data = res.leadActivityProgress.filter((x: any) => {
                    //     if (x.activityName != "MobileOtp") return x
                    // })

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
                        //   if (x.isApproved == 0) {
                        //     status = "Accepted"
                        // }
                        //  else 
                        if (x.isApproved == 1) {
                            status = "Accepted"
                        } else if (x.isApproved == 2 && this.leadData.status != "Activated") {
                            status = "Rejected"
                        }
                        else {
                            status = ""
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
                                break;
                            case "Aadhar":
                                this.activityApprovalStatus.Aadhar = status;
                                break;
                            case "Bank Detail":
                                this.activityApprovalStatus.BankDetail = status;
                                break;
                            case "BusinessInfo":
                                this.activityApprovalStatus.BusinessInfo = status;
                                break;
                            case "PersonalInfo":
                                this.activityApprovalStatus.PersonalInfo = status;
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
                            case "DSAPersonalInfo":
                                this.activityApprovalStatus.DSAPersonalInfo = status;
                                break;
                            case "DSATypeSelection":
                                this.activityApprovalStatus.DSATypeSelection = status;
                                break;
                            default:
                                break;
                        }
                    })

                    console.log("this.leadActivitiesList", this.leadActivitiesList, this.activityApprovalStatus);

                }
                else {
                    this.Loader = false;
                    this.messageService.add({ severity: 'error', summary: 'Data Not Found' });
                }
            }
            catch (error: any) {

                this.Loader = false;
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

    //             this.Loader = true;
    //             this._leadService.VerifyLeadDocument(payload).subscribe(x => {
    //                 this.Loader = false;
    //                 if (x.status) {
    //                     this.messageService.add({ severity: 'success', summary: x.message, detail: "" });
    //                     this.GetleadActivities();
    //                     // this.Loader=false;
    //                 } else {
    //                     this.messageService.add({ severity: 'error', summary: "Error - Not Approved", detail: 'Please Try Again' });
    //                 }
    //             })
    //         }
    //     });
    // }


    Comment: any = '';
    changeActivity(status: any) {
        debugger
        let payload = {
            "LeadId": this.leadData.leadId,
            "ActivityMasterId": this.selectedActionStatus.activityMasterId ? this.selectedActionStatus.activityMasterId : 0,
            "SubActivityMasterId": this.selectedActionStatus.subActivityMasterId ? this.selectedActionStatus.subActivityMasterId : 0,
            "IsApprove": status,
            "Comment": 'status change'
        }
        try {
            // if (this.Comment.trim() == '') {
            //     this.messageService.add({ severity: 'warn', summary: "Alert!", detail: "Leave a comment for your action" });
            // } else {
            this.Loader = true;
            this._leadService.VerifyLeadDocument(payload).subscribe(res => {
                this.Loader = false;
                if (res.status) {
                    this.isRejectDoc = false;
                    this.messageService.add({ severity: 'success', summary: res.message, detail: "" });
                    // this.GetleadActivities();
                    setTimeout(() => {
                        this.refreshParentPage.emit(null)
                        window.location.reload();

                    }, 1000);
                }
                else {
                    this.messageService.add({ severity: 'error', summary: "Error - Not Rejected", detail: "" });
                }
            })
            // }
        }
        catch (error) {
            // alert(error)
            this.Loader = false;
        }
    }


    isRejectDoc: boolean = false;
    selectedActionStatus: any;
    changeStatus(action: any, status: any) {
        debugger
        this.Comment = '';
        this.selectedActionStatus = null;
        this.selectedActionStatus = this.leadActivitiesList.filter((x: any) =>
            x.activity == action
        )[0];
        this.isRejectDoc = true;
        // console.log(action, status);
        console.log('selectedActionStatus', this.selectedActionStatus);
    }

    companyBuyingHistories: any
    totalrecord: number = 0
    CompanyBuyingHistory() {
        this.companyBuyingHistories = [];
        // this.iscompanyBuyingHistories=true;
        const companyId = Number(localStorage.getItem('selectedcompany'));
        this.Loader = true;
        this._leadService.GetCompanyBuyingHistory(companyId, this.leadData.leadId).subscribe((res: any) => {
            console.log(res);
            this.Loader = false;
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
    getAverageInvoiceSum(): number {
        let totalSum = 0;
        this.companyBuyingHistories?.forEach((history: any) => {
            totalSum += history.monthTotalAmount; // Assuming `monthTotalAmount` holds the total amount for each history
        });
        const averageSum = totalSum / this.companyBuyingHistories?.length;
        return averageSum;
    }

    file: any;
    imagePath: any;
    documentUpload(file: any, imgUploadType: string, event?: any) {
        debugger
        if (file && file.target.files.length > 0) {

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
                    if (this.uploadDocument.DocumentName == null || this.uploadDocument.DocumentName == '') {
                        this.messageService.add({ severity: 'error', summary: 'please Select Document', detail: '' });
                    }
                    else {
                        this.uploadDocumentFile(imgUploadType);
                    }
                    (success: any) => {
                        // alert('image uploaded successfully');
                        this.messageService.add({ severity: 'success', summary: 'image uploaded successfully', detail: '' });

                        if (this.uploadDocument.DocumentName == null || this.uploadDocument.DocumentName == '') {
                            this.messageService.add({ severity: 'error', summary: 'please Select Document', detail: '' });
                        }
                        else {

                            this.uploadDocumentFile(imgUploadType);
                        }
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

        } else {
            this.uploadDocument.FileUrl = '';
            this.onUploadDocId = 0;
        }
    }
    onUploadDocId: any;
    uploadDocumentFile(imgUploadType: any) {
        const formData = new FormData();
        formData.append('FileDetails', this.file[0]);
        formData.append('IsValidForLifeTime', 'true');
        formData.append('ValidityInDays', '');
        formData.append('SubFolderName', '');
        this.Loader = true;
        this._leadService.postSingleFile(formData).subscribe((res: any) => {
            console.log('Uploaded File-', res);
            this.Loader = false;
            if (res.status) {
                this.messageService.add({ severity: 'success', summary: 'Click on Save Document Button', detail: '' });
                this.uploadDocument.FileUrl = res.filePath;
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
    onUploadDocument() {

        // this.uploadDocument.LeadId = this.leadData.leadId;
        var isFlag = false;
        // this.uploadDocument.DocumentNumber &&
        if (this.uploadDocument.DocumentName && this.uploadDocument.FileUrl) {
            isFlag = true;
            // && this.uploadDocument.PdfPassword
            if (this.uploadDocument.DocumentName == 'Statement') {
                isFlag = true;
            } else if (this.uploadDocument.DocumentName != 'Statement') {
                isFlag = true;
            } else {
                isFlag = false;
            }
        } else {
            isFlag = false;
            // if (!this.uploadDocument.DocumentNumber) {
            //     this.messageService.add({ severity: 'error', summary: 'Please Enter All the Fields and Upload file', detail: '' });
            // }
            // else 
            if (!this.uploadDocument.DocumentName) {
                this.messageService.add({ severity: 'error', summary: 'Please Enter Document Name', detail: '' });
            }
            else if (!this.uploadDocument.FileUrl) {
                this.messageService.add({ severity: 'error', summary: 'Please Upload File', detail: '' });
            }
        }
        if (isFlag) {
            const payload = {
                LeadId: this.leadData.leadId,
                // DocumentNumber: this.uploadDocument.DocumentNumber,
                DocumentName: this.uploadDocument.DocumentName,
                FileUrl: this.uploadDocument.FileUrl,
                PdfPassword: this.uploadDocument.PdfPassword ? this.uploadDocument.PdfPassword : '',
                leadDocDetailId: 0,
                sequence: 0,
                userId: this.leadData.userId,
                productCode: "CreditLine",
                docId: this.onUploadDocId.toString()
            }
            if (payload != null) {
                this.Loader = true
                this._leadService.UploadLeadDocuments(payload).subscribe((res: any) => {
                    this.Loader = false;
                    console.log(res, 'res');
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
                        this.selectedDocumentName = undefined;
                    }
                }, (error: any) => {
                    this.Loader = false;
                })

                this.myInputVariable2.nativeElement.value = null;
            }
        }
    }

    selectedDocumentName: any;
    onDocumentChange(event: any) {
        console.log(event);
        this.uploadDocument.DocumentName = event.value.label;
        this.uploadDocument.DocumentName = this.selectedDocumentName.value;
        this.myInputVariable2.nativeElement.value = null;
    }

    allDocs: UploadDocument[] = [];
    showMultiImgList: any
    showMultiImage: boolean = false;
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
    GetLeadDocumentsByLeadId() {
        try {

            this._leadService.GetLeadDocumentsByLeadId(this.leadData.leadId).subscribe((res: any) => {
                console.log("GetLeadDocumentsByLeadId122", res);
                // debugger
                if (res && res.status && res.response.length > 0) {
                    // this.allDocs = res.result;
                    // let docList = res.result;
                    // this.allDocs = res.result.filter((x: any) => x.documentName == "udyog_aadhaar" || x.documentName == "bank_statement" || x.documentName == "gst_certificate" || x.documentName == "Other");
                    this.allDocs = res.response.filter((x: any) => x.documentName == "bank_statement"
                        || x.documentName == "BuisnessDocument" || x.documentName == "GST Certificate" || x.documentName == "Udyog Aadhaar Certificate"
                        || x.documentName == "Shop Establishment Certificate" || x.documentName == "Trade License" || x.documentName == "Others");
                    console.log(this.allDocs);

                } else {
                    this.allDocs = [];
                }
            })
        }
        catch (error: any) {
            this.Loader = false;
            this.messageService.add({ severity: 'error', summary: 'Error API - GetLeadDocumentsByLeadId', detail: error });
        }
    }
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

    isAddressEditPopup: boolean = false;
    updatedAddress: any = {
        // leadId: 0,
        // userId: '',
        addressLineOne: '',
        addressLineTwo: '',
        addressLineThree: '',
        cityName: '',
        countryName: '',
        stateName: '',
        zipCode: '',

        cityId: 0,
        currentAddressId: 0,
        addressType: '',
    }
    updateAddressDetailsPopup(adressType: string) {
        this.isAddressEditPopup = true;
        this.updatedAddress = {}
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

    updateAddressFn() {
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
        if (this.updatedAddress.addressLineOne && this.isFirstLetterNotSpace(this.updatedAddress.addressLineOne) && this.updatedAddress.addressLineTwo && this.isFirstLetterNotSpace(this.updatedAddress.addressLineTwo) && this.updatedAddress.zipCode.length == 6 && this.updatedAddress.cityId) {
            flag = true
        }
        if (flag) {
            let payload = {
                "leadId": this.leadData.leadId,
                "addCorrLine1": this.updatedAddress.addressLineOne,
                "addCorrLine2": this.updatedAddress.addressLineTwo,
                "addCorrLine3": this.updatedAddress.addressLineThree,
                "addCorrPincode": this.updatedAddress.zipCode.toString(),
                "addCorrCity": this.updatedAddress.cityId.toString(),
                "userId": this.leadData.userId,
                "addressId": this.updatedAddress.currentAddressId,
                "addressType": this.updatedAddress.addressType,
                "currentAddressId": 0,
                "AddCorrCityName": this.updatedAddress.cityName,
                "AddCorrStateName": this.updatedAddress.stateName
            };

            console.log(payload);
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
        this._leadService.GetCityByStateId(stateId).subscribe((res: any) => {
            console.log(res, 'CityByState');
            this.cityList = [];
            if (res != null && res.length > 0) {
                this.cityList = res;
                let cityObj = this.cityList.filter((x: any) => x.id == this.updatedAddress.cityId)[0];
                this.updatedAddress.cityId = cityObj.id;
            }
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

    checkButtonApprove(): boolean {
        //   console.log(this.selectedActionStatus);
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
        //   console.log(this.selectedActionStatus);

        if (this.selectedActionStatus) {
            if ((this.selectedActionStatus.activity == 'Pan' || this.selectedActionStatus.activity == 'Aadhar'
                || this.selectedActionStatus.activity == 'Selfie' || this.selectedActionStatus.activity == 'DSATypeSelection') && this.leadData.status != "Activated") {
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
    selectedBusinessType: any;
    selectedIncomeSlab: any;
    editBusinessDetails(address: any) {
        debugger
        this.isBusinessDetailEditPopup = true;
        this.editBusinessDetail.businessName = this.businessDetail.businessName;
        this.editBusinessDetail.IncorporationDate = this.formatDate(this.businessDetail.IncorporationDate);
        this.editBusinessDetail.GstNumber = this.businessDetail.GstNumber;

        console.log(this.businessDetail);

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


    }




    CustomerDetailUsingGST: any;
    // GetCustomerDetailUsingGST(GstNo: any) {
    //     this.Loader = true;
    //     this._leadService.GetCustomerDetailUsingGST(GstNo).subscribe((res: any) => {
    //         this.Loader = false;
    //         console.log(res, 'GetCustomerDetailUsingGST');
    //     }, (error: any) => { this.Loader = false; })
    // }

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
        else {
            isFlag = true
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



            const payload = {
                "leadMasterId": this.leadData.leadId,
                "busName": gstVerified ? this.editBusinessDetailObj.businessName : this.editBusinessDetail.businessName,
                "doi": gstVerified ? this.editBusinessDetailObj.doi : this.businessDetail.IncorporationDate,
                "busGSTNO": gstVerified ? this.editBusinessDetailObj.busGSTNO : this.editBusinessDetail.GstNumber,
                "busEntityType": this.editBusinessDetail.BusinessType,
                "buisnessMonthlySalary": gstVerified ? this.editBusinessDetailObj.buisnessMonthlySalary : this.businessDetail.buisnessMonthlySalary,
                "incomeSlab": this.editBusinessDetail.IncomeSlab,
                "buisnessDocumentNo": gstVerified ? this.editBusinessDetailObj.busGSTNO : this.businessDetail.GstNumber,
                "inquiryAmount": this.editBusinessDetail.inquiryAmount,
                "surrogateType": this.editBusinessDetail.surrogateType,
                "userId": this.leadData.userId,
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

    pattern: any;
    checkGstPattern(GSTNo: any) {
        console.log(this.editBusinessDetail);
        this.editBusinessDetail.GstNumber = this.editBusinessDetail.GstNumber.toUpperCase();
        this.pattern =
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[A-Z]{1}[0-9A-Z]{1}$/;
        this.getdatabyGstNo(GSTNo);
    }

    isgstExist: boolean = false;
    isGstVerified: boolean = false;
    getdatabyGstNo(GSTNo: string) {
        this.isGstVerified = false;
        if (GSTNo.length == 15) {
            this.Loader = true;
            this.companyService.checkCompanyGSTExist(GSTNo).subscribe((x: any) => {
                this.isgstExist = x.status;
                if (!this.isgstExist) {
                    this._leadService.GetCustomerDetailUsingGST(GSTNo).subscribe((res: any) => {
                        console.log(res);
                        this.Loader = false;
                        if (res.status == true) {
                            this.isGstVerified = true;
                            this.toasterService.showSuccess(res.message);
                            this.editBusinessDetailObj = res;
                            this.setBusinessData();
                        } else {
                            this.isGstVerified = false;
                            this.Loader = false;
                            // this.editBusinessDetailObj = res;
                            // this.editBusinessDetail.GstNumber = '';
                            this.toasterService.showWarn(res.message);
                        }
                    });
                } else {
                    this.Loader = false;
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

    isFirstLetterNotSpace(sentence: string) {
        // Check if the first character is not a space
        return /^\S/.test(sentence);
    }
    AlphabetNumberOnly(event: any) {
        var res = this.commonValidation.AlphabetNumberOnly(event);
        return res;
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
    alphaNumberOnly(e: any) {
        // Accept only alpha numerics, not special characters
        var res = this.commonValidation.AlphabetNumberOnly(e);
    }

    space(e: any) {
        var res = this.commonValidation.space(e);
    }

    NumberOnly(e: any) {
        var res = this.commonValidation.keyPressAmount(e);
    }
    onKeydown(event: any) {
        var charCode = (event.which) ? event.which : event.keyCode;
        // Only Numbers 0-9
        console.log(charCode, ': charCode');

        if (((charCode != 8 && charCode != 17 && charCode != 18 && charCode != 46 && charCode != 37 && charCode < 48) || (charCode > 57 && charCode != 65 && charCode != 174))) {
            // this.toastr.error('You Can Enter Or Paste Numbers Only!!');
            event.preventDefault();
            return false;
        } else {
            return true;
        }
    }


    //new
    error: any
    minMaxError: any
    keyPressAmount(event: any) {
        // After Decimal Allow only 2 digit

        const reg = /^-?\d*(\.\d{0,2})?$/;
        let input = event.target.value + String.fromCharCode(event.charCode);
        if (!reg.test(input)) {
            event.preventDefault();
        }
    }

    omit_special_char(event: any) {
        //debugger
        var k;
        k = event.charCode; //         k = event.keyCode;  (Both can be used)
        return (
            (k > 64 && k < 91) ||
            (k > 96 && k < 123) ||
            k == 8 ||
            k == 32 ||
            k == 46 ||
            (k >= 48 && k <= 57)
        );
    }
    checkForOverlappingRanges(payoutPayload: any): any {
        debugger
        function mapAndSortRanges(rows: any[], MinAmount: string, MaxAmount: string): { Min: number, Max: number, index: number }[] {
            const ranges = rows.map((row: any, index: number) => ({
                Min: row[MinAmount],
                Max: row[MaxAmount],
                index: index
            }));

            ranges.sort((a: any, b: any) => a.Min - b.Min);
            return ranges;
        }
        let ranges = [];
        this.error = null
        let obj = {
            msg: this.error,
            status: true
        }
        ranges = mapAndSortRanges(payoutPayload, 'MinAmount', 'MaxAmount');

        for (let i = 1; i < ranges.length; i++) {
            let min = Number(ranges[i].Min)
            let max = Number(ranges[i - 1].Max)
            if (min != null && max != null && min <= max) {
                // in ${ranges[i].index}
                this.error = `Range ${ranges[i].Min}-${ranges[i].Max} overlaps with ${ranges[i - 1].Min}-${ranges[i - 1].Max} `;
                this.error ? this.messageService.add({
                    severity: 'error',
                    summary: this.error,
                }) : null;
                console.log(this.error);
                obj = {
                    msg: this.error,
                    status: false
                }
                return obj;
            }
            else { }
        }
        return obj;


    }
    checkSlabValidation(payoutPayload: any) {
        debugger
        const isValidRow = (row: any) => {
            return (
                row.MinAmount !== null &&
                row.MinAmount !== undefined &&
                row.MaxAmount !== null &&
                row.MaxAmount !== undefined &&
                row.payoutPerc !== null &&
                row.payoutPerc !== undefined
            );
        };
        const payoutRowsValid = payoutPayload && payoutPayload.length > 0 && payoutPayload.every(isValidRow);
        let data = {
            status: payoutRowsValid,
            msg: !payoutRowsValid ? 'Payout slab might be empty! Please Check !' : null
        }
        return data;
        // return payoutRowsValid;
    }
    isValidRows(rows: any[]): boolean {
        const isValuePresent = (value: any, fieldName: string) => {
            if (value == null || value == undefined) {
                this.minMaxError.push(`${fieldName} is empty!`);
                return false;
            }
            return true;
        };

        const isValidRow = (row: any) => {
            const validFields = [
                isValuePresent(row.MinAmount, 'Min Disbursement Amount'),
                isValuePresent(row.MaxAmount, 'Max Disbursement Amount'),
                isValuePresent(row.payoutPerc, 'Payout Percentage'),
            ];

            return validFields.every(Boolean);
        };
        const checkValueInRange = (row: any) => {
            if (row.MinAmount > row.MaxAmount) {
                this.minMaxError.push(`${row.MinAmount} must be less than ${row.MaxAmount} `);
            }

            return (
                row.MinAmount < row.MaxAmount
            );
        };
        return rows && rows.length > 0 && rows.every(isValidRow) && rows.every(checkValueInRange);

    }
    addPayoutRows(DsaProductId?:any) {
        debugger
        let existingProduct = this.dsaMultiplePayout.find((p: any) => p.productId === DsaProductId);
        let obj = DsaProductId==undefined && this.payoutRows && this.payoutRows.length > 0 ? this.payoutRows : existingProduct.slabs
        let data = this.checkSlabValidation(obj)
        if (data.status == true) {
            if(this.payoutRows && this.payoutRows.length > 0 && DsaProductId==undefined){
                this.payoutRows.push({
                    MinAmount: null,
                    MaxAmount: null,
                    payoutPerc: null
                })
            } 
            else{
                    existingProduct.slabs.push({
                        MinAmount: null,
                        MaxAmount: null,
                        payoutPerc: null
                    })
            }
                
        }
        else {
            this.messageService.add({
                severity: 'error',
                summary: data.msg ? data.msg : 'Enter valid details in slab!',
            });
        }
    }
    dsaMultiplePayout: any = []
    DsaProductId: any
    copiedProductList: any
    addProductPayout(str?: string) {
        debugger
        if (this.DsaProductId && this.payoutRows && this.payoutRows.length > 0) {
            let obj: any = {
                productId: this.DsaProductId,
                slabs: []
            }
            obj.slabs = this.payoutRows
            this.dsaMultiplePayout.push(obj)
            this.productList = []
            this.productList = this.copiedProductList
            this.dsaMultiplePayout.forEach((e: any) => {
                this.productList = this.productList.filter((_x: any, index: number) => _x.id !== e.productId);
            })

            console.log(this.dsaMultiplePayout);
            if(!str){
                this.payoutRows = [
                    {
                        MinAmount: null,
                        MaxAmount: null,
                        payoutPerc: null
                    }
                ]
            }
            else{
                this.payoutRows = []
                this.DsaProductId = null

            }

        }
        else {
            if (!this.DsaProductId && this.payoutRows && this.payoutRows.length > 0) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Select Product!',
                })
                return
            }
            else {
                if (!str) {
                    this.payoutRows = [
                        {
                            MinAmount: null,
                            MaxAmount: null,
                            payoutPerc: null
                        }
                    ]
                    this.DsaProductId = null
                    this.productList = this.copiedProductList

                    this.dsaMultiplePayout.forEach((e: any) => {
                        this.productList = this.productList.filter((_x: any, index: number) => _x.id !== e.productId);
                    })
                } else {
                    this.payoutRows = []

                }
            }

        }
        // if(!str){

        // }
        // else{
        //     this.payoutRows = []
        // }


    }


    removePayoutRows(i: number) {
        this.payoutRows = this.payoutRows.filter((_x: any, index: number) => index !== i);
    }
    removeDsaPayoutRows(i: number, prodId?: any) {
        debugger
        let dsa =
            this.dsaMultiplePayout.forEach((e: any) => {
                if (e.productId == prodId) {
                    e.slabs = e.slabs.filter((_x: any, index: number) => index !== i);
                }
                e.slabs && e.slabs.length == 0 ? this.dsaMultiplePayout = this.dsaMultiplePayout.filter((_x: any, index: number) => _x.productId !== prodId) : null;

                console.log(e.slabs);

            })

            this.productList = this.copiedProductList
            this.dsaMultiplePayout.forEach((e: any) => {
                this.productList = this.productList.filter((_x: any, index: number) => _x.id !== e.productId);
            }) 

        console.log(dsa);

    }

    PayoutPercentage: number = 0;
    SaveDSAPayouts() {
        debugger

        // if (this.PayoutPercentage > 3 || !this.PayoutPercentage) {
        //     this.messageService.add({ severity: 'error', summary: 'Enter less than or equal to 3. ', detail: '' });

        //     return
        // }


        if (this.payoutRows && this.payoutRows.length > 0) {
            this.addProductPayout('save')
        }
        let payoutPayload: any = []
        this.dsaMultiplePayout.forEach((e: any) => {
            e.slabs.forEach((ex: any) => {
                let payload: any
                payload = {
                    "ProductId": e.productId,
                    "leadId": this.leadData.leadId,
                    "payoutPerc": ex.payoutPerc,
                    "MinAmount": Number(ex.MinAmount),
                    "MaxAmount": Number(ex.MaxAmount)
                }
                payoutPayload.push(payload)
            })
        })
        console.log('payoutPayload', payoutPayload);

        let checkSlab: any = {
            status: false,
            msg: ''
        }
        let checkRange: any = {
            status: false,
            msg: ''
        }
        this.minMaxError = []
        this.dsaMultiplePayout.forEach((e: any) => {
            checkSlab = this.checkSlabValidation(e.slabs);
            checkRange = this.checkForOverlappingRanges(e.slabs);
        })
        const validateRows = this.isValidRows(this.payoutRows);
        if (!validateRows) {
            console.log(this.minMaxError.length);

            if (this.minMaxError && this.minMaxError.length != 0) {
                this.messageService.add({
                    severity: 'error',
                    summary: this.minMaxError + '',
                });
                return;
            }
        }
        if (checkSlab && checkSlab.status && checkRange && checkRange.status) {


            this._dsaService.SaveDSAPayouts(payoutPayload).subscribe((res: any) => {
                console.log('SaveDSAPayouts', res);
                if (res.status) {
                    this.messageService.add({ severity: 'success', summary: res.msg, detail: '' });
                    this.refreshParentPage.emit(null)
                } else {
                    this.messageService.add({ severity: 'error', summary: res.msg, detail: '' });
                }
            })
        }
        else {
            this.messageService.add({
                severity: 'error',
                summary: checkSlab.msg ? checkSlab.msg : checkRange.msg,
            });
        }

    }




}

interface DsaBusinessDetail {
    address?: any
    age?: any
    alternatePhoneNo?: any
    buisnessDocument?: any
    city?: any
    companyName?: any
    dob?: any
    documentId?: any
    emailId?: any
    fatherOrHusbandName?: any
    firmType?: any
    fullName?: any
    gstNumber?: any
    gstStatus?: any
    languagesKnown?: any
    mobileNo?: any
    noOfYearsInCurrentEmployment?: any
    pinCode?: any
    presentOccupation?: any
    qualification?: any
    referneceContact?: any
    referneceLocation?: any
    referneceName?: any
    state?: any
    workingWithOther?: any
    gender?: any
    workingLocation?: any


    alternateContactNo?: any
    fatherName?: any
    presentEmployment?: any
    referenceName?: any


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
    buisnessMonthlySalary: number;
    buisnessProof: string;
    buisnessProofDocId: number;
    inquiryAmount: number;
    surrogateType: any
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

// interface BankDetail {
//     borroBankAccNum: string;
//     borroBankIFSC: string;
//     borroBankName: string;
//     borroBankAccountholdername: string;
//     accType: string;
//     beneficiary_AccountNumber: string;
//     beneficiary_Accountholdername: string;
//     beneficiary_Bankname: string;
//     beneficiary_IFSCCode: string;
//     beneficiary_Typeofaccount: string;
//     isEnach: boolean;
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
    combinedAddress: string;
    state: string;
    cityName: string;
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
    stateId: string;
    zipCode: string;
    id: number
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
interface BenificiaryDetails {
    Beneficiary_AccountNumber: any;
    Beneficiary_Accountholdername: string;
    Beneficiary_Typeofaccount: string,
    Beneficiary_Bankname: string,
    Beneficiary_IFSCCode: string
}
interface UploadDocument {
    leadId: number;
    documentNumber: string;
    documentName: string;
    fileUrl: string;
    pdfPassword: string;
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


// interface UpdateAddressDetails {
//     updateAddress: Address;
// }