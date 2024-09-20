import { Component } from '@angular/core';
import { LoanService } from '../../services/loan.service';
import { ExportService } from 'app/shared/scale-up-shared/services/export.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
@Component({
    selector: 'app-bl-loan-account',
    templateUrl: './bl-loan-account.component.html',
    styleUrls: ['./bl-loan-account.component.scss']
})

export class BLLoanAccountComponent {



    ProductDropdown = [
        // {label:"BusinessLoan", value:0},
        // {label:"CreditLine", value:1}
    ];
    selectedProduct: any;

    statusDropdown = [
        { label: "All", value: -1 },
        { label: "Active", value: 1 },
        { label: "Inactive", value: 0 },
        { label: "Blocked", value: 2 }
    ];
    // selectedstatus: any;
    selectedCity: any;


    cityList: any[] = [];

    selectedDates: any[] = [];

    companyList: any;
    // anchorIds: any[] = [];
    // selectedcompany: any[] = [];
    loanaccountList: any[] = [];

    totalrecord: number = 0;

    // keyword: any = '';
    skip: number = 0;
    take: number = 10;
    isSearch: boolean = false;
    isDSA: boolean = false;

    roleName: any;
    roleList: any;
    isDSArole: boolean = false;
    isDSTrole: boolean = false;
    isSuperadminrole: boolean = false;
    isDsaVisible: boolean = false;
    isDsaDisable: boolean = true;
    // accountDetailsPopup: boolean = false;

    searchFilters: searchFilters = {
        Keyword: '',
        Skip: 0,
        Take: 10,

        AnchorId: [],
        FromDate: new Date,
        ToDate: new Date,

        Status: -1, //Active=1/Inactive=0/Blocked=2/All= -1
        CityName: '',
        Min: 0,
        Max: 0,
        ProductType: "BusinessLoan", // BusinessLoan / CreditLine
        UserIds: [],
        leadIds: [],
        IsDSA: false,
        NbfcCompanyId: 0
    }



    constructor(
        private loanService: LoanService,
        // private leadService: LeadService,
        private exportService: ExportService,
        private router: Router,
        private messageService: MessageService
    ) {
        // this.searchFilters.ToDate = new Date;
    }
    isRolePermission: boolean = false
    id: number = 0;
    idList: any;
    isAdminrole: boolean = false;
    userTypeRole:boolean=false
    async ngOnInit(): Promise<void> {
        this.roleName = localStorage.getItem('roles');
        this.roleList = this.roleName.split(',');
        console.log(this.roleList);
        for (var i in this.roleList) {
            // if (this.roleList[i].toLowerCase() == 'dsa') {
            //   this.isDSArole = true;
            // }
            // if (this.roleList[i].toLowerCase() == 'dst') {
            //   this.isDSTrole = true;
            // }
            if (this.roleList[i].toLowerCase() == 'superadmin'.toLowerCase()) {
                this.isSuperadminrole = true;
            }
            if (this.roleList[i] == 'MASOperationExecutive' || this.roleList[i] == 'AYEOperationExecutive') {
                this.isRolePermission = true;
            }
            if (this.roleList[i].toLowerCase() == 'AdminUser'.toLowerCase()) {
                this.isAdminrole = true;
            }
        }
        const userType = localStorage.getItem('usertype');
        
        if(userType !== null){
            if (userType.toLowerCase() == 'superadmin'.toLowerCase()) {
                this.userTypeRole = true;
            }
            if (userType.toLowerCase() == 'AdminUser'.toLowerCase()) {
                this.userTypeRole = true;
            }
        }
        const companyId = localStorage.getItem('companyId');
        this.idList = companyId?.split(',');
        console.log(this.idList, typeof (this.idList));
        if (companyId !== null && this.idList.length > 1) {

        }
        else if (companyId !== null && this.idList.length > 0 && this.idList.length == 1) {
            this.id = JSON.parse(companyId);
            console.log('companyid', this.id);
        }
        await this.GetAllCompanyList(this.isDSA);
        var data = localStorage.getItem('SearchFilter');
        if (data !== null) {
            this.searchFilters = JSON.parse(data);
            this.first = this.searchFilters.Skip;

            this.getLoanAccountList(false);
            localStorage.removeItem('SearchFilter')

            // Use parsedData as needed
        }

        this.AnchorCityProductList();
        // this.GetAllCompanyList(false);
    }

