import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LeadService } from '../../services/lead.service';

@Component({
  selector: 'app-profile-offer-detail',
  templateUrl: './profile-offer-detail.component.html',
  styleUrls: ['./profile-offer-detail.component.scss'],
    // providers: [ConfirmationService] 
})
export class ProfileOfferDetailComponent implements OnInit {
  @Input() leadData: any;
  @Input() leadActivitiesList: any;
  @Input() IsleadReject: boolean = false;

  generateOfferStatusData: any;  //responseData
  requestResponseMessage: any;
  CreditBureauDetails: any;
  typecheck: any;
  Loader: boolean = false;
  showRequest: boolean = false;
  MessageForReject: any;
  IsReject: boolean = false;
  LeadOfferData: any
  showOfferDetails: any
  DisbursalProposalData: any;
  
  isCibilUpload:boolean=false;
  cibilScore:number=0

  data: any;
  options: any
  isPrepareAgreement:boolean = false;
  userId:any;
  leadId:any;
  constructor(private _leadService: LeadService, private confirmationService: ConfirmationService, private messageService: MessageService,
    private activateRoute: ActivatedRoute,
  ) {
  }
  async ngOnInit() {
    debugger
    // console.log(this.leadData)
    this.userId = this.activateRoute.snapshot.paramMap.get('userId');
    this.leadId = this.activateRoute.snapshot.paramMap.get('leadId');
    console.log(this.leadActivitiesList)
    this.showOfferDetails = this.leadActivitiesList.filter(
      (Activities: any) => Activities.activityName === "Show Offer" || Activities.activityName === "Arthmate Show Offer");
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    var leadActivity = this.leadActivitiesList.filter((x:any)=> x.activity == "PrepareAgreement");
    if(leadActivity.length > 0 && leadActivity != null){
        this.isPrepareAgreement = true;
    }
    
    
    this.data = {
      labels: ['Excellent', 'Poor'],
      datasets: [
        {
          data: [100, 900], // Replace with your CIBIL score data
          backgroundColor: [
            'green',
            'red'
            // '#FF6384',
            // '#FFCE56',
          ]
        }
      ]
    };
    this.options = {
      cutout: '60%',
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
    console.log(this.showOfferDetails)
    await this.GetOfferAccepted(this.leadId);
    await this.GetGenerateOfferStatus(this.leadId);
    await this.GetLeadOffer(this.leadId);
    this.GetGenerateAgreementStatus(this.leadId);
    this.GetDisbursement(this.leadId);
    if (this.showOfferDetails[0].isCompleted == true) {
      await this.GetDisbursementProposal(this.leadId)
    } else {

    }
    this.GetLeadCommonDetail();
  }

  async GetLeadOffer(leadid: any) {
    try {
      this.Loader = true
      var response = await this._leadService.GetLeadOffer(leadid).toPromise();
      this.Loader = false
      if (response != null) {
        this.LeadOfferData = response;
        console.log('LeadOfferData', this.LeadOfferData)
      }
      else{
        this.Loader = false
        this.messageService.add({ severity: 'error', summary: 'Error API - GetLeadOffer' });
      }
    } catch (error: any) {
      this.Loader = false;
      this.messageService.add({ severity: 'error', summary: 'Error API - GetLeadOffer' });

      // alert(error.message);
    }
  }

  async GetGenerateOfferStatus(leadId: any) {
    this.Loader = true
    try {
      var resp = await this._leadService.GetGenerateOfferStatusNew(leadId, "CreditLine").toPromise();
      console.log(resp);

      if (resp && resp.length > 0) {
        resp.forEach((element: any) => {
          element.subactivityList.forEach((element1: any) => {
            element1.apiList.forEach((element2: any) => {
              element2.expanded = false;
            });
          });
        });
        this.generateOfferStatusData = resp;
        console.log('generateOfferStatusData', this.generateOfferStatusData)

        this.Loader = false
      }
      else {
        this.Loader = false
        this.messageService.add({ severity: 'warn', summary: 'No Offer Found' });

      }
    }
    catch (error) {
      //   alert(error)
      this.messageService.add({ severity: 'error', summary: 'Error API - GetGenerateOfferStatusNew' });
      this.Loader = false;
    }
  }

  isOfferAccepted: boolean = false
  async GetOfferAccepted(leadId: number) {
    this.Loader = true;
    var res = await this._leadService.GetOfferAccepted(leadId).toPromise();
    if (res != null) {
      this.Loader = false;
      console.log(res, 'GetOfferAccepted');
      if (res.isOfferAccepted) {
        this.isOfferAccepted = true;
      }
    } else {
      this.Loader = false;
      // alert("Error API - GetOfferAccepted");
      this.messageService.add({ severity: 'error', summary: 'Error API - GetOfferAccepted' });

    }
  }
  show(reqRes: any) {
    this.requestResponseMessage = null
    console.log(reqRes);
    if (reqRes != null && reqRes != '') {
      this.showRequest = true
      var res = this.isStringContainingArray(reqRes)
      this.requestResponseMessage = res ? JSON.parse(reqRes) : reqRes;
      this.typecheck = typeof this.requestResponseMessage;
    }
  }

 Retry(responseData: any, row : any) {
    console.log(responseData,row, 'responseData for retry');
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Retry?',
      accept: () => {
        try {
          this.Loader = true;
          this._leadService.ThirdPartyCreateLeadRetry(row.leadId, row.nbfcCompanyId).subscribe((res: any) => {
            this.Loader = false;
            if(res.status){
                this.messageService.add({ severity: 'success', summary: res.message, detail: '',life: 1000});
                            setTimeout(() => {
                                // window.location.reload();
                                this.GetGenerateOfferStatus(this.leadId);
                            }, 1000);
            }
            else{
                this.messageService.add({ severity: 'error', summary: res.message ,life: 1000});
                setTimeout(() => {
                    // window.location.reload();
                    this.GetGenerateOfferStatus(this.leadId);
                }, 1000);
            }
            // this.GetGenerateOfferStatus(this.leadId);
          })
        } catch (error: any) {
          this.Loader = false;
          // alert(error.message);
          this.messageService.add({ severity: 'error', summary: error.message });

        }
      },
      reject: () => {
      },
    });
  }

  isStringContainingArray(str: any) {
    var res = str.startsWith('[') && str.endsWith(']');
    var res2 = str.startsWith('{') && str.endsWith('}');
    return res || res2 ? true : false
  }

  // GetBureau() {
  //   try {
  //     this.Loader = true
  //     var response = this._leadService.GetBureau().toPromise();
  //     this.Loader = false
  //     if (response != null) {
  //       this.CreditBureauDetails = response;
  //       console.log('CreditBureauDetails', this.CreditBureauDetails)
  //     }
  //   } catch (error: any) {
  //     this.Loader = false;
  //     // alert(error.message);
  //   }
  // }

  OnReject() {
    this.IsReject = true;
  }

  Reject() {
    // this.MessageForReject=this.MessageForReject.trim()
    if (this.MessageForReject != null && this.MessageForReject != '') {
      this.MessageForReject = this.MessageForReject.trim()
    }
    if (this.MessageForReject != null && this.isFirstLetterNotSpace(this.MessageForReject)) {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to Reject?',
        accept: () => {
          this.Loader = true;
          this._leadService.LeadReject(this.leadId, this.MessageForReject).subscribe((res: any) => {
            console.log(res);
            this.Loader = false;
            this.IsReject = false;
            if (res.isSuccess) {
              this.messageService.add({ severity: 'success', summary: res.message, detail: '', life: 1000 });
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
            else {
              this.messageService.add({ severity: 'error', summary: res.message, detail: '', life: 1000 });
            }
          },
            (err: any) => {
              this.Loader = false;
              this.IsReject = false;
              // alert(err.message)
              this.messageService.add({ severity: 'error', summary: err.message });
            })

        },
        reject: () => {
        },
      });
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Please fill Message', detail: '', life: 1000 });
    }
  }
  isFirstLetterNotSpace(sentence: string) {
    // Check if the first character is not a space
    return /^\S/.test(sentence);
  }
  cancel() {
    this.cibilScore = 0
    this.MessageForReject = null;
    this.myInputVariable2.nativeElement.value = null;
    this.onUploadFileUrl =''
  }
  UpdateOffer(leadid: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to update?',
      accept: () => {
        const payload ={
            LeadOfferId:leadid,
            interestRate:0,
            newOfferAmout:0
        }
        this.Loader = true
        this._leadService.UpdateLeadOffer(payload).subscribe((result: any) => {
          if (result.status) {
            this.Loader = false
            this.messageService.add({ severity: 'success', summary: 'offer updated', detail: '', life: 1000 });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
          else{
            this.Loader = false
            this.messageService.add({ severity: 'error', summary: 'something went wrong', detail: '' });
          }
        },
          (err: any) => {
            this.Loader = false
            // alert(err.message);
            this.messageService.add({ severity: 'error', summary: err.message });

            console.log(err)
          });
      },
      reject: () => {
      },
    });
  }


  //loan disbursemnt 
  async GetDisbursementProposal(leadId: number) {
    // debugger

    this.Loader = true
    try {
      var resp = await this._leadService.GetDisbursementProposal(leadId).toPromise();
      console.log(resp);

      if (resp.status) {
        this.DisbursalProposalData = resp.response;
        this.Loader = false
      }
      else {
        this.Loader = false
        this.messageService.add({ severity: 'error', summary: resp.message, detail: '' });
      }
    }
    catch (error) {
      //   alert(error)
      this.Loader = false;
    }
  }
  onClickApproved() {
    this.Loader = true;
    let payload = {
      leadId: this.leadId,
      Webhookresposne: ''
    }
    this._leadService.PostDisbursement(payload).subscribe((res: any) => {
      this.Loader = false;
      if (res.status) {
        this.messageService.add({ severity: 'success', summary: res.message, detail: '' });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
      else {
        this.messageService.add({ severity: 'error', summary: res.message, detail: '' });
      }
    }, (error: any) => {
      this.Loader = false;
      this.messageService.add({ severity: 'error', summary:'Error API - PostDisbursement' , detail: '' });

    })
  }

 agreementResponseData:any
 GetGenerateAgreementStatus(leadId: any) {
    this.Loader = true
    this._leadService.GetGenerateAgreementStatus(leadId).subscribe((resp:any)=>{    
        if (resp && resp.length > 0) {
            this.agreementResponseData = resp;
            console.log(this.agreementResponseData,'this.agreementResponseData');
            
            this.Loader = false            
        }
        else {
            this.Loader = false
        }
    })
}

agreementRetry(responseData: any) {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to Retry?',
        accept: () => {
                this.Loader = true
                this._leadService.ThirdPartyAgreementLeadRetry(responseData.leadId, responseData.nbfcCompanyId).subscribe((res: any) => {
                    this.Loader = false;
                    this.GetGenerateAgreementStatus(this.leadId);
                },(error:any)=>{
                    this.Loader = false;
                })
        },
        reject: () => {
        },
    });
}

