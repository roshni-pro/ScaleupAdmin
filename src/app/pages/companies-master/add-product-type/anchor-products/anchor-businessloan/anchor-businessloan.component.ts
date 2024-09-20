import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AddAnchorProductService } from 'app/pages/companies-master/services/add-anchor-product.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-anchor-businessloan',
  templateUrl: './anchor-businessloan.component.html',
  styleUrls: ['./anchor-businessloan.component.scss'],
})
export class AnchorBusinessloanComponent {
  @Input() companyId: any = '';
  @Input() companyType: string = '';
  @Input() creditConfig: boolean = false;
  @Input() productId: any = '';
  @Input() pageName: string = '';
  @Input() anchorProductId: any = '';
  Id: any;
  Id2: any;
  CompanyType: any;
  productList: any;
  isCreditConfig: boolean = false;
  selectedProduct: any;
  submitted: boolean = false;
  // pageName: any = '';
  Loader: boolean = false;
  creditDays: any = [];
  selectedEditProduct: any = {
    id: 0,
    type: '',
  };
  anchorForm!: FormGroup;
  selectedcreditDays: any;
  EmiOptions: any = [];
  // anchorProductId: any;
  params: any;
  @Input() product: any;
  productname: string = '';
  anchorvalue: any;
  currentdate: any = new Date();
  GSTRate: any;
  value: any;
  disableDate: boolean = false;
  @Output() onFormSubmit: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('userPhoto1')
  myInputVariable1!: ElementRef;
  constructor(
    private router: Router,
    private productService: AddAnchorProductService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    // private company: CompanyMasterService,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {
    // debugger

    this.currentdate = this.datePipe.transform(this.currentdate, 'yyyy-MM-dd');

    this.anchorForm = this.formBuilder.group({
      Id: [this.anchorProductId > 0 ? this.anchorProductId : null],
      CompanyId: [null],

      ConvenienceFee: [null],
      // ProcessingFee:["", Validators.required] ,
      DelayPenaltyFee: [null],
      BounceCharge: [null, Validators.required],
      ProcessingCreditDays: [null],
      CreditDays: [null], //CreditLine
      ProductId: [null, Validators.required],
      ProductName: ['', Validators.required],
      ProcessingFeePayableBy: ['', Validators.required],

      ProcessingFeeType: ['', Validators.required],
      ProcessingFeeRate: [null, Validators.required],
      AnnualInterestPayableBy: [''], //CreditLine
      // TransactionFeeType: [''], //CreditLine
      // TransactionFeeRate: [null], //CreditLine
      DelayPenaltyRate: [null, Validators.required],
      DisbursementTAT: [null, Validators.required], //CreditLine
      AnnualInterestRate: [null, Validators.required], //BusinessLoan

      MinTenureInMonth: [
        null,
        [Validators.required, Validators.maxLength(3), Validators.min(0)],
      ],
      MaxTenureInMonth: [
        null,
        [Validators.required, Validators.maxLength(3), Validators.min(0)],
      ],
      CompanyEMIOptions: [[]],
      CompanyCreditDays: [[]],
      CustomCreditDays: [null],
      OfferMaxRate: [null, Validators.required],

      CommissionPayout: [null, Validators.required], //BusinessLoan
      ConsiderationFee: [null, Validators.required], //BusinessLoan
      DisbursementSharingCommission: [null, Validators.required], //BusinessLoan
      MinLoanAmount: [null, Validators.required], //BusinessLoan
      MaxLoanAmount: [null, Validators.required], //BusinessLoan

      EMIRate: [null], //CreditLine
      EMIProcessingFeeRate: [null], //CreditLine
      EMIBounceCharge: [null], //CreditLine
      EMIPenaltyRate: [null], //CreditLine

      isEmi: ['No'], //bool emi option
      AgreementURL: [null, Validators.required], //for both
      AgreementStartDate: [null, Validators.required], //for both
      AgreementEndDate: [null, Validators.required], //for both
      AgreementDocId: [0], //for both
      BlackSoilReferralCode: ['', Validators.maxLength(100)],
      MaxInterestRate: [null, Validators.required],
      IseSignEnable: [false], // Initialize with default value as a boolean
      PlatFormFee: [null, Validators.required],
    });
  }

