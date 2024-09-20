import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CountryService } from '../../services/country.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit  {
  countryList: any;
  Loader:boolean=false;
  constructor(private router: Router, private countryService: CountryService, private ngZone: NgZone,private messageService: MessageService

     ) { }
  ngOnInit(): void {
    this.getCountryList();
  }
  getCountryList (){
    this.Loader=true;
    this.countryService.getCountryList().subscribe((getData:any) => {
      console.log(getData)
      this.Loader=false;
      this.countryList = getData.returnObject;
    })
  }
  onClickAddBtn() {
    this.router.navigateByUrl('pages/admin/country/addcountry')
  }
  onClickEdit(country:any) {
    this.router.navigateByUrl('pages/admin/country/addcountry/' + country.id);

  }
  onClickDelete(country:any) {
    this.Loader=true;
        this.countryService.DeleteCountry(country.Id).subscribe((getData:any) => {
          this.Loader=false;
          if (getData == true) {
            // alert('Data Deleted Successfully');
            this.messageService.add({ severity: 'success', summary: 'Data Deleted Successfully' });

            this.ngOnInit();
          }
        })
  }
}
