import {  Component } from '@angular/core';
import { environment } from 'environments/environment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ViewChild, ElementRef } from '@angular/core';
import { AddAnchorProductService } from '../services/add-anchor-product.service';
import { StampUploaderService } from 'app/pages/role-based/services/stamp-uploader.service';
import { ExportService } from 'app/shared/scale-up-shared/services/export.service';

@Component({
  selector: 'app-stamp-uploader',
  templateUrl: './stamp-uploader.component.html',
  styleUrls: ['./stamp-uploader.component.scss']
})
export class StampUploaderComponent  {

  @ViewChild('fileRef', { static: false }) fileUploader?: ElementRef<HTMLInputElement>;
  @ViewChild('fileRef1', { static: false }) fileUploader1?: ElementRef<HTMLInputElement>;
  
  Loader: boolean = false;
  visible: boolean = false;
  newStamp: boolean = false;
  stampTypeList: stampDc[] 
  selectedStamp:any=undefined;
  stampDetailList:any[]=[];
  SlaLbaStampAutoFilled:any
  uploadedImageFilename: any
  entity:string='ArthmateSlaLbaStampDetail'
  databaseName:string = 'lead';
  id:number=0;

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService, private productService: AddAnchorProductService
    , private stampUploaderService: StampUploaderService,  private exportService: ExportService
  ) {
    this.stampTypeList = [
      {id: 0, name: "Unused Stamp",},
      {id: 1, name: "Used Stamp",},
      {id: 2, name: "Assigned Stamp",}
    ];
    this.SlaLbaStampAutoFilled={
      UsedFor:'Arthmate India Financing Limited',
      PartnerName:'ShopKirana',
      stampAmount:'101',
      purpose:'LBA'
    }
    this.selectedStamp= {id: 0, name: "Unused Stamp"}
    //this.getStampDetails();
  }

  getStampDetails(){
    debugger;
    this.Loader=true;
    this.stampUploaderService.GetStampUploaderList(this.selectedStamp.id,this.skip,this.take).subscribe((res:any)=>{
      if(res.isSuccess){
        this.Loader=false;
        this.stampDetailList = res.result;
        this.totalRecords = res.result[0].totalRecord;
        this.stampDetailList.forEach((stampDetail:any)=>{
          if( stampDetail.leadmasterId!=0 || stampDetail.dateofUtilisation!=null){ stampDetail.isShown = false }
          else{ stampDetail.isShown = true}
        })
        console.log(this.stampDetailList)
      }
      else{
        this.Loader=false;
        this.messageService.add({ severity: 'error', summary: res.message});
        this.stampDetailList=[];
      }
    });
  }

  totalRecords: any;
  skip:number=0;
  take:number=10;
  load(event: any) {
    debugger
    this.take = event.rows;
    this.skip = event.first;
    this.getStampDetails();
  }

  deleteRole(data:any){
    debugger
    this.confirmationService.confirm({
      message:`Are you sure that you want to Delete Stamp Paper Number ${data.stampPaperNo}?`,
      accept: () => {
        this.Loader=true;
        this.stampUploaderService.StampPagerDelete(data.id).subscribe((res:any)=>{
          if(res.isSuccess){
            this.Loader=false;
            this.messageService.add({ severity: 'success', summary: res.message});
            this.getStampDetails();
          }
          else{
            this.Loader=false;
            this.messageService.add({ severity: 'error', summary: res.message});
          }
        })      
      },
      reject: () => {
      }
    })
  }

  onHistoryClick(id: any) {
    debugger
    this.visible = true;
    this.id = id.id;
  }

  View(url:any) {
    debugger
   window.open(url)
  }

  showAddStamp(){
    this.newStamp = true;
  }

  editDisplay:boolean= false
  rowData: any;
  onEdit(rowData: any) {
    debugger
      this.editDisplay = true
      this.rowData = rowData
      this.newstampPaperNo = this.rowData.stampPaperNo
      console.log(this.rowData.StampPaperNo);
  }

  getStamp(){
    //this.getStampDetails();
  }

  OnSave(){
    if (this.stampPaperNo == null || this.stampPaperNo == undefined || this.stampPaperNo == 0) {
      this.messageService.add({ severity: 'error', summary: 'Enter Stamp Paper No.'});
    }
    else if (this.uploadedImageFilename == undefined || this.uploadedImageFilename == null || this.uploadedImageFilename == '') {
        this.messageService.add({ severity: 'error', summary: 'Upload Image'});
    }
    else{
      this.Loader=true;
      this.stampUploaderService.StampPaperNumberCheck(this.stampPaperNo).subscribe((res:any)=>{
        debugger
        if(!res.isSuccess){
          this.Loader=false;
          this.messageService.add({ severity: 'error', summary: res.message});
        }
        else{
          this.Loader=false;
          var SlaLbaStampDc={
            Id:null,
            StampPaperNo : this.stampPaperNo,
            UsedFor : this.SlaLbaStampAutoFilled.UsedFor,
            PartnerName : this.SlaLbaStampAutoFilled.PartnerName,
            Purpose : this.SlaLbaStampAutoFilled.purpose,
            StampAmount : this.SlaLbaStampAutoFilled.stampAmount,
            LoanId : "",
            StampUrl : this.uploadedImage,
            IsStampUsed : false,
            DateofUtilisation :null,
            LeadmasterId:0
          }
          this.Loader=true;
          this.stampUploaderService.AddSlaLbaStamp(SlaLbaStampDc).subscribe((res:any)=>{
            debugger
            if(res.status){
              this.Loader=false;
              this.messageService.add({ severity: 'success', summary: res.message});
              this.getStampDetails();
              this.newStamp=false;
            }
            else{
              this.Loader=false;
              this.messageService.add({ severity: 'error', summary: res.message});
            }
          });
        }
      });
    }
  }

  OnClear(){
    this.stampPaperNo=null
    this.uploadedImage = '';
    this.fileUploader!.nativeElement.value = '';
    this.uploadedImageFilename = '';
  }

  uploadedImage: any
  newstampPaperNo: any;
  stampPaperNo:any
  editCancel() {
    debugger
    this.uploadedImage = '';
    this.fileUploader1!=null?this.fileUploader1.nativeElement.value = '':'';
    this.fileUploader!=null?this.fileUploader.nativeElement.value = '':'';
    this.uploadedImageFilename = '';
    this.stampPaperNo=null
  }

  Upload(event: any) {
    debugger
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      this.uploadedImageFilename = event.target.files[0];
      const imageFile = event.target.files[0];
      const maxSize = 1 * 1024 * 1024; // 1 Megabytes in bytes
    
      if (imageFile.size > maxSize) {
        this.messageService.add({ severity: 'error', summary: 'Image size cannot exceed 1MB' });
        return; // Prevent further processing
      }
      reader.onload = (e: any) => {
          this.uploadedImage = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }

    this.Loader=true;
    const formData = new FormData();
    formData.append('FileDetails', event.target.files[0]);
    formData.append('IsValidForLifeTime', 'true');
    formData.append('ValidityInDays', '');
    formData.append('SubFolderName', '');
    this.productService.PostSingleFile(formData).subscribe((res: any) => {
      this.Loader=false;
      console.log(res);
      if (res.status) {
        this.messageService.add({ severity: 'success', summary: res.message});
        res.docId;
        this.uploadedImage = res.filePath;
      }
      else{
        this.messageService.add({ severity: 'success', summary: "file couldn't upload"});
      }
    });
  }

  openLargeImage(img:any) {
    var newWindow = window.open('', '_blank');
    if(newWindow!=null){
      newWindow.document.write('<img id="fullscreenImage" src="' + img + '" style="width: 100%; height: 100%; object-fit: contain; position: absolute; top: 0; left: 0;" />');
      var imageElement = newWindow.document.getElementById('fullscreenImage');
      if (imageElement !=null && imageElement.requestFullscreen) {
          imageElement.requestFullscreen();
      } 
    }
  }

  stringUrl: string[]=[];
  editRowData() {
    debugger
    if (this.uploadedImageFilename == undefined || this.uploadedImageFilename == null || this.uploadedImageFilename == '') {
      this.messageService.add({ severity: 'error', summary: 'Upload Image First'});
    }
    else{
      if(this.rowData.stampPaperNo==this.newstampPaperNo) {
        this.Loader=false;
        var SlaLbaStampDc={
          Id:this.rowData.id,
          StampPaperNo : this.newstampPaperNo,
          UsedFor : this.rowData.usedFor,
          PartnerName : this.rowData.partnerName,
          Purpose : this.SlaLbaStampAutoFilled.purpose,
          StampAmount : this.rowData.stampAmount,
          LoanId : "",
          StampUrl : this.uploadedImage,
          IsStampUsed : this.rowData.isStampUsed,
          DateofUtilisation : this.rowData.dateofUtilisation,
          LeadmasterId:this.rowData.leadmasterId
        }
        this.Loader=true;
        this.stampUploaderService.AddSlaLbaStamp(SlaLbaStampDc).subscribe((res:any)=>{
          if(res.status){
            this.Loader=false;
            this.messageService.add({ severity: 'success', summary: res.message});
            this.getStampDetails();
            this.editDisplay = false;
          }
          else{
            this.Loader=false;
            this.messageService.add({ severity: 'error', summary: res.message});
          }
        });
      }
      else{
        this.stampUploaderService.StampPaperNumberCheck(this.newstampPaperNo).subscribe((res:any)=>{
          debugger
          if(!res.isSuccess){
            this.Loader=false;
            this.messageService.add({ severity: 'error', summary: res.message});
          }
          else{
            this.Loader=false;
            var SlaLbaStampDc={
              Id:this.rowData.id,
              StampPaperNo : this.newstampPaperNo,
              UsedFor : this.rowData.usedFor,
              PartnerName : this.rowData.partnerName,
              Purpose : this.SlaLbaStampAutoFilled.purpose,
              StampAmount : this.rowData.stampAmount,
              LoanId : "",
              StampUrl : this.uploadedImage,
              IsStampUsed : this.rowData.isStampUsed,
              DateofUtilisation : this.rowData.dateofUtilisation,
              LeadmasterId:this.rowData.leadmasterId
            }
            this.Loader=true;
            this.stampUploaderService.AddSlaLbaStamp(SlaLbaStampDc).subscribe((res:any)=>{
              if(res.status){
                this.Loader=false;
                this.messageService.add({ severity: 'success', summary: res.message});
                this.getStampDetails();
                this.editDisplay = false;
              }
              else{
                this.Loader=false;
                this.messageService.add({ severity: 'error', summary: res.message});
              }
            });
          }
        });
      }
    }
  }

  Export(){
    debugger;
    this.Loader=true;
    this.stampUploaderService.GetStampUploaderList(this.selectedStamp.id,this.skip,0).subscribe((res:any)=>{
      if(res.isSuccess){
        this.Loader=false;
        this.exportService.exportAsExcelFile(res.result, 'Stamp Export');
      }
      else{
        this.Loader=false;
        this.messageService.add({ severity: 'error', summary: res.message});
      }
    });
  }

  search(){this.getStampDetails();}
}

export class stampDc {
  'id': number;
  'name':string;
}