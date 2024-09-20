import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { LeadService } from 'app/pages/lead/services/lead.service';
// import { CommonValidationService } from 'app/shared/services/common-validation.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DsaService } from '../../services/dsa.service';
import { LeadService } from '../../../lead/services/lead.service';
import { CommonValidationService } from '../../../../shared/services/common-validation.service';
@Component({
  selector: 'app-dsa-detail',
  templateUrl: './dsa-detail.component.html',
  styleUrls: ['./dsa-detail.component.scss']
})
export class DsaDetailComponent {
  StatusList: any[]; // Define the type according to your needs
  StatusFilter: any;

  leadData: any
  Loader: boolean = false;
  visible: boolean = false;
  kycDetails: any;
  blockval: boolean = false;
  // IsActive: boolean = false;
  IsBlock: boolean = false;
  IsProfile: string = '';
  leadActivitiesList: any[] = [];
  isApprovelead: boolean = false;
  isLeadReject: boolean = false;
  productList: any
  Message: any
  selectedProduct:any=[];


  activityApprovalStatus = {
      "Pan": "",
      "Aadhar": "",
      "Selfie": "",
      "PersonalInfo": "",
      "BusinessInfo": "",
      "BankDetail": ""
  }

  address: Address = {
      addressLineOne: '',
      addressLineTwo: '',
      addressLineThree: '',
      cityName: '',
      countryName: '',
      stateName: '',
      zipCode: ''
  }

  businessDetail: BusinessDetail = {
      businessName: '',
      BusinessType: '',
      BusinessTurnOver: 0,
      IncorporationDate: '',
      IncomeSlab: 0,
      GstNumber: 0,
      CurrentAddress: this.address,
      buisnessProofUrl: ''
  };

  borrowerDetail: BorrowerDetail = {
      firstName: '',
      lastName: '',
      middleName: '',
      gender: '',
      dob: ''
  }

  panDetail: PanDetail = {
      fatherName: '',
      nameOnCard: '',
      uniqueId: '',
      frontImageUrl: '',
      doi: '',
      dob: ''
  }

  bankDetail: BankDetail = {
      borroBankAccNum: '',
      borroBankIFSC: '',
      borroBankName: '',
      accType: ''
  }

  aadharDetail: AadharDetail = {
      maskedAadhaarNumber: '',
      frontImageUrl: '',
      gender: '',
      dob: '',
      backImageUrl: '',
      country: '',
      name: '',
      pinCode: '',
      fatherName: '',
      locationAddress: this.address
  }

  personalDetail: PersonalDetail = {
      CurrentAddress: this.address,
      PermanentAddress: this.address,
      ElectricityBillImage: '',
      MobileNumber: ''
  }

  selfieDetail: SelfieDetail = {
      frontImageUrl: ''
  }

  loanAccount: LoanAccount = {
      LoanAccountId: 0,
      IsAccountActive: false,
      IsBlock: false,
      IsBlockComment: '',
      IsBlockHideLimit: false
  }

  //imageshow/download
  showImage: boolean = false;
  dialogUrl: any
  showUrl: any
  userrole: any;
  roles: any;
  customerData: any;
  userName: any
  LeadGeneratorConvertorObj: LeadGeneratorConvertor = {
      LeadId: 0,
      LeadGenerator: '',
      LeadConvertor: ''
  }
  constructor(private _leadService: LeadService, private confirmationService: ConfirmationService, private commonValidation: CommonValidationService,
      private messageService: MessageService,        private router: Router,
      private activatedRoute: ActivatedRoute,private _dsaService:DsaService
    ) {
      this.StatusList = [
          { label: 'Profile', value: 'Profile' },
          // { label: 'Activity', value: 'Activity' },
          { label: 'Offer', value: 'Offer' }
      ];
  }
  defSelectedPro:string=''
  async ngOnInit() {
      this.roles = localStorage.getItem('roles');
      console.log(this.roles, 'this.roles');
      this.userrole = this.roles.split(',');
      console.log(this.userrole, 'userrole');
      this.StatusFilter = this.StatusList[0].value;
      this.userName = localStorage.getItem('username');
      console.log(this.userName, 'this.userName');

      this.leadData = localStorage.getItem('DsaleadData');
      this.leadData = JSON.parse(this.leadData);
      console.log("this.leadData", this.leadData);
      this.IsProfile = 'Profile';

      await this.GetDSALeadDataById()
    //   await this.GetDSAAgreement()
      await this.getProductMasterList()
    //   await this.GetLeadDetails();
    //   await this.IsOfferGenerated(this.leadData.leadId);
    //   await this.GetOfferAccepted(this.leadData.leadId);
      await this.GetleadActivities(this.leadData.leadId, 1)
      await this.getUserList()
      this.GetLeadCommonDetail();
      if(this.dsaProfileInfo=='Connector'){
        this.productList.forEach((e:any)=>{
            if(e.type=="BusinessLoan"){
                this.selectedProduct.push(e)
                if(this.defSelectedPro!=''){
                    this.defSelectedPro=this.defSelectedPro.concat(',')
                }
                this.defSelectedPro=this.defSelectedPro.concat(e.name)
            }
        })
      }
  }

