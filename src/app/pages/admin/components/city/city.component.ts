import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from 'app/shared/services/loader.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CityService } from '../../services/city.service';
import {MultiSelectModule} from 'primeng/multiselect';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent {
  cityList : any;
  stateList : any;
  Loader:boolean=false;
  constructor(private router : Router,private cityService : CityService,private confirmationService: ConfirmationService
    ,private ngZone: NgZone,private messageService: MessageService, private loaderService : LoaderService) {
      this.cityId=0;
     }

  ngOnInit(): void {

    debugger
    this.loaderService.isLoading(true);
    this.Loader=true;
    this.cityService.getCityList().subscribe((getData:any)=>{
      this.Loader=false;
      this.cityList = getData;
      // this.loaderService.isLoading(false);

      //console.log('cityList',this.cityList);
    })
  }
  onClickAddBtn(){
    this.router.navigateByUrl('pages/admin/city/addcity')
  }
  onClickEdit(city:any){
    this.router.navigateByUrl('pages/admin/city/addcity/' + city.id);
  }
  // onClickDelete(city:any){
  //   this.confirmationService.confirm({
  //     message: 'Are you sure want to delete confirmation?',
  //     accept:  ()=>{
  //       this.loaderService.isLoading(true);
  //       this.cityService.deleteCityMaster(city.Id).subscribe((getData:any)=>{
  //         ;
  //         if(getData == true){
  //           this.loaderService.isLoading(false);
  //           setTimeout(() => {
  //             this.ngZone.run(() => {
  //               this.messageService.add({
  //                 severity: "success",
  //                 summary: 'Data Deleted Successfully',
  //                 detail: "",
  //                 life: 3000 
  //               });
  //             });
  //           }, 1000);
  //           alert('Data Deleted Successfully');
  //           this.ngOnInit();
  //         }
  //       })
  //     } 
  //   })    
  // }

  cityId:number;
  IsActive: boolean = false;
  ActiveInactive(product:number, IsActive:boolean,productDetail:any) {
    this.cityId = product;
    //console.log(IsActive, 'IsActive');
    //console.log(productDetail, 'productDetail');
    if (IsActive == true) {
      var activeData = 'Active';
    } else {
      activeData = 'InActive'
    }
    this.confirmationService.confirm({
      message: 'Are you sure want to' + ' ' + activeData + ' ' + 'this confirmation?',
      accept: () => {
        this.Loader=true;
        this.cityService.activeInactiveStatus(this.cityId, IsActive).subscribe(x => {
          this.Loader=false;
          //console.log(x, 'x');
          ;
          productDetail.status = IsActive;
          //this.loaderService.isLoading(false);
          if (x.status) {
            // ;
            if(IsActive == false){
              // alert('City InActivated Successfully.'); //  alert(x.Msg);
              this.messageService.add({ severity: 'success', summary:'City InActivated Successfully.' });

            }else{
              // alert('City Activated Successfully.');
              this.messageService.add({ severity: 'success', summary:'City Activated Successfully.' });

            }   
            this.ngOnInit();        
            this.ngOnInit();
          } else {
            // alert(x.Msg);
            this.messageService.add({ severity: 'error', summary: x.Msg});

            this.ngOnInit();
          }
        });        
      },
      reject: () => {
        this.IsActive = !IsActive;
        productDetail.status = this.IsActive;
      }
    })
  }
}
