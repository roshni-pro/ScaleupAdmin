import { Directive, ElementRef, HostListener, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
// import { AuthService } from '../../shared/auth/auth.service';
import { PermissionModeService } from './permission-mode.service';

@Directive({
  // standalone: true,
  selector: '[appMode]'
})
export class ModeDirective implements OnInit, OnChanges {

  @Input('appMode') requiredPermission!: string;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    // private authService: AuthService,
    private PermissionService: PermissionModeService,
  ) {
    console.log("requiredPermission", this.requiredPermission);
  }


  ngOnChanges(changes: SimpleChanges): void {
    // throw new Error('Method not implemented.');
    // let hasPermission = this.PermissionService.getPermissionList();
    // console.log("hasPermission", hasPermission, this.requiredPermission);
    // let localPermission = localStorage.getItem("permission");
    // console.log("localPermission", localPermission);
  }


  // hasPermission: any[] = [];
  hasPermission: boolean = false;
  ngOnInit() {
    // debugger
    // let hasPermission = this.PermissionService.getPermissionList();
    // console.log("hasPermission", hasPermission, this.requiredPermission);
    let localPermission = localStorage.getItem("current-page-permissions");
    if (localPermission) {
      this.hasPermission = localPermission.includes(this.requiredPermission);
    }
    // console.log("localPermission", localPermission);
    // let hasPermission: boolean = false;


    // old 
    // if (!this.hasPermission) {
    //   this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
    // } else {
    //   this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
    // }


    // new
    if (!this.hasPermission) {
      this.renderer.setStyle(this.el.nativeElement, 'pointer-events', 'none');
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.5');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'pointer-events', 'auto');
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
    }
  }

  @HostListener('click', ['$event'])
  handleClick(event: Event) {
    // debugger
    if (!this.hasPermission) {
      event.preventDefault(); // Prevent the default button action
      alert('You do not have permission to perform this action.');
    }
  }


}
