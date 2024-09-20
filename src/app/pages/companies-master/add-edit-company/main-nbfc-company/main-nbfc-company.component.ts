import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SaveCompanyAndLocationDTO, CompanyAddressDTO, FinancialLiaisonDetails } from '../../interfaces/nbfc-basic';
import { NbfcBasicService } from '../../services/nbfc-basic.service';
// import { AddCompanyProductService } from 'app/pages/admin/company-master/services/add-company-product.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray } from '@angular/forms';
import { CityService } from 'app/pages/admin/services/city.service';
import { StateService } from 'app/pages/admin/services/state.service';
import { CountryService } from 'app/pages/admin/services/country.service';
import { CommonValidationService } from 'app/shared/services/common-validation.service';
import { NbfcProductService } from '../../services/nbfc-product.service';
import { CompanyMasterService } from '../../services/company-master.service';
import { AnchorCompanyService } from '../../services/anchor-company.service';
import { LocalStogareService } from 'app/shared/services/local-storage.service';
@Component({
    selector: 'app-main-nbfc-company',
    templateUrl: './main-nbfc-company.component.html',
    styleUrls: ['./main-nbfc-company.component.scss']
})
export class MainNbfcCompanyComponent implements OnInit {
    financialLiaisonDetails: FinancialLiaisonDetails;
    nbfcform: SaveCompanyAndLocationDTO;
    addressform: CompanyAddressDTO;
    productList: any;
    Loader: boolean = false;
    CompanyType: any
    entity: any;
    dialogData: any;
    visible: boolean = false; //for edit
    Id: any //for history
    isHistoryVisible: boolean = false;
    file: any
    imagePath: any
    BusinessType: any;
    BusinessTypeId: any;

    IsProductDialog: boolean = false;//for product dialog add/edit
    productId: any;
    isProductHistory: boolean = false;
    databaseName: any = 'product'

    companyId: any //for edit
    countryList: any
    stateList: any
    citylist: any
    CityId: any
    StateId: any
    AccountTypeList: any = [
        { name: 'Saving', label: 'Saving' },
        { name: 'Current', label: 'Current' }
    ]

    submitted: Boolean = false; //FORM VALIDATION
    //for file upload (Gst/pan/msme/cancel cheque/logo)
    @ViewChild('userPhoto1')
    myInputVariable1!: ElementRef;//AgreementURL
    @ViewChild('userPhoto2')
    myInputVariable2!: ElementRef;//BusinessPanURL
    @ViewChild('userPhoto3')
    myInputVariable3!: ElementRef; //GSTDocumentURL
    @ViewChild('userPhoto4')
    myInputVariable4!: ElementRef;//MSMEDocumentURL
    @ViewChild('userPhoto5')
    myInputVariable5!: ElementRef;//CancelChequeURL
    @ViewChild('userPhoto6')
    myInputVariable6!: ElementRef;//LogoURL


    //defaultImageVariables
    defAgreementURL: any
    defPanURL: any
    defCancelChequeURL: any
    defMSMEDocumentURL: any
    defGSTDocumentURL: any


    showImage: boolean = false;
    dialogUrl: any
    showUrl: any

    //disable if gst verified --update
    isGstVerified: boolean = false;
    isGstCityVerified: boolean = false;
    isGstStateVerified: boolean = false;

    constructor(
        private nbfcService: NbfcBasicService,
        private productService: NbfcProductService,
        private confirmationService: ConfirmationService,
        private activatedRoute: ActivatedRoute,
        private city: CityService,
        private state: StateService,
        private country: CountryService,
        private commonValidation: CommonValidationService,
        private companyService: CompanyMasterService,
        private anchorcompanyService: AnchorCompanyService,
        private router: Router,
        private messageService: MessageService,
        private local: LocalStogareService

    ) {
        this.financialLiaisonDetails = {
            FinancialLiaisonFirstName: '',
            FinancialLiaisonLastName: '',
            FinancialLiaisonEmailAddress: '',
            FinancialLiaisonContactNo: '',
        };

        this.nbfcform = {
            CompanyId: 0,
            CompanyType: 'NBFC',
            GSTNo: '',
            BusinessName: '',
            BusinessContactEmail: '',
            BusinessContactNo: null,
            BusinessTypeId: null,
            BusinessPanURL: '',
            BusinessPanDocId: null,
            IsDefault: false,
            GSTDocId: null,
            GSTDocumentURL: '',
            MSMEDocId: null,
            MSMEDocumentURL: "",
            CancelChequeDocId: null,
            CancelChequeURL: '',
            BankName: '',
            BankAccountNumber: null,
            BankIFSC: '',
            ContactPersonName: '',
            isMSME: false,
            IsSelfConfiguration: false,
            CompanyAddress: {},
            PartnerList: [],
            CompanyStatus: false,
            AgreementURL: "",
            AgreementStartDate: null,
            AgreementEndDate: null,
            PanNo: "", //anchor
            LandingName: "",//anchor
            APIKey: "",//anchor
            APISecretKey: "",//anchor
            WhitelistURL: "",//anchor
            CustomerAgreementURL: "",//NBFC
            BusinessHelpline:
                ""
            ,
            LogoURL: "",
            AccountType: '',
            AccountHolderName: '',
            BranchName: '',
            FinancialLiaisonDetails: this.financialLiaisonDetails
        }




        this.addressform = {
            AddressTypeId: 0,
            AddressLineOne: '',
            AddressLineTwo: '',
            AddressLineThree: '',
            ZipCode: '',
            CityId: 0,
            StateId: 0,
            countryId: 0
        }

    }

