import { LoginPage } from './../pages/login/login';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CargaService } from "../providers/carga-service";
import { ConfigPage } from "../pages/config/config";
import { HomePage } from "../pages/home/home";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen, 
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private cargaService: CargaService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#0D47A1');
      this.splashScreen.hide();
    });
  }

  updCadastro() {
		this.alertCtrl.create({
			title: "Atualizar",
    		subTitle: 'Deseja atualizar a base de dados?',
    		buttons: [
				{
					text: 'Não',
					role: 'cancel'
				},
				{
					text: 'Sim',
					handler: () => {
						let loader =  this.loadingCtrl.create({content: "Atualizando a base de dados, isso pode levar algum tempo..."});
						loader.present();
						this.cargaService.initCarga().then(res => {
							console.log(res);
							console.log("Carga realizada com sucesso");
							loader.dismiss();
						}).catch(err => {
							loader.dismiss();
							console.log("ERRO:", err);
						})
					}
				}
    		]
  		}).present();
	}

  logout() {
		this.alertCtrl.create({
    		subTitle: 'Deseja realmente sair?',
    		buttons: [
				{
					text: 'Cancelar',
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					}
				},
				{
					text: 'Sair',
					handler: () => {
						localStorage.removeItem('token');
						this.nav.setRoot(LoginPage);
					}
				}
    		]
  		}).present()
	}

  config() {
		this.nav.push(ConfigPage);
	}

  inicio() {
    this.nav.setRoot(HomePage);
  }
}