  async ngOnInit() {
    debugger;
    
    this.currentdate = this.datePipe.transform(this.currentdate, 'yyyy-MM-dd');

    const companyId = localStorage.getItem('companyId');
    if (companyId !== null) {
      this.Id = JSON.parse(companyId);
      console.log('companyid', this.Id);
    }

    this.setamountpercentagetype();

    this.getGstRate();
    // debugger
    this.GetAnchorProductConfig();
  }

  setamountpercentagetype() {
    if (this.anchorForm.controls['ProcessingFeeType'].value == 'Amount') {
      this.value = 'amount';
    } else {
      this.value = '%';
    }
  }
  getGstRate() {
    this.productService.getGstRate().subscribe((res: any) => {
      console.log(res);
      this.GSTRate = res.returnObject;
    });
  }

  get f() {
    return this.anchorForm.controls;
  }

  space(event: any) {
    // debugger
    console.log(this.anchorForm);
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }
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

  GetAnchorProductConfig() {
    debugger;
    this.Loader = true;
    this.productService
      .GetAnchorProductConfig(this.Id, this.productId)
      .subscribe((res: any) => {
        // debugger
        this.Loader = false;

        console.log(res);
        var anchorvalue = res.returnObject[0];
        this.anchorvalue = res.returnObject[0];
        this.anchorForm.controls['ProcessingFeeRate'].patchValue(
          anchorvalue.processingFeeRate
        );
        this.anchorForm.controls['ProcessingFeeType'].patchValue(
          anchorvalue.processingFeeType
        );
        this.anchorForm.controls['ProcessingFeePayableBy'].patchValue(
          anchorvalue.processingFeePayableBy
        );
        this.anchorForm.controls['BounceCharge'].patchValue(
          anchorvalue.bounceCharge
        );
        this.anchorForm.controls['DelayPenaltyRate'].patchValue(
          anchorvalue.delayPenaltyRate
        );
        this.anchorForm.controls['DisbursementTAT'].patchValue(
          anchorvalue.disbursementTAT
        );
        this.anchorForm.controls['AnnualInterestRate'].patchValue(
          anchorvalue.annualInterestRate
        );
        this.anchorForm.controls['AgreementStartDate'].patchValue(
          this.datePipe.transform(anchorvalue.agreementStartDate, 'yyyy-MM-dd')
        );
        this.anchorForm.controls['AgreementEndDate'].patchValue(
          this.datePipe.transform(anchorvalue.agreementEndDate, 'yyyy-MM-dd')
        );
        this.anchorForm.controls['AgreementURL'].patchValue(
          anchorvalue.agreementURL
        );

        this.anchorForm.controls['AnnualInterestPayableBy'].patchValue(
          anchorvalue.transactionFeePayableBy
        );

        this.anchorForm.controls['ConsiderationFee'].patchValue(
          anchorvalue.considerationFee
        );
        this.anchorForm.controls['CommissionPayout'].patchValue(
          anchorvalue.commissionPayout
        );

        this.anchorForm.controls['DisbursementSharingCommission'].patchValue(
          anchorvalue.disbursementSharingCommission
        );
        this.anchorForm.controls['OfferMaxRate'].patchValue(
          anchorvalue.offerMaxRate
        );

        this.anchorForm.controls['MaxLoanAmount'].patchValue(
          anchorvalue.maxLoanAmount
        );

        this.anchorForm.controls['MinLoanAmount'].patchValue(
          anchorvalue.minLoanAmount
        );
        this.anchorForm.controls['MinTenureInMonth'].patchValue(
          anchorvalue.minTenureInMonth
        );
        this.anchorForm.controls['MaxTenureInMonth'].patchValue(
          anchorvalue.maxTenureInMonth
        );
        this.anchorForm.controls['BlackSoilReferralCode'].patchValue(
          anchorvalue.blackSoilReferralCode
        );
        this.anchorForm.controls['IseSignEnable'].patchValue(anchorvalue.iseSignEnable);
        this.anchorForm.controls['MaxInterestRate'].patchValue(
          anchorvalue.maxInterestRate
        );
        this.anchorForm.controls['PlatFormFee'].patchValue(
          anchorvalue.platFormFee
        );

        this.productname = res.returnObject[0].productName;
        if (
          this.currentdate < this.anchorForm.controls['AgreementEndDate'].value
        ) {
          this.disableDate = true;
        }
        this.disableData();
      });
  }
  disableData() {
    debugger;
    if (this.disableDate) {
      this.anchorForm.controls['CommissionPayout'].disable();
      this.anchorForm.controls['ConsiderationFee'].disable();
      this.anchorForm.controls['DisbursementSharingCommission'].disable();

      this.anchorForm.controls['ProcessingFeeType'].disable();

      this.anchorForm.controls['ProcessingFeePayableBy'].disable();
      this.anchorForm.controls['ProcessingFeeRate'].disable();
      this.anchorForm.controls['AnnualInterestPayableBy'].disable();
      this.anchorForm.controls['AnnualInterestRate'].disable();
      this.anchorForm.controls['OfferMaxRate'].disable();
      this.anchorForm.controls['MinTenureInMonth'].disable();
      this.anchorForm.controls['MaxTenureInMonth'].disable();
      this.anchorForm.controls['MaxLoanAmount'].disable();
      this.anchorForm.controls['MinLoanAmount'].disable();

      this.anchorForm.controls['AgreementStartDate'].disable();

      this.anchorForm.controls['AgreementEndDate'].disable();
      this.anchorForm.controls['isEmi'].disable();
    }
  }