DisbursedData:any;
GetDisbursement(leadId: number) {
    this.Loader = true;
    this._leadService.GetDisbursement(leadId).subscribe((res: any) => {
        this.Loader = false;
        console.log(res, 'res');
        if (res != null) {
            this.DisbursedData = res.response;
        }
    }, (error: any) => { this.Loader = false });
}
customerData:any;
async GetLeadCommonDetail() {
    if (this.leadId > 0) {
        this.Loader = true;
        var res = await this._leadService.GetLeadCommonDetail(this.leadId).toPromise();
        this.Loader = false;
        if (res != null) {
            this.customerData = res;
            console.log(this.customerData,'customerData');          
        }
    }
}

showImages(input: string) {
    this.showImage = true;
    this.dialogUrl = '';
    if (input.toLowerCase().includes('jpeg') || input.toLowerCase().includes('png') || input.toLowerCase().includes('jpg')) {
        this.showUrl = input;
    }
    else {
        this.dialogUrl = '../../../../../assets/img/pdflogo.png'
        this.showUrl = input
    }
}
showImage:boolean = false;
showUrl: any
dialogUrl: any
downloadImage(value: any) {
    window.open(value);
}
OnOpenCibilPopup(){
    this.isCibilUpload = true;
    this.cibilScore = this.customerData.creditScore;
}
cibilUpdate(){
    var flag = true;
    if(this.cibilScore>900){
        flag = false;
        this.messageService.add({ severity: 'error', summary: 'Cibil Score Would Be less than Or Equal 900', detail: '' });
    }
    else if(!(this.cibilScore > 0)){
        flag = false;
        this.messageService.add({ severity: 'error', summary: 'Please Enter Cibil Score', detail: '' });
    }else if(!this.onUploadFileUrl){
        flag = false;
        this.messageService.add({ severity: 'error', summary: 'Please Upload Cibil Document', detail: '' });
    } 

    if(flag){
        const payload = {
            LeadId: this.leadId,
            ProductCode: "CreditLine",
            CibilScore: this.cibilScore,
            CibilReport: this.onUploadFileUrl
        }
        this.Loader = true;
        this._leadService.UpdateCibilDetails(payload).subscribe((res:any) =>{
            console.log(res);  
            this.Loader = false;   
            if(res.isSuccess){
                this.messageService.add({ severity: 'success', summary: res.message, detail: '' });
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
            else{
                this.messageService.add({ severity: 'error', summary: res.message, detail: '' });
            }
        })
    }else{

    }
}
@ViewChild('myInput2')
myInputVariable2!: ElementRef;
documentUpload(file: any, imgUploadType: string, event?: any) {
    if (file && file.target.files.length > 0) {
        let checkFlag = 1;
        let tempFiles: File[] = file.target.files;
        // debugger
        for (var element of tempFiles) {
            if (
                element.name.toLowerCase().includes('jpeg') ||
                element.name.toLowerCase().includes('png') ||
                element.name.toLowerCase().includes('jpg') ||
                element.name.toLowerCase().includes('pdf')
            ) {
                if (element.size < 6000000) {
                } else {
                    checkFlag = 0;
                    this.messageService.add({ severity: 'error', summary: 'Image Size is more than 6MB', detail: '' });
                }
            } else {
                // alert('Choose different file format!');
                checkFlag = 0;
                this.messageService.add({ severity: 'error', summary: 'Choose different file format!', detail: '' });
                // event.nativeElement.value = '';
                file.preventDefault();
            }
        };

        if (checkFlag == 1) {
            this.file = file.target.files;
            var reader = new FileReader();
            this.uploadDocumentFile(imgUploadType);
        } else if(checkFlag == 0){
            // alert('Select Image size less than 6MB!!!');
            this.messageService.add({ severity: 'error', summary: 'Select Image size less than 6MB!!!', detail: '' });
            event.nativeElement.value = '';
        }
    } else {
        this.onUploadFileUrl = '';
        this.onUploadDocId = 0;
    }
}
file: any;
onUploadDocId:any;
onUploadFileUrl:any;
uploadDocumentFile(imgUploadType: any) {
    const formData = new FormData();
    formData.append('FileDetails', this.file[0]);
    formData.append('IsValidForLifeTime', 'true');
    formData.append('ValidityInDays', '');
    formData.append('SubFolderName', '');
    this.onUploadFileUrl = '';
    this.Loader = true;
    this._leadService.postSingleFile(formData).subscribe((res: any) => {
        console.log('Uploaded File-', res);
        this.Loader = false;
        if (res.status) {
            this.messageService.add({ severity: 'success', summary: ' Please Click On Update Button', detail: '' });
            this.onUploadFileUrl = res.filePath;
            this.onUploadDocId = res.docId;
        }
        else {
            this.messageService.add({ severity: 'error', summary: res.message, detail: '' });
        }
    }, (error: any) => {
        this.Loader = false;
        this.messageService.add({ severity: 'error', summary: error.message, detail: '' });
    });
}
}
