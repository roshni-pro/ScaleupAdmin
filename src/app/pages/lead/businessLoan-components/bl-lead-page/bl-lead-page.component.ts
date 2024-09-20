import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { LeadService } from '../../services/lead.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ExportService } from 'app/shared/scale-up-shared/services/export.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
@Component({
    selector: 'app-bl-lead-page',
    templateUrl: './bl-lead-page.component.html',
    styleUrls: ['./bl-lead-page.component.scss'],
})
export class BLLeadPageComponent {
    leadPageData: any;
    totalcount: number = 0;
    skip: number = 1;
    take: number = 10;
    Loader: boolean = false;
    Keyword: any;
    companyData: any;
    selectedcompany: any;
    productList: any;
    selectedproduct: any;
    listpagePayload: any;
    rangeDates: Date[] = [];
    StatusFilter: any;
    cityList: any = ([] = []);
    selectedCity: any;
    public dateFormat: string = 'dd/mm/yy';
    first: number = 0;
    isDSA: boolean = false;
    @ViewChild('sellerOfferCalendar') sellerOfferCalendar: any;
    @Output() LeadDetailsEvent = new EventEmitter<boolean>();
    searchPayload: any;
    roleName: any;
    roleList: any;
    isDSTrole: boolean = false;
    isDSArole: boolean = false;
    isSuperadminrole: boolean = false;
    hasCalledOnSelectDSA: boolean = false;
    isAdminrole: boolean = false;
    constructor(
        private _leadService: LeadService,
        private router: Router,
        private messageService: MessageService,
        private exportService: ExportService,
        private datePipe: DatePipe,
    ) { }