    ngOnInit(): void {
        this.addressform.countryId = 1;
        this.local.set('CompanyType', 'NBFC');

        this.CompanyType = 'NBFC'
        if (this.CompanyType == 'NBFC') { this.entity = 'ProductNBFCCompany' } else { this.entity = 'ProductAnchorCompany' }
        this.GetBusinessType();
        this.getCountry();
        this.companyId = this.activatedRoute.snapshot.paramMap.get("Id");

        if (this.companyId > 0) {
            this.nbfcform.CompanyId = parseInt(this.companyId);
            this.GetCompanyAndLocationAsync()
            this.GetNBFCProductList();
        }

    }



    //api start

    getCountry() {
        this.Loader = true;
        this.country.getCountryList().subscribe((res: any) => {
            console.log(res.returnObject);
            this.Loader = false;
            this.countryList = res.returnObject;
            this.addressform.countryId = 1;
            this.getstatebyCountryId(this.addressform.countryId);
        });
    }
    async getstatebyCountryId(countryid: number) {

        try {
            this.Loader = true;
            const res: any = await this.state.getStateByCountryId(countryid).toPromise();
            console.log('stateList', res.returnObject);
            this.Loader = false;
            this.stateList = res.returnObject;
            console.log('stl', this.stateList);

        } catch (error) {
            console.error(error);
            this.Loader = false;
            throw error; // Rethrow the error for handling in the calling code
        }
    }
    getStateList() {
        this.stateList = [];
        this.Loader = true;
        this.state.getStateList().subscribe((res: any) => {
            this.Loader = false;
            this.stateList = res.returnObject;
            console.log('ctl', this.stateList);
        })
    }
    async getCitylist() {
        this.citylist = []
        this.Loader = true;
        this.city.getCityList().subscribe((res: any) => {
            this.citylist = res;
            console.log('this.citylist', this.citylist)
            this.Loader = false;
        })
    }
    async getCitiesbyStateId(stateid: any) {

        try {
            this.Loader = true;
            const res: any = await this.city.getCityByStateId(stateid).toPromise();
            console.log('cityList', res);
            this.Loader = false;
            this.citylist = res;
        } catch (error) {
            console.error(error);
            this.Loader = false;
            throw error; // Rethrow the error for handling in the calling code
        }

    }

    isgstExist: boolean = false;

