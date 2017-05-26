import { Component } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { LoadingController } from "ionic-angular";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {

  rows: Array<any>;

  constructor(
    private loadCtrl: LoadingController,
    private sqlite: SQLite
  ) {
    console.log("teste");
    //this.loadInv();
  }

  private loadInv() {
    let load = this.loadCtrl.create({content: 'Carregando...'});
    load.present();
    this.sqlite.create({name: 'inv.db', location: 'default'}).then(db => {
      db.executeSql('SELECT * FROM inventario WHERE sincronizado = 0', []).then(rs => {
        for(let i=0; i < rs.rows.length; i++) {
          this.rows.push(rs.rows.item(i));
        }
        load.dismiss();
      });
    });
  }

}
