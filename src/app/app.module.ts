import { AuthService } from './../providers/auth-service';
import { LoginPage } from './../pages/login/login';
import { ConfigPage } from './../pages/config/config';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from "@angular/http";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { ProdutoService } from "../providers/produto-service";
import { ColetarPage } from "../pages/coletar/coletar";
import { SQLite } from '@ionic-native/sqlite';
import { CargaService } from "../providers/carga-service";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ConfigPage,
    LoginPage,
    ColetarPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ConfigPage,
    LoginPage,
    ColetarPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    SQLite,
    ProdutoService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    CargaService
  ]
})
export class AppModule {}
