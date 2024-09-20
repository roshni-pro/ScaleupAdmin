import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { LeadService } from '../../services/lead.service';
import { Route, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ExportService } from 'app/shared/scale-up-shared/services/export.service';
import * as moment from 'moment';
import { SharedModule } from 'app/shared/shared.module';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-lead-page',
    templateUrl: './lead-page.component.html',
    styleUrls: ['./lead-page.component.scss']
})
export class LeadPageComponent implements OnInit {
    leadPageData: any
    totalcount: number = 0;
    skip: number = 1;
    take: number = 10;
    Loader: boolean = false;
    Keyword: any;
    companyData: any;
    selectedcompany: any;
    productList: any
    selectedproduct: any
    listpagePayload: any
    rangeDates: Date[] = [];
    StatusFilter: any;
    cityList: any = ([] = []);
    selectedCity: any;
    public dateFormat: string = 'dd/mm/yy';
    first: number = 0;
    roleList:any;
    roleName:any;
    isSuperadminrole:boolean = false;
    @ViewChild('sellerOfferCalendar') sellerOfferCalendar: any;
    @Output() LeadDetailsEvent = new EventEmitter<boolean>();
    searchPayload: any;
    constructor(private _leadService: LeadService, private router: Router, private messageService: MessageService, private exportService: ExportService, private datePipe: DatePipe, private confirmationService: ConfirmationService) {

    }



    StatusList = [
        { value: '', label: 'All' },
        { value: 'Initiate', label: 'Initiate' },
        { value: 'KYCInProcess', label: 'KYCInProcess' },
        { value: 'KYCSuccess', label: 'KYCSuccess' },
        { value: 'KYCReject', label: 'KYCReject' },
        { value: 'BankAdded', label: 'BankAdded' },
        { value: 'Submitted', label: 'Submitted' },
        { value: 'Rejected', label: 'Rejected' }
        // { value: 'LineActivated', label: 'LineActivated' },
    ];

    async ngOnInit(): Promise<void> {
        this.listpagePayload = localStorage.getItem('ListPagePayload')
        this.listpagePayload = JSON.parse(this.listpagePayload);

        // this._leadService.GetCompanyList().subscribe((x: any) => {
        //     this.companyData = x.returnObject.filter((y: any) => y.companyType == 'Anchor')
        //     console.log(this.companyData, 'this.companyData');
        // })


        this.roleName = localStorage.getItem('roles');
        
        this.roleList = this.roleName.split(',');
        console.log(this.roleList);
        for (var i in this.roleList) {
            if (this.roleList[i].toLowerCase() == 'superadmin'.toLowerCase()) {
                this.isSuperadminrole = true;
            }
            // if (this.roleList[i].toLowerCase() == 'AdminUser'.toLowerCase()) {
            //     this.isAdminrole = true;
            // }
        }

        await this.GetCompanyList();
        await this.GetCityList();

        this.StatusFilter = this.StatusList[0].value;

        this.StatusSearch('search');
    }

    async GetCompanyList() {
        try {
            // var company = await this._leadService.GetCompanyList().toPromise();
            var company = await this._leadService.GetAnchorCompaniesByProduct('CreditLine').toPromise();
            // .subscribe((x: any) => {
            console.log(company, 'company');

            if (company != null && company.status && company.response.length > 0 ) {
                // this.companyData = company.returnObject.filter((y: any) => y.companyType == 'Anchor')
                this.companyData = company.response.filter((y: any) => y.companyType == 'Anchor')
                if (this.companyData.length > 0) {
                    this.selectedcompany = this.companyData[0]
                }
            }
        } catch (error: any) {
            // alert(error.message);
        }
        if (this.selectedcompany != null) {
            await this.getProduct(this.selectedcompany);
        }
        // })
    }

    async getProduct(selectedcompany: any) {
        // console.log(selectedcompany);

        localStorage.setItem('selectedcompany', JSON.stringify(this.selectedcompany.id));

        if (selectedcompany != null) {

            if (selectedcompany.id != undefined || selectedcompany.id != null) {
                var res = await this._leadService.GetProductMasterList(selectedcompany.id).toPromise();
                // .subscribe((res: any) => {
                this.productList = res.returnObject
                console.log(this.productList, "productlist");
                // });
            }
        }
    }

