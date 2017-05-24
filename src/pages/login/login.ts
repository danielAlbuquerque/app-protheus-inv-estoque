import { HomePage } from './../home/home';
import { AuthService } from './../../providers/auth-service';
import { ConfigPage } from './../config/config';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, MenuController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [ AuthService ]
})
export class LoginPage {

  frmLogin: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    public menuCtrl: MenuController,
    public authService: AuthService
  ) {
      let token = localStorage.getItem('token');
      
      if(token != null) {
        this.menuCtrl.enable(true);
        this.navCtrl.setRoot(HomePage);
      } else {
        this.menuCtrl.enable(false);
      }

      this.frmLogin = this.formBuilder.group({
          username: ['', Validators.compose([Validators.required])],
          password: ['', Validators.compose([Validators.required])]
      });
      
  }

  login() {
    if(this.frmLogin.valid) {
      let loader = this.loadingCtrl.create({content: 'Autenticando...'});
      loader.present();
      this.authService.login(this.frmLogin.controls['username'].value, this.frmLogin.controls['password'].value)
      .then(result => {
        loader.dismiss();
        this.menuCtrl.enable(true);
        this.navCtrl.setRoot(HomePage);
      }).catch(err => {
        loader.dismiss();
          let alert = this.alertController.create({
            title: 'Erro',
            subTitle: err,
            buttons: ['OK']
          });
          alert.present();
      });
    }
  }

  config() {
    this.navCtrl.push(ConfigPage);
  }
}
