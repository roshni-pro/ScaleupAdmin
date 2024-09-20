import { Component, ElementRef, ViewChild } from '@angular/core';
import { AnchorCompanyService } from '../../services/anchor-company.service';
import { CityService } from 'app/pages/admin/services/city.service';
import { StateService } from 'app/pages/admin/services/state.service';
import { CountryService } from 'app/pages/admin/services/country.service';
import { CommonValidationService } from 'app/shared/services/common-validation.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { AddCompanyProductService } from 'app/pages/admin/company-master/services/add-company-product.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToasterMessageService } from 'app/shared/services/toaster-message.service';
import { LocalStogareService } from 'app/shared/services/local-storage.service';

@Component({
  selector: 'app-main-anchor-company',
  templateUrl: './main-anchor-company.component.html',
  styleUrls: ['./main-anchor-company.component.scss'],
})
export class MainAnchorCompanyComponent {
// financialLiaisonDetails : FinancialLiaisonDetails;
  constructor(
    private companyService: AnchorCompanyService,
    private cityService: CityService,
    private stateService: StateService,
    private countryService: CountryService,
    private commonValidation: CommonValidationService,
    private activatedRoute: ActivatedRoute,
    private toasterService: ToasterMessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private messageService: MessageService,
    private local: LocalStogareService
  ) { 
    
  }

  submitted: boolean = false;
  Loader: boolean = false;
  isMSME: boolean = false;
  Id: any = '';
  isVisible: boolean = false;
  entity: any;
  id: any;
  databaseName: any = 'product';

    financialLiaisonDetails:FinancialLiaisonDetails = {
    FinancialLiaisonFirstName:'',
    FinancialLiaisonLastName:'',
    FinancialLiaisonEmailAddress:'',
    FinancialLiaisonContactNo:'',
  }; 

  companyAddress: CompanyAddressDTO = {
    AddressTypeId: 0,
    AddressLineOne: '',
    ZipCode: null,
    CityId: 0,
    StateId: 0,
    CountryId: 1,
  };

  partnerList: PartnerListDc[] = [
    {
      partnerId: 0,
      partnerName: '',
      mobileNo: '',
    },
  ];
  

//   financialLiaisonDetails : FinancialLiaisonDetails = {
//     FinancialLiaisonFirstName:'',
//     FinancialLiaisonLastName:'',
//     FinancialLiaisonEmailAddress:'',
//     FinancialLiaisonContactNo:'',
//   };
  saveCompany: SaveCompanyAndLocationDTO = {
    CompanyId: 0,
    GSTNo: '',
    PanNo: '',
    BusinessName: '',
    LandingName: '',
    BusinessContactEmail: '',
    BusinessContactNo: '',
    APIKey: '',
    APISecretKey: '',
    AccountType: '',
    LogoURL: '',
    BusinessHelpline: '',
    BusinessTypeId: 0,
    AgreementStartDate: new Date(),
    AgreementEndDate: new Date(),
    AgreementURL: '',
    AgreementDocId: 0,
    CustomerAgreementURL: '',
    CustomerAgreementDocId: 0,
    BusinessPanURL: '',
    BusinessPanDocId: 0,
    WhitelistURL: '',
    CancelChequeURL: '',
    CancelChequeDocId: 0,
    PanURL: '',
    PanDocId: 0,
    BankName: '',
    BankAccountNumber: '',
    BankIFSC: '',
    CompanyType: 'Anchor',
    IsSelfConfiguration: false,
    GSTDocId: 0,
    GSTDocumentURL: '',
    MSMEDocId: 0,
    MSMEDocumentURL: '',
    ContactPersonName: '',
    PartnerList: [],
    CompanyStatus: false,
    CompanyAddress: this.companyAddress,
    AccountHolderName:'',
    BranchName:'',
    FinancialLiaisonDetails:this.financialLiaisonDetails
  };


  @ViewChild('myInput1')
  myInputVariable1!: ElementRef;
  @ViewChild('myInput2')
  myInputVariable2!: ElementRef;
  @ViewChild('myInput3')
  myInputVariable3!: ElementRef;
  @ViewChild('myInput4')
  myInputVariable4!: ElementRef;
  @ViewChild('myInput5')
  myInputVariable5!: ElementRef;
  @ViewChild('myInput6')
  myInputVariable6!: ElementRef;
  @ViewChild('myInput7')
  myInputVariable7!: ElementRef;
  ngOnInit(): void {
    //      this.button = document.getElementById('myButton');

    // // Add event listener
    // button.addEventListener('click', function(event) {
    //     alert('Button clicked!');
    // });
    this.local.set('CompanyType', 'Anchor');

    this.getBusinessType();
    this.getCountry();
    this.getAccountTypeList();
    // this.getstatebyCountryId();
    this.Id = this.activatedRoute.snapshot.paramMap.get('Id');
    localStorage.setItem('companyId', JSON.stringify(this.Id));
    this.entity = 'ProductAnchorCompany';

    if (this.Id != '' && this.Id > 0) {
      // this.pageName = 'Edit'
      this.getcompanyById();
      //this.disableFileds()
    }
    // this.getAddressTypelist();
    this.getProductList();
    this.getProductMasterList();

    console.log(this.saveCompany.CompanyId);
  }

