import { Component, OnInit } from '@angular/core';
import { Input , Output, EventEmitter} from '@angular/core';
import { LeadService } from '../../services/lead.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit {
    @Input() isComplete : any;
    @Input() activityMasterId : any;
    @Input() subActivityMasterId : any;
    @Input() isApproved : any=0;
    @Input() isRejected: boolean=false;
    @Input() isRejectDoc: boolean=false;
    @Output() onApprovePersonalInfo: EventEmitter<any> = new EventEmitter<any>();
    @Output() onRejectPersonalInfo: EventEmitter<any> = new EventEmitter<any>();
    personalDataDc:any;
    personalData:any
    Comment:any;
    leadId:any;
    isVerified: boolean = this.isApproved == true ? true : false;
    constructor(private _leadservice:LeadService,
        private activatedRoute:ActivatedRoute, private messageService: MessageService){

    }
    ngOnInit(): void {
        this.activatedRoute.queryParamMap.subscribe(params => {
            this.personalData=params.get('PersonalDetail');
        });
        this.personalDataDc=JSON.parse(this.personalData)
        this.leadId = this.activatedRoute.snapshot.paramMap.get('leadId');
  
        this.isVerified = this.isApproved == 1 ? true : false;
        this.isRejected = this.isApproved == 2 ? true : false;

        if(this.personalDataDc?.electricityState && parseInt(this.personalDataDc?.electricityState,10) > 0){
            this.GetKarzaElectricityStateById(parseInt(this.personalDataDc?.electricityState,10))
        }
    }
    onReject(){
        
        // this.Comment=this.Comment.trim()
        if(this.Comment != null  && this.Comment != ''){
            this.Comment = this.Comment.trim()
        }
        if(this.Comment != null && this.isFirstLetterNotSpace(this.Comment)){

            let payload = {
                "LeadId": this.leadId,
                "ActivityMasterId": this.activityMasterId,
                "SubActivityMasterId": this.subActivityMasterId,
                "IsApprove": 2,
                "Comment": this.Comment
            }
            this.onRejectPersonalInfo.emit(payload)
        }
        else{
            this.messageService.add({ severity: 'error', summary: 'Please Fill Message', detail: '' });
        }
    }
    onRejectDoc(){
        this.isRejectDoc = true;
    }
    onApproved(){
       
        var IsApprove = false;
        
        if(this.personalDataDc?.firstName != null && this.personalDataDc?.lastName != null && this.personalDataDc?.gender != null && this.personalDataDc?.alternatePhoneNo != null && this.personalDataDc?.emailId != null && this.personalDataDc?.marital != null && this.personalDataDc?.permanentAddress?.addressLineOne != null && this.personalDataDc?.permanentAddress?.cityName != null && this.personalDataDc?.permanentAddress?.stateName != null && this.personalDataDc?.currentAddress?.addressLineOne != null && this.personalDataDc?.currentAddress?.cityName != null && this.personalDataDc?.currentAddress?.stateName != null && this.personalDataDc?.currentAddress?.zipCode != null && this.personalDataDc?.ownershipType != null && ((this.personalDataDc?.ownershipTypeProof =='Electricity Manual Bill Upload' && this.personalDataDc?.manualElectricityBillImage != null) || (this.personalDataDc?.ownershipTypeProof =='Digital Bill Verification' || this.personalDataDc?.manualElectricityBillImage != null))){
            IsApprove = true;
        }
        else{
            IsApprove = false;
            this.messageService.add({ severity: 'error', summary: 'Please Fill Required fields', detail: '' });
        }

        if(IsApprove == true){

            let payload = {
                "LeadId": this.leadId,
                "ActivityMasterId": this.activityMasterId,
                "SubActivityMasterId": this.subActivityMasterId,
                "IsApprove": 1,
                "Comment": 'Approve'
            }
    
            this.onApprovePersonalInfo.emit(payload);
        }
    }

        
    GetKarzaElectricityStateById(electricityStateId:number){
        this._leadservice.GetKarzaElectricityStateById(electricityStateId).subscribe((res:any)=>{
            console.log(res,'GetKarzaElectricityStateById Data');
            if(res != null && res.length > 0){
                this.personalDataDc.electricityState = res[0].state;
            }         
        },(error:any)=>{
            console.log(error);
            
        })
    }
    OpenPdf(pdfurl:any){
        window.open(pdfurl);
    }
    
    isFirstLetterNotSpace(sentence:string) {
        // Check if the first character is not a space
        return /^\S/.test(sentence);
    }
    cancel(){
        this.Comment=null;
    }
}