  isUsersAvailable:boolean=false;
  async getUserList(){
    try {
        this.Loader = true;
        var res = await this._dsaService.GetDSAUsersList(this.leadData.userId,0,10).toPromise();
        console.log(res)
        this.Loader = false;

        if(res.isSuccess){
            if(res.result && res.result.length>0){
             this.isUsersAvailable=true;
            }}
            else{
               this.isUsersAvailable=false;
            //  this.messageService.add({ severity: 'error', summary:res.message });
           }
    }

    catch (error: any) {
        this.Loader = false;
        this.messageService.add({ severity: 'error', summary: 'Error API - GetDSAUsersList', detail: error });
    }
  }
  async getProductMasterList() {
    try {
      this.Loader = true;
      const res: any = await this._dsaService.GetProductMasterList().toPromise();
      console.log(res);
      this.Loader = false;
      this.productList = res.returnObject;
    } catch (error) {
      console.error(error);
      this.Loader = false;
      throw error; // Rethrow the error for handling in the calling code
    }
}
  isLeadConvertorDisabled: boolean = false;
  isLeadGeneratorDisabled: boolean = false;
  async GetLeadCommonDetail() {
      if (this.leadData.leadId > 0) {
          this.Loader = true;
          var res = await this._leadService.GetLeadCommonDetail(this.leadData.leadId).toPromise();
          this.Loader = false;
          if (res != null) {
              this.customerData = res;
              console.log(this.customerData);
              console.log(this.customerData?.leadConvertor, 'this.customerData?.leadConvertor');

              this.isLeadConvertorDisabled = (this.customerData?.leadConvertor) ? true : false;
              this.isLeadGeneratorDisabled = (this.customerData?.leadGenerator) ? true : false;
              console.log(this.isLeadConvertorDisabled, 'this.isLeadConvertorDisabled');
              console.log(this.isLeadGeneratorDisabled, 'this.isLeadGeneratorDisabled');
          }
      }
  }
  isDsaAgreement:boolean=false
 async  GetDSAAgreement(){
    try {
        this.Loader = true;
        var res = await this._dsaService.GetDSAAgreement(this.leadData.leadId).toPromise();
        console.log(res)
        if(res.status ){
            this.isDsaAgreement=true
            this.Loader = false;
            
           
        }
        else{
            this.isDsaAgreement=false
            this.Loader = false;

        }
    }
    catch (error: any) {
        this.Loader = false;
        this.messageService.add({ severity: 'error', summary: 'Error API - GetDSAAgreement', detail: error });
    }
  }