    async getAddressbyGstNO() {
        // debugger;
        this.isGstVerified = false;
        this.isGstStateVerified = false;
        this.isGstCityVerified = false;
        const isGstValid =
            !!this.nbfcform.GSTNo &&
            this.nbfcform.GSTNo.match(
                /[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}/
            );

        if (this.nbfcform.GSTNo && this.nbfcform.GSTNo.length == 15) {
            this.Loader = true;
            this.anchorcompanyService.checkCompanyGSTExist(this.nbfcform.GSTNo).subscribe(async (x: any) => {
                this.isgstExist = x.status;
                if (!this.isgstExist) {
                    let res = await this.companyService
                        .GetGstInfoNew(this.nbfcform.GSTNo)
                        .toPromise();
                    // this.nbfcService.GetGstInfoNew(this.nbfcform.GSTNo).subscribe(async (res: any) => {
                    this.Loader = false;
                    console.log('GetGSTDetail-', res);
                    // if (this.addressform.StateId == null) {
                    //   await this.getstatebyCountryId(
                    //     this.addressform.countryId
                    //     );
                    //   }
                    if (res.status == true) {
                        // alert(res.message)
                        this.messageService.add({ severity: 'success', summary: res.message, detail: '' });

                        this.addressform.AddressLineOne = res.addressLine1
                        this.addressform.ZipCode = res.zipcode;
                        this.nbfcform.BusinessName = res.name;
                        this.isGstVerified = true;

                        let data: any = []
                        // data = this.stateList?this.stateList.filter((x:any) => x.name.toLowerCase == res.state.toLowerCase)[0]:null;
                        if (this.stateList && this.stateList.length > 0) {
                            this.stateList.forEach((element: any) => {
                                debugger;
                                if (element.name.toLowerCase() == res.state.toLowerCase()) {
                                    data = element
                                }
                            });
                        }
                        this.addressform.StateId = 0;
                        this.addressform.StateId = data ? data.id : 0;
                        if (!this.addressform.StateId) {
                            // alert('State Not Found!')
                            this.messageService.add({ severity: 'warn', summary: 'State Not Found!! add from state page !', detail: '' });

                            await this.getstatebyCountryId(this.addressform.countryId);
                        }
                        else {
                            this.isGstStateVerified = true;
                            await this.getCitiesbyStateId(data.id);
                        }

                        let data2: any
                        // data2 = this.citylist ? this.citylist.filter((x:any) => x.name.toLowerCase == res.city.toLowerCase)[0]:null;
                        if (this.citylist && this.citylist.length > 0) {
                            this.citylist.forEach((element: any) => {
                                debugger;
                                if (element.name.toLowerCase() == res.city.toLowerCase()) {
                                    data2 = element
                                }
                            });
                        }
                        this.addressform.CityId = null
                        this.addressform.CityId = data2 ? data2.id : null

                        if (!this.addressform.CityId) {
                            // alert('City Not Found! add from city page !')
                            this.messageService.add({ severity: 'warn', summary: 'City Not Found! add from city page !', detail: '' });

                            // await this.getCitylist(); //state Id
                        }
                        else {
                            this.isGstCityVerified = true;
                        }



                    }
                    else {
                        this.nbfcform.GSTNo = '';
                        // alert();
                        this.messageService.add({ severity: 'error', summary: res.message, detail: '' });

                    }
                }
                else {
                    this.Loader = false;
                    // alert('GST exist');
                    this.messageService.add({ severity: 'error', summary: 'GST exist', detail: '' });

                }
            })
        }




    }

