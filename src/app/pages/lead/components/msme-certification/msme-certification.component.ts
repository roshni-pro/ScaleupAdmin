import { Component, OnInit } from '@angular/core';
import { Input , Output, EventEmitter} from '@angular/core'; 
import { LeadService } from '../../services/lead.service';
import { environment } from 'environments/environment';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-msme-certification',
  templateUrl: './msme-certification.component.html',
  styleUrls: ['./msme-certification.component.scss']
})
export class MsmeCertificationComponent implements OnInit {
    msmeData : any;
    @Input() isComplete : any;
    leadId : any;
    @Input() activityMasterId : any;
    @Input() subActivityMasterId : any;
    @Input() isApproved : any=0;
    @Input() isRejected: boolean=false;
    @Input() isRejectDoc: boolean=false;
    @Output() onApproveMsmeInfo: EventEmitter<any> = new EventEmitter<any>();
    @Output() onRejectMsmeInfo: EventEmitter<any> = new EventEmitter<any>();
    isVerified: boolean = this.isApproved == true ? true : false;
    Comment:any;
    leadData:any
    
    constructor(private _leadservice:LeadService,
        private activatedroute:ActivatedRoute, private messageService: MessageService){
    }
    ngOnInit(): void {
        this.activatedroute.queryParamMap.subscribe(params => {
            this.msmeData=params.get('MsmeDetail');
            this.leadData=params.get('LeadInfo');
        });
        this.msmeData=JSON.parse(this.msmeData)
        this.leadData=JSON.parse(this.leadData)
        console.log('this.MsmeDetail',this.msmeData)

        this.leadId = this.activatedroute.snapshot.paramMap.get('leadId');

    this.isVerified = this.isApproved == 1 ? true : false;
    this.isRejected = this.isApproved == 2 ? true : false;
    }

    OpenPdf(){
        window.open(this.msmeData.msmeCertificateUrl);
    }
    onApproved(){
        var IsApprove = false;

        if(this.msmeData?.msmeRegNum != null && this.msmeData?.businessName != null && this.msmeData?.msmeCertificateUrl != null){
            IsApprove = true;
        }
        else{
            IsApprove = false;
            this.messageService.add({ severity: 'error', summary: 'Please fill Required fields', detail: '' });
        }

        if(IsApprove == true){

            let payload = {
                "LeadId": this.leadId,
                "ActivityMasterId": this.activityMasterId,
                "SubActivityMasterId": this.subActivityMasterId,
                "IsApprove": 1,
                "Comment": 'Approve'
            }
    
            this.onApproveMsmeInfo.emit(payload);
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
            this.onRejectMsmeInfo.emit(payload)
        }else{
            this.messageService.add({ severity: 'error', summary: 'Please fill Message', detail: '' });
        }
    }
    
    onRejectDoc(){
        this.isRejectDoc = true;
    }

    isFirstLetterNotSpace(sentence:string) {
        // Check if the first character is not a space
        return /^\S/.test(sentence);
    }
    cancel(){
        this.Comment=null;
    }
}
