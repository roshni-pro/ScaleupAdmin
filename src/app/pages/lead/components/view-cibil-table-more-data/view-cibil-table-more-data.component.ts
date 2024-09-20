import { Component, OnInit ,Input} from '@angular/core';

@Component({
  selector: 'app-view-cibil-table-more-data',
  templateUrl: './view-cibil-table-more-data.component.html',
  styleUrls: ['./view-cibil-table-more-data.component.scss']
})
export class ViewCibilTableMoreDataComponent implements OnInit{
    @Input() viewMoreData: any;

    constructor(){

    }
    ngOnInit(): void {
        
    }
}
