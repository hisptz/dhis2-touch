import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ResourceProvider } from '../providers/resource/resource';
import {SharedModule} from "../components/shared.module";
import { HTTP } from '@ionic-native/http';
import { Network } from '@ionic-native/network';
import { HttpModule } from '@angular/http';
import { BackgroundMode } from '@ionic-native/background-mode';
import { IonicStorageModule } from '@ionic/storage';
import { AppVersion } from '@ionic-native/app-version';
import {HttpClientProvider} from "../providers/http-client/http-client";
import {UserProvider} from "../providers/user/user";
import {NetworkAvailabilityProvider} from "../providers/network-availability/network-availability";
import {AppProvider} from "../providers/app/app";
import {VisualizerService} from "../providers/visualizer-service";
import {DashboardServiceProvider} from "../providers/dashboard-service/dashboard-service";

@NgModule({
  declarations: [
    MyApp,
    TabsPage
  ],
  imports: [
    BrowserModule,
    SharedModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,HTTP,AppVersion,Network,BackgroundMode,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ResourceProvider,HttpClientProvider,UserProvider,NetworkAvailabilityProvider,AppProvider,
    VisualizerService,DashboardServiceProvider,
  ]
})
export class AppModule {}
