import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import 'rxjs/add/operator/map';

@Injectable()
export class ProdutoService {

  private db_name: string = "inv.db";

  constructor(public http: Http, private sqlite: SQLite ) {
    
  }

  salvarInv(data) {
    return new Promise((resolve, reject) => {
      if(isNaN(data.qtd2)) {
        data.qtd2 = 0;
      }
      this.sqlite.create({name: this.db_name, location: 'default' }).then(db => {
        db.executeSql('INSERT INTO inventario(filial, sincronizado, codigo, doc, qtd, qtd2, local, endereco, dt) values(?,?,?,?,?,?,?,?,CURRENT_DATE)', [
          data.filial, 0, data.produto, data.doc, data.qtd, data.qtd2, data.local, data.endereco
        ]).then(rs => {
          resolve({success: true});
        }).catch(err => {
          console.log(err);
          reject(err.message);
        });
      });
    });
  }

  sync(id) {
    return new Promise((resolve, reject) => {
      this.sqlite.create({name: this.db_name, location: 'default'}).then(db => {
        db.executeSql('SELECT * FROM inventario WHERE id = ?', [id]).then(rs => {
          let data = {
            filial: rs.rows.item(0).filial,
            produto: rs.rows.item(0).codigo,
            doc: rs.rows.item(0).doc,
            qtd: rs.rows.item(0).qtd.toString(),
            qtd2: rs.rows.item(0).qtd2.toString(),
            local: rs.rows.item(0).local,
            endereco: rs.rows.item(0).endereco
          };
          console.log(data);
          let url = localStorage.getItem('URL_SERVIDOR');
          if(url == null) {
            reject("Servidor não configurado");
          } else{
            let headers = new Headers();
            let token = localStorage.getItem('token');
            headers.append("Authorization", "Basic " + token);
            headers.append("Content-Type", "application/json");
            this.http.post(url + '/RECEBEDADOSINV/', data, {headers: headers})
            .map(rs => rs.json())
            .timeout(20000)
            .subscribe(response => {
              console.log(response);
              this.sqlite.create({name: this.db_name, location: 'default'}).then(db => {
                db.executeSql('UPDATE inventario SET sincronizado = 1 where id = ?', [id]).then(() => {
                  resolve(response);
                });
              });
            }, err => {
              reject(err);
            });
          }
        });
      });
    });
  }


  findByCod(code: string) {
    console.log("findByCod:", code);
    return new Promise((resolve, reject) => {
      this.sqlite.create({name: this.db_name, location: 'default' }).then(db => {
        db.executeSql("SELECT * FROM produtos WHERE codigo = ?", [code.trim()]).then(result);
        function result(rs) {
          console.log(rs.rows);
          if(rs.rows.length > 0) {
            resolve({
              codigo: code,
              descricao: rs.rows.item(0).descricao,
              tipo: rs.rows.item(0).tipo,
              locpad: rs.rows.item(0).locpad
            });
          } else {
            reject("Produto não encontrado");
          }
        }
      });
    });
  }

  getProd(cod_produto) {
    return new Promise((resolve, reject) => {
      let url = localStorage.getItem('URL_SERVIDOR');
      if(url == null) {
        reject("Servidor não configurado");
      } else {
        let headers = new Headers();
        let token = localStorage.getItem('token');
        headers.append("Authorization", "Basic " + token);
        this.http.get(url + '/consultaproduto/' + cod_produto, {headers: headers})
        .map(rs => rs.json())
        .timeout(20000)
        .subscribe(response => {
          console.log(response);
          resolve(response);
        }, err => {
          console.log(err);
          if(err.status == 404) {
            reject("O produto " + cod_produto + " não foi encontrado");
          } else{
            reject("Não foi possível buscar o produto, tente novamente mais tarde");
          }
        });
      }
    });
  }
}