  // ========================================Main api============================================================
  businessTypeList: any[] = [];
  selectedBusinessType: any;
  stateId: number = 0;
  cityId: number = 0;
  pincode: number = 0;
  defCancelChequeURL: any;
  defGSTDocumentURL: any;
  defCustomerAgreementURL: any;
  defMSMEDocumentURL: any;
  defLogoURL: any;
  defBusinessDocumentURL: any;
  defPanURL: any;
  defAgreementURL: any;
  isBankIfscMatch: any;
  saveCompanyAndLocation() {
    debugger
    this.submitted = true;
    // this.saveCompany.PartnerList = this.partnerList;

    if (this.isFormValid()) {
      if (this.Id == null) {
        this.Loader = true;
        this.companyService
          .saveCompanyAndLocationAsync(this.saveCompany)
          .subscribe((x: any) => {
            this.Loader = false;

            this.toasterService.showSuccess(x.message);
            if (x.status) {
              this.router.navigateByUrl('pages/new-company-master');
            }
            console.log(x);
          });
      }
      if (this.Id > 0) {
        this.Loader = true;
        this.saveCompany.CompanyId = Number(this.Id);
        this.companyService
          .updateCompanyAndLocationAsync(this.saveCompany)
          .subscribe((x: any) => {
            // alert(x.message);
            this.toasterService.showSuccess(x.message);

            this.Loader = false;
            this.router.navigateByUrl('pages/new-company-master');

            console.log(x);
          });
      }
      // alert('Form is valid. Saving data...');
    } else {
      // alert('Form invalid. Cannot save data.');
      this.messageService.add({
        severity: 'error',
        summary: 'Form invalid. Cannot save data.',
      });
    }
  }

  // isFormValid(): boolean {
  //   debugger
  //   const isGstValid =
  //     !!this.saveCompany.GSTNo &&
  //     this.saveCompany.GSTNo.match(
  //       /[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[A-Z]{1}[0-9A-Z]{1}/
  //     );
  //   const isPanValid =
  //     !!this.saveCompany.PanNo &&
  //     this.saveCompany.PanNo.match(/[A-Z]{5}[0-9]{4}[A-Z]/);
  //   const isEmailValid =
  //     !!this.saveCompany.BusinessContactEmail &&
  //     this.saveCompany.BusinessContactEmail.match(
  //       /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  //     );
  //   const isContactNoValid =
  //     !!this.saveCompany.BusinessContactNo &&
  //     this.saveCompany.BusinessContactNo.match(/[0-9]{10}/);
  //   const isBusinessNameValid = !!this.saveCompany.BusinessName;
  //   const isContactPersonNameValid = !!this.saveCompany.ContactPersonName;
  //   const isCityValid=!!this.companyAddress.CityId
  //   // const isAPIKey = !!this.saveCompany.APIKey;
  //   // const isAPISecretKey = !!this.saveCompany.APISecretKey;

  //   // const isAccountType = !!this.saveCompany.AccountType;
  //   const isPartnerNameValid = this.saveCompany.PartnerList && this.saveCompany.PartnerList.length>0 && this.saveCompany.PartnerList.every(
  //     // Additional validations for partner name and mobile number
  //     (partner) => !!partner.partnerName
  //   );
  //   const isMobileNoValid = this.saveCompany.PartnerList && this.saveCompany.PartnerList.length>0 &&   this.saveCompany.PartnerList.every(
  //     (partner) => !!partner.mobileNo && partner.mobileNo.match(/[0-9]{10}/)
  //   );
  //   // const ispartnerRow=!!this.partnerRow

  //   // Return true if all validations pass
  //   return !!(
  //     isGstValid &&
  //     isPanValid &&
  //     isEmailValid &&
  //     isContactNoValid &&
  //     isBusinessNameValid &&
  //     isContactPersonNameValid &&
  //     isCityValid &&
  //     // isAPIKey &&
  //     // isAPISecretKey &&
  //     // isAccountType &&
  //     isPartnerNameValid &&
  //     isMobileNoValid
  //     // && ispartnerRow