  enableData() {

    console.log('this.anchorvalue', this.anchorvalue);
    if (this.anchorvalue) {
      this.anchorForm.controls['CommissionPayout'].enable();
      this.anchorForm.controls['ConsiderationFee'].enable();
      this.anchorForm.controls['DisbursementSharingCommission'].enable();
      this.anchorForm.controls['ProcessingFeeType'].enable();
      this.anchorForm.controls['ProcessingFeePayableBy'].enable();
      this.anchorForm.controls['ProcessingFeeRate'].enable();
      this.anchorForm.controls['AnnualInterestPayableBy'].enable();
      this.anchorForm.controls['AnnualInterestRate'].enable();
      this.anchorForm.controls['OfferMaxRate'].enable();
      this.anchorForm.controls['MinTenureInMonth'].enable();
      this.anchorForm.controls['MaxTenureInMonth'].enable();
      this.anchorForm.controls['MaxLoanAmount'].enable();
      this.anchorForm.controls['MinLoanAmount'].enable();

      this.anchorForm.controls['AgreementStartDate'].enable();

      this.anchorForm.controls['AgreementEndDate'].enable();
      this.anchorForm.controls['isEmi'].enable();
    }
  }

  iscustomDaysreq: boolean = false;

  onClickSaveBtn() {
    debugger;
    this.submitted = true;

    if (Number(this.anchorProductId) > 0) {
      this.anchorForm.controls['Id'].setValue(Number(this.anchorProductId));
    }
    this.anchorForm.controls['CompanyId'].patchValue(this.Id);

    if (this.product && this.product.id) {
      this.anchorForm.controls['ProductId'].patchValue(this.product.id);
    } else {
      this.anchorForm.controls['ProductId'].patchValue(this.productId);
    }
    if (this.product && this.product.name != undefined) {
      this.anchorForm.controls['ProductName'].patchValue(this.product.name);
    } else {
      this.anchorForm.controls['ProductName'].patchValue(this.productname);
    }
    if (
      this.anchorForm.controls['ProcessingFeeType'].value == 'Percentage' &&
      this.anchorForm.controls['ProcessingFeeRate'].value > 100
    ) {
      alert('processing fee(in %) less than 100.');
      return;
    }
    if (
      this.anchorForm.controls['MaxTenureInMonth'].value <
      this.anchorForm.controls['MinTenureInMonth'].value
    ) {
      alert('Max Tenure month cant be greater than Min Tenure');
      return;
    }
    if (
      this.anchorForm.controls['MaxLoanAmount'].value <
      this.anchorForm.controls['MinLoanAmount'].value
    ) {
      alert('Loan amount greater than Min Loan amt.');
      return;
    }
    debugger;
    // this.anchorForm.controls['IseSignEnable'].patchValue(this.anchorForm.controls['IseSignEnable'].value === 'true');



    debugger;
    this.enableData();

    if (this.anchorForm.invalid) {
      const invalid = [];
      const controls = this.anchorForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }
      alert('Enter valid information for ' + invalid);
      // this.messageService.add({ severity: 'error', summary: 'Enter valid information for ' + invalid });

      return;
    }