    GetNBFCProductList() {
        this.companyId = this.activatedRoute.snapshot.paramMap.get("Id");
        this.nbfcform.CompanyId = this.companyId
        this.Loader = true;
        this.nbfcService.GetNBFCProductList(this.nbfcform.CompanyId).subscribe((res: any) => {
            this.productList = res.returnObject;
            this.Loader = false;

        },
            (error: any) => {
                // alert('error'+error.error)
                this.Loader = false;
                console.log('GetNBFCProductList', error.error)
            })
    }
    GetCompanyAndLocationAsync() {
        this.Loader = true;
        this.nbfcService.GetCompanyAndLocationAsync(this.companyId).subscribe(async (result: any) => {
            // debugger
            console.log('GetCompanyAndLocationAsync response-', result);
            let nbfc = this.pascalCode(result.response);
            console.log("nbfc", JSON.stringify(nbfc));

            this.nbfcform = nbfc

            let address = result.response.companyAddress[0] ? this.pascalCode(result.response.companyAddress[0]) : null;
            if (address) {
                // var res1=await this.getstatebyCountryId(address.CountryId)

                this.addressform.AddressLineOne = address.AddressLineOne;
                this.addressform.AddressLineThree = address.AddressLineThree;
                this.addressform.AddressLineTwo = address.AddressLineTwo;
                this.addressform.AddressTypeId = address.AddressTypeId;
                this.addressform.StateId = address.StateId;
                this.addressform.ZipCode = String(address.ZipCode);
                if (this.addressform.StateId) {
                    await this.getCitiesbyStateId(address.StateId);
                    this.addressform.CityId = address.CityId;
                }
                // this.StateId= this.stateList?this.stateList.find((x:any) => x.id === address.StateId):null;
                // var res=await this.getCitiesbyStateId(address.StateId)
                // this.CityId=this.citylist ? this.citylist.find((x:any) => x.name.toLowerCase === address.CityName):null;
            }
            // else{
            //    this.getStateList();
            //    this.getCitylist();
            // }
            debugger
            this.nbfcform.GSTNo = nbfc.GstNo
            this.nbfcform.GSTDocumentURL = nbfc.GstDocumentURL
            this.nbfcform.GSTDocId = nbfc.GstDocId
            this.nbfcform.MSMEDocId = nbfc.MsmeDocId
            this.nbfcform.MSMEDocumentURL = nbfc.MsmeDocumentURL
            this.nbfcform.isMSME = nbfc.MsmeDocumentURL ? true : false
            this.nbfcform.WhitelistURL = ''
            this.nbfcform.AccountType = nbfc.AccountType;
            this.nbfcform.AccountHolderName = nbfc.AccountHolderName;
            this.nbfcform.BranchName = nbfc.BranchName;
            // this.financialLiaisonDetails.FinancialLiaisonFirstName= nbfc.FinancialLiaisonDetails.financialLiaisonFirstName;
            // this.financialLiaisonDetails.FinancialLiaisonLastName = nbfc.FinancialLiaisonDetails.financialLiaisonLastName;
            // this.financialLiaisonDetails.FinancialLiaisonContactNo = nbfc.FinancialLiaisonDetails.financialLiaisonContactNo;
            // this.financialLiaisonDetails.FinancialLiaisonEmailAddress = nbfc.FinancialLiaisonDetails.financialLiaisonEmailAddress;

            if (nbfc.FinancialLiaisonDetails != null) {
                this.nbfcform.FinancialLiaisonDetails = {
                    FinancialLiaisonFirstName: nbfc.FinancialLiaisonDetails.financialLiaisonFirstName,
                    FinancialLiaisonLastName: nbfc.FinancialLiaisonDetails.financialLiaisonLastName,
                    FinancialLiaisonContactNo: nbfc.FinancialLiaisonDetails.financialLiaisonContactNo,
                    FinancialLiaisonEmailAddress: nbfc.FinancialLiaisonDetails.financialLiaisonEmailAddress
                };
            } else {
                this.nbfcform.FinancialLiaisonDetails = {
                    FinancialLiaisonFirstName: '',
                    FinancialLiaisonLastName: '',
                    FinancialLiaisonContactNo: '',
                    FinancialLiaisonEmailAddress: ''
                };
            }
            this.defAgreementURL = this.nbfcform.AgreementURL && this.nbfcform.AgreementURL.includes('pdf') ? '../../../../../assets/img/pdflogo.png' : null
            this.defPanURL = this.nbfcform.BusinessPanURL && this.nbfcform.BusinessPanURL.includes('pdf') ? '../../../../../assets/img/pdflogo.png' : null
            this.defCancelChequeURL = this.nbfcform.CancelChequeURL && this.nbfcform.CancelChequeURL.includes('pdf') ? '../../../../../assets/img/pdflogo.png' : null
            this.defMSMEDocumentURL = this.nbfcform.MSMEDocumentURL.includes('pdf') ? '../../../../../assets/img/pdflogo.png' : null
            this.defGSTDocumentURL = this.nbfcform.GSTDocumentURL.includes('pdf') ? '../../../../../assets/img/pdflogo.png' : null

            console.log('pascalCode data=', nbfc)
            console.log('nbfc form=', this.nbfcform)
            console.log('addressform form=', this.addressform)

            this.Loader = false;
            this.BusinessTypeId = this.BusinessType?this.BusinessType.find((x: any) => x.id === nbfc.BusinessTypeId):null;
            this.getType(this.BusinessTypeId);
            // await this.getAddressbyGstNO();

            // this.addressform=address;



        },
            (error: any) => {
                // alert(error.error);
                console.log(error.error);
                this.Loader = false;
            })
    }
    SaveCompanyAndLocationAsync() {
        // Set submitted to true to trigger validation messages
        // debugger
        this.submitted = true;

        // Check if the form is valid before saving
        if (this.isFormValid()) {
            // this.addressform.CityId=this.CityId.id;
            // this.addressform.StateId=this.StateId.id
            this.nbfcform.CompanyAddress = this.addressform

            console.log('payload for SaveCompanyAndLocationAsync ', this.nbfcform)
            this.Loader = true;
            this.nbfcService.SaveCompanyAndLocationAsync(this.nbfcform).subscribe((result: any) => {
                console.log('SaveCompanyAndLocationAsync response-', result);
                this.Loader = false;
                this.messageService.add({ severity: 'success', summary: result.message, detail: '' });
                if (result.status) {
                    // this.companyId=result.companyId
                    // this.nbfcform.CompanyId=parseInt(result.companyId)
                    // this.router.navigateByUrl('pages/new-company-master/add-nbfc-company/' + this.companyId);
                    this.router.navigateByUrl('pages/new-company-master');

                }


                //  alert()
                this.messageService.add({ severity: 'warn', summary: result.message, detail: '' });

            },
                (error: any) => {
                    // alert(error.error);
                    console.log(error.error);
                    this.Loader = false;
                })
        }
        else {
            // alert('Enter Valid details')
            this.getInvalidValidations();

        }

    }
    UpdateCompanyAsync() {
        debugger
        this.submitted = true;
        if (this.isFormValid()) {
            this.Loader = true;
            this.nbfcform.CompanyId = parseInt(this.companyId)
            this.nbfcform.CompanyAddress = this.addressform
            // this.addressform.StateId=this.StateId.id;
            // this.addressform.CityId=this.CityId.id;
            console.log('this.nbfcform', this.nbfcform)
            this.nbfcService.UpdateCompanyAsync(this.nbfcform).subscribe((result: any) => {
                this.Loader = false;
                // alert(result.message)
                this.messageService.add({ severity: 'success', summary: result.message, detail: '' });

                this.router.navigateByUrl('pages/new-company-master');

            }
                , (error: any) => {
                    // alert(error.error );
                    this.Loader = false;
                })
        }
    }


