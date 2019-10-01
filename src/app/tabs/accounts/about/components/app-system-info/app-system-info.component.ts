import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-app-system-info",
  templateUrl: "./app-system-info.component.html",
  styleUrls: ["./app-system-info.component.scss"]
})
export class AppSystemInfoComponent implements OnInit {
  @Input() systemInfoContent: any[];
  constructor() {}

  ngOnInit() {}
}
