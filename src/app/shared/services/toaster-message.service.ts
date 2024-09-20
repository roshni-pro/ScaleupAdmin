import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
  

})
export class ToasterMessageService {

  constructor(private messageService: MessageService) {}

  showSuccess(message:any) {
      this.messageService.add({ severity: 'success', summary: 'Success', detail:message });
  }

  showInfo(message:any) {
      this.messageService.add({ severity: 'info', summary: 'Info',detail:message });
  }

  showWarn(message:any) {
      this.messageService.add({ severity: 'warn', summary: 'Warn',  detail:message });
  }

  showError(message:any) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail:message  });
  }}
