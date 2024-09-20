import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { HistoryService } from '../../services/history.service';
// import { ExportService } from '../../services/export.service';
import { Pipe, PipeTransform } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ExportService } from '../../services/export.service';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  @ViewChild('table', { static: false }) table: ElementRef | undefined;
  @Input() entity: any;
  @Input() id: any;
  @Input() databaseName: any;
  Loader: boolean = false;
  EntityHistory: any;
  // isHistory: any
  exportBtnHide: boolean = false;
  FieldName: any;
  NewValue: any;
  OldValue: any;
  skip: number = 0;
  take: number = 10;

  constructor(private historyService: HistoryService, private exportService: ExportService,
    private messageService: MessageService) {
    this.EntityHistory = {}
    console.log(this.entity, this.id)
  }

  ngOnInit() {
    console.log(this.entity, this.id, this.databaseName)
    this.EntityHistory = [];
    // this.getHistory();
  }

  load(event: any){
    this.take = event.rows;
    this.skip = event.first;
    this.getHistory();
  }

  transform(value: string): string {
    return value.replace(/\n/g, '<br/>');
  }

  

  totalRecords: number = 0;
  getHistory() {
    debugger
    this.EntityHistory = []
    if (this.entity && this.id && this.databaseName) {
      
      let obj = {
        DatabaseName: this.databaseName,
        EntityName: this.entity,
        EntityId: this.id,
        Skip: this.skip,
        Take: this.take
      }
      // this.isHistory = false;
      
      this.Loader = true;
      this.historyService.getHistory(obj).subscribe((res: any) => {
        console.log('data', res);
        var pass: any[] = [];
        this.Loader = false;

        if (res && res.auditLogs.length > 0) {
          this.totalRecords = res.totalRecords
          res.auditLogs.forEach((x: any) => {
            x.changes = x.changes.replace(/\\n/g, '<br/>');
          })
          this.EntityHistory = res.auditLogs;
        } else {
          this.EntityHistory = [];
          this.totalRecords = 0;
        }
      },
        (err: any) => {
          this.Loader = false;
          // alert("Error - getHistory");
          this.messageService.add({ severity: 'error', summary: 'Error - getHistory' });

        }
      )

    }
  }
  onExport() {
    console.log(this.EntityHistory);
    this.exportService.exportAsExcelFile(this.EntityHistory,"history_data");
  }
}