  isLeadGeneratorPopup: boolean = false;
  addLeadPopup() {
      this.isLeadGeneratorPopup = true;
      this.LeadGeneratorConvertorObj.LeadGenerator = this.customerData?.leadGenerator;
      this.LeadGeneratorConvertorObj.LeadConvertor =this.customerData?.leadConvertor;
  }
  isValidate: boolean = false;
  addLeadGeneratorConvertor() {
      // debugger

      if (this.LeadGeneratorConvertorObj.LeadGenerator != null) {
          this.LeadGeneratorConvertorObj.LeadGenerator = this.LeadGeneratorConvertorObj.LeadGenerator.trim()
      }
      if (this.LeadGeneratorConvertorObj.LeadConvertor != null) {
          this.LeadGeneratorConvertorObj.LeadConvertor = this.LeadGeneratorConvertorObj.LeadConvertor.trim()
      }

      // this.LeadGeneratorConvertorObj.LeadGenerator = this.customerData?.leadGenerator ? this.customerData?.leadGenerator : this.LeadGeneratorConvertorObj.LeadGenerator
      // this.LeadGeneratorConvertorObj.LeadConvertor = this.customerData?.leadConvertor ? this.customerData?.leadConvertor : this.LeadGeneratorConvertorObj.LeadConvertor;
      if (this.leadData.leadId > 0) {
          if ((this.LeadGeneratorConvertorObj.LeadGenerator != null && !this.isFirstLetterNotSpace(this.LeadGeneratorConvertorObj.LeadGenerator))) {
              this.messageService.add({ severity: 'error', summary: 'Please Enter Lead Generator', detail: '' });
              this.isValidate = false;
          }
          else if ((this.LeadGeneratorConvertorObj.LeadConvertor != null && !this.isFirstLetterNotSpace(this.LeadGeneratorConvertorObj.LeadConvertor))) {
              this.messageService.add({ severity: 'error', summary: 'Please Enter Lead Convertor', detail: '' });
              this.isValidate = false;
          }
          else {
              this.isValidate = true;
          }
      } else {
          this.messageService.add({ severity: 'error', summary: 'Lead id is null', detail: '' });
          this.isValidate = false;
      }

      if (this.isValidate) {
          const payload = {
              'LeadId': this.leadData.leadId,
              'LeadGenerator': this.LeadGeneratorConvertorObj.LeadGenerator,
              'LeadConvertor': this.LeadGeneratorConvertorObj.LeadConvertor,
              'UserName': this.userName ? this.userName : ''
          }
          this.Loader = true;
          this._leadService.AddLeadGeneratorConvertor(payload).subscribe(res => {
              console.log(res);
              if (res) {
                  this.Loader = false;
                  this.messageService.add({ severity: 'success', summary: 'Success', detail: '' });
                  this.isLeadGeneratorPopup = false;
                  this.GetLeadCommonDetail();
                  window.location.reload();
              }
              else{
                this.Loader = false;
                this.messageService.add({ severity: 'error', summary: 'error', detail: '' });
                this.isLeadGeneratorPopup = false;
              }
          }, (error: any) => {
              console.log(error);
              this.Loader = false;
          })
      }

  }
  cancelleadGeneratorpopup() {
      this.LeadGeneratorConvertorObj.LeadGenerator = '';
      this.LeadGeneratorConvertorObj.LeadConvertor = '';
  }

