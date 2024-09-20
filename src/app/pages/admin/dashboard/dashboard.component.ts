import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { __values } from 'tslib';
import { DashboardService } from '../services/dashboard.service';
import { CommonValidationService } from 'app/shared/services/common-validation.service';
import { ExportService } from 'app/shared/scale-up-shared/services/export.service';

// import { ChartModule } from 'primeng/chart';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  // imports: [ChartModule]
})


export class DashboardComponent implements OnInit {
  ProductDropdown: any = [];
  AnchorList: any
  CityList: any
  DayList: any = [
    {
      label: 'Today', value: 'Today'
    },
    {
      label: 'MTD', value: 'MTD'
    },

    {
      label: 'Last Month', value: 'Last Month'
    }
    ,
    {
      label: 'Custom', value: 'Custom'
    },
  ]

  selectedProduct: any
  selectedCities: any
  searchFilters: any = {
    FromDate: null,
    ToDate: null,
    AnchorId: 0,
    CityId: 0,
    day: null,
  };



  leadResponsedata: any;
  accResponseDcdata: any;
  loanResponseDcdata: any;
  options: any


  creditLineInfoData: any;
  outstandingData: any;
  repaymentsData: any;
  options1: any

  Loader: boolean = false;
  apiResponse!: scaleupDashboardResponseDc;
  leadExportData: any;




  //pie chart variables
  pieChartCreditLineInfoData: any;
  pieChartOutstandingData: any;
  pieChartRepaymentsData: any;
  pieChartOptions: any;

