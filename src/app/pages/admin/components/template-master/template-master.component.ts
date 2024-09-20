import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'app/shared/services/loader.service';
import { TemplateService } from '../../services/template.service';
import { ConfirmationService ,MessageService} from 'primeng/api';

@Component({
  selector: 'app-template-master',
  templateUrl: './template-master.component.html',
  styleUrls: ['./template-master.component.scss']
})
export class TemplateMasterComponent implements OnInit {

  constructor(private templateService: TemplateService, private confirmationService: ConfirmationService,private messageService: MessageService) {
    this.TemplateForEnum = [
      { Type: 'Lead' },
      { Type: 'Product' },
      { Type: 'Company' },
      { Type: 'Loan Account' },
    ];
    this.TemplateType = [{ Type: 'SMS' }, { Type: 'Email' }];
  }

  Loader: boolean = false;
  TemplateForEnum: any = []
  TemplateType: any = []
  selectedType: any = null
  selectedTemplateForEnum: any = null
  display: boolean = false
  addDLTID: string = ''
  msg: string = ''
  code: string = ''
  TemplateMasterList: any[] = [];
  Status: boolean = false
  isEdit: boolean = false
  rowdata: any = null
  searchTemplate:any=null
  searchType:any
  ngOnInit(): void {
    this.getAllTemplateMaster();
  }

  getAllTemplateMaster() {
    this.Loader = true;
    this.templateService.GetTemplateMasterAsync().subscribe((res: any) => {
      this.Loader = false;
      if (res.status) {
        this.TemplateMasterList = res.response;
        this.TemplateMasterLists=this.TemplateMasterList;
        console.log(this.TemplateMasterList)
      }
      else {
        this.messageService.add({ severity: 'error', summary: res.message});
        //alert(res.message)
      }
    },(error:any)=>console.log(error))
  }

  TemplateMasterLists:any[]=[];
  Search(){
    debugger;
    this.TemplateMasterLists=[];
    if(this.searchTemplate!=null && this.searchTemplate.Type=='Loan Account') this.searchTemplate.Type='LoanAccount'
    if(this.searchType!=null){
      this.TemplateMasterLists=this.TemplateMasterList.filter( x => x.templateType == this.searchType.Type);
    }
    if(this.searchTemplate!=null){
      debugger
      this.TemplateMasterLists=this.TemplateMasterList.filter( x => x.templateFor == this.searchTemplate.Type );
      if(this.searchType!=null){
        this.TemplateMasterLists=this.TemplateMasterList.filter( x => x.templateFor == this.searchTemplate.Type && x.templateType == this.searchType.Type);
      }
    }
  }
  

  Edit(rowdata: any) {
    this.isEdit = true
    this.Loader = true;
    this.templateService.GetTemplateById(rowdata.templateId, rowdata.templateFor).subscribe((res: any) => {
      this.Loader = false;
      debugger
      if (res.status) {
        this.rowdata = res.response
        this.Status = res.response.isActive
        this.code = res.response.templateCode
        this.selectedType = { Type: res.response.templateType }
        this.msg = res.response.template
        this.addDLTID = res.response.dltid
        this.selectedTemplateForEnum = { Type: res.response.templateFor }
        //alert(res.message)
      }
      else {
        this.messageService.add({ severity: 'error', summary: res.message });
       // alert(res.message)
      }
    },(error:any)=>console.log(error))
  }

  Update() {
    this.Submit();
  }

  getList(value: any) { }