    async clearFilter() {
        this.selectedCity = ''
        this.searchFilters = {
            Keyword: '',
            Skip: 0,
            Take: 10,

            AnchorId: 0,
            FromDate: new Date,
            ToDate: new Date,

            Status: 1, //Active-1/Inactive-0/Blocked-2
            CityName: '',
            Min: 0,
            Max: 0,
            ProductType: "BusinessLoan",// BusinessLoan / CreditLine
            UserIds: [],
            leadIds: [],
            IsDSA: false,
            NbfcCompanyId: 0
        }
        this.selectedcompany = [];
        this.selectedSalesAgentListData = [];
        this.salesAgentListData = []
        this.isDSA = false
        await this.GetAllCompanyList(false);
        this.getLoanAccountList(true);
    }



    //  -----------------------------api section start------------------------------------
    // GetAllCompanyList(){
    //   this.leadService.GetAllCompanyList().subscribe((x: any) => {
    //     this.companyList = x.returnObject.filter(
    //       (y: any) => y.companyType == 'Anchor'
    //     );
    //     console.log(this.companyList, 'this.companyList');
    //   });
    // }


    async load(event: any) {
        // debugger;
        this.roleName = localStorage.getItem('roles');
        this.roleList = this.roleName.split(',');
        console.log(this.roleList);

        for (var i in this.roleList) {
            if (this.roleList[i].toLowerCase() == 'dsa') {
                this.isDSArole = true;
            }
            if (this.roleList[i].toLowerCase() == 'dst') {
                this.isDSTrole = true;
            }
            if (this.roleList[i].toLowerCase() == 'superadmin') {
                this.isSuperadminrole = true;
            }
        }
        if (this.isSuperadminrole || (this.isDSArole && this.isDSTrole)) {
            this.isDsaVisible = true;
            this.isDsaDisable = false;

        }
        else if (this.isDSArole) {
            this.isDsaVisible = true;
            this.isDSA = true

            this.onSelectDSA(null)
        }

        this.take = event.rows;
        this.skip = event.first;
        await this.GetAllCompanyList(this.isDSA);
        this.getLoanAccountList(false);
    }


