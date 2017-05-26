import { LoginPage } from './../login/login';
import { ConfigPage } from './../config/config';
import { Component } from '@angular/core';
import { NavController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ProdutoService } from "../../providers/produto-service";
import { ColetarPage } from "../coletar/coletar";
import { CargaService } from "../../providers/carga-service";
import { ListPage } from "../list/list";
import { SincronizarPage } from "../sincronizar/sincronizar";

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
		private loadingCtrl: LoadingController,
		private cargaService: CargaService
	) {

  	}

	digitar() {
		this.alertCtrl.create({
			title: 'Produto',
			message: "Digite o código do produto",
			inputs: [
				{
					name: 'codigo',
					placeholder: ''
				},
			],
			buttons: [
				{
					text: 'Cancelar'
				},
				{
					text: 'Confirmar',
					handler: data => {
						console.log(data);
						let load = this.loadingCtrl.create({content: 'Aguarde'});
						load.present();
						this.prodService.findByCod(data.codigo).then((rs: any) => {
							console.log(rs);
							load.dismiss();
							rs.codigo = data.codigo.trim();
							this.navCtrl.push(ColetarPage, {produto: rs});
						}).catch(err => {
							load.dismiss();
							this.alertCtrl.create({
								title: 'Erro',
								subTitle: err,
								buttons: ['OK']
							}).present();
						});
					}
				}
			]
		}).present();
	}

	read() {
		this.platform.ready().then(() => { 
			this.barcodeScanner.scan().then((barcode) => {
				console.log(barcode);
				if(!barcode.cancelled) {
					console.log(barcode.text);
					let load = this.loadingCtrl.create({content: 'Aguarde'});
					load.present();
					this.prodService.findByCod(barcode.text).then((rs: any) => {
						console.log(rs);
						load.dismiss();
                  		rs.codigo = barcode.text.trim();
                  		this.navCtrl.push(ColetarPage, {produto: rs});
					}).catch(err => {
						load.dismiss();
						this.alertCtrl.create({
							title: 'Erro',
							subTitle: err,
							buttons: ['OK']
						}).present();
					})
				}
				
			}).catch(err => {
				console.log(err);
				this.alertCtrl.create({
					title: 'Erro',
					subTitle: 'Nao foi possivel acessar a camera do celular',
					buttons: ['OK']
				}).present();
			});
		});
  	}

	registros() {
		this.navCtrl.push(SincronizarPage);
	}

	

	

}