  Submit() {
    debugger
    console.log(this.msg, this.code, this.addDLTID)
    if (this.selectedTemplateForEnum == null) this.messageService.add({ severity: 'warn', summary: 'select Template for first'});//alert('select Template for first')
    else if (this.selectedType == null) this.messageService.add({ severity: 'warn', summary: 'select Template type first'});//alert('select Template type first')
    else if (this.addDLTID == '' && this.selectedType!=null && this.selectedType.Type == 'SMS') this.messageService.add({ severity: 'warn', summary: 'DLTID Is Required' });//alert('DLTID Is Required')
    else if (this.code == '') this.messageService.add({ severity: 'warn', summary: 'Template Code Is Required' });//alert('Template Code Is Required')
    else if (this.msg == '') this.messageService.add({ severity: 'warn', summary: 'Template Description Is Required' });//alert('Template Description Is Required')
    else {
      var TemMasterDc = {};
      if (this.selectedType.Type == 'SMS') {
        TemMasterDc = {
          Status: this.Status,
          TemplateCode: this.code,
          TemplateType: this.selectedType.Type,
          Template: this.msg,
          DLTID: this.addDLTID,
          TemplateID: this.rowdata != null ? this.rowdata.templateId : null
        }
      }
      else {
        TemMasterDc = {
          Status: this.Status,
          TemplateCode: this.code,
          TemplateType: this.selectedType.Type,
          Template: this.msg,
          TemplateID: this.rowdata != null ? this.rowdata.templateId : null
        }
      }
      if (this.selectedTemplateForEnum.Type == 'Lead') {
        this.leadTemplate(TemMasterDc);
      }
      if (this.selectedTemplateForEnum.Type == 'Product') {
        this.productTemplate(TemMasterDc);
      }
      if (this.selectedTemplateForEnum.Type == 'Company') {
        this.CompanyTemplate(TemMasterDc);
      }
      if (this.selectedTemplateForEnum.Type == 'Loan Account') {
        this.loanAccountTemplate(TemMasterDc);
      }
    }
  }

  loanAccountTemplate(TemMasterDc: any){
    this.Loader = true;
    this.templateService.LoanAccSaveModifyTemplateMaster(TemMasterDc).subscribe((res: any) => {
      this.Loader = false;
      debugger
      if (res.status) {
        this.display = false;
        this.isEdit = false;
        this.messageService.add({ severity: 'success', summary: res.message});//alert(res.message)
        this.getAllTemplateMaster();
      }
      else this.messageService.add({ severity: 'error', summary: res.message});//alert(res.message)
    },(error:any)=>console.log(error))
  }

  CompanyTemplate(TemMasterDc: any) {
    this.Loader = true;
    this.templateService.companySaveModifyTemplateMaster(TemMasterDc).subscribe((res: any) => {
      this.Loader = false;
      debugger
      if (res.status) {
        this.display = false;
        this.isEdit = false;
        this.messageService.add({ severity: 'success', summary: res.message});//alert(res.message)
        this.getAllTemplateMaster();
      }
      else this.messageService.add({ severity: 'error', summary: res.message});//alert(res.message)
    },(error:any)=>console.log(error))
  }

  leadTemplate(TemMasterDc: any) {
    this.Loader = true;
    this.templateService.SaveModifyTemplateMaster(TemMasterDc).subscribe((res: any) => {
      this.Loader = false;
      debugger
      if (res.status) {
        this.display = false;
        this.isEdit = false;
        this.messageService.add({ severity: 'success', summary: res.message});//alert(res.message)
        this.getAllTemplateMaster();
      }
      else this.messageService.add({ severity: 'error', summary: res.message});//alert(res.message)
    },(error:any)=>console.log(error))
  }

  productTemplate(TemMasterDc: any) {
    this.Loader = true;
    this.templateService.productSaveModifyTemplateMaster(TemMasterDc).subscribe((res: any) => {
      this.Loader = false;
      debugger
      if (res.status) {
        this.display = false;
        this.isEdit = false;
        this.messageService.add({ severity: 'success', summary: res.message});//alert(res.message)
        this.getAllTemplateMaster();
      }
      else  this.messageService.add({ severity: 'error', summary:res.message});//alert(res.message)
    },(error:any)=>console.log(error))
  }

  AddDialoag() {
    // if (this.selectedTemplateForEnum == null) alert('select Template for first')
    // else if (this.selectedType == null) alert('select Template type first')
    // else {
      this.display = true
      this.Status = false, this.msg = ''; this.code = ''; this.addDLTID = '', this.rowdata = null;
    // }
  }

  ActiveInactive(IsActive: any) {
    if (IsActive == true) {
      var activeData = 'Active';
    } else {
      activeData = 'InActive'
    }
    this.confirmationService.confirm({
      message: 'Are you sure want to' + ' ' + activeData + ' ' + 'this confirmation?',
      accept: () => {
        this.Status = IsActive;
      },
      reject: () => {
        this.Status = !IsActive;
      }
    })
  }

  omit_special_char_and_text(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  space(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }

  omit_special_char(event: any) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || k == 13 || (k >= 48 && k <= 57));
  }
}
