import { Component, OnInit, Input } from "@angular/core";
import { AppAboutContent } from "src/models";
import * as _ from "lodash";

@Component({
  selector: "app-about-container",
  templateUrl: "./about-container.component.html",
  styleUrls: ["./about-container.component.scss"]
})
export class AboutContainerComponent implements OnInit {
  @Input() systemInfoContent: any[];
  @Input() aboutContents: AppAboutContent[];
  onToggle: boolean;

  constructor() {}

  ngOnInit() {
    if (this.aboutContents && this.aboutContents.length > 0) {
      const aboutContent = this.aboutContents[0];
      this.toggleContent(aboutContent);
    }
  }

  toggleContent(aboutContent: AppAboutContent) {
    const { id, isOpened } = aboutContent;
    const aboutContents = _.map(this.aboutContents, _.cloneDeep);
    this.aboutContents = _.map(
      aboutContents,
      (aboutContentObj: AppAboutContent) => {
        return {
          ...aboutContentObj,
          isOpened: id === aboutContentObj.id ? !isOpened : false
        };
      }
    );
  }
}