  constructor(
    private messageService: MessageService,
    private dashboardService: DashboardService,
    private commonValidationService: CommonValidationService,
    private exportService: ExportService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.searchFilters.day = 'Today'
    this.searchFilters.FromDate = new Date();
    this.searchFilters.ToDate = new Date();
    await this.getCompanyList();
    await this.GetProductMasterList();
    await this.GetLeadCityList();


    await this.onSearch();




    const documentStyle1 = getComputedStyle(document.documentElement);
    const textColor1 = documentStyle1.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle1.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle1.getPropertyValue('--surface-border');



    this.options1 = {
      stacked: false,
      maintainAspectRatio: false,
      responsive: true,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor1
          }
        }
      },

      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawOnChartArea: false
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        // y1: {
        //     type: 'linear',
        //     display: true,
        //     position: 'right',
        //     ticks: {
        //         color: textColorSecondary
        //     },
        //     grid: {
        //         drawOnChartArea: false,
        //         color: surfaceBorder
        //     }
        // }
      }
    };

    this.pieChartOptions = {
      responsive: true,
      cutout: '60%',
      maintainAspectRatio:false,

      plugins: {
        legend: {
          labels: {
            display: true,
            position: 'top',
            color: textColor1
          }
        }
      },
      
    };



  }


  getDate(e: any) {
    debugger
    this.searchFilters.FromDate = ''
    this.searchFilters.ToDate = ''
    if (this.searchFilters.day == 'Today') {
      //   moment(new Date()).format('YYYY-MM-DD');
      this.searchFilters.FromDate = new Date();
      this.searchFilters.ToDate = new Date();
      return
    }
    if (this.searchFilters.day == 'MTD') {
      var date = new Date(), y = date.getFullYear(), m = date.getMonth();
      this.searchFilters.FromDate = new Date(y, m, 1);
      this.searchFilters.ToDate = new Date();
      return
    }
    if (this.searchFilters.day == 'Last Month') {
      var now = new Date();
      this.searchFilters.FromDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      this.searchFilters.ToDate = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 0);
      return
    }
    else {
      this.searchFilters.FromDate = ''
      this.searchFilters.ToDate = ''
    }

  }

  validateYearDifference() {
    // debugger  
    if (this.searchFilters.ToDate) {
      const oneYearDifference = moment(this.searchFilters.FromDate).diff(moment(this.searchFilters.ToDate), 'years');
      if (Math.abs(oneYearDifference) === 1) {
        this.searchFilters.ToDate = '';
        this.messageService.add({ severity: 'error', summary: 'Cant get data of more than 1 year !' });

      }
    }
  }

  async getCompanyList() {
    try {

      let payload = {
        "keyword": null,
        "skip": 0,
        "take": 10,
        "CompanyType": "Anchor"
      }


      this.Loader = true;
      const res: any = await this.dashboardService.getDashboardCompanyList(payload).toPromise();
      console.log(res);
      this.Loader = false;
      this.AnchorList = res.returnObject;
      let ids: any[] = []
      this.AnchorList.forEach((e: any) => {
        return ids.push(e.id);
      })
      this.searchFilters.AnchorId = ids

    }
    catch (error) {
      console.error(error);
      this.messageService.add({ severity: 'error', summary: 'error in getDashboardCompanyList api!' });

      this.Loader = false;
      throw error; // Rethrow the error for handling in the calling code
    }
  }

  async GetLeadCityList() {
    try {
      this.Loader = true;
      const res: any = await this.dashboardService.GetLeadCityList().toPromise();
      console.log(res);
      this.Loader = false;
      this.CityList = res.response;
      console.log("this.CityList", this.CityList)
      this.selectedCities = this.CityList
    }
    catch (error) {
      console.error(error);
      this.messageService.add({ severity: 'error', summary: 'error in getDashboardCityList api!' });
      this.Loader = false;
      throw error; // Rethrow the error for handling in the calling code
    }
  }

  async GetProductMasterList() {
    try {
      this.Loader = true;
      const res: any = await this.dashboardService.GetProductMasterList().toPromise();
      console.log(res);
      this.Loader = false;
      this.ProductDropdown = res.returnObject
      console.log("this.ProductDropdown", res);
      res.returnObject.forEach((e: any) => {
        if (e.name == 'CreditLine') {
          this.selectedProduct = e
        }
      })


    }
    catch (error) {
      console.error(error);
      this.messageService.add({ severity: 'error', summary: 'error in GetProductMasterList api!' });
      this.Loader = false;
      throw error; // Rethrow the error for handling in the calling code
    }
  }


  // async onSearch() {
  //   console.log(this.searchFilters);
  //   // debugger
  //   if (this.searchFilters) {
  //     if (this.selectedProduct && !this.selectedProduct.name) {
  //       this.messageService.add({ severity: 'error', summary: 'Select product type!' });
  //       return;
  //     }
  //     else if (this.searchFilters.day == 'Custom' && (!this.searchFilters.FromDate || !this.searchFilters.ToDate)) {
  //       this.messageService.add({ severity: 'error', summary: 'Select custom dates!' });
  //       return;
  //     }
  //     else if (!this.searchFilters.AnchorId) {
  //       this.messageService.add({ severity: 'error', summary: 'Select anchors!' });
  //       return;
  //     }
  //     else if (this.selectedCities && this.selectedCities.length == 0) {
  //       this.messageService.add({ severity: 'error', summary: 'Select city!' });
  //       return;
  //     }
  //     else if (!this.searchFilters.day && this.searchFilters.day != 'Custom') {
  //       this.messageService.add({ severity: 'error', summary: 'Select date filters!' });
  //       return;
  //     }
  //   }

  //   let cityid: any[] = []
  //   let cityName: any[] = []
  //   this.selectedCities.forEach((element: any) => {
  //     cityid.push(element.cityId)
  //     cityName.push(element.cityName)
  //   });

  //   let payload: leadDashboardDetailDc = {
  //     ProductType: this.selectedProduct.name,
  //     ProductId: this.selectedProduct.id,
  //     FromDate: moment(this.searchFilters.FromDate).format('YYYY-MM-DD'),
  //     ToDate: moment(this.searchFilters.ToDate).format('YYYY-MM-DD'),
  //     AnchorId: this.searchFilters.AnchorId,
  //     CityName: cityName,
  //     CityId: cityid
  //   }

  //   // let payload:leadDashboardDetailDc={
  //   //   "ProductType":"CreditLine",
  //   //   "ProductId":1,
  //   //   "FromDate":"2024-04-15",
  //   //   "ToDate":"2024-04-15",
  //   //   "AnchorId":[2],
  //   //   "CityName":["Indore"],
  //   //   "CityId":[1]
  //   // }

  //   //service call 
  //   this.Loader = true;
  //   try {
  //     const res: scaleupDashboardResponseDc = await this.dashboardService.ScaleupDashboardDetails(payload).toPromise();
  //     // let data =this.commonValidationService.pascalCode(res);
  //     this.apiResponse = res
  //     this.Loader = false;
  //     console.log(this.apiResponse);


  //     const documentStyle = getComputedStyle(document.documentElement);
  //     const documentStyle1 = getComputedStyle(document.documentElement);
  //     this.data = {
  //       // labels: ['Approved', 'Pending', 'Rejected', 'NotContactable', 'NotIntrested'],
  //       datasets: [
  //         {
  //           data: [this.apiResponse.leadResponse.approved, this.apiResponse.leadResponse.pending, this.apiResponse.leadResponse.rejected, this.apiResponse.leadResponse.notContactable,
  //           this.apiResponse.leadResponse.notIntrested], // Replace with your CIBIL score data
  //           backgroundColor: [
  //             '#50CFBC',
  //             '#FFBC54',
  //             '#FF7781',
  //             '#45BFFF',
  //             '#707EEF',
  //           ]
  //         }
  //       ]
  //     };


  //     //account doughnut
  //     if (this.apiResponse && this.apiResponse.accResponseDc) {
  //       this.data2 = {
  //         // labels: ['Approved', 'Pending', 'Rejected', 'NotContactable', 'NotIntrested'],
  //         datasets: [
  //           {
  //             data: [this.apiResponse.accResponseDc.creditApproved, this.apiResponse.accResponseDc.approvalPending, this.apiResponse.accResponseDc.creditRejected,
  //             this.apiResponse.accResponseDc.offerRejected,
  //             this.apiResponse.accResponseDc.rejected], // Replace with your CIBIL score data
  //             backgroundColor: [
  //               '#50CFBC',
  //               '#FFBC54',
  //               '#FF7781',
  //               '#45BFFF',
  //               '#707EEF',
  //             ]
  //           }
  //         ]
  //       };
  //     }

  //     //loan doughnut
  //     if (this.apiResponse && this.apiResponse.loanResponseDc) {

  //       this.data3 = {
  //         // labels: ['Approved', 'Pending', 'Rejected', 'NotContactable', 'NotIntrested'],
  //         datasets: [
  //           {
  //             data: [this.apiResponse.loanResponseDc.disbursementApproved, this.apiResponse.loanResponseDc.disbursementPending, this.apiResponse.loanResponseDc.disbursementRejected,
  //             this.apiResponse.loanResponseDc.offerRejected,
  //             this.apiResponse.loanResponseDc.rejected], // Replace with your CIBIL score data
  //             backgroundColor: [
  //               '#50CFBC',
  //               '#FFBC54',
  //               '#FF7781',
  //               '#45BFFF',
  //               '#707EEF',
  //             ]
  //           }
  //         ]
  //       }
  //     };


  //     const textColor = documentStyle.getPropertyValue('--text-color');

  //     this.options = {
  //       title: {
  //         display: true,
  //         text: '',
  //         fontSize: 32,
  //         position: 'top',
  //       },
  //       cutout: '80%',
  //       responsive: false,
  //       maintainAspectRatio: false,
  //       plugins: {
  //         legend: {
  //           labels: {
  //             color: textColor,
  //           },
  //         },
  //       },
  //     };



  //     let labels: any[] = []
  //     let labelsValue: any[] = []
  //     this.apiResponse.dashboardResponse.creditLineInfo.dashboardAvailableLimitGrapthDc ? this.apiResponse.dashboardResponse.creditLineInfo.dashboardAvailableLimitGrapthDc.forEach((e: any) => {
  //       labels.push(e.xValue)
  //       labelsValue.push(e.yValue)
  //     }) : null
  //     let labelsValue2: any[] = []
  //     this.apiResponse.dashboardResponse.creditLineInfo.dashboardCreditLimitGrapthDc ? this.apiResponse.dashboardResponse.creditLineInfo.dashboardCreditLimitGrapthDc.forEach((e: any) => {
  //       // labels.push(e.xValue)
  //       labelsValue2.push(e.yValue)
  //     }) : null
  //     let labelsValue3: any[] = []
  //     this.apiResponse.dashboardResponse.creditLineInfo.dashboardUtilizedAmounttGrapthDc ? this.apiResponse.dashboardResponse.creditLineInfo.dashboardUtilizedAmounttGrapthDc.forEach((e: any) => {
  //       // labels.push(e.xValue)
  //       labelsValue3.push(e.yValue)
  //     }) : null


  //     //credit line data graph
  //     this.creditLineInfoData = {
  //       labels: labels,
  //       datasets: [
  //         {
  //           label: 'Available Limit',
  //           fill: true,
  //           borderColor: documentStyle1.getPropertyValue('--cyan-400'),
  //           yAxisID: 'y',
  //           tension: 0.1,
  //           data: labelsValue,
  //           backgroundColor: 'rgba(166, 255, 255, 0.411)'
  //         },
  //         {
  //           label: 'Credit Limit',
  //           fill: true,
  //           borderColor: documentStyle1.getPropertyValue('--red-400'),
  //           yAxisID: 'y',
  //           tension: 0.1,
  //           data: labelsValue2,
  //           backgroundColor: 'rgba(107, 255, 38, 0.096)'

  //         }
  //         ,
  //         {
  //           label: 'Utilized Amount',
  //           fill: true,
  //           borderColor: documentStyle1.getPropertyValue('--yellow-400'),
  //           yAxisID: 'y',
  //           tension: 0.1,
  //           data: labelsValue3,
  //           backgroundColor: 'rgba(107, 255, 38, 0.096)'

  //         }
  //       ]
  //     };

  //     //outstanding data graph
  //     let outstandinglabels: any[] = []
  //     let outstandinglabelsValue: any[] = []
  //     this.apiResponse.dashboardResponse.outstanding.outstandingAvailableLimitGrapthDc ? this.apiResponse.dashboardResponse.outstanding.outstandingAvailableLimitGrapthDc.forEach((e: any) => {
  //       outstandinglabels.push(e.xValue)
  //       outstandinglabelsValue.push(e.yValue)
  //     }) : null
  //     let outstandinglabelsValue2: any[] = []
  //     this.apiResponse.dashboardResponse.outstanding.outstandingCreditLimitGrapthDc ? this.apiResponse.dashboardResponse.outstanding.outstandingCreditLimitGrapthDc.forEach((e: any) => {
  //       // labels.push(e.xValue)
  //       outstandinglabelsValue2.push(e.yValue)
  //     }) : null
  //     let outstandinglabelsValue3: any[] = []
  //     this.apiResponse.dashboardResponse.outstanding.outstandingUtilizedAmounttGrapthDc ? this.apiResponse.dashboardResponse.outstanding.outstandingUtilizedAmounttGrapthDc.forEach((e: any) => {
  //       // labels.push(e.xValue)
  //       outstandinglabelsValue3.push(e.yValue)
  //     }) : null
  //     this.outstandingData = {
  //       labels: outstandinglabels,
  //       datasets: [
  //         {
  //           label: 'Available Limit',
  //           fill: true,
  //           borderColor: documentStyle1.getPropertyValue('--cyan-400'),
  //           yAxisID: 'y',
  //           tension: 0.1,
  //           data: outstandinglabelsValue,
  //           backgroundColor: 'rgba(166, 255, 255, 0.411)'
  //         },
  //         {
  //           label: 'Credit Limit',
  //           fill: true,
  //           borderColor: documentStyle1.getPropertyValue('--red-400'),
  //           yAxisID: 'y',
  //           tension: 0.1,
  //           data: outstandinglabelsValue2,
  //           backgroundColor: 'rgba(107, 255, 38, 0.096)'

  //         }
  //         ,
  //         {
  //           label: 'Utilized Amount',
  //           fill: true,
  //           borderColor: documentStyle1.getPropertyValue('--yellow-400'),
  //           yAxisID: 'y',
  //           tension: 0.1,
  //           data: outstandinglabelsValue3,
  //           backgroundColor: 'rgba(107, 255, 38, 0.096)'

  //         }
  //       ]
  //     };

  //     //repaymentsData graph
  //     let repaymentsDatalabels: any[] = []
  //     let repaymentsDatalabelsValue: any[] = []
  //     this.apiResponse.dashboardResponse.repayments.repaymentsAvailableLimitGrapthDc ? this.apiResponse.dashboardResponse.repayments.repaymentsAvailableLimitGrapthDc.forEach((e: any) => {
  //       repaymentsDatalabels.push(e.xValue)
  //       repaymentsDatalabelsValue.push(e.yValue)
  //     }) : null
  //     let repaymentsDatalabelsValue2: any[] = []
  //     this.apiResponse.dashboardResponse.repayments.repaymentsCreditLimitGrapthDc ? this.apiResponse.dashboardResponse.repayments.repaymentsCreditLimitGrapthDc.forEach((e: any) => {
  //       // labels.push(e.xValue)
  //       repaymentsDatalabelsValue2.push(e.yValue)
  //     }) : null
  //     let repaymentsDatalabelsValue3: any[] = []
  //     this.apiResponse.dashboardResponse.repayments.repaymentsUtilizedAmounttGrapthDc ? this.apiResponse.dashboardResponse.repayments.repaymentsUtilizedAmounttGrapthDc.forEach((e: any) => {
  //       // labels.push(e.xValue)
  //       repaymentsDatalabelsValue3.push(e.yValue)
  //     }) : null

  //     this.repaymentsData = {
  //       labels: repaymentsDatalabels,
  //       datasets: [
  //         {
  //           label: 'Available Limit',
  //           fill: true,
  //           borderColor: documentStyle1.getPropertyValue('--cyan-400'),
  //           yAxisID: 'y',
  //           tension: 0.1,
  //           data: repaymentsDatalabelsValue,
  //           backgroundColor: 'rgba(166, 255, 255, 0.411)'
  //         },
  //         {
  //           label: 'Credit Limit',
  //           fill: true,
  //           borderColor: documentStyle1.getPropertyValue('--red-400'),
  //           yAxisID: 'y',
  //           tension: 0.1,
  //           data: repaymentsDatalabelsValue2,
  //           backgroundColor: 'rgba(107, 255, 38, 0.096)'

  //         }
  //         ,
  //         {
  //           label: 'Utilized Amount',
  //           fill: true,
  //           borderColor: documentStyle1.getPropertyValue('--yellow-400'),
  //           yAxisID: 'y',
  //           tension: 0.1,
  //           data: repaymentsDatalabelsValue3,
  //           backgroundColor: 'rgba(107, 255, 38, 0.096)'

  //         }
  //       ]
  //     };
  //   }

  //   catch (error) {
  //     console.error(error);
  //     this.Loader = false;
  //     throw error; // Rethrow the error for handling in the calling code
  //   }

  // }

  async onSearch() {
    console.log(this.searchFilters);
    // debugger
    if (this.searchFilters) {
      if (this.selectedProduct && !this.selectedProduct.name) {
        this.messageService.add({ severity: 'error', summary: 'Select product type!' });
        return;
      }
      else if (this.searchFilters.day == 'Custom' && (!this.searchFilters.FromDate || !this.searchFilters.ToDate)) {
        this.messageService.add({ severity: 'error', summary: 'Select custom dates!' });
        return;
      }
      else if (!this.searchFilters.AnchorId) {
        this.messageService.add({ severity: 'error', summary: 'Select anchors!' });
        return;
      }
      else if ((this.selectedCities && this.selectedCities.length == 0)|| !this.selectedCities) {
        this.messageService.add({ severity: 'error', summary: 'Select city!' });
        return;
      }
      else if (!this.searchFilters.day && this.searchFilters.day != 'Custom') {
        this.messageService.add({ severity: 'error', summary: 'Select date filters!' });
        return;
      }
    }

    let cityid: any[] = []
    let cityName: any[] = []
    this.selectedCities.forEach((element: any) => {
      cityid.push(element.cityId)
      cityName.push(element.cityName)
    });

    let payload: leadDashboardDetailDc = {
      ProductType: this.selectedProduct.type,
      ProductId: this.selectedProduct.id,
      FromDate: moment(this.searchFilters.FromDate).format('YYYY-MM-DD'),
      ToDate: moment(this.searchFilters.ToDate).format('YYYY-MM-DD'),
      AnchorId: this.searchFilters.AnchorId,
      CityName: cityName,
      CityId: cityid
    }

    // let payload:leadDashboardDetailDc={
    //   "ProductType":"CreditLine",
    //   "ProductId":1,
    //   "FromDate":"2024-04-15",
    //   "ToDate":"2024-04-15",
    //   "AnchorId":[2],
    //   "CityName":["Indore"],
    //   "CityId":[1]
    // }

    //service call 
    this.Loader = true;




    try {
      const res: any = await this.dashboardService.ScaleupDashboardDetails(payload).toPromise();
      // let data = this.commonValidationService.pascalCode(res);
      if (res && res.staus == true) {
        this.apiResponse = res;
        this.Loader = false;
        console.log(this.apiResponse);

        const documentStyle = getComputedStyle(document.documentElement);

        if (this.apiResponse.dashboardResponse)
          this.pieChartCreditLineInfoData = {
            // labels: ['total Credit Limit', 'Utilized Amount', 'Available Limit'],
            datasets: [
              {
                data: [
                  this.apiResponse.dashboardResponse.creditLineInfo.totalCreditLimit,
                  this.apiResponse.dashboardResponse.creditLineInfo.utilizedAmount,
                  this.apiResponse.dashboardResponse.creditLineInfo.availableLimit
                ],
                backgroundColor: ['#6DC5D1','#BEADFA','#FEB941'],
                hoverBackgroundColor: ['#6DC5D1','#BEADFA','#FEB941']
              }
            ]
          };

        this.pieChartOutstandingData = {
          // labels: [
          //   'Total Outstanding Amount',
          //   'Interest Amount',
          //   'Overdue Interest Amount',
          //   'Penal Interest Amount',
          //   'pf OutStanding',
          //   'Bounce'
          // ],
          datasets: [
            {
              data: [
                this.apiResponse.dashboardResponse.outstanding.principalAmount,
                this.apiResponse.dashboardResponse.outstanding.interestAmount,
                this.apiResponse.dashboardResponse.outstanding.overdueInterestAmount,
                this.apiResponse.dashboardResponse.outstanding.penalInterestAmount,
                this.apiResponse.dashboardResponse.outstanding.pfOutStanding,
                this.apiResponse.dashboardResponse.outstanding.bounce
              ],
              backgroundColor: ['#2D9596','#750E21','#E3651D','#BED754','#527853',
                '#3081D0'
              ],
              hoverBackgroundColor: ['#2D9596','#750E21','#E3651D','#BED754','#527853','#3081D0']
            }
          ]
        };

        this.pieChartRepaymentsData = {
          // labels: [
          //   'Interest Amount',
          //   'Overdue Interest Amount',
          //   'Penal Interest Amount',
          //   'pF paid',
          //   'Bounce RePayment Amount',
          //   'Gst Amount'
          // ],
          datasets: [
            {
              data: [
                this.apiResponse.dashboardResponse.repayments.principalAmount,
                this.apiResponse.dashboardResponse.repayments.interestAmount,
                this.apiResponse.dashboardResponse.repayments.overdueInterestAmount,
                this.apiResponse.dashboardResponse.repayments.penalInterestAmount,
                this.apiResponse.dashboardResponse.repayments.pFpaid,
                this.apiResponse.dashboardResponse.repayments.bounceRePaymentAmount,
                this.apiResponse.dashboardResponse.repayments.gstAmount
              ],
              backgroundColor: ['#7C9D96','#FFCC70','#8DDFCB','#C08261','#82A0D8','#8ECDDD','#EDB7ED'],

              hoverBackgroundColor: ['#7C9D96','#FFCC70','#8DDFCB','#C08261','#82A0D8','#8ECDDD','#EDB7ED']
            }
          ]
        };


        this.leadResponsedata = {
          // labels: ['Approved', 'Pending', 'Rejected', 'NotContactable', 'NotIntrested'],
          datasets: [
            {
              data: [this.apiResponse.leadResponse.approved, this.apiResponse.leadResponse.pending, this.apiResponse.leadResponse.rejected, this.apiResponse.leadResponse.notContactable,
              this.apiResponse.leadResponse.notIntrested], // Replace with your CIBIL score data
              backgroundColor: [
                '#50CFBC',
                '#FFBC54',
                '#FF7781',
                '#45BFFF',
                '#707EEF',
              ]
            }
          ]
        };


        //account doughnut
        if (this.apiResponse && this.apiResponse.accResponseDc) {
          this.accResponseDcdata = {
            // labels: ['Approved', 'Pending', 'Rejected', 'NotContactable', 'NotIntrested'],
            datasets: [
              {
                data: [this.apiResponse.accResponseDc.creditApproved, this.apiResponse.accResponseDc.approvalPending, this.apiResponse.accResponseDc.creditRejected,
                this.apiResponse.accResponseDc.offerRejected,
                this.apiResponse.accResponseDc.rejected], // Replace with your CIBIL score data
                backgroundColor: [
                  '#50CFBC',
                  '#FFBC54',
                  '#FF7781',
                  '#45BFFF',
                  '#707EEF',
                ]
              }
            ]
          };
        }

        //loan doughnut
        if (this.apiResponse && this.apiResponse.loanResponseDc) {
          if(this.selectedProduct.type=='BusinessLoan'){
            this.loanResponseDcdata = {
              // labels: ['Approved', 'Pending', 'Rejected', 'NotContactable', 'NotIntrested'],
              datasets: [
                {       
                  data: [this.apiResponse.loanResponseDc.disbursementApproved, this.apiResponse.loanResponseDc.disbursementPending,
                  this.apiResponse.loanResponseDc.disbursementRejected,
                  this.apiResponse.loanResponseDc.offerRejected,
                  this.apiResponse.loanResponseDc.rejected],
                  // Replace with your CIBIL score data
                  backgroundColor: [
                    '#50CFBC',
                    '#FFBC54',
                    '#FF7781',
                    '#45BFFF',
                    '#707EEF',
                  ]
                }
              ]
            }
          }
          else{
            this.loanResponseDcdata = {
              // labels: ['Approved', 'Pending', 'Rejected', 'NotContactable', 'NotIntrested'],
              datasets: [
                {
                  data: [this.apiResponse.loanResponseDc.creditLineApproved, this.apiResponse.loanResponseDc.creditLinePending,
                  this.apiResponse.loanResponseDc.creditLineRejected,
                  this.apiResponse.loanResponseDc.creditLineOfferRejected,
                  this.apiResponse.loanResponseDc.clRejected], // Replace with your CIBIL score data
                  backgroundColor: [
                    '#50CFBC',
                    '#FFBC54',
                    '#FF7781',
                    '#45BFFF',
                    '#707EEF',
                  ]
                }
              ]
            }
          }
       
        };


        const textColor = documentStyle.getPropertyValue('--text-color');

        this.options = {
          title: {
            display: true,
            text: '',
            fontSize: 32,
            position: 'top',
          },
          cutout: '80%',
          responsive: false,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: textColor,
              },
            },
          },
        };


      } else {
        alert("No Data Available")
      }

    } catch (error) {
      console.error(error);
      this.Loader = false;
      throw error; // Rethrow the error for handling in the calling code
    }

  }



  leadExport() {
    debugger;
    let cityid: any[] = []
    let cityName: any[] = []
    this.selectedCities.forEach((element: any) => {
      cityid.push(element.cityId)
      cityName.push(element.cityName)
    });

    let payload: leadDashboardDetailDc = {
      ProductType: this.selectedProduct.type,
      ProductId: this.selectedProduct.id,
      FromDate: moment(this.searchFilters.FromDate).format('YYYY-MM-DD'),
      ToDate: moment(this.searchFilters.ToDate).format('YYYY-MM-DD'),
      AnchorId: this.searchFilters.AnchorId,
      CityName: cityName,
      CityId: cityid
    }
    this.Loader = true;
    this.dashboardService.LeadExport(payload).subscribe((res: any) => {
      debugger;
      if (res && res.message != "Data not found") {
        res.response.forEach((e: any) => {
          if (e.subActivityMasterName == null || e.subActivityMasterName == '') {
            e.subActivityMasterName = e.activity
          }
        })
        this.leadExportData = res.Response;
        this.exportService.exportAsExcelFile(this.leadExportData, 'leadExportData')
      } else {
        alert(res.message);
      }
      this.Loader = false;
    })
  }

}