  //     //&& isBankAccountNumber
  //   );
  // }
  isFormValid(): boolean {
    debugger;
    const invalidFields = [];

    if (
      !this.saveCompany.GSTNo ||
      !this.saveCompany.GSTNo.match(
        /[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[A-Z]{1}[0-9A-Z]{1}/
      )
    ) {
      invalidFields.push('Invalid GST Number');
    }
    if (
      !this.saveCompany.PanNo ||
      !this.saveCompany.PanNo.match(/[A-Z]{5}[0-9]{4}[A-Z]/)
    ) {
      invalidFields.push('Invalid PAN Number');
    }
    if (
      !this.saveCompany.BusinessContactEmail ||
      !this.saveCompany.BusinessContactEmail.match(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      )
    ) {
      invalidFields.push('Invalid Business Contact Email');
    }
    if (
      !this.saveCompany.BusinessContactNo ||
      !this.saveCompany.BusinessContactNo.match(/[0-9]{10}/)
    ) {
      invalidFields.push('Invalid Business Contact Number');
    }
    if (!this.saveCompany.BusinessName) {
      invalidFields.push('Business Name is required');
    }
    if (!this.saveCompany.ContactPersonName) {
      invalidFields.push('Contact Person Name is required');
    }
    if (!this.companyAddress.CityId) {
      invalidFields.push('City is required');
    }
    if (
      !this.saveCompany.PartnerList ||
      this.saveCompany.PartnerList.length === 0
    ) {
      invalidFields.push('At least one Partner is required');
    } else {
      this.saveCompany.PartnerList.forEach((partner, index) => {
        if (!partner.partnerName) {
          invalidFields.push(`Partner ${index + 1}: Name is required`);
        }
        if (!partner.mobileNo || !partner.mobileNo.match(/[0-9]{10}/)) {
          invalidFields.push(`Partner ${index + 1}: Invalid Mobile Number`);
        }
      });
    }

    // Display alert for invalid fields
    if (invalidFields.length > 0) {
      alert('Invalid Form:\n' + invalidFields.join('\n'));
    }

    // Return true if no invalid fields
    return invalidFields.length === 0;
  }

  getcompanyById() {
    debugger;
    this.Loader = true;
    this.companyService.getCompanyById(this.Id).subscribe((res: any) => {
      console.log(res);
      // this.saveCompany.CompanyId = res.response.companyId;

      this.saveCompany.BusinessName = res.response.businessName;
      this.saveCompany.GSTNo = res.response.gstNo;
      this.saveCompany.PanNo = res.response.panNo;

      if (
        res &&
        res.response.companyAddress &&
        res.response.companyAddress.length > 0
      ) {
        this.companyAddress.AddressLineOne =
          res.response.companyAddress[0].addressLineOne;
        this.companyAddress.AddressLineTwo =
          res.response.companyAddress[0].addressLineTwo;
        this.companyAddress.ZipCode = res.response.companyAddress[0].zipCode;
        this.companyAddress.StateId = res.response.companyAddress[0].stateId;
        if (res.response.companyAddress[0].cityId) {
          this.getCitiesbyStateId(this.companyAddress.StateId);
          this.companyAddress.CityId = res.response.companyAddress[0].cityId;
        }
      }
      if(res.response.financialLiaisonDetails != null){        
          this.saveCompany.FinancialLiaisonDetails.FinancialLiaisonContactNo = res.response.financialLiaisonDetails.financialLiaisonContactNo
          this.saveCompany.FinancialLiaisonDetails.FinancialLiaisonEmailAddress = res.response.financialLiaisonDetails.financialLiaisonEmailAddress
          this.saveCompany.FinancialLiaisonDetails.FinancialLiaisonFirstName = res.response.financialLiaisonDetails.financialLiaisonFirstName
          this.saveCompany.FinancialLiaisonDetails.FinancialLiaisonLastName = res.response.financialLiaisonDetails.financialLiaisonLastName
      }
      this.saveCompany.PanURL = res.response.panURL;
      this.saveCompany.AccountHolderName = res.response.accountHolderName;
      this.saveCompany.BranchName = res.response.branchName;

      this.saveCompany.APIKey = res.response.apiKey;
      this.saveCompany.APISecretKey = res.response.apiSecretKey;
      this.saveCompany.LandingName = res.response.landingName;

      this.saveCompany.ContactPersonName = res.response.contactPersonName;
      this.saveCompany.LogoURL = res.response.logoURL;
      this.saveCompany.BusinessHelpline = res.response.businessHelpline;

      this.saveCompany.BusinessTypeId = res.response.businessTypeId;
      this.saveCompany.BusinessContactEmail = res.response.businessContactEmail;
      this.saveCompany.BusinessContactNo = res.response.businessContactNo;
      this.saveCompany.CompanyType = res.response.companyType;
      this.saveCompany.WhitelistURL = res.response.whitelistURL;

      this.saveCompany.AgreementStartDate = new Date();


      this.saveCompany.AgreementEndDate = new Date();

      this.saveCompany.CustomerAgreementURL = res.response.customerAgreementURL;
      this.saveCompany.CustomerAgreementDocId =
        res.response.customerAgreementDocId;

      this.saveCompany.AgreementURL = res.response.agreementURL;
      this.saveCompany.CustomerAgreementDocId = res.response.agreementDocId;

      this.saveCompany.BusinessPanURL = res.response.businessPanURL;

      this.saveCompany.GSTDocId = res.response.gstDocId;
      this.saveCompany.GSTDocumentURL = res.response.gstDocumentURL;

      this.saveCompany.MSMEDocId = res.response.msmeDocId;
      if (this.saveCompany.MSMEDocumentURL != null) {
        this.saveCompany.MSMEDocumentURL = res.response.msmeDocumentURL;
        this.isMSME = true;
      }
      this.saveCompany.CancelChequeDocId = res.response.cancelChequeDocId;
      this.saveCompany.CancelChequeURL = res.response.cancelChequeURL;
      this.saveCompany.BankName = res.response.bankName;
      this.saveCompany.BankAccountNumber = res.response.bankAccountNumber;
      this.saveCompany.CompanyStatus = res.response.companyStatus;

      this.saveCompany.BankIFSC = res.response.bankIFSC;
      this.saveCompany.PartnerList = res.response.partnerList;
      this.saveCompany.AccountType = res.response.accountType;
      this.defMSMEDocumentURL = res.response.msmeDocumentURL?.includes('pdf')
        ? '../../../../../assets/img/pdflogo.png'
        : null;
      this.defGSTDocumentURL = res.response.gstDocumentURL?.includes('pdf')
        ? '../../../../../assets/img/pdflogo.png'
        : null;
      this.defCancelChequeURL = res.response.cancelChequeURL?.includes('pdf')
        ? '../../../../../assets/img/pdflogo.png'
        : null;
      this.defCustomerAgreementURL =
        res.response.customerAgreementURL?.includes('pdf')
          ? '../../../../../assets/img/pdflogo.png'
          : null;
    });
  }
  isgstExist: boolean = false;
  isGstVerified: boolean = false;
  disabledBusinessName: boolean = true;
  back() {
    this.router.navigateByUrl('pages/new-company-master');
  }
  getdatabyGstNo(GSTNo: string) {
    this.isGstVerified = false;

    if (GSTNo.length == 15) {
      this.Loader = true;
      this.companyService.checkCompanyGSTExist(GSTNo).subscribe((x: any) => {
        this.isgstExist = x.status;
        if (!this.isgstExist) {
          this.companyService.getGstInfoNew(GSTNo).subscribe((res: any) => {
            console.log(res);
            this.Loader = false;
            if (res.status == true) {
              this.disabledBusinessName = true;
              this.isGstVerified = true;

              this.saveCompany.BusinessName = res.name;
              this.getAddressbyGstNO();

              // alert(res.message);
              this.toasterService.showSuccess(res.message);
            } else {
              this.Loader = false;
              this.saveCompany.GSTNo = '';
              this.toasterService.showError(res.message);

            }
          });
        } else {
          this.Loader = false;
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


  generatingApiKey() {
    if (this.Id != '' && this.Id > 0) {
      return;
    } else {
      this.Loader = true;
      this.companyService.generateApiKey().subscribe((res) => {
        this.Loader = false;
        console.log('APIkey', res);
        if (res) {
          this.saveCompany.APIKey = res.apiKey;
          this.saveCompany.APISecretKey = res.apiSecret;
        }
      });
    }
  }

  getBusinessType() {
    this.Loader = true;
    this.companyService
      .getBusinessTypeMasterList('Anchor')
      .subscribe((gettype: any) => {
        console.log('gettype', gettype);
        this.Loader = false;
        this.businessTypeList = gettype.returnObject;
        //  this.checkValue(this.Id);
      });
  }

  isGstCityVerified: boolean = false;
  disableZipCodeField: boolean = false;
  disableAddressLineOne: boolean = false;
  disableState: boolean = false;
  disableCity: boolean = false;
  async getAddressbyGstNO() {
    this.disableCity = false;
    try {
      this.Loader = true;
      const res: any = await this.companyService
        .getGstInfoNew(this.saveCompany.GSTNo)
        .toPromise();
      this.Loader = false;
      console.log('GetGSTDetail-', res);
      if (res.status == true) {
        // alert(res.message);
        this.companyAddress.AddressLineOne = res.addressLine1;
        this.disableAddressLineOne = true;

        // Find state by name (case-insensitive)
        const stateData = this.stateList.find(
          (x: any) => x.name.toLowerCase() == res.state.toLowerCase()
        );
        this.companyAddress.StateId = stateData ? stateData.id : null;
        this.disableState = true;

        if (!this.companyAddress.StateId) {
          await this.getstatebyCountryId(this.companyAddress.CountryId);
        }

        // Retrieve cities by state ID
        await this.getCitiesbyStateId(this.companyAddress.StateId);

        // Find city by name (case-insensitive)
        const cityData = this.citylist.find(
          (x: any) => x.name.toLowerCase() == res.city.toLowerCase()
        );
        this.companyAddress.CityId = cityData ? cityData.id : null;

        if (cityData != null) {
          this.disableCity = true;
          console.log(cityData);
        }

        if (!this.companyAddress.CityId) {
          await this.getCitiesbyStateId(this.companyAddress.StateId); //state Id
        }

        this.companyAddress.ZipCode = res.zipcode;
        this.disableZipCodeField = true;
        this.saveCompany.BusinessName = res.name;
      } else {
        this.saveCompany.GSTNo = '';
        // alert(res.message);
        this.messageService.add({
          severity: 'error',
          summary: res.message,
          detail: '',
        });
      }
    } catch (error) {
      // alert(error.error);
      // console.log(error.error);
      this.Loader = false;
    }
  }

  // =========================================Helping Api============================================================
  countryList: any[] = [];
  stateList: any[] = [];
  citylist: any[] = [];
  countryId: number = 1;
  selectedState: any;
  accountTypelist: any[] = [];
  getAccountTypeList() {
    this.accountTypelist = [
      { label: 'Saving Account', value: 'savings' },
      { label: 'Current Account', value: 'current' },
      // Add more objects as needed
    ];
  }
  getCountry() {
    this.Loader = true;
    this.countryService.getCountryList().subscribe((res: any) => {
      console.log(res.returnObject);
      this.Loader = false;
      this.countryList = res.returnObject;
      this.countryId = 1;
      this.getstatebyCountryId(this.countryId);
    });
  }

  async getstatebyCountryId(countryid: number) {
    try {
      this.Loader = true;
      const res: any = await this.stateService
        .getStateByCountryId(countryid)
        .toPromise();
      console.log('stateList', res.returnObject);
      this.Loader = false;
      this.stateList = res.returnObject;
    } catch (error) {
      console.error(error);
      this.Loader = false;
      throw error; // Rethrow the error for handling in the calling code
    }
  }

  async getCitiesbyStateId(stateid: any) {
    try {
      this.Loader = true;
      const res: any = await this.cityService
        .getCityByStateId(stateid)
        .toPromise();
      console.log('cityList', res);
      this.Loader = false;
      this.citylist = res;
    } catch (error) {
      console.error(error);
      this.Loader = false;
      throw error; // Rethrow the error for handling in the calling code
    }
  }

  // ========================================Helping Methods=========================================================

  labelforBusiness: any;
  dynamicRows: any[] = [];

  getType(event: any) {
    // let fArray = <FormArray>this.anchorForm.controls['PartnerList'];
    // while (fArray.length !== 0) {
    //   fArray.removeAt(0)
    // }
    this.saveCompany.PartnerList = [];
    if (event == 3 || event == 2) {
      this.labelforBusiness = 'Partner';
    } else if (event == 1) {
      this.labelforBusiness = 'Proprietor';

      // this.dynamicRows.splice(0, this.dynamicRows.length);
      // this.addRow();
    } else if (event == 6) {
      this.labelforBusiness = 'Karta';
    } else {
      this.labelforBusiness = 'Director';
    }
    this.addRow();
  }
  partnerRow: boolean = false;
  addRow() {
    this.partnerRow = true;
    const allFieldsFilled = this.saveCompany.PartnerList.every(
      (row) => row.partnerName && row.mobileNo && row.mobileNo.length === 10
    );

    if (allFieldsFilled) {
      this.saveCompany.PartnerList.push({
        partnerName: '',
        mobileNo: '',
        partnerId: 0,
      });
    } else {
      // alert(
      //   'Please fill all partner name and mobile number fields before adding a new row.'
      // );
      this.messageService.add({
        severity: 'error',
        summary:
          'Please fill all partner name and mobile number fields before adding a new row.',
      });
    }
  }

  removeRow(index: number) {
    this.saveCompany.PartnerList.splice(index, 1);
  }
  file: any;
  imagePath: any;
  upload(file: any, imgUploadType: string, event?: any) {
    // debugger
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
          this.toasterService.showSuccess('image uploaded successfully');
          this.uploadFile(imgUploadType);
        };
      } else {
        // alert('Select Image size less than 6MB!!!');
        this.toasterService.showSuccess('Select Image size less than 6MB!!!');

        event.nativeElement.value = '';
      }
    } else {
      // alert('Choose different file format!');
      this.toasterService.showSuccess('Choose different file format!');

      event.nativeElement.value = '';
      file.preventDefault();
    }
  }

  uploadFile(imgUploadType: any) {
    const formData = new FormData();
    formData.append('FileDetails', this.file[0]);
    formData.append('IsValidForLifeTime', 'true');
    formData.append('ValidityInDays', '');
    formData.append('SubFolderName', '');
    this.Loader = true;
    this.companyService.postSingleFile(formData).subscribe((res: any) => {
      console.log('Uploaded File-', res);
      this.Loader = false;
      if (res.status) {
        this.toasterService.showSuccess(res.message);
        if (imgUploadType == 'LogoURL') {
          this.defLogoURL = res.filePath.includes('pdf')
            ? '../../../../../assets/img/pdflogo.png'
            : null;

          this.saveCompany.LogoURL = res.filePath;
        }
        if (imgUploadType == 'GSTDocumentURL') {
          this.defGSTDocumentURL = res.filePath.includes('pdf')
            ? '../../../../../assets/img/pdflogo.png'
            : null;
          this.saveCompany.GSTDocumentURL = res.filePath;
          this.saveCompany.GSTDocId = res.docId;
        }
        if (imgUploadType == 'MSMEDocumentURL') {
          this.defMSMEDocumentURL = res.filePath.includes('pdf')
            ? '../../../../../assets/img/pdflogo.png'
            : null;
          this.saveCompany.MSMEDocumentURL = res.filePath;
          this.saveCompany.MSMEDocId = res.docId;
        }
        if (imgUploadType == 'CancelChequeURL') {
          this.defCancelChequeURL = res.filePath.includes('pdf')
            ? '../../../../../assets/img/pdflogo.png'
            : null;
          this.saveCompany.CancelChequeURL = res.filePath;
          this.saveCompany.CancelChequeDocId = res.docId;
        }

        if (imgUploadType == 'BusinessPanURL') {
          this.defBusinessDocumentURL = res.filePath.includes('pdf')
            ? '../../../../../assets/img/pdflogo.png'
            : null;
          this.saveCompany.BusinessPanURL = res.filePath;
          this.saveCompany.BusinessPanDocId = res.docId;
        }
        if (imgUploadType == 'PanURL') {
          this.defPanURL = res.filePath.includes('pdf')
            ? '../../../../../assets/img/pdflogo.png'
            : null;
          this.saveCompany.PanURL = res.filePath;
          this.saveCompany.PanDocId = res.docId;
        }
        if (imgUploadType == 'AgreementURL') {
          this.defAgreementURL = res.filePath.includes('pdf')
            ? '../../../../../assets/img/pdflogo.png'
            : null;
          this.saveCompany.AgreementURL = res.filePath;
          this.saveCompany.AgreementDocId = res.docId;
        }
        if (imgUploadType == 'CustomerAgreementURL') {
          this.defCustomerAgreementURL = res.filePath.includes('pdf')
            ? '../../../../../assets/img/pdflogo.png'
            : null;
          this.saveCompany.CustomerAgreementURL = res.filePath;
          this.saveCompany.CustomerAgreementDocId = res.docId;
        }
      }
    });
  }

  // ============================================product api============================================================
  productList: any[] = [];
  savedproductList: any[] = [];
  isCreditConfig: any;
  productDisplay: boolean = false;
  showCreditLine: boolean = false;
  showBusinessLoan: boolean = false;
  addCreditLoan: boolean = false;
  addBuisnessLoan: boolean = false;
  selectedProduct: any;
  productId: any;
  anchorProductId: any;
  onClickEdit(item: any) {
    this.selectedProduct = {};
    debugger;
    this.productDisplay = true;
    this.productId = item.productId;
    this.anchorProductId = item.id;
    this.showBusinessLoan = false;
    this.showCreditLine = false;

    if (item.productType == 'BusinessLoan') {
      this.showBusinessLoan = true;
      this.showCreditLine = false;
      this.selectedProduct.type = item.productType;
    }

    if (item.productType == 'CreditLine') {
      this.showCreditLine = true;
      this.showBusinessLoan = false;
      this.selectedProduct.type = item.productType;
    }
  }

  close() {
    if (this.selectedProduct) {
      this.selectedProduct.type = 'something';
    }
  }

  ActiveInactive(status: any, IsActive: boolean) {
    debugger;
    // this.Id = companyId;

    if (IsActive == true) {
      var activeData = 'Active';
    } else {
      activeData = 'InActive';
    }
    this.confirmationService.confirm({
      message:
        'Are you sure want to' + ' ' + activeData + ' ' + 'this confirmation?',
      accept: () => {
        this.Loader = true;
        this.companyService
          .AnchorProductActiveInactive(status.id, IsActive)
          .subscribe((res: any) => {
            console.log(res);
            this.Loader = false;
            // alert(res.message);
            this.toasterService.showSuccess(res.message);
          });
      },
      reject: () => {
        IsActive = !IsActive;
        status.IsActive = IsActive;
        // alert('Action canceled.');
        this.toasterService.showSuccess('Action canceled.');
      },
    });
  }

  onHistoryClick(id: any) {
    this.id = id;
    this.isVisible = true;
  }
  getProductList() {
    debugger;
    this.Loader = true;
    this.companyService.GetAnchorProductList(this.Id).subscribe((res: any) => {
      console.log(res);
      this.Loader = false;
      this.savedproductList = res.returnObject;
    });
  }

  onClickAdd() {
    debugger;
    this.productDisplay = true;
    this.anchorProductId = null;
    this.selectedProduct = null;
    this.showBusinessLoan = false;
    this.showCreditLine = false;
    this.getProductMasterList();
  }
  onProductChange() {
    this.productId = this.selectedProduct.id;
  }

  getProductMasterList() {
    this.Loader = true;
    this.companyService
      .GetProductMasterList(this.Id, this.saveCompany.CompanyType)
      .subscribe((res: any) => {
        console.log(res);
        this.Loader = false;
        this.productList = res.returnObject;
        console.log('this.productList', this.productList);
      });
  }

  onbusinessloanSubmit() {
    this.productDisplay = false;
    this.getProductList();
  }
  onCreditLineSubmit() {
    this.productDisplay = false;
    this.getProductList();
  }

  // ========================================Miscellanous============================================================

  showImage: boolean = false;
  showUrl: string = '';
  isLogoURL: boolean = false;
  isGSTDocumentURL: boolean = false;
  isMSMEDocumentURL: boolean = false;
  isCancelChequeURL: boolean = false;
  isBusinessPanURL: boolean = false;
  isPanURL: boolean = false;
  isCustomerAgreementURL: boolean = false;
  isAgreementURL: boolean = false;

  dialogData: any = {
    GSTRate: 0,
    // 'ConvenienceFee':0,
    ProcessingFee: 0,
    penaltyCharges: 0,
    BounceCharges: 0,
    // 'ProcessingCreditDays':0,
    // 'CreditDays':0
  };
  visible: boolean = false;
  pattern: RegExp =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
  panPattern: RegExp = /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/;

  dialogUrl: any;
  show(input: string) {
    this.showImage = true;
    if (
      input.includes('jgeg') ||
      input.includes('png') ||
      input.includes('jpg')
    ) {
      this.showUrl = input;
    } else {
      this.dialogUrl = '../../../../../assets/img/pdflogo.png';
      this.showUrl = input;
    }
  }
  download(value: any) {
    window.open(value);
  }
  confirmOrCancelStatusChange(event: any) {
    const newStatus = event.target.checked;
    if (confirm('Are you sure you want to change the status?')) {
      // If the user confirms the change, proceed with the action
      this.activeInactiveStatus(newStatus);
    } else {
      // If the user cancels the confirmation, revert the ngModel to its previous value
      event.preventDefault(); // Prevent the change from occurring
      // Optionally, you can handle any other logic here based on user cancelation
    }
  }
  activeInactiveStatus(newStatus: boolean) {
    if (newStatus) {
      // If the new status is true (active), you might perform actions such as activating the company
      console.log('Company is now active');
      // Perform other actions related to activating the company
    } else {
      // If the new status is false (inactive), you might perform actions such as deactivating the company
      console.log('Company is now inactive');
      // Perform other actions related to deactivating the company
    }
  }
  removeImage(str: any) {
    if (str == 'GSTDocumentURL') {
      this.isGSTDocumentURL = true;
      this.saveCompany.GSTDocumentURL = '';
      this.saveCompany.GSTDocId = undefined;
    }
    if (str == 'MSMEDocumentURL') {
      this.isMSMEDocumentURL = true;
      this.saveCompany.MSMEDocumentURL = '';
      this.saveCompany.MSMEDocId = undefined;
    }

    if (str == 'LogoURL') {
      this.isLogoURL = true;
      this.saveCompany.LogoURL = '';
    }
    if (str == 'CancelChequeURL') {
      this.isCancelChequeURL = true;
      this.saveCompany.CancelChequeURL = '';
      this.saveCompany.CancelChequeDocId = undefined;
    }
    if (str == 'BusinessPanURL') {
      this.isBusinessPanURL = true;
      this.saveCompany.BusinessPanURL = '';
      this.saveCompany.BusinessPanDocId = undefined;
    }
    if (str == 'PanURL') {
      this.isPanURL = true;
      this.saveCompany.PanURL = '';
      this.saveCompany.PanDocId = undefined;
    }
    if (str == 'CustomerAgreementURL') {
      this.isCustomerAgreementURL = true;
      this.saveCompany.CustomerAgreementURL = '';
      this.saveCompany.CustomerAgreementDocId = undefined;
    }
    if (str == 'AgreementURL') {
      this.isAgreementURL = true;
      this.saveCompany.AgreementURL = '';
      this.saveCompany.AgreementDocId = undefined;
    }
  }
  checkBankIFSCPattern(inputElement: any) {
    debugger;
    if (this.saveCompany.BankIFSC) {
      this.saveCompany.BankIFSC.toUpperCase();
      var inputValue = inputElement.value;

      // Define the regular expression pattern
      var pattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;

      // Check if the input matches the pattern
      if (pattern.test(inputValue)) {
        // Input is valid
        inputElement.setCustomValidity(''); // Clear any previous validation error
      } else {
        // Input is invalid
        inputElement.setCustomValidity('Invalid Bank IFSC format'); // Set custom validation error message
      }
    }

    // this.pattern =
    //   /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
  }
  checkGstPattern(GSTNo: any) {
    this.saveCompany.GSTNo = this.saveCompany.GSTNo.toUpperCase();
    this.pattern =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[A-Z]{1}[0-9A-Z]{1}$/;
    this.getdatabyGstNo(GSTNo);
  }
  checkPanPattern() {
    if (this.saveCompany.PanNo) {
      this.saveCompany.PanNo = this.saveCompany.PanNo.toUpperCase();
    }
    // ?this.saveCompany.PanNo.toUpperCase():this.saveCompany.PanNo

    this.panPattern = /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/;
  }

  viewDialog(item: any) {
    debugger;

    console.log('item', item);

    this.dialogData = item;
    this.visible = true;
  }
  alphaNumberOnly(e: any) {
    // Accept only alpha numerics, not special characters
    var res = this.commonValidation.AlphabetNumberOnly(e);
  }

  onPaste(e: any) {
    var res = this.commonValidation.onPaste(e);
  }
  keyPress(e: any) {
    var res = this.commonValidation.keyPress(e);
  }
  space(e: any) {
    var res = this.commonValidation.space(e);
  }
  NumberOnly(e: any) {
    // Accept only alpha numerics, not special characters
    var res = this.commonValidation.numberOnly(e);
  }
}

interface SaveCompanyAndLocationDTO {
  CompanyId?: number | null;
  GSTNo: string;
  PanNo?: string;
  BusinessName: string;
  LandingName?: string;
  BusinessContactEmail: string;
  BusinessContactNo: string;
  APIKey?: string;
  APISecretKey?: string;
  LogoURL?: string;
  BusinessHelpline?: string;
  BusinessTypeId: number;
  AgreementStartDate?: Date;
  AgreementEndDate?: Date;
  AgreementURL?: string;
  AgreementDocId?: number;
  CustomerAgreementURL?: string;
  CustomerAgreementDocId?: number;
  BusinessPanURL?: string;
  BusinessPanDocId?: number;
  WhitelistURL?: string;
  CancelChequeURL?: string;
  CancelChequeDocId?: number;
  BankName?: string;
  BankAccountNumber?: string;
  BankIFSC?: string;
  CompanyType: string;
  IsSelfConfiguration?: boolean;
  GSTDocId?: number;
  GSTDocumentURL?: string;
  MSMEDocId?: number;
  MSMEDocumentURL?: string;
  ContactPersonName?: string;
  PartnerList: PartnerListDc[];
  CompanyAddress: CompanyAddressDTO | null;
  AccountType: string;
  PanDocId?: number;
  PanURL?: string;
  CompanyStatus: boolean;
  AccountHolderName:string;
  BranchName:string;
  FinancialLiaisonDetails:FinancialLiaisonDetails;
}

export interface CompanyAddressDTO {
  AddressTypeId: number;
  AddressLineOne: string;
  AddressLineTwo?: string;
  AddressLineThree?: string;
  ZipCode: number | null;
  CityId: number | null;
  StateId: number | null;
  CountryId: number;
}

export interface PartnerListDc {
  partnerId: number;
  partnerName: string;
  mobileNo: string;
}
 interface FinancialLiaisonDetails{
    FinancialLiaisonFirstName:string,
    FinancialLiaisonLastName:string,
    FinancialLiaisonEmailAddress:string,
    FinancialLiaisonContactNo:string,
}


























