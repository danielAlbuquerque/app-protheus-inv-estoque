import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { ProdutoService } from "../../providers/produto-service";
import { SQLite } from '@ionic-native/sqlite';

@Component({
  selector: 'page-coletar',
  templateUrl: 'coletar.html',
})
export class ColetarPage {
  produto: any = null;
  filial;
  documento;
  endereco;
  qtd;
  qtd2;
  filiais: Array<any> = [];
  enderecos: Array<any> = [];
  armazens: Array<any> = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private ProdService: ProdutoService,
    private sqlite: SQLite,
    private loadingController: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    this.produto = this.navParams.get('produto');
    this.documento = this.getDoc();
    this.loadFiliais();
    this.loadArmazens();
  }

  save() {
    if(this.endereco == null) {
      this.alertCtrl.create({
         title: 'Erro',
         subTitle: 'Favor digitar o endereço',
         buttons: ['OK']
			}).present();  
      return false;
    }
    this.validateEndereco(this.endereco.toUpperCase()).then(existe => {
      if(existe) {
        let data = {
          filial: this.filial,
          produto: this.produto.codigo,
          doc: this.documento,
          qtd: Number(this.qtd),
          qtd2: Number(this.qtd2),
          local: this.produto.locpad,
          endereco: this.endereco.toUpperCase()
        };
        /*if(data.qtd < 1 || isNaN(data.qtd)) {
          this.alertCtrl.create({
            title: 'Erro',
            subTitle: 'A quantidade informada é inválida',
            buttons: ['OK']
				  }).present();  
        }*/
        this.ProdService.salvarInv(data).then(res => {
          this.toastCtrl.create({
            message: 'Registro salvo com sucesso',
            duration: 3000,
            position: 'bottom'
          }).present();
          this.navCtrl.pop();
        }).catch(err => {
          this.alertCtrl.create({
            title: 'Erro',
            subTitle: err,
            buttons: ['OK']
          }).present();
        });
      } else {
        this.alertCtrl.create({
					title: 'Erro',
					subTitle: 'O endereço informado é inválido',
					buttons: ['OK']
				}).present();
      }
    })
  }

  private loadFiliais() {
    let loader = this.loadingController.create({content: 'Carregando...'});
    loader.present();

    this.sqlite.create({name: 'inv.db', location: 'default'}).then(db => {
      db.executeSql('SELECT * FROM filiais', []).then(rs => {
        for(let i=0; i<rs.rows.length; i++) {
          this.filiais[i] = rs.rows.item(i);
        }
        console.log(this.filiais);
        loader.dismiss();
      });
    });
  }


  private loadArmazens() {
    let loader = this.loadingController.create({content: 'Carregando...'});
    loader.present();

    this.sqlite.create({name: 'inv.db', location: 'default'}).then(db => {
      db.executeSql('SELECT DISTINCT local FROM enderecos', []).then(rs => {
        for(let i=0; i<rs.rows.length; i++) {
          this.armazens[i] = rs.rows.item(i);
        }
        console.log(this.armazens);
        loader.dismiss();
      });
    });
  }

  private getDoc() {
    var today = new Date();
    let dd: any = today.getDate();
    var mm: any = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd;
    } 
    if(mm<10){
        mm='0'+mm;
    } 
    return yyyy+mm+dd;
  }
  
  private validateEndereco(endereco) {
    return new Promise(resolve => {
      this.sqlite.create({name: 'inv.db', location: 'default'}).then(db => {
        db.executeSql('SELECT * FROM enderecos WHERE endereco = ?', [endereco]).then(rs => {
          resolve(rs.rows.length > 0 ? true:false);
        });
      });
    });
  }

}