    console.log(this.anchorForm.value);
    this.Loader = true;

    this.productService
      .AddUpdateAnchorProductConfig(this.anchorForm.value)
      .subscribe(
        (res: any) => {
          this.Loader = false;

          console.log(res);
          this.onFormSubmit.emit(true);
          // alert(res.message);
          this.messageService.add({
            severity: 'success',
            summary: res.message,
          });

          // this.anchorForm.reset();
        },
        (error) => {
          // alert(error);
        }
      );
  }
  public imagePath: any;
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
          this.messageService.add({
            severity: 'success',
            summary: 'Image uploaded successfully',
          });
          this.uploadFile(imgUploadType);
        };
      } else {
        // alert('Select Image size less than 6MB!!!');
        this.messageService.add({
          severity: 'warn',
          summary: 'Select Image size less than 6MB!!!',
        });
        event.nativeElement.value = '';
      }
    } else {
      // alert('Choose different file format!');
      this.messageService.add({
        severity: 'warn',
        summary: 'Choose different file format!',
      });
      event.nativeElement.value = '';
      file.preventDefault();
    }
  }

  file: any;
  AgreementDocId: any;
  uploadFile(imgUploadType: any) {
    this.Loader = true;

    const formData = new FormData();
    formData.append('FileDetails', this.file[0]);
    formData.append('IsValidForLifeTime', 'true');
    formData.append('ValidityInDays', '');
    formData.append('SubFolderName', '');
    this.productService.PostSingleFile(formData).subscribe((res: any) => {
      this.Loader = false;

      console.log(res);
      if (res.status) {
        // alert(res.message);
        this.messageService.add({ severity: 'success', summary: res.message });

        this.AgreementDocId = res.docId;
        this.anchorForm.controls['AgreementDocId'].patchValue(
          this.AgreementDocId
        );
        this.anchorForm.controls['AgreementURL'].patchValue(res.filePath);
      }
    });
  }

  keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  Back() {
    this.router.navigate(['pages/admin/add-company-product'], {
      skipLocationChange: true,
      queryParams: {
        companyId: this.Id,
        CompanyType: this.CompanyType,
        creditConfig: this.isCreditConfig,
      },
    });
    // this.router.navigateByUrl("pages/admin/add-company-product/" +this.Id+'/'+this.CompanyType);
  }
  showUrl: any;
  dialogUrl: any;
  showImage: boolean = false;
  isAgreementURL: boolean = false;

  show(input: string) {
    //debugger;
    this.showImage = true;
    if (input.toLowerCase().includes('pdf')) {
      this.showUrl = input;
      this.dialogUrl = '../../../../../assets/img/pdflogo.png';
    } else {
      this.showUrl = input;
      this.dialogUrl = '../../../../../assets/img/html.png';
    }
  }
  removeImage(str: any) {
    if (str == 'AgreementURL') {
      this.isAgreementURL = false;
      this.anchorForm.controls['AgreementURL'].setValue(null);
      this.anchorForm.controls['AgreementDocId'].setValue(null);
      this.myInputVariable1.nativeElement.value = '';
    }
  }

  download(value: any) {
    window.open(value);
  }
}
