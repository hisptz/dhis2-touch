import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-about-container",
  templateUrl: "./about-container.component.html",
  styleUrls: ["./about-container.component.scss"]
})
export class AboutContainerComponent implements OnInit {
  @Input() systemInfoContent: any[];
  constructor() {}

  ngOnInit() {}
}