  dsaProfileInfo:any
  async GetLeadDetails() {
      // this.Loader.isLoading(true);
      this.Loader = true;
      var res = await this._leadService.GetLeadDetailsByUserId(this.leadData.userId, this.leadData.leadId).toPromise();

      // this.Loader.isLoading(false);
      this.Loader = false;
      console.log(res, 'data');
      if (res) {
        // this.dsaProfileInfo=res.dsaProfileInfo?res.dsaProfileInfo.dsaType:''
        this.leadData.payoutPercentage=res.payoutPercentage
        if(this.dsaProfileInfo=='Connector'){
            var data = this.productList.filter((x: any) => {
                if (x.name == "Business Loan") return x
            })
            console.log('data',data)
        }

          if (res.buisnessDetail) {
              this.businessDetail.businessName = res.buisnessDetail.businessName;
              this.businessDetail.BusinessType = res.buisnessDetail.busEntityType;
              this.businessDetail.GstNumber = res.buisnessDetail.busGSTNO;
              this.businessDetail.IncorporationDate = res.buisnessDetail.doi;
              this.businessDetail.IncomeSlab = res.buisnessDetail.incomeSlab;
              this.businessDetail.CurrentAddress = res.buisnessDetail.currentAddress;
              this.businessDetail.buisnessProofUrl = res.buisnessDetail.buisnessProofUrl;

          }
          if (res.personalDetail) {
              this.borrowerDetail.firstName = res.personalDetail.firstName;
              this.borrowerDetail.lastName = res.personalDetail.lastName;
              this.borrowerDetail.middleName = res.personalDetail.middleName;
              this.borrowerDetail.gender = res.personalDetail.gender;
              this.personalDetail.CurrentAddress = res.personalDetail.currentAddress;
              this.personalDetail.PermanentAddress = res.personalDetail.permanentAddress;
              this.personalDetail.ElectricityBillImage = res.personalDetail.manualElectricityBillImage;
              this.personalDetail.MobileNumber = res.personalDetail.mobileNo;

          }
          if (res.panDetail) {
              this.borrowerDetail.dob = res.panDetail.dob;
              this.panDetail.dob = res.panDetail.dob;
              this.panDetail.fatherName = res.panDetail.fatherName;
              this.panDetail.uniqueId = res.panDetail.uniqueId;
              this.panDetail.nameOnCard = res.panDetail.nameOnCard;
              this.panDetail.frontImageUrl = res.panDetail.frontImageUrl;
          }
          if (res.bankStatementDetail) {
              this.bankDetail.borroBankAccNum = res.bankStatementDetail.borroBankAccNum;
              this.bankDetail.borroBankIFSC = res.bankStatementDetail.borroBankIFSC;
              this.bankDetail.borroBankName = res.bankStatementDetail.borroBankName;
              this.bankDetail.accType = res.bankStatementDetail.accType;
          }
          if (res.aadharDetail) {
              this.aadharDetail.maskedAadhaarNumber = res.aadharDetail.maskedAadhaarNumber;
              this.aadharDetail.frontImageUrl = res.aadharDetail.frontImageUrl;
              this.aadharDetail.backImageUrl = res.aadharDetail.backImageUrl;
              this.aadharDetail.gender = res.aadharDetail.gender;
              this.aadharDetail.dob = res.aadharDetail.dob;
              this.aadharDetail.country = res.aadharDetail.country;
              this.aadharDetail.locationAddress = res.aadharDetail.locationAddress;
              this.aadharDetail.fatherName = res.aadharDetail.fatherName;
              this.aadharDetail.pinCode = res.aadharDetail.pincode;
              this.aadharDetail.name = res.aadharDetail.name;
          }
          if (res.selfieDetail) {
              this.selfieDetail.frontImageUrl = res.selfieDetail.frontImageUrl;
          }
          if (res.loanAccount) {
              this.loanAccount.LoanAccountId = res.loanAccount.loanAccountId;
              this.loanAccount.IsAccountActive = res.loanAccount.isAccountActive;
              this.loanAccount.IsBlock = res.loanAccount.isBlock;
              this.loanAccount.IsBlockComment = res.loanAccount.isBlockComment;
              this.loanAccount.IsBlockHideLimit = res.loanAccount.isBlockHideLimit;
          }
      } else {
          // alert("ERROR - GetLeadDetailsByUserId")
      }
  }
  isOfferGenerated: boolean = false;
  isjump: boolean = false;
  istotalcount: any;
  isapproved: any;
  IsleadReject: boolean = false;
  IsOfferGeneratedFlag: boolean = false;

  async GetDSALeadDataById(){
      this.Loader = true;
      try{
        var res = await this._dsaService.GetDSALeadDataById(this.leadData.leadId,this.leadData.status).toPromise();
        this.Loader = false;
        this.leadData=res.response;
        console.log('GetDSALeadDataById',res.response)
        this.dsaProfileInfo=res.response.profileType
        this.selfieDetail.frontImageUrl=res.response.selfieImage
    }
    catch (error) {
        console.error(error);
        this.Loader = false;
        throw error; // Rethrow the error for handling in the calling code
      }
  }