    StatusList = [
        { value: '', label: 'All' },
        { value: 'Initiate', label: 'Initiate' },
        { value: 'KYCInProcess', label: 'KYCInProcess' },
        { value: 'KYCSuccess', label: 'KYCSuccess' },
        { value: 'KYCReject', label: 'KYCReject' },
        { value: 'BankAdded', label: 'BankAdded' },
        { value: 'Submitted', label: 'Submitted' },
        { value: 'Rejected', label: 'Rejected' },
    ];
    isRolePermission: boolean = false;
    role: any;
    isForNBFC: boolean = false
    id: number = 0;
    idList: any;
    userType:any;
    userTypeRole:boolean = false;
    async ngOnInit(): Promise<void> {
        // this.roleName = localStorage.getItem('roles');
        // this.roleList = this.roleName.split(',');
        // console.log(this.roleList);

        // for (var i in this.roleList) {
        //   if (this.roleList[i].toLowerCase() == 'superadmin' ) {
        //     this.isdsa = true;
        //     this.isDSA=true;
        //     this.onSelectDSA(null)
        //   }
        //   if (this.roleList[i] == 'DST' ) {
        //     this.isdst = true;
        //   }
        //   if ((this.roleList[i].toLowerCase() == 'dst' || this.roleList[i].toLowerCase() == 'dsa') || this.roleList[i].toLowerCase() == 'superadmin') {
        //     this.isAllrole = true;
        // }

        // }


        this.roleName = localStorage.getItem('roles');
        
        this.roleList = this.roleName.split(',');
        console.log(this.roleList);
        for (var i in this.roleList) {
            if (this.roleList[i] == 'MASOperationExecutive' || this.roleList[i] == 'AYEOperationExecutive') {
                this.isRolePermission = true;
                this.role = this.roleList[i].slice(0, 3);
            }
            if (this.roleList[i].toLowerCase() == 'superadmin'.toLowerCase()) {
                this.isSuperadminrole = true;
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
        if (this.isRolePermission) {
            this.isForNBFC = true
        }


        const companyId = localStorage.getItem('companyId');
        this.idList = companyId?.split(',');
        console.log(this.idList, typeof (this.idList));
        if (companyId !== null && this.idList?.length > 1) {

        }
        else if (companyId !== null && this.idList.length > 0 && this.idList.length == 1) {
            this.id = JSON.parse(companyId);
            console.log('companyid', this.id);
        }

        this.listpagePayload = localStorage.getItem('BLListPagePayload');
        this.listpagePayload = JSON.parse(this.listpagePayload);

        // this._leadService.GetAllCompanyList().subscribe((x: any) => {
        //     this.companyData = x.returnObject.filter((y: any) => y.companyType == 'Anchor')
        //     console.log(this.companyData, 'this.companyData');
        // })
        // this.GetCompanyList(false)
        await this.GetAllCompanyList(false);
        await this.GetCityList();
        //this.GetAllCompanyList();    
        this.StatusFilter = this.StatusList[0].value;

        this.StatusSearch('search');
    }

    //   async GetAllCompanyList(isDSA: any) {
    //     try {
    //       var company = await this._leadService.GetAllCompanyList().toPromise();
    //       // .subscribe((x: any) => {
    //       if (company != null) {
    //         if(this.isForNBFC){
    //             this.companyData = company.returnObject.filter(
    //                 (y: any) => y.companyType == 'Anchor'
    //               );
    //         }
    //         else if(!isDSA){
    //             this.companyData = company.returnObject.filter(
    //               (y: any) => y.companyType == 'Anchor' && !y.isDSA
    //             );
    //         }
    //         else if (this.companyData.length > 0 && isDSA) {
    //           this.companyData = company.returnObject.filter(
    //             (y: any) => y.companyType == 'Anchor' && y.isDSA
    //           );
    //           this.companyData.forEach((x: any) => {
    //             if (x.identificationCode == 'ScaleUpConnectorAnchor')
    //               //   x.businessName = x.businessName + ' (Connector)';
    //               x.businessName = 'Connector';
    //           });
    //           this.selectedcompany = this.companyData[0];
    //           console.log(this.companyData, 'this.companyData');
    //         }

    //         console.log(this.companyData, 'this.companyData');
    //         if (this.companyData.length > 0) {
    //           this.selectedcompany = this.companyData[0];
    //         }

    //         if (this.companyData != null) {
    //           const payload = {
    //             businessName: "All",
    //             companyType: "Anchor",
    //             id: 0,
    //             identificationCode: "",
    //             isDSA: false,
    //             isDefault: false,
    //             lendinName: ""
    //           }
    //           this.companyData.unshift(payload)
    //           this.selectedcompany = this.companyData[0];
    //         }
    //       }
    //     } catch (error: any) {
    //       // alert(error.message);
    //     }
    //     if (this.selectedcompany != null || this.selectedcompany != 'undefined') {
    //       await this.getProduct(this.selectedcompany);
    //     }
    //     // })
    //   }
    salesAgentListData: any;
    selectedSalesAgentListData: any;
    async getProduct(selectedcompany: any) {
        console.log(selectedcompany);

        localStorage.setItem(
            'selectedcompany',
            JSON.stringify(this.selectedcompany.id)
        );

        if (selectedcompany != null) {
            if (selectedcompany.id != undefined || selectedcompany.id != null) {
                var res = await this._leadService
                    .GetProductMasterList(selectedcompany.id)
                    .toPromise();
                // .subscribe((res: any) => {
                this.productList = res.returnObject;
                console.log(this.productList, 'productlist');
                // });
            }
            if (selectedcompany.isDSA) {
                this.GetSalesAgentData(selectedcompany.id);
            }
        }
    }

    GetSalesAgentData(selectedcompanyid: any) {
        this._leadService
            .GetSalesAgentListByAnchorId(selectedcompanyid)
            .subscribe((res: any) => {
                console.log(res, 'GetSalesAgentListByAnchorId');
                if (res.isSuccess) {
                    console.log('yaha aya');

                    this.salesAgentListData = res.result;
                    console.log(this.salesAgentListData, 'salesAgentListData');
                    if (this.salesAgentListData.length > 0) {
                        this.salesAgentListData.forEach((x: any) => {
                            x.showName = x.fullName + ' (' + x.type + ')';
                        });
                    }
                }
            });
    }

    isDsaDisable: boolean = true;
    isDsaVisible: boolean = false;
    getrole() {
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
        } else if (this.isDSArole) {
            this.isDsaVisible = true;
            this.isDSA = true;


            if (!this.hasCalledOnSelectDSA) {
                this.onSelectDSA(null);
                this.hasCalledOnSelectDSA = true;
            }
            //   if (this.onSelectDSASubscription) {
            //     this.onSelectDSASubscription.unsubscribe();
            //   }
            //   this.onSelectDSASubscription = this.onSelectDSA(null).subscribe();
            //   this.onSelectDSA(null);
        }
    }

    async search(event: any) {
        this.getrole();
        this.first = 0;
        var Last = event ? event.first + event.rows : 10;
        this.skip = event ? Last / event.rows : Last / 10;
        this.take = event ? event.rows : 10;
        var productid;
        var companyid: any = [];
        var FromDate;
        var ToDate;
        var Status = this.StatusFilter ? this.StatusFilter : '';
        if (this.selectedproduct != null) {
            productid = this.selectedproduct.productId;
        }
        // if (this.selectedcompany != null) {
        //   companyid = this.selectedcompany.id;
        // }
        if (this.rangeDates && this.rangeDates.length == 2) {
            FromDate = this.rangeDates[0];
            ToDate = this.rangeDates[1];
        }
        let previousPayload = localStorage.getItem('BLListPagePayload');
        if (
            companyid ||
            productid ||
            this.Keyword != null ||
            (FromDate != null && ToDate != null) ||
            this.selectedCity > 0 ||
            (previousPayload && previousPayload != '')
        ) {
            if (previousPayload && previousPayload != '') {
                this.searchPayload = JSON.parse(previousPayload);
                console.log(this.searchPayload, 'searchPayload');

                let companyid: any, productid: number;
                companyid = this.searchPayload.CompanyId;
                productid = this.searchPayload.ProductId;

                if (this.searchPayload && this.searchPayload.UserIds.length > 0) {
                    this.dsaUsersId = this.searchPayload.UserIds;
                }
                if (this.searchPayload.Skip > 0 && this.searchPayload.Take > 0) {
                    this.skip = this.searchPayload.Skip;
                    this.take = this.searchPayload.Take;
                    this.first = (this.skip - 1) * this.take;
                }
                if (this.searchPayload.isDSA) {
                    this.isDSA = this.searchPayload.isDSA;
                }
                // if (this.companyData != null) {
                //   this.companyData.forEach((element: any) => {
                //     if (element.id == companyid) {
                //       this.selectedcompany = element;
                //     }
                //   });
                //   console.log(this.companyData, 'companyData');

                //   console.log(this.selectedcompany, 'selected company');
                // }
                // if (this.companyData == undefined || this.companyData == null) {
                //   await this.GetAllCompanyList(this.isDSA);
                //   if (this.companyData != null) {
                //     this.companyData.forEach((element: any) => {
                //       if (element.id == companyid) {
                //         this.selectedcompany = element;
                //       }
                //     });
                //   }
                //   console.log(this.selectedcompany, 'selected company');
                // }
                if (this.companyData == undefined || this.companyData == null) {
                    await this.GetAllCompanyList(this.isDSA);
                    if (this.selectedcompany?.businessName == 'All') {
                        if (this.companyData != null && this.isDSA) {
                            this.companyData.forEach((x: any) => {
                                if (x.isDSA && x.id > 0)
                                    this.searchPayload.CompanyId.push(x.id)
                            })
                        } else if (this.companyData != null && !this.isDSA) {
                            this.companyData.forEach((x: any) => {
                                if (!x.isDSA && x.id > 0)
                                    this.searchPayload.CompanyId.push(x.id)
                            })
                        }
                        console.log(this.selectedcompany, 'selected company');
                    } else {
                        // this.searchPayload.CompanyId.push(this.selectedcompany.id)
                    }
                }

                if (this.productList != null) {
                    this.productList.forEach((element: any) => {
                        if (element.productId == productid) {
                            this.selectedproduct = element;
                        }
                    });
                }

                if (
                    (this.productList == null || this.productList == undefined) && this.selectedcompany != null) {
                    console.log(this.selectedcompany);
                    await this.getProduct(this.selectedcompany);
                    if (this.productList && this.productList.length > 0) {
                        this.productList.forEach((element: any) => {
                            if (element.productId == productid) {
                                this.selectedproduct = element;
                            }
                        });
                    }
                }

                if (
                    this.searchPayload.FromDate != null &&
                    this.searchPayload.ToDate != null
                ) {
                    this.rangeDates = [];
                    this.rangeDates[0] = new Date(this.searchPayload.FromDate);
                    this.rangeDates[1] = new Date(this.searchPayload.ToDate);
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
                        });
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
                            });
                        }
                    }
                }
            } else {
                this.totalcount = 0;
                if (this.selectedcompany?.businessName == 'All') {
                    if (!this.userTypeRole) {
                        if (this.companyData != null) {
                            this.companyData.forEach((x: any) => {
                                if (x.id > 0)
                                    companyid.push(x.id)
                            })
                        }
                    }
                    else if (this.isDSA) {
                        if (this.companyData != null) {
                            this.companyData.forEach((x: any) => {
                                if (x.isDSA && x.id > 0)
                                    companyid.push(x.id)
                            })
                        }
                    }
                    else if (!this.isDSA) {
                        if (this.companyData != null) {
                            this.companyData.forEach((x: any) => {
                                if (!x.isDSA && x.id > 0)
                                    companyid.push(x.id)
                            })
                        }
                    }
                } else if (this.selectedcompany != 'undefined' || this.selectedcompany != null) {
                    console.log(this.selectedcompany);
                    if (this.selectedcompany && this.selectedcompany.id != 'undefined')
                        companyid.push(this.selectedcompany.id)
                }

                this.searchPayload = {
                    CompanyId: companyid ? companyid : 0,
                    ProductId: productid ? productid : 0,
                    Keyword: this.Keyword ? this.Keyword : '',
                    FromDate: FromDate ? moment(FromDate).format('yyyy-MM-DD') : null,
                    ToDate: ToDate ? moment(ToDate).format('yyyy-MM-DD') : null,
                    CityId: this.selectedCity ? this.selectedCity : 0,
                    Status: Status,
                    Skip: this.skip ? this.skip : 1,
                    Take: this.take ? this.take : 10,
                    ProductType: 'BusinessLoan',
                    UserIds: this.dsaUsersId ? this.dsaUsersId : [],
                    IsDSA: this.isDSA ? true : false,
                    isForNBFC: !this.userTypeRole?true:false,
                    NbfcCompanyId: this.isSuperadminrole || this.isAdminrole ? 0 : this.id
                };
                console.log(this.searchPayload, 'payload');
            }

            this.Loader = true;
            this.searchPayload.ProductId = []; // beacause this page is for Business Loan leads only and we are using produt type = "BusinessLoan" here.         ".
            this._leadService.GetLeadListPage(this.searchPayload).subscribe(
                (x: any) => {
                    this.leadPageData = x.leadListPageDTO;
                    this.totalcount = x.totalCount;
                    this.Loader = false;
                    console.log(x, 'reslistdata');
                    localStorage.removeItem('BLListPagePayload');
                },
                (error: any) => {
                    this.Loader = false;
                    console.log(error);
                }
            );
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Select Atleast One Field ',
                detail: '',
            });
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
        localStorage.setItem('BLListPagePayload', ListPagePayload);

        // const objectString = JSON.stringify(leadData);
        this.router.navigate([
            'pages/lead/BL-leads/Bl-Kyc-Detail/' +
            leadData.userId +
            '/' +
            leadData.leadId,
        ]);
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
        // this.router.navigateByUrl('pages/lead/BL-leads/bl-lead-details');
        const ListPagePayload = JSON.stringify(this.searchPayload);
        localStorage.setItem('BLListPagePayload', ListPagePayload);

        this._leadService.lookAtThis('log', leadData);

        this.router.navigate([
            'pages/lead/BL-leads/bl-lead-details/' +
            leadData.userId +
            '/' +
            leadData.leadId,
        ]);
    }

    async GetCityList() {

        //   var res = await this._leadService.getCityList().toPromise();
        //   console.log(res, 'citylist');
        //   if (res) {
        //     this.cityList = res;
        //   } else {
        //     this.cityList = [];
        //   }
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
    export: any;
    Export() {
        var productid;
        var companyid: any = [];
        var FromDate;
        var ToDate;
        // var skip = 0
        // var take = 0
        var Status = this.StatusFilter ? this.StatusFilter : '';
        if (this.selectedproduct != null) {
            productid = this.selectedproduct.productId;
        }
        // if (this.selectedcompany != null) {
        //   companyid = this.selectedcompany.id;       
        // }
        if (this.rangeDates && this.rangeDates.length == 2) {
            FromDate = this.rangeDates[0];
            ToDate = this.rangeDates[1];
        }
        if (this.selectedcompany.businessName == 'All') {
            if (this.isDSA) {
                if (this.companyData != null) {
                    this.companyData.forEach((x: any) => {
                        if (x.isDSA && x.id > 0)
                            companyid.push(x.id)
                    })
                }
            }
            else {
                if (this.companyData != null) {
                    this.companyData.forEach((x: any) => {
                        if (!x.isDSA && x.id > 0)
                            companyid.push(x.id)
                    })
                }
            }
        } else if (this.selectedcompany != null || this.selectedcompany != 'undefined') {
            companyid.push(this.selectedcompany.id)
        }
        console.log(FromDate);

        localStorage.removeItem('BLListPagePayload');
        if (
            companyid ||
            productid ||
            this.Keyword != null ||
            (FromDate != null && ToDate != null) ||
            this.selectedCity > 0
        ) {
            let payload = {
                CompanyId: companyid ? companyid : [],
                Keyword: this.Keyword ? this.Keyword : '',
                ProductId: [],
                FromDate: FromDate ? moment(FromDate).format('yyyy-MM-DD') : null,
                ToDate: ToDate ? moment(ToDate).format('yyyy-MM-DD') : null,
                CityId: this.selectedCity ? this.selectedCity : 0,
                Status: Status,
                Skip: 0,
                Take: 0,
                ProductType: 'BusinessLoan',
                UserIds: this.dsaUsersId ? this.dsaUsersId : [],
                isForNBFC: !this.userTypeRole?true:false,
                IsDSA: this.isDSA ? true : false,
            };
            console.log(payload, 'payload');

            this.Loader = true;
            this._leadService.GetLeadListPage(payload).subscribe((x: any) => {
                this.leadPageData = x.leadListPageDTO;
                this.totalcount = x.totalCount;
                this.Loader = false;
                console.log(this.leadPageData, 'reslistdata');
                this.leadPageData.forEach((res: any) => {
                    res.createdDate = this.datePipe.transform(
                        res.createdDate,
                        'yyyy-MM-dd'
                    );
                    res.lastModified = this.datePipe.transform(
                        res.lastModified,
                        'yyyy-MM-dd'
                    );
                    res.disbursementDate = this.datePipe.transform(
                        res.disbursementDate,
                        'yyyy-MM-dd'
                    );
                });
                var i = 0;
                if (this.leadPageData && this.leadPageData.length > 0) {
                    this.export = this.leadPageData.map(function (a: any) {
                        i = i + 1;
                        return {
                            'SR NO': i,
                            Location: a.cityName,
                            'Login Date': a.createdDate,
                            'Lead ID': a.leadCode,
                            'Customer Name': a.customerName,
                            'Contact No.': a.mobileNo,
                            'Business Type': a.busEntityType,
                            'Surrogate Type': a.surrogateType,
                            'Ownership Type': a.ownershipType,
                            Stage: a.sequenceNo,
                            'Offer Amount': a.creditLimit,
                            'Disbursed Amount': a.orderAmount,
                            'Disbursed Date': a.disbursementDate,
                            RejectionReasons: a.rejectionReasons,
                            //   return {
                            //       Lead_Code: a.leadCode,
                            //       Customer_Name:a.customerName,
                            //       Mobile_No: a.mobileNo,
                            //       created_Date:a.createdDate,
                            //       last_Modified:a.lastModified,
                            //       Screen_Name: a.screenName,
                            //       alternatePhoneNo:a.alternatePhoneNo,
                            //       emailId: a.emailId,
                            //       creditScore: a.creditScore,
                            //       status: a.status,
                            //       businessName: a.businessName,
                            //       anchorName: a.anchorName,
                            //       Anchor_Code: a.uniqueCode,
                            //       Lead_Generator : a.leadGenerator,
                            //       Lead_Converter :a.leadConvertor,
                            //       Offer_Amount:a.creditLimit,
                            //       CityName:a.cityName,
                            //       RejectionReasons :a.RejectionReasons,
                            //       BusinessType:a.businessType
                            //   };
                        };
                    });
                    this.onexport(this.export);
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'No Data Found',
                        detail: '',
                    });
                }
            });
        }
    }

    StatusSearch(search: any) {
        this.search(null);
    }
    async GetAllCompanyList(isDSA: any) {
        debugger
        var res = await this._leadService.GetAllCompanyList().toPromise()
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
                        //   x.businessName = x.businessName + ' (Connector)';
                        x.businessName = 'Connector';
                });
                this.selectedcompany = this.companyData[0];
                console.log(this.companyData, 'this.companyData');
            }

            console.log(this.companyData, 'this.companyData');
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
    onSelectDSA(event: any) {

        console.log('Selected value: ', this.isDSA);
        this.GetAllCompanyList(this.isDSA);
        this.dsaUsersId = [];
    }
    dsaUsersId: any[] = [];
    onSelectUser(selectedSalesAgentListData: any) {
        console.log(selectedSalesAgentListData);
        this.dsaUsersId = [];
        this.dsaUsersId.push(selectedSalesAgentListData.value);
        console.log(this.dsaUsersId, 'dsaUsersId');
    }
    keypress(event: any) {
        if (event.code == 'Enter' && event.which == 13) {
            this.search(null);
        }
    }
}