    first: number = 0;
    getLoanAccountList(isSearch: boolean) {
        this.loanaccountList = []
        // this.searchFilters.CityName=this.selectedCity?this.selectedCity:''
        this.searchFilters.Skip = isSearch == false ? this.skip : 0;
        this.searchFilters.Take = isSearch == false ? this.take : 10;

        // this.searchFilters.AnchorIds = anchorIds;

        if (this.selectedDates && this.selectedDates.length == 2) {
            this.searchFilters.FromDate = moment(this.selectedDates[0]).format('YYYY-MM-DD');
            this.searchFilters.ToDate = this.selectedDates[1] ? moment(this.selectedDates[1]).format('YYYY-MM-DD') : this.searchFilters.FromDate;

            // this.searchFilters.ToDate = moment(this.selectedDates[1]).format('YYYY-MM-DD') ;
        } else {
            this.searchFilters.FromDate = this.getPreviousMonthDate();
            this.selectedDates[0] = this.searchFilters.FromDate;
            this.searchFilters.ToDate = new Date;
            this.selectedDates[1] = this.searchFilters.ToDate;
        }

        if (this.searchFilters.Max > 0 && this.searchFilters.Min >= 0) {
            if (this.searchFilters.Min >= this.searchFilters.Max) {
                // alert("Min Avail. Credit Limit cannot be greater than Max Avail. Credit Limit");
                this.messageService.add({ severity: 'error', summary: 'Min Avail. Credit Limit cannot be greater than Max Avail. Credit Limit' });

                this.searchFilters.Min = 0;
                this.searchFilters.Max = 0;
            }
        }
        this.searchFilters.Min = this.searchFilters.Min == null ? 0 : this.searchFilters.Min;
        this.searchFilters.Max = this.searchFilters.Max == null ? 0 : this.searchFilters.Max;
        if (this.selectedcompany?.businessName == 'All') {
            if (!this.userTypeRole) {
                this.searchFilters.AnchorId = []
                if (this.companyData != null) {
                    this.companyData.forEach((x: any) => {
                        if (x.id > 0) {
                            this.searchFilters.AnchorId.push(x.id);
                        }
                    })
                }
            }
            else if (this.isDSA) {
                // this.searchFilters.AnchorId = this.selectedcompany.id;
                this.searchFilters.AnchorId = []
                this.searchFilters.UserIds = this.dsaUsersId;
                if (this.companyData != null) {
                    this.companyData.forEach((x: any) => {
                        if (x.isDSA && x.id > 0) {
                            this.searchFilters.AnchorId.push(x.id);
                        }
                    })
                }
            } else if (!this.isDSA) {
                // this.searchFilters.AnchorId = this.selectedcompany.id;
                this.searchFilters.AnchorId = []
                this.searchFilters.UserIds = [];
                if (this.companyData != null) {
                    this.companyData.forEach((x: any) => {
                        if (!x.isDSA && x.id > 0) {
                            this.searchFilters.AnchorId.push(x.id);
                        }
                    })
                }
            }
        }
        else {
            this.searchFilters.AnchorId = [];
            if (this.selectedcompany != undefined)
                this.searchFilters.AnchorId.push(this.selectedcompany.id);
        }
        isSearch == true ? (this.first = 1) : null;
        this.totalrecord = 0;
        if (this.searchFilters.AnchorId.length > 0) {
            this.searchFilters.NbfcCompanyId = this.isSuperadminrole ? 0 : this.id;
            if (!this.userTypeRole) {
                this.loanService.GetNBFCBusinessLoanAccountList(this.searchFilters).subscribe((x: any) => {
                    console.log(x, 'loanaccountList');
                    if (x && x.response && x.response.length > 0) {
                        this.loanaccountList = x.response;
                        this.totalrecord = x.response[0].totalCount;

                    } else {
                        this.loanaccountList = [];
                        this.totalrecord = 0;

                    }
                });
            } else {
                this.loanService.GetBusinessLoanAccountList(this.searchFilters).subscribe((x: any) => {
                    console.log(x, 'loanaccountList');
                    if (x && x.response && x.response.length > 0) {
                        this.loanaccountList = x.response;
                        this.totalrecord = x.response[0].totalCount;

                    } else {
                        this.loanaccountList = [];
                        this.totalrecord = 0;
                    }
                });
            }
        }
    }
    companyData: any;
    selectedcompany: any;
    //   async GetAllCompanyList(isDSA:any) {
    //     try {
    //         var company = await this.loanService.GetAllCompanyList().toPromise();
    //         // .subscribe((x: any) => {
    //         if (company != null) {
    //             if(this.isRolePermission){
    //                 this.companyData = company.returnObject.filter((y: any) => y.companyType == 'Anchor')      
    //             }else if(!isDSA){
    //                 this.companyData = company.returnObject.filter((y: any) => y.companyType == 'Anchor' && !y.isDSA) 
    //             }
    //             else if(this.companyData.length > 0 && isDSA){
    //               this.companyData =  company.returnObject.filter((y: any) => y.companyType == 'Anchor' && y.isDSA )
    //               this.companyData.forEach((x:any) => {
    //                   if(x.identificationCode=='ScaleUpConnectorAnchor')
    //                       x.businessName = 'Connector'
    //               });
    //               this.selectedcompany = this.companyData[0];
    //               console.log(this.companyData,'this.companyData');
    //             }
    //             if (this.companyData.length > 0) {
    //                 this.selectedcompany = this.companyData[0];
    //             }
    //             if(this.companyData != null){
    //                 const payload = {
    //                     businessName:"All",
    //                     companyType:"Anchor",
    //                     id:0,
    //                     identificationCode:"",
    //                     isDSA:false,
    //                     isDefault:false,
    //                     lendinName:""
    //                 }
    //                 this.companyData.unshift(payload)
    //                 this.selectedcompany = this.companyData[0];
    //             }
    //         }
    //     } catch (error: any) {
    //         // alert(error.message);
    //     }
    //     if(this.selectedcompany != null){
    //         await this.GetSalesAgentData(this.selectedcompany.id);
    //     }
    //     // })
    // }
    getSalesAgentList(selectedCompany: any) {
        if (selectedCompany.isDSA) {
            this.GetSalesAgentData(selectedCompany.id);
        }
    }
    salesAgentListData: any;
    GetSalesAgentData(selectedcompanyid: any) {
        this.loanService.GetSalesAgentListByAnchorId(selectedcompanyid).subscribe((res: any) => {
            console.log(res, 'GetSalesAgentListByAnchorId');
            if (res.isSuccess) {
                this.salesAgentListData = res.result
                console.log(this.salesAgentListData, 'salesAgentListData');
                if (this.salesAgentListData.length > 0) {
                    this.salesAgentListData.forEach((x: any) => {
                        x.showName = x.fullName + ' (' + x.type + ')'
                    });
                }
            }
        })
    }
    onSelectDSA(event: any) {

        console.log('Selected value: ', this.isDSA);
        this.searchFilters.IsDSA = this.isDSA
        this.GetAllCompanyList(this.isDSA)
        this.dsaUsersId = [];
    }
    dsaUsersId: any[] = [];
    selectedSalesAgentListData: any;
    onSelectUser(selectedSalesAgentListData: any) {
        console.log(selectedSalesAgentListData);
        this.dsaUsersId = [];
        this.dsaUsersId.push(selectedSalesAgentListData.value)
        console.log(this.dsaUsersId, 'dsaUsersId');

    }
    getLoanAccountListExport() {
        alert("functionality is currently unavailable")
        // this.loanService.GetLoanAccountListExport(this.searchFilters).subscribe((x: any) => {
        //   if (x && x.result.length > 0) {
        //     this.onexport(x.result)
        //   }
        // });
    }

