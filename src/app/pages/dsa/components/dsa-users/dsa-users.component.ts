import { Component } from '@angular/core';
import { DsaService } from '../../services/dsa.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-dsa-users',
  templateUrl: './dsa-users.component.html',
  styleUrls: ['./dsa-users.component.scss']
})
export class DsaUsersComponent {
  leadData:any
  dsaLeadData:any
  first:number=0
  skip:number=0
  take:number=10
  totalcount:number=10
  Loader:boolean=false;
  constructor(private _dsaService:DsaService ,
    private messageService:MessageService 
  ){

  }
  async ngOnInit() {
    this.leadData = localStorage.getItem('DsaleadData');
    this.leadData = JSON.parse(this.leadData);
    // this.getUserList(null);
  }

  getUserList(event: any){
    this.dsaLeadData=[]
    this.Loader=true;
    this.first = 0;
    var Last = event ? event.first + event.rows : 10;
    this.skip=event?event.first:0;
    this.take= event?event.rows:10;
    this._dsaService.GetDSAUsersList(this.leadData.userId,this.skip,this.take).subscribe((res:any)=>{
      this.Loader=false;
      if(res.isSuccess){
        this.dsaLeadData=res.result
        this.totalcount=res.result[0].totalRecords
      }
      else{
        this.messageService.add({ severity: 'error', summary:res.message });
      }
      console.log('GetDSAUsersList',res)
    })
  }
  
  editDsaUser(leadData:any){
    
    let payload={
      userId:leadData.userId,
      status:leadData.status
    }
    this.Loader=true;
    this._dsaService.DSAUserStatusChange(payload).subscribe((res:any)=>{
      this.Loader=false;
      console.log('DSAUserStatusChange',res)
      if(res.isSuccess){
        this.messageService.add({ severity: 'success', summary:res.message });
        this.getUserList(null)
      }
      else{
        this.messageService.add({ severity: 'error', summary:res.message });
        this.getUserList(null)

      }
    })
  }
  SaveDSAPayoutPercentage(leadData:any){
    let payload={
      userId:leadData.userId,
      payoutPercentage:leadData.payoutPercenatge
    }
    console.log(payload);
    
    this.Loader=true;
    this._dsaService.SaveDSAPayoutPercentage(payload).subscribe((res:any)=>{
      this.Loader=false;
      console.log('SaveDSAPayoutPercentage',res)
      if(res.isSuccess){
        this.messageService.add({ severity: 'success', summary:res.message });
        this.getUserList(null)
      }
      else{
        this.messageService.add({ severity: 'error', summary:res.message });
        this.getUserList(null)


      }
    })
  }
}
