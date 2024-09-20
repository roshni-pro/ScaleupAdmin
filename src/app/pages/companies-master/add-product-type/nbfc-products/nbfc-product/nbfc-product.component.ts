import {
  Component,
  DebugElement,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'app/shared/services/loader.service';
import { DatePipe } from '@angular/common';
import { environment } from 'environments/environment';
// import { CompanyMasterService } from 'app/pages/admin/company-master/services/company-master.service';
import { NbfcTestService } from 'app/pages/nbfc-url/nbfc-test.service';
import { NbfcProductService } from 'app/pages/companies-master/services/nbfc-product.service';
import { CompanyMasterService } from 'app/pages/companies-master/services/company-master.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-nbfc-product',
  templateUrl: './nbfc-product.component.html',
  styleUrls: ['./nbfc-product.component.scss'],
})
export class NbfcProductComponent implements OnInit {
  @ViewChild('userPhoto1')
  myInputVariable1!: ElementRef;
  @ViewChild('userPhoto2')
  myInputVariable2!: ElementRef;
  @ViewChild('userPhoto3')
  myInputVariable3!: ElementRef;

  @Input() Id: any;
  @Input() productId: any;
  @Input() dropID: any;
  @Input() IsProductDialog: any;
  @Output() disableDialog = new EventEmitter();

  // Id: any;
  Id2: any;
  productList: any;
  selectedProduct: any;




  selectedactivity: any;
  DatafilterStore: any;
  activityData: any;
  cols: any[] = [];
  submitted: boolean = false;
  anchorForm!: FormGroup;
  configFlag: boolean = false;
  activityFlag: boolean = false;
  CompanyType: any;
  isCreditConfig: boolean = false;
  pageName: any = '';
  Loader: boolean = false;
  imagePath: any;
  file: any;
  GSTRate: any;

  selectedEditProduct: any = {
    id: 0,
    type: '',
  };
  creditDays: any = [];
  editDisabled: boolean = false;
  isAgreementURL: boolean = false;
  AgreementDocId: number = 0;
  showImage: boolean = false;
  showUrl: any;
  dialogUrl: any;
  currentdate: any = new Date();
  alternateNames: any = {
    ConvenienceFee: [null],
    ProcessingFee: 'Processing Fee',
    DelayPenaltyFee: 'Delay Penalty Fee',
    BounceCharges: 'NBFC Bounce Charges',
    MaxPenaltyCharges: 'Customer Penalty Charges',
    MaxBounceCharges: 'Customer Bounce Charges',
    ProcessingCreditDays: 'Processing Credit Days',
    CreditDays: 'Credit Days',
    CompanyCreditDays: 'Company Credit Days',
    ProductId: 'Gst number',
    ProductName: 'Product Name',
    InterestRate: 'Interest Rate',
    PenaltyCharges: 'NBFC Penalty Charges',
    PlatformFee: 'Platform Fee',
    AgreementURL: 'Agreement pdf',
    AgreementStartDate: 'Agreement Start Date',
    AgreementEndDate: 'Agreement End Date',
    CustomerAgreementURL: 'Customer Agreement html',
    ProcessingFeeType: 'Processing Fee Type',
    SanctionLetterURL: 'Sanction Letter pdf',
    DisbursementType: 'Disbursement Type',
    // Add more fields as needed
  };
  isactivityChecked: any;
  issubactivityChecked: any;
  nfbcproductId: any;


  customerAgreementURL: any;
  customerAgreementType: any;
  url: boolean = false;
  display: boolean = false;
  objList: any[] = [];
  insertapidisplay: boolean = false;
  APIUrl: any;
  Code: any;
  Sequence: any;
  groups: any[] = []; // Assuming groups is an array
  nbfcSubActivityApiList: any[] = [];

  rows: any[] = []; // Array to hold rows
  rowdisable: boolean = false;




  // ------------------------
  selectedarrangeType: any;
  arrangementType: any;
  fldgfixForm!: FormGroup;
  fldgfixRows!: FormArray;

  fldgvariableForm!: FormGroup;
  fldgvariablepfRows!: FormArray;
  fldgvariableRoiRows!: FormArray;

  dsaForm!: FormGroup;
  dsapfRows!: FormArray;
  dsacommissionRows!: FormArray;

