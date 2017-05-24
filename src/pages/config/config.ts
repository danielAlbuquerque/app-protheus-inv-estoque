import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage {

  URI: string = ""

  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController) {
    this.URI = localStorage.getItem('URL_SERVIDOR');
  }

  save() {
    localStorage.setItem('URL_SERVIDOR', this.URI);
    this.toastCtrl.create({
      message: 'Configuraçao salva com sucesso',
      duration: 3000,
      position: 'bottom'
    }).present();
    this.navCtrl.pop();
  }

}
