import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent {
  
  constructor(private router: Router){

  }

  navigate(){
    //rout to dahboard
    this.router.navigate(['pages/admin/welcome'])
  }
}
