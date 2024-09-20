import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StateMasterdc } from '../../interfaces/state-masterdc';
import { CountryService } from '../../services/country.service';
import { StateService } from '../../services/state.service';
import { CommonValidationService } from 'app/shared/services/common-validation.service';

@Component({
  selector: 'app-add-state',
  templateUrl: './add-state.component.html',
  styleUrls: ['./add-state.component.scss'],
})
export class AddStateComponent {
  countries: any;
  Id: any;
  stateForm: FormGroup;
  submitted: boolean = false;
  stateMasterDc: StateMasterdc;
  Loader: boolean = false;
  constructor(
    private router: Router,
    private countryService: CountryService,
    private stateService: StateService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private messageService: MessageService,
    private commonValidation: CommonValidationService,

  ) {
    this.stateForm = this.formBuilder.group({
      StateName: ['', Validators.required],
      StateCode: ['', Validators.required],
      CountryId: ['', Validators.required],
    });
    this.stateMasterDc = {
      StateId: null,
      Name: '',
      CountryId: 0,
      StateCode: '0',
    };
  }
  ngOnInit(): void {
    debugger;
    this.Id = this.activatedRoute.snapshot.paramMap.get('Id');

    if (this.Id != null) {
      this.Loader = true;
      this.stateService.getStateById(parseInt(this.Id)).subscribe((x) => {
        // debugger
        this.Loader = false;
        this.stateForm = this.formBuilder.group({
          StateName: [x.returnObject.name, Validators.required],
          StateCode: [x.returnObject.stateCode, Validators.required],
          CountryId: [x.returnObject.countryId, Validators.required],
        });
      });
    }
    this.Loader = true;
    this.countryService.getCountryList().subscribe((x) => {
      this.Loader = false;
      this.countries = x.returnObject;
      console.log('countries', this.countries);
    });
  }
  get f() {
    return this.stateForm.controls;
  }
  get CountryId() {
    return this.stateForm.get('CountryId');
  }
  // onChange(e){
  //   this.stateForm.value.CountryId.setValue(e.target.value, {
  //     onlySelf: true
  //   })
  // }
  onClickSaveBtn() {
    debugger;
    // this.router.navigateByUrl('pages/admin/state');
    this.submitted = true;
    // stop here if form is invalid
    if (this.stateForm.invalid) {
      alert('Enter valid details!');
      this.messageService.add({ severity: 'error', summary: 'Enter valid details!'});
      return;
    } else {
      this.stateMasterDc = {
        StateId: parseInt(this.Id) ? parseInt(this.Id) : null,
        Name: this.stateForm.value.StateName,
        StateCode: this.stateForm.value.StateCode,
        CountryId: this.stateForm.value.CountryId,
      };
      if (this.Id == null) {
        this.Loader = true;
        this.stateService
          .saveState(this.stateMasterDc)
          .subscribe((postData) => {
            this.Loader = false;
            if (postData.status) {
              // alert(postData.message)
              this.messageService.add({ severity: 'success', summary: postData.message });
              this.router.navigateByUrl('pages/admin/state');
            }
            else{
              // alert(postData.message)
              this.messageService.add({ severity: 'error', summary: postData.message});

            }
          });
      } else {
        debugger;
        this.Loader = true;
        this.stateService
          .updateState(this.stateMasterDc)
          .subscribe((postData: any) => {
            this.Loader = false;
            if (postData.status) {
              // alert(postData.message)
              this.messageService.add({ severity: 'success', summary: postData.message });
              this.router.navigateByUrl('pages/admin/state');
            }
            else{
              // alert(postData.message)
              this.messageService.add({ severity: 'error', summary: postData.message});
            }

            // setTimeout(() => {
            //     this.ngZone.run(() => {
            //       this.messageService.add({
            //         severity: "success",
            //         summary: 'State Updated Successfully',
            //         detail: "",
            //         life: 3000
            //       });
            //     });
            //   }, 1000);
            //   setTimeout(() => {
            //     //alert('State Updated Successfully');
            //     if(postData.Result == false){
            //       alert(postData.Msg)
            //     }
            //     this.router.navigateByUrl('pages/admin/state');
            //   }, 1000);
            //  }
            //else {
            //   setTimeout(() => {
            //     this.ngZone.run(() => {
            //       this.messageService.add({
            //         severity: "error",
            //         summary: postData.Msg,
            //         detail: "",
            //         life: 3000
            //       });
            //     });
            //   }, 1000);

            // }
          });
      }
    }
  }

  space(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }

  onPaste(e: any) {
    var res = this.commonValidation.onPaste(e);
  }
  keyPress(e: any) {
    var res = this.commonValidation.keyPress(e);
  }

  NumberOnly (e:any) {  // Accept only alpha numerics, not special characters 
    var res = this.commonValidation.numberOnly(e)

  } 
  onClickBackBtn() {
    this.router.navigateByUrl('pages/admin/state');
  }

  omit_special_char(event: any) {
    if (
      event.key == '1' ||
      event.key == '2' ||
      event.key == '3' ||
      event.key == '4' ||
      event.key == '5' ||
      event.key == '6' ||
      event.key == '7' ||
      event.key == '8' ||
      event.key == '9'
    ) {
      event.preventDefault();
    }

    var k;
    k = event.charCode; //         k = event.keyCode;  (Both can be used)
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 32 ||
      (k >= 48 && k <= 57)
    );
  }
}