    //file upload api 
    uploadFile(imgUploadType: any) {
        const formData = new FormData();
        formData.append('FileDetails', this.file[0]);
        formData.append('IsValidForLifeTime', 'true');
        formData.append('ValidityInDays', '');
        formData.append('SubFolderName', '');
        this.Loader = true;
        this.companyService.PostSingleFile(formData).subscribe((res: any) => {
            console.log('Uploaded File-', res);
            this.Loader = false;
            if (res.status) {
                // alert(res.message);
                this.messageService.add({ severity: 'success', summary: res.message, detail: '' });

                if (imgUploadType == 'LogoURL') {
                    this.nbfcform.LogoURL = res.filePath;
                }
                if (imgUploadType == 'GSTDocumentURL') {
                    this.defGSTDocumentURL = res.filePath.includes('pdf') ? '../../../../../assets/img/pdflogo.png' : null
                    this.nbfcform.GSTDocumentURL = res.filePath;
                    this.nbfcform.GSTDocId = res.docId
                }
                if (imgUploadType == 'MSMEDocumentURL') {
                    this.defMSMEDocumentURL = res.filePath.includes('pdf') ? '../../../../../assets/img/pdflogo.png' : null
                    this.nbfcform.MSMEDocumentURL = res.filePath;
                    this.nbfcform.MSMEDocId = res.docId;
                }
                if (imgUploadType == 'CancelChequeURL') {
                    this.defCancelChequeURL = res.filePath.includes('pdf') ? '../../../../../assets/img/pdflogo.png' : null
                    this.nbfcform.CancelChequeURL = res.filePath;
                    this.nbfcform.CancelChequeDocId = res.docId;
                }

                if (imgUploadType == 'BusinessPanURL') {
                    this.defPanURL = res.filePath.includes('pdf') ? '../../../../../assets/img/pdflogo.png' : null
                    this.nbfcform.BusinessPanURL = res.filePath;
                    this.nbfcform.BusinessPanDocId = res.docId;
                }
                if (imgUploadType == 'AgreementURL') {
                    this.defAgreementURL = res.filePath.includes('pdf') ? '../../../../../assets/img/pdflogo.png' : null
                    this.nbfcform.AgreementURL = res.filePath;
                }
            }
        },
            (error: any) => {
                // alert('error - PostSingleFile api')
                this.messageService.add({ severity: 'error', summary: 'In PostSingleFile api', detail: '' });

                this.Loader = false;

            })
    }

    //business type
    GetBusinessType() {
        debugger
        this.Loader = true;
        this.nbfcService.GetBusinessTypeMasterList(this.CompanyType).subscribe((gettype: any) => {
            console.log('GetBusinessTypeMasterList', gettype)
            this.Loader = false;
            this.BusinessType = gettype.returnObject;
        });
    }


