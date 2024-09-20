import { Component , NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryService } from '../../services/country.service';
import { CountryMasterDc } from '../../interfaces/country-masterDC';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-add-country',
  templateUrl: './add-country.component.html',
  styleUrls: ['./add-country.component.scss']
})
export class AddCountryComponent implements OnInit {
  countryMasterDc: CountryMasterDc = new CountryMasterDc;
  Id: any;
  countryForm!: FormGroup;
  submitted: boolean = false;
  Loader: boolean = false;
  constructor(private router: Router, private countryService: CountryService, private formBuilder: FormBuilder
    , private ngZone: NgZone, private activatedRoute: ActivatedRoute,
    private messageService: MessageService) {
     
      this.Id = this.activatedRoute.snapshot.paramMap.get("Id");
     }

  ngOnInit(): void {
    this.countryForm = this.formBuilder.group({
      CountryName: ['', Validators.required],
      CurrencyCode: ['', Validators.required],
      CountryCode: ['', Validators.required]
    });
      if(this.Id!=null && this.Id!=0 ){
        this.Loader=true;
        this.countryService.getCountrybyId(this.Id).subscribe(x=>{
          console.log(x)
          this.Loader=false;
          this.countryForm.controls['CountryName'].patchValue(x.returnObject.name);
          this.countryForm.controls['CurrencyCode'].patchValue(x.returnObject.currencyCode);
          this.countryForm.controls['CountryCode'].patchValue(x.returnObject.countryCode);
        })
      }
  }
  get f() { return this.countryForm.controls; }
  onKeyPress(event: KeyboardEvent): void {
    // const regex: RegExp = new RegExp('^[a-zA-Z ,.\'\\b]+$'); // Regular expression to allow specific characters
    const regex: RegExp = new RegExp('^[a-zA-Z!@#$%^&*(),.?":{}|<>]+$'); // Regular expression to allow specific special characters
    // const regex: RegExp = new RegExp('^[a-zA-Z!@#$%^&*(),.?":{}|<>]+$'); // Regular expression to allow specific alphabet and special characters


    const inputChar: string = event.key;

    if (!regex.test(inputChar)) {
      event.preventDefault();
    }
  }
  onClickSaveBtn() {
    // debugger

    this.submitted = true;
    // stop here if form is invalid
    if (this.countryForm.invalid) {
      // alert('Enter valid details!');
      this.messageService.add({ severity: 'error', summary: 'Enter valid details!'});
      return;
    } else {
      this.countryMasterDc = {
        CountryId: this.Id ? this.Id : null,
        Name: this.countryForm.value.CountryName,
        CountryCode: this.countryForm.value.CountryCode,
        CurrencyCode: this.countryForm.value.CurrencyCode

      }
      if (this.Id == null) {
        this.Loader=true;
        this.countryService.saveCountry(this.countryMasterDc).subscribe(postData => {
          this.Loader=false;
           if (postData.Status) {
          //  alert(postData.message)
           this.messageService.add({ severity: 'success', summary: postData.message });
           this.router.navigateByUrl('pages/admin/country');
          }
          else{
            // alert(postData.message)
            this.messageService.add({ severity: 'error', summary: postData.message});

          }
         
        })
      } else {
        this.Loader=true;
        this.countryService.updateCountry(this.countryMasterDc).subscribe(postData => {
          this.Loader=false;
          if (postData.Status) {
          //  alert(postData.message)
           this.messageService.add({ severity: 'success', summary: postData.message });
           this.router.navigateByUrl('pages/admin/country');
          }
          else{
            // alert(postData.message)
            this.messageService.add({ severity: 'error', summary: postData.message});
          }
        }
        )
      }
      this.router.navigateByUrl('pages/admin/country');

    }
  }
  
   space(event:any) {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }

  onClickBackBtn() {
    this.router.navigateByUrl('pages/admin/country');
  }

  omit_special_char(event:any)
  {   
    if ((event.key == '1') || (event.key == '2') || (event.key == '3') || (event.key == '4') || (event.key == '5') || (event.key == '6') || (event.key == '7') || (event.key == '8') || (event.key == '9')) {
      event.preventDefault();
    }

    var k;  
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  }
}
