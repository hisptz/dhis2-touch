import { NgModule } from "@angular/core";
import { IonicModule } from "ionic-angular";
import { ProgressBarComponent } from "./progress-bar/progress-bar";
import { LoadingComponent } from "./loading/loading";
import { NotificationComponent } from "./notification/notification";
import { EmptyListNotificationComponent } from "./empty-list-notification/empty-list-notification";
import { HelpContentsComponent } from "./help-contents/help-contents";
import { WarningComponent } from "./warning/warning";
import { AvailableLocalInstanceComponent } from "./available-local-instance/available-local-instance";
import { ProgressLoaderComponent } from "./progress-loader/progress-loader.component";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    ProgressBarComponent,
    ProgressLoaderComponent,
    LoadingComponent,
    NotificationComponent,
    EmptyListNotificationComponent,
    HelpContentsComponent,
    WarningComponent,
    AvailableLocalInstanceComponent
  ],
  imports: [IonicModule, TranslateModule.forChild()],
  exports: [
    ProgressBarComponent,
    ProgressLoaderComponent,
    LoadingComponent,
    NotificationComponent,
    EmptyListNotificationComponent,
    HelpContentsComponent,
    WarningComponent,
    AvailableLocalInstanceComponent
  ]
})
export class SharedModule {}
