import { Component, ElementRef, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DashboardService } from '../services/dashboard.service';
// import { CommonValidationService } from 'app/shared/services/common-validation.service';
// import { ExportService } from 'app/shared/scale-up-shared/services/export.service';
import * as moment from 'moment';

@Component({
  selector: 'app-hop-dashboard',
  templateUrl: './hop-dashboard.component.html',
  styleUrls: ['./hop-dashboard.component.scss'],
})
export class HopDashboardComponent {

  //parent
  @ViewChild('divToMeasure') divToMeasure!: ElementRef;
  //sub parent
  @ViewChild('divMeasureOB') divMeasureOB!: ElementRef;
  @ViewChild('divMeasureApp') divMeasureApp!: ElementRef;
  @ViewChild('divMeasureNBFC') divMeasureNBFC!: ElementRef;
  @ViewChild('divMeasureAcRj') divMeasureAcRj!: ElementRef;
  @ViewChild('divMeasureAgre') divMeasureAgre!: ElementRef;
  @ViewChild('divMeasureDis') divMeasureDis!: ElementRef;

  // ProductDropdown: any = [];
  AnchorList: any;
  CityList: any;
  tatPercentage: any;
  DayList: any = [
    { label: 'Today', value: 'Today' },
    { label: 'MTD', value: 'MTD' },
    { label: 'Last Month', value: 'Last Month' },
    { label: 'Custom', value: 'Custom' },
  ];

  // selectedProduct: any;
  selectedCities: any;
  searchFilters: any = {
    FromDate: null,
    ToDate: null,
    AnchorId: 0,
    CityId: 0,
    day: null,
  };

  Loader: boolean = false;
  // leadExportData: any;
  graphStyleOptions: any;
  donutStyleOptions: any;

  trends: any = {
    utilizationSCF: {
      labels: [],
      datasets: [],
      graphName: 'Utilization - SCF',
    },
    disbursementBL: {
      labels: [],
      datasets: [],
      graphName: 'Disbursement - BL',
    },
    loanBook: { labels: [], datasets: [], graphName: 'Loan Book' },
    revenue: { labels: [], datasets: [], graphName: 'Revenue' },
    overdue: { labels: [], datasets: [], graphName: 'Overdue' },
  };

