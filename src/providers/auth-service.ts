import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

@Injectable()
export class AuthService {
  private url_service: string;

  constructor(public http: Http) {
    
  }

  login(usr, pass) {
    return new Promise((resolve, reject) => {    
      this.url_service = localStorage.getItem('URL_SERVIDOR');
      if(this.url_service != null) {
        let token = btoa(usr+':'+pass);
        let headers = new Headers();
        headers.append("Authorization", "Basic " + token);

        this.http.get(this.url_service + '/check_security', {headers: headers})
        .map(res => res.json())
        .timeout(20000)
        .subscribe(response => {
          localStorage.setItem('token', token);
          resolve({success: true, token: token});
        }, err => {
          console.log(err);
          if(err.status == 401) {
            reject("Acesso negado");
          } else {
            reject("Ocorreu um erro ao processar a requisição, tente novamente mais tarde");
          }
            
        });
      } else {
        reject("Servidor não configurado");
      }
    });
  }

}