  onClickOffeGenerated() {
      if (this.isOfferGenerated == true && this.leadData.leadId > 0 && (this.customerData?.leadGenerator ? true : false) && (this.customerData?.leadConvertor ? true : false)) {
          this.confirmationService.confirm({
              message: 'Are you sure that you want to Generate Offer?',
              accept: () => {
                  try {
                    const payload ={
                        LeadId : this.leadData.leadId,
                        CompanyIds : [0]
                    }
                      this.Loader = true;
                    //   this._leadService.InitiateLeadOffer(this.leadData.leadId).subscribe(res => {
                        this._leadService.InitiateLeadOffer(payload).subscribe(res => {
                          this.Loader = false;
                          if (res.status) {
                              this.messageService.add({ severity: 'success', summary: res.message, detail: '' });
                              this.isOfferGenerated = false;
                              setTimeout(() => {
                                  window.location.reload();
                              }, 1000);
                          }
                          else {
                              this.messageService.add({ severity: 'error', summary: res.message, detail: '' });
                          }
                      })
                  }
                  catch (error) {
                      // alert(error)
                      this.Loader = false;
                      this.messageService.add({ severity: 'error', summary: 'error in InitiateLeadOffer-' });

                  }
              }
          });
      } else {
          if (!(this.customerData?.leadGenerator ? true : false) && !(this.customerData?.leadConvertor ? true : false)) {
              this.messageService.add({ severity: 'error', summary: 'Please Enter Required Fields', detail: 'Lead Generator And Lead Convertor' });
          }
          else if (!(this.customerData?.leadGenerator ? true : false)) {
              this.messageService.add({ severity: 'error', summary: 'Please Enter Lead Generator', detail: '' });
          }
          else if (!(this.customerData?.leadConvertor ? true : false)) {
              this.messageService.add({ severity: 'error', summary: 'Please Enter Lead Convertor', detail: '' });
          }
      }
  }

  LeadReject(){
   debugger
    if(this.Message && this.Message!=''){
        this.Loader=true;
        this._dsaService.LeadReject(this.leadData.leadId,this.Message).subscribe((res:any)=>{
            console.log('LeadReject',res)
            this.Loader=false;
            if(res.isSuccess){
                this.messageService.add({ severity: 'success', summary: res.message });
                this.isLeadReject=false;
                this.Message = "";
                this.ngOnInit();
            }
            else{
                // this.Loader=false;
                this.messageService.add({ severity: 'error', summary: res.message });
                this.IsleadReject=false;

            }
        })
    }
    else{
        // this.Loader=false;
        this.messageService.add({ severity: 'error', summary: 'Add a reason !' });
    }
  }
  ApproveDSALeadRequest(){
    console.log(this.selectedProduct);
    if((this.customerData?.leadGenerator ? true : false) && (this.customerData?.leadConvertor ? true : false)){
    if(this.selectedProduct && this.selectedProduct.length > 0){
        let productIds:any=[]
        this.selectedProduct?this.selectedProduct.forEach((e:any)=>{
            productIds.push(e.id)
        }):null
    
        let payload={
            LeadId :this.leadData.leadId,
            UserId :this.leadData.userId,
            ProductIds :productIds,
            Comment:'' ,
            // PayoutPercentage:this.leadData.payoutPercentage
        }
            console.log('ApproveDSALead',payload)
            this.Loader=true;
            this._dsaService.ApproveDSALead(payload).subscribe((res:any)=>{
            this.Loader=false;
            console.log('ApproveDSALead',res)
            if(res.status){

                this.messageService.add({ severity: 'success', summary:res.message });
                this.isApprovelead=false;
                this.ngOnInit();
            }
            else{
                this.messageService.add({ severity: 'error', summary:res.message });
                this.isApprovelead=false;
    
            }
        },
        (error:any)=>{
            this.messageService.add({ severity: 'error', summary:'Error in api-ApproveDSALead' });
        }
        )
    }
    else{
        this.messageService.add({ severity: 'error', summary:'Select any one product!' });
    }}else{
        if (!(this.customerData?.leadGenerator ? true : false) && !(this.customerData?.leadConvertor ? true : false)) {
            this.messageService.add({ severity: 'error', summary: 'Please Enter Required Fields', detail: 'Lead Generator And Lead Convertor' });
        }
        else if (!(this.customerData?.leadGenerator ? true : false)) {
            this.messageService.add({ severity: 'error', summary: 'Please Enter Lead Generator', detail: '' });
        }
        else if (!(this.customerData?.leadConvertor ? true : false)) {
            this.messageService.add({ severity: 'error', summary: 'Please Enter Lead Convertor', detail: '' });
        }
    }
    
  }
  DeactivateActivate(isActive:boolean,isReject: boolean,isdeleteClicked:boolean){
        
        var confirmMsg = isdeleteClicked ? "Delete DSA" : isActive? "Activated":"Deactivate";
        this.confirmationService.confirm({
            message: `Are you sure that you want to ${confirmMsg} ?`,
            accept: () => {
                try {
                    this.Loader=true;
                    this._dsaService.DSADeactivate(this.leadData.leadId,isActive,isReject).subscribe((res:any)=>{
                    console.log('DSADeactivate',res)
                    this.Loader=false;
                        if(res.status){
                            this.messageService.add({ severity: 'success', summary: "Updated Successfully" });
                            this.leadData.isActive=isActive
                            if(isdeleteClicked){
                                this.router.navigateByUrl('pages/dsa/dsa-master');
                            }else{
                                this.ngOnInit();
                            }
                        }
                        else{
                            this.messageService.add({ severity: 'error', summary: res.message });
                        }
                    })
                }
                catch (error) {
                    this.Loader = false;
                    this.messageService.add({ severity: 'error', summary: 'error -' });
    
                }
            }
        });
    
  }