    onexport(expData: any) {
        expData.forEach((element: any) => {
            element.agreementRenewalDate = element.agreementRenewalDate == "1900-01-01T00:00:00" ? '-' : element.agreementRenewalDate;
            element.applicationDate = element.applicationDate == "1900-01-01T00:00:00" ? '-' : element.applicationDate;
            element.disbursalDate = element.disbursalDate == "1900-01-01T00:00:00" ? '-' : element.disbursalDate;
        });
        this.exportService.exportAsExcelFile(expData, 'Tranx List');
    }

    getPreviousMonthDate() {
        var now = new Date();
        if (now.getMonth() == 1) {
            var current = new Date(now.getFullYear() - 1, 12, 1);
        } else {
            var current = new Date(now.getFullYear(), 1, 1);
        };
        return current
    }

    // getCityNameList() {
    //   this.loanService.GetCityNameList().subscribe((x: any) => {
    //     console.log("city list", x);
    //     if(x && x.result.length>0){
    //       this.cityList = x.result;
    //     }else{
    //       this.cityList = [];
    //     }
    //   });
    // }

    AnchorCityProductList() {
        this.loanService.AnchorCityProductList().subscribe((x: any) => {
            console.log("city list", x);
            if (x && x.result) {
                this.cityList = x.result.cityNameDcs && x.result.cityNameDcs.length > 0 ? x.result.cityNameDcs : [];
                this.ProductDropdown = x.result.productDcs && x.result.productDcs.length > 0 ? x.result.productDcs : [];
                this.companyList = x.result.anchorNameDcs && x.result.anchorNameDcs.length > 0 ? x.result.anchorNameDcs : [];;
            } else {
                this.cityList = [];
                this.ProductDropdown = [];
                this.companyList = [];
            }
        });
    }

