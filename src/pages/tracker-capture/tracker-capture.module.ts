import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { TrackerCapturePage } from "./tracker-capture";
import { SharedModule } from "../../components/shared.module";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [TrackerCapturePage],
  imports: [
    IonicPageModule.forChild(TrackerCapturePage),
    SharedModule,
    TranslateModule.forChild({})
  ]
})
export class TrackerCapturePageModule {}
