import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import 'rxjs/add/operator/map';

@Injectable()
export class ProdutoService {

  private db: SQLiteObject;

  constructor(public http: Http, private sqlite: SQLite ) {
    this.sqlite.create({name: 'siga.db' }).then(db => this.db = db );
  }


  salvarInv(data) {
    return new Promise((resolve, reject) => {
      let url = localStorage.getItem('URL_SERVIDOR');
      if(url == null) {
        reject("Servidor não configurado");
      } else{
        let headers = new Headers();
        let token = localStorage.getItem('token');
        headers.append("Authorization", "Basic " + token);
        this.http.post(url + '/RECEBEDADOSINV/', data, {headers: headers})
        .map(rs => rs.json())
        .timeout(20000)
        .subscribe(response => {
          console.log(response);
          resolve(response);
        }, err => {
          reject(err);
        });
      }
    });
  }

  findByCod(code: string) {
    console.log("findByCod:", code);
    return new Promise((resolve, reject) => {
      this.sqlite.create({name: 'siga.db', location: 'default' }).then(db => {
        db.executeSql("SELECT * FROM produtos WHERE codigo = ?", [code]).then(result);
        function result(rs) {
          console.log(rs.rows);
          if(rs.rows.length > 0) {
            resolve({
              codigo: code,
              descricao: rs.rows.item(0).descricao
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
