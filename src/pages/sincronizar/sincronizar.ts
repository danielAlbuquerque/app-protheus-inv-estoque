import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { SQLite } from "@ionic-native/sqlite";
import { ProdutoService } from "../../providers/produto-service";

@Component({
  selector: 'page-sincronizar',
  templateUrl: 'sincronizar.html',
})
export class SincronizarPage {

  rows: Array<any> = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private loadCtrl: LoadingController,
    private sqlite: SQLite,
    private alertCtrl: AlertController,
    private prodService: ProdutoService
  ) {
    this.loadInv();
  }

  sync(event, id) {
    this.alertCtrl.create({
      title: 'Sincronizar',
      message: 'Deseja realmente sincronizar?',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Sincronizar',
          handler: () => {
            let load = this.loadCtrl.create({content: 'Sincronizando...'});
            load.present();
            this.prodService.sync(id).then(rs => {
              console.log(rs);
              this.alertCtrl.create({
                title: 'Inventário',
                subTitle: "Sincronizado com sucesso",
                buttons: ['OK']
              }).present();
              load.dismiss();
            }).catch(err => {
              console.log(err);
              this.alertCtrl.create({
                title: 'Erro ao sincronizar',
                subTitle: err,
                buttons: ['OK']
              }).present();
              load.dismiss();
            });
          }
        }
      ]
    }).present();
  }

  excluir(event, id) {
    this.alertCtrl.create({
      title: 'Excluir',
      message: 'Deseja realmente excluir?',
      buttons: [
        {
          text: 'Não'
        },
        {
          text: 'Sim, excluir',
          handler: () => {
            this.sqlite.create({name: 'inv.db', location: 'default'}).then(db => {
              db.executeSql('DELETE FROM inventario WHERE id = ?', [id]).then(rs => {
                this.loadInv();
              });
            });
          }
        }
      ]
    }).present();
    
  }

  private loadInv() {
    let load = this.loadCtrl.create({content: 'Carregando...'});
    load.present();
    this.sqlite.create({name: 'inv.db', location: 'default'}).then(db => {
      db.executeSql('SELECT * FROM inventario WHERE sincronizado = 0', []).then(rs => {
        if(this.rows.length > 0) this.rows = [];
        for(let i=0; i < rs.rows.length; i++) {
          this.rows.push(rs.rows.item(i));
        }
        load.dismiss();
      });
    });
  }

}
