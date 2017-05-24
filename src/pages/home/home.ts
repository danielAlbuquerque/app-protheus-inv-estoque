import { LoginPage } from './../login/login';
import { ConfigPage } from './../config/config';
import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	constructor(public navCtrl: NavController, private barcodeScanner: BarcodeScanner, private platform: Platform, private alertCtrl: AlertController) {

  	}

	read() {
		this.platform.ready().then(() => { 
			this.barcodeScanner.scan().then((barcode) => {
				console.log(barcode);
			}).catch(err => {
				console.log(err);
				let alert = this.alertCtrl.create({
					title: 'Erro',
					subTitle: 'Nao foi possivel acessar a camera do celular',
					buttons: ['OK']
				});
  				alert.present();
			});
		});
  	}

	config() {
		this.navCtrl.push(ConfigPage);
	}

	logoff() {
		let alert = this.alertCtrl.create({
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
						this.navCtrl.setRoot(LoginPage);
					}
				}
    		]
  		});
  		alert.present();
		
	}

}
