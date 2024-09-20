import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from 'app/shared/services/loader.service';
import { TreeNode } from 'primeng/api';
import { LeadService } from '../../services/lead.service';

@Component({
  selector: 'app-activity-history',
  templateUrl: './activity-history.component.html',
  styleUrls: ['./activity-history.component.scss']
})
export class ActivityHistoryComponent implements OnInit{
    nodes!: TreeNode<any>[];

    constructor(private service:LeadService, private loader: LoaderService,private Router: Router){}

    ngOnInit(): void {
      this.GetleadActivities();
      this.nodes = [
        {
            key: '0',
            label: 'Introduction',
            children: [
                { key: '0-0', label: 'What is Angular', data: 'https://angular.io', type: 'url' },
                { key: '0-1', label: 'Getting Started', data: 'https://angular.io/guide/setup-local', type: 'url' },
                { key: '0-2', label: 'Learn and Explore', data: 'https://angular.io/guide/architecture', type: 'url' },
                { key: '0-3', label: 'Take a Look', data: 'https://angular.io/start', type: 'url' }
            ]
        },
        {
            key: '1',
            label: 'Components In-Depth',
            children: [
                { key: '1-0', label: 'Component Registration', data: 'https://angular.io/guide/component-interaction', type: 'url' },
                { key: '1-1', label: 'User Input', data: 'https://angular.io/guide/user-input', type: 'url' },
                { key: '1-2', label: 'Hooks', data: 'https://angular.io/guide/lifecycle-hooks', type: 'url' },
                { key: '1-3', label: 'Attribute Directives', data: 'https://angular.io/guide/attribute-directives', type: 'url' }
            ]
        }
    ];
    }
    leadActivitiesList=[]
    GetleadActivities(){
        this.loader.isLoading(true);
        this.service.GetLeadActivityProgressList(16).subscribe((res: any) => {
          debugger
          if(res.status){
            this.leadActivitiesList=res.leadActivityProgress;
            this.loader.isLoading(false);
            console.log('data',this.leadActivitiesList);
          }
        });
    }
   
  //   loadChildren(rowData: any,rowNode:any) {
  //     debugger
  //     if(rowNode==undefined || rowNode==false){   
  //       var KycMasterCode=0
  //       if(rowData.activityName=='KYC')  KycMasterCode=rowData.subActivityMasterId
  //       else KycMasterCode = rowData.activityMasterId
  //       this.service.GetLeadActivityDetails(rowData.leadUserId,KycMasterCode).subscribe(res=>{

  //         const NotnullKeys = Object.entries(res)
  //         .filter(([key, value]) => value != null)
  //         .map(([key]) => key);

  //           console.log(res.NotnullKeys); 


  //         if(res.status==false) alert(res.message)
  //         else{
  //           this.leadActivitiesList.forEach((rowEl:any)=>{
  //             if(rowEl.ExecutiveId==rowData.ExecutiveId){
  //               rowEl.children=res.NotnullKeys;
  //               rowEl.expanded = true;
  //             }
  //             else{ rowEl.expanded = false}         
  //           })
  //           console.log(this.leadActivitiesList); 
  //         }
  //       })
  //     }
  //     else{
  //       this.leadActivitiesList.forEach((rowEl:any)=>{
  //           rowEl.expanded = false; 
  //       })
  //     }
  // }

}