    //product
    ActiveInactive(status: any, IsActive: boolean) {

        if (this.CompanyType == 'NBFC') {
            if (IsActive == true) {
                var activeData = 'Active';
            } else {
                activeData = 'InActive';
            }
            this.confirmationService.confirm({
                message:
                    'Are you sure want to' +
                    ' ' +
                    activeData +
                    ' ' +
                    'this confirmation?',
                accept: () => {
                    this.Loader = true;
                    this.productService
                        .NBFCProductActiveInactive(status.id, IsActive)
                        .subscribe((res: any) => {
                            console.log('NBFCProductActiveInactive', res);
                            this.Loader = false;
                            // alert(res.message);
                            this.messageService.add({ severity: 'success', summary: res.message, detail: '' });

                        },
                            (error: any) => {
                                // alert(error.error);
                                console.log(error.error);
                                this.Loader = false;
                            }
                        );
                },

                reject: () => {
                    IsActive = !IsActive;
                    status.IsActive = IsActive;
                    // alert('Action canceled.');
                    this.messageService.add({ severity: 'warn', summary: 'Action canceled', detail: '' });

                },
            });
        } else {
            if (IsActive == true) {
                var activeData = 'Active';
            } else {
                activeData = 'InActive';
            }
            // this.confirmationService.confirm({
            //   message:
            //     'Are you sure want to' +
            //     ' ' +
            //     activeData +
            //     ' ' +
            //     'this confirmation?',
            //   accept: () => {
            //     this.Loader = true;
            //     this.productService
            //       .AnchorProductActiveInactive(status.id, IsActive)
            //       .subscribe((res: any) => {
            //         console.log('AnchorProductActiveInactive',res);
            //         this.Loader = false;
            //         alert(res.message);
            //       },
            //       (error:any)=>{
            //         alert(error.error);
            //         console.log(error.error);
            //         this.Loader=false;
            //       });
            //   },
            //   reject: () => {
            //     IsActive = !IsActive;
            //     status.IsActive = IsActive;
            //     alert('Action canceled.');
            //   },
            // });
        }
    }

    //api end



    //========================================Miscellanous============================================================

    pattern: RegExp = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    panPattern: RegExp = /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/;