// payload

export interface leadExportDC {
  "leadCode": any,
  "applicantName": any,
  "mobileNo": any,
  "activity": any,
  "subActivityMasterName": any,
  "anchorName": any,
  "status": any,
  "cityId": number,
  "created": any,
  "userUniqueCode": any,
  "leadID": number,
  "creditLimit": number,
  "disbursedDate": any
}


export interface leadDashboardDetailDc {
  ProductType: any
  ProductId: number
  FromDate: any
  ToDate: any
  // keyword:any
  AnchorId: any
  CityName: any
  CityId: any
}

// response 
export interface LoanAccountDashboardResponseDc {
  status: boolean
  message: any
  creditLineInfo: CreditLineInfoDC
  repayments: RepaymentsDC
  outstanding: OutstandingDC
  creditLine: CreditLineDC
  transactions: TransactionDC
}

export interface CreditLineInfoDC {
  totalSanctionedAmount: number
  totalCreditLimit: number
  utilizedAmount: number
  // ltdutilizedAmount :number
  availableLimit: number
  availableLimitPercentage: number
  // penalAmount :number
  dashboardAvailableLimitGrapthDc: any
  dashboardCreditLimitGrapthDc: any
  dashboardUtilizedAmounttGrapthDc: any

}


export interface RepaymentsDC {
  totalPaidAmount: number
  principalAmount: number
  interestAmount: number
  penalInterestAmount: number
  overdueInterestAmount: number
  extraPaymentAmount: number
  bounceRePaymentAmount: number
  pFpaid: number
  gstAmount: number
  repaymentsUtilizedAmounttGrapthDc: any
  repaymentsCreditLimitGrapthDc: any
  repaymentsAvailableLimitGrapthDc: any
}