    async search(event: any) {
        this.first = 0;
        var Last = event ? event.first + event.rows : 10;
        this.skip = event ? Last / event.rows : Last / 10;
        this.take = event ? event.rows : 10;
        var productid
        var companyid: any = [];
        var FromDate
        var ToDate
        var Status = this.StatusFilter ? this.StatusFilter : '';
        if (this.selectedproduct != null) {
            productid = this.selectedproduct.productId
        }
        if (this.selectedcompany != null) {
            companyid.push(this.selectedcompany.id);
        }
        if (this.rangeDates && this.rangeDates.length == 2) {
            FromDate = this.rangeDates[0];
            ToDate = this.rangeDates[1];
        }

        let previousPayload = localStorage.getItem('ListPagePayload');
        if (companyid || productid || this.Keyword != null || (FromDate != null && ToDate != null) || this.selectedCity > 0 || (previousPayload && previousPayload != '')) {
            if (previousPayload && previousPayload != '') {
                this.searchPayload = JSON.parse(previousPayload);
                console.log(this.searchPayload, 'searchPayload');

                let companyid: any = [], productid: number;
                companyid = this.searchPayload.CompanyId[0];
                productid = this.searchPayload.ProductId;

                if (this.searchPayload.Skip > 0 && this.searchPayload.Take > 0) {
                    this.skip = this.searchPayload.Skip;
                    this.take = this.searchPayload.Take;
                    this.first = (this.skip - 1) * this.take;
                }
                // if (this.companyData != null) {
                //     this.companyData.forEach((element: any) => {
                //         if (element.id == companyid) {
                //             this.selectedcompany = element;
                //         }
                //     })
                //     console.log(this.selectedcompany, 'selected company');
                // }
                // if (this.companyData == undefined || this.companyData == null) {
                //     await this.GetCompanyList();
                //     if (this.companyData != null) {
                //         this.companyData.forEach((element: any) => {
                //             if (element.id == companyid) {
                //                 this.selectedcompany = element;
                //             }
                //         })
                //     }
                //     console.log(this.selectedcompany, 'selected company');
                // }

                if (this.companyData != null) {
                    this.companyData.forEach((element: any) => {
                        if (element.id == companyid[0]) {
                            this.selectedcompany = element;
                        }
                    })
                    console.log(this.selectedcompany, 'selected company');
                }
                if (this.companyData == undefined || this.companyData == null) {
                    await this.GetCompanyList();
                    if (this.companyData != null) {
                        this.companyData.forEach((element: any) => {
                            if (element.id == companyid[0]) {
                                this.selectedcompany = element;
                            }
                        })
                    }
                    console.log(this.selectedcompany, 'selected company');
                }

                if (this.productList != null) {
                    this.productList.forEach((element: any) => {
                        if (element.productId == productid) {
                            this.selectedproduct = element;
                        }
                    })
                }

                if ((this.productList == null || this.productList == undefined) && this.selectedcompany != null) {
                    await this.getProduct(this.selectedcompany);
                    this.productList.forEach((element: any) => {
                        if (element.productId == productid) {
                            this.selectedproduct = element;
                        }
                    })
                }

                if (this.searchPayload.FromDate != null && this.searchPayload.ToDate != null) {
                    this.rangeDates = [];
                    this.rangeDates[0] = new Date(this.searchPayload.FromDate)
                    this.rangeDates[1] = new Date(this.searchPayload.ToDate)
                    console.log(this.rangeDates);
                }

                if (this.searchPayload.Keyword != null) {
                    this.Keyword = this.searchPayload.Keyword;
                }
                if (this.searchPayload.CityId > 0) {
                    await this.GetCityList();
                    if (this.cityList != null) {
                        this.cityList.forEach((x: any) => {
                            if (x.id == this.searchPayload.CityId) {
                                this.selectedCity = x;
                            }
                        })
                    }
                }
                if (this.searchPayload.CityId > 0) {
                    if (this.cityList == null || this.cityList == undefined) {
                        await this.GetCityList();
                        if (this.cityList != null) {
                            this.cityList.forEach((x: any) => {
                                if (x.id == this.searchPayload.CityId) {
                                    this.selectedCity = x;
                                }
                            })
                        }
                    }
                }
            } else {
                this.totalcount = 0;
                this.searchPayload = {
                    "CompanyId": companyid.length > 0 ? companyid : [0],
                    "ProductId": productid ? productid : 0,
                    "Keyword": this.Keyword ? this.Keyword : "",
                    "FromDate": FromDate ? moment(FromDate).format('yyyy-MM-DD') : null,
                    "ToDate": ToDate ? moment(ToDate).format('yyyy-MM-DD') : null,
                    "CityId": this.selectedCity ? this.selectedCity : 0,
                    "Status": Status,
                    "Skip": this.skip ? this.skip : 1,
                    "Take": this.take ? this.take : 10,
                    "ProductType": "CreditLine"
                }
                console.log(this.searchPayload, 'payload');
            }

            this.Loader = true,
                this.searchPayload.ProductId = []; // beacause this page is for CreditLine leads only and we are using produt type = "CreditLine" here. 
            this._leadService.GetLeadListPage(this.searchPayload).subscribe((x: any) => {

                this.leadPageData = x.leadListPageDTO;
                this.totalcount = x.totalCount;
                this.Loader = false
                console.log(x, 'reslistdata');
                localStorage.removeItem('ListPagePayload');
            }, (error: any) => {
                this.Loader = false;
                console.log(error);

            })


        }
        else {
            this.messageService.add({ severity: 'error', summary: 'Select Atleast One Field ', detail: '' });
        }
    }
    onChangeDate(rangeDates: any) {
        console.log('onChangeDate(rangeDates)', rangeDates);

    }
    onclick(leadData: any) {
        // var data={
        //   userid:leadData.userId,
        //   leadid:leadData.leadId
        // }
        // this._leadService.Infosender(leadData);
        // this.LeadDetailsEvent.emit(true);
        //this.router.navigate(['pages/lead/Kyc-Detail',{Data:JSON.stringify(data)}] );

        const ListPagePayload = JSON.stringify(this.searchPayload);
        localStorage.setItem("ListPagePayload", ListPagePayload)

        // const objectString = JSON.stringify(leadData);
        this.router.navigate(['pages/lead/SC-leads/Kyc-Detail/' +
            leadData.userId + '/' + leadData.leadId]);
    }
    clear() {
        this.selectedcompany = null;
        this.selectedproduct = null;
        this.Keyword = null;
        this.leadPageData = [];
        this.rangeDates = [];
        this.selectedCity = null;
        this.first = 0;
        this.totalcount = 0;
    }
    navigate(leadData: any) {
        // localStorage.removeItem('LeadInfo')
        // const objectString = JSON.stringify(leadData);
        // localStorage.setItem("LeadInfo", objectString)
        // this.router.navigateByUrl('pages/lead/SC-leads/sc-lead-details');

        const ListPagePayload = JSON.stringify(this.searchPayload);
        localStorage.setItem("ListPagePayload", ListPagePayload)

        this.router.navigate(['pages/lead/SC-leads/sc-lead-details/' +
            leadData.userId + '/' + leadData.leadId]);
    }


