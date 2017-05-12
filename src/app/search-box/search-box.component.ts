import { Component, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { YouTubeSearchService } from "app/youtube-search/youtube-search.service";
import { SearchResult } from "app/model/search-result";
import { Observable } from "rxjs/Rx";


@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
  
  @Output() loading:EventEmitter<boolean>= new EventEmitter<boolean>();
  @Output() results:EventEmitter<SearchResult[]>= new EventEmitter<SearchResult[]>();

  constructor(private youtubeService:YouTubeSearchService,private el:ElementRef) { }

  ngOnInit() {
    Observable.fromEvent(this.el.nativeElement,'keyup')
    .map((e:any)=>e.target.value)
    .filter((text:string)=>text.length>1)
    .debounceTime(250)
    .do(()=>this.loading.emit(true))
    .map((query:string)=>this.youtubeService.search(query))
    .switch().subscribe(
      (results:SearchResult[])=>{
        this.loading.emit(false);
        this.results.emit(results);
      },
      (err:any)=>{
        console.log(err);
        this.loading.emit(false);
      },
      ()=>{
        this.loading.emit(false);
      }
    );
  }

}
