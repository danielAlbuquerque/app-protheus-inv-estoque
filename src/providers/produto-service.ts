import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ProdutoService {

  constructor(public http: Http) {
    
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