    async GetCityList() {

        // var res = await this._leadService.getCityList().toPromise();
        // console.log(res, 'citylist');
        // if (res) {
        //     this.cityList = res;
        // }
        // else {
        //     this.cityList = [];
        // }
        var res = await this._leadService.GetAllLeadCities().toPromise();
        console.log(res, 'citylist');
        if (res.status && res.response && res.response.length > 0) {
            this.cityList = res.response;
        }

    }

    onexport(expData: any) {
        this.exportService.exportAsExcelFile(expData, 'Lead List');
        this.search(null);
    }
    export: any
    Export() {
        var productid
        var companyid: any = [];
        var FromDate
        var ToDate
        // var skip = 0
        // var take = 0
        var Status = this.StatusFilter ? this.StatusFilter : '';
        if (this.selectedproduct != null) {
            productid = this.selectedproduct.productId
        }
        if (this.selectedcompany != null) {
            // companyid = this.selectedcompany.id
            companyid.push(this.selectedcompany.id)
        }
        if (this.rangeDates && this.rangeDates.length == 2) {
            FromDate = this.rangeDates[0];
            ToDate = this.rangeDates[1];
        }

        console.log(FromDate);

        localStorage.removeItem('ListPagePayload')
        if (companyid || productid || this.Keyword != null || (FromDate != null && ToDate != null) || this.selectedCity > 0) {
            let payload = {
                "CompanyId": companyid ? companyid : [0],
                "Keyword": this.Keyword ? this.Keyword : "",
                "ProductId": [],
                "FromDate": FromDate ? moment(FromDate).format('yyyy-MM-DD') : null,
                "ToDate": ToDate ? moment(ToDate).format('yyyy-MM-DD') : null,
                "CityId": this.selectedCity ? this.selectedCity : 0,
                "Status": Status,
                "Skip": 0,
                "Take": 0,
                "ProductType": "CreditLine",
                "UserIds": [],
                "IsDSA": false
            }
            console.log(payload, 'payload');

            this.Loader = true
            this._leadService.GetLeadListPage(payload).subscribe((x: any) => {
                this.leadPageData = x.leadListPageDTO;
                this.totalcount = x.totalCount;
                this.Loader = false
                console.log(x, 'reslistdata');

                this.leadPageData.forEach((res: any) => {
                    res.createdDate = this.datePipe.transform(res.createdDate, 'yyyy-MM-dd');
                    res.lastModified = this.datePipe.transform(res.lastModified, 'yyyy-MM-dd');
                })

                if (this.leadPageData && this.leadPageData.length > 0) {
                    this.export = this.leadPageData.map(function (a: any) {
                        return {
                            Lead_Code: a.leadCode,
                            Customer_Name: a.customerName,
                            Mobile_No: a.mobileNo,
                            created_Date: a.createdDate,
                            last_Modified: a.lastModified,
                            Screen_Name: a.screenName,
                            alternatePhoneNo: a.alternatePhoneNo,
                            emailId: a.emailId,
                            creditScore: a.creditScore,
                            status: a.status,
                            businessName: a.businessName,
                            anchorName: a.anchorName,
                            Anchor_Code: a.uniqueCode,
                            Lead_Generator: a.leadGenerator,
                            Lead_Converter: a.leadConvertor,
                            Offer_Amount: a.creditLimit,
                            CityName: a.cityName,
                            VintageDays: a.vintageDays,
                            AvgMonthlyBuying: a.avgMonthlyBuying,
                            RejectionReason: a.rejectMessage
                        };
                    });

                    this.onexport(this.export)
                }
                else {
                    this.messageService.add({ severity: 'error', summary: 'No Data Found', detail: '' });
                }
            })
        }
    }
    updateKycStatus(row:any){
        const payload ={
            leadId: row.leadId,
            ActivityMasterName:row.screenName.trim(),
            userName:'' 
        }

        this.confirmationService.confirm({
            message: 'Are you sure that you want to Change Status to KYCSuccess?',
            accept: () => {
                this.Loader = true;
                this._leadService.UpdateKYCStatus(payload).subscribe((res:any)=>{
                    console.log(res);
                    if(res.status){
                        this.Loader = false;
                        this.messageService.add({ severity: 'success', summary: res.message, detail: '' });
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                    else{
                        this.Loader = false;
                        this.messageService.add({ severity: 'error', summary: res.message, detail: '' });
                    }
                },(error:any) => this.Loader = false)
            }
        });


    }
    StatusSearch(search: any) {
        this.search(null);
    }

    keypress(event: any) {
        if (event.code == "Enter" && event.which == 13) {
            this.search(null);
        }
    };

}