export interface OutstandingDC {
  totalOutstandingAmount: number
  pfOutStanding: number
  bounce: number
  principalAmount: number
  interestAmount: number
  penalInterestAmount: number
  overdueInterestAmount: number
  outstandingAvailableLimitGrapthDc: any
  outstandingCreditLimitGrapthDc: any
  outstandingUtilizedAmounttGrapthDc: any
}

export interface CreditLineDC {
  percentage: number
  utilizedAmount: number
  totalCreditLimit: number
}

export interface TransactionDC {
  transactionNumber: string
  transactionDate: any
  status: string
}




//chart response
export interface scaleupDashboardResponseDc {
  "message": string
  "status": any
  "leadResponse": leadDashboardResponseDc
  "accResponseDc": AccountDashboardResponseDc
  "loanResponseDc": LoanDashboardResponseDc
  "dashboardResponse": LoanAccountDashboardResponseDc


}

export interface AccountDashboardResponseDc {
  creditApproved: number
  approvalPending: number
  creditRejected: number
  offerRejected: number
  rejected: number
  totalAccounts: number
  creditApprovalPercentage: number
}

export interface LoanDashboardResponseDc {
  disbursementApproved: number
  disbursementPending: number
  disbursementRejected: number
  offerRejected: number
  rejected: number
  totalLoan: number
  disbursementApprovalPercentage: number
  creditLineApproved: number
  creditLinePending: number
  creditLineRejected: number
  creditLineOfferRejected: number
  clRejected: number
  creditLineTotalLoan: number
  creditLineApprovalPercentage:number 
}

export interface leadDashboardResponseDc {
  approved: number
  pending: number
  rejected: number
  notContactable: number
  totalLeads: number
  wholeDays: number
  remainingHours: number
  notIntrested: number
  approvalPercentage: number
}