    async GetAllCompanyList(isDSA: any) {
        var res = await this.loanService.GetAllCompanyList().toPromise()
        // .subscribe((res:any) =>{
        console.log(res, 'GetAllCompanyList');
        if (res.status && res.response.length > 0) {
            if (!this.userTypeRole) {
                this.companyData = res.response.filter(
                    (y: any) => y.companyType == 'Anchor'
                );
            }
            else if (!isDSA) {
                this.companyData = res.response.filter(
                    (y: any) => y.companyType == 'Anchor' && !y.isDSA
                );
            }
            else if (this.companyData.length > 0 && isDSA) {
                this.companyData = res.response.filter(
                    (y: any) => y.companyType == 'Anchor' && y.isDSA
                );
                this.companyData.forEach((x: any) => {
                    if (x.identificationCode == 'ScaleUpConnectorAnchor')
                        x.businessName = 'Connector';
                });
                this.selectedcompany = this.companyData[0];
                console.log(this.companyData, 'this.companyData');
            }

            if (this.companyData.length > 0) {
                this.selectedcompany = this.companyData[0];
            }

            if (this.companyData != null) {
                const payload = {
                    businessName: "All",
                    companyType: "Anchor",
                    id: 0,
                    identificationCode: "",
                    isDSA: false,
                    isDefault: false,
                    lendinName: ""
                }
                this.companyData.unshift(payload)
                this.selectedcompany = this.companyData[0];
            }
        }
        // })
    }
    //  -----------------------------api section end------------------------------------


    // --------------------misc fn start ---------------------------------
    gotoTransactionPage(rowdata: any) {
        localStorage.setItem('Loanaccountmobile', rowdata.mobileNo)
        localStorage.setItem('LoanaccountCust', rowdata.customerName)
        this.router.navigate(['pages/loan-account/transaction'], {
        }).then(result => { window.location.href });;
    }

    // --------------------misc fn end ---------------------------------
    calcMinMax() {

    }

    navigateTo(rowData: any) {



        // this.router.navigate(["pages/loan-account/loanList/loan-details/" + rowData.loanAccountId]);
        // localStorage.setItem('SearchFilter', JSON.stringify(this.searchFilters));
        const protocol = window.location.protocol;
        const host = window.location.hostname;
        const port = window.location.port;
        const baseUrl = `${protocol}//${host}`;

        if (port) {
            // `${baseUrl}:${port}`;
            // console.log('baseUrl',baseUrl);
            // window.open(`${baseUrl}:${port}` + '/#/pages/invoice-master/invoice-list/invoice-details/' + transaction.invoiceId, '_blank');
            window.open(`${baseUrl}:${port}` + '/#/pages/loan-account/loanList/bl-loan-details/' + rowData.loanAccountId, '_blank');
        } else {
            // window.open(`${baseUrl}` + '/#/pages/invoice-master/invoice-list/invoice-details/' + transaction.invoiceId, '_blank');
            window.open(`${baseUrl}` + '/#/pages/loan-account/loanList/bl-loan-details/' + rowData.loanAccountId, '_blank');
        }
    }

}


interface searchFilters {
    AnchorId: any,
    Keyword: string,
    ProductType: string // BusinessLoan / CreditLine
    FromDate: Date | null | any//
    ToDate: Date | null | any// 
    Status: number //Active/Inactive/Blocked
    CityName: string //
    Min: number
    Max: number
    Skip: number,
    Take: number,
    UserIds: any,
    leadIds: any,
    IsDSA: boolean,
    NbfcCompanyId: number
}
