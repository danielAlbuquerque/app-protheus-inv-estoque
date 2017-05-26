import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import {Observable} from 'rxjs/Observable';



@Injectable()
export class CargaService {
  private url_service: string;
  private headers: Headers;
  private db_name: string = "siga.db";

  constructor(
    public http: Http,
    private sqlite: SQLite
  ) {
    this.url_service = localStorage.getItem('URL_SERVIDOR');
    this.headers = new Headers();
    let token = localStorage.getItem('token');
    this.headers.append("Authorization", "Basic " + token);
  }

  initCarga() {
    return new Promise((resolve, reject) => {
      this.createDB().then((res) => {
        
        Observable.forkJoin(
          this.http.get(this.url_service + '/filiais', {headers: this.headers}).map(res => res.text()),
          this.http.get(this.url_service + '/enderecos', {headers: this.headers}).map(res => res.text()),
          this.http.get(this.url_service + '/produtos', {headers: this.headers}).map(res => res.text())
        ).subscribe(res => {
          console.log("Requisição completa");
          Promise.all([
            this.populateFiliais(res[0]),
            this.populateEnderecos(res[1]),
            this.populateProdutos(res[2])
          ]).then(res => {
            resolve({success: true});
          }).catch(err => {
            console.log(err);
            reject("Ocorreu erro ao popular a base de dados");
          });
        }, err => {
          console.log(err);
          reject("Erro ao buscar os dados do servidor");
        });
      }).catch(err => {
        reject(err);
      })
    });
  }

  private createDB() {
    return new Promise((resolve, reject) => {
      this.sqlite.create({
        name: this.db_name,
        location: 'default'
      }).then((db: SQLiteObject) => {

        Promise.all([
          db.executeSql("CREATE TABLE IF NOT EXISTS filiais(id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(50), cod_filial VARCHAR(10), filial VARCHAR(100))", {}),
          db.executeSql("CREATE TABLE IF NOT EXISTS enderecos (id INTEGER PRIMARY KEY AUTOINCREMENT, filial VARCHAR(10), local VARCHAR(50), endereco VARCHAR(50))", {}),
          db.executeSql("CREATE TABLE IF NOT EXISTS produtos (id INTEGER PRIMARY KEY AUTOINCREMENT, filial VARCHAR(10), codigo VARCHAR(50), descricao VARCHAR(50))", {}),
          db.executeSql("CREATE TABLE IF NOT EXISTS inventario (id INTEGER PRIMARY KEY AUTOINCREMENT, filial VARCHAR(10), sincronizado INTEGER, codigo VARCHAR(50), doc VARCHAR(20), qtd REAL, qtd2 REAL, local VARCHAR(50), endereco VARCHAR(50), dt DATE)", {})
        ]).then(() => {
          console.log("Tabelas criadas com sucesso");
          resolve({success: true});
        }).catch(err => {
          console.log(err);
          reject("Erro ao criar as tabelas do sqlite");
        });
      }).catch(err => {
        console.log(err);
        reject("Erro ao criar o banco de dados");
      });
    });
  }

  private populateFiliais(rows) {
    return new Promise((resolve, reject) => {
      rows = JSON.parse(rows);
      console.log("TOTAL DE FILIAIS: ", rows.length);
      this.sqlite.create({
        name: this.db_name,
        location: 'default'
      }).then(db => {
        db.transaction((tx) => {
          for(let i=0; i<rows.length; i++) {
            tx.executeSql('INSERT INTO filiais(nome, cod_filial, filial) VALUES(?,?,?)', [
              rows[i].nome,
              rows[i].cod_filial,
              rows[i].filial,
            ]);
          }
        }).then(res => {
          resolve(true);
        }).catch(err => {
          console.log(err);
          reject("Falha ao popular a tabela de filiais");
        });
      });

    });
  }

  private populateEnderecos(rows) {
    return new Promise((resolve, reject) => {
      rows = JSON.parse(rows);
      console.log("TOTAL DE ENDERECOES: ", rows.length);
      this.sqlite.create({
        name: this.db_name,
        location: 'default'
      }).then(db => {
        db.transaction((tx) => {
          for(let i=0; i<rows.length; i++) {
            tx.executeSql('INSERT INTO enderecos(filial, local, endereco) VALUES(?,?,?)', [
              rows[i].filial,
              rows[i].local,
              rows[i].endereco,
            ]);
          }
        }).then(res => {
          resolve(true);
        }).catch(err => {
          console.log(err);
          reject("Falha ao popular a tabela de endereços");
        });
      });
      resolve(true);
    });
  }

  private populateProdutos(rows) {
    return new Promise((resolve, reject) => {
      console.log(rows);
      rows = JSON.parse(rows);
      
      console.log("TOTAL DE PRODUTOS: ", rows.length);
      this.sqlite.create({
        name: this.db_name,
        location: 'default'
      }).then(db => {
        db.transaction((tx) => {
          for(let i=0; i<rows.length; i++) {
            console.log(rows[i]);
            tx.executeSql('INSERT INTO produtos(filial, codigo, descricao) VALUES(?,?,?)', [
              rows[i].filial,
              rows[i].codigo,
              rows[i].descricao,
            ]);
          }
        }).then(res => {
          console.log(res);
          db.executeSql('select * from produtos', []).then(data => {
            console.log(data.rows);
          });
          resolve(true);
        }).catch(err => {
          console.log(err);
          reject("Falha ao popular a tabela de produtos");
        });
      });
    });
  }
}
