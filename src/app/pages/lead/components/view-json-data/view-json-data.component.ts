import { Component, OnInit ,Input} from '@angular/core';

@Component({
  selector: 'app-view-json-data',
  templateUrl: './view-json-data.component.html',
  styleUrls: ['./view-json-data.component.scss']
})
export class ViewJsonDataComponent implements OnInit{
    @Input() getAllJsonData: any;
    constructor(){

    }
    ngOnInit(): void {
        
    }
}
