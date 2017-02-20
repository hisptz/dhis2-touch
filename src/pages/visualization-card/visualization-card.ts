import { Component ,Input} from '@angular/core';
/*
  Generated class for the VisualizationCard page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-visualization-card',
  templateUrl: 'visualization-card.html'
})
export class VisualizationCardPage {

  @Input('chartObject') chartObject;

  public options:any = {};
  public setSelectedChart : string;
  public charts = [
    {type: "line", path: "assets/dashboard/line.png"},
    {type: "bar", path: "assets/dashboard/column.png"},
    {type: "column", path: "assets/dashboard/bar.png"},
    {type: "area", path: "assets/dashboard/area.png"}
  ];

  public dashBoard = {
    top: [],
    button: [
      {type: "table", path: "assets/dashboard/table.png"},
      {type: "charts", path: "assets/dashboard/combined.png"}
    ],
    selected : ""
  };

  public table = {
    header : [],
    rows : []
  };

  constructor() {
    this.drawChart('line');
    this.changeVisualization("charts");
  }

  ionViewDidLoad() {

  }

  changeVisualization(type){
    if(type == "table"){
      this.table.header = [];
      this.table.rows = [];
      this.getTableObject();
    }
    this.dashBoard.selected = type;
  }

  getTableObject(){
    let counter = 1;
    let numberOfRows = this.getMaximumNumberOfRows();
    this.options.series.forEach((series:any)=>{
      let headerName = "Series " + counter;
      if(series.name){
        headerName = series.name;
      }else{
        counter ++;
      }
      this.table.header.push(headerName);
    });
    for(let index = 0; index < numberOfRows; index ++){
      let row = [];
      this.options.series.forEach((series:any)=>{
        if(series.data[index]){
          row.push(series.data[index]);
        }else{
          row.push("");
        }
      });
      this.table.rows.push(row);
    }
  }

  getMaximumNumberOfRows(){
    let numberOfRows = 0;
    this.options.series.forEach((series:any)=>{
      if(numberOfRows < series.data.length){
        numberOfRows = series.data.length;
      }
    });
    return numberOfRows;
  }

  drawChart(type) {
    this.options = {
      title: {text: 'Sample Population'},
      chart: {type: type},
      credits: {enabled: false},
      series: [
        {
          name: "2011",
          data: [9.9, 1.5, 0.44, 12.2, 49, 57.9, 6.6],
        },
        {
          name: "2012",
          data: [19.9, 19.5, 1.44, 11.2, 9, 57.6, 5],
        },
        {
          name: "2013",
          data: [39.9, 18.5, 104, 12.9, 13, 15.6, 6],
        },
        {
          name: "2014",
          data: [49.9, 17.5, 10.44, 12.2, 9, 57.6, 5.6],
        },
        {
          name: "2015",
          data: [49.9, 11.5, 16.44, 19.2, 0.9, 5, 56.2],
        },
        {
          name: "2016",
          data: [42.9, 17.5, 1.44, 19.2, 9, 7.09, 56]
        }
      ]
    };
    this.setSelectedChart = type;
  }

}
