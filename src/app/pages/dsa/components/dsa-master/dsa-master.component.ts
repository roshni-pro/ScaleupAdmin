import { Component } from '@angular/core';
import { DsaService } from '../../services/dsa.service';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Route, Router } from '@angular/router';
import { ExportService } from 'app/shared/scale-up-shared/services/export.service';
@Component({
  selector: 'app-dsa-master',
  templateUrl: './dsa-master.component.html',
  styleUrls: ['./dsa-master.component.scss']
})
export class DsaMasterComponent {
//   StatusList = [
//     { value: '', label: 'All' },
//     { value: 'Initiate', label: 'Initiate' },
//     { value: 'KYCInProcess', label: 'KYCInProgress' },
//     { value: 'KYCSuccess', label: 'KYCSuccess' },
//     { value: 'Submitted', label: 'Submitted' },
//     { value: 'AgreementInProgress', label: 'Agreement In-Prog.' },
//     { value: 'AgreementSigned', label: 'Agreement Signed' },
//     { value: 'Activated', label: 'Activated' },
//     // { value: 'KYCReject', label: 'KYCReject' },
//     // { value: 'BankAdded', label: 'BankAdded' },
//     // { value: 'Rejected', label: 'Rejected' }
//     // { value: 'LineActivated', label: 'LineActivated' },
// ];
StatusList:any
StatusFilter: any;
CityList: any;
DsaLeadData: any;
totalcount: number=0;
rangeDates: any;
type:any=[
  { value: 'All', label: 'All' },
  { value: 'DSA', label: 'DSA' },
  { value: 'Connector', label: 'Connector' }]

  constructor(private _dsaService:DsaService, private messageService: MessageService, private router: Router
    ,private _export:ExportService
  ){
    this.selectedType = this.type[0];
  }
async ngOnInit(): Promise<void> {
  await this.GetCityList();
  await this.GetStatusList()
  // if(this.StatusFilter){
  //   await this.StatusSearch('search');
  // }

}

async GetStatusList(){
  try {
  this.Loader=true
  var res = await this._dsaService.GetStatusList('DSA').toPromise();
  this.StatusList=res;
  this.StatusFilter = this.StatusList[0].value;
  this.Loader=false

}
catch (error: any) {
  this.Loader=false;
  throw error.message;
}
}