    isFormValid(): boolean {
        // Assuming you have validation logic for all form fields
        // Check each form control's validity
        debugger
        const isGstValid =
            !!this.nbfcform.GSTNo &&
            this.nbfcform.GSTNo.match(
                /[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[A-Z]{1}[0-9A-Z]{1}/
            );
        const isIFSCCode = this.nbfcform.BankIFSC && this.nbfcform.BankIFSC.length > 0 ? this.nbfcform.BankIFSC.match(/^[A-Z]{4}0[A-Z0-9]{6}$/) : true
        const isEmailValid =
            !!this.nbfcform.BusinessContactEmail &&
            this.nbfcform.BusinessContactEmail.match(
                /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            );
        const isContactNoValid =
            !!this.nbfcform.BusinessContactNo &&
            this.nbfcform.BusinessContactNo.match(/[0-9]{10}/);
        const isBusinessNameValid = !!this.nbfcform.BusinessName;
        const isContactPersonNameValid = !!this.nbfcform.ContactPersonName;
        // const isAccountType = !!this.nbfcform.AccountType;
        const isBusinessPanURL = !!this.nbfcform.BusinessPanURL;
        const isGSTDocumentURL = !!this.nbfcform.GSTDocumentURL;
        const isMSMEDocumentURL = ((this.nbfcform.isMSME == true && this.nbfcform.MSMEDocumentURL) || this.nbfcform.isMSME == false) ? true : false;

        // Additional validations for partner name and mobile number
        const isPartnerNameValid = this.nbfcform.PartnerList.every(
            (partner: any) => !!partner.partnerName && !!partner.mobileNo && partner.mobileNo.match(/[0-9]{10}/)

        );
        // const isBankAccountNumber =this.nbfcform.BankAccountNumber && this.nbfcform.BankAccountNumber.length> 0? !this.nbfcform.BankAccountNumber; // Additional validations forBankAccountNumber
        // Return true if all validations pass
        return !!(
            isGstValid &&
            isEmailValid &&
            isContactNoValid &&
            isBusinessNameValid &&
            // isAccountType &&
            isPartnerNameValid &&
            isIFSCCode &&
            // isBankAccountNumber &&
            isContactPersonNameValid &&
            isGSTDocumentURL &&
            isMSMEDocumentURL &&
            isBusinessPanURL
        );
    }
    keyPress(event: any) {
        var res = this.commonValidation.keyPress(event);
    }
    checkGstPattern() {
        this.pattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    }
    checkPanPattern() {
        this.panPattern = /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/;
    }
    alphaNumberOnly(e: any) {
        // Accept only alpha numerics, not special characters
        var res = this.commonValidation.AlphabetNumberOnly(e);
    }
    space(event: any) {
        var res = this.commonValidation.space(event);
    }
    NumberOnly(e: any) {  // Accept only alpha numerics, not special characters 
        var res = this.commonValidation.numberOnly(e)

    }
    pascalCode(obj: any) {    //for camel casing
        var result = this.commonValidation.pascalCode(obj);
        return result;
    }

    onPaste(e: any) {
        var result = this.commonValidation.onPaste(e)
    }

    defImageElement: any
    upload(file: any, imgUploadType: string, event?: any) {
        // debugger
        this.defImageElement = event ? event : null
        if (
            (file.target.files[0].name.toLowerCase().includes('jpeg') || file.target.files[0].name.toLowerCase().includes('png')
                ||
                file.target.files[0].name.toLowerCase().includes('jpg')
                ||
                (file.target.files[0].name.toLowerCase().includes('pdf') && imgUploadType != 'LogoURL')
            )) {
            if (file.target.files[0].size < 6000000) {
                this.file = file.target.files;
                var reader = new FileReader();
                this.imagePath = file;
                this.uploadFile(imgUploadType);
                (success: any) => {
                    // alert("image uploaded successfully")
                    this.messageService.add({ severity: 'success', summary: 'Image uploaded successfully.', detail: '' });

                    this.uploadFile(imgUploadType);
                };
            }
            else {
                // alert('Select Image size less than 6MB!!!');
                this.messageService.add({ severity: 'warn', summary: 'Select Image size less than 6MB!!!', detail: '' });

                event.nativeElement.value = "";
            }
        }
        else {
            // alert('Choose different file format!');
            this.messageService.add({ severity: 'warn', summary: 'Choose different file format!', detail: '' });

            event.nativeElement.value = "";
            file.preventDefault();
        }

    }

    labelforBusiness: any
    getType(event: any, input?: any) {
        this.nbfcform.BusinessTypeId = null
        this.nbfcform.BusinessTypeId = event.id
        if (event.id == 3) { this.labelforBusiness = 'Partner'; }
        else { this.labelforBusiness = 'Director'; }
        if (input == 'change') {
            let fArray = <FormArray>this.nbfcform.PartnerList
            while (fArray.length !== 0) {
                fArray.removeAt(0)
            }
        }
        if (event.id == 1) {
            this.onAddRow();
        }
    }

    onAddRow(def?: any) {
        // debugger
        if (
            this.nbfcform.BusinessTypeId == null ||
            this.nbfcform.BusinessTypeId == undefined && !this.Id
        ) {
            return;
        }
        if (
            (this.nbfcform.BusinessTypeId != 1 && !this.Id) ||
            (this.nbfcform.BusinessTypeId == 1 &&
                this.nbfcform.PartnerList.length == 0 &&
                !this.Id)
        ) {
            let count = 0;
            this.nbfcform.PartnerList && this.nbfcform.PartnerList.length > 0 ? this.nbfcform.PartnerList.forEach((element: any) => {
                if (element.partnerName == '') count++;
            }) : null;
            if (count == 0) {
                this.nbfcform.PartnerList.push(this.addNew());

            } else {
                if (!def) {

                    // alert("Fill all details!");
                    this.messageService.add({ severity: 'error', summary: 'Fill all details!', detail: '' });

                }
                else {
                    // alert("Fill all details!");
                    this.messageService.add({ severity: 'error', summary: 'Fill all details!', detail: '' });

                }
            }
        }
        if (
            (this.nbfcform.BusinessTypeId != 1 && this.Id) ||
            (this.nbfcform.BusinessTypeId == 1 &&
                this.nbfcform.PartnerList.length == 0 &&
                this.Id)
        ) {
            let count = 0;
            this.nbfcform.PartnerList.forEach((element: any) => {
                if (!element.partnerName) count++;
            });

            if (count == 0) {
                this.nbfcform.PartnerList.push(this.addNew());
                // this.tempList = this.NbfcForm.value.PartnerList;
            } else {
                // alert("Fill previous details");
                this.messageService.add({ severity: 'error', summary: 'Fill previous details!', detail: '' });

            }
        }
    }
    addNew() {
        return {
            partnerName: "",
            partnerId: 0,
            mobileNo: "",
        };
    }
    viewDialog(item: any) {
        console.log('item', item);
        this.dialogData = item;
        this.visible = true;
    }


    disableDialog(disableDialog: any) {
        debugger
        this.GetNBFCProductList();
        this.IsProductDialog = false;
    }
    removeImage(str: any) {

        if (str == 'GSTDocumentURL') {
            // this.isGSTDocumentURL = true;
            this.defImageElement = null
            this.nbfcform.GSTDocumentURL = null;
            this.nbfcform.GSTDocId = null;
        }
        if (str == 'MSMEDocumentURL') {
            // this.isMSMEDocumentURL = true;
            this.nbfcform.MSMEDocumentURL = null;
            this.nbfcform.MSMEDocId = null;
        }

        if (str == 'BusinessPanURL') {
            // this.isBusinessPanURL = true;

            this.nbfcform.BusinessPanURL = null;
            this.nbfcform.BusinessPanDocId = null;
        }
        if (str == 'LogoURL') {
            // this.isLogoURL = true;
            this.nbfcform.LogoURL = null;
        }
        if (str == 'CancelChequeURL') {
            // this.isCancelChequeURL = true;
            this.nbfcform.CancelChequeURL = null;
            this.nbfcform.CancelChequeDocId = null;
        }


    }

    show(input: string) {
        debugger
        this.showImage = true;
        if (input.toLowerCase().includes('jpeg') || input.toLowerCase().includes('png') || input.toLowerCase().includes('jpg')) {
            this.showUrl = input;
        }
        else {
            this.dialogUrl = '../../../../../assets/img/pdflogo.png'
            this.showUrl = input
        }
    }
    onHistoryClick(id: any) {
        this.Id = id
        this.isProductHistory = true;
    }
    dropID: any
    onClickEdit(item: any) {
        console.log('product', item);
        this.productId = item.productId
        this.dropID = item.id
        this.IsProductDialog = true;
    }
    download(value: any) {
        window.open(value);
    }

    onremoveRow(index: number) {
        //debugger
        let fArray = this.nbfcform.PartnerList
        if (fArray.length !== 0) {
            fArray.splice(index, 1);
        }
        if (this.nbfcform.PartnerList.length == 0) {
            this.BusinessTypeId = undefined;
            this.nbfcform.BusinessTypeId = null
        }
    }
    getInvalidValidations() {
        const invalidFields = [];

        if (!this.nbfcform.GSTNo || !this.nbfcform.GSTNo.match(/[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[A-Z]{1}[0-9A-Z]{1}/)) {
            invalidFields.push("GST Number");
        }
        if (!this.nbfcform.BusinessPanURL) {
            invalidFields.push("PAN Upload");
        }
        if (!this.nbfcform.GSTDocumentURL) {
            invalidFields.push("Gst Upload");
        }
        if (!this.nbfcform.BusinessContactEmail || !this.nbfcform.BusinessContactEmail.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            invalidFields.push("Business Contact Email");
        }
        if (!this.nbfcform.BusinessContactNo || !this.nbfcform.BusinessContactNo.match(/[0-9]{10}/)) {
            invalidFields.push("Business Contact Number");
        }
        if (!this.nbfcform.BusinessTypeId || !this.BusinessTypeId) {
            invalidFields.push(" Business Type");
        }
        if (!this.nbfcform.BusinessName) {
            invalidFields.push("Business Name is required");
        }
        if (!this.nbfcform.ContactPersonName) {
            invalidFields.push("Contact Person Name is required");
        }
        if (!this.addressform.CityId) {
            invalidFields.push("City is required");
        }
        if (this.nbfcform.isMSME && !this.nbfcform.MSMEDocumentURL) {
            invalidFields.push("MSME Document is required");
        }
        if (!this.nbfcform.PartnerList || this.nbfcform.PartnerList.length === 0) {
            invalidFields.push("At least one Partner is required");
        } else {
            this.nbfcform.PartnerList.forEach((partner: any, index: any) => {
                if (!partner.partnerName) {
                    invalidFields.push(`Partner ${index + 1}: Name is required`);
                }
                if ((!partner.mobileNo || partner.mobileNo) && (!partner.mobileNo.match(/[0-9]{10}/))) {
                    invalidFields.push(`Partner ${index + 1}: Invalid partner Mobile Number`);
                }
            });
        }

        // Display alert for invalid fields
        if (invalidFields.length > 0) {
            // alert();
            this.messageService.add({ severity: 'error', summary: "Invalid Form:\n" + invalidFields.join("\n"), detail: '' });

        }

        // Return true if no invalid fields
        return invalidFields.length === 0;
    }
    back() {
        this.router.navigateByUrl('pages/new-company-master');
    }
    //miscellaneuous

}