  NBFCSlabForm!: FormGroup;
  pfRows!: FormArray
  roiRows!: FormArray
  commisionRows!: FormArray
  ValueTypeList: any;
  // -------------------------



  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private productService: NbfcProductService,
    private formBuilder: FormBuilder,
    private nbfcService: NbfcTestService,
    private companyService: CompanyMasterService,
    private messageService: MessageService
  ) {
    this.cols = [{ field: 'activity', header: 'activity' }];
    this.currentdate = this.datePipe.transform(this.currentdate, 'yyyy-MM-dd');
    console.log(this.datePipe.transform(this.currentdate, 'yyyy-MM-dd'));
    this.anchorForm = this.formBuilder.group({
      Id: [null],
      ProcessingFee: [
        '',
        Validators.required,
      ],
      InterestRate: [
        0,
        Validators.required,
      ],


      ProcessingFeeType: ['', Validators.required],


      CompanyId: [''],
      GSTRate: [''],
      ConvenienceFee: [null],
      DelayPenaltyFee: [null],
      ProcessingCreditDays: [null],
      CreditDays: [null],
      CompanyCreditDays: [[]],
      ProductId: [null, Validators.required],
      ProductName: ['', Validators.required],

      PenaltyCharges: [null, Validators.required],
      MaxPenaltyCharges: [null, Validators.required],
      BounceCharges: [null, Validators.required],
      MaxBounceCharges: [null, Validators.required],

      PlatformFee: [null, Validators.required],
      AgreementURL: ['', Validators.required],
      AgreementDocId: [null],
      AgreementStartDate: ['', Validators.required],
      AgreementEndDate: ['', Validators.required],
      CustomerAgreementURL: [''],
      CustomerAgreementDocId: [null],
      CustomerAgreementType: ['', Validators.required],
      SanctionLetterDocId: [null],
      SanctionLetterURL: new FormControl('', Validators.required),
      IsInterestRateCoSharing: false,
      IsPenaltyChargeCoSharing: false,
      IsBounceChargeCoSharing: false,
      IsPlatformFeeCoSharing: false,
      DisbursementType: new FormControl(''),

      // -------------
      ArrangementType: [null],
      PFSharePercentage: [null],
      Tenure: [null],
      ProductSlabConfigs: [[]],
      IseSignEnable: false
    });


    // ------------------------
    this.arrangementType = [
      { label: 'FLDG Fix', value: 'FLDGFix' },
      { label: 'FLDG Variable', value: 'FLDGVariable' },
      { label: 'DSA', value: 'DSA' },
    ];
    // --------------------------- enummmmmmmmmmmmmm



    this.ValueTypeList = [
      { label: 'Select', value: null },
      { label: 'Amount', value: 'Amount' },
      { label: 'Percentage', value: 'Percentage' },
    ];



  }

  pfValueType: any
  roiValueType: any
  commissionValueType: any
  async ngOnInit(): Promise<void> {
    debugger;
    console.log(this.anchorForm, 'anchorrrrrrr');

    this.CompanyType = 'NBFC';
    this.Id2 = this.productId ? this.productId : null;
    this.nfbcproductId = this.dropID ? this.dropID : null;



    //---------------new slab concept



    this.NBFCSlabForm = this.formBuilder.group({
      pfValueType: new FormControl(null), // Control for Processing Fee ValueType
      roiValueType: new FormControl(null), // Control for Rate of Interest ValueType
      commissionValueType: new FormControl(null), // Control for Commission ValueType
      pfRows: this.formBuilder.array([]),
      roiRows: this.formBuilder.array([]),
      commissionRows: this.formBuilder.array([])
    });
    this.NBFCSlabForm = this.formBuilder.group({});
    this.pfRows = this.formBuilder.array([]);
    this.NBFCSlabForm.setControl('pfRows', this.pfRows);
    this.roiRows = this.formBuilder.array([]);
    this.NBFCSlabForm.setControl('roiRows', this.roiRows);
    this.commisionRows = this.formBuilder.array([]);
    this.NBFCSlabForm.setControl('commisionRows', this.commisionRows);
    this.pfValueType = new FormControl(null)
    this.NBFCSlabForm.setControl('pfValueType', this.pfValueType);
    this.roiValueType = new FormControl(null)
    this.NBFCSlabForm.setControl('roiValueType', this.roiValueType);
    this.commissionValueType = new FormControl(null)
    this.NBFCSlabForm.setControl('commissionValueType', this.commissionValueType);


    console.log(this.NBFCSlabForm);






    console.log('this.productId', this.productId);
    console.log('this.Id', this.Id);
    console.log('this.Id2', this.Id2);
    this.search();
    this.onAddRow();
    this.getCreditDays();

    await this.getProductMasterList();
    this.getGstRate();
    if (this.Id && this.Id2) {
      this.selectedProduct = this.productList
        ? this.productList.find((x: any) => x.id === this.Id2)
        : null;
      this.GetProductCompanyConfig();
      this.ProductActivityMasterList();
    } else {
      this.anchorForm.controls['CompanyId'].patchValue(this.Id);
    }
  }

  // ----------------




  // functions that relate arrangetype [FLDG FIX ,VARIABLE ,DSA]



  get productSlabConfigs(): FormArray {
    return this.anchorForm.get('ProductSlabConfigs') as FormArray;
  }


  isNotSlabValid: boolean = false;




  onAddSlab(slabtype: any) {
    console.log(this.NBFCSlabForm);
    debugger
    this.fillValueType()
    this.error = '';
    this.errorAmount = ''
    this.Type = slabtype
    let targetArray: FormArray;

    if (slabtype == 'PF') {
      targetArray = this.pfRows;
    } else if (slabtype == 'ROI') {
      targetArray = this.roiRows;
    } else {
      targetArray = this.commisionRows;
    }


    // Function to check if all fields in a row are filled
    // const isRowFilled = (formGroup: FormGroup): boolean => {
    //   return Object.values(formGroup.controls).every(control => control.value !== null && control.value !== undefined && control.value !== '');
    // };
    // const areAllRowsFilled = (formArray: FormArray): boolean => {
    //   return formArray.controls.every((control: AbstractControl) => isRowFilled(control as FormGroup));
    // };
    // console.log(areAllRowsFilled(targetArray))
    // if (!areAllRowsFilled(targetArray) && this.Id2 > 0) {
    //   alert('Please fill all existing row details before adding a new row in ' + slabtype);
    //   return;
    // }

    // Validate existing rows before adding a new one
    this.minMaxError = []
    if (slabtype) {
      const check = this.validateRowsBasedOnSlabType(slabtype);
      if (!check) {
        alert('Please Fill according to validations in ' + slabtype);
        this.isNotSlabValid = true;
        return
      }
    } else if (this.arrangementType && this.Id > 0 && this.Id2 > 0) {
      const check = this.validateRowsBasedOnArrangementType();
      if (!check) {
        alert('Please Fill according to validations ' + slabtype);
        this.isNotSlabValid = true;
        return
      }
    }





    //check if values are overlapping
    let obj = slabtype ? this.checkForOverlappingRanges(slabtype) : null
    if (obj && obj.status == true) {
      this.messageService.add({
        severity: 'error',
        summary: obj.msg,
      });
      return
    }





    // Clear and add initial rows if slabtype is null
    if (slabtype == null) {
      debugger
      this.pfRows && this.pfRows.value.length > 0 ? this.onRemoveSlabRow(0, 'PF') : null
      this.roiRows && this.roiRows.value.length > 0 ? this.onRemoveSlabRow(0, 'ROI') : null
      this.commisionRows && this.commisionRows.value.length > 0 ? this.onRemoveSlabRow(0, 'Commission') : null

      this.pfRows.push(this.createItemFormGroup(null, 'PF'));
      this.roiRows.push(this.createItemFormGroup(null, 'ROI'));
      this.commisionRows.push(this.createItemFormGroup(null, 'Commission'));

      return;


    }


    // Add new row
    if (slabtype == 'PF') {
      this.pfRows.push(this.createItemFormGroup(null, slabtype));

    } else if (slabtype == 'ROI') {
      this.roiRows.push(this.createItemFormGroup(null, slabtype));
    }
    else {
      this.commisionRows.push(this.createItemFormGroup(null, slabtype));
    }
  }
  isValidRows(rows: any[]): boolean {
    // this.minMaxError = [];
    debugger
    const isValuePresent = (value: any, fieldName: string) => {
      if (value == null || value == undefined) {
        this.minMaxError.push(`${fieldName} is empty!`);
        return false;
      }
      return true;
    };

    const isValidRow = (row: any) => {
      const validFields = [
        isValuePresent(row.MinValue, 'NBFC value'),
        isValuePresent(row.MaxValue, 'Customer value'),
        isValuePresent(row.MinLoanAmount, 'Minimum LoanAmount'),
        isValuePresent(row.MaxLoanAmount, 'Maximum LoanAmount'),
        isValuePresent(row.ValueType, 'ValueType'),
      ];

      return validFields.every(Boolean);
    };

    const checkValueInRange = (row: any) => {
      if (row.MinValue > row.MaxValue) {
        this.minMaxError.push(`${row.MinValue} must be less than ${row.MaxValue}% in ${row.SlabType}`);
      }
      if (row.MinLoanAmount > row.MaxLoanAmount) {
        this.minMaxError.push(`${row.MinLoanAmount} must be less than ${row.MaxLoanAmount} Amount in ${row.SlabType}`);
      }
      if (row.ValueType == 'Percentage' && row.MaxValue > 100) {
        this.minMaxError.push(`${row.MaxValue} must be less than 100 in case of percentage in ${row.SlabType}`);
      }

      return (
        row.MinValue < row.MaxValue &&
        row.MinLoanAmount < row.MaxLoanAmount &&
        (row.ValueType !== 'Percentage' || row.MaxValue <= 100)
      );
    };

    return rows && rows.length > 0 && rows.every(isValidRow) && rows.every(checkValueInRange);
  }

  validateRowsBasedOnSlabType(slabType: string): boolean {
    switch (slabType) {
      case 'PF':
        return this.pfRows.value && this.pfRows.value.length > 0 ? this.isValidRows(this.pfRows.value) : true;
      case 'ROI':
        return this.roiRows.value && this.roiRows.value.length > 0 ? this.isValidRows(this.roiRows.value) : true;
      default:
        return this.commisionRows.value && this.commisionRows.value.length > 0 ? this.isValidRows(this.commisionRows.value) : true;
    }
  }

  validateRowsBasedOnArrangementType(): boolean {
    switch (this.selectedarrangeType) {
      case 'DSA':
        const dsaPfValid = this.isValidRows(this.pfRows.value);
        const dsaCommisionValid = this.isValidRows(this.commisionRows.value);
        return dsaCommisionValid && dsaPfValid;
      case 'FLDGFix':
        const fldgfixPfValid = this.isValidRows(this.pfRows.value);
        const fldgfixRoiValid = this.isValidRows(this.roiRows.value);
        return this.roiRows.value.length==1? fldgfixPfValid && fldgfixRoiValid :fldgfixPfValid;
      
        default:
          const fldgVariablePfValid = this.isValidRows(this.pfRows.value);
        const fldgVariableRoiValid = this.isValidRows(this.roiRows.value);
        return fldgVariableRoiValid && fldgVariablePfValid;
    }
  }




  createItemFormGroup(item?: any, slabType?: any): FormGroup {
    debugger
    console.log(this.NBFCSlabForm.controls['pfValueType'].value);
    if (item) {

      return this.formBuilder.group({
        SlabType: item.slabType,
        MinLoanAmount: item.minLoanAmount,
        MaxLoanAmount: item.maxLoanAmount,
        MinValue: item.minValue,
        MaxValue: item.maxValue,
        ValueType: item.valueType,
        SharePercentage: item.sharePercentage,
        IsFixed: item.isFixed,
      });
    } else {
      debugger;
      console.log('slabType', slabType);
      const controlMap = {
        'PF': 'pfValueType',
        'ROI': 'roiRows',
        'Commission': 'commissionRows'
      };

      const valueType = slabType
        ? this.NBFCSlabForm.controls[controlMap[slabType as keyof typeof controlMap]]?.value ?? null
        : slabType === 'PF'
          ? this.NBFCSlabForm.controls['pfValueType'].value
          : null;
      return this.formBuilder.group({
        SlabType: slabType,
        ValueType: valueType,
        IsFixed: false,
        MinLoanAmount: null,
        MaxLoanAmount: null,
        MinValue: null,
        MaxValue: null,
        SharePercentage: 0,

      });
    }
  }
  onRemoveSlabRow(rowIndex: number, slabtype?: any) {
    if (slabtype == 'PF') {
      this.pfRows.removeAt(rowIndex);
    }
    else if (slabtype == 'ROI') {
      this.roiRows.removeAt(rowIndex);
    }
    else {
      this.commisionRows.removeAt(rowIndex);
    }
  }

  error: any
  errorAmount: any
  minMaxError: string[] = [];
  Type: any
  checkForOverlappingRanges(slabType?: any): any {
    this.error = null;
    this.errorAmount = null;
    let formArray: FormArray;

    function mapAndSortRanges(rows: any[], minProp: string, maxProp: string): { Min: number, Max: number, index: number }[] {
      const ranges = rows.map((row: any, index: number) => ({
        Min: row[minProp],
        Max: row[maxProp],
        index: index
      }));

      ranges.sort((a: any, b: any) => a.Min - b.Min);
      return ranges;
    }

    function patchValues(formArray: FormArray, index: number, minProp: string, maxProp: string) {
      (formArray.at(index) as FormGroup).patchValue({ [minProp]: null, [maxProp]: null });
    }

    let ranges = [];
    let amounts = [];

    if (slabType === 'PF') {
      // ranges = mapAndSortRanges(this.pfRows.value, 'MinValue', 'MaxValue');
      amounts = mapAndSortRanges(this.pfRows.value, 'MinLoanAmount', 'MaxLoanAmount');
      formArray = this.pfRows;
    } else if (slabType === 'ROI') {
      ranges = mapAndSortRanges(this.roiRows.value, 'MinValue', 'MaxValue');
      amounts = mapAndSortRanges(this.roiRows.value, 'MinLoanAmount', 'MaxLoanAmount');
      formArray = this.roiRows;
    } else {
      ranges = mapAndSortRanges(this.commisionRows.value, 'MinValue', 'MaxValue');
      amounts = mapAndSortRanges(this.commisionRows.value, 'MinLoanAmount', 'MaxLoanAmount');
      formArray = this.commisionRows;
    }

    let obj = {
      msg: this.error,
      status: false
    }

    // for (let i = 1; i < ranges.length; i++) {
    //   if (ranges[i].Min <= ranges[i - 1].Max) {
    //     this.error = `Range ${ranges[i].Min}-${ranges[i].Max} overlaps with ${ranges[i - 1].Min}-${ranges[i - 1].Max} in ${slabType}`;
    //     patchValues(formArray, ranges[i].index, 'MinValue', 'MaxValue');
    //     console.log(this.error);
    //     this.Type = slabType;
    //     obj = {
    //       msg: this.error,
    //       status: true
    //     }
    //     return obj;
    //   }
    // }

    for (let i = 1; i < amounts.length; i++) {
      if (amounts[i].Min <= amounts[i - 1].Max) {
        this.errorAmount = `Range ${amounts[i].Min}-${amounts[i].Max} overlaps with ${amounts[i - 1].Min}-${amounts[i - 1].Max} in ${slabType}`;
        patchValues(formArray, amounts[i].index, 'MinLoanAmount', 'MaxLoanAmount');
        console.log(this.errorAmount);
        this.Type = slabType;
        obj = {
          msg: this.errorAmount,
          status: true
        }
        return obj;
      }
    }

    return obj;
  }


  checkSlabValidation(slabtype?: any) {
    debugger
    const isValidRow = (row: any) => {
      return (
        row.MinValue !== null &&
        row.MinValue !== undefined &&
        row.MaxValue !== null &&
        row.MaxValue !== undefined &&
        row.MinLoanAmount !== null &&
        row.MaxLoanAmount !== undefined &&
        row.SlabType !== null &&
        row.SlabType !== undefined &&
        row.ValueType !== null &&
        row.ValueType !== undefined
      );
    };


    if (slabtype) {
      if (slabtype == 'PF') {
        const fldgFixrowsValid =
          this.pfRows.value &&
          this.pfRows.value.length > 0 &&
          this.pfRows.value.every(isValidRow)
        return fldgFixrowsValid;
      }
      else if (slabtype == 'ROI') {
        const variableRowsValid =
          this.roiRows.value &&
          this.roiRows.value.length > 0 &&
          this.roiRows.value.every(isValidRow);
        return variableRowsValid;
      }
      else {
        const dsacommissionRowsValid =
          this.commisionRows.value &&
          this.commisionRows.value.length > 0 &&
          this.commisionRows.value.every(isValidRow)
        return dsacommissionRowsValid;
      }
    }



    if (this.selectedarrangeType == 'DSA') {
      //dsa commision-commision
      const dsacommissionRowsValid =
        this.commisionRows.value &&
        this.commisionRows.value.length > 0 &&
        this.commisionRows.value.every(isValidRow)

      //dsa commision-pf
      const dsapfRowsValid =
        this.pfRows.value &&
        this.pfRows.value.length > 0 &&
        this.pfRows.value.every(isValidRow);
      let data = {
        status: dsapfRowsValid && dsacommissionRowsValid,
        msg: 'Commission Or Processing Fee might be empty! Please Check '
      }
      return data;


    } else if (this.selectedarrangeType == 'FLDGFix') {
      // row.Value
      //fldgFix
      const fldgFixrowsValid =
        this.pfRows.value &&
        this.pfRows.value.length > 0 &&
        this.pfRows.value.every(isValidRow)
      let data = {
        status: fldgFixrowsValid,
        msg: 'Processing Fee might be empty! Please Check '
      }
      return data;
      // return fldgFixrowsValid;

    } else {
      //fldg variable--roi
      const variableRowsValid =
        this.roiRows.value &&
        this.roiRows.value.length > 0 &&
        this.roiRows.value.every(isValidRow);

      //fldg variable--pf
      const fldgvariablepfRows =
        this.pfRows.value &&
        this.pfRows.value.length > 0 &&
        this.pfRows.value.every(isValidRow);
      let data = {
        status: variableRowsValid && fldgvariablepfRows,
        msg: 'Processing Fee or Rate Of Interest might be empty! Please Check '
      }
      return data;
      // return variableRowsValid && fldgvariablepfRows;
    }
  }
  GetProductCompanyConfig() {
    debugger;
    this.Loader = true;
    this.productService
      .GetNBFCProductConfig(this.Id, this.Id2)
      .subscribe((res: any) => {
        console.log(res);
        var anchorvalue = res.returnObject[0];

        this.Loader = false;
        if (res.status) {
          this.anchorForm.controls['BounceCharges'].patchValue(
            res.returnObject[0].bounceCharges
          );
          this.anchorForm.controls['MaxBounceCharges'].patchValue(
            res.returnObject[0].maxBounceCharges
          );
          this.anchorForm.controls['MaxPenaltyCharges'].patchValue(
            res.returnObject[0].maxPenaltyCharges
          );

          this.anchorForm.controls['PenaltyCharges'].patchValue(
            res.returnObject[0].penaltyCharges
          );
          this.anchorForm.controls['PlatformFee'].patchValue(
            res.returnObject[0].platformFee
          );
          this.anchorForm.controls['InterestRate'].patchValue(
            res.returnObject[0].annualInterestRate
          );
          this.anchorForm.controls['ProcessingFee'].patchValue(
            res.returnObject[0].processingFee
          );
          this.anchorForm.controls['ProcessingFeeType'].patchValue(
            res.returnObject[0].processingFeeType
          );
          this.anchorForm.controls['ProductId'].patchValue(
            res.returnObject[0].productId
          );
          this.anchorForm.controls['ProductName'].patchValue(
            res.returnObject[0].productName
          );
          this.anchorForm.controls['AgreementStartDate'].patchValue(
            this.datePipe.transform(
              res.returnObject[0].agreementStartDate,
              'yyyy-MM-dd'
            )
          ),
            this.anchorForm.controls['AgreementEndDate'].patchValue(
              this.datePipe.transform(
                res.returnObject[0].agreementEndDate,
                'yyyy-MM-dd'
              )
            ),
            this.anchorForm.controls['AgreementURL'].patchValue(
              res.returnObject[0].agreementURL
            ),
            this.anchorForm.controls['AgreementDocId'].patchValue(
              res.returnObject[0].agreementDocId
            ),
            this.anchorForm.controls['SanctionLetterURL'].patchValue(
              res.returnObject[0].sanctionLetterURL
            ),
            this.anchorForm.controls['SanctionLetterDocId'].patchValue(
              res.returnObject[0].sanctionLetterDocId
            ),
            this.anchorForm.controls['CustomerAgreementURL'].patchValue(
              res.returnObject[0].customerAgreementURL
            ),
            this.anchorForm.controls['CustomerAgreementType'].patchValue(
              res.returnObject[0].customerAgreementType
            ),
            this.anchorForm.controls['CustomerAgreementDocId'].patchValue(
              res.returnObject[0].customerAgreementDocId
            ),
            this.anchorForm.controls['IsInterestRateCoSharing'].patchValue(
              res.returnObject[0].isInterestRateCoSharing
            ),
            this.anchorForm.controls['IsPenaltyChargeCoSharing'].patchValue(
              res.returnObject[0].isPenaltyChargeCoSharing
            ),
            this.anchorForm.controls['IsBounceChargeCoSharing'].patchValue(
              res.returnObject[0].isBounceChargeCoSharing
            ),
            this.anchorForm.controls['IsPlatformFeeCoSharing'].patchValue(
              res.returnObject[0].isPlatformFeeCoSharing
            ),
            this.anchorForm.controls['DisbursementType'].patchValue(
              res.returnObject[0].disbursementType
            ),
            this.anchorForm.controls['ArrangementType'].patchValue(
              res.returnObject[0].arrangementType
            ),
            this.anchorForm.controls['IseSignEnable'].patchValue(
              res.returnObject[0].iseSignEnable
            ),



            this.anchorForm.controls['PFSharePercentage'].patchValue(
              res.returnObject[0].pfSharePercentage
            ),
            this.anchorForm.controls['Tenure'].patchValue(
              res.returnObject[0].tenure
            ),
            this.anchorForm.controls['GSTRate'].patchValue(
              this.GSTRate
            ),
            (this.AgreementDocId = res.returnObject[0].agreementDocId);
          this.selectedProduct = {
            id: res.returnObject[0].productId,
            type: res.returnObject[0].productType,
          };
          //debugger
          this.selectedEditProduct = {
            id: res.returnObject[0].productId,
            type: res.returnObject[0].productType,
          };

          this.selectedarrangeType = res.returnObject[0].arrangementType
          this.customerAgreementURL = res.returnObject[0].customerAgreementURL;
          this.customerAgreementType =
            res.returnObject[0].customerAgreementType;





          // -----------------------------new for fldg
          debugger
          if (anchorvalue.productSlabConfigs && anchorvalue.productSlabConfigs.length > 0) {
            anchorvalue.productSlabConfigs.forEach((x: any) => {
              if (x.slabType == 'PF') {
                this.NBFCSlabForm.controls['pfValueType'].patchValue(
                  x.valueType
                )
                this.pfValueType = x.valueType
                this.pfRows.push(this.createItemFormGroup(x));
              }
              else if (x.slabType == 'ROI') {
                this.NBFCSlabForm.controls['roiValueType'].patchValue(
                  x.valueType
                )
                this.roiValueType = x.valueType
                this.roiRows.push(this.createItemFormGroup(x));
              }
              else {

                this.NBFCSlabForm.controls['commissionValueType'].patchValue(x.valueType)
                this.commissionValueType = x.valueType
                this.commisionRows.push(this.createItemFormGroup(x));




              }

            });
            debugger
            if (this.commisionRows.value.length == 0) {
              this.commissionValueType = null
              this.commisionRows.push(this.createItemFormGroup(null, 'Commission'));
            }
            console.log(this.NBFCSlabForm);
            console.log(this.commisionRows);
            console.log(this.roiRows);
          }
        }
        // ---------------------------



        if (
          this.currentdate < this.anchorForm.controls['AgreementEndDate'].value
        ) {
          this.anchorForm.controls['AgreementStartDate'].disable();
          this.anchorForm.controls['AgreementEndDate'].disable();
        }
      });

    if (this.customerAgreementType && this.customerAgreementType) {
      this.url = true;
    }
  }

  async AddProductCompany() {
    //configsave
    debugger;

    if (!this.Id || this.Id == undefined) {
      this.anchorForm.controls['AgreementURL'].patchValue(
        this.anchorForm.controls['AgreementURL'].value
          ? this.anchorForm.controls['AgreementURL'].value.split(
            this.anchorForm.controls['AgreementURL'].value
              .split('/', 3)
              .slice(1)
              .join('/')
          )[1]
          : ''
      );
    }
    if (
      this.anchorForm.controls['ProcessingFeeType'].value == 'Percentage' &&
      this.anchorForm.controls['ProcessingFee'].value > 100
    ) {
      // alert('processing fee(in %) less than 100.');
      this.messageService.add({
        severity: 'warn',
        summary: 'processing fee(in %) less than 100.',
      });
      return;
    }
    if (
      this.anchorForm.controls['PFSharePercentage'].value > 100
    ) {
      // alert('processing fee(in %) less than 100.');
      this.messageService.add({
        severity: 'warn',
        summary: 'PF Share Percentage(in %) less than 100.',
      });
      return;
    }

    if (this.Id) {
      this.anchorForm.controls['CompanyId'].patchValue(this.Id);
    }
    if (this.selectedarrangeType) {
      this.anchorForm.controls['ArrangementType'].patchValue(
        this.selectedarrangeType
      );
    }
    if (this.nfbcproductId) {
      this.anchorForm.controls['Id'].patchValue(
        this.nfbcproductId ? this.nfbcproductId : null
      );
    }
    if (
      this.anchorForm.controls['AgreementStartDate'].value >
      this.anchorForm.controls['AgreementEndDate'].value
    ) {
      // alert('End Date less than Start Date.');
      this.messageService.add({
        severity: 'warn',
        summary: 'End Date less than Start Date.',
      });

      return;
    }
    if (this.anchorForm.controls['CustomerAgreementType'].value == 'URL') {
      this.anchorForm.controls['CustomerAgreementURL'].setValidators([
        Validators.required,
      ]);
    }
    if (this.anchorForm.controls['CustomerAgreementType'].value == 'Template') {
      this.anchorForm.controls['CustomerAgreementURL'].setValidators([
        Validators.required,
      ]);
    }






    // --------------------------
    if (
      (this.selectedProduct && this.selectedProduct.type == 'BusinessLoan') ||
      this.selectedEditProduct.type == 'BusinessLoan'
    ) {
      this.anchorForm.controls['ProcessingFee'].clearValidators();
      this.anchorForm.controls['ProcessingFeeType'].clearValidators();
      this.anchorForm.controls['InterestRate'].clearValidators();
      this.anchorForm.controls['ProcessingFee'].setValue(0);

      this.anchorForm.controls['InterestRate'].setValue(0);



      this.anchorForm.controls['ProcessingFee'].updateValueAndValidity();
      this.anchorForm.controls['ProcessingFeeType'].updateValueAndValidity();
    }

    // if (this.selectedarrangeType == 'FLDGVariable') {
    //   debugger;
    //   this.anchorForm.controls['InterestRate'].clearValidators();
    //   this.anchorForm.controls['InterestRate'].setValue(0);

    //   this.anchorForm.controls['InterestRate'].updateValueAndValidity();
    // }
    // -------------------------------




    debugger;
    if (this.anchorForm.invalid) {
      const invalid = [];
      const controls = this.anchorForm.controls;
      for (const name in controls) {
        let names = this.getFormControlAlternateName(name);
        if (controls[name].invalid) {
          invalid.push(names);
        }
      }

      this.messageService.add({
        severity: 'error',
        summary: 'Enter valid details!' + invalid,
      });

      return;
    }

    if (this.selectedProduct && this.selectedProduct.type == 'BusinessLoan' || this.selectedEditProduct && this.selectedEditProduct.type == 'BusinessLoan') {
      this.minMaxError = []
      this.Type = ''
      let checks = [
        { type: 'PF', message: 'PF message' },
        { type: 'ROI', message: 'ROI message' },
        { type: 'Commission', message: 'Commission message' }
      ];


      for (const check of checks) {

        if (this.selectedarrangeType != 'DSA' && check.type == 'Commission') {
          const validateRows = this.validateRowsBasedOnSlabType('Commission');
          if (!validateRows) {
            console.log(this.minMaxError.length);

            if (this.minMaxError && this.minMaxError.length < 5 && this.minMaxError.length != 0) {
              this.messageService.add({
                severity: 'error',
                summary: this.minMaxError + '',
                detail: check.type
              });
              return;
            }
            else {
              if (this.commisionRows.length == 1) {
                const firstRow = this.commisionRows.value[0];
                const valid=this.checkCommissionRow(firstRow)
                if (!valid) {
                  this.commisionRows.removeAt(0);
                }
                else{
                  break;
                }
              }


             
              // this.commisionRows.removeAt(0)
            }
            // const result = this.checkForOverlappingRanges('Commission');
            // if (result && result.status === true) {
            //   this.messageService.add({
            //     severity: 'error',
            //     summary: result.msg,
            //   });
            //   return;
            // }
          }
          else {
            if (this.commisionRows.length == 1) {
              const firstRow = this.commisionRows.value[0];
              const valid=this.checkCommissionRow(firstRow)
              if (!valid) {
                this.commisionRows.removeAt(0);
              }
              else{
                break;
              }
            }
          }
        }



        const result = this.checkForOverlappingRanges(check.type);
        if (this.Id > 0 && this.Id2 > 0) {
          const validateRowonType = this.validateRowsBasedOnArrangementType();
          console.log('this.minMaxError',this.minMaxError);
          
          if (!validateRowonType && this.minMaxError && this.minMaxError.length > 0) {
            this.messageService.add({
              severity: 'error',
              summary: this.minMaxError + ' ',
            });
            this.Type = check.type
            // alert(this.minMaxError + check.type);
            this.isNotSlabValid = true;
            this.minMaxError = []
            return
          }
        }
        else {
          const validateRows = this.validateRowsBasedOnSlabType(check.type);
          if (!validateRows && this.minMaxError.length > 0) {
            this.messageService.add({
              severity: 'error',
              summary: this.minMaxError + ' ',
              detail: check.type,
            });
            this.Type = check.type
            this.isNotSlabValid = true;
            // this.minMaxError=[]
            return
          }
        }
        if (result && result.status === true) {
          this.messageService.add({
            severity: 'error',
            summary: result.msg,
          });
          return;
        }
      }
      if ((this.pfRows && this.pfRows.length == 0) ||
        (this.roiRows && this.roiRows.length == 0) ||
        (this.commisionRows && this.commisionRows.length == 0 && this.selectedarrangeType == 'DSA')) {
        this.messageService.add({
          severity: 'error',
          summary: 'Atleast PF/ROI/Commission must contain one slab!',
        });
        return
      }

    }




    try {
      this.Loader = true;
      this.anchorForm.controls['AgreementStartDate'].enable();
      this.anchorForm.controls['AgreementEndDate'].enable();

      // ----------------------
      //  ------------section for Buisness and slab type-----------------




      // ---------------------------------section ends

      if (this.selectedProduct && this.selectedProduct.type == 'BusinessLoan' || this.selectedEditProduct && this.selectedEditProduct.type == 'BusinessLoan') {

        if ((this.pfRows.length >= 1) || (this.roiRows.length >= 1) || (this.commisionRows.length >= 1 && this.selectedarrangeType == 'DSA')) {

          let checkSlab = this.checkSlabValidation();
          if (checkSlab && checkSlab.status) {
            let data: any = [];
            console.log(this.selectedarrangeType);


            this.pfRows.value.forEach((elem: any) => {
              let a: any = {};
              a = elem;
              data.push(a);
            });

            this.roiRows.value.forEach((elem: any) => {
              let b: any = {};
              b = elem;

              data.push(b);

            });
            this.commisionRows ? this.commisionRows.value.forEach((elem: any) => {
              let c: any = {};
              c = elem;

              data.push(c);
            }) : null;

            console.log(data);
            console.log('this.anchorForm', this.anchorForm);
            debugger


            this.anchorForm.value.ProductSlabConfigs = data;


            console.log(this.anchorForm.value);
          } else {
            this.messageService.add({ severity: 'error', summary: checkSlab.msg });

            this.Loader = false;

            return;
          }


        }

      }


      console.log(this.anchorForm.value);

      const res = await this.productService
        .AddUpdateNBFCProductConfig(this.anchorForm.value)
        .toPromise();
      console.log(res);

      this.Loader = false;

      if (res.status) {
        this.messageService.add({ severity: 'success', summary: res.message });

        let postData: any = [];
        let index1: number = 1;
        this.activityData.forEach((element: any, index: number) => {
          if (element.subActivity && element.subActivity.length > 0) {
            element.subActivity.forEach((e: any, i: number) => {
              let data: any = {
                Id: 0,
                ProductId: this.selectedProduct.id,
                ActivityMasterId: 0,
                ActivityMasterName: '',
                CompanyId: 0,
                SubActivityMasterId: null,
                SubActivityMasterName: '',
                Sequence: index1,
                IsActive: false,
              };
              (data.Id = 0), (data.SubActivityMasterId = e.subActivityMasterId);
              data.SubActivityMasterName = e.name;
              data.ProductId = this.Id2 ? this.Id2 : this.selectedProduct.id;
              data.ActivityMasterId = element.activityMasterId;
              data.ActivityMasterName = element.activity;
              data.CompanyId = this.Id;
              data.IsActive = e.isActive;
              postData.push(data);
              index1++;
            });
          } else {
            let data: any = {
              Id: 0,
              ProductId: this.selectedProduct.id,
              ActivityMasterId: 0,
              ActivityMasterName: '',
              CompanyId: 0,
              SubActivityMasterId: null,
              SubActivityMasterName: '',
              Sequence: index1,
              IsActive: false,
            };
            (data.Id = 0),
              (data.ProductId = this.Id2 ? this.Id2 : this.selectedProduct.id);
            data.ActivityMasterId = element.activityMasterId;
            data.ActivityMasterName = element.activity;
            data.CompanyId = this.Id;
            (data.SubActivityMasterId = 0),
              (data.SubActivityMasterName = ''),
              (data.IsActive = element.isActive);
            postData.push(data);
            index1++;
          }
        });
        const resActivity = await this.productService
          .AddUpdateProductActivityMaster(postData)
          .toPromise();
        console.log(resActivity);

        this.Loader = false;

        if (resActivity.status) {
          this.activityFlag = true;
          this.disableDialog.emit(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Configuration & Activity saved successfully!',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: resActivity.message,
          });
        }
      } else {
        this.messageService.add({ severity: 'error', summary: res.message });
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  checkCommissionRow(row: any) {

    const requiredFields = ['MinValue', 'MaxValue', 'MinLoanAmount', 'MaxLoanAmount', 'ValueType'];
    return requiredFields.every(field => row[field] !== null && row[field] !== undefined);
    }


  // end of code  that relate arrangetype [FLDG FIX ,VARIABLE ,DSA]

















  // ----------------------------oldddddddddd code


  getFormControlAlternateName(controlName: any): string {
    return this.alternateNames[controlName] || controlName;
  }

  onCustomerAgreementChange() {
    this.anchorForm.controls['CustomerAgreementURL'].setValue(null);
  }
  getGstRate() {
    this.productService.getGstRate().subscribe((res: any) => {
      console.log(res);
      this.GSTRate = res.returnObject;

    });
  }
  getCreditDays() {
    this.productService.GetCreditDayMastersList().subscribe((res: any) => {
      console.log(res);
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
    });
  }

  async getProductMasterList() {
    try {
      this.Loader = true;
      const res: any = await this.productService
        .GetProductMasterList(this.Id, this.CompanyType)
        .toPromise();
      console.log(res);
      this.Loader = false;
      this.productList = res.returnObject;
    } catch (error) {
      console.error(error);
      this.Loader = false;
      throw error; // Rethrow the error for handling in the calling code
    }
  }



  AddUpdateProductActivityMaster() {
    //debugger
    if (this.Id > 0 && this.selectedProduct && this.selectedProduct.id) {
      let postData: any = [];
      let index1: number = 1;
      this.activityData.forEach((element: any, index: number) => {
        if (element.subActivity && element.subActivity.length > 0) {
          element.subActivity.forEach((e: any, i: number) => {
            let data: any = {
              Id: 0,
              ProductId: this.selectedProduct.id,
              ActivityMasterId: 0,
              ActivityMasterName: '',
              CompanyId: 0,
              SubActivityMasterId: null,
              SubActivityMasterName: '',
              Sequence: index1,
              IsActive: false,
            };
            (data.Id = 0), (data.SubActivityMasterId = e.subActivityMasterId);
            data.SubActivityMasterName = e.name;
            data.ProductId = this.Id2 ? this.Id2 : this.selectedProduct.id;
            data.ActivityMasterId = element.activityMasterId;
            data.ActivityMasterName = element.activity;
            data.CompanyId = this.Id;
            data.IsActive = e.isActive;
            postData.push(data);
            index1++;
          });
        } else {
          let data: any = {
            Id: 0,
            ProductId: this.selectedProduct.id,
            ActivityMasterId: 0,
            ActivityMasterName: '',
            CompanyId: 0,
            SubActivityMasterId: null,
            SubActivityMasterName: '',
            Sequence: index1,
            IsActive: false,
          };
          (data.Id = 0),
            (data.ProductId = this.Id2 ? this.Id2 : this.selectedProduct.id);
          data.ActivityMasterId = element.activityMasterId;
          data.ActivityMasterName = element.activity;
          data.CompanyId = this.Id;
          (data.SubActivityMasterId = 0),
            (data.SubActivityMasterName = ''),
            (data.IsActive = element.isActive);
          postData.push(data);
          index1++;
        }
      });
      this.Loader = true;
      this.productService
        .AddUpdateProductActivityMaster(postData)
        .subscribe((res) => {
          console.log(res);
          this.Loader = false;
          if (res.status) {
            this.activityFlag = true;
            // alert(res.message);
            this.messageService.add({
              severity: 'success',
              summary: res.message,
            });

            if (this.configFlag && this.activityFlag) {
              this.Back();
            }
            // else{
            // alert('Save product configuration first!')
            // }
          } else {
            // alert(res.message);
            this.messageService.add({
              severity: 'error',
              summary: res.message,
            });
          }
        });
    } else {
      // alert('Select Company Product type!');
      this.messageService.add({
        severity: 'error',
        summary: 'Select Company Product type!',
      });
    }
  }

  get f() {
    return this.anchorForm.controls;
  }
  getProduct() {
    console.log();
    this.anchorForm.reset();
    this.anchorForm.controls['DisbursementType'].patchValue('FullDisbursement');
    this.anchorForm.controls['IsPlatformFeeCoSharing'].patchValue(false);
    this.anchorForm.controls['IsBounceChargeCoSharing'].patchValue(false);
    this.anchorForm.controls['IsPenaltyChargeCoSharing'].patchValue(false);
    this.anchorForm.controls['IsInterestRateCoSharing'].patchValue(false);
    this.anchorForm.controls['CustomerAgreementType'].patchValue('Template');

    this.anchorForm.controls['ProductId'].patchValue(this.selectedProduct.id);
    this.anchorForm.controls['ProductName'].patchValue(
      this.selectedProduct.type
    );
    this.anchorForm.controls['GSTRate'].patchValue(
      this.GSTRate
    )
    this.anchorForm.controls['CompanyId'].patchValue(this.Id);
    this.GetProductActivitySubActivityMasterList();
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

  isSubActivity: boolean = false;
  GetProductActivitySubActivityMasterList() {
    this.Loader = true;
    this.productService.CheckCompanyIsDefault(this.Id).subscribe((res: any) => {
      this.productService
        .GetProductActivityMasterList(this.selectedProduct.id, res)
        .subscribe((res: any) => {
          console.log(res);
          this.Loader = false;
          this.activityData = res.returnObject;
          this.selectedactivity = this.activityData;
        });
      // this.selectedactivity.foreach((x:any)=>{
      //   debugger
      //   if(x.subActivity){
      //     this.isSubActivity=true;
      //   }
      // })
    });
  }
  productCompanyActivityMasterId: any;
  nodeactivityMasterId: any;
  onNodeChange(rowData: any, rowNode: any) {
    // debugger
    this.nodeactivityMasterId = rowData.activityMasterId;
    if (rowData.subActivity && rowData.subActivity.length > 0) {
      rowData.expanded = !rowData.expanded;
    }
  }

  fillValueType() {

    const updateValueTypes = (rowsControlName: string, valueTypeControlName: string): void => {
      const rows = this.NBFCSlabForm.controls[rowsControlName]?.value;
      const valueType = this.NBFCSlabForm.controls[valueTypeControlName]?.value;

      if (rows) {
        rows.forEach((e: any) => {
          if (e.ValueType === '' || e.ValueType == null || e.ValueType) {
            e.ValueType = valueType;
          }
        });
      }
    };

    // Update ValueTypes for relevant rows
    updateValueTypes('pfRows', 'pfValueType');
    updateValueTypes('roiRows', 'roiValueType');
    updateValueTypes('commisionRows', 'commissionValueType');
  }

  onClickSaveBtn() {
    debugger
    console.log(this.NBFCSlabForm)
    this.fillValueType();


    this.submitted = true;
    console.log(typeof this.anchorForm.controls['IsAnchorProcAndTransFee']);

    // if (this.anchorForm.invalid) {
    //   return;
    // }
    if (this.Id && this.Id > 0) {
      this.AddProductCompany();
    }
    console.log(this.anchorForm.value);
  }

  ProductActivityMasterList() {
    this.Loader = true;
    this.productService
      .ProductActivityMasterList(this.Id, this.Id2)
      .subscribe((res: any) => {
        console.log(res);

        this.Loader = false;
        if (res.status) {
          this.activityData = res.returnObject;
        } else {
          this.GetProductActivitySubActivityMasterList();
        }
      });
  }

  removeImage(str: any) {
    if (str == 'AgreementURL') {
      this.isAgreementURL = false;
      this.anchorForm.controls['AgreementURL'].setValue(null);
      this.anchorForm.controls['AgreementDocId'].setValue(null);
      this.myInputVariable3.nativeElement.value = '';
    }

    if (str == 'SanctionLetterURL') {
      this.anchorForm.controls['SanctionLetterURL'].setValue(null);
      this.anchorForm.controls['SanctionLetterDocId'].setValue(null);
      this.myInputVariable1.nativeElement.value = '';
    }
    if (str == 'CustomerAgreementURL') {
      this.anchorForm.controls['CustomerAgreementURL'].setValue(null);
      this.anchorForm.controls['CustomerAgreementDocId'].setValue(null);
      this.myInputVariable2.nativeElement.value = '';
    }
  }

  upload(file: any, imgUploadType: string, event?: any) {
    if (
      (file.target.files[0].name.toLowerCase().includes('pdf') &&
        (imgUploadType == 'AgreementURL' ||
          imgUploadType == 'SanctionLetterURL')) ||
      (imgUploadType == 'CustomerAgreementURL' &&
        file.target.files[0].name.toLowerCase().includes('html'))
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
      // file.preventDefault();
    }
  }

  uploadFile(imgUploadType: any) {
    const formData = new FormData();
    formData.append('FileDetails', this.file[0]);
    formData.append('IsValidForLifeTime', 'true');
    formData.append('ValidityInDays', '');
    formData.append('SubFolderName', '');
    this.Loader = true;
    this.companyService.PostSingleFile(formData).subscribe((res: any) => {
      console.log(res);
      this.Loader = false;
      if (res.status) {
        // alert(res.message);
        this.messageService.add({ severity: 'success', summary: res.message });

        if (imgUploadType == 'AgreementURL') {
          this.AgreementDocId = res.docId;
          this.isAgreementURL = true;
          this.anchorForm.controls['AgreementURL'].patchValue(res.filePath);
          this.anchorForm.controls['AgreementDocId'].patchValue(res.docId);
        }

        if (imgUploadType == 'SanctionLetterURL') {
          this.anchorForm.controls['SanctionLetterURL'].patchValue(
            res.filePath
          );
          this.anchorForm.controls['SanctionLetterDocId'].patchValue(res.docId);
        }
        if (imgUploadType == 'CustomerAgreementURL') {
          this.anchorForm.controls['CustomerAgreementURL'].patchValue(
            res.filePath
          );
          this.anchorForm.controls['CustomerAgreementDocId'].patchValue(
            res.docId
          );
        }
      }
    });
  }

  show(input: string) {
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
  activityMasterId: any;
  subActivityMasterId: any;

  // NBFC Sub activity re-arrangement
  openNBFCSubActivityApi(data: any, type: any) {
    this.objList = [];
    this.activityMasterId = data.activityMasterId;
    this.subActivityMasterId = data.subActivityMasterId;
    this.productCompanyActivityMasterId = data.productCompanyActivityMasterId;
    this.display = true;
    let obj = {
      ActivityMasterId:
        type == 'row' ? data.activityMasterId : this.nodeactivityMasterId,
      // ActivityMasterId: type == 'row' ? 1:1,
      SubActivityMasterId: type == 'subRow' ? data.subActivityMasterId : null,
      ProductCompanyActivityMasterId: data.productCompanyActivityMasterId,
    };

    this.productService.GetNBFCSubActivityApi(obj).subscribe((x: any) => {
      this.nbfcSubActivityApiList = x;
      console.log(x);
      this.search();
    });
  }

  insertNBFCSubActivityApi() {
    if (this.nbfcSubActivityApiList.length > 0) {
      this.nbfcSubActivityApiList.forEach((x: any, index: number) => {
        // debugger;
        let obj = {
          nbfcSubActivityApiId: 0,
          nbfcCompanyApiId: x.nbfcCompanyApiId,
          apiUrl: x.apiUrl,
          code: x.code,
          activityMasterId:
            this.activityMasterId != undefined
              ? this.activityMasterId
              : this.nodeactivityMasterId,
          subActivityMasterId:
            this.subActivityMasterId != undefined
              ? this.subActivityMasterId
              : null,
          sequence: index + 1,
          productCompanyActivityMasterId: this.productCompanyActivityMasterId,
        };
        this.objList.push(obj);
      });

      this.productService
        .SaveNBFCSubActivityApi(this.objList)
        .subscribe((x: any) => {
          console.log(x);
          if (x.isSuccess) {
            // alert(x.message);
            this.messageService.add({
              severity: 'success',
              summary: x.message,
            });
          }
        });

      this.display = false;
    } else {
      // alert('please fill');
      this.messageService.add({ severity: 'error', summary: 'please fill' });
    }
    this.objList = [];
  }

  onAddRow() {
    debugger;
    if (
      this.selectedNBFCapi &&
      this.selectedNBFCapi.code &&
      !this.selectedNBFCapi.disabled
    ) {
      this.nbfcSubActivityApiList.push({
        code: this.selectedNBFCapi.code,
        apiUrl: this.selectedNBFCapi.apiUrl,
        activityMasterId:
          this.activityMasterId != undefined
            ? this.activityMasterId
            : this.nodeactivityMasterId,

        subActivityMasterId: this.subActivityMasterId,
        sequence: this.nbfcSubActivityApiList.length + 1,
        nbfcSubActivityApiId: '',
        nbfcCompanyApiId: this.selectedNBFCapi.nbfcCompanyApiId,
      });
      // Clear the input fields after adding a new row

      const selectedItem = this.dataList.find(
        (item) => item.code === this.selectedNBFCapi.code
      );
      if (selectedItem) {
        selectedItem.disabled = true;
      }

      this.Sequence = '';
      this.onRowReorder(null, 'push');
    } else {
      // alert('Code and APIUrl are required')
      console.error('Code  required');
    }
    this.selectedNBFCapi = [];
  }

  onRemoveRow(index: number) {
    // Remove the row at the specified index

    const selectedItem = this.dataList.find(
      (item) => item.code === this.nbfcSubActivityApiList[index].code
    );
    if (selectedItem) {
      selectedItem.disabled = false;
    }
    this.nbfcSubActivityApiList.splice(index, 1);

    this.onRowReorder(null, 'remove');
  }

  onRowReorder(event: any, action: string) {

  }
  selectedNBFCapi: any;
  dataList: any[] = [];
  search() {
    this.nbfcService.GetNBFCComapanyApiData(this.Id).subscribe((res: any) => {
      console.log('nbfc detail list', res);
      if (res) {
        this.dataList = res;
        this.nbfcSubActivityApiList.forEach((x: any) => {
          this.dataList.forEach((y: any) => {
            if (x.nbfcCompanyApiId == y.nbfcCompanyApiId) {
              const selectedItem = this.dataList.find(
                (item) => item.nbfcCompanyApiId == y.nbfcCompanyApiId
              );

              debugger;
              if (selectedItem) {
                selectedItem.disabled = true;
              }
              console.log(selectedItem, 'selectedItem');

              // y.nbfcCompanyApiId.disabled = true;
            }
          });
        });
      } else {
        this.dataList = [];
      }
    });
  }
}
