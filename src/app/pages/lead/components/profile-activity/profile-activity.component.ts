import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeadService } from '../../services/lead.service';
// import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-activity',
  templateUrl: './profile-activity.component.html',
  styleUrls: ['./profile-activity.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ProfileActivityComponent implements OnInit, AfterViewInit, AfterViewChecked {

  leadId: any = '';

  activityPayload = {
    LeadId: 0,
    EventName: '',
    Skip: 0,
    Take: 10
  }

  activities: any[] = [];
  mediaPath: string = '';
  showDocsPopup: boolean = false;
  // this.content = this.sanitizer.bypassSecurityTrustHtml("some <a onClick='Window.AppComponent.aMethod()'>link</a> here");


  constructor(private activateRoute: ActivatedRoute,
    private _leadService: LeadService,
    private elementRef: ElementRef,
    public Window: Window,
    private cd: ChangeDetectorRef
    // private sanitizer: DomSanitizer
  ) {
    // debugger
    (Window as any)["ProfileActivityComponent"] = this;
  }



  loadMore() {
    this.activityPayload.Skip = 0;
    this.activityPayload.Take = this.activityPayload.Take + 10;
    this.getLeadUpdateHistorie();
  }

  ngAfterViewChecked(): void {
    // if(this.elementRef.nativeElement.querySelector('.m-dcs')){
    //   this.elementRef.nativeElement.querySelector('.m-dcs').addEventListener('click', this.ShowDocs.bind(this));
    // }
  }

  ngAfterViewInit(): void {
  }


  ngOnInit() {
    this.leadId = this.activateRoute.snapshot.paramMap.get('leadId');
    this.activityPayload.LeadId = parseInt(this.leadId);
    this.getLeadUpdateHistorie();
  }

  ngDestroy() {
    delete (Window as any)["ProfileActivityComponent"];
  }

  clubedRecords: any[] = [];
  totalRecords = 0;
  isLoadMore: boolean = true;
  getLeadUpdateHistorie() {
    if (this.activityPayload.LeadId) {
      this._leadService.GetLeadUpdateHistorie(this.activityPayload).subscribe((res: any) => {
        console.log(res);
        if (res) {
          // debugger
          if (this.totalRecords != res.length) {
            this.isLoadMore = true;
            this.totalRecords = res.length;
            this.activities = res;
            this.clubedRecords = this.groupRecordsByDate(this.activities);
            if (this.clubedRecords.length > 0) {
              this.clubedRecords.forEach((element: any) => {
                element.isExpanded = false;
              });
            }
            console.log(this.clubedRecords);
            (Window as any)["ProfileActivityComponent"] = this;
          } else {
            this.isLoadMore = false;
          }
          // this.activities.forEach((element: any) => {
          //   element.narrationHTML = this.sanitizer.bypassSecurityTrustHtml(element.narrationHTML);
          // });
        } else {

        }
      }, (err: any) => {
        alert("error API - GetLeadUpdateHistorie")
      });
    } else {
      alert("Invalid Lead ID");
    }
  }

  // groupRecordsByDate(records: Record[]): { date: string; records: Record[] }[]  {
  //   const groupedRecords = records.reduce((groups, record) => {
  //     const date = record.createDate.split('T')[0]; // Extract the date part only (YYYY-MM-DD)
  //     if (!groups[date]) {
  //       groups[date] = [];
  //     }
  //     groups[date].push(record);
  //     return groups;
  //   }, {} as { [key: string]: Record[] });

  //   return Object.keys(groupedRecords).map(date => ({
  //     date,
  //     records: groupedRecords[date]
  //   }));
  // }

  groupRecordsByDate(records: Record[]): { date: string; records: Record[] }[] {
    const groupedRecords = records.reduce((groups, record) => {
      const date = record.createDate.split('T')[0]; // Extract the date part only (YYYY-MM-DD)
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(record);
      return groups;
    }, {} as { [key: string]: Record[] });

    // Sort each group by createDate in descending order
    Object.keys(groupedRecords).forEach(date => {
      groupedRecords[date].sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
    });

    // Convert the grouped records into an array of objects with date and records
    return Object.keys(groupedRecords).map(date => ({
      date,
      records: groupedRecords[date]
    }));
  }

  ShowDocs(dociId: any) {
    this.cd.detectChanges();
    console.log(dociId);
    this.mediaPath = '';
    this._leadService.MediaGetFilePath(dociId).subscribe(x => {
      console.log('media is:', x);
      if (x && x.path) {
        debugger
        this.mediaPath = x.path;
        this.showDocsPopup = true;
        // (Window as any)["ProfileActivityComponent"] = this;
        this.cd.detectChanges();
      }
    });
  }

  addressObj: any;
  showAddress: boolean = false;
  ShowAddress(dociId: any) {
    this.cd.detectChanges();
    console.log(dociId);
    // this.mediaPath='';
    this._leadService.GetAddress(dociId).subscribe(x => {
      console.log('address is:', x);
      if (x && x.status == true) {
        this.showAddress = true;
        this.addressObj = x.returnObject;
        this.cd.detectChanges();
      } else {
        this.addressObj = {}
      }
    });
  }


  showName: boolean = false;
  userName: string = ''
  ShowName(id: any) {
    this._leadService.GetUserNameByUserId(id).subscribe((res: any) => {
      console.log('name is:', res);
      if (res && res.status == true) {
        this.showName = true;
        this.userName = res.response;
      } else {
        alert(res.response);
        this.userName = '';
      }
    }, (err: any) => {
      alert("Error API - GetUserNameByUserId")
    });
  }

  ShowBankDocs(doc: any) {
    this.cd.detectChanges();
    console.log(doc);
    if (doc) {
      window.open(doc);
    } else {
      alert("Unable to download the file");
    }
  }

  downloadDoc() {
    window.open(this.mediaPath);
  }

}
// record.model.ts
export interface Record {
  id: number;
  leadId: number;
  userId: string;
  userName: string;
  eventName: string;
  narration: string;
  narrationHTML: string;
  createDate: string;
}

export interface GroupedRecords {
  [key: string]: Record[];
}