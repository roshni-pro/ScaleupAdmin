import { Component, OnInit } from '@angular/core';
import { Input , Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-selfie',
  templateUrl: './selfie.component.html',
  styleUrls: ['./selfie.component.scss']
})
export class SelfieComponent implements OnInit{

     selfieData : any;
     leadId : any;
    @Input() IsOfferGeneratedFlag: any;
    @Input() activityMasterId : any;
    @Input() subActivityMasterId : any;
    @Input() isApproved : any=0;
    @Input() isComplete : any;
    @Input() isRejected: boolean=false;
    @Input() isRejectDoc: boolean=false;
    @Output() onApproveSelfieInfo: EventEmitter<any> = new EventEmitter<any>();
    @Output() onRejectSelfieInfo: EventEmitter<any> = new EventEmitter<any>();
    isVerified: boolean = this.isApproved == true ? true : false;
    selfieDataDc:any;
    Img:any;
    Comment:any;
    showUrl:any;
    showImage:boolean=false;
constructor( private activatedroute:ActivatedRoute,private messageService: MessageService){}
    ngOnInit(): void {
        this.activatedroute.queryParamMap.subscribe(params => {
            this.selfieDataDc=params.get('SelfieDetail');
        });
        this.selfieDataDc=JSON.parse(this.selfieDataDc)
        this.leadId = this.activatedroute.snapshot.paramMap.get('leadId');

        this.isVerified = this.isApproved == 1 ? true : false;
        this.isRejected = this.isApproved == 2 ? true : false;

    }
    onReject(){
        // this.Comment=this.Comment.trim()
        if(this.Comment != null && this.Comment != ''){
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
            this.onRejectSelfieInfo.emit(payload)
        }
        else{
            this.messageService.add({ severity: 'error', summary: 'Please fill Message', detail: '' });
        }
    }
    onApproved(){  

        var IsApprove =false;

        if(this.selfieDataDc?.frontImageUrl != null){
            IsApprove = true;
        }
        else{
            IsApprove = false;
            this.messageService.add({ severity: 'error', summary: 'Please upload selfie', detail: '' });
        }
        
        if(IsApprove == true){
            let payload = {
                "LeadId": this.leadId,
                "ActivityMasterId": this.activityMasterId,
                "SubActivityMasterId": this.subActivityMasterId,
                "IsApprove": 1,
                "Comment": 'Approve'
            }
    
            this.onApproveSelfieInfo.emit(payload);
        }
    }
    onRejectDoc(){
        this.isRejectDoc = true;
    }
    show(input:string){
      this.showImage=true;
      this.showUrl=input;
    }
    download(value:any){
      window.open(value);
    }

    isFirstLetterNotSpace(sentence:string) {
        // Check if the first character is not a space
        return /^\S/.test(sentence);
    }
    cancel(){
        this.Comment=null;
    }
}
