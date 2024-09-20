import { Component, OnInit } from '@angular/core';
import { NbfcTestService } from '../nbfc-test.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-nbfc-url-test',
  templateUrl: './nbfc-url-test.component.html',
  styleUrls: ['./nbfc-url-test.component.scss'],
})
export class NbfcUrlTestComponent implements OnInit {
  // table data
  dataList: any[] = [];
  Loader: boolean = false;

  // dropdown
  listNBFC: any[] = [];
  selectedNBFC: any;
  selectedNBFCNew: any;

  // popup
  popupOpen: boolean = false;
  isEditMode: boolean = false;

  // add/update payload
  payload = {
    NBFCCompanyApiId: null,
    NBFCCompanyId: 0,
    APIUrl: '',
    Code: '',
  };

  constructor(private nbfcServ: NbfcTestService,
    private messageService: MessageService) {}

  ngOnInit(): void {
    this.getNBFCList();
  }

  getNBFCList() {
    this.nbfcServ.GetCompanyListByCompanyTypeNBFC().subscribe((res: any) => {
      console.log('nbfc dropdown list', res);
      if (res && res.returnObject) {
        this.listNBFC = res.returnObject;
        this.selectedNBFC = this.listNBFC.length > 0 ? this.listNBFC[0] : null;
        if (this.selectedNBFC) {
          this.search();
        }
      } else {
        this.listNBFC = [];
      }
    });
  }

  search() {
    if(this.selectedNBFC && this.selectedNBFC.id){
      this.Loader = true;
      this.nbfcServ
        .GetNBFCComapanyApiData(this.selectedNBFC.id)
        .subscribe((res: any) => {
          console.log('nbfc detail list', res);
          if (res) {
            this.Loader = false;
            this.dataList = res;
          } else {
            this.Loader = false;
            this.dataList = [];
          }
        });
    }
    else{
      this.dataList = [];
    }
  }

  // APIUrl: string = '';
  // Code: string = '';

  addURL() {
    debugger;

    if (this.payload.Code && this.payload.APIUrl) {
      this.payload.NBFCCompanyId = this.selectedNBFCNew.id;
      this.nbfcServ
        .SaveNBFCCompanyApiData(this.payload)
        .subscribe((res: any) => {
          console.log('add new nbfc url res', res);
          if (res) {
            // alert('field added');
            this.messageService.add({ severity: 'success', summary:'Field added' });

            this.popupOpen = false;
            this.selectedNBFC = this.selectedNBFCNew;
            this.search();
          }
        });
    } else {
      const invalid = [];
      this.payload.APIUrl ? null : invalid.push('API Url');
      this.payload.Code ? null : invalid.push('Code');
      this.payload.NBFCCompanyId ? null : invalid.push('NBFC Company');

      // alert('Enter valid information for ' + invalid);
      this.messageService.add({ severity: 'error', summary:'Enter valid information for ' + invalid });

    }
  }

  editURL() {
    // debugger
    if (
      this.payload.Code &&
      this.payload.APIUrl &&
      this.payload.NBFCCompanyId
    ) {
      this.payload.NBFCCompanyId = this.selectedNBFCNew.id;
      this.nbfcServ.UpdateNBFCCompanyApi(this.payload).subscribe((res: any) => {
        console.log('add new nbfc url res', res);
        if (res) {
          // alert('field edited');
          this.messageService.add({ severity: 'success', summary: 'Field edited' });

          this.popupOpen = false;
          this.selectedNBFC = this.selectedNBFCNew;
          this.search();
        }
      });
    } else {
      const invalid = [];
      this.payload.APIUrl ? null : invalid.push('API Url');
      this.payload.Code ? null : invalid.push('Code');
      this.payload.NBFCCompanyId ? null : invalid.push('NBFC Company');

      // alert('Enter valid information for ' + invalid);
      this.messageService.add({ severity: 'error', summary: 'Enter valid information for ' + invalid });

    }
  }

  openPopupFn(mode: string, rowData?: any) {
    // this.isEditMode = mode == 'add'? false : true;
    if (mode == 'add') {
      this.isEditMode = false;
      this.payload.APIUrl = '';
      this.payload.Code = '';
      this.payload.NBFCCompanyApiId = null;
      this.selectedNBFCNew = null;
    }

    if (mode == 'edit') {
      this.isEditMode = true;
      this.payload.APIUrl = rowData.apiUrl;
      this.payload.Code = rowData.code;
      this.payload.NBFCCompanyApiId = rowData.nbfcCompanyApiId;
      this.payload.NBFCCompanyId = rowData.nbfcCompanyId;
      this.selectedNBFCNew = this.listNBFC.filter(
        (x) => x.id == rowData.nbfcCompanyId
      )[0];

      // this.selectedNBFCNew = null;
    }
    this.popupOpen = true;
  }
}
