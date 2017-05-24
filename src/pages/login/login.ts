import { ConfigPage } from './../config/config';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, MenuController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  frmLogin: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    public menuCtrl: MenuController
  ) {
      this.frmLogin = this.formBuilder.group({
          username: ['', Validators.compose([Validators.required])],
          password: ['', Validators.compose([Validators.required])]
      });
      this.menuCtrl.enable(false);
  }

  login() {
    if(this.frmLogin.valid) {
      let loader = this.loadingCtrl.create({content: 'Autenticando...'});
      loader.present();
    }
  }

  config() {
    this.navCtrl.push(ConfigPage);
  }
}
