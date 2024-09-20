
import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent {

  constructor(private router: Router,
    private stateService: StateService, private confirmationService: ConfirmationService,
    private ngZone: NgZone, private messageService: MessageService) { }
  stateList: any;
  IsActive: boolean = false;
  Loader: boolean = false;


  ngOnInit(): void {
    this.Loader=true;    
    this.stateService.getStateList().subscribe((getData:any) => {
      this.Loader=false;
      this.stateList=[];
      this.stateList = getData.returnObject;
      //console.log('stateList', this.stateList);
    })
  }
  onClickAddBtn() {
    this.router.navigateByUrl('pages/admin/state/addstate')
  }
  onClickEdit(state:any) {
    this.router.navigateByUrl('pages/admin/state/addstate/' + state.id);
  }
  // onClickDelete(state:any) {
  //   this.confirmationService.confirm({
  //     message: 'Are you sure want to delete confirmation?',
  //     accept: () => {
  //       this.stateService.deleteState(state.Id).subscribe(getData => {
  //         if (getData == true) {
  //           setTimeout(() => {
  //             this.ngZone.run(() => {
  //               this.messageService.add({
  //                 severity: "success",
  //                 summary: 'Data Deleted Successfully',
  //                 detail: "",
  //                 life: 3000
  //               });
  //             });
  //           }, 1000);
  //           alert('Data Deleted Successfully');
  //           this.ngOnInit();
  //         }
  //       })
  //     }
  //   })
  // }

  stateId:any;
  ActiveInactive(product:any, IsActive:any,productDetail:any) {
    this.stateId = product;
    if (IsActive == true) {
      var activeData = 'Active';
    } else {
      activeData = 'InActive'
    }
    this.confirmationService.confirm({
      message: 'Are you sure want to' + ' ' + activeData + ' ' + 'this confirmation?',
      accept: () => {
        this.Loader=true;
        this.stateService.activeInactiveStatus(this.stateId, IsActive).subscribe(x => {
          this.Loader=false;
          if (x.status) {
            if(IsActive == false){
              // alert('State InActivated Successfully.'); //  alert(x.Msg);
              this.messageService.add({ severity: 'success', summary:'State InActivated Successfully.' });
              
            }else{
              // alert('State Activated Successfully.');
              this.messageService.add({ severity: 'success', summary:'State Activated Successfully.' });
            }  
            this.ngOnInit();
            this.ngOnInit();
          } else {
            // alert(x.Msg);
            this.messageService.add({ severity: 'error', summary: x.Msg});

            this.ngOnInit();
          }
        });        
      },
      reject: () => {
        this.IsActive = !IsActive;
        productDetail.isActive = this.IsActive;
      }
    })
  }
}