  disbursement: any = {
    SCF: {
      // labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [0],
        },
      ],
      graphName: 'SCF',
    },
    SCFData: { totalLimit: 0, AvgUtilization: 0, utilizationPerc: 0 },

    BL: {
      // labels: [],
      datasets: [
        {
          data: [0],
        },
      ],
      graphName: 'BL',
    },
    BLData: { totalLimit: 0, OutStanding: 0, outstandingPerc: 0 },

    overall: {
      // labels: [],
      datasets: [
        {
          data: [0],
        },
      ],
      graphName: 'Overall',
    },
    overallData: { totalOutstanding: 0, overdue: 0, OverduePerc: 0 },

    assetQuality: {
      // labels: [],
      datasets: [
        {
          data: [0],
        },
      ],
      graphName: 'Asset Quality',
    },
    assetQualityData: { cibilLess: 0, cibilGreater: 0, NTC: 0 }

  };

  retention: any = {
    mom: 0,
    qoq: 0
  }

  revenue: any = {
    scRevenue: 0,
    blRevenue: 0,
    totalRevenue: 0,
  }

  scdpd: any[] = [];
  bldpd: any[] = [];

  tatReport = {
    totalHrs: 0,
    onBoarding: 0,
    approval: 0,
    sendToNBFC: 0,
    accRej: 0,
    agreement: 0,
    disbursal: 0,

    onBoardingHrs: 0,
    approvalHrs: 0,
    sendToNBFCHrs: 0,
    accRejHrs: 0,
    agreementHrs: 0,
    disbursalHrs: 0,
  }
  // tatTable: any[] = [];



  constructor(
    private messageService: MessageService,
    private dashboardService: DashboardService,
    // private commonValidationService: CommonValidationService,
    // private exportService: ExportService
  ) { 
    
    // let divMeasureOB = this.divMeasureOB.nativeElement.offsetWidth;
    // let divMeasureApp = this.divMeasureApp.nativeElement.offsetWidth;
    // let divMeasureNBFC = this.divMeasureNBFC.nativeElement.offsetWidth;

    // let divMeasureAcRj = this.divMeasureAcRj.nativeElement.offsetWidth;
    // let divMeasureAgre = this.divMeasureAgre.nativeElement.offsetWidth;
    // let divMeasureDis = this.divMeasureDis.nativeElement.offsetWidth;
  }

  async ngOnInit(): Promise<void> {

    this.setGraphStyleOptions();
    this.setDonutStyleOptions();
    await this.GetLeadCityList();
    await this.getCompanyList();
    this.searchFilters.day = 'Today';
    this.searchFilters.FromDate = new Date();
    this.searchFilters.ToDate = new Date();
    // this.messageService.add({ severity: 'error', summary: 'error in getDashboardCompanyList api!' });
    await this.onSearch();


  }

  async getCompanyList() {
    try {
      let payload = {
        "keyword": null,
        "skip": 0,
        "take": 10,
        "CompanyType": "Anchor"
      }
      // this.Loader = true;
      const res: any = await this.dashboardService.getDashboardCompanyList(payload).toPromise();
      // console.log(res);
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

  setGraphStyleOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.graphStyleOptions = {
      stacked: false,
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            display: false,
            color: textColor,

          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y1: {
          type: 'linear',
          display: false,
          position: 'right',
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            display: false,
            drawOnChartArea: false,
            color: surfaceBorder,
          },
        },
      },
    };
  }

  setDonutStyleOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.donutStyleOptions = {
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
    };
  }

  getDate(e: any) {
    // debugger;
    this.searchFilters.FromDate = '';
    this.searchFilters.ToDate = '';
    if (this.searchFilters.day == 'Today') {
      //   moment(new Date()).format('YYYY-MM-DD');
      this.searchFilters.FromDate = new Date();
      this.searchFilters.ToDate = new Date();
      return;
    }
    if (this.searchFilters.day == 'MTD') {
      var date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
      this.searchFilters.FromDate = new Date(y, m, 1);
      this.searchFilters.ToDate = new Date();
      return;
    }
    if (this.searchFilters.day == 'Last Month') {
      var now = new Date();
      this.searchFilters.FromDate = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );

      const firstDayOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );
      this.searchFilters.ToDate = new Date(
        firstDayOfMonth.getFullYear(),
        firstDayOfMonth.getMonth() + 1,
        0
      );
      return;
    } else {
      this.searchFilters.FromDate = '';
      this.searchFilters.ToDate = '';
    }
  }

  validateYearDifference() {
    // debugger
    if (this.searchFilters.ToDate) {
      const oneYearDifference = moment(this.searchFilters.FromDate).diff(
        moment(this.searchFilters.ToDate),
        'years'
      );
      if (Math.abs(oneYearDifference) === 1) {
        this.searchFilters.ToDate = '';
        this.messageService.add({
          severity: 'error',
          summary: 'Cant get data of more than 1 year !',
        });
      }
    }
  }

  async GetLeadCityList() {
    try {
      this.Loader = true;
      const res: any = await this.dashboardService
        .GetLeadCityList()
        .toPromise();
      // console.log(res);
      this.Loader = false;
      this.CityList = res.response;
      // console.log('this.CityList', this.CityList);
      this.selectedCities = this.CityList;
    } catch (error) {
      // console.error(error);
      this.messageService.add({
        severity: 'error',
        summary: 'error in getDashboardCityList api!',
      });
      this.Loader = false;
      throw error; // Rethrow the error for handling in the calling code
    }
  }



  async onSearch() {
    console.log(this.searchFilters);
    // debugger
    if (this.searchFilters) {
      if (
        this.searchFilters.day == 'Custom' &&
        (!this.searchFilters.FromDate || !this.searchFilters.ToDate)
      ) {
        this.messageService.add({
          severity: 'error',
          summary: 'Select custom dates!',
        });
        return;
      } else if (!this.searchFilters.AnchorId) {
        this.messageService.add({
          severity: 'error',
          summary: 'Select anchors!',
        });
        return;
      } else if (
        (this.selectedCities && this.selectedCities.length == 0) ||
        !this.selectedCities
      ) {
        this.messageService.add({ severity: 'error', summary: 'Select city!' });
        return;
      } else if (
        !this.searchFilters.day &&
        this.searchFilters.day != 'Custom'
      ) {
        this.messageService.add({
          severity: 'error',
          summary: 'Select date filters!',
        });
        return;
      }
    }

    let cityid: any[] = [];
    let cityName: any[] = [];

    this.selectedCities.forEach((element: any) => {
      cityid.push(element.cityId);
      cityName.push(element.cityName);
    });

    let payload: any = {
      productType: '',
      productId: 0,
      fromDate: moment(this.searchFilters.FromDate).format('YYYY-MM-DD'),
      toDate: moment(this.searchFilters.ToDate).format('YYYY-MM-DD'),
      anchorId: this.searchFilters.AnchorId,
      cityName: cityName,
      cityId: cityid,
    };

    //service call
    this.Loader = true;

    try {
      const res: any = await this.dashboardService
        .GetDisbursementDashboardData(payload)
        .toPromise();
      // let data = this.commonValidationService.pascalCode(res);
      console.log("GetDisbursementDashboardData", res);
      if (res) {

        this.scdpd = res.scdpd ? res.scdpd : [];
        this.bldpd = res.bldpd ? res.bldpd : [];

        // debugger

        //tat 
        let reportingTotalHrs = (
          Math.abs(res.cohortData.agreementToAgreementAcceptTimeInHours) + // agreement to disbusment
          Math.abs(res.cohortData.allApprovedToSendToLosTimeInHours) + //all approve to send to NBFC
          Math.abs(res.cohortData.initiateSubmittedTimeInHours) + //onboarding to submitted
          Math.abs(res.cohortData.offerAcceptToAgreementTimeInHours) + // accept offer to agreement
          Math.abs(res.cohortData.sendToLosToOfferAcceptTimeInHours) + //NBFC   to accept offer
          Math.abs(res.cohortData.submittedToAllApprovedTimeInHours) ////submitted to all approve 
        )

        this.tatReport = {
          totalHrs: reportingTotalHrs,
          

          onBoarding: Math.abs(res.cohortData.initiateSubmittedTimeInHours) > 0 ? calcWidth(res.cohortData.initiateSubmittedTimeInHours) : 0,
          approval: Math.abs(res.cohortData.submittedToAllApprovedTimeInHours) > 0 ? calcWidth(res.cohortData.submittedToAllApprovedTimeInHours) : 0,
          sendToNBFC: Math.abs(res.cohortData.allApprovedToSendToLosTimeInHours) > 0 ? calcWidth(res.cohortData.allApprovedToSendToLosTimeInHours) : 0,
          accRej: Math.abs(res.cohortData.sendToLosToOfferAcceptTimeInHours) > 0 ? calcWidth(res.cohortData.sendToLosToOfferAcceptTimeInHours) : 0,
          agreement: Math.abs(res.cohortData.offerAcceptToAgreementTimeInHours) > 0 ? calcWidth(res.cohortData.offerAcceptToAgreementTimeInHours) : 0,
          disbursal: Math.abs(res.cohortData.agreementToAgreementAcceptTimeInHours) > 0 ? calcWidth(res.cohortData.agreementToAgreementAcceptTimeInHours) : 0,

          onBoardingHrs: res.cohortData.initiateSubmittedTimeInHours,
          approvalHrs: res.cohortData.submittedToAllApprovedTimeInHours,
          sendToNBFCHrs: res.cohortData.allApprovedToSendToLosTimeInHours,
          accRejHrs: res.cohortData.sendToLosToOfferAcceptTimeInHours,
          agreementHrs: res.cohortData.offerAcceptToAgreementTimeInHours,
          disbursalHrs: res.cohortData.agreementToAgreementAcceptTimeInHours
        
        }

        function calcWidth(element: any): number {
          let perc = ((Math.abs((element)) * 100) / reportingTotalHrs);
          return perc
        }

        console.log(this.tatReport);
        let totalWid =  (this.tatReport.onBoarding +
          this.tatReport.approval +
          this.tatReport.sendToNBFC +
          this.tatReport.accRej +
          this.tatReport.agreement +
          this.tatReport.disbursal )
        console.log('totalWidth =', totalWid);
          

        //both outstanding tables
        const totalAmountscdpd = this.scdpd.reduce((sum, item) => sum + item.amount, 0);
        this.scdpd = this.scdpd.map(item => ({ ...item, avgPercentage: parseFloat(((item.amount * 100) / totalAmountscdpd).toFixed(2)) }));
        const totalAmountbldpd = this.bldpd.reduce((sum, item) => sum + item.amount, 0);
        this.bldpd = this.bldpd.map(item => ({ ...item, avgPercentage: parseFloat(((item.amount * 100) / totalAmountbldpd).toFixed(2)) }));

        // console.log(this.scdpd, this.bldpd);


        this.retention.mom = res.retentionPercentage.momRetentionPercentage;
        this.retention.qoq = res.retentionPercentage.qoqRetentionPercentage;

        this.revenue = {
          scRevenue: res.avgSCRevenue,
          blRevenue: res.avgBLRevenue,
          totalRevenue: res.totalRevenue
        }

        // set graphs
        if (res.utilizedAmounttGrapth) {
          this.trends.utilizationSCF.labels = res.utilizedAmounttGrapth.xValue == null ? [] : res.utilizedAmounttGrapth.xValue;
          this.trends.utilizationSCF.datasets = this.arrangeGraphData(res.utilizedAmounttGrapth.yValue == null ? [] : res.utilizedAmounttGrapth.yValue);
        }

        if (res.disbursementGrapth) {
          this.trends.disbursementBL.labels = res.disbursementGrapth.xValue == null ? [] : res.disbursementGrapth.xValue;
          this.trends.disbursementBL.datasets = this.arrangeGraphData(res.disbursementGrapth.yValue == null ? [] : res.disbursementGrapth.yValue);
        }

        if (res.loanBook) {
          this.trends.loanBook.labels = res.loanBook.xValue == null ? [] : res.loanBook.xValue;
          this.trends.loanBook.datasets = this.arrangeGraphData(res.loanBook.yValue == null ? [] : res.loanBook.yValue);
        }

        if (res.blRevenueGraph || res.scRevenueGraph) {
          if(res.blRevenueGraph){
            this.trends.revenue.labels = res.blRevenueGraph ? (res.blRevenueGraph.xValue == null ? [] : res.blRevenueGraph.xValue) : [];
          }
          if(res.scRevenueGraph){
            this.trends.revenue.labels = res.scRevenueGraph ? (res.scRevenueGraph.xValue == null ? [] : res.scRevenueGraph.xValue) : [];
          }
          let bl_x_axis = res.blRevenueGraph ? res.blRevenueGraph.yValue : [];
          let sc_x_axis = res.scRevenueGraph ? res.scRevenueGraph.yValue : [];
          this.trends.revenue.datasets = this.arrangeRevGraphData(bl_x_axis, sc_x_axis);
        }

        if (res.overDueAmountGrapth || res.bLoverDueAmountGrapth) {
          if(res.overDueAmountGrapth){
            this.trends.overdue.labels = res.overDueAmountGrapth.xValue == null ? [] : res.overDueAmountGrapth.xValue;
          }
          if(res.bLoverDueAmountGrapth){
            this.trends.overdue.labels = res.bLoverDueAmountGrapth.xValue == null ? [] : res.bLoverDueAmountGrapth.xValue;
          }
          let sc_x_axis = res.overDueAmountGrapth ? res.overDueAmountGrapth.yValue : [];
          let bl_x_axis = res.bLoverDueAmountGrapth ? res.bLoverDueAmountGrapth.yValue : [];
          this.trends.overdue.datasets = this.arrangeRevGraphData(bl_x_axis, sc_x_axis);
          // this.trends.overdue.datasets = this.arrangeGraphData(res.overDueAmountGrapth.yValue == null ? [] : res.overDueAmountGrapth.yValue);
        }
        this.setGraphStyleOptions();

        //set donuts
        this.disbursement.SCFData.totalLimit = parseInt(res.scTotalLimit);
        this.disbursement.SCFData.AvgUtilization = parseInt(res.avgUtilization);
        this.disbursement.SCF.datasets = this.arrangeDonutData(this.disbursement.SCFData.totalLimit, this.disbursement.SCFData.AvgUtilization, 'scf');

        this.disbursement.BLData.totalLimit = parseInt(res.blTotalLimit);
        this.disbursement.BLData.OutStanding = parseInt(res.blOutstanding);
        this.disbursement.BL.datasets = this.arrangeDonutData(this.disbursement.BLData.totalLimit, this.disbursement.BLData.OutStanding, 'bl');

        this.disbursement.overallData.totalOutstanding = parseInt(res.totalOutstanding);
        this.disbursement.overallData.overdue = parseInt(res.totalOverDueAmount);
        this.disbursement.overall.datasets = this.arrangeDonutData(this.disbursement.overallData.totalOutstanding, this.disbursement.overallData.overdue, 'overall');

        this.disbursement.assetQualityData.cibilGreater = parseInt(res.cibilData.cibilGreaterPercentage);
        this.disbursement.assetQualityData.cibilLess = parseInt(res.cibilData.cibilLessPercentage);
        this.disbursement.assetQualityData.NTC = parseInt(res.cibilData.cibilZeroPercentage);
        this.disbursement.assetQuality.datasets = this.arrangeCibilData(this.disbursement.assetQualityData.cibilGreater, this.disbursement.assetQualityData.cibilLess, this.disbursement.assetQualityData.NTC);

        this.setDonutStyleOptions();
        // console.log("this.trends, this.disbursement", this.trends, this.disbursement);

        this.renderWidth()

        this.Loader = false;
      } else {
        this.Loader = false;
        alert('No Data Available');
      }
    } catch (error) {
      console.error(error);
      this.Loader = false;
      throw error; // Rethrow the error for handling in the calling code
    }
  }

  renderWidth(){
    let divToMeasureWidth = this.divToMeasure.nativeElement.offsetWidth;
    console.log("-----------------", divToMeasureWidth, this.tatReport);
    let unit =70;
    let totalCols = Math.floor( divToMeasureWidth/unit);
    
    // this.tatPercentage.accRej = this.tatReport.accRej>0? this.tatReport.accRej: 1;  
    // this.tatPercentage.agreement = this.tatReport.agreement>0?this.tatReport.agreement:1;
    // this.tatPercentage.approval = this.tatReport.approval>0?this.tatReport.approval:1;
    // this.tatPercentage.disbursal = this.tatReport.disbursal>0?this.tatReport.disbursal:1;
    // this.tatPercentage.onBoarding = this.tatReport.onBoarding>0?this.tatReport.onBoarding:1;
    // this.tatPercentage.sendToNBFC = this.tatReport.sendToNBFC>0?this.tatReport.sendToNBFC:1;
      

  }


  arrangeGraphData(elementsArr: any): any {
    const documentStyle = getComputedStyle(document.documentElement);
    return [{
      label: 'Graph',
      data: elementsArr,
      fill: false,
      borderColor: documentStyle.getPropertyValue('--blue-500'),
      tension: 0.4
    }]
  }

  arrangeRevGraphData(bl: any, sc: any) {
    const documentStyle = getComputedStyle(document.documentElement);
    return [{
      label: 'BL',
      data: bl,
      fill: false,
      borderColor: documentStyle.getPropertyValue('--red-500'),
      tension: 0.4
    }, {
      label: 'SC',
      data: sc,
      fill: false,
      borderColor: documentStyle.getPropertyValue('--blue-500'),
      tension: 0.4
    }]
  }

  arrangeDonutData(total: any, agg: any, key: string): any {


    //note - total is 100% 
    //agg is the utilized/outstanding/overdue (consumed part)
    //100% - aggOnePerc = aggtwoPerc
    //100% - aggtwoPerc = aggOnePerc
    //100% = aggtwoPerc + aggOnePerc


    let aggtwoPerc: number = ((agg / total) * 100).toFixed(2) == ('NaN' || 0) ? 0 : parseInt(((agg / total) * 100).toFixed(2));
    let aggOnePerc = 100 - aggtwoPerc;

    switch (key) {
      case 'scf':
        this.disbursement.SCFData.utilizationPerc = aggtwoPerc;
        break;
      case 'bl':
        this.disbursement.BLData.outstandingPerc = aggtwoPerc;
        break;
      case 'overall':
        this.disbursement.overallData.OverduePerc = aggtwoPerc;
        break;
      default:
        break;
    }

    return [{
      data: [aggtwoPerc, aggOnePerc],
      backgroundColor: ['rgba(0, 160, 227, 1)', '#edeef7'],
      hoverBackgroundColor: ['rgba(0, 160, 227, 1)', '#edeef7']
    }]
  }

  arrangeCibilData(grt: any, less: any, NTC: any): any {
    return [{
      data: [grt, less, NTC],
      backgroundColor: ['#edeef7', 'rgba(0, 160, 227, 1)', 'rgba(6, 78, 116, 1)'],
      hoverBackgroundColor: ['#edeef7', 'rgba(0, 160, 227, 1)', 'rgba(6, 78, 116, 1)']
    }]
  }


}
