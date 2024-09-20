import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// import { LoaderService } from '../../services/loader.service';
import { LoaderNewService } from '../services/loader-new.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom

})
export class LoaderComponent implements OnInit {

  constructor(public  loadernewService:LoaderNewService) { }

  ngOnInit(): void {
  }

}

