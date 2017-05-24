import { LoginPage } from './../login/login';
import { ConfigPage } from './../config/config';
import { Component } from '@angular/core';
import { NavController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ProdutoService } from "../../providers/produto-service";
import { ColetarPage } from "../coletar/coletar";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	constructor(
		public navCtrl: NavController, 
		private barcodeScanner: BarcodeScanner, 
		private platform: Platform, 
		private alertCtrl: AlertController,
		private prodService: ProdutoService,
		private loadingCtrl: LoadingController
	) {

  	}

	read() {
		this.platform.ready().then(() => { 
			this.barcodeScanner.scan().then((barcode) => {
				console.log(barcode);
				if(!barcode.cancelled) {
					console.log(barcode.text);
					let load = this.loadingCtrl.create({content: 'Aguarde'});
					load.present();
					this.prodService.getProd(barcode.text).then((rs: any) => {
						console.log(rs);
						load.dismiss();
                  rs.codigo = barcode.text;
                  this.navCtrl.push(ColetarPage, {produto: rs});
					}).catch(err => {
						load.dismiss();
						let alert = this.alertCtrl.create({
							title: 'Erro',
							subTitle: err,
							buttons: ['OK']
						}).present();
					})
				}
				
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