  reloadDeatilPage(event:any){
    //debugger
    this.ngOnInit();
  }
//   PrepareAggr(){
//     this.Loader=true;
//     this._dsaService.PrepareAgreement(this.leadData.leadId,this.leadData.userId,this.leadData.profileType).subscribe((res:any)=>{
//         console.log('PrepareAgg.',res)
//         this.Loader=false;
//         if(res.status){
//             this.messageService.add({ severity: 'success', summary:res.message });
//             this.ngOnInit();
//         }
//         else{
//             this.messageService.add({ severity: 'error', summary:res.message });
//         }
//     })
//   }


  async GetleadActivities(leadId: number, event?: any) {
      // this.leadActivitiesList = null;
      if (this.leadData.leadId > 0) {
          try {
              this.Loader = true;
              var res = await this._leadService.GetLeadActivityProgressList(leadId).toPromise();

              if (res.status) {
                   this.Loader = false;
                  var data = res.leadActivityProgress.filter((x: any) => {
                      if (x.activityName != "MobileOtp") return x
                  })

                  this.leadActivitiesList = data
                  console.log(this.leadActivitiesList, 'this.leadActivitiesList');

                  this.leadActivitiesList.forEach((x: any) => {
                      x.activity = x.subActivityName ? x.subActivityName : x.activityName
                  })
                  this.isjump = false;
                  this.istotalcount = 0;
                  this.isapproved = 0;
                  let i = 0;
                  this.leadActivitiesList.forEach((x: any) => {
                      x.index = i + 1;
                      i++;
                  })

                  this.leadActivitiesList.forEach((x: any) => {
                      if (x.activityName == "Inprogress") {
                          this.isjump = true
                          if (this.isapproved == this.istotalcount) {
                              this.isOfferGenerated = true
                          }
                      }
                      else {
                          if (this.isjump == false) {
                              this.istotalcount = this.istotalcount + 1;
                              if (x.isApproved == 1) {
                                  this.isapproved = this.isapproved + 1;
                              }
                          }
                      }
                  })

                  this.leadActivitiesList.forEach((element: any) => {
                      if (element.activityName == 'Rejected') {
                          this.IsleadReject = true;
                      }
                  })

                //   await this.GetOfferAccepted(this.leadData.leadId);
                  if (!event) {
                      this.Loader = false
                  }
              }
              else {
                  this.Loader = false;
                  // alert("Error API - GetLeadActivityProgressList")
                  this.messageService.add({ severity: 'error', summary: 'Data Not Found' });

                  // this.Loader = false;
              }
          }
          catch (error: any) {
              // alert(error)
              this.Loader = false;
              this.messageService.add({ severity: 'error', summary: 'Error API - GetLeadActivityProgressList', detail: error });
          }
      }


  }
  async GetOfferAccepted(leadId: number) {
      if (leadId > 0) {
          try {
               this.Loader = true;
              var res = await this._leadService.GetOfferAccepted(leadId).toPromise();
               this.Loader = false;
              if (res != null) {
                  if (res.isOfferAccepted) {
                      this.isOfferGenerated = false;
                  }
              } else {
              //    this.Loader = false;
                  // alert("Error API - GetOfferAccepted");
                  this.messageService.add({ severity: 'error', summary: 'Error API - GetOfferAccepted' });

              }
          }
          catch (error: any) {
              this.Loader = false;
          }
      }
  }
  async IsOfferGenerated(leadid: any) {
      if (leadid > 0) {
          // this.Loader = true
          var res = await this._leadService.IsOfferGenerated(leadid).toPromise();
          if (res && res.result == true) {
              // this.Loader = false;
              this.IsOfferGeneratedFlag = res.result;
          }
          else {
              // this.Loader = false;
              this.IsOfferGeneratedFlag = res.result;
          }
      }

  }
  refresh(){
      window.location.reload()
  }
  isLeadActivityHistory: boolean = false;
  LeadActivityHistoryData: any
  LeadActivityHistory() {
      this.Loader = true;
      this._leadService.LeadActivityHistory(this.leadData.leadId).subscribe((res: any) => {
          // console.log(res, 'historyData');
          this.Loader = false;
          if (res != null && res.length > 0) {
              this.isLeadActivityHistory = true;
              res.forEach((x: any) => {
                  x.changes = x.changes.replace(/\\n/g, '<br/>');
              })
              this.LeadActivityHistoryData = res;
          }
      }, (err: any) => {
          this.Loader = false;
          this.messageService.add({ severity: 'error', summary: 'ErrorAPI LeadActivityHistory', detail: '' });
      })
  }
  checkroleExistence(searchString: string): boolean {
      // debugger
      return this.userrole.includes(searchString);
  }
  isFirstLetterNotSpace(sentence: string) {
      // Check if the first character is not a space
      var res = this.commonValidation.isFirstLetterNotSpace(sentence);
      return /^\S/.test(sentence);
  }
  onkeypress(event: KeyboardEvent) {
      var res = this.commonValidation.onkeypress(event);
  }