  async StatusSearch(search: any) {
  await this.search(null);
}
removeDuplicatesByField(array:any, field:any) {
  // Create a set to efficiently store unique values
  const uniqueValues = new Set();
  // Iterate over the array, checking if the field value is unique
  return array.filter((obj:any) => {
    const fieldValue = obj[field];
    if (!uniqueValues.has(fieldValue)) {
      uniqueValues.add(fieldValue);
      return true; // Keep the object
    }
    return false; // Discard the duplicate
  });
}

async GetCityList() {
  try {
      this.Loader=true;
      //var workingLocationCities = await this._dsaService.GetDSACityList("Connector").toPromise();
      var res = await this._dsaService.getCityList().toPromise();
      console.log(res, 'citylist');
      this.Loader=false;
      // if(workingLocationCities!=null && workingLocationCities.status && workingLocationCities.response.length>0){
      //   workingLocationCities.response.forEach((element:any) => {
      //     res.push(element);
      //   });
      // }
      res.forEach((element:any) => {
        element.cityName = element.cityName.toLowerCase()
        const words = element.cityName.split(" ");
        element.cityName  = words.map((word:any) => { 
            return word[0].toUpperCase() + word.substring(1); 
        }).join(" ");
      });
      if (res) {
        const uniqueArray = this.removeDuplicatesByField(res, "cityName");
        this.cityList = uniqueArray;
      }
      else {
        this.cityList = [];
      }
    } catch (error: any) {
      this.Loader=false;
      throw error.message;
  }
}


first:number=0
skip:number=0
take:number=10
Keyword:string=''
selectedCity:any=''
searchPayload: DSALeadListPageRequest={
  Keyword:''  ,
  FromDate:'',
  ToDate:'',
  CityId:0,
  Skip:0,
  Take:10,
  ProductType:'',
  Status:'',
  CityName:'',
  isDelete:false
};
ShowWorkingLocation :boolean = true;
cityList:any=[]
Loader:boolean=false
selectedType:any
async search(event: any) {
  this.first = 0;
  var Last = event ? event.first + event.rows : 10;
  this.skip = event ? Last / event.rows : Last / 10;
  this.take = event ? event.rows : 10;
  var productid
  var companyid
  var FromDate
  var ToDate
  var Status = this.StatusFilter=='All' ?  '':this.StatusFilter; 

  if (this.rangeDates && this.rangeDates.length == 2) {
      FromDate = this.rangeDates[0];
      ToDate = this.rangeDates[1];
  }
  
          this.totalcount = 0;
          this.searchPayload = {
              "Keyword": this.Keyword ? this.Keyword : "",
              "FromDate": FromDate ? moment(FromDate).format('yyyy-MM-DD') : null,
              "ToDate": ToDate ? moment(ToDate).format('yyyy-MM-DD') : null,
              "CityId": this.selectedCity ? this.selectedCity.id : 0,
              "CityName":this.selectedCity?this.selectedCity.cityName:null,
              "Status": Status,
              "Skip": this.skip ? this.skip : 0,
              "Take": this.take ? this.take : 10,
              "ProductType":this.selectedType?this.selectedType.value: "All",
              "isDelete":(Status =='Deleted' || Status ==''  || Status ==undefined) ?true :false
          }
          // if(this.selectedType!=null && this.selectedType.value !='DSA' ){
          //   this.ShowWorkingLocation= true;
          // }else{
          //   this.ShowWorkingLocation= false;
          // }
          console.log(this.searchPayload, 'payload');

    try {
      this.Loader=true;
      this.DsaLeadData=[]

      var x = await this._dsaService.GetDsaLeadData(this.searchPayload).toPromise();
      if(x.leadListPageDTO && x.leadListPageDTO.length > 0){

        this.DsaLeadData = x.leadListPageDTO;
        this.totalcount = x.totalCount;
        this.Loader = false
        console.log(x, 'reslistdata');
      }
      else{
              this.messageService.add({ severity: 'error', summary: 'No Data Found ', detail: '' });
              this.Loader = false

      }

    }
    catch (error: any) {
      this.Loader=false;
      throw error.message;
  }

}

Export(){
  var FromDate
  var ToDate
  var Status = this.StatusFilter ? this.StatusFilter : '';
  if (this.rangeDates && this.rangeDates.length == 2) {
    FromDate = this.rangeDates[0];
    ToDate = this.rangeDates[1];
}
  let searchPayload = {
    "Keyword": this.Keyword ? this.Keyword : "",
    "FromDate": FromDate ? moment(FromDate).format('yyyy-MM-DD') : null,
    "ToDate": ToDate ? moment(ToDate).format('yyyy-MM-DD') : null,
    "CityId": this.selectedCity ? this.selectedCity.id : 0,
    "CityName": this.selectedCity ? this.selectedCity.cityName : null,
    "Status": '',
    "Skip":  0,
    "Take":  0,
    "ProductType":this.selectedType?this.selectedType.value: "All",
    "isDelete":(Status =='Deleted' || Status =='') ?true :false
}
console.log(searchPayload, 'payload for export');
this.Loader = true,
      // this.DsaLeadData=[]
      this._dsaService.GetDsaLeadData(searchPayload).subscribe((x: any) => {
        console.log(x);
        
          if(x.leadListPageDTO && x.leadListPageDTO.length > 0){
            this.Loader = false

            var i = 0;

            // let exportdata:any[] = x.leadListPageDTO.map(function (a: any) {
            //   i = i + 1;
            //   return {
            //     'SR NO': i,
            //     "productCode": a.productCode,
            //     "customerName": a.customerName,
            //     "mobileNo":a.mobileNo ,
            //     "alternatePhoneNo": 
            //     a.alternatePhoneNo,
            //     "profileType": a.profileType,
            //     "businessName": a.companyName,
            //     "cityName": a.cityName,
            //     "workingLocation": a.workingLocation,
            //     "businessType": a.firmType,
            //     "payoutPercentage":a.payoutPercentage,
            //     "agreementStartDate": a.agreementStartDate,
            //     "agreementEndDate": a.agreementEndDate,
            //     "status": a.status,
            //   };
            // });
            let exportdata: any[] = [];

            x.leadListPageDTO.forEach(function (a: any) {
              i = i + 1;
              a.salesAgentCommissions &&  a.salesAgentCommissions.length>0 ?
               a.salesAgentCommissions.forEach((commission: any) => {
               
                  exportdata.push({
                    'SR NO': i,
                    "Product Code": a.productCode,
                    "Customer Name": a.customerName,
                    "MobileNo": a.mobileNo,
                    "Alternate PhoneNo": a.alternatePhoneNo,
                    "Profile": a.profileType,
                    "Business Name": a.companyName,
                    "City": a.cityName,
                    "Working Location": a.workingLocation,
                    "BusinessType": a.firmType,
                    "Minimum Disbursement Amt":  commission.minAmount || null,
                    "Maximum Disbursement Amt":  commission.maxAmount || null,
                    "Payout % ":  commission.payoutPercentage || null,
                    "Agreement Start Date": a.agreementStartDate,
                    "Agreement End Date": a.agreementEndDate,
                    "Status": a.status,
                  });
              }) :
             
              exportdata.push({
                  'SR NO': i,
                  "Product Code": a.productCode,
                  "Customer Name": a.customerName,
                  "MobileNo": a.mobileNo,
                  "Alternate PhoneNo": a.alternatePhoneNo,
                  "Profile": a.profileType,
                  "Business Name": a.companyName,
                  "City": a.cityName,
                  "Working Location": a.workingLocation,
                  "BusinessType": a.firmType,
                  "Minimum Disbursement Amt":  null,
                  "Maximum Disbursement Amt":  null,
                  "Payout % ":  null,
                  "Agreement Start Date": a.agreementStartDate,
                  "Agreement End Date": a.agreementEndDate,
                  "Status": a.status,
              });
              ;
          });




            console.log(exportdata, 'reslistdata');
            this._export.exportAsExcelFile(exportdata,'DsaLeadData')
          }
          else{
                  this.messageService.add({ severity: 'error', summary: 'No Data Found ', detail: '' });
                  this.Loader = false

          }
          // localStorage.removeItem('ListPagePayload');
      }, (error: any) => {
          this.Loader = false;
          console.log(error);

      })
}

navigate(leadData: any) {

  const protocol = window.location.protocol;
  const host = window.location.hostname;
  const port = window.location.port;
  const baseUrl = `${protocol}//${host}`;
  // if (port) {
  //   window.open(`${baseUrl}:${port}` + '/#/pages/dsa/dsa-detail'+leadData.leadId,'_blank'); //+ rowData.InvoiceNo
  // } else {
  //   window.open(`${baseUrl}` + '/#/pages/dsa/dsa-detail'+leadData.leadId,'_blank');
  // }

  let setData={
    userId:leadData.userId,
    leadId:leadData.leadId,
    status:leadData.status
  }
  localStorage.removeItem('DsaleadData')
  const objectString = JSON.stringify(setData);
  localStorage.setItem("DsaleadData", objectString)
  this.router.navigateByUrl('pages/dsa/dsa-master/dsa-detail');
  // this.router.navigateByUrl('pages/dsa/dsa-detail');
}

}

