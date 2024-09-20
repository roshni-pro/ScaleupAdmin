import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { CommonValidationService } from 'app/shared/services/common-validation.service';
import { AddAnchorProductService } from 'app/pages/companies-master/services/add-anchor-product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-anchor-creditline',
  templateUrl: './anchor-creditline.component.html',
  styleUrls: ['./anchor-creditline.component.scss'],
})
export class AnchorCreditlineComponent implements OnInit {
  @Input() product: any;
  @Input() companyId: any = '';
  @Input() companyType: string = '';
  @Input() creditConfig: boolean = false;
  @Input() productId: any = '';
  @Input() pageName: string = '';
  @Input() anchorProductId: any = '';
  @ViewChild('userPhoto1')
  myInputVariable1!: ElementRef;
  anchorForm!: FormGroup;
  currentdate: any = new Date();


  submitted: boolean = false;
  value: any;
  GSTRate: any;
  creditDays: any = [];
  iscustomDaysreq: boolean = false;
  anchorvalue: any;
  EmiOptions: any = [];
  public imagePath: any;
  file: any;
  AgreementDocId: any;
  isAgreementURL: boolean = false;
  // Id: any;
  // Id2: any;
  CompanyType: any;
  isCreditConfig: boolean = false;
  // pageName: any = '';
  // anchorProductId: any = 0;
  productname: string = '';
  selectedProduct: any;
  showImage: boolean = false;
  dialogUrl: any;
  showUrl: any;
  productName: any;
  disableDate:boolean=false
  Loader:boolean=false

  private subscriptions: Subscription[] = [];