  username: any = null;
  CommentBlock: boolean = false;
  isHideShow: any;
  isHideLimit: boolean = false;

}



interface BusinessDetail {
  businessName: string;
  BusinessType: string;
  BusinessTurnOver: number;
  IncorporationDate: string;
  IncomeSlab: number;
  GstNumber: number;
  CurrentAddress: Address;
  buisnessProofUrl: string;
}

interface BorrowerDetail {
  firstName: string;
  lastName: string;
  middleName: string;
  gender: string;
  dob: string;
}

interface PanDetail {
  fatherName: string;
  nameOnCard: string;
  uniqueId: string;
  frontImageUrl: string;
  doi: string;
  dob: string;
}

interface BankDetail {
  borroBankAccNum: string;
  borroBankIFSC: string;
  borroBankName: string;
  accType: string;
}
interface AadharDetail {
  maskedAadhaarNumber: string;
  frontImageUrl: string;
  gender: string;
  dob: string;
  backImageUrl: string;
  country: string;
  name: string;
  pinCode: string;
  fatherName: string;
  locationAddress: Address;
}

interface Address {
  addressLineOne: string;
  addressLineTwo: string;
  addressLineThree: string;
  cityName: string;
  countryName: string;
  stateName: string;
  zipCode: string;
}

interface PersonalDetail {
  CurrentAddress: Address;
  PermanentAddress: Address;
  ElectricityBillImage: string;
  MobileNumber: string;
}

interface SelfieDetail {
  frontImageUrl: string;
}

interface LoanAccount {
  LoanAccountId: number;
  IsAccountActive: boolean;
  IsBlock: boolean;
  IsBlockComment: string;
  IsBlockHideLimit: boolean;
}

interface LeadGeneratorConvertor {
  LeadId: number;
  LeadGenerator: string;
  LeadConvertor: string;
}