interface DSALeadListPageRequest{
   Keyword:string  
   FromDate:any
   ToDate:any
   CityId:number
   Skip:number
   Take:number
   ProductType:string
   Status:string
   CityName:string
   isDelete:boolean

}



  // let previousPayload =null //localStorage.getItem('ListPagePayload');
  // if ( this.Keyword != null || (FromDate != null && ToDate != null) || this.selectedCity > 0 || (previousPayload && previousPayload != '')) {
  //     if (previousPayload && previousPayload != '') {
  //         this.searchPayload = JSON.parse(previousPayload);
  //         console.log(this.searchPayload, 'searchPayload');

      
  //         if (this.searchPayload.Skip > 0 && this.searchPayload.Take > 0) {
  //             this.skip = this.searchPayload.Skip;
  //             this.take = this.searchPayload.Take;
  //             this.first = (this.skip - 1) * this.take;
  //         }
     
   

 

  //         if (this.searchPayload.FromDate != null && this.searchPayload.ToDate != null) {
  //             this.rangeDates = [];
  //             this.rangeDates[0] = new Date(this.searchPayload.FromDate)
  //             this.rangeDates[1] = new Date(this.searchPayload.ToDate)
  //             console.log(this.rangeDates);
  //         }

  //         if (this.searchPayload.Keyword != null) {
  //             this.Keyword = this.searchPayload.Keyword;
  //         }
  //         if (this.searchPayload.CityId > 0) {
  //             await this.GetCityList();
  //             if (this.cityList != null) {
  //                 this.cityList.forEach((x: any) => {
  //                     if (x.id == this.searchPayload.CityId) {
  //                         this.selectedCity = x;
  //                     }
  //                 })
  //             }
  //         }
  //         if (this.searchPayload.CityId > 0) {
  //             if (this.cityList == null || this.cityList == undefined) {
  //                 await this.GetCityList();
  //                 if (this.cityList != null) {
  //                     this.cityList.forEach((x: any) => {
  //                         if (x.id == this.searchPayload.CityId) {
  //                             this.selectedCity = x;
  //                         }
  //                     })
  //                 }
  //             }
  //         }
  //     } else {