  @Output() onClFormSubmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  // @Output() onFormSubmit: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private validation: CommonValidationService,
    private productService: AddAnchorProductService,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router,
    private messageService: MessageService
  ) {}
  async ngOnInit() {
    debugger;
    // console.log('isEsign value on load:', this.anchorForm.get('isEsign')?.value);
    
    this.currentdate = this.datePipe.transform(this.currentdate, 'yyyy-MM-dd');

    console.log('product', this.product);
   

    this.anchorForm = this.formBuilder.group({
      Id: [this.anchorProductId > 0 ? this.anchorProductId : null],
      CompanyId: [this.companyId],
      ProductId: [null, Validators.required],
      ProductName: ['', Validators.required],
      ProcessingFeePayableBy: ['', Validators.required],
      ProcessingFeeType: ['', Validators.required],
      ProcessingFeeRate: [null, Validators.required],
      AnnualInterestPayableBy: ['', Validators.required], //CreditLine
      // TransactionFeeType: [''], //CreditLine
      // TransactionFeeRate: [null, Validators.required], //CreditLine
      DelayPenaltyRate: [null, Validators.required],
      BounceCharge: [null, Validators.required],
      CompanyCreditDays: [[], Validators.required],
      CustomCreditDays: [null],
      DisbursementTAT: [null, Validators.required], //CreditLine
      CompanyEMIOptions: [[]],
      isEmi: ['No'], //bool emi option
      EMIRate: [null], //CreditLine
      EMIProcessingFeeRate: [null], //CreditLine
      EMIBounceCharge: [null], //CreditLine
      EMIPenaltyRate: [NonNullableFormBuilder], //CreditLine
      AgreementURL: [null, Validators.required], //for both
      AgreementStartDate: [null, Validators.required], //for both
      AgreementEndDate: [null, Validators.required], //for both
      AgreementDocId: [0], //for both

      CommissionPayout: [null], //BusinessLoan
      ConsiderationFee: [null], //BusinessLoan
      DisbursementSharingCommission: [null], //BusinessLoan

      ConvenienceFee: [null],
      DelayPenaltyFee: [null],
      ProcessingCreditDays: [null],
      CreditDays: [null], //CreditLine
      AnnualInterestRate: [null ,Validators.required],
      MinTenureInMonth: [null],
      MaxTenureInMonth: [null],
      OfferMaxRate: [null],

      MinLoanAmount: [null], //BusinessLoan
      MaxLoanAmount: [null], //BusinessLoan
      BlackSoilReferralCode :['', Validators.maxLength(100)],
      MaxInterestRate:[null],
      IseSignEnable:[""],
      PlatFormFee: [null],


    });

    this.addvalidators();
    await this.getCreditDays();
    await this.getCompanyEmiOption();
    this.getGstRate();

    this.GetAnchorProductConfig();

    this.getProductMasterList();
  }

  productList: any[] = [];
  getProductMasterList() {
    this.productService
      .GetProductMasterList(this.companyId, this.CompanyType)
      .subscribe((res: any) => {
        console.log(res);
        // this.Loader = false;
        this.productList = res.returnObject;
        console.log('this.productList', this.productList);
      });
  }
  getProduct() {
    ////debugger;
    // this.anchorForm.reset();
    this.submitted = false;
    console.log();
    this.anchorForm.controls['ProductId'].patchValue(
      this.selectedProduct ? this.selectedProduct.id : null
    );
    this.anchorForm.controls['ProductName'].patchValue(
      this.selectedProduct ? this.selectedProduct.type : null
    );
    this.anchorForm.controls['CompanyId'].patchValue(this.companyId);
  }
  addvalidators() {
    ////debugger;

    if (this.anchorForm.controls['isEmi'].value == 'Yes') {
      this.anchorForm.controls['CompanyEMIOptions'].value == null
        ? this.anchorForm.controls['CompanyEMIOptions'].setValidators([
            Validators.required,
          ])
        : null;
      this.anchorForm.controls['EMIRate'].value == null
        ? this.anchorForm.controls['EMIRate'].setValidators([
            Validators.required,
          ])
        : null;

      this.anchorForm.controls['EMIProcessingFeeRate'].value == null
        ? this.anchorForm.controls['EMIProcessingFeeRate'].setValidators([
            Validators.required,
          ])
        : this.anchorForm.controls['EMIProcessingFeeRate'].clearValidators();

      this.anchorForm.controls['EMIBounceCharge'].value == null
        ? this.anchorForm.controls['EMIBounceCharge'].setValidators([
            Validators.required,
          ])
        : this.anchorForm.controls['EMIBounceCharge'].clearValidators();

      this.anchorForm.controls['EMIPenaltyRate'].value == null
        ? this.anchorForm.controls['EMIPenaltyRate'].setValidators([
            Validators.required,
          ])
        : this.anchorForm.controls['EMIPenaltyRate'].clearValidators();
    } else {
      ////debugger;
      // this.anchorForm.controls['EMIPenaltyRate'].removeValidators(Validators.required);
      this.anchorForm.controls['CompanyEMIOptions'].clearValidators();
      this.anchorForm.controls['EMIPenaltyRate'].clearValidators();
      this.anchorForm.controls['EMIBounceCharge'].clearValidators();
      this.anchorForm.controls['EMIProcessingFeeRate'].clearValidators();
      this.anchorForm.controls['EMIRate'].clearValidators();
    }
    this.anchorForm.controls['CompanyEMIOptions'].updateValueAndValidity();

    this.anchorForm.controls['EMIPenaltyRate'].updateValueAndValidity();
    this.anchorForm.controls['EMIBounceCharge'].updateValueAndValidity();
    this.anchorForm.controls['EMIProcessingFeeRate'].updateValueAndValidity();
    this.anchorForm.controls['EMIRate'].updateValueAndValidity();
  }

  async getCreditDays() {
    let res: any = await this.productService
      .GetCreditDayMastersList()
      .toPromise();
    console.log('CreditDayMastersList', res);
    res.returnObject.forEach((element: any) => {
      let obj = {};
      obj = {
        ProductAnchorCompanyId: 0,
        CreditDaysMasterId: element.id,
        name: element.name,
        IsActive: element.isActive,
        IsDeleted: element.isDeleted,
      };
      this.creditDays.push(obj);
    });
  }
  async getCompanyEmiOption() {
    let res: any = await this.productService
      .GetEMIOptionMasterList()
      .toPromise();
    console.log(res);
    res.returnObject.forEach((element: any) => {
      let obj = {};
      obj = {
        productAnchorCompanyId: 0,
        emiOptionMasterId: element.id,
        isActive: element.isActive,
        isDeleted: element.isDeleted,
        name: element.name,
      };
      this.EmiOptions.push(obj);
    });
  }
  keyPressAmount($event: any) {
    let res = this.validation.keyPressAmount($event);
  }
  keyPress($event: any) {
    let res = this.validation.keyPress($event);
  }
  omit_special_char($event: any) {
    let res = this.validation.omit_special_char($event);
  }

  space($event: any) {
    let res = this.validation.omit_special_char($event);
  }
  RestrictCommaSemicolon(e: any) {
    var theEvent = e || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /[^,.'";]+$/;
    if (!regex.test(key)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) {
        theEvent.preventDefault();
      }
    }
  }

  get f() {
    return this.anchorForm.controls;
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

  customDays() {
    let flag: boolean = false;
    this.anchorForm.controls['CompanyCreditDays'].value
      ? this.anchorForm.controls['CompanyCreditDays'].value.forEach(
          (element: any) => {
            if (element.name == 'Custom') {
              flag = true;
            }
          }
        )
      : null;
    //debugger;
    if (!flag) {
      this.iscustomDaysreq = false;
      this.anchorForm.controls['CustomCreditDays'].clearValidators();
      this.anchorForm.controls['CustomCreditDays'].updateValueAndValidity();
    } else {
      this.iscustomDaysreq = true;
      this.anchorForm.controls['CustomCreditDays'].setValidators([
        Validators.required,
      ]);
    }
  }

  onEmiChange(isEmi: any) {
    this.anchorForm.controls['CompanyEMIOptions'].reset();
    //debugger;

    if (isEmi == 'No') {
      this.anchorForm.controls['EMIPenaltyRate'].setValue(null);
      this.anchorForm.controls['EMIBounceCharge'].setValue(null);
      this.anchorForm.controls['EMIProcessingFeeRate'].setValue(null);
      this.anchorForm.controls['EMIRate'].setValue(null);
    }
    if (isEmi == 'Yes') {
      if (this.anchorvalue && this.anchorvalue.emiPenaltyRate) {
        this.anchorForm.controls['EMIPenaltyRate'].patchValue(
          this.anchorvalue.emiPenaltyRate
        );
      } else {
        this.anchorForm.controls['EMIPenaltyRate'].patchValue(null);
      }

      if (this.anchorvalue && this.anchorvalue.emiPenaltyRate) {
        this.anchorForm.controls['EMIBounceCharge'].patchValue(
          this.anchorvalue.emiBounceCharge
        );
      } else {
        this.anchorForm.controls['EMIBounceCharge'].patchValue(null);
      }

      if (this.anchorvalue && this.anchorvalue.emiPenaltyRate) {
        this.anchorForm.controls['EMIProcessingFeeRate'].patchValue(
          this.anchorvalue.emiProcessingFeeRate
        );
      } else {
        this.anchorForm.controls['EMIProcessingFeeRate'].patchValue(null);

        if (this.anchorvalue && this.anchorvalue.emiPenaltyRate) {
          this.anchorForm.controls['EMIRate'].patchValue(
            this.anchorvalue.emiRate
          );
        } else {
          this.anchorForm.controls['EMIRate'].patchValue(null);
        }
      }
    }
  }

  upload(file: any, imgUploadType: string, event?: any) {
    //debugger;
    if (
      file.target.files[0].name.toLowerCase().includes('pdf') &&
      imgUploadType == 'AgreementURL'
    ) {
      if (file.target.files[0].size < 6000000) {
        this.file = file.target.files;
        var reader = new FileReader();
        this.imagePath = file;
        this.uploadFile(imgUploadType);
        (success: any) => {
          // alert('image uploaded successfully');
          this.messageService.add({ severity: 'success', summary:'Image uploaded successfully' });

          this.uploadFile(imgUploadType);
        };
      } else {
        // alert('Select Image size less than 6MB!!!');
        this.messageService.add({ severity: 'warn', summary:'Select Image size less than 6MB!!!' });
        event.nativeElement.value = '';
      }
    } else {
      // alert('Choose different file format!');
      this.messageService.add({ severity: 'warn', summary:'Choose different file format!' });
      event.nativeElement.value = '';
      // file.preventDefault();
    }
  }

  uploadFile(imgUploadType: any) {
    const formData = new FormData();
    formData.append('FileDetails', this.file[0]);
    formData.append('IsValidForLifeTime', 'true');
    formData.append('ValidityInDays', '');
    formData.append('SubFolderName', '');
    this.Loader=true;
    this.productService.PostSingleFile(formData).subscribe((res: any) => {
      this.Loader=false;

      console.log(res);
      if (res.status) {
        // alert(res.message);
        this.messageService.add({ severity: 'success', summary:res.message });

        this.AgreementDocId = res.docId;
        this.anchorForm.controls['AgreementDocId'].patchValue(
          this.AgreementDocId
        );
        this.anchorForm.controls['AgreementURL'].patchValue(res.filePath);
      }
    });
  }

  GetAnchorProductConfig() {
    debugger;
    this.anchorForm.reset();
    this.Loader=true;

    this.productService
      .GetAnchorProductConfig(this.companyId, this.productId)
      .subscribe((res: any) => {
        this.Loader=false;

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
        this.anchorForm.controls['AgreementStartDate'].patchValue(
          this.datePipe.transform(anchorvalue.agreementStartDate, 'yyyy-MM-dd')
        );
        this.anchorForm.controls['AgreementEndDate'].patchValue(
          this.datePipe.transform(anchorvalue.agreementEndDate, 'yyyy-MM-dd')
        );
        this.anchorForm.controls['AgreementURL'].patchValue(
          anchorvalue.agreementURL
        );
        // this.anchorForm.controls['TransactionFeeRate'].patchValue(
        //   anchorvalue.transactionFeeRate
        // );
        this.anchorForm.controls['AnnualInterestRate'].patchValue(
          anchorvalue.annualInterestRate
        );
        this.anchorForm.controls['AnnualInterestPayableBy'].patchValue(
          anchorvalue.annualInterestPayableBy
        );

        this.anchorForm.controls['EMIPenaltyRate'].patchValue(
          anchorvalue.emiPenaltyRate
        );
        this.anchorForm.controls['EMIBounceCharge'].patchValue(
          anchorvalue.emiBounceCharge
        );

        this.anchorForm.controls['EMIProcessingFeeRate'].patchValue(
          anchorvalue.emiProcessingFeeRate
        );
        this.anchorForm.controls['BlackSoilReferralCode'].patchValue(
          anchorvalue.blackSoilReferralCode
        );

        this.anchorForm.controls['EMIRate'].patchValue(anchorvalue.emiRate);

        console.log(anchorvalue);
        let days: any[] = [];
        anchorvalue.companyCreditDays.forEach((y: any) => {
          this.creditDays.forEach((x: any) => {
            // ////debugger
            if (x.CreditDaysMasterId == y.creditDaysMasterId) {
              days.push(x);
            }
          });
        });

        let emidays: any[] = [];
        anchorvalue.companyEMIOptions.forEach((y: any) => {
          this.EmiOptions.forEach((x: any) => {
            // ////debugger
            if (x.emiOptionMasterId == y.emiOptionMasterId) {
              emidays.push(x);
            }
          });
        });
        // console.log(days);
        this.anchorForm.controls['CompanyCreditDays'].patchValue(days);
        this.anchorForm.controls['CompanyEMIOptions'].patchValue(emidays);

        this.anchorForm.controls['CustomCreditDays'].patchValue(
          anchorvalue.customCreditDays
        );
        ////debugger;
        if (anchorvalue.emiPenaltyRate && anchorvalue.emiPenaltyRate > 0) {
          this.anchorForm.controls['isEmi'].patchValue('Yes');
        } else {
          this.anchorForm.controls['isEmi'].patchValue('No');
        }

        this.anchorForm.controls['CompanyCreditDays'].value
          ? this.anchorForm.controls['CompanyCreditDays'].value.forEach(
              (element: any) => {
                if (element.name == 'Custom') {
                  this.iscustomDaysreq = true;

                  this.anchorForm.controls['CompanyCreditDays'].setValidators([
                    Validators.required,
                  ]);
                  this.anchorForm.controls[
                    'CompanyCreditDays'
                  ].updateValueAndValidity();
                }
              }
            )
          : null;

        this.productname = res.returnObject[0].productName;
        // console.log(this.productname);
        if(this.currentdate < this.anchorForm.controls['AgreementEndDate'].value){
          this.disableDate=true;

          this.anchorForm.controls['AgreementStartDate'].disable();
          this.anchorForm.controls['AgreementEndDate'].disable();
        }
        this.disableData();
      });

  }
  disableData() {
    debugger;

    if(this.disableDate){

      this.anchorForm.controls['ProcessingFeeRate'].disable();
      
      this.anchorForm.controls['ProcessingFeeType'].disable();
      
      this.anchorForm.controls['ProcessingFeePayableBy'].disable();
      
      this.anchorForm.controls['AgreementStartDate'].disable();
      
      this.anchorForm.controls['AgreementEndDate'].disable();
      this.anchorForm.controls['isEmi'].disable();
      this.anchorForm.controls['AnnualInterestRate'].disable();

      
        
        this.anchorForm.controls['AnnualInterestPayableBy'].disable();
        
        this.anchorForm.controls['EMIPenaltyRate'].disable();
        
        this.anchorForm.controls['EMIBounceCharge'].disable();
        
        this.anchorForm.controls['EMIProcessingFeeRate'].disable();
        
        this.anchorForm.controls['EMIRate'].disable();
        
        
        this.anchorForm.controls['CustomCreditDays'].disable();

        // this.anchorForm.controls['isEsign'].disable();
        // this.anchorForm.controls['MaxInterestRate'].disable();


      }
    }

  enableData() {
    debugger;

    console.log('this.anchorvalue', this.anchorvalue);
    if (this.anchorvalue) {
      this.anchorForm.controls['ProcessingFeeRate']
        .enable
        // this.anchorvalue.processingFeeRate
        ();

      this.anchorForm.controls['ProcessingFeeType']
        .enable
        // this.anchorvalue.processingFeeType
        ();

      this.anchorForm.controls['ProcessingFeePayableBy']
        .enable
        // this.anchorvalue.processingFeePayableBy
        ();

      this.anchorForm.controls['AgreementStartDate']
        .enable
        // this.anchorvalue.agreementStartDate
        ();

      this.anchorForm.controls['AgreementEndDate']
        .enable
        // this.anchorvalue.agreementEndDate
        ();

      this.anchorForm.controls['AnnualInterestRate'].enable();
      this.anchorForm.controls['isEmi'].enable();

      this.anchorForm.controls['AnnualInterestPayableBy']
        .enable
        // this.anchorvalue.annualInterestPayableBy
        ();

      this.anchorForm.controls['EMIPenaltyRate']
        .enable
        // this.anchorvalue.emiPenaltyRate
        ();

      this.anchorForm.controls['EMIBounceCharge']
        .enable
        // this.anchorvalue.emiBounceCharge
        ();

      this.anchorForm.controls['EMIProcessingFeeRate']
        .enable
        // this.anchorvalue.emiProcessingFeeRate
        ();

      this.anchorForm.controls['EMIRate']
        .enable
        // this.anchorvalue.emiRate
        ();
        // this.anchorForm.controls['isEsign'].enable();
        // this.anchorForm.controls['MaxInterestRate'].enable();
    }
  }
  onClickSaveBtn() {
    this.addvalidators();
    debugger;
    this.Loader=false;

    if (Number(this.anchorProductId) > 0) {
      this.anchorForm.controls['Id'].setValue(Number(this.anchorProductId));
    }
    this.anchorForm.controls['CompanyId'].patchValue(this.companyId);

    this.submitted = true;

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
      // alert('processing fee(in %) less than 100.');
      this.messageService.add({ severity: 'warn', summary:'processing fee(in %) less than 100.' });

      return;
    }
    // console.log(this.anchorForm.value);
    this.submitted = true;
    this.enableData();

    if (this.anchorForm.invalid) {
      //debugger;
      const invalid = [];
      const controls = this.anchorForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }
      alert('Enter valid information for ' + invalid);
      // this.messageService.add({ severity: 'error', summary:'Enter valid information for ' + invalid });

      return;
    }

    this.productService
      .AddUpdateAnchorProductConfig(this.anchorForm.value)
      .subscribe((res: any) => {
        this.Loader=false;
        console.log(res);
        alert(res.message);
        this.messageService.add({ severity: 'success', summary:res.message });

        this.onClFormSubmit.emit(true);

        
      });
  }
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
  download(value: any) {
    window.open(value);
  }
  removeImage(str: any) {
    if (str == 'AgreementURL') {
      this.isAgreementURL = false;
      this.anchorForm.controls['AgreementURL'].setValue(null);
      this.anchorForm.controls['AgreementDocId'].setValue(null);
      this.myInputVariable1.nativeElement.value = '';
    }
  }
}
