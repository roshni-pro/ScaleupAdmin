import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CityMasterdc } from '../../interfaces/city-masterdc';
import { CityService } from '../../services/city.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.scss'],
})
export class AddCityComponent {
  states: any;
  cityForm: FormGroup;
  submitted: boolean = false;
  Id: any;
  cityMasterDc: CityMasterdc;
  Loader: boolean = false;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private cityService: CityService,
    private stateService: StateService,
    private activatedRoute: ActivatedRoute,
    private ngZone: NgZone,
    private messageService: MessageService
  ) {
    this.cityForm = this.formBuilder.group({
      CityName: ['', Validators.required],
      StateId: ['', Validators.required],
    });
    this.cityMasterDc = {
      Id: null,
      CityName: '',
      StateId: 0,
    };
  }

  ngOnInit(): void {
    this.Id = this.activatedRoute.snapshot.paramMap.get('Id');
    this.cityForm = this.formBuilder.group({
      CityName: ['', Validators.required],
      StateId: ['', Validators.required],
    });
    if (this.Id != null) {
      this.Loader = true;
      this.cityService.getByCityId(parseInt(this.Id)).subscribe((x) => {
        // debugger;
        this.Loader = false;
        this.cityForm = this.formBuilder.group({
          CityName: [x.returnObject.name, Validators.required],
          StateId: [x.returnObject.stateId, Validators.required],
        });
      });
    }
    this.Loader = true;
    this.stateService.getStateList().subscribe((x) => {
      this.Loader = false;
      this.states = x.returnObject;
      //console.log('states', this.states);
    });
  }
  get f() {
    return this.cityForm.controls;
  }
  get StateId() {
    return this.cityForm.get('StateId');
  }
  onClickSaveBtn() {
    // this.router.navigateByUrl('pages/admin/city');
    this.submitted = true;

    // stop here if form is invalid
    if (this.cityForm.invalid) {
      return;
    } else {
      this.cityMasterDc = {
        Id: parseInt(this.Id) ? parseInt(this.Id) : null,
        CityName: this.cityForm.value.CityName,
        StateId: this.cityForm.value.StateId,
      };
      if (this.Id == null) {
        this.Loader = true;
        this.cityService.saveCity(this.cityMasterDc).subscribe((postData) => {
          // debugger
          this.Loader = false;
          if (postData.status) {
            // alert(postData.message);
            this.messageService.add({ severity: 'success', summary:postData.message });
            this.router.navigateByUrl('pages/admin/city');
          } else {
            // alert(postData.message);
            this.messageService.add({ severity: 'error', summary:postData.message });
          }
        });
      } else {
        this.Loader = true;
        this.cityService
        .updateCityMaster(this.cityMasterDc)
        .subscribe((postData) => {
          this.Loader = false;
          if (postData.status) {
            // alert(postData.message);
            this.messageService.add({ severity: 'success', summary:postData.message });
            this.router.navigateByUrl('pages/admin/city');
          } else {
            // alert(postData.message);
            this.messageService.add({ severity: 'error', summary:postData.message });
            }
          });
      }
    }

    // display form values on success
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.cityForm.value, null, 4));
  }
  onReset() {
    this.submitted = false;
    this.cityForm.reset();
  }
  onClickBackBtn() {
    this.router.navigateByUrl('pages/admin/city');
  }

  space(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
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
