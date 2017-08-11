import { Component } from '@angular/core';
declare var jquery:any;
declare var $ :any;
declare var d3:any;
declare var prompt:any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  answerCount =0;


  ngAfterViewInit(){
    /*this.svg = d3.select(".droppable")
      .append("svg")
      .attr("height",450)
      .attr("width",950)
      .attr("id","selectable");*/
  //  this.createTree();
   /* $.post("http://139.59.39.117:8282/topic", {"name" : "Sports" }).done(function( data ) {
      $("#flag").html( "Data Loaded: " + data.success );
    });*/

  }
}
