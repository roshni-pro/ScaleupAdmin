import { Component, OnInit ,Input,Output,EventEmitter} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-emandate',
  templateUrl: './emandate.component.html',
  styleUrls: ['./emandate.component.scss']
})
export class EmandateComponent implements OnInit {
    @Input() isComplete : any;
    @Input() activityMasterId : any;
    @Input() subActivityMasterId : any;
    @Input() isApproved : any=0;
    @Input() isRejected: boolean=false;
    @Input() isRejectDoc: boolean=false;
    @Output() onApproveEmandateInfo: EventEmitter<any> = new EventEmitter<any>();
    @Output() onRejectEmandateInfo: EventEmitter<any> = new EventEmitter<any>();
    bankStatementDetail:any
    leadData:any;
    Comment:any;
    isVerified:boolean=false;
    leadId:any;
    constructor( private activatedroute:ActivatedRoute){

    }
    ngOnInit(): void {
        this.activatedroute.queryParamMap.subscribe(params => {
            this.bankStatementDetail = params.get('BankStatementDetail');
        });
        this.bankStatementDetail = JSON.parse(this.bankStatementDetail)

        this.isVerified = this.isApproved == 1 ? true : false;
        this.isRejected = this.isApproved == 2 ? true : false;
        this.leadId = this.activatedroute.snapshot.paramMap.get('leadId');

    }

    onApproved(){
        let payload = {
            "LeadId": this.leadId,
            "ActivityMasterId": this.activityMasterId?this.activityMasterId:0,
            "SubActivityMasterId": this.subActivityMasterId?this.subActivityMasterId:0,
            "IsApprove": 1,
            "Comment": 'Approve'
        }

        this.onApproveEmandateInfo.emit(payload);
      }
      onRejectDoc(){
        this.isRejectDoc = true;
      }
      onReject(){
        let payload = {
            "LeadId": this.leadId,
            "ActivityMasterId": this.activityMasterId?this.activityMasterId:0,
            "SubActivityMasterId": this.subActivityMasterId?this.subActivityMasterId:0,
            "IsApprove": 2,
            "Comment": this.Comment
        }
        this.onRejectEmandateInfo.emit(payload)
      }
}
